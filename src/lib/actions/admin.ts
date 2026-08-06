'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, invites } from '@/db/schema/users';
import { projects } from '@/db/schema/projects';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
    return { id, code };
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
