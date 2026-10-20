import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <>
            <h1 className='text-2xl font-bold mb-2'>Забыли пароль?</h1>
            <p className='mb-6 text-body-sm text-on-surface-variant'>
                Укажите email аккаунта — пришлём письмо с одноразовой
                ссылкой, по которой вы придумаете новый пароль.
            </p>
            <ForgotPasswordForm />
        </>
    );
}
