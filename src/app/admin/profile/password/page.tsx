'use client';

import Link from 'next/link';
import PageTitle from '@/components/ui/PageTitle';
import FormBox from '@/components/ui/FormBox';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

export default function ChangePasswordPage() {
    return (
        <main>
            <div className='flex items-center justify-between gap-4'>
                <PageTitle className='mb-8'>Смена пароля</PageTitle>
                <Link
                    href='/admin/profile'
                    className='text-body-sm text-primary hover:underline'
                >
                    ← Настройки профиля
                </Link>
            </div>

            <FormBox>
                <ChangePasswordForm />
            </FormBox>
        </main>
    );
}
