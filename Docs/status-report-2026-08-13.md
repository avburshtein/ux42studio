# UX42 Portfolio — Сводка по реальному состоянию (13.08.2026)

> Документ-сверка: что реально готово в админке/суперадминке, как закрыты открытые вопросы, отклонения от архитектуры и точечные ответы по схеме БД.

---

## 1. Что реально реализовано

### Аутентификация (auth)

- `POST /api/auth/init` — одноразовая инициализация первого суперадмина (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), блокируется после первого вызова (`403`).
- `POST /api/auth/login` — вход по email+пароль, проверка через PBKDF2, выдача JWT в httpOnly-куке `auth-token` (7 дней).
- `POST /api/auth/register` — регистрация по инвайт-коду, автогенерация пароля (возвращается в ответе), пометка инвайта `usedByUserId`.
- `logout()` (Server Action) — удаляет куку. **Кнопка выхода в лейаутах не заведена.**
- `src/middleware.ts` — защищает `/admin/*` и `/super-admin/*`, пробрасывает `x-user-id`/`x-user-role`. Проверка роли: `/super-admin/*` → только `admin`.

### Админка дизайнера (`/admin/*`)

- **Дашборд `/admin`** — работает: список проектов текущего пользователя, статус, просмотры, дата; кнопки «Создать проект», «Редактировать», «Удалить» (hard-delete). Если профиля нет — редирект на `/admin/profile`.
- **Создание `/admin/projects/new`** — работает: создаёт `draft` с временным slug и редиректит в wizard.
- **Wizard `[id]/edit/`** — 6 шагов, боковой сайдбар (`WizardSidebar`):
    - **general** ✅ — title, slug, teaser, client, year, duration, myRole, constraints, devices, tags, cover (текстовое поле File ID), Figma/Web URL. Сохранение через `updateProjectMeta`. **Категории не выводятся и не сохраняются** (поле `categoryIds` есть только в zod-схеме, UI отсутствует).
    - **problem** ✅ — problemStatement, projectGoal, targetUsers.
    - **research** ✅ — methodology, userStory, personas (до 5), keyMetrics (до 3) через `db.batch()`.
    - **design** ⚠️ частично — visualDirection, displayFont, bodyFont сохраняются. **Color Roles — заглушка** («available in a future update»). Поле `designApproach` есть в форме, но **не передаётся в `updateProjectDesign`** (теряется).
    - **showcase** ✅ — finalDescription, gallery assets (assetType), before/after comparisons через `db.batch()`.
    - **review** ⚠️ частично — keyTakeaway, reviews, nextSteps сохраняются. **Чекбокс «Publish» не подключён**: `updateProjectReview` не меняет `status`/`publishedAt`. Поля results/tools есть в форме, но **не сохраняются нигде**.
- **Профиль `/admin/profile`** ⚠️ частично — fullName, headline, bio, location, website, slug, avatar/cover (текстовые File ID) сохраняются. **Соцсети не сохраняются**: `addSocialLink`/`removeSocialLink` существуют как actions, но форма их не вызывает, а `updateProfile` не синхронизирует `socialLinks`.

### Суперадминка (`/super-admin/*`)

- **Обзор `/super-admin`** ✅ — счётчики users/projects/invites + последние пользователи и проекты.
- **Пользователи `/super-admin/users`** ✅ — список, toggle active, set/revoke admin. **Поиск по email не реализован.** Блокировка пользователя (`isActive`) **не проверяется в middleware** — заблокированный всё ещё может войти.
- **Инвайты `/super-admin/invites`** ✅ — генерация кода, email/expiresAt (опционально), таблица со статусами (active/used/expired), revoke.
- **Проекты `/super-admin/projects`** ✅ — модерация, toggle `showOnHomepage`, ссылка «View».

### Публичная часть (`/(public)`)

- `/` ✅ — каталог опубликованных (`published` + `showOnHomepage`) проектов. Чипсы категорий выводятся, но **фильтрации по ним нет** (только статичные кнопки).
- `/u/[slug]` ✅ — профиль + опубликованные проекты.
- `/u/[slug]/[projectSlug]` ✅ — полный кейс по 7 секциям + инкремент счётчика просмотров.

### API

- `/api/health` ✅ — проверка D1 + R2.
- `/api/upload` ✅ — direct upload в R2 (`env.MY_BUCKET.put`), валидация MIME/размера, определение размеров изображения, запись метаданных в `files`. (Реализован прямой multipart-аплоад, а не presigned URL из плана.)

---

## 2. Открытые вопросы — как решены

### Better Auth или кастомная auth-схема?

**Кастомная.** Пакета `better-auth` в зависимостях нет. Авторизация построена на самописной JWT-схеме:

- Пароли: **PBKDF2-SHA256** (Web Crypto), формат `salt:hash` (`src/lib/crypto.ts`).
- Токены: **JWT HS256** через библиотеку `jose@^6` (`src/lib/jwt.ts`).
- **Сессия после логина** хранится **не в БД**, а как stateless JWT в httpOnly-куке `auth-token` (maxAge 7 дней). Поэтому таблицы `sessions` в схеме нет и не нужно — сессия полностью восстанавливается из токена, logout = удаление куки.

### Терминология в БД: «projects» или «cases»?

**`projects`.** В коде и схеме везде используется «project»:

- таблицы `projects`, `project_categories`, `project_assets`, `project_color_roles`, `project_personas`, `project_key_metrics`, `project_comparisons`, `project_reviews`, `project_items`;
- переменные `profileId`, `projectId`, `projectSlug`.

В текстах спекуляций и UI слово «кейс» используется как синоним («Управляйте своими кейсами»), но сущность в БД называется **projects**.

---

## 3. Отклонения от изначальной архитектуры

Изначально (`Docs/CLAUDE.md`): «Суперадминка полностью изолирована на сетевом уровне через **Cloudflare Zero Trust (Access)**, без собственной сложной логики авторизации».

Фактически (в коде и спеке `01-foundation.md`/`04-super-admin.md`):

1. **Cloudflare Access для `/super-admin/*` НЕ используется.** Вместо этого — обычная JWT-авторизация с ролью `admin` через middleware. Первый админ создаётся эндпоинтом `/api/auth/init`; делегирование роли — через `/super-admin/users`.
2. **JWT — через `jose`** (HS256), а не самописный `crypto.subtle` под sign/verify. В `01-foundation.md` местами описана «голая» Web Crypto, но реально применяется `jose` (что согласуется с CLAUDE.md).
3. **Upload — прямой server-side PUT в R2** (multipart → `MY_BUCKET.put`), тогда как в `implementation-plan.md` этап 5.1 был описан как «presigned URL через нативный Web Crypto».
4. В остальном стек совпадает: **Next.js App Router + D1 (Drizzle) + R2**, адаптер `@opennextjs/cloudflare`, Tailwind v4 + MD3-токены, иконки lucide, деплой через Workers.

---

## 4. Точечные вопросы по схеме БД

### `status` у кейса — будет ли `archived`?

Сейчас enum строго `['draft', 'published']` (default `draft`). Третьего статуса `archived` **нет**. Отдельно есть булев флаг `showOnHomepage` (глобальная видимость на главной, управляется суперадмином) и `publishedAt`. Если требуется архив — статус нужно расширять в схеме вручную (в текущих миграциях его нет).

### Категория — many-to-many или один select?

**Many-to-many намеренно** (`project_categories`: `projectId` + `categoryId`, PK по паре). Это соответствует спеке (`03-admin-wizard.md` — «Categories (мультиселект из БД)»). Свести к одному значению можно, но это потребует смены схемы и отката связи; по-хорошему m2m оставляем.

Примечание: хотя связь в БД есть, **UI выбора категорий в админке пока не реализован** — форма `general` категории не отображает и не сохраняет.

### `color_roles` — общий справочник или строки на проект?

**Общий справочник.** Таблица `color_roles` не имеет `project_id`, у неё уникальный `slug` — это глобальный каталог ролей. Привязка к проекту идёт через junction-таблицу `project_color_roles` (`projectId` + `roleId` + `order`). Т.е. роли создаются один раз глобально, а каждый проект лишь выбирает нужные и задаёт им порядок. Подтверждается сидом: заведено всего две глобальные роли (`primary-accent`, `teal-highlight`).

### Роутинг `/u/[user-slug]/[project-slug]` или плоский `ux42.studio/[username]/[case-slug]`?

В коде, в комментариях схемы и в спеках (`02-public-pages.md`) **везде используется префикс `/u/`**: каталог публичных маршрутов — `(public)/u/[slug]` и `(public)/u/[slug]/[projectSlug]`, ссылка «View» в суперадминке также ведёт на `/u/${authorSlug}/${slug}`. Плоского `ux42.studio/[username]/[case-slug]` без `/u/` в реализованном коде **нет**. Это выглядит как устоявшееся (не «временное») решение, расходящееся с договорённостью о плоском пути — требует явного решения, какой финальный вариант канонический.

---

## 5. Страница `/admin/site` (тема, layout, сортировка кейсов, SEO)

**Страницы и таблиц под неё нет.** Поиск по `admin/site` в проекте ничего не дал. В текущей схеме БД нет ни одной таблицы для:

- темы/layout портфолио (шапка, порядок секций, внешний вид),
- сортировки кейсов на уровне сайта (проекты сортируются только по `publishedAt`/`createdAt`, отдельного поля сортировки нет),
- SEO-полей (meta title/description, OG-изображение — в `projects`/`profiles` таких полей нет).

То есть `/admin/site` **вне текущего скопа** и в схему пока не закладывалась. Если она должна появиться — потребуется отдельный этап со своими таблицами.

---

## 6. На чём стоим и что дальше

Публичный кейс-пейдж (`/u/[slug]/[projectSlug]`) **фактически уже реализован** — рендерит все 7 секций, собирает данные из всех связанных таблиц, инкрементирует просмотры.

Пробелы, из-за которых админка пока не может «сквозным» путём довести кейс до публикации:

### Блокеры (критично для запуска публичного фронта)

1. **Публикация не работает.** В `review` есть чекбокс «Publish», но `updateProjectReview` не выставляет `status='published'` и не проставляет `publishedAt`. В коде вообще нет ни одного вызова, который менял бы `status`.
2. **Категории не сохраняются** — в админке нет UI выбора категорий, хотя связь в БД есть.
3. **Соцсети профиля не сохраняются** — actions существуют, но форма их не вызывает.
4. **Загрузка изображений в формах не подключена.** Поля `coverFileId`/`avatarFileId` — это текстовые «File ID», нет `ImageUploader`, хотя `/api/upload` уже работает.

### Неполнота (не блокеры, но заметные)

5. **Color Roles** в шаге design — заглушка, выбор ролей не реализован (при том, что junction и справочник готовы).
6. **results / tools** (секция Final Showcase) выведены в форме `review`, но не сохраняются ни одним action.
7. **`designApproach`** выведен в форме design, но не передаётся в `updateProjectDesign` (фактически поле теряется; оно же дублируется в `updateProjectShowcase`, но showcase-форма его не отдаёт).
8. **Фильтр по категориям на главной** — только статичные чипсы, без реальной фильтрации.
9. **Блокировка пользователя (`isActive`)** не проверяется при входе/в middleware.
10. **Кнопка выхода (`logout`)** не заведена в лейаутах.
11. **Поиск по email** в `/super-admin/users` не реализован.

### Рекомендуемый порядок перед стартом публичного кейса

1. Доделать механику публикации (`status` + `publishedAt` + валидация непустого title).
2. Подключить выбор категорий в `general` и синхронизацию `projectCategories`.
3. Прикрутить `ImageUploader` (через готовый `/api/upload`) к обложке/аватару/галерее.
4. Довести `review` до конца: сохранение results/tools, превью-ссылка, кнопка «Publish».
5. Починить сохранение соцсетей профиля и `designApproach`.
6. Закрыть решение по роутингу (оставляем `/u/` или переходим на плоский `/[username]/[case-slug]`).
7. Решить, нужен ли статус `archived` и страница `/admin/site` (вносить в схему отдельным этапом).
