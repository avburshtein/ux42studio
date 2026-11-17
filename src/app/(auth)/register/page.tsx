import RegisterForm from '@/components/auth/RegisterForm';
import { CONTACT_EMAIL } from '@/lib/contact';

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

            {/* Фидбэк 2026-11-17: закрытый доступ сообщаем вежливо —
                гость без приглашения сразу понимает, куда написать */}
            <p className='mb-6 rounded-md border border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant'>
                Регистрация открыта только по приглашениям: код приходит в
                письме. Не получили приглашение? Напишите нам на{' '}
                <a
                    href={`mailto:${CONTACT_EMAIL.hello}`}
                    className='font-medium text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    {CONTACT_EMAIL.hello}
                </a>{' '}
                — и мы с радостью вас пригласим.
            </p>

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
