'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAdminLang } from '@/components/admin/AdminLang';

/**
 * Флаг «Saved ✓» для шагов визарда кейса: markSaved() включает индикатор,
 * через 2.5 с он скрывается сам. Пока идёт сохранение, индикатор не показан.
 */
export function useSavedFlag(): [boolean, () => void] {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!saved) return;
        const timer = setTimeout(() => setSaved(false), 2500);
        return () => clearTimeout(timer);
    }, [saved]);

    return [saved, () => setSaved(true)];
}

type WizardSaveBarProps = {
    saving: boolean;
    saved: boolean;
    /**
     * Сохранить без перехода — валидация формы + onSaveOnly.
     * В страницах передаётся handleSubmit(onSaveOnly).
     */
    onSave: (e?: React.BaseSyntheticEvent) => void;
    /** Подпись основной кнопки (submit формы: сохранение + переход). */
    nextLabel?: string;
    /** Скрыть основную кнопку — шаг без следующего раздела (Review). */
    nextHidden?: boolean;
    /** Вариант кнопки Save (Review держит её primary). */
    saveVariant?: 'outline' | 'default';
    /** Куда ведёт кнопка Back — рендерится слева (mr-auto). */
    backHref?: string;
};

/**
 * Кнопки сохранения в футере шага визарда кейса: «Save» — сохранить и
 * остаться на разделе (чтобы сразу открыть превью), «Save & Next» —
 * сохранить и перейти к следующему разделу (submit формы). Рендерится
 * внутри flex-контейнера футера.
 *
 * Фидбэк 2026-11-17: Back переехал сюда из страниц (дублировался в 8
 * футерах), стрелки — Lucide ArrowLeft/ArrowRight вместо текстовых
 * «←/→» из словаря (ломали отступы при переносе), кнопки —
 * whitespace-nowrap, на узких экранах Back — только иконка.
 */
export default function WizardSaveBar({
    saving,
    saved,
    onSave,
    nextLabel,
    nextHidden = false,
    saveVariant = 'outline',
    backHref,
}: WizardSaveBarProps) {
    const { t } = useAdminLang();
    const router = useRouter();
    return (
        <div className='flex items-center gap-3'>
            {backHref && (
                <Button
                    type='button'
                    variant='ghost'
                    onClick={() => router.push(backHref)}
                    className='mr-auto whitespace-nowrap'
                >
                    <ArrowLeft size={16} aria-hidden='true' />
                    <span className='hidden sm:inline'>{t('common.back')}</span>
                    <span className='sr-only sm:hidden'>{t('common.back')}</span>
                </Button>
            )}
            {saved && !saving && (
                <span
                    className={`text-body-sm text-primary ${backHref ? '' : 'mr-auto'}`}
                    role='status'
                >
                    {t('common.saved')}
                </span>
            )}
            <Button
                type='button'
                variant={saveVariant}
                onClick={onSave}
                disabled={saving}
            >
                {saving ? t('common.saving') : t('common.save')}
            </Button>
            {!nextHidden && (
                <Button type='submit' disabled={saving}>
                    <span className='whitespace-nowrap'>
                        {saving ? t('common.saving') : nextLabel ?? t('wizard.saveNext')}
                    </span>
                    <ArrowRight size={16} aria-hidden='true' />
                </Button>
            )}
        </div>
    );
}
