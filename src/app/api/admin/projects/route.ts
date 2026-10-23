import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { verifyJwt } from '@/lib/jwt';

/**
 * GET /api/admin/projects — данные дашборда /admin для клиентского рендера.
 *
 * Зачем: дашборд был серверным компонентом (headers() + 2 запроса в D1 на
 * каждый просмотр) — SSR на каждый клик по вкладкам статуса. Теперь страница
 * /admin — статический shell, а данные приходят одним JSON-запросом.
 *
 * Ответ:
 *  - { profile: { slug, caseSortMode }, projects: [...] }
 *    (projects — все проекты профиля; фильтр по статусу — на клиенте)
 *  - 401, если токена нет/невалиден
 *
 * Роут всегда динамический (cookies()) — кешировать нельзя.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    const jwtSecret = process.env.JWT_SECRET;
    if (!token || !jwtSecret) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJwt(token, jwtSecret);
    if (!payload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = payload as { userId: string };

    try {
        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        const profile = await db.query.profiles.findFirst({
            where: { userId },
            columns: { id: true, slug: true, caseSortMode: true },
        });
        if (!profile) {
            return NextResponse.json(
                { message: 'Profile not found' },
                { status: 404 },
            );
        }

        const projectList = await db.query.projects.findMany({
            where: { profileId: profile.id },
            orderBy: (p, { desc }) => [desc(p.updatedAt)],
            columns: {
                id: true,
                title: true,
                slug: true,
                status: true,
                viewsCount: true,
                updatedAt: true,
                publishedAt: true,
                createdAt: true,
                sortOrder: true,
            },
        });

        return NextResponse.json(
            {
                profile: {
                    slug: profile.slug,
                    caseSortMode: profile.caseSortMode,
                },
                projects: projectList,
            },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    } catch {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
