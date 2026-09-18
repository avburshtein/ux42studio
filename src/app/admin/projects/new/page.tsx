import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export default async function NewProjectPage() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    if (!profile) {
        redirect('/admin/profile');
    }

    const id = crypto.randomUUID();
    const slug = `project-${id.slice(0, 8)}`;

    // Manual-режим сортировки: новый кейс — в конец списка
    // (max(sort_order) + 1; у первого кейса профиля будет 0)
    const [{ maxOrder }] = await db
        .select({
            maxOrder: sql<number>`COALESCE(MAX(${projects.sortOrder}), -1)`,
        })
        .from(projects)
        .where(eq(projects.profileId, profile.id));

    await db.insert(projects).values({
        id,
        profileId: profile.id,
        slug,
        title: 'New Project',
        status: 'draft',
        sortOrder: Number(maxOrder) + 1,
    });

    redirect(`/admin/projects/${id}/edit/general`);
}
