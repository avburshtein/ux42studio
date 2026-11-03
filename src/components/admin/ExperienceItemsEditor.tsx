'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLang';
import {
    SortableItem,
    SortableList,
    reorderByIndex,
} from '@/components/admin/SortableList';
import type { ExperienceItem } from '@/lib/mainPageContent';

const textareaClass =
    'w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]';

/** Редактор списка опыта работы (D-015): компания / роль / период / описание. */
export function ExperienceItemsEditor({
    items,
    onChange,
}: {
    items: ExperienceItem[];
    onChange: (items: ExperienceItem[]) => void;
}) {
    const { t } = useAdminLang();
    const update = (i: number, patch: Partial<ExperienceItem>) =>
        onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

    return (
        <div className='flex flex-col gap-4'>
            <SortableList
                ids={items.map((_, i) => String(i))}
                onMove={(from, to) => onChange(reorderByIndex(items, from, to))}
            >
            {items.map((item, i) => (
                <SortableItem key={i} id={String(i)} handleLabel={t('mpc.dragHandle')}>
                <div className='flex flex-col gap-3 rounded-md border border-outline-variant p-4'>
                    <div className='flex items-end gap-2'>
                        <div className='flex-1'>
                            <Label htmlFor={`mp-exp-c-${i}`}>{t('mpc.company')}</Label>
                            <Input
                                id={`mp-exp-c-${i}`}
                                value={item.company}
                                onChange={(e) => update(i, { company: e.target.value })}
                            />
                        </div>
                        <div className='flex-1'>
                            <Label htmlFor={`mp-exp-r-${i}`}>{t('mpc.role')}</Label>
                            <Input
                                id={`mp-exp-r-${i}`}
                                value={item.role}
                                onChange={(e) => update(i, { role: e.target.value })}
                            />
                        </div>
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => onChange(items.filter((_, j) => j !== i))}
                            aria-label={`${t('mpc.removeItem')} ${item.company}`}
                        >
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor={`mp-exp-p-${i}`}>{t('mpc.period')}</Label>
                            <Input
                                id={`mp-exp-p-${i}`}
                                value={item.period}
                                placeholder='2021–2024'
                                onChange={(e) => update(i, { period: e.target.value })}
                            />
                        </div>
                        <div className='md:col-span-2'>
                            <Label htmlFor={`mp-exp-d-${i}`}>{t('mpc.description')}</Label>
                            <textarea
                                id={`mp-exp-d-${i}`}
                                rows={2}
                                className={textareaClass}
                                value={item.description}
                                onChange={(e) =>
                                    update(i, { description: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                </SortableItem>
            ))}
            </SortableList>
            <div>
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                        onChange([
                            ...items,
                            { company: '', role: '', period: '', description: '' },
                        ])
                    }
                >
                    <Plus className='mr-1 h-4 w-4' /> Add experience
                </Button>
            </div>
        </div>
    );
}
