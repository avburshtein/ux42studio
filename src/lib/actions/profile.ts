'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { profiles, socialLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

async function getUserId(): Promise<string | null> {
    const headersList = await headers();
    return headersList.get('x-user-id');
}

const socialLinkSchema = z.object({
    id: z.string().optional(),
    platform: z.enum(['github', 'behance', 'dribbble', 'telegram', 'custom']),
    title: z.string().min(1),
    url: z.string().url(),
    order: z.number().int(),
});

const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    headline: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    website: z.string().url().optional().nullable().or(z.literal('')),
    slug: z.string().min(1, 'Slug is required'),
    avatarFileId: z.string().optional().nullable(),
    coverFileId: z.string().optional().nullable(),
    socialLinks: z.array(socialLinkSchema).optional(),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    const userId = await getUserId();
    if (!userId) throw new Error('Not authenticated');

    const parsed = profileSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const existing = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    const now = Math.floor(Date.now() / 1000);

    if (existing) {
        await db
            .update(profiles)
            .set({
                fullName: parsed.fullName,
                headline: parsed.headline ?? null,
                bio: parsed.bio ?? null,
                location: parsed.location ?? null,
                website: parsed.website || null,
                slug: parsed.slug,
                avatarFileId: parsed.avatarFileId ?? null,
                coverFileId: parsed.coverFileId ?? null,
                updatedAt: now,
            })
            .where(eq(profiles.id, existing.id));

        if (parsed.socialLinks !== undefined) {
            await db
                .delete(socialLinks)
                .where(eq(socialLinks.profileId, existing.id));

            if (parsed.socialLinks.length > 0) {
                await db.insert(socialLinks).values(
                    parsed.socialLinks.map(
                        (s: z.infer<typeof socialLinkSchema>) => ({
                            id: s.id || crypto.randomUUID(),
                            profileId: existing.id,
                            platform: s.platform,
                            title: s.title,
                            url: s.url,
                            order: s.order,
                        }),
                    ),
                );
            }
        }
    } else {
        const profileId = crypto.randomUUID();

        await db.insert(profiles).values({
            id: profileId,
            userId,
            fullName: parsed.fullName,
            headline: parsed.headline ?? null,
            bio: parsed.bio ?? null,
            location: parsed.location ?? null,
            website: parsed.website || null,
            slug: parsed.slug,
            avatarFileId: parsed.avatarFileId ?? null,
            coverFileId: parsed.coverFileId ?? null,
            createdAt: now,
            updatedAt: now,
        });

        if (parsed.socialLinks && parsed.socialLinks.length > 0) {
            await db.insert(socialLinks).values(
                parsed.socialLinks.map(
                    (s: z.infer<typeof socialLinkSchema>) => ({
                        id: s.id || crypto.randomUUID(),
                        profileId,
                        platform: s.platform,
                        title: s.title,
                        url: s.url,
                        order: s.order,
                    }),
                ),
            );
        }
    }

    revalidatePath('/admin/profile');
    revalidatePath('/admin');
    return { success: true };
}
