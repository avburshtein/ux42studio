'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { profiles, socialLinks } from '@/db/schema/profiles';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateProfile(
    profileId: string,
    data: {
        slug?: string;
        fullName?: string;
        headline?: string;
        bio?: string;
        avatarFileId?: string;
        coverFileId?: string;
        location?: string;
        website?: string;
        isPublic?: number;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(profiles)
        .set({ ...data, updatedAt: Math.floor(Date.now() / 1000) })
        .where(eq(profiles.id, profileId));

    revalidatePath('/admin/profile');
}

export async function addSocialLink(
    profileId: string,
    data: {
        platform: string;
        title: string;
        url: string;
        order?: number;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const id = crypto.randomUUID();
    await db.insert(socialLinks).values({
        id,
        profileId,
        platform: data.platform,
        title: data.title,
        url: data.url,
        order: data.order ?? 0,
    });

    revalidatePath('/admin/profile');
    return id;
}

export async function removeSocialLink(linkId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.delete(socialLinks).where(eq(socialLinks.id, linkId));
    revalidatePath('/admin/profile');
}
