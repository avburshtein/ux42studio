# Spec: Этап 3 — Админка дизайнера (дашборд + wizard)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (middleware, auth), Этап 2 (публичные страницы)
> Ожидаемый результат: дашборд со списком проектов, пошаговый wizard создания/редактирования кейса, настройки профиля

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Схема БД:** `src/db/schema/` — 16 таблиц, контракты готовы
- **Middleware:** уже есть, `x-user-id` и `x-user-role` проброшены в заголовки
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`, шрифты Poppins + Inter, иконки `lucide-react`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX

### Ключевые таблицы (все мутации через Server Actions)

| Таблица              | Поля для мутаций                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `projects`           | id, profileId, slug, title, teaser, client, year, duration, myRole, constraints, devices, tags, coverFileId, figmaPrototypeUrl, webPrototypeUrl, problemStatement, projectGoal, targetUsers, researchMethodology, userStory, visualDirection, displayFont, bodyFont, designApproach, testingProcess, finalDescription, keyTakeaway, status |
| `projectCategories`  | projectId, categoryId                                                                                                                                                                                                                                                                                                                      |
| `projectPersonas`    | id, projectId, nameAndAge, avatarFileId, bio, painPoints                                                                                                                                                                                                                                                                                   |
| `projectKeyMetrics`  | id, projectId, value, description, order                                                                                                                                                                                                                                                                                                   |
| `projectColorRoles`  | projectId, roleId, order                                                                                                                                                                                                                                                                                                                   |
| `projectAssets`      | id, projectId, fileId, assetType, caption, order                                                                                                                                                                                                                                                                                           |
| `projectComparisons` | id, projectId, featureName, beforeFileId, afterFileId, beforeText, afterText, order                                                                                                                                                                                                                                                        |
| `projectReviews`     | id, projectId, text, authorName, authorRole, avatarFileId, order                                                                                                                                                                                                                                                                           |
| `projectItems`       | id, projectId, type, content, order                                                                                                                                                                                                                                                                                                        |
| `profiles`           | id, slug, fullName, headline, bio, avatarFileId, coverFileId, location, website                                                                                                                                                                                                                                                            |
| `socialLinks`        | id, profileId, platform, title, url, order                                                                                                                                                                                                                                                                                                 |
| `files`              | id, uploaderId, r2Key, fileName, mimeType, sizeBytes, width, height                                                                                                                                                                                                                                                                        |
| `categories`         | id, name, slug, order                                                                                                                                                                                                                                                                                                                      |

### Как получить userId в Server Component

```ts
import { headers } from 'next/headers';
const headersList = await headers();
const userId = headersList.get('x-user-id');
```

### Как получить profileId по userId

```ts
const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
    columns: { id: true },
});
const profileId = profile?.id;
```

---

## 3.1 Дашборд `GET /admin`

### Файл: `src/app/admin/page.tsx` (переписать)

**Логика:**

1. Получить `userId` из `x-user-id` заголовка
2. Найти `profileId` по `userId`
3. Если нет профиля — редирект на `/admin/profile` (создать профиль)
4. Запросить проекты: `db.query.projects.findMany({ where: eq(projects.profileId, profileId), orderBy: desc(projects.updatedAt) })`

**Рендеринг:**

- Заголовок «Мои проекты»
- Кнопка «Создать проект» → `/admin/projects/new`
- Таблица: Title, Status (draft/published), Views, Updated, Actions (Edit, Delete)
- Если проектов нет — заглушка с CTA «Создать первый проект»

---

## 3.2 Создание проекта `GET /admin/projects/new`

### Файл: `src/app/admin/projects/new/page.tsx` (создать)

**Логика (Server Component, не Client):**

```ts
import { redirect } from 'next/navigation';
// ... получить userId, profileId
const id = crypto.randomUUID();
const slug = `project-${id.slice(0, 8)}`;
await db
    .insert(projects)
    .values({ id, profileId, slug, title: 'New Project', status: 'draft' });
redirect(`/admin/projects/${id}/edit/general`);
```

**Важно:** это Server Component, форма не нужна — сразу редирект.

---

## 3.3 Пошаговый wizard `/admin/projects/[id]/edit/`

### 3.3.0 Layout wizard'а

### Файл: `src/app/admin/projects/[id]/edit/layout.tsx` (создать)

**Задача:** отрендерить сайдбар с шагами и статусом заполнения.

**Шаги:**

1. General (Meta)
2. Problem & Audience
3. Research
4. Design
5. Showcase
6. Review & Publish

**Ссылки:**

- `/admin/projects/[id]/edit/general`
- `/admin/projects/[id]/edit/problem`
- `/admin/projects/[id]/edit/research`
- `/admin/projects/[id]/edit/design`
- `/admin/projects/[id]/edit/showcase`
- `/admin/projects/[id]/edit/review`

**Индикатор:** текущий шаг подсвечен. Будущие шаги — серые. Пройденные — с галочкой.

### 3.3.1 General (Meta)

### Файл: `src/app/admin/projects/[id]/edit/general/page.tsx` (создать)

**Форма (React Hook Form + Zod):**

- Title (required)
- Slug (автогенерация из title, editable)
- Teaser (textarea, макс 200 символов)
- Client
- Year (number)
- Duration
- My Role
- Constraints
- Devices
- Tags (comma-separated)
- Cover image (ImageUploader)
- Figma Prototype URL
- Web Prototype URL
- Categories (мультиселект из БД)

**Server Action: `updateProjectMeta`**

- Обновляет `projects` (поля выше)
- Синхронизирует `projectCategories` (delete + insert)

**Автосохранение:** при переходе на другой шаг (через `router.push` в `onSuccess` коллбеке формы).

### 3.3.2 Problem & Audience

### Файл: `src/app/admin/projects/[id]/edit/problem/page.tsx` (создать)

**Форма:**

- Problem Statement (textarea)
- Project Goal (textarea)
- Target Users (textarea)

**Server Action: `updateProjectProblem`**

- Обновляет `projects` (problemStatement, projectGoal, targetUsers)

### 3.3.3 Research

### Файл: `src/app/admin/projects/[id]/edit/research/page.tsx` (создать)

**Форма:**

- Research Methodology (textarea)
- User Story (textarea)
- Personas (динамический список, до 5):
    - Name & Age
    - Avatar (ImageUploader)
    - Bio
    - Pain Points
- Key Metrics (динамический список, до 3):
    - Value
    - Description

**Server Action: `updateProjectResearch`**

- Обновляет `projects` (researchMethodology, userStory)
- Синхронизирует `projectPersonas` (upsert по порядку)
- Синхронизирует `projectKeyMetrics` (upsert по порядку)
- Использовать `db.batch()` для транзакции

### 3.3.4 Design

### Файл: `src/app/admin/projects/[id]/edit/design/page.tsx` (создать)

**Форма:**

- Visual Direction (textarea)
- Display Font
- Body Font
- Design Approach (textarea)
- Color Roles (выбор из таблицы `colorRoles` + порядок)

**Server Action: `updateProjectDesign`**

- Обновляет `projects` (visualDirection, displayFont, bodyFont, designApproach)
- Синхронизирует `projectColorRoles`

### 3.3.5 Showcase

### Файл: `src/app/admin/projects/[id]/edit/showcase/page.tsx` (создать)

**Форма:**

- Final Description (textarea)
- Gallery Assets (ImageUploader + выбор assetType: moodboard/wireframe/final_gallery + caption + сортировка)
- Before/After Comparisons (динамический список):
    - Feature Name
    - Before Image + Before Text
    - After Image + After Text

**Server Action: `updateProjectShowcase`**

- Обновляет `projects` (finalDescription)
- Синхронизирует `projectAssets`
- Синхронизирует `projectComparisons`
- `db.batch()`

### 3.3.6 Review & Publish

### Файл: `src/app/admin/projects/[id]/edit/review/page.tsx` (создать)

**Форма:**

- Key Takeaway (textarea)
- Reviews (динамический список):
    - Text
    - Author Name
    - Author Role
    - Avatar
- Results (projectItems с type='result')
- Tools (projectItems с type='tool')
- Next Steps (projectItems с type='next_step')
- Кнопка «Publish» (меняет status на 'published' + устанавливает publishedAt)
- Предпросмотр (ссылка на публичную страницу)

**Server Action: `updateProjectReview`**

- Обновляет `projects` (keyTakeaway, status, publishedAt)
- Синхронизирует `projectReviews`
- Синхронизирует `projectItems`

**Валидация перед публикацией:**

- Проверить, что title не пустой
- Проверить, что хотя бы одна секция заполнена
- Если не прошло — показать ошибки, не дать опубликовать

---

## 3.4 Настройки профиля `GET /admin/profile`

### Файл: `src/app/admin/profile/page.tsx` (создать)

**Форма:**

- Full Name (required)
- Headline
- Bio (textarea)
- Location
- Website
- Slug (уникальный, автогенерация из fullName)
- Avatar (ImageUploader)
- Cover (ImageUploader)
- Social Links (динамический список):
    - Platform (select: github, behance, dribbble, telegram, custom)
    - Title
    - URL
    - Сортировка (drag-n-drop)

**Server Action: `updateProfile`**

- Создаёт или обновляет `profiles`
- Синхронизирует `socialLinks`
- Связывает с `files` (аватар, обложка)

---

## 3.5 Server Actions (все в `src/lib/actions/`)

### Файл: `src/lib/actions/projects.ts` (создать)

```ts
'use server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import {
    projects,
    projectCategories,
    projectPersonas,
    projectKeyMetrics,
    projectColorRoles,
    projectAssets,
    projectComparisons,
    projectReviews,
    projectItems,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

// Вспомогательная функция: получить profileId по userId
async function getProfileId(): Promise<string> {
    /* ... */
}

// Zod-схемы для каждой секции (отдельные!)
const metaSchema = z.object({
    /* ... */
});
const problemSchema = z.object({
    /* ... */
});
// ... и т.д.

export async function updateProjectMeta(
    projectId: string,
    data: z.infer<typeof metaSchema>,
) {
    /* ... */
}
export async function updateProjectProblem(
    projectId: string,
    data: z.infer<typeof problemSchema>,
) {
    /* ... */
}
export async function updateProjectResearch(
    projectId: string,
    data: {
        /* ... */
    },
) {
    /* db.batch() */
}
export async function updateProjectDesign(
    projectId: string,
    data: {
        /* ... */
    },
) {
    /* ... */
}
export async function updateProjectShowcase(
    projectId: string,
    data: {
        /* ... */
    },
) {
    /* db.batch() */
}
export async function updateProjectReview(
    projectId: string,
    data: {
        /* ... */
    },
) {
    /* db.batch() */
}
export async function deleteProject(projectId: string) {
    /* ... */
}
```

### Файл: `src/lib/actions/profile.ts` (создать)

```ts
'use server';
export async function updateProfile(data: { /* ... */ }) {
    /* ... */
}
export async function addSocialLink(data: { /* ... */ }) {
    /* ... */
}
export async function removeSocialLink(linkId: string) {
    /* ... */
}
```

---

## Проверка после выполнения

- [ ] Дашборд показывает проекты текущего пользователя
- [ ] Создание проекта → редирект на wizard
- [ ] Все 6 шагов wizard'а сохраняют данные корректно
- [ ] Автосохранение при переходе между шагами
- [ ] Публикация меняет status на 'published'
- [ ] Профиль сохраняется (аватар, соцсети)
- [ ] `db.batch()` работает для мутаций с несколькими таблицами
- [ ] `tsc --noEmit` проходит без ошибок
- [ ] Нет инлайн-стилей и хардкода HEX

---

## Файлы этапа (checklist)

| Действие   | Файл                                                 |
| ---------- | ---------------------------------------------------- |
| Переписать | `src/app/admin/page.tsx`                             |
| Создать    | `src/app/admin/projects/new/page.tsx`                |
| Создать    | `src/app/admin/projects/[id]/edit/layout.tsx`        |
| Создать    | `src/app/admin/projects/[id]/edit/general/page.tsx`  |
| Создать    | `src/app/admin/projects/[id]/edit/problem/page.tsx`  |
| Создать    | `src/app/admin/projects/[id]/edit/research/page.tsx` |
| Создать    | `src/app/admin/projects/[id]/edit/design/page.tsx`   |
| Создать    | `src/app/admin/projects/[id]/edit/showcase/page.tsx` |
| Создать    | `src/app/admin/projects/[id]/edit/review/page.tsx`   |
| Создать    | `src/app/admin/profile/page.tsx`                     |
| Создать    | `src/lib/actions/projects.ts`                        |
| Создать    | `src/lib/actions/profile.ts`                         |
