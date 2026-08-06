import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { verifyJwt } from '@/lib/jwt';

export default async function AdminDashboardPage() {
    const cookiesList = await cookies();

    const token = cookiesList.get('auth-token');
    if (!token?.value) redirect('/login');

    const { env } = await getCloudflareContext();
    const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not configured');
    const payload = await verifyJwt(token!.value, jwtSecret);
    if (!payload?.userId) redirect('/login');

    const db = getDb(env.DB);
    const user = await db.query.users.findFirst({
        where: {
            id: payload.userId as string,
        },
    });
    if (!user || user.role !== 'admin') redirect('/login');

    return (
        <main className='p-8'>
            <h1 className='text-2xl font-bold'>Панель управления дизайнера</h1>
            <p className='mt-2 text-gray-600'>Список моих проектов</p>
        </main>
    );
}
