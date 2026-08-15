import { logout } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen bg-surface'>
            <header className='border-b border-outline-variant bg-surface'>
                <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
                    <span className='text-title-sm text-on-surface font-semibold'>
                        Admin
                    </span>
                    <form action={logout}>
                        <button
                            type='submit'
                            className='inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                        >
                            <LogOut className='h-4 w-4' />
                            Выйти
                        </button>
                    </form>
                </div>
            </header>
            <div className='mx-auto max-w-7xl p-8'>{children}</div>
        </div>
    );
}
