# Spec: Этап 10 — Статус `archived` (архивация проектов)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 7 (механика публикации), Этап 3 (админка)
> Ожидаемый результат: дизайнер может перевести опубликованный проект в архив, архивные проекты не показываются в публичном каталоге

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Схема БД:** статус `projects.status` уже расширен до `['draft', 'published', 'archived']` (см. `src/db/schema/projects.ts`)
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Ключевые таблицы

| Таблица    | Поля                                            |
| ---------- | ----------------------------------------------- |
| `projects` | id, profileId, slug, title, status, publishedAt |

---

## 10.1 Семантика статуса `archived`

### Определение

- `draft` — черновик, не виден в публичной части.
- `published` — опубликован, виден в каталоге и на странице профиля.
- `archived` — снят с публикации, но данные сохранены. Не виден в публичном каталоге и на странице профиля, но остаётся в админке.

### Отличие от `showOnHomepage`

- `showOnHomepage` — глобальный флаг видимости на главной, управляется суперадмином (модерация).
- `archived` — статус жизненного цикла, управляется самим дизайнером. Архивный проект не показывается нигде публично.

---

## 10.2 Механика перевода в архив

### Server Action: `archiveProject`

Добавить в `src/lib/actions/projects.ts`:

```ts
export async function archiveProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            status: 'archived',
            showOnHomepage: 0, // снять с главной
        })
        .where(eq(projects.id, projectId));

    revalidatePath('/admin');
    revalidatePath('/');
}
```

### Server Action: `unarchiveProject` (восстановление)

```ts
export async function unarchiveProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            status: 'published',
            publishedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    revalidatePath('/admin');
    revalidatePath('/');
}
```

**Примечание:** восстановление из архива сразу публикует проект (статус `published`). Если требуется вернуть в `draft`, добавить отдельный параметр.

---

## 10.3 UI в админке

### Дашборд `/admin`

1. В списке проектов добавить фильтр/вкладки по статусу: `draft`, `published`, `archived`.
2. Для `published`-проекта добавить кнопку «В архив».
3. Для `archived`-проекта добавить кнопку «Восстановить».

### Wizard `review`

Добавить кнопку «В архив» рядом с «Publish» (для уже опубликованного проекта).

### Файлы

| Действие | Файл                                               |
| -------- | -------------------------------------------------- |
| Изменить | `src/lib/actions/projects.ts` (archive/unarchive)  |
| Изменить | `src/app/admin/page.tsx`                           |
| Изменить | `src/app/admin/projects/[id]/edit/review/page.tsx` |

---

## 10.4 Публичная часть

### Что изменить

1. **Главная `/`** — уже фильтрует по `status = 'published'`, поэтому `archived` автоматически исключается. Проверить, что нет отдельного условия на `showOnHomepage`, которое нужно учитывать.
2. **Профиль `/u/[slug]`** — уже фильтрует по `status = 'published'`, `archived` исключается автоматически.
3. **Страница проекта `/u/[slug]/[projectSlug]`** — добавить проверку: если `status !== 'published'`, вернуть `notFound()` (404). Сейчас страница может рендерить `draft`/`archived`, если известен прямой URL.

### Псевдокод (страница проекта)

```ts
const project = await db
    .select()
    .from(projects)
    .where(
        and(eq(projects.slug, projectSlug), eq(projects.status, 'published')),
    )
    .get();

if (!project) {
    notFound();
}
```

### Файлы

| Действие | Файл                                                          |
| -------- | ------------------------------------------------------------- |
| Изменить | `src/app/(public)/u/[slug]/[projectSlug]/page.tsx` (проверка) |

---

## Проверка после выполнения

- [ ] `archiveProject` переводит `published` → `archived` и снимает `showOnHomepage`
- [ ] `unarchiveProject` восстанавливает в `published`
- [ ] Архивный проект не показывается на главной и в профиле
- [ ] Прямой URL архивного проекта возвращает 404
- [ ] В админке есть кнопки «В архив» / «Восстановить»
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие | Файл                                               |
| -------- | -------------------------------------------------- |
| Изменить | `src/lib/actions/projects.ts` (archive/unarchive)  |
| Изменить | `src/app/admin/page.tsx`                           |
| Изменить | `src/app/admin/projects/[id]/edit/review/page.tsx` |
| Изменить | `src/app/(public)/u/[slug]/[projectSlug]/page.tsx` |
