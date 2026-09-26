/**
 * Профиль студии — чьи кейсы показываются на главной `/` (решение (69),
 * 2026-09-26: главная переведена в режим «студия + основатель», витрина
 * чужих работ переехала на /platform).
 *
 * Почему это отдельный модуль, а не константа в page.tsx: пока профиль один,
 * фильтр «свои кейсы» неотличим от «все кейсы». Как только на платформе
 * появится второй дизайнер, общий каталог на главной станет витриной
 * чужого портфолио — ровно то, что решали убрать.
 *
 * Источник значения — переменная окружения STUDIO_PROFILE_SLUG (slug из
 * /u/{slug}). Если она не задана, берётся самый ранний профиль (createdAt
 * asc): на текущих данных это prf_denis_01 = aleksandra-burshtein.
 *
 * Переменная НЕ секретная — в проде задаётся в Cloudflare Dashboard →
 * Settings → Variables или в wrangler.toml [vars]; локально — в .dev.vars.
 */

/** Имя переменной окружения (wrangler.toml [vars] / .dev.vars). */
export const STUDIO_PROFILE_SLUG_VAR = 'STUDIO_PROFILE_SLUG';

/**
 * Достаёт slug профиля студии из окружения.
 *
 * Принимает `unknown`, а не CloudflareEnv, намеренно: значение приходит из
 * `getCloudflareContext().env`, тип которого генерируется `npm run cf-typegen`
 * и не содержит пользовательских переменных до запуска этой команды. Так
 * модуль не ломает `npm run typecheck` на свежем клоне репозитория.
 *
 * @param env объект env из getCloudflareContext (или null)
 * @returns slug профиля или null, если переменная не задана/пустая
 */
export function readStudioProfileSlug(env: unknown): string | null {
    const fromCloudflare =
        typeof env === 'object' && env !== null
            ? (env as Record<string, unknown>)[STUDIO_PROFILE_SLUG_VAR]
            : undefined;

    // В dev Next.js кладёт .dev.vars в process.env, в воркере — только env.
    const raw =
        typeof fromCloudflare === 'string' && fromCloudflare
            ? fromCloudflare
            : process.env[STUDIO_PROFILE_SLUG_VAR];

    const slug = typeof raw === 'string' ? raw.trim() : '';
    return slug ? slug : null;
}
