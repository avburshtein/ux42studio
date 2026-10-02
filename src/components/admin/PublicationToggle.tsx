'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
            setError('Не удалось изменить видимость');
        } finally {
            setPending(false);
        }
    }

    return (
        <Card className='p-6'>
            <div className='flex items-start gap-3'>
                {isPublic ? (
                    <Eye
                        className='mt-0.5 h-5 w-5 shrink-0 text-primary'
                        aria-hidden='true'
                    />
                ) : (
                    <EyeOff
                        className='mt-0.5 h-5 w-5 shrink-0 text-on-surface-variant'
                        aria-hidden='true'
                    />
                )}
                <div className='min-w-0 flex-1'>
                    <h2 className='text-title-md text-on-surface'>
                        Публикация сайта
                    </h2>
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Определяет, видна ли ваша страница
                        <span className='font-mono text-body-sm'>
                            {' '}
                            /u/{'{slug}'}
                        </span>{' '}
                        посетителям.
                    </p>

                    {/* Статус словами — не только цветом и положением
                        переключателя (§5.1 «не полагаться на цвет»). */}
                    <div className='mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-4'>
                        <p
                            role='status'
                            className='text-body-sm text-on-surface'
                        >
                            {isPublic
                                ? 'Сайт опубликован и виден всем.'
                                : 'Сайт скрыт: виден только вам, пока вы вошли в аккаунт.'}
                        </p>

                        <div className='flex items-center gap-3'>
                            <Switch
                                checked={isPublic}
                                onCheckedChange={toggle}
                                disabled={pending}
                                aria-label={
                                    isPublic
                                        ? 'Скрыть сайт'
                                        : 'Опубликовать сайт'
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
                                    ? 'Применяем…'
                                    : isPublic
                                      ? 'Скрыть сайт'
                                      : 'Опубликовать'}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <p role='alert' className='mt-3 text-body-sm text-error'>
                            {error}
                        </p>
                    )}

                    <p className='mt-3 text-body-sm text-on-surface-variant'>
                        Кейсы и настройки при этом не трогаются: включение
                        возвращает всё как было. Скрытый сайт по-прежнему
                        открывается у вас в браузере, пока вы авторизованы.
                    </p>
                </div>
            </div>
        </Card>
    );
}
