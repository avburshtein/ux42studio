'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { profiles, socialLinks } from '@/db/schema/profiles';
import { files } from '@/db/schema/files';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function getMyProfileId(): Promise<string | null> {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return null;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    return profile?.id ?? null;
}

export type ProfileData = {
    id: string;
    fullName: string;
    headline: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    slug: string;
    avatarFileId: string | null;
    coverFileId: string | null;
    socialLinks: Array<{
        id: string;
        platform: string;
        title: string;
        url: string;
        order: number;
    }>;
};

export async function getMyProfile(): Promise<ProfileData | null> {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return null;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        with: { socialLinks: true },
    });

    if (!profile) return null;

    return {
        id: profile.id,
        fullName: profile.fullName,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        slug: profile.slug,
        avatarFileId: profile.avatarFileId,
        coverFileId: profile.coverFileId,
        socialLinks: profile.socialLinks.map((link) => ({
            id: link.id,
            platform: link.platform,
            title: link.title,
            url: link.url,
            order: link.order,
        })),
    };
}

export async function getOrCreateProfileId(): Promise<string | null> {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) return null;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const existing = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    if (existing) return existing.id;

    const id = crypto.randomUUID();
    const user = await db.query.users.findFirst({
        where: { id: userId },
        columns: { email: true },
    });

    const slug = user?.email
        ? user.email
              .split('@')[0]
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-')
        : `user-${id.slice(0, 8)}`;

    await db.insert(profiles).values({
        id,
        userId,
        slug,
        fullName: user?.email?.split('@')[0] ?? 'User',
    });

    return id;
}

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

    // Сначала собираем идентификаторы старых файлов и данные для очистки R2
    let staleIds: string[] = [];
    let staleR2Keys: string[] = [];

    if (data.avatarFileId !== undefined || data.coverFileId !== undefined) {
        const current = await db
            .select({
                avatarFileId: profiles.avatarFileId,
                coverFileId: profiles.coverFileId,
            })
            .from(profiles)
            .where(eq(profiles.id, profileId))
            .get();

        const ids: string[] = [];
        if (
            data.avatarFileId !== undefined &&
            current?.avatarFileId &&
            current.avatarFileId !== data.avatarFileId
        ) {
            ids.push(current.avatarFileId);
        }
        if (
            data.coverFileId !== undefined &&
            current?.coverFileId &&
            current.coverFileId !== data.coverFileId
        ) {
            ids.push(current.coverFileId);
        }

        if (ids.length > 0) {
            staleIds = ids;
            const fileRows = await db
                .select({ id: files.id, r2Key: files.r2Key })
                .from(files)
                .where(inArray(files.id, staleIds))
                .all();
            staleR2Keys = fileRows.map((f) => f.r2Key);
        }
    }

    // Обновляем профиль ПЕРВЫМ, чтобы снять ссылки (foreign keys) на старые файлы
    await db
        .update(profiles)
        .set({ ...data, updatedAt: Math.floor(Date.now() / 1000) })
        .where(eq(profiles.id, profileId));

    // Теперь, когда профиль больше не ссылается на старые файлы, удаляем их
    if (staleIds.length > 0) {
        await Promise.all(
            staleR2Keys.map((key) =>
                env.MY_BUCKET.delete(key).catch(() => {
                    /* ignore */
                }),
            ),
        );

        await db.delete(files).where(inArray(files.id, staleIds));
    }

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

export async function updateSocialLinkOrder(
    profileId: string,
    links: Array<{ id: string; order: number }>,
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    for (const l of links) {
        await db
            .update(socialLinks)
            .set({ order: l.order })
            .where(eq(socialLinks.id, l.id));
    }

    revalidatePath('/admin/profile');
}
