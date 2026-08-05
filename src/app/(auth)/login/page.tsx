import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <main className='p-8 max-w-md mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Вход в систему</h1>
            <div>
                <LoginForm />
            </div>
        </main>
    );
}
