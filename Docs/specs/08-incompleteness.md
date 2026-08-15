# Spec: Этап 8 — Неполнота (соцсети, designApproach, Color Roles, фильтр категорий)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 3 (админка), Этап 7 (блокеры публикации)
> Ожидаемый результат: закрыты заметные пробелы админки и публичной части, не блокирующие запуск

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Ключевые таблицы

| Таблица               | Поля                                        |
| --------------------- | ------------------------------------------- |
| `social_links`        | id, profileId, platform, title, url, order  |
| `projects`            | id, designApproach                          |
| `color_roles`         | id, name, slug, lightColor1/2, darkColor1/2 |
| `project_color_roles` | projectId, roleId, order (PK по паре)       |
| `categories`          | id, name, slug, order                       |

---

## 8.1 Сохранение соцсетей профиля

### Проблема

`addSocialLink`/`removeSocialLink` существуют как actions, но форма `/admin/profile` их не вызывает, а `updateProfile` не синхронизирует `socialLinks`.

### Решение

1. В `/admin/profile/page.tsx` подключить компонент `SocialLinksEditor` (`src/components/SocialLinksEditor.tsx`).
2. `SocialLinksEditor` должен вызывать `addSocialLink` и `removeSocialLink` (Server Actions) для добавления/удаления ссылок.
3. Поддержать сортировку ссылок (поле `order`).

### Файлы

| Действие  | Файл                                   |
| --------- | -------------------------------------- |
| Изменить  | `src/app/admin/profile/page.tsx`       |
| Проверить | `src/components/SocialLinksEditor.tsx` |
| Проверить | `src/lib/actions/profile.ts`           |

---

## 8.2 Сохранение designApproach

### Проблема

Поле `designApproach` есть в форме design, но не передаётся в `updateProjectDesign` (теряется). Оно же дублируется в `updateProjectShowcase`, но showcase-форма его не отдаёт.

### Решение

1. Добавить `designApproach` в сигнатуру `updateProjectDesign` в `src/lib/actions/projects.ts`.
2. Передавать `designApproach` из формы design (`src/app/admin/projects/[id]/edit/design/page.tsx`).
3. Убрать дублирование: `designApproach` должен сохраняться только в `updateProjectDesign` (секция 04 Design System). Из `updateProjectShowcase` поле можно оставить для обратной совместимости, но showcase-форма его не должна отдавать.

### Псевдокод `updateProjectDesign`

```ts
export async function updateProjectDesign(
    projectId: string,
    data: {
        visualDirection?: string;
        displayFont?: string;
        bodyFont?: string;
        designApproach?: string;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(projects).set(data).where(eq(projects.id, projectId));
    revalidatePath(`/admin/projects/${projectId}`);
}
```

---

## 8.3 Color Roles (выбор ролей в шаге design)

### Проблема

В шаге design Color Roles — заглушка («available in a future update»). При этом junction `project_color_roles` и справочник `color_roles` готовы.

### Решение

1. В `design/page.tsx` запросить все роли из `color_roles` (глобальный справочник).
2. Запросить уже выбранные роли проекта из `project_color_roles`.
3. Подключить компонент `ColorRolePicker` (`src/components/ColorRolePicker.tsx`).
4. Расширить `updateProjectDesign` для приёма `colorRoleIds: string[]` (или `Array<{ roleId, order }>`):
    - удалить существующие `project_color_roles` для проекта
    - вставить новые через `db.batch()`

### Псевдокод

```ts
export async function updateProjectDesign(
    projectId: string,
    data: {
        visualDirection?: string;
        displayFont?: string;
        bodyFont?: string;
        designApproach?: string;
        colorRoles?: Array<{ roleId: string; order: number }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const { colorRoles, ...projectFields } = data;

    await db.batch([
        db
            .update(projects)
            .set(projectFields)
            .where(eq(projects.id, projectId)),
        db
            .delete(projectColorRoles)
            .where(eq(projectColorRoles.projectId, projectId)),
        ...(colorRoles || []).map((r) =>
            db.insert(projectColorRoles).values({
                projectId,
                roleId: r.roleId,
                order: r.order,
            }),
        ),
    ]);

    revalidatePath(`/admin/projects/${projectId}`);
}
```

### Файлы

| Действие  | Файл                                               |
| --------- | -------------------------------------------------- |
| Изменить  | `src/lib/actions/projects.ts` (colorRoles)         |
| Изменить  | `src/app/admin/projects/[id]/edit/design/page.tsx` |
| Проверить | `src/components/ColorRolePicker.tsx`               |

---

## 8.4 Фильтр по категориям на главной

### Проблема

На главной `/` чипсы категорий выводятся, но фильтрации по ним нет (только статичные кнопки).

### Решение

1. В `(public)/page.tsx` запросить категории из `categories`.
2. Реализовать фильтрацию по выбранной категории:
    - либо через query-параметр `?category=[slug]` (серверная фильтрация)
    - либо клиентский фильтр по уже загруженным проектам
3. **Рекомендация:** серверная фильтрация через `searchParams` — соответствует App Router и позволяет кэшировать.

### Псевдокод (серверная фильтрация)

```ts
export default async function HomePage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const categories = await db
        .select()
        .from(categories)
        .orderBy(categories.order);
    let projectsQuery = db
        .select()
        .from(projects)
        .where(
            and(
                eq(projects.status, 'published'),
                eq(projects.showOnHomepage, 1),
            ),
        );

    if (searchParams.category) {
        // join через project_categories
        projectsQuery = projectsQuery
            .innerJoin(
                projectCategories,
                eq(projects.id, projectCategories.projectId),
            )
            .where(eq(projectCategories.categoryId, searchParams.category));
    }

    const projects = await projectsQuery;
    // ...
}
```

### Файлы

| Действие | Файл                        |
| -------- | --------------------------- |
| Изменить | `src/app/(public)/page.tsx` |

---

## Проверка после выполнения

- [ ] Соцсети добавляются/удаляются в `/admin/profile`
- [ ] `designApproach` сохраняется из шага design
- [ ] Color Roles выбираются и сохраняются в `project_color_roles`
- [ ] Фильтр по категориям на главной реально фильтрует проекты
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие  | Файл                                                        |
| --------- | ----------------------------------------------------------- |
| Изменить  | `src/app/admin/profile/page.tsx`                            |
| Проверить | `src/components/SocialLinksEditor.tsx`                      |
| Изменить  | `src/lib/actions/projects.ts` (designApproach + colorRoles) |
| Изменить  | `src/app/admin/projects/[id]/edit/design/page.tsx`          |
| Проверить | `src/components/ColorRolePicker.tsx`                        |
| Изменить  | `src/app/(public)/page.tsx`                                 |
