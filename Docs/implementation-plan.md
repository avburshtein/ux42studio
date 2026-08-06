# UX42 Portfolio — План реализации приложения

> Утверждён: 06.08.2026
> Основан на: контрактах `src/db/schema/`, CLAUDE.md, архитектуре мультиарендной платформы

---

## Текущее состояние

| Слой           | Готовность   | Что есть                                                          |
| -------------- | ------------ | ----------------------------------------------------------------- |
| **Схема БД**   | ✅ 100%      | 16 таблиц, Drizzle ORM, миграции                                  |
| **Роутинг**    | 🟡 Структура | Папки созданы, страницы — заглушки                                |
| **API**        | 🟡 33%       | `/api/auth/login` работает, `health` и `upload` — заглушки        |
| **Компоненты** | 🟡 Минимум   | 4 UI-атома (Button, Card, Input, Label) + LoginForm, RegisterForm |
| **Lib**        | 🟡           | jwt, crypto — есть; middleware, загрузка R2 — нет                 |

---

## Этап 1: Фундамент (middleware + авторизация + лейаут)

### 1.1 Инициализация первого суперадмина `POST /api/auth/init`

**Механика одноразового эндпоинта:**

- При первом вызове проверяет наличие пользователей в таблице `users`
- Если таблица пуста — создаёт первого пользователя с `role = 'admin'`, используя данные из переменных окружения:
    - `ADMIN_EMAIL` — email суперадмина
    - `ADMIN_PASSWORD` — пароль (хешируется через Web Crypto API)
- Возвращает JWT-токен и устанавливает куку `auth-token`
- **После успешного создания первого админа эндпоинт блокируется навсегда:**
    - Все последующие вызовы возвращают `403 Forbidden` с сообщением `"Init already completed"`
    - Проверка происходит по наличию хотя бы одной записи в `users` — это атомарно и не требует флагов в БД
- Если переменные окружения не заданы — возвращает `500 Internal Server Error`

**Безопасность:**

- Эндпоинт не требует авторизации (на старте её нет)
- После инициализации защита естественная: нельзя создать второго админа через init
- Рекомендуется вызвать init сразу после деплоя и **удалить переменные `ADMIN_EMAIL`/`ADMIN_PASSWORD` из окружения** (или ротировать пароль первого админа)

### 1.2 Auth Middleware (`src/middleware.ts`)

- Проверка JWT из куки `auth-token` на защищённых роутах:
    - `/admin/*` — требует `role = 'user'` или `'admin'`
    - `/super-admin/*` — требует `role = 'admin'`
- Проброс `userId` и `role` в заголовки/контекст запроса
- Редирект на `/login` для неавторизованных
- Редирект на `/` для пользователей без роли `admin` при попытке доступа к `/super-admin/*`

### 1.3 Root Layout (`src/app/layout.tsx`)

- Подключение шрифтов Poppins + Inter
- CSS-переменные Material Design 3 (light/dark)
- Обёртка `<ThemeProvider>` для переключения тем

### 1.4 Auth Layout (`src/app/(auth)/layout.tsx`)

- Центрированная форма без навигации
- Переиспользование LoginForm / RegisterForm

---

## Этап 2: Публичные страницы (Public)

### 2.1 Главная `GET /` — `(public)/page.tsx`

- Заменить хардкод `'denis-zakharchenko'` на выборку опубликованных проектов (`status = 'published'`, `showOnHomepage = 1`)
- Сетка карточек проектов (обложка, заголовок, teaser, категории)
- Фильтр по категориям (из таблицы `categories`)

### 2.2 Профиль дизайнера `GET /u/[slug]` — `(public)/u/[slug]/page.tsx`

- Запрос `profiles` по slug + `socialLinks` + `projects` (published)
- Шапка: аватар, fullName, headline, bio, location, соцсети
- Сетка проектов с обложками

### 2.3 Страница проекта `GET /u/[slug]/[projectSlug]` — `(public)/u/[slug]/[projectSlug]/page.tsx`

- Полный кейс по 7 секциям Case Template Engine
- **Оптимизация D1:** параллельные `Promise.all`-запросы вместо одного мега-запроса с 8 `with`
- **Кэширование:** `export const revalidate = 3600` (ISR на час)
- Запросы: `projects` + `projectAssets` + `projectPersonas` + `projectKeyMetrics` + `projectComparisons` + `projectReviews` + `projectItems` + `projectColorRoles` + `colorRoles`
- Рендеринг секций: Intro → Problem → Research → Design → Testing → Showcase → Reflection

---

## Этап 3: Админка дизайнера (`/admin/*`)

### 3.1 Дашборд `GET /admin`

- Запрос `profiles` → `projects` текущего пользователя
- Таблица: title, status, viewsCount, дата создания
- Кнопки: «Создать», «Редактировать», «Удалить» (soft)

### 3.2 Создание проекта `GET /admin/projects/new`

- Создаёт пустой `draft`-проект (только id, profileId, slug, title)
- Редиректит на `/admin/projects/[id]/edit/general`
- Дальше — пошаговый wizard

### 3.3 Редактирование проекта — пошаговый wizard

```
/admin/projects/[id]/edit/
  ├── layout.tsx         ← Сайдбар с шагами + индикатор заполнения
  ├── general/page.tsx   ← Секция 01: Meta (title, slug, teaser, client, year, duration, role, tags, cover, prototype URLs)
  ├── problem/page.tsx   ← Секция 02: Problem & Audience (problemStatement, projectGoal, targetUsers)
  ├── research/page.tsx  ← Секция 03: Research (researchMethodology, userStory, personas, keyMetrics)
  ├── design/page.tsx    ← Секция 04-05: Design (visualDirection, fonts, designApproach, colorRoles)
  ├── showcase/page.tsx  ← Секция 06-07: Showcase (gallery assets, comparisons, finalDescription)
  └── review/page.tsx    ← Превью + публикация (reviews, projectItems, keyTakeaway, status → published)
```

**Принципы:**

- Каждый шаг — отдельная Server Action (трогает максимум 3 таблицы)
- Zod-схемы изолированы: валидация падает только в текущей секции
- Автосохранение при переходе между шагами
- Статус `draft` по умолчанию, `published` — только из `review`
- Транзакции через `db.batch()` (Drizzle + D1)

**Server Actions (по одной на секцию):**

| Action                  | Таблицы                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `updateProjectMeta`     | `projects` + `projectCategories`                                       |
| `updateProjectProblem`  | `projects` (problemStatement, projectGoal, targetUsers)                |
| `updateProjectResearch` | `projects` + `projectPersonas` + `projectKeyMetrics`                   |
| `updateProjectDesign`   | `projects` + `projectColorRoles`                                       |
| `updateProjectShowcase` | `projectAssets` + `projectComparisons` + `projects` (finalDescription) |
| `updateProjectReview`   | `projectReviews` + `projectItems` + `projects` (keyTakeaway, status)   |

### 3.4 Настройки профиля `GET /admin/profile`

- Форма: fullName, headline, bio, location, website, slug
- Загрузка аватара и обложки
- Управление соцсетями (добавление/удаление/сортировка)
- Server Action: `updateProfile`

---

## Этап 4: Суперадминка (`/super-admin/*`)

### 4.1 Обзорная статистика `GET /super-admin`

- Количество пользователей, проектов, инвайтов
- Последние зарегистрированные пользователи
- Последние созданные проекты

### 4.2 Управление пользователями `GET /super-admin/users`

- Таблица всех пользователей с поиском по email
- Блокировка/разблокировка (`isActive`)
- **Назначение/снятие роли суперадмина** (`role = 'admin'` / `role = 'user'`) — доступно только первому суперадмину и тем, кому он делегировал
- Server Actions: `toggleUserActive`, `setUserRole`

### 4.3 Генерация инвайтов `GET /super-admin/invites`

- Форма создания инвайта (email опционально, срок действия)
- Таблица всех инвайтов со статусами
- Server Action: `createInvite`, `revokeInvite`

### 4.4 Модерация проектов `GET /super-admin/projects`

- Таблица всех проектов (всех пользователей)
- Фильтр по статусу (draft/published)
- Возможность скрыть с главной (`showOnHomepage`)

---

## Этап 5: API и Server Actions

### 5.1 Upload в R2 `POST /api/upload`

- Генерация presigned URL через нативный Web Crypto API (без `@aws-sdk/client-s3`)
- Запись метаданных в таблицу `files`
- Валидация MIME-типов и размера

### 5.2 Health Check `GET /api/health`

- Проверка D1 (простой SELECT)
- Проверка R2 (list objects)
- Возврат статуса всех сервисов

### 5.3 Server Actions (в `src/lib/actions/`)

- `auth.ts` — login, register, logout
- `projects.ts` — createProject, updateProjectMeta, updateProjectProblem, updateProjectResearch, updateProjectDesign, updateProjectShowcase, updateProjectReview, deleteProject, publishProject
- `profile.ts` — updateProfile, addSocialLink, removeSocialLink
- `upload.ts` — getPresignedUrl, confirmUpload
- `admin.ts` — createInvite, revokeInvite, toggleUserActive

---

## Этап 6: UI-компоненты (shadcn + токены)

### 6.1 Базовые (дополнить)

`Select`, `Textarea`, `Checkbox`, `Switch`, `Dialog`, `DropdownMenu`, `Tabs`, `Badge`, `Avatar`, `Skeleton`, `Toast`

### 6.2 Бизнес-компоненты

| Компонент           | Назначение                                               |
| ------------------- | -------------------------------------------------------- |
| `ProjectCard`       | Карточка проекта для сетки                               |
| `ProjectForm`       | Форма конструктора кейса (общая обёртка)                 |
| `SectionEditor`     | Редактор одной секции (WYSIWYG-поля)                     |
| `ImageUploader`     | Drag-n-drop зона + превью + прогресс-бар                 |
| `ColorRolePicker`   | Выбор цветовых ролей для проекта                         |
| `AssetGallery`      | Сортируемая галерея (moodboard/wireframe/final)          |
| `ProfileHeader`     | Шапка профиля с аватаром и соцсетями                     |
| `SocialLinksEditor` | Редактор соцсетей (добавить/удалить/сортировать)         |
| `InviteGenerator`   | Форма создания инвайта                                   |
| `DataTable`         | Таблица с сортировкой, поиском, пагинацией (для админок) |

---

## Приоритеты и зависимости

```
Этап 1 (middleware + layout) ← начать с этого
    ↓
Этап 2 (публичные страницы) ← MVP для внешних пользователей
    ↓
Этап 3 (админка) ← MVP для дизайнеров
    ↓
Этап 5 (API + Server Actions) ← параллельно с этапом 3
    ↓
Этап 4 (суперадминка) ← после админки
    ↓
Этап 6 (UI-компоненты) ← параллельно со всеми этапами
```

---

## Что уже не нужно делать

- ❌ Менять схему БД — контракты готовы
- ❌ Писать `relations.ts` заново — связи есть
- ❌ Создавать структуру роутов — папки уже есть

---

## Технические решения

### D1-оптимизация на странице проекта

- Параллельные `Promise.all`-запросы вместо одного мега-запроса с 8 `with`
- ISR-кэширование: `export const revalidate = 3600`

### Транзакции в D1

- Использование `db.batch()` Drizzle для мутаций, затрагивающих несколько таблиц
- Проверка совместимости `@opennextjs/cloudflare` → D1 batch на старте Этапа 3

### R2 Presigned URL

- Нативный Web Crypto API для подписи (без `@aws-sdk/client-s3`)
- Совместимость с Edge-рантаймом Cloudflare Workers

### Стилизация

- Tailwind CSS v4 + CSS-переменные Material Design 3 (Seed: `#0B6E4F`)
- Шрифты: Poppins (заголовки), Inter (основной текст)
- Иконки: `lucide-react`
- Компоненты: shadcn (radix UI), скопированные в кастомный UI
- ❌ Запрещены: инлайн-стили, хардкод HEX-цветов
