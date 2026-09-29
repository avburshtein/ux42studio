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

### Почему это не пожелание, а необходимость

`@opennextjs/cloudflare` при сборке вызывает `extractProjectEnvVars()`
(`dist/cli/utils/extract-project-env-vars.js`): он читает `.env`, `.env.{mode}`,
`.env.local` и `.env.{mode}.local` и записывает их значения в
`.open-next/cloudflare/next-env.mjs`, откуда они уезжают в **задеплоенный
воркер**. Проверено на практике: `CLOUDFLARE_D1_TOKEN` и `JWT_SECRET` из
`.env.local` оказывались в бандле.

Поэтому `npm run deploy` (и `build:cf` / `upload` / `preview`) идут через
`scripts/build-cloudflare.mjs`, который на время сборки убирает env-файлы, а
после сборки возвращает их на место. Проверка после сборки:

```bash
cat .open-next/cloudflare/next-env.mjs   # должно быть три экспорта: {} {} {}
grep -c "cfut_" .open-next/worker.js     # должно быть 0
```

Флаг `--with-env` (только для локальной отладки) оставляет env-файлы на месте —
для прода его использовать нельзя.

## 2. Локальная разработка

```bash
npm install
cp .dev.vars.example .dev.vars     # заполнить значения
npm run dev                        # http://localhost:3000, D1/R2 эмулируются
```

## 3. Проверка перед деплоем

```bash
npm run check   # tsc --noEmit + eslint — ошибки в коде
```

Дополнительно — smoke-тест (сайт должен быть уже запущен):

```bash
npm run dev                                      # в одном окне
npm run smoke                                    # в другом
```

Полная проверка со страницами дизайнера и кейса:

```bash
PROFILE_SLUG=aleksandra-burshtein \
PROJECT_SLUG=clinical-workflow-automation \
npm run smoke
```

Что делает `scripts/smoke-test.mjs` (33 проверки, без внешних зависимостей):

| Раздел | Что проверяет |
| --- | --- |
| 1. Основные страницы | `/`, `/login`, `/register`, страница дизайнера, кейс, PDF-версия; язык страницы (`lang="en"` / `lang="ru"`) |
| 2. Юридические | `/privacy`, `/terms`, блок AEPD, email контролёра, LSSI Art. 10, домен |
| 3. Файлы, SEO, PWA | `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `icon.png`, `og-cover.png`, заглушка обложки; `Disallow: /admin`; структура карты сайта; ссылка на политику в футере |
| 4. Защита | HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, отсутствие `X-Powered-By` |
| 5. Доступ | `/admin` и `/super-admin` закрыты без входа, `noindex` на приватных страницах, уведомление RGPD в форме, доступность D1 и R2 |

Код возврата: `0` — всё в порядке, `1` — есть поломки (можно использовать в CI).
Проверка прода: `npm run smoke:prod`.
Таймаут запроса настраивается через `SMOKE_TIMEOUT_MS` (по умолчанию 20000).

## 4. Продакшен-деплой

```bash
npm run check                      # tsc --noEmit + eslint (обязательно)
npm run deploy                     # сборка + публикация
```

`npm run deploy` = `npm run build:cf && node scripts/build-cloudflare.mjs deploy`,
то есть ровно то же, что раньше делали `opennextjs-cloudflare build && deploy`,
но через обёртку (см. раздел 1 и раздел 4.1).

Разбить на шаги:

```bash
npm run build:cf                          # только сборка в .open-next/
npx wrangler deploy --dry-run             # проверка бандла без публикации
npx wrangler deploy                       # публикация
```

> Публиковать нужно тем же аккаунтом, в котором лежат D1, R2 и домен.
> `wrangler` берёт `account_id` из `CLOUDFLARE_ACCOUNT_ID` (`.env.local`) —
> если в браузере выполнен `wrangler login` под другим аккаунтом, деплой
> упадёт с `Authentication error [code: 10000]`. Проверка:
> `npx wrangler deployments list` — команда должна показать деплои, а не ошибку.

### 4.1. Сборка на Windows и в путях с кириллицей

На Windows `fs.cpSync()` и `fs.rmSync()` **молча не делают ничего**, если путь
содержит не-ASCII символы (кириллицу в имени папки — `D:\Хранилище\Projects\...`).
Проверено на Node v22.23.3 и v24.13.0: операция завершается без ошибки, но не
копирует и не удаляет ни одного файла. Остальные операции (`mkdir`, `writeFile`,
`read`, `readdir`, `stat`, `copyFile`, `rename`, `unlink`) работают корректно —
ломаются только рекурсивные.

Как это выглядело без обхода:

- `initOutputDir()` копирует скомпилированный `open-next.config.edge.mjs` в
  `.open-next/.build` через `cpSync` → сборка падала с `ENOENT`;
- `createAssets()` так же потерял бы `.next/static` и `public` — то есть в
  воркер уехал бы воркер без CSS/JS;
- `rmSync` не чистил `.open-next`, а `compileEnvFiles()` дописывает блоки в
  `next-env.mjs` через `appendFileSync` — накапливались дубли
  `export const production`, и бандл переставал собираться.

`scripts/cp-sync-polyfill.cjs` подменяет `cpSync` и `rmSync` рекурсивными
реализациями на `copyFileSync` / `unlinkSync` + `rmdirSync` (ASCII-пути при
этом уходят в нативный код). Он подключается из `scripts/build-cloudflare.mjs`
до импорта OpenNext. Отдельный `npm run` для ручного вызова не нужен, но при
желании: `node -r ./scripts/cp-sync-polyfill.cjs <opennext-cli> build`.

Скрипт работает и на Linux/macOS (там нативный код не сломан, патч просто
не вмешивается), так что `npm run deploy` одинаково пригоден на всех
платформах.

### Миграции D1

```bash
npm run db:migrate:remote          # применить к продакшен-БД
npm run db:seed:remote             # сид (категории, цветовые роли)
```

> Миграции применяются **до** деплоя нового кода: если код ждёт новую
> колонку, а её нет — публичные страницы упадут на 500.

> ⚠️ `scripts/apply-migrations.mjs` применяет **все** миграции подряд, каждый
> раз. Он не идемпотентен: `CREATE TABLE` без `IF NOT EXISTS` упадёт на уже
> применённой миграции, а `ALTER TABLE ... ADD COLUMN` — на уже добавленной
> колонке. Запускать его на базе, которая частично мигрирована, нельзя.
>
> Сверить состояние базы с кодом:
>
> ```bash
> export CLOUDFLARE_API_TOKEN=<токен из .env.local: CLOUDFLARE_D1_TOKEN>
> npx wrangler d1 execute ux42-portfolio-db --remote \
>   --command "SELECT name FROM pragma_table_info('projects')"
> ```
>
> и применять только недостающие миграции по одной:
>
> ```bash
> npx wrangler d1 execute ux42-portfolio-db --remote \
>   --file="drizzle/20260916120000_add_case_sorting/migration.sql"
> ```
>
> Бэкап перед миграциями: `npx wrangler d1 export ux42-portfolio-db --remote \
> --output backup.sql`.

## 5. Создание первого суперадмина (один раз)

```bash
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
curl -X POST https://ux42.studio/api/auth/init
npx wrangler secret delete ADMIN_EMAIL   # сразу после успеха
npx wrangler secret delete ADMIN_PASSWORD
```

Эндпоинт срабатывает один раз; повторный вызов вернёт `403`.
`JWT_SECRET` не удалять.

## 6. Проверка после деплоя

Самый быстрый способ — прогнать smoke-тест по проду:

```bash
npm run smoke:prod
```

Он проверяет 33 пункта: страницы, юридические документы, robots/sitemap/манифест,
защитные заголовки, закрытость админок и доступность базы. Если все зелёные —
деплой прошёл успешно.

Ручная проверка глазами:

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

## 7. Откат

```bash
npx wrangler deployments list               # найти предыдущий
npx wrangler rollback <deployment-id>
```

Откат кода **не** откатывает миграции D1 — они только добавляющие.
Схема должна оставаться обратно совместимой.

## 8. Известные ограничения

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

Фавикон — файл `src/app/icon.png` (634×634, RGBA; Next сам отдаёт его как
`/icon.png` и вставляет `<link rel="icon">`). До 29.09.2026 это был
нарисованный `icon.svg` 64×64. Исходник нового PNG лежит в `public/`
(`favicon UX42.png`).

Манифест ссылается на `icon.png` (634×634) и `og-cover.png` (1200×630).
Отдельных PNG 192×192 и 512×512 нет — браузеры без них просто не показывают
install-промпт, страница при этом работает нормально.

**Прозрачность OG-обложки.** Обложка — карточка со скруглёнными углами, то
есть с альфой по углам. Facebook в превью иногда рисует прозрачность чёрным.
Поэтому при замене обложки альфу снимают скриптом (свой мини-энкодер PNG, без
зависимостей) — он кладёт пиксели на цвет страницы `#F7FAF5` и сохраняет
файл в RGB:

```bash
npm run assets:flatten-png -- вход.png public/og/og-cover.png "#F7FAF5"
```

### Версии зависимостей

`next` — 16.1.5, но `eslint-config-next` — 15.4.6. Линтинг работает, но
правила из 16-й версии не применяются. Стоит выровнять при следующем
обновлении: `npm i -D eslint-config-next@16`.

## 9. Стоимость

Cloudflare Free Tier покрывает текущие объёмы: D1, R2 и Workers
на бесплатных лимитах, исходящий трафик Workers не тарифицируется
(нет egress fees). Платить нужно только за домен.
