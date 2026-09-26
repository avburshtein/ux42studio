# Деплой ux42studio

> Актуальная инструкция для этого репозитория: Next.js 16 + Cloudflare
> Workers через `@opennextjs/cloudflare`, домен `ux42.studio`.
>
> ⚠️ `Docs/make-export/DEPLOY.md` — инструкция для **другого** проекта
> (Vite + Vercel/Netlify/GitHub Pages). Для ux42studio она не применяется.

## 0. Как это работает

```
Next.js (App Router)  ──build──>  .open-next/  ──deploy──>  Cloudflare Worker
                                        │                          │
                                   assets (static)          D1 (DB) + R2 (files)
```

Конфигурация: `wrangler.toml` (worker, биндинги `DB`/`MY_BUCKET`, маршрут
`ux42.studio` как custom domain), `open-next.config.ts` (адаптер),
`next.config.ts` (инициализация локальной эмуляции D1/R2 для `next dev`).

## 1. Переменные окружения

| Переменная | Где | Обязательна | Комментарий |
| --- | --- | --- | --- |
| `JWT_SECRET` | Cloudflare Secret | **да** | Подпись JWT для middleware. Утечка = полный обход авторизации |
| `ADMIN_EMAIL` | Cloudflare Secret | только при инициализации | Одноразовый `/api/auth/init`, потом удалить |
| `ADMIN_PASSWORD` | Cloudflare Secret | только при инициализации | То же |

Локально — `.dev.vars` (шаблон: `.dev.vars.example`, в `.gitignore`).

```bash
npx wrangler secret put JWT_SECRET
```

> Секреты **никогда** не кладутся в `.env.local`, который может попасть
> в репозиторий, и тем более в клиентский бандл.

## 2. Локальная разработка

```bash
npm install
cp .dev.vars.example .dev.vars     # заполнить значения
npm run dev                        # http://localhost:3000, D1/R2 эмулируются
```

## 3. Продакшен-деплой

```bash
npm run check                      # tsc --noEmit + eslint (обязательно)
npm run deploy                     # opennextjs-cloudflare build && deploy
```

Или по шагам:

```bash
npx opennextjs-cloudflare build    # сборка в .open-next/
npx wrangler deploy                # публикация в Cloudflare
```

### Миграции D1

```bash
npm run db:migrate:remote          # применить к продакшен-БД
npm run db:seed:remote             # сид (категории, цветовые роли)
```

> Миграции применяются **до** деплоя нового кода: если код ждёт новую
> колонку, а её нет — публичные страницы упадут на 500.

## 4. Создание первого суперадмина (один раз)

```bash
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
curl -X POST https://ux42.studio/api/auth/init
npx wrangler secret delete ADMIN_EMAIL   # сразу после успеха
npx wrangler secret delete ADMIN_PASSWORD
```

Эндпоинт срабатывает один раз; повторный вызов вернёт `403`.
`JWT_SECRET` не удалять.

## 5. Проверка после деплоя

- [ ] `https://ux42.studio` открывается, тема переключается
- [ ] `https://ux42.studio/privacy` и `/terms` — EN + ES, футер со ссылками
- [ ] `https://ux42.studio/robots.txt` и `/sitemap.xml` отдаются, в sitemap есть `/`
- [ ] `/manifest.webmanifest` отдаётся (PWA-манифест)
- [ ] `https://ux42.studio/api/health` → `200`, D1 и R2 доступны
- [ ] `/login` открывается, `/admin` без токена → редирект на `/login`
- [ ] Заголовки: `Strict-Transport-Security`, `X-Content-Type-Options`,
      `Referrer-Policy`, и **нет** `X-Powered-By`
- [ ] `curl -I https://ux42.studio | grep -i powered-by` → пусто
- [ ] Страница кейса `/u/<slug>/<project>` открывается, галерея грузится
- [ ] PDF-версия кейса (`/u/<slug>/<project>/short?print=1`) печатается

## 6. Откат

```bash
npx wrangler deployments list               # найти предыдущий
npx wrangler rollback <deployment-id>
```

Откат кода **не** откатывает миграции D1 — они только добавляющие.
Схема должна оставаться обратно совместимой.

## 7. Известные ограничения

### CSP не задан

В `next.config.ts` выставлены security-заголовки, кроме Content-Security-Policy.
Причина: строгий nonce-CSP конфликтует с инлайн-скриптом выбора темы в
`src/app/layout.tsx` и с inline-скриптами Next. Варианты:

1. Оставить как есть (текущее состояние) — приемлемо для read-only сайта.
2. Ввести nonce через `proxy.ts`/middleware и убрать инлайн-скрипт темы
   в отдельный файл `/theme-init.js` с `nonce`.
3. Использовать `'unsafe-inline'` только для `script-src` — слабее, но
   совместимо. Требует ручного аудита всех инлайн-скриптов.

### PWA-иконки

Манифест ссылается на `icon.svg` (64×64) и `og-cover.png` (1200×630).
Отдельных PNG 192×192 и 512×512 нет — браузеры без них просто не показывают
install-промпт, страница при этом работает нормально.

### Версии зависимостей

`next` — 16.1.5, но `eslint-config-next` — 15.4.6. Линтинг работает, но
правила из 16-й версии не применяются. Стоит выровнять при следующем
обновлении: `npm i -D eslint-config-next@16`.

## 8. Стоимость

Cloudflare Free Tier покрывает текущие объёмы: D1, R2 и Workers
на бесплатных лимитах, исходящий трафик Workers не тарифицируется
(нет egress fees). Платить нужно только за домен.
