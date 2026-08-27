import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const role = headersList.get('x-user-role');
    if (!userId || role !== 'admin') redirect('/login');

    const navItems = [
        { href: '/super-admin', label: 'Overview' },
        { href: '/super-admin/users', label: 'Users' },
        { href: '/super-admin/invites', label: 'Invites' },
        { href: '/super-admin/projects', label: 'Projects' },
        { href: '/admin', label: 'Admin' },
    ];

    return (
        <div className='min-h-screen bg-surface'>
            <header className='border-b border-outline-variant bg-surface'>
                <div className='mx-auto flex max-w-container-content items-center gap-6 px-4 py-3'>
                    <Link
                        href='/super-admin'
                        className='text-title-sm text-on-surface font-semibold'
                    >
                        Super Admin
                    </Link>
                    <nav className='flex gap-1'>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
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
            <div className='mx-auto max-w-7xl px-8 pt-4'>{children}</div>
        </div>
    );
}
