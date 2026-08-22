import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { invites, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import PageTitle from '@/components/ui/PageTitle';
import Title from '@/components/ui/Title';
import { createInvite, revokeInvite } from '@/lib/actions/admin';

export default async function SuperAdminInvitesPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const allInvites = await db
        .select({
            id: invites.id,
            code: invites.code,
            email: invites.email,
            createdByUserId: invites.createdByUserId,
            usedByUserId: invites.usedByUserId,
            expiresAt: invites.expiresAt,
            createdAt: invites.createdAt,
            creatorEmail: users.email,
        })
        .from(invites)
        .leftJoin(users, eq(invites.createdByUserId, users.id))
        .orderBy(desc(invites.createdAt));

    const now = Math.floor(Date.now() / 1000);

    return (
        <main className='mx-auto max-w-container-content px-4 py-8'>
            <PageTitle className='mb-6' tag='h1'>
                Генерация и менеджмент инвайтов
            </PageTitle>

            <Card className='mb-8'>
                <Title className='mb-4'>Создать инвайт</Title>
                <form
                    action={async (formData: FormData) => {
                        'use server';
                        const email = formData.get('email') as string;
                        const expiresAtStr = formData.get(
                            'expiresAt',
                        ) as string;
                        await createInvite({
                            email: email || undefined,
                            createdByUserId: userId,
                            expiresAt: expiresAtStr
                                ? Math.floor(
                                      new Date(expiresAtStr).getTime() / 1000,
                                  )
                                : undefined,
                        });
                    }}
                    className='flex flex-wrap items-end gap-4'
                >
                    <div className='flex flex-col gap-1'>
                        <label className='text-label-sm text-on-surface-variant'>
                            Email (опционально)
                        </label>
                        <Input
                            name='email'
                            type='email'
                            placeholder='user@example.com'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-label-sm text-on-surface-variant'>
                            Expires At (опционально)
                        </label>
                        <Input name='expiresAt' type='date' />
                    </div>
                    <Button type='submit'>Generate</Button>
                </form>
            </Card>

            <div className='overflow-x-auto rounded-lg border border-outline-variant'>
                <table className='w-full'>
                    <thead>
                        <tr className='border-b border-outline-variant bg-surface-variant/50'>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Code
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Email
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Created By
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Used By
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Expires
                            </th>
                            <th className='px-4 py-3 text-left text-label-md text-on-surface-variant'>
                                Status
                            </th>
                            <th className='px-4 py-3 text-right text-label-md text-on-surface-variant'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allInvites.map((inv) => {
                            const isUsed = !!inv.usedByUserId;
                            const isExpired =
                                inv.expiresAt && inv.expiresAt < now;
                            const status = isUsed
                                ? 'used'
                                : isExpired
                                  ? 'expired'
                                  : 'active';

                            return (
                                <tr
                                    key={inv.id}
                                    className='border-b border-outline-variant last:border-0 hover:bg-surface-variant/30'
                                >
                                    <td className='px-4 py-3 text-body-sm font-mono text-on-surface'>
                                        {inv.code}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {inv.email || '—'}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {inv.creatorEmail || '—'}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {inv.usedByUserId || '—'}
                                    </td>
                                    <td className='px-4 py-3 text-body-sm text-on-surface-variant'>
                                        {inv.expiresAt
                                            ? new Date(
                                                  inv.expiresAt * 1000,
                                              ).toLocaleDateString('ru-RU')
                                            : '—'}
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-label-sm ${
                                                status === 'active'
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : status === 'used'
                                                      ? 'bg-surface-variant text-on-surface-variant'
                                                      : 'bg-error-container text-on-error-container'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 text-right'>
                                        {!isUsed && (
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await revokeInvite(inv.id);
                                                }}
                                            >
                                                <Button
                                                    variant='ghost'
                                                    type='submit'
                                                    className='text-error'
                                                >
                                                    Revoke
                                                </Button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {allInvites.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className='px-4 py-6 text-center text-body-sm text-on-surface-variant'
                                >
                                    Нет инвайтов
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
