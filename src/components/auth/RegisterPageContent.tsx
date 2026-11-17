'use client';

import { CONTACT_EMAIL } from '@/lib/contact';
import { useAdminLang } from '@/components/admin/AdminLang';
import RegisterForm from './RegisterForm';

// Те же шаги, что и в письме-приглашении
// (src/lib/email/templates.ts) — на случай, если человек пришёл
// по прямой ссылке, а письмо не открывал.
const STEP_KEYS = ['auth.step1', 'auth.step2', 'auth.step3'] as const;

/**
 * Клиентская обёртка /register: заголовок, плашка приглашений и шаги
 * переводятся мгновенно при переключении ru/en (D-032). Invite-код
 * приходит пропом со страницы (server searchParams): useSearchParams
 * уводил контент под Suspense-фолбэк, и RGPD-уведомление исчезало из
 * статического HTML (словил smoke-тест) — поэтому здесь его нет.
 */
export default function RegisterPageContent({
    inviteCode = '',
}: {
    /** Код из ссылки /register?invite=CODE (читает серверная страница). */
    inviteCode?: string;
}) {
    const { t } = useAdminLang();

    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>
                {t('auth.registerTitle')}
            </h1>

            {/* Фидбэк 2026-11-17: закрытый доступ сообщаем вежливо —
                гость без приглашения сразу понимает, куда написать */}
            <p className='mb-6 rounded-md border border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant'>
                {t('auth.registerInviteNote1')}
                <a
                    href={`mailto:${CONTACT_EMAIL.hello}`}
                    className='font-medium text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    {CONTACT_EMAIL.hello}
                </a>
                {t('auth.registerInviteNote2')}
            </p>

            <ol className='mb-6 space-y-1 text-body-sm text-on-surface-variant'>
                {STEP_KEYS.map((key, i) => (
                    <li key={key} className='flex gap-2'>
                        <span className='font-semibold text-primary'>
                            {i + 1}.
                        </span>
                        <span>{t(key)}</span>
                    </li>
                ))}
            </ol>

            <RegisterForm defaultInviteCode={inviteCode} />
        </>
    );
}

