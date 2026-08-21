# Spec: Этап 2 — Публичные страницы (Public)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (middleware, layout, темизация)
> Ожидаемый результат: главная с каталогом проектов, страница профиля дизайнера, страница кейса

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4 + shadcn
- **Адаптер:** `@opennextjs/cloudflare` (доступ к D1 через `getCloudflareContext().env.DB`)
- **Схема БД:** `src/db/schema/` — 16 таблиц, контракты готовы
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`, шрифты Poppins + Inter, иконки `lucide-react`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Ключевые таблицы БД (для этого этапа)

| Таблица              | Поля                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `projects`           | id, profileId, slug, title, teaser, client, year, duration, myRole, tags, coverFileId, status, showOnHomepage, viewsCount, publishedAt, createdAt, **+ все поля секций 02-08** |
| `profiles`           | id, userId, slug, fullName, headline, bio, avatarFileId, coverFileId, location, website, isPublic                                                                              |
| `socialLinks`        | id, profileId, platform, title, url, order                                                                                                                                     |
| `files`              | id, uploaderId, r2Key, fileName, mimeType, sizeBytes, width, height                                                                                                            |
| `categories`         | id, name, slug, order                                                                                                                                                          |
| `projectCategories`  | projectId, categoryId                                                                                                                                                          |
| `projectAssets`      | id, projectId, fileId, assetType, caption, order                                                                                                                               |
| `projectPersonas`    | id, projectId, nameAndAge, avatarFileId, bio, painPoints                                                                                                                       |
| `projectKeyMetrics`  | id, projectId, value, description, order                                                                                                                                       |
| `projectComparisons` | id, projectId, featureName, beforeFileId, afterFileId, beforeText, afterText, order                                                                                            |
| `projectReviews`     | id, projectId, text, authorName, authorRole, avatarFileId, order                                                                                                               |
| `projectItems`       | id, projectId, type, content, order                                                                                                                                            |
| `colorRoles`         | id, name, slug, lightColor1, lightColor2, darkColor1, darkColor2                                                                                                               |
| `projectColorRoles`  | projectId, roleId, order                                                                                                                                                       |

### Существующие файлы (референс)

| Файл                         | Назначение                                        |
| ---------------------------- | ------------------------------------------------- |
| `src/db/index.ts`            | `getDb(env.DB)`                                   |
| `src/db/schema/index.ts`     | Реэкспорт всех схем                               |
| `src/db/schema/relations.ts` | Связи между таблицами                             |
| `src/app/(public)/page.tsx`  | Заглушка главной (хардкод `'denis-zakharchenko'`) |

---

## 2.1 Главная страница `GET /`

### Файл: `src/app/(public)/page.tsx` (переписать)

**Текущее состояние:** хардкод-запрос профиля `'denis-zakharchenko'`.

**Новая логика:**

1. Запросить опубликованные проекты для главной:
    ```ts
    const projects = await db.query.projects.findMany({
        where: and(
            eq(projects.status, 'published'),
            eq(projects.showOnHomepage, 1),
        ),
        with: {
            profile: {
                columns: { slug: true, fullName: true, avatarFileId: true },
            },
            projectCategories: {
                with: { category: true },
            },
            coverFile: true,
        },
        orderBy: desc(projects.publishedAt),
        limit: 20,
    });
    ```
2. Запросить все категории для фильтра:
    ```ts
    const categories = await db.query.categories.findMany({
        orderBy: asc(categories.order),
    });
    ```

**Рендеринг:**

- Заголовок «Каталог дизайнеров»
- Фильтр по категориям (горизонтальные чипсы/табы)
- Сетка карточек проектов (2-3 колонки на десктопе, 1 на мобильном)
- Каждая карточка: обложка, заголовок, teaser, имя автора, категории
- Ссылка на `/u/[profile.slug]/[project.slug]`

**Кэширование:** `export const revalidate = 300` (5 минут)

---

## 2.2 Профиль дизайнера `GET /u/[slug]`

### Файл: `src/app/(public)/u/[slug]/page.tsx` (создать)

**Параметры:** `{ slug: string }` из `params`

**Логика:**

1. Запросить профиль по slug:
    ```ts
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.slug, slug),
        with: {
            socialLinks: { orderBy: asc(socialLinks.order) },
            avatarFile: true,
            coverFile: true,
        },
    });
    ```
2. Если нет → `notFound()`
3. Запросить опубликованные проекты профиля:
    ```ts
    const projects = await db.query.projects.findMany({
        where: and(
            eq(projects.profileId, profile.id),
            eq(projects.status, 'published'),
        ),
        with: {
            projectCategories: { with: { category: true } },
            coverFile: true,
        },
        orderBy: desc(projects.publishedAt),
    });
    ```

**Рендеринг:**

- Шапка профиля: обложка (фон), аватар, fullName, headline, bio, location, website
- Соцсети (иконки-ссылки)
- Сетка проектов (как на главной)
- Если проектов нет — заглушка «Пока нет проектов»

**Кэширование:** `export const revalidate = 600` (10 минут)

---

## 2.3 Страница проекта `GET /u/[slug]/[projectSlug]`

### Файл: `src/app/(public)/u/[slug]/[projectSlug]/page.tsx` (создать)

**Параметры:** `{ slug: string, projectSlug: string }` из `params`

**Логика (оптимизация D1 — параллельные запросы):**

```ts
// 1. Найти профиль и проект
const profile = await db.query.profiles.findFirst({
    where: eq(profiles.slug, slug),
    columns: { id: true, slug: true, fullName: true, avatarFileId: true },
});
if (!profile) notFound();

const project = await db.query.projects.findFirst({
    where: and(
        eq(projects.profileId, profile.id),
        eq(projects.slug, projectSlug),
        eq(projects.status, 'published'),
    ),
    with: {
        coverFile: true,
        projectCategories: { with: { category: true } },
    },
});
if (!project) notFound();

// 2. Параллельная загрузка всех связанных данных
const [
    assets,
    personas,
    keyMetrics,
    comparisons,
    reviews,
    items,
    colorRolesData,
] = await Promise.all([
    db.query.projectAssets.findMany({
        where: eq(projectAssets.projectId, project.id),
        with: { file: true },
        orderBy: asc(projectAssets.order),
    }),
    db.query.projectPersonas.findMany({
        where: eq(projectPersonas.projectId, project.id),
        with: { avatarFile: true },
    }),
    db.query.projectKeyMetrics.findMany({
        where: eq(projectKeyMetrics.projectId, project.id),
        orderBy: asc(projectKeyMetrics.order),
    }),
    db.query.projectComparisons.findMany({
        where: eq(projectComparisons.projectId, project.id),
        with: { beforeFile: true, afterFile: true },
        orderBy: asc(projectComparisons.order),
    }),
    db.query.projectReviews.findMany({
        where: eq(projectReviews.projectId, project.id),
        with: { avatarFile: true },
        orderBy: asc(projectReviews.order),
    }),
    db.query.projectItems.findMany({
        where: eq(projectItems.projectId, project.id),
        orderBy: asc(projectItems.order),
    }),
    db.query.projectColorRoles.findMany({
        where: eq(projectColorRoles.projectId, project.id),
        with: { role: true },
        orderBy: asc(projectColorRoles.order),
    }),
]);

// 3. Инкремент счётчика просмотров (fire-and-forget)
db.update(projects)
    .set({ viewsCount: sql`${projects.viewsCount} + 1` })
    .where(eq(projects.id, project.id))
    .run();
```

**Рендеринг — 7 секций Case Template Engine:**

### Секция 01: Intro & Meta

- Hero image (coverFileId)
- Title, teaser
- Мета-таблица: Client, Year, Duration, My Role, Devices, Tags
- Ссылки на прототипы (Figma, Web)
- Категории

### Секция 02: Problem & Audience

- Problem Statement
- Project Goal
- Target Users

### Секция 03: User Research

- Research Methodology
- User Story
- Персоны (карточки: аватар, имя/возраст, био, User Scenario)
- Key Metrics (цифры с описанием)

### Секция 04: Design Process

- Visual Direction
- Display Font / Body Font
- Design Approach
- Цветовые роли (пары light/dark с contrast ratio)

### Секция 05: Testing & Iteration

- Testing Process
- Before/After сравнения (изображения + текст)

### Секция 06: Final Showcase

- Final Description
- Галерея ассетов (фильтр по assetType: moodboard, wireframe, final_gallery)
- Results (projectItems с type='result')
- Tools (projectItems с type='tool')

### Секция 07: Reflection & Next Steps

- Key Takeaway
- Reviews (отзывы клиента/команды: текст, автор, роль, аватар)
- Next Steps (projectItems с type='next_step')

**Кэширование:** `export const revalidate = 3600` (1 час)

**Важно:** если какая-то секция пустая (нет данных) — не рендерить её заголовок.

---

## 2.4 Компонент `ProjectCard`

### Файл: `src/components/ProjectCard.tsx` (создать)

Переиспользуемый компонент для главной и страницы профиля.

**Пропсы:**

```ts
type ProjectCardProps = {
    project: {
        id: string;
        slug: string;
        title: string;
        teaser: string | null;
        coverFile: { r2Key: string; mimeType: string } | null;
        profile: { slug: string; fullName: string };
        projectCategories: Array<{ category: { name: string; slug: string } }>;
    };
};
```

**Рендеринг:**

- Карточка-ссылка на `/u/[profile.slug]/[project.slug]`
- Обложка (или плейсхолдер если нет)
- Title
- Teaser (обрезать до 120 символов)
- Имя автора
- Чипсы категорий

---

## Проверка после выполнения

- [ ] Главная показывает опубликованные проекты (не хардкод)
- [ ] Фильтр по категориям работает
- [ ] Страница профиля `/u/[slug]` показывает данные из БД
- [ ] Страница проекта `/u/[slug]/[projectSlug]` рендерит все 7 секций
- [ ] Пустые секции скрываются
- [ ] Счётчик просмотров инкрементируется
- [ ] Все изображения используют правильные URL (R2)
- [ ] `tsc --noEmit` проходит без ошибок
- [ ] Нет инлайн-стилей и хардкода HEX

---

## Файлы этапа (checklist)

| Действие   | Файл                                               |
| ---------- | -------------------------------------------------- |
| Переписать | `src/app/(public)/page.tsx`                        |
| Создать    | `src/app/(public)/u/[slug]/page.tsx`               |
| Создать    | `src/app/(public)/u/[slug]/[projectSlug]/page.tsx` |
| Создать    | `src/components/ProjectCard.tsx`                   |
