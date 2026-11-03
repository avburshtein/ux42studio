'use client';

import { AdminSection } from '@/components/admin/AdminSection';
import { useAdminLang } from '@/components/admin/AdminLang';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { setProfileVisibility } from '@/lib/actions/profile';

type PublicationToggleProps = {
    profileId: string;
    /** Текущее состояние из БД: 1 = опубликован, 0 = скрыт. */
    initialIsPublic: boolean;
};

/**
 * Переключатель «Скрыть сайт» (раздел «Аккаунт» настроек).
 *
 * Что делает скрытие: страница /u/{slug} отдаёт 404 всем, кроме владельца,
 * кейсы пропадают с главной и с /platform, профиль выпадает из sitemap.
 * Кейсы и настройки при этом сохраняются — включение возвращает всё.
 *
 * Переключатель применяет изменение сразу, поэтому состояние описываем
 * словами рядом с ним — пользователь должен понимать, что произошло,
 * не перечитывая подписи.
 */
export default function PublicationToggle({
    profileId,
    initialIsPublic,
}: PublicationToggleProps) {
    const { t } = useAdminLang();
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function toggle(checked: boolean) {
        setPending(true);
        setError(null);
        try {
            const res = await setProfileVisibility(profileId, checked);
            if (res.error) {
                setError(res.error);
                return; // состояние не меняем — переключатель вернётся Radix
            }
            setIsPublic(checked);
        } catch {
            setError(t('pubToggle.fail'));
        } finally {
            setPending(false);
        }
    }

    return (
        <AdminSection
            title={
                <span className='flex items-center gap-2'>
                    {isPublic ? (
                        <Eye
                            className='h-5 w-5 shrink-0 text-primary'
                            aria-hidden='true'
                        />
                    ) : (
                        <EyeOff
                            className='h-5 w-5 shrink-0 text-on-surface-variant'
                            aria-hidden='true'
                        />
                    )}
                    {t('pubToggle.title')}
                </span>
            }
            description={
                <>
                    {t('pubToggle.descPrefix')}
                    <span className='font-mono text-body-sm'>
                        {' '}
                        /u/{'{slug}'}
                    </span>{' '}
                    {t('pubToggle.descSuffix')}
                </>
            }
        >
            <div className='min-w-0 flex-1'>
                {/* Статус словами — не только цветом и положением
                        переключателя (§5.1 «не полагаться на цвет»). */}
                <div className='mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-4'>
                        <p
                            role='status'
                            className='text-body-sm text-on-surface'
                        >
                            {isPublic
                                ? t('pubToggle.on')
                                : t('pubToggle.off')}
                        </p>

                        <div className='flex items-center gap-3'>
                            <Switch
                                checked={isPublic}
                                onCheckedChange={toggle}
                                disabled={pending}
                                aria-label={
                                    isPublic
                                        ? t('pubToggle.actionHide')
                                        : t('pubToggle.actionPublish')
                                }
                            />
                            <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                disabled={pending}
                                onClick={() => toggle(!isPublic)}
                            >
                                {pending
                                    ? t('pubToggle.applying')
                                    : isPublic
                                      ? t('pubToggle.actionHide')
                                      : t('pubToggle.actionPublish')}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <p role='alert' className='mt-3 text-body-sm text-error'>
                            {error}
                        </p>
                    )}

                    <p className='mt-3 text-body-sm text-on-surface-variant'>
                        {t('pubToggle.footer')}
                    </p>
            </div>
        </AdminSection>
    );
}
