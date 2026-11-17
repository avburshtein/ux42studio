'use client';

import React, {
    useEffect,
    useRef,
    useState,
    useTransition,
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, ExternalLink, GripVertical, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
    archiveProject,
    deleteProject,
    publishProject,
    reorderProjects,
    setCaseSortMode,
    unpublishProject,
    unarchiveProject,
} from '@/lib/actions/projects';
import type { CaseSortMode } from '@/db/schema/profiles';
import { cn } from '@/lib/utils';
import { useAdminLang } from '@/components/admin/AdminLang';

export type CaseProjectRow = {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    viewsCount: number;
    updatedLabel: string;
};

interface CaseSortManagerProps {
    profileSlug: string;
    mode: CaseSortMode;
    autoRows: CaseProjectRow[];
    manualRows: CaseProjectRow[];
    /** Колбэк для клиентского дашборда (/admin): страница теперь статический
     *  shell, данные приходят из /api/admin/projects, поэтому router.refresh()
     *  не доставит новые пропсы — родитель сам перезагружает данные. */
    onRefresh?: () => void;
}

const SORT_OPTIONS: Array<{ value: CaseSortMode; labelKey: string }> = [
    { value: 'newest', labelKey: 'projects.sortNewest' },
    { value: 'oldest', labelKey: 'projects.sortOldest' },
    { value: 'alpha_asc', labelKey: 'projects.sortAlphaAsc' },
    { value: 'alpha_desc', labelKey: 'projects.sortAlphaDesc' },
    { value: 'manual', labelKey: 'projects.sortManual' },
];

const STATUS_META: Record<
    CaseProjectRow['status'],
    { labelKey: string; className: string }
> = {
    published: {
        labelKey: 'projects.statusPublished',
        className: 'bg-primary-container text-on-primary-container',
    },
    draft: {
        labelKey: 'projects.statusDraft',
        className: 'bg-surface-variant text-on-surface-variant',
    },
    archived: {
        labelKey: 'projects.statusArchived',
        className: 'bg-surface-variant text-on-surface-variant',
    },
};

interface RowActionsProps {
    row: CaseProjectRow;
    profileSlug: string;
    onDelete: (id: string) => void;
    onSetStatus: (
        id: string,
        action: 'archive' | 'unarchive' | 'publish' | 'unpublish',
    ) => void;
    pending: boolean;
}

// Контент строки без ручки: заголовок-ссылка, чип статуса, просмотры,
// дата обновления, действия (как в прежней таблице /admin).
function RowContent({
    row,
    profileSlug,
    onDelete,
    onSetStatus,
    pending,
}: RowActionsProps) {
    const meta = STATUS_META[row.status];
    const { t } = useAdminLang();
    return (
        // Мобила: заголовок+badge и кнопки действий — двумя строками,
        // чтобы действия не уезжали за край (D-008). ≥sm — один ряд.
        // Гап 3 (12px, фидбэк 2026-11-17): gap-1 прижимал бейдж статуса
        // к сегментному переключателю — правило «внутри карточки
        // gap-3/gap-4» (design-system §2.3). ≥sm — row, gap-0.
        <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-0'>
            <div className='flex min-w-0 flex-1 items-center gap-2 px-2'>
                <div className='min-w-0 flex-1'>
                    <Link
                        href={`/admin/projects/${row.id}/edit/general`}
                        className='block overflow-hidden text-ellipsis whitespace-nowrap text-body-md font-medium text-on-surface hover:text-primary'
                    >
                        {row.title}
                    </Link>
                </div>

                <span
                    className={cn(
                        'inline-block shrink-0 rounded-full px-2 py-0.5 text-label-sm',
                        meta.className,
                    )}
                >
                    {t(meta.labelKey)}
                </span>

                <span className='hidden w-14 shrink-0 text-right text-body-sm text-on-surface-variant sm:block'>
                    {row.viewsCount}
                </span>
                <span className='hidden w-24 shrink-0 text-right text-body-sm text-on-surface-variant md:block'>
                    {row.updatedLabel}
                </span>
            </div>

            {/* Действия разделены на две группы (фидбэк 2026-11-03):
                слева — статус проекта сегментированным переключателем
                (M3 segmented button: видно выбранный статус), справа —
                опасное (удалить) и внешнее (открыть сайт) иконками.
                Так на мобильном не нужно гадать, какая кнопка что делает. */}
            <div className='flex flex-wrap items-center gap-2 pl-2'>
                <SegmentedControl
                    label={t('projects.statusLabel')}
                    value={row.status}
                    onValueChange={(next) => {
                        if (next === row.status) return;
                        if (next === 'published') {
                            onSetStatus(
                                row.id,
                                row.status === 'archived'
                                    ? 'unarchive'
                                    : 'publish',
                            );
                        } else if (next === 'draft') {
                            onSetStatus(row.id, 'unpublish');
                        } else {
                            onSetStatus(row.id, 'archive');
                        }
                    }}
                    options={[
                        { value: 'draft', label: t('projects.statusDraft') },
                        {
                            value: 'published',
                            label: t('projects.statusPublished'),
                        },
                        {
                            value: 'archived',
                            label: t('projects.statusArchived'),
                        },
                    ]}
                />

                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(row.id)}
                    disabled={pending}
                    aria-label={t('projects.delete')}
                    title={t('projects.delete')}
                    className='text-error'
                >
                    <Trash2 className='h-4 w-4' aria-hidden='true' />
                </Button>

                <Link
                    href={`/u/${profileSlug}/${row.slug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={t('projects.viewSite')}
                    title={t('projects.viewSite')}
                    className='inline-flex h-10 w-10 items-center justify-center rounded-md text-on-surface transition-colors hover:bg-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-background)]'
                >
                    <ExternalLink className='h-4 w-4' aria-hidden='true' />
                </Link>
            </div>
        </div>
    );
}

// Auto-режимы: строка без drag-логики (ручка видна, но неактивна —
// порядок задаёт выбранный режим, а не пользователь).
function PlainCaseRow(props: RowActionsProps) {
    return (
        <div className='border-b border-outline-variant last:border-0'>
            <div className='flex min-w-0 items-center px-2 py-2 hover:bg-surface-variant/30'>
                <span className='flex h-9 w-8 shrink-0 items-center justify-center opacity-25'>
                    <GripVertical
                        className='h-4 w-4 text-on-surface-variant'
                        aria-hidden='true'
                    />
                </span>
                <RowContent {...props} />
            </div>
        </div>
    );
}

// Manual-режим: sortable-строка dnd-kit; перетаскивание за ручку,
// чтобы не конфликтовать с кнопками действий.
function SortableCaseRow({
    row,
    profileSlug,
    onDelete,
    onSetStatus,
    pending,
}: RowActionsProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn(
                'border-b border-outline-variant last:border-0',
                isDragging && 'relative z-10 bg-surface-variant/40 shadow-md',
            )}
        >
            <div className='flex min-w-0 items-center px-2 py-2 hover:bg-surface-variant/30'>
                <button
                    type='button'
                    ref={setActivatorNodeRef}
                    className='flex h-9 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded text-on-surface-variant active:cursor-grabbing'
                    aria-label='Перетащить для изменения порядка'
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className='h-4 w-4' aria-hidden='true' />
                </button>
                <RowContent
                    row={row}
                    profileSlug={profileSlug}
                    onDelete={onDelete}
                    onSetStatus={onSetStatus}
                    pending={pending}
                />
            </div>
        </div>
    );
}

/**
 * Панель сортировки кейсов: один dropdown «Сортировка» с авто-режимами
 * и Manual. Авто-режим пересчитывается на сервере (router.refresh),
 * Manual — drag & drop строк с сохранением через reorderProjects
 * (projects.sort_order). Режим хранится в profiles.case_sort_mode и
 * управляет порядком публичной галереи. «Сохранено ✓» — как в WizardSaveBar.
 */
export default function CaseSortManager({
    profileSlug,
    mode: initialMode,
    autoRows,
    manualRows,
    onRefresh,
}: CaseSortManagerProps) {
    const { t } = useAdminLang();
    const router = useRouter();
    const [mode, setMode] = useState<CaseSortMode>(initialMode);
    const [manual, setManual] = useState<CaseProjectRow[]>(manualRows);
    const [saved, setSaved] = useState(false);
    const [pending, startTransition] = useTransition();
    const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Сервер прислал новые данные после router.refresh() — синхронизируем
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);
    useEffect(() => {
        setManual(manualRows);
    }, [manualRows]);

    useEffect(() => {
        return () => {
            if (savedTimer.current) clearTimeout(savedTimer.current);
        };
    }, []);

    const flashSaved = () => {
        setSaved(true);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaved(false), 2500);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    );

    const handleModeChange = (next: CaseSortMode) => {
        setMode(next);
        startTransition(async () => {
            await setCaseSortMode(next);
            // Auto-режимы пересчитываются на сервере; для Manual строки
            // (manualRows) уже загружены — refresh не нужен
            if (next !== 'manual') {
                router.refresh();
                onRefresh?.();
            }
            flashSaved();
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = manual.findIndex((r) => r.id === active.id);
        const newIndex = manual.findIndex((r) => r.id === over.id);
        if (oldIndex < 0 || newIndex < 0) return;
        const next = arrayMove(manual, oldIndex, newIndex);
        setManual(next);
        startTransition(async () => {
            await reorderProjects(next.map((r) => r.id));
            flashSaved();
        });
    };

    const removeRow = (id: string) => {
        setManual((prev) => prev.filter((r) => r.id !== id));
        startTransition(async () => {
            await deleteProject(id);
            router.refresh();
            onRefresh?.();
        });
    };

    const setStatus = (
        id: string,
        action: 'archive' | 'unarchive' | 'publish' | 'unpublish',
    ) => {
        startTransition(async () => {
            if (action === 'archive') {
                await archiveProject(id);
            } else if (action === 'unarchive') {
                await unarchiveProject(id);
            } else if (action === 'publish') {
                await publishProject(id);
            } else {
                await unpublishProject(id);
            }
            router.refresh();
            onRefresh?.();
        });
    };

    const rows = mode === 'manual' ? manual : autoRows;

    const rowProps = (row: CaseProjectRow) => ({
        row,
        profileSlug,
        onDelete: removeRow,
        onSetStatus: setStatus,
        pending,
    });

    return (
        <div className='mb-4'>
            {/* Панель: один dropdown вместо пары Toggle+Dropdown — Manual
                это просто ещё один вариант сортировки */}
            <div className='mb-3 flex flex-wrap items-center gap-3'>
                <label
                    htmlFor='case-sort-mode'
                    className='text-label-md text-on-surface-variant'
                >
                    {t('projects.sortLabel')}
                </label>
                {/* Нативный select рисует шеврон с непредсказуемыми отступами —
                    убираем appearance и рисуем свой: зазоры симметричны —
                    pl-3 слева = 12px между текстом и иконкой = 12px от
                    иконки до правого края */}
                <div className='relative'>
                    <select
                        id='case-sort-mode'
                        value={mode}
                        onChange={(e) =>
                            handleModeChange(e.target.value as CaseSortMode)
                        }
                        disabled={pending}
                        className='h-10 appearance-none rounded-md border border-outline-variant bg-surface pl-3 pr-10 text-body-md text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {t(opt.labelKey)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        aria-hidden='true'
                        className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant'
                    />
                </div>
                {pending ? (
                    <span className='inline-flex items-center gap-1.5 text-label-md text-on-surface-variant'>
                        <Loader2
                            className='h-4 w-4 animate-spin'
                            aria-hidden='true'
                        />
                        {t('common.saving')}
                    </span>
                ) : saved ? (
                    <span
                        className='inline-flex items-center gap-1.5 text-label-md text-primary'
                        role='status'
                    >
                        <Check className='h-4 w-4' aria-hidden='true' />
                        {t('common.saved')}
                    </span>
                ) : null}
            </div>

            {mode === 'manual' && (
                <p className='mb-2 text-body-sm text-on-surface-variant'>
                    {t('projects.manualHint')}
                </p>
            )}

            {mode === 'manual' ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={manual.map((r) => r.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='overflow-hidden rounded-lg border border-outline-variant'>
                            {manual.map((row) => (
                                <SortableCaseRow
                                    key={row.id}
                                    {...rowProps(row)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className='overflow-hidden rounded-lg border border-outline-variant'>
                    {rows.map((row) => (
                        <PlainCaseRow key={row.id} {...rowProps(row)} />
                    ))}
                </div>
            )}

            {rows.length === 0 && (
                <div className='rounded-lg border border-outline-variant px-4 py-6 text-body-sm text-on-surface-variant'>
                    Нет проектов в этой вкладке
                </div>
            )}
        </div>
    );
}
