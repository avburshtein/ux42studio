import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string | string[] }>;
}) {
    // Токен приходит из письма: /reset-password?token=…
    const params = await searchParams;
    const raw = Array.isArray(params.token) ? params.token[0] : params.token;
    const token = (raw ?? '').trim();

    return (
        <>
            <h1 className='text-2xl font-bold mb-2'>Новый пароль</h1>
            <p className='mb-6 text-body-sm text-on-surface-variant'>
                Придумайте новый пароль — минимум 8 символов. После сохранения
                войдите с ним как обычно.
            </p>
            <ResetPasswordForm token={token} />
        </>
    );
}
