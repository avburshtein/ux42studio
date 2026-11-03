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
import type { EducationItem } from '@/lib/mainPageContent';

/** Редактор списка образования (D-015): учреждение / степень / период / локация. */
export function EducationItemsEditor({
    items,
    onChange,
}: {
    items: EducationItem[];
    onChange: (items: EducationItem[]) => void;
}) {
    const { t } = useAdminLang();
    const update = (i: number, patch: Partial<EducationItem>) =>
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
                            <Label htmlFor={`mp-edu-i-${i}`}>{t('mpc.institution')}</Label>
                            <Input
                                id={`mp-edu-i-${i}`}
                                value={item.institution}
                                onChange={(e) =>
                                    update(i, { institution: e.target.value })
                                }
                            />
                        </div>
                        <div className='flex-1'>
                            <Label htmlFor={`mp-edu-d-${i}`}>{t('mpc.degree')}</Label>
                            <Input
                                id={`mp-edu-d-${i}`}
                                value={item.degree}
                                onChange={(e) => update(i, { degree: e.target.value })}
                            />
                        </div>
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => onChange(items.filter((_, j) => j !== i))}
                            aria-label={`${t('mpc.removeItem')} ${item.institution}`}
                        >
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor={`mp-edu-p-${i}`}>{t('mpc.period')}</Label>
                            <Input
                                id={`mp-edu-p-${i}`}
                                value={item.period}
                                placeholder='2015–2019'
                                onChange={(e) => update(i, { period: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor={`mp-edu-l-${i}`}>{t('mpc.locationOptional')}</Label>
                            <Input
                                id={`mp-edu-l-${i}`}
                                value={item.location ?? ''}
                                placeholder='Spain'
                                onChange={(e) => update(i, { location: e.target.value })}
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
                            {
                                institution: '',
                                degree: '',
                                period: '',
                                location: '',
                            },
                        ])
                    }
                >
                    <Plus className='mr-1 h-4 w-4' /> Add education
                </Button>
            </div>
        </div>
    );
}
