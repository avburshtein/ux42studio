'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { users, invites, projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getAdminDb() {
    const { env } = await getCloudflareContext();
    return getDb(env.DB);
}

export async function toggleUserActive(userId: string) {
    const db = await getAdminDb();
    const user = await db.query.users.findFirst({
        where: { id: userId },
    });
    if (!user) return;
    await db
        .update(users)
        .set({ isActive: user.isActive ? 0 : 1 })
        .where(eq(users.id, userId));
    revalidatePath('/super-admin/users');
}

export async function setUserRole(userId: string, role: 'admin' | 'user') {
    const db = await getAdminDb();
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath('/super-admin/users');
}

export async function createInvite(data: {
    email?: string;
    expiresAt?: number;
}) {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return;

    const db = await getAdminDb();
    const code = crypto.randomUUID().slice(0, 8).toUpperCase();
    await db.insert(invites).values({
        id: crypto.randomUUID(),
        code,
        email: data.email || null,
        createdByUserId: userId,
        expiresAt: data.expiresAt || null,
    });
    revalidatePath('/super-admin/invites');
}

export async function revokeInvite(inviteId: string) {
    const db = await getAdminDb();
    await db.delete(invites).where(eq(invites.id, inviteId));
    revalidatePath('/super-admin/invites');
}

export async function toggleHomepage(projectId: string) {
    const db = await getAdminDb();
    const project = await db.query.projects.findFirst({
        where: { id: projectId },
    });
    if (!project) return;
    await db
        .update(projects)
        .set({ showOnHomepage: project.showOnHomepage ? 0 : 1 })
        .where(eq(projects.id, projectId));
    revalidatePath('/super-admin/projects');
}
