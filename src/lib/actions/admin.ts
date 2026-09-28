'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { headers } from 'next/headers';
import { getDb } from '@/db';
import { users, invites } from '@/db/schema/users';
import { projects } from '@/db/schema/projects';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
    sendInviteEmail,
    resolveAppUrl,
    type EmailSendStatus,
} from '@/lib/email/send';

export async function toggleUserActive(userId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const user = await db.query.users.findFirst({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    await db
        .update(users)
        .set({ isActive: user.isActive ? 0 : 1 })
        .where(eq(users.id, userId));

    revalidatePath('/super-admin');
}

export async function setUserRole(userId: string, role: 'admin' | 'user') {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath('/super-admin');
}

export async function createInvite(data: {
    email?: string;
    createdByUserId: string;
    expiresAt?: number;
}) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Генерируем 8-символьный код
    const arr = new Uint8Array(6);
    crypto.getRandomValues(arr);
    const code = Array.from(arr)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 8);

    const id = crypto.randomUUID();
    await db.insert(invites).values({
        id,
        code,
        email: data.email,
        createdByUserId: data.createdByUserId,
        expiresAt: data.expiresAt,
    });

    revalidatePath('/super-admin');
    revalidatePath('/super-admin/invites');

    // Письмо с кодом и пошаговой инструкцией по регистрации.
    // Отправка не бросает исключений: если почта не настроена или ошибка —
    // инвайт всё равно создан, статус уходит в интерфейс (форму показывает
    // код, который можно переслать вручную).
    const to = data.email?.trim();
    let mail: EmailSendStatus | null = null;
    if (to) {
        const appUrl = resolveAppUrl(env, (await headers()).get('host'));
        mail = await sendInviteEmail({
            toEmail: to,
            code,
            registerUrl: `${appUrl}/register?invite=${encodeURIComponent(code)}`,
            expiresAt: data.expiresAt,
        });
    }

    return { id, code, email: to ?? null, mail };
}

export async function revokeInvite(inviteId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.delete(invites).where(eq(invites.id, inviteId));
    revalidatePath('/super-admin');
}

export async function toggleHomepage(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db.query.projects.findFirst({
        where: { id: projectId },
    });

    if (!project) {
        throw new Error('Project not found');
    }

    await db
        .update(projects)
        .set({ showOnHomepage: project.showOnHomepage ? 0 : 1 })
        .where(eq(projects.id, projectId));

    revalidatePath('/super-admin');
}
