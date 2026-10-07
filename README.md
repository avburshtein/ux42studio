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
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Верстка и дизайн-система: публичные страницы (главная дизайнера, страницы кейсов, страницы услуг), доменные/брендовые токены, документация UI, mobile-first UX. |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Бэкенд и платформа: аутентификация (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions`), вероятный слой бэкенда для админки и контента, интеграция с Cloudflare D1/R2. |

> Активная разработка велась с августа по сентябрь 2026. UI-слой админки (редактор главной страницы) поверх бэкенда и связанного контента частично проработан, основной фокус — переход к продуктовой ветке `main` и интеграция с админ-экспериментами.

## Ветки

- **`main`** — стабильная ветка, точка интеграции (PR из `verstka`).
- **`verstka`** — активная разработка UI (Alex), периодически вливается в `main` через PR.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — исторические ветки Alex (дизайн-токены, токены страницы кейса, инфраструктура документации и агентских правил).

## Что нового в `verstka` (сентябрь 2026)

- **Главная дизайнера и страница кейса** — полная перестройка по Figma-спекам (`Docs/ui/`), адаптивная мобильная версия, единый контентный слой. 
- **Контент главной из БД** — редактор «Main Page Content» в `/admin/profile` (секции, галерея, соцсети, OG-обложка, favicon); `/u/[slug]` читает содержимое из базы. 
- **Кастомизация темы** — M3 seed-based цветовая тема, настраиваемые хедер (transparent/solid) и фон страницы, настраиваемые темы для карточек и CTA. 
- **SEO-контур** — favicon, `robots.txt` + sitemap из D1, `generateMetadata` кейсов, Open Graph (og-cover 1200×630), noindex для админок/auth, 404-страница. 
- **Legal** — `/privacy` и `/terms` (EN + ES), микрораздел cookies. 
- **Доступность** — Lighthouse Accessibility 100/100 (desktop/mobile × light/dark).

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

## 📝 Лицензия

Этот проект распространяется под лицензией [BSD 3-Clause](./LICENSE).

Разрешено использовать, копировать, изменять и распространять проект, но необходимо сохранять уведомление об авторских правах и условия лицензии. Запрещено использовать имя автора в рекламных материалах без письменного разрешения.

## 👨‍💻 Автор

Aleksandra Burshtein. Создано с помощью Figma Make

## Лицензия
Этот проект распространяется под лицензией Apache License 2.0 (./LICENSE).

Авторские права принадлежат avburshtein, 2026 год.

Вы можете использовать, копировать, изменять и распространять программное обеспечение в соответствии с условиями лицензии Apache License 2.0.
Лицензия включает патентную защиту и требует сохранения уведомлений об авторских правах и лицензии в исходных дистрибутивах.
