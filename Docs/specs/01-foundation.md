# Spec: Этап 1 — Фундамент (middleware + авторизация + лейаут)

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: нет (первый этап)
> Ожидаемый результат: работает инициализация админа, middleware защищает роуты, тёмная/светлая тема переключается

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4 + shadcn
- **Адаптер:** `@opennextjs/cloudflare` (доступ к D1 через `getCloudflareContext().env.DB`)
- **Схема БД:** `src/db/schema/` — 16 таблиц, контракты готовы, менять не нужно
- **Роуты:** структура папок `src/app/` уже создана
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`, шрифты Poppins + Inter, иконки `lucide-react`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX, все цвета через CSS-переменные

### Существующие файлы (не менять без необходимости)

| Файл                                   | Назначение                              |
| -------------------------------------- | --------------------------------------- |
| `src/db/index.ts`                      | `getDb(env.DB)` — инициализация Drizzle |
| `src/db/schema/users.ts`               | Таблицы `users`, `invites`              |
| `src/db/schema/index.ts`               | Реэкспорт всех схем                     |
| `src/lib/jwt.ts`                       | `signJwt()`, `verifyJwt()`              |
| `src/lib/crypto.ts`                    | `hashPassword()`, `verifyPassword()`    |
| `src/app/api/auth/login/route.ts`      | Работающий login (референс для init)    |
| `src/components/auth/LoginForm.tsx`    | Форма входа                             |
| `src/components/auth/RegisterForm.tsx` | Форма регистрации                       |
| `src/app/globals.css`                  | Глобальные стили                        |

---

## 1.1 `POST /api/auth/init` — одноразовая инициализация суперадмина

### Файл: `src/app/api/auth/init/route.ts` (создать)

**Логика:**

1. Проверить, есть ли хоть один пользователь в `users` → `db.select({ count: sql<number>`count(\*)` }).from(users)`
2. Если есть → `403 Forbidden` + `{ error: "Init already completed" }`
3. Если нет → создать пользователя с `role = 'admin'`:
    - `email` = `env.ADMIN_EMAIL` или `process.env.ADMIN_EMAIL`
    - `passwordHash` = `await hashPassword(env.ADMIN_PASSWORD)`
    - `id` = `crypto.randomUUID()`
4. Если переменные окружения не заданы → `500` + `{ error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set" }`
5. Создать JWT: `await signJwt({ userId: id, email, role: 'admin' }, jwtSecret)`
6. Установить куку `auth-token` (httpOnly, secure, sameSite: 'lax', maxAge: 7 дней)
7. Вернуть `{ ok: true }`

**Импорты:**

```ts
import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema/users';
import { sql } from 'drizzle-orm';
import { signJwt } from '@/lib/jwt';
import { hashPassword } from '@/lib/crypto';
```

**Важно:** эндпоинт НЕ требует авторизации (на старте её нет). Защита — через проверку `count > 0`.

---

## 1.2 Auth Middleware

### Файл: `src/middleware.ts` (создать)

**Логика:**

1. Проверять наличие куки `auth-token`
2. Если нет → редирект на `/login` для защищённых роутов
3. Декодировать JWT через `verifyJwt(token, jwtSecret)`
4. Извлечь `role` из payload
5. Для `/super-admin/*` → требовать `role === 'admin'`, иначе редирект на `/`
6. Для `/admin/*` → требовать `role === 'user'` или `role === 'admin'`
7. Пробрасывать `userId` и `role` в заголовки запроса: `x-user-id`, `x-user-role`

**Конфиг matcher:**

```ts
export const config = {
    matcher: ['/admin/:path*', '/super-admin/:path*'],
};
```

**Важно:** middleware в Edge-рантайме. `verifyJwt` должен работать без Node.js-зависимостей. Проверить, что `@/lib/jwt` использует библиотеку `jose@^6`, а не `jsonwebtoken` из Node.

### Файл: `src/lib/jwt.ts` (проверить/дописать)

Убедиться, что:

- `signJwt` и `verifyJwt` используют библиотеку `jose@^6` (`SignJWT`, `jwtVerify`), алгоритм HS256
- Нет импортов из `jsonwebtoken` или других Node.js-библиотек

---

## 1.3 Root Layout + Темизация

### Файл: `src/app/layout.tsx` (изменить)

**Что добавить:**

1. Импорт шрифтов Poppins + Inter через `next/font/google`
2. CSS-переменные Material Design 3 в `<html>`:
    - `data-theme="light"` / `data-theme="dark"` на `<html>`
    - Все токены: `--md-sys-color-primary`, `--md-sys-color-secondary`, `--md-sys-color-tertiary`, `--md-sys-color-error`, `--md-sys-color-surface`, `--md-sys-color-on-surface` и т.д.
3. `<ThemeProvider>` — клиентский компонент, читает `localStorage` / `prefers-color-scheme`, устанавливает `data-theme`

### Файл: `src/components/ThemeProvider.tsx` (создать)

Клиентский компонент (`'use client'`):

- При монтировании читает `localStorage.getItem('theme')` или `window.matchMedia('(prefers-color-scheme: dark)')`
- Устанавливает `document.documentElement.setAttribute('data-theme', theme)`
- Предоставляет `toggleTheme()` через контекст
- Кнопка переключения — иконка `Sun` / `Moon` из `lucide-react`

### Файл: `src/app/globals.css` (дополнить)

Добавить CSS-переменные для light и dark тем:

```css
:root,
[data-theme='light'] {
    --md-sys-color-primary: #0b6e4f;
    --md-sys-color-on-primary: #ffffff;
    --md-sys-color-primary-container: #a7f5d4;
    --md-sys-color-on-primary-container: #002116;
    --md-sys-color-secondary: #ff6467;
    --md-sys-color-on-secondary: #ffffff;
    --md-sys-color-secondary-container: #ffdad9;
    --md-sys-color-on-secondary-container: #410005;
    --md-sys-color-tertiary: #fbfffa;
    --md-sys-color-on-tertiary: #002116;
    --md-sys-color-error: #d17d00;
    --md-sys-color-on-error: #ffffff;
    --md-sys-color-surface: #fbfffa;
    --md-sys-color-on-surface: #191c1a;
    --md-sys-color-surface-variant: #dbe5dd;
    --md-sys-color-on-surface-variant: #3f4943;
    --md-sys-color-outline: #6f7972;
    --md-sys-color-outline-variant: #bfc9c1;
    /* Добавить все необходимые токены MD3 */
}

[data-theme='dark'] {
    --md-sys-color-primary: #8cf8c7;
    --md-sys-color-on-primary: #003826;
    --md-sys-color-primary-container: #00513a;
    --md-sys-color-on-primary-container: #a7f5d4;
    --md-sys-color-secondary: #ffb3b1;
    --md-sys-color-on-secondary: #680011;
    --md-sys-color-secondary-container: #93001c;
    --md-sys-color-on-secondary-container: #ffdad9;
    --md-sys-color-tertiary: #191c1a;
    --md-sys-color-on-tertiary: #fbfffa;
    --md-sys-color-error: #ffb870;
    --md-sys-color-on-error: #4a2800;
    --md-sys-color-surface: #191c1a;
    --md-sys-color-on-surface: #e1e3df;
    --md-sys-color-surface-variant: #3f4943;
    --md-sys-color-on-surface-variant: #bfc9c1;
    --md-sys-color-outline: #89938c;
    --md-sys-color-outline-variant: #3f4943;
    /* Добавить все необходимые токены MD3 */
}
```

**Важно:** Tailwind v4 должен быть настроен на использование этих переменных. Проверить `postcss.config.mjs` и `tailwind.config` (если есть).

---

## 1.4 Auth Layout

### Файл: `src/app/(auth)/layout.tsx` (создать, если нет)

Центрированная форма:

```tsx
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-[var(--md-sys-color-surface)]'>
            <main className='w-full max-w-md p-8'>{children}</main>
        </div>
    );
}
```

---

## 1.5 Страница логина

### Файл: `src/app/(auth)/login/page.tsx` (проверить/создать)

Использует существующий `LoginForm` из `src/components/auth/LoginForm.tsx`.

### Файл: `src/app/(auth)/register/page.tsx` (проверить/создать)

Использует существующий `RegisterForm` из `src/components/auth/RegisterForm.tsx`.

---

## Проверка после выполнения

- [ ] `POST /api/auth/init` создаёт админа при пустой БД
- [ ] `POST /api/auth/init` возвращает 403 при повторном вызове
- [ ] Middleware редиректит на `/login` без куки
- [ ] Middleware пускает `admin` в `/super-admin/*`
- [ ] Middleware НЕ пускает `user` в `/super-admin/*`
- [ ] Переключение тёмной/светлой темы работает
- [ ] Все цвета берутся из CSS-переменных (нет хардкода HEX)
- [ ] Шрифты Poppins + Inter загружаются
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие          | Файл                                        |
| ----------------- | ------------------------------------------- |
| Создать           | `src/app/api/auth/init/route.ts`            |
| Создать           | `src/middleware.ts`                         |
| Проверить         | `src/lib/jwt.ts` (Web Crypto совместимость) |
| Изменить          | `src/app/layout.tsx`                        |
| Создать           | `src/components/ThemeProvider.tsx`          |
| Изменить          | `src/app/globals.css` (MD3 токены)          |
| Создать/проверить | `src/app/(auth)/layout.tsx`                 |
| Проверить         | `src/app/(auth)/login/page.tsx`             |
| Проверить         | `src/app/(auth)/register/page.tsx`          |
