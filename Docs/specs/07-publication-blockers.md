# Spec: Этап 7 — Блокеры публикации (сквозной путь кейса до публикации)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 3 (админка), Этап 5 (Server Actions)
> Ожидаемый результат: дизайнер может довести кейс от черновика до публикации без ручных правок БД

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Схема БД:** `src/db/schema/` — статус `projects.status` уже расширен до `['draft', 'published', 'archived']`
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Ключевые таблицы

| Таблица              | Поля                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `projects`           | id, profileId, slug, title, status, publishedAt, showOnHomepage     |
| `project_categories` | projectId, categoryId (PK по паре)                                  |
| `categories`         | id, name, slug, order                                               |
| `files`              | id, uploaderId, r2Key, fileName, mimeType, sizeBytes, width, height |

---

## 7.1 Механика публикации

### Проблема

В шаге `review` есть чекбокс «Publish», но `updateProjectReview` не меняет `status` и не проставляет `publishedAt`. В коде нет ни одного вызова, меняющего `status`.

### Решение

Расширить `updateProjectReview` в `src/lib/actions/projects.ts`:

1. Добавить в сигнатуру параметр `publish?: boolean`.
2. При `publish === true`:
    - выставить `status = 'published'`
    - выставить `publishedAt = Math.floor(Date.now() / 1000)` (unix-секунды, как `createdAt`)
    - выполнить валидацию: `title` непустой (иначе вернуть ошибку, не публиковать)
3. При `publish === false` и текущем статусе `published` — оставить `published` (отмена публикации не входит в этот этап; перевод в `archived` — Этап 10).
4. `revalidatePath('/admin/projects/' + projectId)` и `revalidatePath('/')` (чтобы главная обновилась).

### Псевдокод

```ts
export async function updateProjectReview(
    projectId: string,
    data: {
        keyTakeaway?: string;
        reviews?: Array<...>;
        nextSteps?: Array<...>;
        publish?: boolean;
    },
) {
    // ... существующая логика db.batch для keyTakeaway/reviews/nextSteps ...

    if (data.publish) {
        // Валидация title
        const project = await db
            .select({ title: projects.title })
            .from(projects)
            .where(eq(projects.id, projectId))
            .get();

        if (!project?.title?.trim()) {
            return { error: 'Title is required before publishing' };
        }

        await db.update(projects).set({
            status: 'published',
            publishedAt: Math.floor(Date.now() / 1000),
        }).where(eq(projects.id, projectId));
    }

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/');
}
```

### Валидация перед публикацией

Перед установкой `status='published'` проверить обязательные поля:

- `title` — непустой (критично, иначе публичная страница сломается)
- `slug` — непустой и уникальный в рамках профиля (уже гарантируется `uniqueIndex idx_projects_profile_slug`)

---

## 7.2 Кнопка «Publish» в шаге review

### Файл: `src/app/admin/projects/[id]/edit/review/page.tsx` (изменить)

1. Подключить чекбокс/кнопку «Publish» к `updateProjectReview` с параметром `publish: true`.
2. Использовать `useActionState` / `useFormState` для обработки результата.
3. Показывать ошибку валидации (например, «Title is required before publishing») в зарезервированном helper text space — **без layout shift**.
4. После успешной публикации показать ссылку-превью на `/u/[authorSlug]/[projectSlug]`.

---

## 7.3 Сохранение results / tools (Final Showcase)

### Проблема

Поля `results` и `tools` выведены в форме `review`, но не сохраняются ни одним action. В `updateProjectShowcase` уже есть обработка `results`/`tools` через `projectItems` (type `result`/`tool`), но showcase-форма их не отдаёт.

### Решение

1. Перенести сохранение `results`/`tools` в `updateProjectReview` (они относятся к секции Final Showcase / Reflection).
2. Либо — корректно подключить их в `updateProjectShowcase` и вызывать из showcase-формы.

**Рекомендация:** сохранять `results`/`tools` в `updateProjectShowcase` (секция 06 Final Showcase), а `updateProjectReview` оставить только для `keyTakeaway`/`reviews`/`nextSteps` + публикации. Это соответствует разбиению секций Case Template Engine.

### Действия

- В `updateProjectShowcase` уже есть обработка `results`/`tools` через `projectItems` — проверить, что она корректно удаляет только `result`/`tool` (не `next_step`).
- Подключить поля `results`/`tools` в showcase-форму и передать их в `updateProjectShowcase`.
- Убедиться, что `projectItems` с type `next_step` не удаляются при сохранении showcase.

---

## 7.4 Категории (мультиселект в шаге general)

### Проблема

Связь `project_categories` (m2m) есть в БД, но UI выбора категорий в админке отсутствует. Поле `categoryIds` есть только в zod-схеме.

### Решение

1. **Загрузка категорий:** в `general/page.tsx` запросить все категории из `categories` (упорядочить по `order`).
2. **UI:** мультиселект (chips или checkbox-группа) с выбором категорий.
3. **Сохранение:** расширить `updateProjectMeta` для приёма `categoryIds: string[]`:
    - удалить существующие `project_categories` для проекта
    - вставить новые связи через `db.batch()`

### Псевдокод `updateProjectMeta`

```ts
export async function updateProjectMeta(
    projectId: string,
    data: {
        // ... существующие поля ...
        categoryIds?: string[];
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const { categoryIds, ...projectFields } = data;

    await db.batch([
        db
            .update(projects)
            .set(projectFields)
            .where(eq(projects.id, projectId)),
        db
            .delete(projectCategories)
            .where(eq(projectCategories.projectId, projectId)),
        ...(categoryIds || []).map((categoryId) =>
            db.insert(projectCategories).values({ projectId, categoryId }),
        ),
    ]);

    revalidatePath(`/admin/projects/${projectId}`);
}
```

---

## 7.5 ImageUploader (обложка / аватар / галерея)

### Проблема

`/api/upload` уже работает, но в формах `coverFileId`/`avatarFileId` — текстовые поля «File ID». Нет `ImageUploader`.

### Решение

1. Использовать существующий компонент `src/components/ImageUploader.tsx` (проверить, что он реализован; при необходимости доработать).
2. Подключить к:
    - обложке проекта (`coverFileId`) в шаге `general`
    - аватару/обложке профиля (`avatarFileId`/`coverFileId`) в `/admin/profile`
    - галерее (`projectAssets`) в шаге `showcase`
3. `ImageUploader` должен:
    - делать `POST /api/upload` (multipart)
    - получать `{ fileId, url }`
    - возвращать `fileId` в форму (не текстовое поле)
    - показывать превью и прогресс-бар

### Файлы

| Действие  | Файл                                                 |
| --------- | ---------------------------------------------------- |
| Проверить | `src/components/ImageUploader.tsx`                   |
| Изменить  | `src/app/admin/projects/[id]/edit/general/page.tsx`  |
| Изменить  | `src/app/admin/projects/[id]/edit/showcase/page.tsx` |
| Изменить  | `src/app/admin/profile/page.tsx`                     |

---

## Проверка после выполнения

- [ ] Чекбокс «Publish» выставляет `status='published'` и `publishedAt`
- [ ] Публикация блокируется при пустом `title` (с сообщением без layout shift)
- [ ] `results`/`tools` сохраняются в `projectItems` (type `result`/`tool`)
- [ ] `next_step` items не удаляются при сохранении showcase
- [ ] Категории выбираются в `general` и сохраняются в `project_categories`
- [ ] `ImageUploader` работает для обложки/аватара/галереи
- [ ] Публичный кейс-пейдж `/u/[slug]/[projectSlug]` рендерит опубликованный проект
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие  | Файл                                                   |
| --------- | ------------------------------------------------------ |
| Изменить  | `src/lib/actions/projects.ts` (публикация + категории) |
| Изменить  | `src/app/admin/projects/[id]/edit/review/page.tsx`     |
| Изменить  | `src/app/admin/projects/[id]/edit/general/page.tsx`    |
| Изменить  | `src/app/admin/projects/[id]/edit/showcase/page.tsx`   |
| Изменить  | `src/app/admin/profile/page.tsx`                       |
| Проверить | `src/components/ImageUploader.tsx`                     |
