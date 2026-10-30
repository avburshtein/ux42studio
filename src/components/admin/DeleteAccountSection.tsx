'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { deleteMyAccount } from '@/lib/actions/account';

/**
 * «{t('delAcc.title')}» (раздел настроек /admin/settings): удаление учётной
 * записи. Существует по требованию GDPR Art. 17 — субъект данных должен
 * иметь реальный способ реализовать право на удаление.
 *
 * Живёт в разделе «{t('delAcc.title')}» настроек (/admin/settings). Компонент
 * рисует только содержимое — поверхность (Card с error-рамкой) задаёт
 * страница, поэтому вложенного `<main>`/`FormBox` здесь больше нет.
 *
 * Операция необратима: удаляются аккаунт, профиль, все кейсы и все
 * загруженные изображения (включая объекты в R2). Поэтому подтверждение —
 * вводом email, а не просто кнопка.
 */

/** Коды ошибок серверного экшена → ключи словаря (D-012: двуязычность). */
const ERROR_TEXT: Record<string, string> = {
    'Not authenticated': 'delAcc.errAuth',
    'User not found': 'delAcc.errUser',
    'Email does not match this account': 'delAcc.errEmail',
    'Server error': 'delAcc.errServer',
};

export default function DeleteAccountSection({
    accountEmail,
}: {
    accountEmail: string;
}) {
    const { t } = useAdminLang();
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
                    t(
                        ERROR_TEXT[res.error] ??
                            'delAcc.errGeneric',
                    ),
                );
                setBusy(false);
                return;
            }
            // Сессия удалена вместе с аккаунтом — уводим на главную.
            router.push('/');
            router.refresh();
        } catch {
            setError(t('delAcc.errGeneric'));
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
                        {t('delAcc.title')}
                    </h2>
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        {t('delAcc.desc')}
                    </p>
                    <p className='mt-2 text-body-sm text-on-surface-variant'>
                        {t('delAcc.altHint')}
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
                        {t('delAcc.trigger')}
                    </Button>
                </div>
            ) : (
                <div className='mt-6 border-t border-outline-variant pt-6'>
                    <div className='max-w-sm'>
                        <Label htmlFor='confirm-email'>
                            {t('delAcc.confirmLabel')}
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
                            {busy ? t('delAcc.deleting') : t('delAcc.confirmBtn')}
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
                            {t('common.cancel')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}