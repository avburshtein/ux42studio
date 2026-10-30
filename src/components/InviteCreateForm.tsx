'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailCheck, MailWarning, TriangleAlert } from 'lucide-react';
import { createInvite } from '@/lib/actions/admin';
import type { EmailSendStatus } from '@/lib/email/send';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import CodeChip from '@/components/CodeChip';

type Created = {
    code: string;
    email: string | null;
    mail: EmailSendStatus | null;
};

/**
 * Форма создания инвайта.
 *
 * Раньше результат `createInvite` (код) выбрасывался, и администратор
 * должен был лезть в базу за кодом. Теперь код показывается сразу, вместе
 * со статусом отправки письма: если почта не настроена или письмо не
 * ушло, код всё равно можно скопировать и отправить вручную.
 */
export default function InviteCreateForm({
    createdByUserId,
}: {
    createdByUserId: string;
}) {
    const { t } = useAdminLang();
    const [email, setEmail] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [created, setCreated] = useState<Created | null>(null);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);
        try {
            // Дата из <input type="date"> приходит как 'YYYY-MM-DD' без времени.
            // Трактовать её как конец дня, иначе код «истекает» в полночь
            // того же дня, когда выдан.
            const expiresAtUnix = expiresAt
                ? Math.floor(
                      new Date(`${expiresAt}T23:59:59`).getTime() / 1000,
                  )
                : undefined;

            const result = await createInvite({
                email: email.trim(),
                createdByUserId,
                expiresAt: expiresAtUnix,
            });
            setCreated({
                code: result.code,
                email: result.email,
                mail: result.mail,
            });
            setEmail('');
            setExpiresAt('');
            // Таблица инвайтов — серверный компонент: без refresh новый
            // инвайт в ней не появится до перезагрузки страницы.
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : t('inviteForm.fail'),
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className='space-y-4'>
            <form onSubmit={onSubmit} className='flex flex-wrap items-end gap-4'>
                <div className='flex min-w-64 flex-col gap-1'>
                    <Label htmlFor='invite-email'>
                        {t('inviteForm.emailLabel')}
                    </Label>
                    <Input
                        id='invite-email'
                        name='email'
                        type='email'
                        required
                        placeholder='user@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <Label htmlFor='invite-expires'>
                        {t('inviteForm.expiresLabel')}
                    </Label>
                    <Input
                        id='invite-expires'
                        name='expiresAt'
                        type='date'
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                    />
                </div>
                <Button type='submit' disabled={saving} aria-busy={saving}>
                    {saving ? t('inviteForm.saving') : t('inviteForm.submit')}
                </Button>
            </form>

            {error && (
                <p role='alert' className='text-body-sm text-error'>
                    {error}
                </p>
            )}

            {created && (
                <div className='space-y-3 rounded-lg border border-outline-variant bg-surface-container-low p-4'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span className='text-title-sm text-on-surface'>
                            {t('inviteForm.created')}
                        </span>
                        <CodeChip value={created.code} />
                        <a
                            href={`/register?invite=${encodeURIComponent(created.code)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-body-sm text-primary underline decoration-1 underline-offset-2 hover:opacity-80'
                        >
                            {t('inviteForm.openRegister')}
                        </a>
                    </div>

                    {/* Статус письма. Отправка не роняет создание инвайта,
                        поэтому сообщаем, что именно произошло. */}
                    {created.mail?.status === 'sent' && (
                        <p className='flex items-start gap-2 text-body-sm text-primary'>
                            <MailCheck className='mt-0.5 h-4 w-4 shrink-0' />
                            <span>
                                {t('inviteForm.mailSent', {
                                    email: created.email ?? '',
                                })}
                            </span>
                        </p>
                    )}

                    {created.mail?.status === 'failed' && (
                        <p className='flex items-start gap-2 text-body-sm text-error'>
                            <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0' />
                            <span>
                                {t('inviteForm.mailFail', {
                                    error: created.mail.error ?? '—',
                                })}
                            </span>
                        </p>
                    )}

                    {(!created.mail ||
                        created.mail.status === 'not_configured') && (
                        <p className='flex items-start gap-2 text-body-sm text-on-surface-variant'>
                            <MailWarning className='mt-0.5 h-4 w-4 shrink-0' />
                            <span>
                                {t('inviteForm.mailUnconfigured')}
                            </span>
                        </p>
                    )}

                    <div className='flex justify-end'>
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => setCreated(null)}
                        >
                            {t('inviteForm.createAnother')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
