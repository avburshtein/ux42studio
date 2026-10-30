'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import {
    getProjectSubsections,
    updateProjectSubsections,
} from '@/lib/actions/projects';

type SubsectionDraft = {
    id?: string;
    sectionKey: string;
    heading: string;
    body: string;
};

interface SubsectionsEditorProps {
    projectId: string;
    /** Секции кейс-страницы, доступные в этом шаге визарда.
     *  Один ключ — селект не показывается; несколько — подраздел можно
     *  направить в нужную секцию (например, Showcase: Testing / Final Design). */
    sectionKeys: Array<{ key: string; label: string }>;
}

const textareaClass =
    'w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]';

// D-011: редактор подразделов внутри секции кейса. Каждый подраздел —
// заголовок (необязательно) + многопараграфный текст (RichText на кейс-
// странице: ссылки, списки, **жирный**). Сохраняется своей кнопкой,
// отдельно от формы шага (как ColorRolePicker / SectionsVisibilityEditor).
export default function SubsectionsEditor({
    projectId,
    sectionKeys,
}: SubsectionsEditorProps) {
    const { t } = useAdminLang();
    const keys = sectionKeys.map((s) => s.key);
    const [items, setItems] = useState<SubsectionDraft[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;
        getProjectSubsections(projectId)
            .then((rows) => {
                setItems(
                    (rows ?? [])
                        .filter((r) => keys.includes(r.sectionKey))
                        .map((r) => ({
                            id: r.id,
                            sectionKey: r.sectionKey,
                            heading: r.heading,
                            body: r.body ?? '',
                        })),
                );
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
        // keys приходят статикой из пропсов страницы — в deps не нужны
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        if (!saved) return;
        const timer = setTimeout(() => setSaved(false), 2500);
        return () => clearTimeout(timer);
    }, [saved]);

    const add = () =>
        setItems((prev) => [
            ...prev,
            {
                sectionKey: sectionKeys[0].key,
                heading: '',
                body: '',
            },
        ]);

    const remove = (index: number) =>
        setItems((prev) => prev.filter((_, i) => i !== index));

    const move = (index: number, dir: -1 | 1) =>
        setItems((prev) => {
            const j = index + dir;
            if (j < 0 || j >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[j]] = [next[j], next[index]];
            return next;
        });

    const update = (index: number, patch: Partial<SubsectionDraft>) =>
        setItems((prev) =>
            prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
        );

    const save = async () => {
        setSaving(true);
        setError(null);
        setSaved(false);
        try {
            await updateProjectSubsections(
                projectId,
                keys,
                items.map((s, i) => ({
                    id: s.id,
                    sectionKey: s.sectionKey,
                    heading: s.heading,
                    body: s.body,
                    order: i,
                })),
            );
            setSaved(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className='mb-3 flex items-center justify-between'>
                <Title variant='headline-md'>{t('sub.title')}</Title>
                <Button type='button' variant='ghost' onClick={add}>
                    <Plus className='mr-1 h-4 w-4' /> Add
                </Button>
            </div>
            <p className='mb-4 text-body-sm text-on-surface-variant'>
                {t('sub.desc')}
            </p>

            {!loaded ? (
                <p className='text-body-sm text-on-surface-variant'>
                    {t('sub.loading')}
                </p>
            ) : items.length === 0 ? (
                <p className='text-body-sm text-on-surface-variant'>
                    {t('sub.empty')}
                </p>
            ) : (
                <div className='space-y-4'>
                    {items.map((item, index) => (
                        <SubsectionRow
                            key={item.id ?? `new-${index}`}
                            index={index}
                            total={items.length}
                            item={item}
                            sectionKeys={sectionKeys}
                            onMove={move}
                            onRemove={remove}
                            onUpdate={update}
                        />
                    ))}
                </div>
            )}

            {error && <p className='mt-3 text-body-sm text-error'>{error}</p>}

            {items.length > 0 && (
                <div className='mt-4 flex items-center justify-end gap-3'>
                    <p
                        role='status'
                        className='text-body-sm text-primary'
                        aria-live='polite'
                    >
                        {saved ? t('sub.saved') : ''}
                    </p>
                    <Button
                        type='button'
                        onClick={save}
                        disabled={saving || !loaded}
                    >
                        {saving ? t('sub.saving') : t('sub.saveBtn')}
                    </Button>
                </div>
            )}
        </div>
    );
}


/** Карточка одного подраздела: селект секции (если ключей несколько),
 *  заголовок, текст, кнопки порядка и удаления. */
function SubsectionRow({
    index,
    total,
    item,
    sectionKeys,
    onMove,
    onRemove,
    onUpdate,
}: {
    index: number;
    total: number;
    item: SubsectionDraft;
    sectionKeys: Array<{ key: string; label: string }>;
    onMove: (index: number, dir: -1 | 1) => void;
    onRemove: (index: number) => void;
    onUpdate: (index: number, patch: Partial<SubsectionDraft>) => void;
}) {
    const { t } = useAdminLang();
    return (
        <div className='rounded-md border border-outline-variant bg-surface-container-high p-4'>
            <div className='mb-3 flex items-center justify-between'>
                <span className='text-title-lg text-on-surface'>
                    {t('sub.item', { n: index + 1 })}
                </span>
                <div className='flex items-center gap-1'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        aria-label='Move up'
                    >
                        <ArrowUp className='h-4 w-4' />
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() => onMove(index, 1)}
                        disabled={index === total - 1}
                        aria-label='Move down'
                    >
                        <ArrowDown className='h-4 w-4' />
                    </Button>
                    <Button
                        type='button'
                        variant='ghost'
                        className='text-error'
                        onClick={() => onRemove(index)}
                    >
                        Remove
                    </Button>
                </div>
            </div>

            {sectionKeys.length > 1 && (
                <div className='mb-3'>
                    <Label>{t('sub.sectionOnPage')}</Label>
                    <Select
                        value={item.sectionKey}
                        onValueChange={(v) =>
                            onUpdate(index, { sectionKey: v })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {sectionKeys.map((sk) => (
                                <SelectItem key={sk.key} value={sk.key}>
                                    {sk.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className='mb-3'>
                <Label>{t('sub.headingOpt')}</Label>
                <Input
                    value={item.heading}
                    onChange={(e) =>
                        onUpdate(index, { heading: e.target.value })
                    }
                    placeholder={t('sub.headingPh')}
                />
            </div>

            <div>
                <Label>{t('sub.body')}</Label>
                <textarea
                    rows={4}
                    className={textareaClass}
                    value={item.body}
                    onChange={(e) => onUpdate(index, { body: e.target.value })}
                    placeholder={t('sub.bodyPh')}
                />
                <p className='mt-1 text-body-sm text-on-surface-variant'>
                    {t('wizard.fmtHint')}
                </p>
            </div>
        </div>
    );
}
