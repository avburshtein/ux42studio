'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { deleteMyAccount } from '@/lib/actions/account';

/**
 * «Удаление профиля» (раздел настроек /admin/settings): удаление учётной
 * записи. Существует по требованию GDPR Art. 17 — субъект данных должен
 * иметь реальный способ реализовать право на удаление.
 *
 * Живёт в разделе «Удаление профиля» настроек (/admin/settings). Компонент
 * рисует только содержимое — поверхность (Card с error-рамкой) задаёт
 * страница, поэтому вложенного `<main>`/`FormBox` здесь больше нет.
 *
 * Операция необратима: удаляются аккаунт, профиль, все кейсы и все
 * загруженные изображения (включая объекты в R2). Поэтому подтверждение —
 * вводом email, а не просто кнопка.
 */

/** Ошибки серверного экшена на русский: админка — RU (§6.1 дизайн-системы). */
const ERROR_TEXT: Record<string, string> = {
    'Not authenticated': 'Сессия истекла — войдите заново',
    'User not found': 'Аккаунт не найден',
    'Email does not match this account':
        'Email не совпадает с адресом этого аккаунта',
    'Server error': 'Не удалось удалить аккаунт',
};

export default function DeleteAccountSection({
    accountEmail,
}: {
    accountEmail: string;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const matches =
        confirm.trim().toLowerCase() === accountEmail.trim().toLowerCase();

    async function onDelete() {
        if (!matches || busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = await deleteMyAccount(confirm);
            if (res.error) {
                setError(
                    ERROR_TEXT[res.error] ??
                        'Не удалось удалить аккаунт. Попробуйте позже или напишите на privacy@ux42.studio.',
                );
                setBusy(false);
                return;
            }
            // Сессия удалена вместе с аккаунтом — уводим на главную.
            router.push('/');
            router.refresh();
        } catch {
            setError(
                'Не удалось удалить аккаунт. Попробуйте позже или напишите на privacy@ux42.studio.',
            );
            setBusy(false);
        }
    }

    return (
        <div>
            <div className='flex items-start gap-3'>
                <AlertTriangle
                    size={20}
                    className='mt-0.5 shrink-0 text-error'
                    aria-hidden='true'
                />
                <div>
                    <h2 className='text-title-md text-on-surface'>
                        Удаление профиля
                    </h2>
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Операция необратима. Будут стёрты: учётная запись,
                        публичный профиль, все кейсы и все загруженные
                        изображения. Восстановить их будет невозможно.
                    </p>
                    <p className='mt-2 text-body-sm text-on-surface-variant'>
                        Если хотите просто скрыть портфолио, не удаляйте
                        профиль — переключатель «Публикация сайта» в разделе
                        «Аккаунт» настроек профиля.
                    </p>
                </div>
            </div>

            {!open ? (
                /* Отбивка линией и отступ 24px: раньше кнопка стояла
                   в 8px (pt-2) от текста и была выровнена по иконке,
                   а не по тексту — визуально «уезжала» влево. */
                <div className='mt-6 border-t border-outline-variant pt-6'>
                    {/* Как в GitHub: контур и текст кнопки в error,
                        заливка появляется только на hover. Финальное
                        действие — сплошной `variant='destructive'`. */}
                    <Button
                        type='button'
                        variant='outline'
                        className='border-error text-error hover:bg-error/10'
                        onClick={() => setOpen(true)}
                    >
                        <Trash2 className='h-4 w-4' aria-hidden='true' />
                        Удалить профиль
                    </Button>
                </div>
            ) : (
                <div className='mt-6 border-t border-outline-variant pt-6'>
                    <div className='max-w-sm'>
                        <Label htmlFor='confirm-email'>
                            Для подтверждения введите email аккаунта
                        </Label>
                        <Input
                            id='confirm-email'
                            type='email'
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder={accountEmail}
                            autoComplete='off'
                        />
                        <p className='mt-1 min-h-[1.5rem] text-body-sm text-on-surface-variant'>
                            {accountEmail}
                        </p>
                    </div>

                    {error && (
                        <p role='alert' className='text-body-sm text-error'>
                            {error}
                        </p>
                    )}

                    <div className='mt-4 flex flex-wrap gap-3'>
                        <Button
                            type='button'
                            variant='destructive'
                            onClick={onDelete}
                            disabled={!matches || busy}
                        >
                            <Trash2 className='h-4 w-4' aria-hidden='true' />
                            {busy ? 'Удаляем…' : 'Удалить навсегда'}
                        </Button>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => {
                                setOpen(false);
                                setConfirm('');
                                setError(null);
                            }}
                            disabled={busy}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}