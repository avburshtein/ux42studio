import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <>
            <h1 className='text-2xl font-bold mb-2'>Восстановление пароля</h1>
            <p className='mb-6 text-body-sm text-on-surface-variant'>
                Вы указали email аккаунта, на который мы в течение
                нескольких минут пришлём письмо с одноразовой ссылкой —
                перейдя по ней, вы придумаете новый пароль.
            </p>
            <ForgotPasswordForm />
        </>
    );
}
