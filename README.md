# UX42 Studio & Portfolio Platform

Мультиарендная платформа портфолио для дизайнеров на Next.js + Cloudflare (D1, R2, Workers).

## Стек

- **Фронтенд:** Next.js (App Router, Server Actions)
- **БД:** Cloudflare D1 + Drizzle ORM
- **Хранилище:** Cloudflare R2
- **Стили:** Tailwind CSS v4 + Material Design 3 (seed: `#0B6E4F`)
- **Деплой:** Cloudflare Pages / Workers via `@opennextjs/cloudflare`

## Разработка

```bash
npm run dev        # Next.js dev server
npm run preview    # Локальный Cloudflare runtime
npm run deploy     # Деплой в Cloudflare
```

## Создание первого суперадмина

### Локально

1. Создай `.dev.vars` с переменными:

    ```
    ADMIN_EMAIL=admin@ux42.studio
    ADMIN_PASSWORD=your-secure-password
    JWT_SECRET=your-secret-key
    ```

2. Запусти `npm run dev` и вызови:
    ```bash
    curl -X POST http://localhost:3000/api/auth/init
    ```

### Продакшен

1. Установи секреты в Cloudflare:

    ```bash
    npx wrangler secret put ADMIN_EMAIL
    npx wrangler secret put ADMIN_PASSWORD
    npx wrangler secret put JWT_SECRET
    ```

2. Задеплой и вызови **один раз**:

    ```bash
    curl -X POST https://ux42.studio/api/auth/init
    ```

3. **Сразу после успешного ответа** удали секреты:

    ```bash
    npx wrangler secret delete ADMIN_EMAIL
    npx wrangler secret delete ADMIN_PASSWORD
    ```

    `JWT_SECRET` не удаляй — он нужен для работы middleware.

4. Войди под созданным админом в `/super-admin`. Чтобы назначить других админов: `/super-admin/users` → «Set Admin».

> **Важно:** эндпоинт `/api/auth/init` срабатывает только один раз. Повторный вызов вернёт `403 Forbidden`.
