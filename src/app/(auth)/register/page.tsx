import RegisterForm from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <main className='p-8 max-w-md mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Регистрация по инвайту</h1>
            <RegisterForm />
        </main>
    );
}
