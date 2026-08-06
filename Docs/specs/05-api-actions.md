# Spec: Этап 5 — API и Server Actions

> Часть общего плана: `Docs/implementation-plan.md`
> Зависимости: Этап 1 (middleware), Этап 3 (админка — нужны Server Actions для wizard'а)
> Ожидаемый результат: работает загрузка в R2, health check проверяет D1 и R2, все Server Actions готовы

---

## Контекст проекта

- **Стек:** Next.js (App Router) + Cloudflare D1 + Drizzle ORM + R2 + Tailwind CSS v4
- **Адаптер:** `@opennextjs/cloudflare` (`getCloudflareContext().env.DB`, `env.R2`)
- **Схема БД:** `src/db/schema/` — 16 таблиц
- **Дизайн-система:** Material Design 3, seed `#0B6E4F`
- **Правила:** ❌ инлайн-стили, ❌ хардкод HEX

### Ключевые таблицы

| Таблица       | Поля                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| `files`       | id, uploaderId, r2Key, fileName, mimeType, sizeBytes, width, height, createdAt |
| `users`       | id, email, passwordHash, role, isActive                                        |
| `invites`     | id, code, email, createdByUserId, usedByUserId, expiresAt                      |
| `projects`    | все поля                                                                       |
| `profiles`    | все поля                                                                       |
| `socialLinks` | все поля                                                                       |

---

## 5.1 Upload в R2 `POST /api/upload`

### Файл: `src/app/api/upload/route.ts` (переписать)

**Текущее состояние:** заглушка-плейсхолдер.

**Логика:**

1. Проверить авторизацию (кука `auth-token` → JWT → userId)
2. Принять `multipart/form-data` с файлом
3. Валидировать:
    - MIME-тип: только изображения (`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`)
    - Размер: макс 10 MB
4. Сгенерировать `r2Key`: `uploads/{userId}/{crypto.randomUUID()}-{fileName}`
5. Загрузить в R2: `env.R2.put(r2Key, file.stream(), { httpMetadata: { contentType } })`
6. Записать метаданные в `files`:
    ```ts
    await db.insert(files).values({
        id: crypto.randomUUID(),
        uploaderId: userId,
        r2Key,
        fileName,
        mimeType: contentType,
        sizeBytes: file.size,
        width, // из метаданных изображения (если доступно)
        height, // из метаданных изображения (если доступно)
    });
    ```
7. Вернуть `{ fileId, r2Key, url: `/r2/${r2Key}` }`

**Важно:** R2 в Cloudflare Workers доступен через `env.R2` (бакет должен быть настроен в `wrangler.toml`). Проверить, что бакет называется, например, `UX42_MEDIA` и доступен через `env.UX42_MEDIA`.

### Альтернатива: Presigned URL (если прямая загрузка не работает)

Если `env.R2.put()` недоступен в рантайме Next.js на Cloudflare, использовать presigned URL:

1. `POST /api/upload` → генерирует presigned URL через Web Crypto API
2. Клиент загружает файл напрямую в R2 по presigned URL
3. `POST /api/upload/confirm` → клиент подтверждает загрузку, сервер записывает метаданные в `files`

**Выбор подхода:** начать с прямого `env.R2.put()`. Если не работает — переключиться на presigned URL.

---

## 5.2 Health Check `GET /api/health`

### Файл: `src/app/api/health/route.ts` (переписать)

**Текущее состояние:** возвращает только `{ status: 'ok', timestamp }`.

**Новая логика:**

```ts
const checks: Record<string, { status: 'ok' | 'error'; message?: string }> = {};

// D1 check
try {
    await db
        .select({ val: sql`1` })
        .from(users)
        .limit(1);
    checks.d1 = { status: 'ok' };
} catch (e) {
    checks.d1 = { status: 'error', message: String(e) };
}

// R2 check
try {
    await env.UX42_MEDIA.list({ limit: 1 });
    checks.r2 = { status: 'ok' };
} catch (e) {
    checks.r2 = { status: 'error', message: String(e) };
}

const allOk = Object.values(checks).every((c) => c.status === 'ok');
return NextResponse.json(
    { status: allOk ? 'ok' : 'degraded', checks, timestamp: Date.now() },
    { status: allOk ? 200 : 503 },
);
```

---

## 5.3 Server Actions

### Файл: `src/lib/actions/auth.ts` (создать)

```ts
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    redirect('/login');
}
```

### Файл: `src/lib/actions/projects.ts` (создать — детали в Этапе 3)

Содержит 7 Server Actions для wizard'а:

- `updateProjectMeta`
- `updateProjectProblem`
- `updateProjectResearch` (db.batch)
- `updateProjectDesign`
- `updateProjectShowcase` (db.batch)
- `updateProjectReview` (db.batch)
- `deleteProject`

### Файл: `src/lib/actions/profile.ts` (создать — детали в Этапе 3)

Содержит:

- `updateProfile`
- `addSocialLink`
- `removeSocialLink`

### Файл: `src/lib/actions/admin.ts` (создать — детали в Этапе 4)

Содержит:

- `toggleUserActive`
- `setUserRole`
- `createInvite`
- `revokeInvite`
- `toggleHomepage`

### Файл: `src/lib/actions/upload.ts` (создать)

```ts
'use server';
// getPresignedUrl — если выбран подход с presigned URL
// confirmUpload — подтверждение загрузки, запись в files
```

---

## 5.4 Баррель-экспорт

### Файл: `src/lib/actions/index.ts` (создать)

```ts
export * from './auth';
export * from './projects';
export * from './profile';
export * from './admin';
export * from './upload';
```

---

## Проверка после выполнения

- [ ] `POST /api/upload` принимает файл и сохраняет в R2
- [ ] Метаданные файла записываются в таблицу `files`
- [ ] `GET /api/health` проверяет D1 и R2
- [ ] `logout()` удаляет куку и редиректит
- [ ] Все Server Actions из Этапов 3 и 4 реализованы
- [ ] `tsc --noEmit` проходит без ошибок

---

## Файлы этапа (checklist)

| Действие   | Файл                          |
| ---------- | ----------------------------- |
| Переписать | `src/app/api/upload/route.ts` |
| Переписать | `src/app/api/health/route.ts` |
| Создать    | `src/lib/actions/auth.ts`     |
| Создать    | `src/lib/actions/projects.ts` |
| Создать    | `src/lib/actions/profile.ts`  |
| Создать    | `src/lib/actions/admin.ts`    |
| Создать    | `src/lib/actions/upload.ts`   |
| Создать    | `src/lib/actions/index.ts`    |
