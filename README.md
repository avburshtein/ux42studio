# UX42 Studio & Portfolio Platform

[English](README.en.md) | Русский

Мультиарендная платформа портфолио для дизайнеров на Next.js + Cloudflare (D1, R2, Workers).

## Стек

- **Фронтенд:** Next.js (App Router, Server Actions)
- **БД:** Cloudflare D1 + Drizzle ORM
- **Хранилище:** Cloudflare R2
- **Стили:** Tailwind CSS v4 + Material Design 3 (seed: `#0B6E4F`)
- **Деплой:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Команда и зоны ответственности

| Кто | Зона ответственности |
| --- | --- |
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Верстка и дизайн-система: публичные страницы (главная дизайнера, страница кейса), компоненты `src/components/portfolio/*` и `src/components/case/*`, дизайн-токены и стили (`src/app/globals.css`, `src/tokens.md`), UI-спеки компонентов (`Docs/ui/`), UI редактора контента в `/admin/profile`. Ветки: `verstka`, `token`, `cursor/*` |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Бэкенд и платформа: аутентификация (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions/`), схема БД и миграции (D1 + Drizzle), ядро админ-панели и суперадмина (`/admin`, `/super-admin`), загрузка файлов в R2, конфигурация Cloudflare/Next.js |

> Активная разработка велась с августа по сентябрь 2026. UI-слой админки (редактор главной страницы) поверх бэкенда — Alex; серверная часть и ядро админки — Denis.

## Ветки

- **`main`** — стабильная ветка, точка интеграции (PR из `verstka`).
- **`verstka`** — активная разработка UI (Alex), периодически вливается в `main` через PR.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — исторические ветки Alex (дизайн-токены, токены страницы кейса, документация для агентов), полностью влиты в `main`.

## Разработка

```bash
npm run dev        # Next.js dev server
npm run preview    # Локальный Cloudflare runtime
npm run deploy     # Деплой в Cloudflare
```

## Создание первого суперадмина

### Локально

1. Создай `.dev.vars` с переменными:

    ```
    ADMIN_EMAIL=admin@ux42.studio
    ADMIN_PASSWORD=your-secure-password
    JWT_SECRET=your-secret-key
    ```

2. Запусти `npm run dev` и вызови:
    ```bash
    curl -X POST http://localhost:3000/api/auth/init
    ```

### Продакшен

1. Установи секреты в Cloudflare:

    ```bash
    npx wrangler secret put ADMIN_EMAIL
    npx wrangler secret put ADMIN_PASSWORD
    npx wrangler secret put JWT_SECRET
    ```

2. Задеплой и вызови **один раз**:

    ```bash
    curl -X POST https://ux42.studio/api/auth/init
    ```

3. **Сразу после успешного ответа** удали секреты:

    ```bash
    npx wrangler secret delete ADMIN_EMAIL
    npx wrangler secret delete ADMIN_PASSWORD
    ```

    `JWT_SECRET` не удаляй — он нужен для работы middleware.

4. Войди под созданным админом в `/super-admin`. Чтобы назначить других админов: `/super-admin/users` → «Set Admin».

> **Важно:** эндпоинт `/api/auth/init` срабатывает только один раз. Повторный вызов вернёт `403 Forbidden`.
