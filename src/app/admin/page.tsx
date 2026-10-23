'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

/** Ответ GET /api/admin/projects (см. src/app/api/admin/projects/route.ts). */
interface DashboardData {
    profile: { slug: string; caseSortMode: CaseSortMode | null };
    projects: {
        id: string;
        title: string;
        slug: string;
        status: CaseProjectRow['status'];
        viewsCount: number;
        updatedAt: number;
        publishedAt: number | null;
        createdAt: number;
        sortOrder: number;
    }[];
}

/**
 * Дашборд «Мои проекты» (/admin).
 *
 * Был серверным компонентом: headers() + два запроса в D1 + сортировка на
 * каждый просмотр и каждый клик по вкладке статуса (?status=... в
 * searchParams) — SSR и CPU воркера впустую для персональной страницы.
 *
 * Теперь — клиентский:
 *  - страница пререндерится как статический shell (вместе со всей веткой
 *    /admin после перевода layout на AdminShell);
 *  - данные — один GET /api/admin/projects; вкладки статуса фильтруют на
 *    клиенте (useState + history.replaceState — URL остаётся shareable,
 *    переходов к серверу нет);
 *  - сортировка/логика строк повторяет прежнюю серверную (решение
 *    2026-09-16, CaseSortManager): auto-режимы сортируются на клиенте,
 *    manual — по sort_order;
 *  - после мутаций CaseSortManager вызывает onRefresh → повторный fetch
 *    (раньше данные приезжали через router.refresh()).
 */
export default function AdminDashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [failed, setFailed] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    const load = useCallback(() => {
        fetch('/api/admin/projects', { cache: 'no-store' })
            .then((res) => {
                if (res.status === 404) {
                    // Профиля нет — прежний редирект на создание страницы
                    router.replace('/admin/profile');
                    return null;
                }
                if (!res.ok) throw new Error(String(res.status));
                return res.json() as Promise<DashboardData>;
            })
            .then((next) => {
                if (next) {
                    setData(next);
                    setFailed(false);
                }
            })
            .catch(() => setFailed(true));
    }, [router]);

    useEffect(() => {
        load();
    }, [load]);

    // Начальный фильтр статуса — из URL (?status=draft), после гидрации
    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get(
            'status',
        );
        if (fromUrl && STATUS_TABS.some((t) => t.value === fromUrl)) {
            setStatusFilter(fromUrl as StatusFilter);
        }
    }, []);

    const selectStatus = (value: StatusFilter) => {
        setStatusFilter(value);
        const url = value === 'all' ? '/admin' : `/admin?status=${value}`;
        window.history.replaceState(null, '', url);
    };

    // useMemo: [] при data===null создавал бы новый массив на каждый рендер
    // и ломал бы зависимости useMemo ниже (react-hooks/exhaustive-deps)
    const projectList = useMemo(() => data?.projects ?? [], [data]);

    // ---- Порядок строк (решение 2026-09-16, панель CaseSortManager) ----
    // Режим сортировки хранится в профиле; null = 'newest' (как раньше).
    const sortMode: CaseSortMode = data?.profile.caseSortMode ?? 'newest';

    const toRow = (
        project: DashboardData['projects'][number],
    ): CaseProjectRow => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        status: project.status,
        viewsCount: project.viewsCount,
        updatedLabel: new Date(
            project.updatedAt * 1000,
        ).toLocaleDateString('ru-RU'),
    });

    const sortKey = (p: DashboardData['projects'][number]) =>
        p.publishedAt ?? p.createdAt;
    const byTitleAsc = (
        a: DashboardData['projects'][number],
        b: DashboardData['projects'][number],
    ) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });

    const filteredProjects = useMemo(
        () =>
            statusFilter === 'all'
                ? projectList
                : projectList.filter((p) => p.status === statusFilter),
        [projectList, statusFilter],
    );

    const autoRows: CaseProjectRow[] = useMemo(() => {
        const sorted = [...filteredProjects];
        if (sortMode === 'oldest')
            sorted.sort((a, b) => sortKey(a) - sortKey(b));
        else if (sortMode === 'alpha_asc') sorted.sort(byTitleAsc);
        else if (sortMode === 'alpha_desc')
            sorted.sort((a, b) => byTitleAsc(b, a));
        else sorted.sort((a, b) => sortKey(b) - sortKey(a));
        return sorted.map(toRow);
    }, [filteredProjects, sortMode]);

    // Manual: sort_order (asc); tie-breaker — свежие выше
    const manualRows: CaseProjectRow[] = useMemo(
        () =>
            [...filteredProjects]
                .sort(
                    (a, b) =>
                        a.sortOrder - b.sortOrder || b.updatedAt - a.updatedAt,
                )
                .map(toRow),
        [filteredProjects],
    );

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
                    <button
                        key={tab.value}
                        type='button'
                        onClick={() => selectStatus(tab.value)}
                        className={`px-4 py-2 text-label-md -mb-px border-b-2 ${
                            statusFilter === tab.value
                                ? 'border-primary text-primary'
                                : 'border-transparent text-on-surface-variant hover:text-on-surface'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {data === null ? (
                <Card className='flex flex-col items-center gap-4 py-16 text-center'>
                    <p className='text-body-lg text-on-surface-variant'>
                        {failed
                            ? 'Не удалось загрузить проекты. Попробуйте обновить страницу.'
                            : 'Загружаем проекты…'}
                    </p>
                </Card>
            ) : projectList.length === 0 ? (
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
                    profileSlug={data.profile.slug}
                    mode={sortMode}
                    autoRows={autoRows}
                    manualRows={manualRows}
                    onRefresh={load}
                />
            )}
        </main>
    );
}
