# Spec: Этап 4 — Суперадминка

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (middleware, auth, init), Этап 3 (админка дизайнера)
> Ожидаемый результат: дашборд статистики, управление пользователями (включая назначение админов), генерация инвайтов, модерация проектов

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Middleware:** `/super-admin/*` доступен только для `role = 'admin'`
- **Первый админ:** создаётся через `POST /api/auth/init` (Этап 1)
- **Делегирование:** админ может назначить `role = 'admin'` другим пользователям через `/super-admin/users`
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`, иконки `lucide-react`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX

### Ключевые таблицы

| Таблица    | Поля                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------- |
| `users`    | id, email, passwordHash, role ('admin'                                                 | 'user'), isActive, createdAt, updatedAt |
| `invites`  | id, code, email, createdByUserId, usedByUserId, expiresAt, createdAt                   |
| `projects` | id, profileId, slug, title, status, showOnHomepage, viewsCount, publishedAt, createdAt |
| `profiles` | id, userId, slug, fullName, isPublic                                                   |

### Как получить userId/role в Server Component

```ts
import { headers } from 'next/headers';
const headersList = await headers();
const userId = headersList.get('x-user-id');
const role = headersList.get('x-user-role');
```

---

## 4.1 Обзорная статистика `GET /super-admin`

### Файл: `src/app/super-admin/page.tsx` (переписать)

**Запросы:**

```ts
const [usersCount, projectsCount, invitesCount, recentUsers, recentProjects] =
    await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(projects),
        db.select({ count: sql<number>`count(*)` }).from(invites),
        db.query.users.findMany({ orderBy: desc(users.createdAt), limit: 5 }),
        db.query.projects.findMany({
            with: { profile: { columns: { fullName: true } } },
            orderBy: desc(projects.createdAt),
            limit: 5,
        }),
    ]);
```

**Рендеринг:**

- 3 карточки-метрики: Users, Projects, Invites
- Таблица «Последние пользователи» (email, role, дата)
- Таблица «Последние проекты» (title, автор, статус, дата)

---

## 4.2 Управление пользователями `GET /super-admin/users`

### Файл: `src/app/super-admin/users/page.tsx` (создать)

**Запрос:**

```ts
const allUsers = await db.query.users.findMany({
    orderBy: desc(users.createdAt),
});
```

**Рендеринг:**

- Поиск по email (клиентский фильтр или query param)
- Таблица: Email, Role, Active, Created, Actions
- Действия:
    - **Toggle Active** — `toggleUserActive(userId)` (Server Action)
    - **Set Role** — выпадающий список `admin` / `user` → `setUserRole(userId, role)` (Server Action)
    - Кнопка «Set Admin» / «Revoke Admin» в зависимости от текущей роли

**Server Actions (в `src/lib/actions/admin.ts`):**

```ts
'use server';
export async function toggleUserActive(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
    await db
        .update(users)
        .set({ isActive: user.isActive ? 0 : 1 })
        .where(eq(users.id, userId));
    revalidatePath('/super-admin/users');
}

export async function setUserRole(userId: string, role: 'admin' | 'user') {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath('/super-admin/users');
}
```

---

## 4.3 Генерация инвайтов `GET /super-admin/invites`

### Файл: `src/app/super-admin/invites/page.tsx` (создать)

**Форма создания:**

- Email (опционально — если указан, инвайт привязан к email)
- Expires At (дата, опционально)
- Кнопка «Generate»

**Server Action: `createInvite`**

```ts
'use server';
export async function createInvite(data: {
    email?: string;
    expiresAt?: number;
}) {
    const code = crypto.randomUUID().slice(0, 8).toUpperCase();
    await db.insert(invites).values({
        id: crypto.randomUUID(),
        code,
        email: data.email || null,
        createdByUserId: userId, // из заголовков
        expiresAt: data.expiresAt || null,
    });
    revalidatePath('/super-admin/invites');
}
```

**Таблица инвайтов:**

- Code, Email, Created By, Used By, Expires, Status (active/used/expired)
- Кнопка «Revoke» (удаляет инвайт)

**Server Action: `revokeInvite`**

```ts
'use server';
export async function revokeInvite(inviteId: string) {
    await db.delete(invites).where(eq(invites.id, inviteId));
    revalidatePath('/super-admin/invites');
}
```

---

## 4.4 Модерация проектов `GET /super-admin/projects`

### Файл: `src/app/super-admin/projects/page.tsx` (создать)

**Запрос:**

```ts
const allProjects = await db.query.projects.findMany({
    with: {
        profile: { columns: { fullName: true, slug: true } },
    },
    orderBy: desc(projects.createdAt),
});
```

**Рендеринг:**

- Фильтр по статусу (All / Draft / Published)
- Таблица: Title, Author, Status, Homepage, Views, Created
- Действия:
    - **Toggle Homepage** — `toggleHomepage(projectId)` (меняет `showOnHomepage`)
    - **View** — ссылка на публичную страницу `/u/[slug]/[projectSlug]`

**Server Action:**

```ts
'use server';
export async function toggleHomepage(projectId: string) {
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });
    await db
        .update(projects)
        .set({ showOnHomepage: project.showOnHomepage ? 0 : 1 })
        .where(eq(projects.id, projectId));
    revalidatePath('/super-admin/projects');
}
```

---

## 4.5 Layout суперадминки

### Файл: `src/app/super-admin/layout.tsx` (создать, если нет)

Навигация:

- Overview (`/super-admin`)
- Users (`/super-admin/users`)
- Invites (`/super-admin/invites`)
- Projects (`/super-admin/projects`)

---

## Проверка после выполнения

- [ ] `/super-admin` показывает статистику
- [ ] `/super-admin/users` — поиск, блокировка, смена роли
- [ ] Назначение `admin` работает, пользователь получает доступ к `/super-admin/*`
- [ ] Снятие `admin` работает, пользователь теряет доступ к `/super-admin/*`
- [ ] `/super-admin/invites` — создание и отзыв инвайтов
- [ ] `/super-admin/projects` — модерация, скрытие с главной
- [ ] `tsc --noEmit` проходит без ошибок
- [ ] Нет инлайн-стилей и хардкода HEX

---

## Файлы этапа (checklist)

| Действие   | Файл                                    |
| ---------- | --------------------------------------- |
| Переписать | `src/app/super-admin/page.tsx`          |
| Создать    | `src/app/super-admin/layout.tsx`        |
| Создать    | `src/app/super-admin/users/page.tsx`    |
| Создать    | `src/app/super-admin/invites/page.tsx`  |
| Создать    | `src/app/super-admin/projects/page.tsx` |
| Создать    | `src/lib/actions/admin.ts`              |
