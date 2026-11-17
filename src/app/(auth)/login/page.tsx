import LoginForm from '@/components/auth/LoginForm';
import { CONTACT_EMAIL } from '@/lib/contact';

export default function LoginPage() {
    return (
        <>
            <h1 className='text-2xl font-bold mb-4'>Вход в систему</h1>
            {/* Фидбэк 2026-11-17: о закрытом доступе сообщаем вежливо и
                сразу — до того, как гость заполнит форму и упрётся в ошибку */}
            <p className='mb-6 rounded-md border border-outline-variant bg-surface-container-low p-4 text-body-sm text-on-surface-variant'>
                Пока платформа открыта по приглашениям. Если у вас ещё нет
                аккаунта — напишите нам на{' '}
                <a
                    href={`mailto:${CONTACT_EMAIL.hello}`}
                    className='font-medium text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                >
                    {CONTACT_EMAIL.hello}
                </a>
                , и мы вышлем приглашение.
            </p>
            <LoginForm />
        </>
    );
}
