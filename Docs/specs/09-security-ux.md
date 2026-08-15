# Spec: Этап 9 — Безопасность и UX (блокировка, logout, поиск)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (middleware), Этап 4 (суперадминка)
> Ожидаемый результат: заблокированный пользователь не может войти, кнопка выхода работает, поиск по email в суперадминке реализован

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`)
- **Авторизация:** JWT HS256 через `jose@^6`, кука `auth-token` (httpOnly, 7 дней)
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Ключевые таблицы

| Таблица | Поля                                    |
| ------- | --------------------------------------- |
| `users` | id, email, passwordHash, role, isActive |

---

## 9.1 Проверка блокировки пользователя (`isActive`)

### Проблема

Блокировка пользователя (`isActive = 0`) не проверяется при входе и в middleware — заблокированный всё ещё может войти.

### Решение

1. **При логине** (`src/app/api/auth/login/route.ts`): после проверки пароля проверить `isActive`. Если `isActive = 0` — вернуть `403` с сообщением «Account is blocked».
2. **В middleware** (`src/middleware.ts`): после верификации JWT проверить `isActive` пользователя в D1. Если заблокирован — удалить куку и редирект на `/login`.

### Важно про middleware (Edge-рантайм)

Middleware работает в Edge-рантайме. Доступ к D1 через `getCloudflareContext().env.DB` доступен, но запрос к БД на каждый запрос добавляет задержку. Альтернатива — проверять `isActive` только при логине (JWT stateless, блокировка вступит в силу после истечения токена или при следующем логине).

**Рекомендация:** проверять `isActive` при логине (обязательно) + опционально в middleware (если приемлема задержка). Минимально — блокировать вход.

### Псевдокод (login)

```ts
// после verifyPassword
const user = await db
    .select({ isActive: users.isActive })
    .from(users)
    .where(eq(users.email, email))
    .get();

if (!user || !user.isActive) {
    return NextResponse.json({ error: 'Account is blocked' }, { status: 403 });
}
```

---

## 9.2 Кнопка выхода (logout) в лейаутах

### Проблема

`logout()` (Server Action) существует, но кнопка выхода не заведена в лейаутах admin/super-admin.

### Решение

1. Добавить кнопку «Выйти» в `src/app/admin/layout.tsx` и `src/app/super-admin/layout.tsx`.
2. Кнопка вызывает Server Action `logout()` (из `src/lib/actions/auth.ts`).
3. Использовать иконку `LogOut` из `lucide-react`.

### Псевдокод

```tsx
import { logout } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';

// в layout
<form action={logout}>
    <button type='submit'>
        <LogOut />
        Выйти
    </button>
</form>;
```

### Файлы

| Действие  | Файл                             |
| --------- | -------------------------------- |
| Изменить  | `src/app/admin/layout.tsx`       |
| Изменить  | `src/app/super-admin/layout.tsx` |
| Проверить | `src/lib/actions/auth.ts`        |

---

## 9.3 Поиск по email в `/super-admin/users`

### Проблема

Поиск по email в `/super-admin/users` не реализован.

### Решение

1. В `src/app/super-admin/users/page.tsx` добавить поле поиска.
2. Реализовать серверную фильтрацию через `searchParams` (`?q=...`).
3. Использовать `like` из drizzle-orm для поиска по подстроке.

### Псевдокод

```ts
import { like } from 'drizzle-orm';

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    let query = db.select().from(users);

    if (searchParams.q) {
        query = query.where(like(users.email, `%${searchParams.q}%`));
    }

    const usersList = await query;
    // ...
}
```

### Файлы

| Действие | Файл                                 |
| -------- | ------------------------------------ |
| Изменить | `src/app/super-admin/users/page.tsx` |

---

## Проверка после выполнения

- [ ] Заблокированный пользователь не может войти (403)
- [ ] Кнопка «Выйти» работает в `/admin` и `/super-admin`
- [ ] Поиск по email фильтрует список пользователей
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие  | Файл                                 |
| --------- | ------------------------------------ |
| Изменить  | `src/app/api/auth/login/route.ts`    |
| Изменить  | `src/middleware.ts` (опционально)    |
| Изменить  | `src/app/admin/layout.tsx`           |
| Изменить  | `src/app/super-admin/layout.tsx`     |
| Проверить | `src/lib/actions/auth.ts`            |
| Изменить  | `src/app/super-admin/users/page.tsx` |
