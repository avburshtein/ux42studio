'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/crypto';

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    redirect('/login');
}

export async function changePassword(
    currentPassword: string,
    newPassword: string,
) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) {
        return { success: false, error: 'Не авторизован' };
    }

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const user = await db.query.users.findFirst({
        where: { id: userId },
        columns: { passwordHash: true },
    });

    if (!user) {
        return { success: false, error: 'Пользователь не найден' };
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
        return { success: false, error: 'Текущий пароль неверен' };
    }

    const newHash = await hashPassword(newPassword);

    await db
        .update(users)
        .set({
            passwordHash: newHash,
            updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(users.id, userId));

    return { success: true };
}
