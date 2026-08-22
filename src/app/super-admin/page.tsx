import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, projects, invites, profiles } from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm';
import { Card } from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import Title from '@/components/ui/Title';

export default async function SuperAdminOverviewPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const [
        usersCount,
        projectsCount,
        invitesCount,
        recentUsers,
        recentProjects,
    ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(projects),
        db.select({ count: sql<number>`count(*)` }).from(invites),
        db.query.users.findMany({
            orderBy: (users, { desc }) => [desc(users.createdAt)],
            limit: 5,
        }),
        db
            .select({
                id: projects.id,
                title: projects.title,
                status: projects.status,
                createdAt: projects.createdAt,
                fullName: profiles.fullName,
            })
            .from(projects)
            .leftJoin(profiles, eq(projects.profileId, profiles.id))
            .orderBy(desc(projects.createdAt))
            .limit(5),
    ]);

    const metrics = [
        { label: 'Users', value: usersCount[0]?.count ?? 0 },
        { label: 'Projects', value: projectsCount[0]?.count ?? 0 },
        { label: 'Invites', value: invitesCount[0]?.count ?? 0 },
    ];

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <PageTitle className='mb-6' tag='h1'>
                Обзорная статистика
            </PageTitle>

            <div className='mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {metrics.map((m) => (
                    <Card key={m.label}>
                        <p className='text-label-md text-on-surface-variant'>
                            {m.label}
                        </p>
                        <p className='text-display-sm text-on-surface mt-1'>
                            {m.value}
                        </p>
                    </Card>
                ))}
            </div>

            <div className='mb-10'>
                <Title className='mb-4'>Последние пользователи</Title>
                <div className='overflow-x-auto rounded-lg border border-outline-variant'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-outline-variant bg-surface-variant/50'>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Email
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Role
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Created
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((u) => (
                                <tr
                                    key={u.id}
                                    className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                                >
                                    <td className='px-4 py-3 text-body-sm text-on-surface'>
                                        {u.email}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                                u.role === 'admin'
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : 'bg-surface-variant text-on-surface-variant'
                                            }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {new Date(
                                            u.createdAt * 1000,
                                        ).toLocaleDateString('ru-RU')}
                                    </td>
                                </tr>
                            ))}
                            {recentUsers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className='px-4 py-6 text-center text-body-sm text-on-surface-variant'
                                    >
                                        Нет пользователей
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <Title className='mb-4'>Последние проекты</Title>
                <div className='overflow-x-auto rounded-lg border border-outline-variant'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-outline-variant bg-surface-variant/50'>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Title
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Author
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Status
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Created
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProjects.map((p) => (
                                <tr
                                    key={p.id}
                                    className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                                >
                                    <td className='px-4 py-3 text-body-sm text-on-surface'>
                                        {p.title}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {p.fullName ?? '—'}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                                p.status === 'published'
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : 'bg-surface-variant text-on-surface-variant'
                                            }`}
                                        >
                                            {p.status === 'published'
                                                ? 'Опубликован'
                                                : 'Черновик'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {new Date(
                                            p.createdAt * 1000,
                                        ).toLocaleDateString('ru-RU')}
                                    </td>
                                </tr>
                            ))}
                            {recentProjects.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className='px-4 py-6 text-center text-body-sm text-on-surface-variant'
                                    >
                                        Нет проектов
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
