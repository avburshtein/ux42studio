# UX42 Studio & Portfolio Platform

[English](README.en.md) | Русский

Мультиарендная платформа портфолио для дизайнеров на Next.js + Cloudflare (D1, R2, Workers).

## Стек

- **Фронтенд:** Next.js (App Router, Server Actions)
- **БД:** Cloudflare D1 + Drizzle ORM
- **Хранилище:** Cloudflare R2
- **Стили:** Tailwind CSS v4 + дизайн-токены на CSS-переменных (seed: `#0B6E4F`)
- **Деплой:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Команда и зоны ответственности

| Кто | Зона ответственности |
| --- | --- |
| **Alex** ([@avburshtein](https://github.com/avburshtein)) | Верстка и дизайн-система: публичные страницы (`/`, `/platform`, личная страница дизайнера `/u/[slug]`, кейс и его TL;DR/PDF), компоненты `src/components/portfolio/*` и `src/components/case/*`, дизайн-токены и стили (`src/app/globals.css`, `src/tokens.md`), UI-спеки компонентов (`Docs/ui/`), UI админки (редактор профиля, визард кейса, видимость секций, TL;DR/PDF). Ветки: `verstka`, `token`, `cursor/*` |
| **Denis Zakharchenko** (<den.zakh@gmail.com>) | Бэкенд и платформа: аутентификация (`src/middleware.ts`, `src/lib/jwt.ts`, `/api/auth`), Server Actions (`src/lib/actions/`), схема БД и миграции (D1 + Drizzle), ядро админ-панели и суперадмина (`/admin`, `/super-admin`), загрузка файлов в R2, конфигурация Cloudflare/Next.js |

> Активная разработка: август — октябрь 2026 (ветка `verstka`, 115+ коммитов после последнего мержа в `main`). UI-слой админки (редактор главной страницы) поверх бэкенда — Alex; серверная часть и ядро админки — Denis (последняя активность — 24.08.2026).

## Ветки

- **`main`** — стабильная ветка, точка интеграции (PR из `verstka`; последний мерж — 24.08.2026). Отстаёт от `verstka` на 115+ коммитов.
- **`verstka`** — активная разработка UI (Alex), периодически вливается в `main` через PR.
- **`token`**, **`cursor/case-page-surface-tokens`**, **`cursor/agent-docs-and-guidelines`** — исторические ветки Alex (дизайн-токены, токены страницы кейса, документация для агентов), полностью влиты в `main`.

## Что нового в `verstka` (сентябрь — октябрь 2026)

- **Главная дизайнера и страница кейса** — полная перестройка по Figma-спекам (`Docs/ui/`), адаптивная мобильная версия, карусель галереи, хедер с меню-панелью и хэш-навигацией.
- **Контент главной из БД** — редактор «Main Page Content» в `/admin/profile` (секции, галерея, соцсети, OG-обложка, favicon); `/u/[slug]` рендерит контент из D1.
- **Кастомизация темы** — seed-based цветовая тема (палитра строится из одного цвета-источника), настраиваемые хедер (transparent/solid) и фон страницы, настраиваемые floating elements с live-превью.
- **SEO-контур** — favicon, `robots.txt` + sitemap из D1, `generateMetadata` кейсов, Open Graph (og-cover 1200×630), noindex для админок/auth, 404-страница.
- **Разделение аудиторий** — главная `/` принадлежит студии (Hero → кейсы основателя → Approach → Studio → CTA), промо платформы для дизайнеров живёт на `/platform` (бенефиты → 3 шага → живой пример), личная страница — на `/u/[slug]`. Профиль студии задаётся переменной `STUDIO_PROFILE_SLUG`.
- **Кейс: TL;DR и PDF** — короткая версия кейса для hiring manager (`/u/[slug]/[projectSlug]/short`) с share-кнопками и кнопкой «Скачать PDF» (print-CSS, `?print=1`, светлая тема при печати).
- **Галерея кейса** — выбор раскладки (editorial / masonry / justified) и лайтбокс.
- **Видимость секций кейса** — чекбоксы в визарде (шаг Review) поверх авто-скрытия пустых секций, номера секций перенумеровываются на публичной странице.
- **Админка** — кадрирование изображений перед загрузкой (аватар, обложка, About, OG, favicon), раздельные кнопки Save и Save & Next на шагах визарда, ручная/авто сортировка кейсов (`profiles.case_sort_mode`), переключатель светлой и тёмной темы в приватной зоне, раздел «Настройки профиля» (`/admin/settings`).
- **Контактная форма** — модалка вместо `mailto:` (открывается из hero, хедера и Approach), таблица `contact_messages`, honeypot против спама, ответы-письма и журнал обращений; единый источник контактов `src/lib/contact.ts` + аудит почты в `Docs/MAIL.md` (Email Routing на `hello@ux42.studio`).
- **Legal** — `/privacy` и `/terms` (EN + ES), микрораздел cookies, данные контактной формы в EN+ES, удаление аккаунта по GDPR Art. 17, инвайт-письма и смены пароля.
- **Доступность** — Lighthouse Accessibility 100/100 (desktop/mobile × light/dark), глобальный `prefers-reduced-motion`, 2px-индикаторы фокуса внутри полей, контраст по WCAG для компонентов.
- **Видимость сайта** — тумблер «Публикация сайта» скрывает страницу дизайнера (`/admin/settings`).
- **Документация** — канонический документ по дизайн-системе (`Docs/design-system.md` + `Docs/figma-tokens.md`), спеки (`Docs/specs/`, `Docs/ui/`), брифы (`Docs/roadmap/`, `Docs/ds-chat-brief.md`), почта (`Docs/MAIL.md`), снимок аналитики домена (`Docs/ANALYTICS.md`).

## Страницы

| Путь | Что это |
| --- | --- |
| `/` | Главная студии: Hero → кейсы → Approach → Studio → CTA |
| `/platform` | Промо платформы для дизайнеров: бенефиты → 3 шага → живой пример |
| `/u/[slug]` | Личная страница дизайнера (контент из D1) |
| `/u/[slug]/[projectSlug]` | Кейс: секции + видимость, галерея с раскладками, лайтбокс |
| `/u/[slug]/[projectSlug]/short` | TL;DR-версия кейса для hiring manager (+ PDF) |
| `/privacy`, `/terms` | Legal-документы (EN + ES) |
| `/admin`, `/super-admin` | Приватная зона (аутентификация, визард кейсов, редактор профиля) |

## Проверка

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run check       # оба сразу
npm run verify      # check + smoke-тест
```

**Smoke-тест сайта** — 45 проверок работающего сайта (страницы, разделение
аудиторий главной и /platform, юридические документы, robots/sitemap/манифест,
защитные заголовки, закрытость админок, доступность базы). Сервер должен быть
уже запущен:

```bash
npm run dev            # в одном окне
npm run smoke          # в другом

# со страницами дизайнера и кейса:
PROFILE_SLUG=aleksandra-burshtein PROJECT_SLUG=clinical-workflow-automation npm run smoke

# проверка прода после деплоя:
npm run smoke:prod
```

Код возврата `0` — всё в порядке, `1` — есть поломки. Подробности: `Docs/DEPLOY.md`.

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
