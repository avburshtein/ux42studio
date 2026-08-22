import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects, profiles } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import { toggleHomepage } from '@/lib/actions/admin';

export default async function SuperAdminProjectsPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const allProjects = await db
        .select({
            id: projects.id,
            title: projects.title,
            slug: projects.slug,
            status: projects.status,
            showOnHomepage: projects.showOnHomepage,
            viewsCount: projects.viewsCount,
            createdAt: projects.createdAt,
            authorName: profiles.fullName,
            authorSlug: profiles.slug,
        })
        .from(projects)
        .leftJoin(profiles, eq(projects.profileId, profiles.id))
        .orderBy(desc(projects.createdAt));

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <PageTitle className='mb-6' tag='h1'>
                Модерация всех проектов
            </PageTitle>

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
                                Homepage
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Views
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Created
                            </th>
                            <th className='px-4 py-3 text-right text-label-md text-on-surface-variant'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProjects.map((p) => (
                            <tr
                                key={p.id}
                                className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                            >
                                <td className='px-4 py-3 text-body-sm text-on-surface'>
                                    {p.title}
                                </td>
                                <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                    {p.authorName || '—'}
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
                                <td className='px-4 py-3'>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                            p.showOnHomepage
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'bg-surface-variant text-on-surface-variant'
                                        }`}
                                    >
                                        {p.showOnHomepage ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                    {p.viewsCount}
                                </td>
                                <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                    {new Date(
                                        p.createdAt * 1000,
                                    ).toLocaleDateString('ru-RU')}
                                </td>
                                <td className='px-4 py-3 text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <form
                                            action={async () => {
                                                'use server';
                                                await toggleHomepage(p.id);
                                            }}
                                        >
                                            <Button
                                                variant='ghost'
                                                type='submit'
                                            >
                                                {p.showOnHomepage
                                                    ? 'Hide'
                                                    : 'Show'}
                                            </Button>
                                        </form>
                                        {p.authorSlug && p.slug && (
                                            <Link
                                                href={`/u/${p.authorSlug}/${p.slug}`}
                                            >
                                                <Button variant='ghost'>
                                                    View
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {allProjects.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className='px-4 py-6 text-center text-body-sm text-on-surface-variant'
                                >
                                    Нет проектов
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
