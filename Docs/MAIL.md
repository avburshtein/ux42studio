# Почта: адреса, маршрутизация и что делать, чтобы письма доходили

> Канонический документ по почте проекта. Аудит: 30.09.2026.
> Код отправки писем — `src/lib/email/` (см. `Docs/EMAIL.md` про провайдера).
> Адреса в коде — `src/lib/contact.ts` (единый источник правды).

## 1. Состояние почты

**Настроено 30.09.2026.** Cloudflare Email Routing включён, оба адреса
пересылаются на один ящик (`av.burshtein@gmail.com`):

```bash
$ dig MX ux42.studio
ux42.studio. 3600 IN MX 21 route1.mx.cloudflare.net.
ux42.studio. 3600 IN MX 45 route3.mx.cloudflare.net.
ux42.studio. 3600 IN MX 91 route2.mx.cloudflare.net.

$ dig TXT ux42.studio
ux42.studio. 3600 IN TXT "v=spf1 include:_spf.mx.cloudflare.net ~all"
```

Правила маршрутизации:

| Адрес | Действие |
| --- | --- |
| `hello@ux42.studio` | forward → av.burshtein@gmail.com |
| `privacy@ux42.studio` | forward → av.burshtein@gmail.com |
| все остальные (catch-all) | drop (выключено — так и должно быть) |

До настройки MX-записей не было, поэтому письма на эти адреса
не доставлялись вообще — при том что оба адреса были опубликованы в
политиках (Privacy Policy, Terms of Use) и в исходящих письмах платформы
как канал поддержки.

> ### ⚠️ SPF: при настройке Resend записи нужно объединить
>
> Cloudflare Email Routing уже записал SPF для домена. Resend при
> верификации домена **добавит свою запись**. Две TXT-записи `v=spf1`
> на одном домене — это `permerror`: почтовые серверы отбрасывают такие
> письма, то есть сломаются и пересылка, и отправка писем платформы.
>
> Правильно — одна запись с обоими `include`:
>
> ```bash
> dig TXT ux42.studio
> # было:  v=spf1 include:_spf.mx.cloudflare.net ~all
> # стало: v=spf1 include:_spf.mx.cloudflare.net include:<resend> ~all
> ```
>
> Если Resend покажет «MX record found» вместо добавления SPF-записи —
> это нормально: DKIM он ставит через CNAME, а SPF нужно дописать
> в существующую запись вручную.

## 2. Карта адресов

| Адрес | Кто такой | Где используется в коде | Куда уходит |
| --- | --- | --- | --- |
| `hello@ux42.studio` | Публичный контакт студии | Кнопки «Send an email» / «Say hi» (`CtaSection`, `PlatformBenefitsSection` → модалка `ContactDialog`, фолбэк `mailto:`), значение по умолчанию для контактов в настройках дизайнера (`mainPageContent.cta.emailAddress`), Terms of Use §LSSI Art. 10 | Email Routing → av.burshtein@gmail.com |
| `privacy@ux42.studio` | Контролёр ПДн | Privacy Policy и Terms of Use (много мест), все письма платформы: приглашение (`email/templates.ts`), подтверждение регистрации, подсказка в форме регистрации и в разделе удаления профиля | Email Routing → av.burshtein@gmail.com |
| `no-reply@ux42.studio` | Отправитель писем платформы | `EMAIL_FROM` в `wrangler.toml`, `SENDER_EMAIL` в `src/lib/contact.ts` | Отправка через Resend (домен в Resend ещё не верифицирован) |

Проверка, что пересылка настроена (состояние задокументировано в §1):

```bash
dig MX ux42.studio             # route1/2/3.mx.cloudflare.net
dig TXT ux42.studio            # v=spf1 include:_spf.mx.cloudflare.net ~all
```

## 3. Как устроена обратная связь сейчас

Кнопки контакта («Send an email» на `/`, «Say hi» на `/platform` и в
блоке выгод, кнопка на странице дизайнера) **открывают модалку с формой**
— `ContactDialog` (`src/components/ContactDialog.tsx`). Сайт сам отправляет
письмо через серверный экшн `sendContactMessage`
(`src/lib/actions/contact.ts`):

1. zod-валидация — схема `src/lib/contactForm.ts`, общая клиенту и серверу;
2. **honeypot** — скрытое поле `website_url` (`display:none`, без label, имя нейтральное): бот получает «успех», письмо
   не уходит и не пишется в БД;
3. **rate limit** — 3 обращения в час с одного IP (таблица
   `contact_messages`: IP хэшируется с солью, ретеншен 7 дней);
4. **получатель** — адрес дизайнера из его настроек или `hello@`; адрес
   НЕ приходит с клиента, иначе форма превращается в открытое почтовое
   реле;
5. письмо уходит через Resend/Cloudflare c **Reply-To на посетителя**,
   результат пишется в `contact_messages` (`status`, `message_id`).

Внутри модалки — строка «Prefer email?» с `mailto:`-фолбэком на тот же
адрес: если отправка не настроена или не удалась, посетитель видит адрес
и пишет напрямую. Ошибка отправки **никогда не проглатывается** —
экшн возвращает понятное сообщение с адресом.

Письмо-уведомление студии — `buildContactEmail` в
`src/lib/email/templates.ts` (тема «Новое обращение с сайта — {имя}»).

Форма начинает реально отправляться только после настройки Resend
(`RESEND_API_KEY`, §4) — до этого показывается фолбэк-адрес.
Миграция таблицы: `drizzle/20261005000000_add_contact_messages/`.

## 4. Как было настроено (выполнено 30.09.2026)

Входящая почта: **Cloudflare Email Routing** — бесплатен на любом тарифе,
письма пересылаются на обычный ящик (Gmail/Outlook), отправка с домена для
этого не нужна.

1. **Cloudflare Dashboard → ux42.studio → Email → Email Routing → Get started**
   Cloudflare сам добавит 3 MX-записи и TXT-запись SPF.
2. **Destination addresses → Add destination address** — добавить почту,
   которая должна получать письма (нужно подтверждение по ссылке из
   письма; без него маршруты не создать).
3. **Routing rules → Create custom address** — два правила:
   * `hello` → на адрес получателя;
   * `privacy` → на тот же адрес.

   По желанию — `postmaster` и `abuse` на тот же адрес (RFC 5321 требует,
   чтобы домен принимал эти служебные адреса; для нашей пересылки это
   необязательно, но выглядит аккуратно).

Исходящая почта: **Resend** (см. `Docs/EMAIL.md`) — там же добавляются
DKIM/SPF-записи для `no-reply@ux42.studio`.

> **Совместимость:** Email Routing меняет только MX (входящие). Отправка
> через Resend использует TXT-записи (SPF/DKIM), поэтому эти две системы
> не конфликтуют и работают вместе.

## 5. Как проверить

Пересылка уже задокументирована в §1; здесь — ручная проверка:

```bash
# 1. MX на месте (Cloudflare)
dig MX ux42.studio

# 2. Живое письмо: отправить с любого ящика на hello@ux42.studio
#    и дождаться пересылки в av.burshtein@gmail.com (обычно 1–5 минут)
```

## 6. Правило для кода

Адреса в коде берутся из `src/lib/contact.ts`:

```ts
import { CONTACT_EMAIL } from '@/lib/contact';

emailHref={`mailto:${CONTACT_EMAIL.hello}`}
```

В политиках (`src/lib/privacyContent.ts`, `src/lib/termsContent.ts`) адреса
остались литералами: это редакционный текст, который правит владелец, и
подстановка константы туда ломала бы юридический документ. Правило: если
меняется адрес в политике — менять его и в `src/lib/contact.ts`, иначе
письма будут уходить не туда, куда обещает сайт.

## 7. Что ещё стоит сделать (не блокеры)

* **DMARC.** После того как Resend добавит SPF и DKIM, стоит завести
  `_dmarc.ux42.studio` (`v=DMARC1; p=none; rua=mailto:…`) — иначе
  письма-приглашения чаще попадают в «Спам», а их доставляемость нечем
  измерить.
* **Форма обратной связи** вместо голых `mailto:` (см. §3) — заметно
  поднимет конверсию с мобильных, а с испанской аудиторией (основная
  по Cloudflare-аналитике) это заметная доля трафика.
* **Письмо-подтверждение адреса** при регистрации: адрес вводит
  пользователь, и сейчас никто не проверяет, что он существует и
  принадлежит человеку (GDPR Art. 4.7).