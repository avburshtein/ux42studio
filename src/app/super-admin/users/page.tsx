import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { like, desc } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import PageTitle from '@/components/ui/PageTitle';
import { toggleUserActive, setUserRole } from '@/lib/actions/admin';

export default async function SuperAdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { q } = await searchParams;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const allUsers = await db
        .select()
        .from(users)
        .where(q ? like(users.email, `%${q}%`) : undefined)
        .orderBy(desc(users.createdAt));

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <PageTitle className='mb-6'>Управление пользователями</PageTitle>

            <form
                method='GET'
                action='/super-admin/users'
                className='mb-6 flex max-w-md gap-2'
            >
                <Input
                    type='search'
                    name='q'
                    defaultValue={q ?? ''}
                    placeholder='Поиск по email...'
                />
                <Button type='submit' variant='outline'>
                    Найти
                </Button>
            </form>

            <div className='overflow-x-auto rounded-lg border border-outline-variant'>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b border-outline-variant bg-surface-variant/50'>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Email
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Role
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Active
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Created
                            </th>
                            <th className='px-4 py-3 text-right text-label-md text-on-surface-variant'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((u) => (
                            <tr
                                key={u.id}
                                className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                            >
                                <td className='px-4 py-3 text-body-sm text-on-surface'>
                                    {u.email}
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                            u.role === 'admin'
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'bg-surface-variant text-on-surface-variant'
                                        }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className='px-4 py-3'>
                                    <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                            u.isActive
                                                ? 'bg-primary-container text-on-primary-container'
                                                : 'bg-error-container text-on-error-container'
                                        }`}
                                    >
                                        {u.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                    {new Date(
                                        u.createdAt * 1000,
                                    ).toLocaleDateString('ru-RU')}
                                </td>
                                <td className='px-4 py-3 text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <form
                                            action={async () => {
                                                'use server';
                                                await toggleUserActive(u.id);
                                            }}
                                        >
                                            <Button
                                                variant='ghost'
                                                type='submit'
                                            >
                                                {u.isActive
                                                    ? 'Deactivate'
                                                    : 'Activate'}
                                            </Button>
                                        </form>
                                        {u.role === 'admin' ? (
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await setUserRole(
                                                        u.id,
                                                        'user',
                                                    );
                                                }}
                                            >
                                                <Button
                                                    variant='ghost'
                                                    type='submit'
                                                    className='text-error'
                                                >
                                                    Revoke Admin
                                                </Button>
                                            </form>
                                        ) : (
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await setUserRole(
                                                        u.id,
                                                        'admin',
                                                    );
                                                }}
                                            >
                                                <Button
                                                    variant='ghost'
                                                    type='submit'
                                                >
                                                    Set Admin
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {allUsers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className='px-4 py-6 text-center text-body-sm text-on-surface-variant'
                                >
                                    Нет пользователей
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
