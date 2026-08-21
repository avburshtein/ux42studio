import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import Link from 'next/link';
import { logout } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const user = await db.query.users.findFirst({
        where: { id: userId },
        columns: { role: true },
    });

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true, slug: true },
    });

    const isSuperAdmin = user?.role === 'admin';

    return (
        <div className='admin-layout min-h-screen bg-surface'>
            <header className='border-b border-outline-variant bg-surface'>
                <div className='mx-auto max-w-7xl px-8'>
                    <div className='flex items-center justify-between py-3'>
                        <div className='flex items-center gap-6'>
                            <Link
                                href='/admin'
                                className='text-title-sm text-on-surface font-semibold hover:text-primary transition-colors'
                            >
                                Admin
                            </Link>
                            <nav className='flex gap-1'>
                                {isSuperAdmin && (
                                    <Link
                                        href='/super-admin'
                                        className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                    >
                                        Суперадминка
                                    </Link>
                                )}
                                <Link
                                    href='/admin/profile'
                                    className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                >
                                    Профиль
                                </Link>
                                {profile?.slug && (
                                    <Link
                                        href={`/u/${profile.slug}`}
                                        className='rounded-md px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                                    >
                                        u/{profile.slug}
                                    </Link>
                                )}
                            </nav>
                        </div>
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
                </div>
            </header>
            <div className='mx-auto max-w-7xl p-8'>{children}</div>
        </div>
    );
}
