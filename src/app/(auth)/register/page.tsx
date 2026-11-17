import RegisterPageContent from '@/components/auth/RegisterPageContent';

// Invite-код читается на сервере и передаётся пропом: клиентский
// useSearchParams прятал контент под Suspense-фолбэк, RGPD-уведомление
// пропадало из статического HTML (поймано smoke-тестом). Динамический
// SSR /register — осознанно: приватная noindex-страница, трафик низкий.
export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ invite?: string | string[] }>;
}) {
    const params = await searchParams;
    const raw = Array.isArray(params.invite)
        ? params.invite[0]
        : params.invite;
    const inviteCode = (raw ?? '').trim();

    return <RegisterPageContent inviteCode={inviteCode} />;
}
