'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import {
    projects,
    projectCategories,
    projectPersonas,
    projectKeyMetrics,
    projectColorRoles,
    projectAssets,
    projectComparisons,
    projectReviews,
    projectItems,
    profiles,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

async function getProfileId(): Promise<string | null> {
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

// ─── Zod Schemas ───────────────────────────────────────────

const metaSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    teaser: z.string().max(200).optional().nullable(),
    client: z.string().optional().nullable(),
    year: z.number().int().optional().nullable(),
    duration: z.string().optional().nullable(),
    myRole: z.string().optional().nullable(),
    constraints: z.string().optional().nullable(),
    devices: z.string().optional().nullable(),
    tags: z.string().optional().nullable(),
    coverFileId: z.string().optional().nullable(),
    figmaPrototypeUrl: z.string().url().optional().nullable().or(z.literal('')),
    webPrototypeUrl: z.string().url().optional().nullable().or(z.literal('')),
    categoryIds: z.array(z.string()).optional(),
});

const problemSchema = z.object({
    problemStatement: z.string().optional().nullable(),
    projectGoal: z.string().optional().nullable(),
    targetUsers: z.string().optional().nullable(),
});

const personaItemSchema = z.object({
    id: z.string().optional(),
    nameAndAge: z.string().min(1),
    avatarFileId: z.string().optional().nullable(),
    bio: z.string().min(1),
    painPoints: z.string().min(1),
});

const keyMetricItemSchema = z.object({
    id: z.string().optional(),
    value: z.string().min(1),
    description: z.string().min(1),
});

const researchSchema = z.object({
    researchMethodology: z.string().optional().nullable(),
    userStory: z.string().optional().nullable(),
    personas: z.array(personaItemSchema).max(5).optional(),
    keyMetrics: z.array(keyMetricItemSchema).max(3).optional(),
});

const colorRoleItemSchema = z.object({
    roleId: z.string(),
    order: z.number().int(),
});

const designSchema = z.object({
    visualDirection: z.string().optional().nullable(),
    displayFont: z.string().optional().nullable(),
    bodyFont: z.string().optional().nullable(),
    designApproach: z.string().optional().nullable(),
    colorRoleIds: z.array(colorRoleItemSchema).optional(),
});

const assetItemSchema = z.object({
    id: z.string().optional(),
    fileId: z.string().min(1),
    assetType: z.enum(['moodboard', 'wireframe', 'final_gallery']),
    caption: z.string().optional().nullable(),
    order: z.number().int(),
});

const comparisonItemSchema = z.object({
    id: z.string().optional(),
    featureName: z.string().min(1),
    beforeFileId: z.string().optional().nullable(),
    afterFileId: z.string().optional().nullable(),
    beforeText: z.string().optional().nullable(),
    afterText: z.string().optional().nullable(),
    order: z.number().int(),
});

const showcaseSchema = z.object({
    finalDescription: z.string().optional().nullable(),
    assets: z.array(assetItemSchema).optional(),
    comparisons: z.array(comparisonItemSchema).optional(),
});

const reviewItemSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1),
    authorName: z.string().min(1),
    authorRole: z.string().optional().nullable(),
    avatarFileId: z.string().optional().nullable(),
    order: z.number().int(),
});

const projectItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(1),
    order: z.number().int(),
});

const reviewSchema = z.object({
    keyTakeaway: z.string().optional().nullable(),
    reviews: z.array(reviewItemSchema).optional(),
    results: z.array(projectItemSchema).optional(),
    tools: z.array(projectItemSchema).optional(),
    nextSteps: z.array(projectItemSchema).optional(),
    publish: z.boolean().optional(),
});

// ─── Server Actions ────────────────────────────────────────

export async function updateProjectMeta(
    projectId: string,
    data: z.infer<typeof metaSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = metaSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const updateData: Record<string, unknown> = {
        title: parsed.title,
        slug: parsed.slug,
        teaser: parsed.teaser ?? null,
        client: parsed.client ?? null,
        year: parsed.year ?? null,
        duration: parsed.duration ?? null,
        myRole: parsed.myRole ?? null,
        constraints: parsed.constraints ?? null,
        devices: parsed.devices ?? null,
        tags: parsed.tags ?? null,
        coverFileId: parsed.coverFileId ?? null,
        figmaPrototypeUrl: parsed.figmaPrototypeUrl || null,
        webPrototypeUrl: parsed.webPrototypeUrl || null,
        updatedAt: Math.floor(Date.now() / 1000),
    };

    await db.update(projects).set(updateData).where(eq(projects.id, projectId));

    if (parsed.categoryIds !== undefined) {
        await db
            .delete(projectCategories)
            .where(eq(projectCategories.projectId, projectId));

        if (parsed.categoryIds.length > 0) {
            await db.insert(projectCategories).values(
                parsed.categoryIds.map((catId: string) => ({
                    projectId,
                    categoryId: catId,
                })),
            );
        }
    }

    revalidatePath(`/admin/projects/${projectId}/edit/general`);
    revalidatePath('/admin');
    return { success: true };
}

export async function updateProjectProblem(
    projectId: string,
    data: z.infer<typeof problemSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = problemSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            problemStatement: parsed.problemStatement ?? null,
            projectGoal: parsed.projectGoal ?? null,
            targetUsers: parsed.targetUsers ?? null,
            updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    revalidatePath(`/admin/projects/${projectId}/edit/problem`);
    return { success: true };
}

export async function updateProjectResearch(
    projectId: string,
    data: z.infer<typeof researchSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = researchSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            researchMethodology: parsed.researchMethodology ?? null,
            userStory: parsed.userStory ?? null,
            updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    if (parsed.personas !== undefined) {
        await db
            .delete(projectPersonas)
            .where(eq(projectPersonas.projectId, projectId));

        if (parsed.personas.length > 0) {
            await db.insert(projectPersonas).values(
                parsed.personas.map((p: z.infer<typeof personaItemSchema>) => ({
                    id: p.id || crypto.randomUUID(),
                    projectId,
                    nameAndAge: p.nameAndAge,
                    avatarFileId: p.avatarFileId ?? null,
                    bio: p.bio,
                    painPoints: p.painPoints,
                })),
            );
        }
    }

    if (parsed.keyMetrics !== undefined) {
        await db
            .delete(projectKeyMetrics)
            .where(eq(projectKeyMetrics.projectId, projectId));

        if (parsed.keyMetrics.length > 0) {
            await db.insert(projectKeyMetrics).values(
                parsed.keyMetrics.map(
                    (m: z.infer<typeof keyMetricItemSchema>, idx: number) => ({
                        id: m.id || crypto.randomUUID(),
                        projectId,
                        value: m.value,
                        description: m.description,
                        order: idx,
                    }),
                ),
            );
        }
    }

    revalidatePath(`/admin/projects/${projectId}/edit/research`);
    return { success: true };
}

export async function updateProjectDesign(
    projectId: string,
    data: z.infer<typeof designSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = designSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            visualDirection: parsed.visualDirection ?? null,
            displayFont: parsed.displayFont ?? null,
            bodyFont: parsed.bodyFont ?? null,
            designApproach: parsed.designApproach ?? null,
            updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    if (parsed.colorRoleIds !== undefined) {
        await db
            .delete(projectColorRoles)
            .where(eq(projectColorRoles.projectId, projectId));

        if (parsed.colorRoleIds.length > 0) {
            await db.insert(projectColorRoles).values(
                parsed.colorRoleIds.map(
                    (cr: z.infer<typeof colorRoleItemSchema>) => ({
                        projectId,
                        roleId: cr.roleId,
                        order: cr.order,
                    }),
                ),
            );
        }
    }

    revalidatePath(`/admin/projects/${projectId}/edit/design`);
    return { success: true };
}

export async function updateProjectShowcase(
    projectId: string,
    data: z.infer<typeof showcaseSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = showcaseSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            finalDescription: parsed.finalDescription ?? null,
            updatedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    if (parsed.assets !== undefined) {
        await db
            .delete(projectAssets)
            .where(eq(projectAssets.projectId, projectId));

        if (parsed.assets.length > 0) {
            await db.insert(projectAssets).values(
                parsed.assets.map((a: z.infer<typeof assetItemSchema>) => ({
                    id: a.id || crypto.randomUUID(),
                    projectId,
                    fileId: a.fileId,
                    assetType: a.assetType,
                    caption: a.caption ?? null,
                    order: a.order,
                })),
            );
        }
    }

    if (parsed.comparisons !== undefined) {
        await db
            .delete(projectComparisons)
            .where(eq(projectComparisons.projectId, projectId));

        if (parsed.comparisons.length > 0) {
            await db.insert(projectComparisons).values(
                parsed.comparisons.map(
                    (c: z.infer<typeof comparisonItemSchema>) => ({
                        id: c.id || crypto.randomUUID(),
                        projectId,
                        featureName: c.featureName,
                        beforeFileId: c.beforeFileId ?? null,
                        afterFileId: c.afterFileId ?? null,
                        beforeText: c.beforeText ?? null,
                        afterText: c.afterText ?? null,
                        order: c.order,
                    }),
                ),
            );
        }
    }

    revalidatePath(`/admin/projects/${projectId}/edit/showcase`);
    return { success: true };
}

export async function updateProjectReview(
    projectId: string,
    data: z.infer<typeof reviewSchema>,
) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const parsed = reviewSchema.parse(data);

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const updateData: Record<string, unknown> = {
        keyTakeaway: parsed.keyTakeaway ?? null,
        updatedAt: Math.floor(Date.now() / 1000),
    };

    if (parsed.publish) {
        updateData.status = 'published';
        updateData.publishedAt = Math.floor(Date.now() / 1000);
    }

    await db.update(projects).set(updateData).where(eq(projects.id, projectId));

    if (parsed.reviews !== undefined) {
        await db
            .delete(projectReviews)
            .where(eq(projectReviews.projectId, projectId));

        if (parsed.reviews.length > 0) {
            await db.insert(projectReviews).values(
                parsed.reviews.map((r: z.infer<typeof reviewItemSchema>) => ({
                    id: r.id || crypto.randomUUID(),
                    projectId,
                    text: r.text,
                    authorName: r.authorName,
                    authorRole: r.authorRole ?? null,
                    avatarFileId: r.avatarFileId ?? null,
                    order: r.order,
                })),
            );
        }
    }

    if (
        parsed.results !== undefined ||
        parsed.tools !== undefined ||
        parsed.nextSteps !== undefined
    ) {
        await db
            .delete(projectItems)
            .where(eq(projectItems.projectId, projectId));

        const allItems: {
            id: string;
            projectId: string;
            type: 'result' | 'tool' | 'next_step';
            content: string;
            order: number;
        }[] = [];

        if (parsed.results) {
            for (const r of parsed.results) {
                allItems.push({
                    id: r.id || crypto.randomUUID(),
                    projectId,
                    type: 'result',
                    content: r.content,
                    order: r.order,
                });
            }
        }
        if (parsed.tools) {
            for (const t of parsed.tools) {
                allItems.push({
                    id: t.id || crypto.randomUUID(),
                    projectId,
                    type: 'tool',
                    content: t.content,
                    order: t.order,
                });
            }
        }
        if (parsed.nextSteps) {
            for (const n of parsed.nextSteps) {
                allItems.push({
                    id: n.id || crypto.randomUUID(),
                    projectId,
                    type: 'next_step',
                    content: n.content,
                    order: n.order,
                });
            }
        }

        if (allItems.length > 0) {
            await db.insert(projectItems).values(allItems);
        }
    }

    revalidatePath(`/admin/projects/${projectId}/edit/review`);
    revalidatePath('/admin');
    return { success: true };
}

export async function deleteProject(projectId: string) {
    const profileId = await getProfileId();
    if (!profileId) throw new Error('Profile not found');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .delete(projects)
        .where(
            and(eq(projects.id, projectId), eq(projects.profileId, profileId)),
        );

    revalidatePath('/admin');
    return { success: true };
}
