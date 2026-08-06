import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects, profiles } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { deleteProject } from '@/lib/actions/projects';

export default async function AdminDashboardPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    if (!profile) {
        redirect('/admin/profile');
    }

    const projectList = await db.query.projects.findMany({
        where: { profileId: profile.id },
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    });

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <h1 className='text-headline-sm text-on-background'>
                        Мои проекты
                    </h1>
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Управляйте своими кейсами
                    </p>
                </div>
                <Link href='/admin/projects/new'>
                    <Button>Создать проект</Button>
                </Link>
            </div>

            {projectList.length === 0 ? (
                <Card className='flex flex-col items-center gap-4 py-16 text-center'>
                    <p className='text-body-lg text-on-surface-variant'>
                        У вас пока нет проектов
                    </p>
                    <Link href='/admin/projects/new'>
                        <Button>Создать первый проект</Button>
                    </Link>
                </Card>
            ) : (
                <div className='overflow-x-auto rounded-lg border border-outline-variant'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-outline-variant bg-surface-variant/50'>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Название
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Статус
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Просмотры
                                </th>
                                <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                    Обновлён
                                </th>
                                <th className='px-4 py-3 text-right text-label-md text-on-surface-variant'>
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectList.map((project) => (
                                <tr
                                    key={project.id}
                                    className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                                >
                                    <td className='px-4 py-3 text-body-sm text-on-surface'>
                                        {project.title}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                                project.status === 'published'
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : 'bg-surface-variant text-on-surface-variant'
                                            }`}
                                        >
                                            {project.status === 'published'
                                                ? 'Опубликован'
                                                : 'Черновик'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {project.viewsCount}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {new Date(
                                            project.updatedAt * 1000,
                                        ).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className='px-4 py-3 text-right'>
                                        <div className='flex items-center justify-end gap-2'>
                                            <Link
                                                href={`/admin/projects/${project.id}/edit/general`}
                                            >
                                                <Button variant='ghost'>
                                                    Ред.
                                                </Button>
                                            </Link>
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await deleteProject(
                                                        project.id,
                                                    );
                                                }}
                                            >
                                                <Button
                                                    variant='ghost'
                                                    type='submit'
                                                    className='text-error'
                                                >
                                                    Удалить
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
