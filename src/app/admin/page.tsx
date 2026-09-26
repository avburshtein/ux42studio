import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import CaseSortManager, {
    type CaseProjectRow,
} from '@/components/admin/CaseSortManager';
import type { CaseSortMode } from '@/db/schema/profiles';

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
        columns: { id: true, slug: true, caseSortMode: true },
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
        orderBy: (p, { desc }) => [desc(p.updatedAt)],
    });

    // ---- Порядок строк (решение 2026-09-16, панель CaseSortManager) ----
    // Режим сортировки хранится в профиле; null = 'newest' (как раньше).
    const sortMode: CaseSortMode = profile.caseSortMode ?? 'newest';

    const toRow = (project: (typeof projectList)[number]): CaseProjectRow => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        status: project.status,
        viewsCount: project.viewsCount,
        updatedLabel: new Date(
            project.updatedAt * 1000,
        ).toLocaleDateString('ru-RU'),
    });

    const sortKey = (p: (typeof projectList)[number]) =>
        p.publishedAt ?? p.createdAt;
    const byTitleAsc = (
        a: (typeof projectList)[number],
        b: (typeof projectList)[number],
    ) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });

    const autoRows: CaseProjectRow[] = (() => {
        const sorted = [...projectList];
        if (sortMode === 'oldest')
            sorted.sort((a, b) => sortKey(a) - sortKey(b));
        else if (sortMode === 'alpha_asc') sorted.sort(byTitleAsc);
        else if (sortMode === 'alpha_desc')
            sorted.sort((a, b) => byTitleAsc(b, a));
        else sorted.sort((a, b) => sortKey(b) - sortKey(a));
        return sorted.map(toRow);
    })();

    // Manual: sort_order (asc); tie-breaker — свежие выше
    const manualRows: CaseProjectRow[] = [...projectList]
        .sort(
            (a, b) => a.sortOrder - b.sortOrder || b.updatedAt - a.updatedAt,
        )
        .map(toRow);

    return (
        <main className=''>
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
                <CaseSortManager
                    profileSlug={profile.slug}
                    mode={sortMode}
                    autoRows={autoRows}
                    manualRows={manualRows}
                />
            )}
        </main>
    );
}
