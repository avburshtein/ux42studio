import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects, profiles, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import {
    deleteProject,
    archiveProject,
    unarchiveProject,
} from '@/lib/actions/projects';

const STATUS_TABS = [
    { value: 'all', label: 'Все' },
    { value: 'draft', label: 'Черновики' },
    { value: 'published', label: 'Опубликованные' },
    { value: 'archived', label: 'Архив' },
] as const;

type StatusFilter = (typeof STATUS_TABS)[number]['value'];

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true, slug: true },
    });

    if (!profile) {
        redirect('/admin/profile');
    }

    const params = await searchParams;
    const statusFilter: StatusFilter = STATUS_TABS.some(
        (t) => t.value === params.status,
    )
        ? (params.status as StatusFilter)
        : 'all';

    const projectList = await db.query.projects.findMany({
        where:
            statusFilter === 'all'
                ? { profileId: profile.id }
                : { profileId: profile.id, status: statusFilter },
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    });

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <div className=''>
                    <PageTitle>Мои проекты</PageTitle>
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Управляйте своими кейсами
                    </p>
                </div>

                <div>
                    <Link href='/admin/projects/new'>
                        <Button>Создать проект</Button>
                    </Link>
                </div>
            </div>

            <div className='mb-6 flex gap-2 border-b border-outline-variant pb-0'>
                {STATUS_TABS.map((tab) => (
                    <Link
                        key={tab.value}
                        href={
                            tab.value === 'all'
                                ? '/admin'
                                : `/admin?status=${tab.value}`
                        }
                        className={`px-4 py-2 text-label-md -mb-px border-b-2 ${
                            statusFilter === tab.value
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {projectList.length === 0 ? (
                <Card className='flex flex-col items-center gap-4 py-16 text-center'>
                    <p className='text-body-lg text-on-surface-variant'>
                        Проектов в этой категории нет
                    </p>
                    <Link href='/admin/projects/new'>
                        <Button>Создать проект</Button>
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
                                        <Link
                                            href={`/admin/projects/${project.id}/edit/general`}
                                        >
                                            {project.title}
                                        </Link>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                                project.status === 'published'
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : project.status ===
                                                        'archived'
                                                      ? 'bg-surface-variant text-on-surface-variant'
                                                      : 'bg-surface-variant text-on-surface-variant'
                                            }`}
                                        >
                                            {project.status === 'published'
                                                ? 'Опубликован'
                                                : project.status === 'archived'
                                                  ? 'Архив'
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
                                            {project.status === 'published' && (
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await archiveProject(
                                                            project.id,
                                                        );
                                                    }}
                                                >
                                                    <Button
                                                        variant='ghost'
                                                        type='submit'
                                                    >
                                                        В архив
                                                    </Button>
                                                </form>
                                            )}
                                            {project.status === 'archived' && (
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await unarchiveProject(
                                                            project.id,
                                                        );
                                                    }}
                                                >
                                                    <Button
                                                        variant='ghost'
                                                        type='submit'
                                                        className='text-primary'
                                                    >
                                                        Восстановить
                                                    </Button>
                                                </form>
                                            )}
                                            <Link
                                                href={`/u/${profile.slug}/${project.slug}`}
                                            >
                                                <Button variant='ghost'>
                                                    Перейти на сайт
                                                </Button>
                                            </Link>
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
