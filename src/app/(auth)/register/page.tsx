import RegisterForm from '@/components/auth/RegisterForm';

// Те же шаги, что и в письме-приглашении
// (src/lib/email/templates.ts) — на случай, если человек пришёл
// по прямой ссылке, а письмо не открывал.
const STEPS = [
    'Введите код из письма — 8 символов, регистр не важен.',
    'Укажите email, на который пришло приглашение.',
    'Нажмите «Зарегистрироваться»: пароль создастся сам и покажется один раз.',
];

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ invite?: string | string[] }>;
}) {
    // Код из ссылки /register?invite=CODE (её формирует createInvite) —
    // подставляем в форму, чтобы не вводить вручную.
    const params = await searchParams;
    const raw = Array.isArray(params.invite)
        ? params.invite[0]
        : params.invite;
    const inviteCode = (raw ?? '').trim();

    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>Регистрация по инвайту</h1>

            <ol className='mb-6 space-y-1 text-body-sm text-on-surface-variant'>
                {STEPS.map((step, i) => (
                    <li key={step} className='flex gap-2'>
                        <span className='font-semibold text-primary'>
                            {i + 1}.
                        </span>
                        <span>{step}</span>
                    </li>
                ))}
            </ol>

            <RegisterForm defaultInviteCode={inviteCode} />
        </>
    );
}
