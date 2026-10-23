import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { verifyJwt } from '@/lib/jwt';

/**
 * GET /api/session — состояние авторизации для клиентского AuthBar.
 *
 * Зачем: раньше AuthBar был серверным компонентом и читал cookies() +
 * verifyJwt + запрос в D1 на каждом рендере /, /platform, /u/[slug] —
 * это делало все эти маршруты динамическими (SSR на каждый запрос,
 * CPU воркера впустую). Теперь AuthBar — клиентский, а проверка сессии
 * живёт здесь: один лёгкий JSON-запрос вместо рендера страницы.
 *
 * Ответ:
 *  - неавторизован / невалидный токен → { authenticated: false }
 *  - авторизован → { authenticated: true, userId, role, profileSlug }
 *    (profileSlug — null, если профиля ещё нет; ссылка «Редактировать
 *    сайт» не показывается)
 *
 * Роут всегда динамический (cookies()) — кешировать нельзя.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json(
                { authenticated: false },
                { headers: { 'Cache-Control': 'no-store' } },
            );
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { authenticated: false },
                { headers: { 'Cache-Control': 'no-store' } },
            );
        }

        const payload = await verifyJwt(token, jwtSecret);
        if (!payload) {
            return NextResponse.json(
                { authenticated: false },
                { headers: { 'Cache-Control': 'no-store' } },
            );
        }

        const { userId, role } = payload as { userId: string; role: string };

        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);
        const profile = await db.query.profiles.findFirst({
            where: { userId },
            columns: { slug: true },
        });

        return NextResponse.json(
            {
                authenticated: true,
                userId,
                role,
                profileSlug: profile?.slug ?? null,
            },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    } catch {
        // Не авторизованный пользователь — дефолтный рендер AuthBar
        // (ссылка «Войти»), не ошибка.
        return NextResponse.json(
            { authenticated: false },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    }
}
