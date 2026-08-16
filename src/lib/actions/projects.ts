'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import {
    projects,
    projectCategories,
    projectAssets,
} from '@/db/schema/projects';
import { categories } from '@/db/schema/categories';
import { files } from '@/db/schema/files';
import { profiles } from '@/db/schema/profiles';
import { projectColorRoles, colorRoles } from '@/db/schema/color-roles';
import {
    projectPersonas,
    projectKeyMetrics,
    projectComparisons,
    projectReviews,
    projectItems,
} from '@/db/schema/project-details';
import { eq, and, inArray, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils/slug';

// ---- Section 00: Meta ----

export async function updateProjectMeta(
    projectId: string,
    data: {
        slug?: string;
        title?: string;
        teaser?: string;
        client?: string;
        year?: number;
        duration?: string;
        myRole?: string;
        constraints?: string;
        devices?: string;
        tags?: string;
        coverFileId?: string;
        figmaPrototypeUrl?: string;
        webPrototypeUrl?: string;
        categoryIds?: string[];
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const { categoryIds, ...projectFields } = data;

    // Auto-generate slug from title when slug is empty
    if (!projectFields.slug?.trim() && projectFields.title?.trim()) {
        projectFields.slug = slugify(projectFields.title);
    }

    // Удаляем старую обложку, если она была заменена или убрана
    if (data.coverFileId !== undefined) {
        const current = await db
            .select({ coverFileId: projects.coverFileId })
            .from(projects)
            .where(eq(projects.id, projectId))
            .get();

        const oldCoverId = current?.coverFileId ?? null;
        if (oldCoverId && oldCoverId !== data.coverFileId) {
            await deleteFilesByIds([oldCoverId]);
        }
    }

    await db.batch([
        db
            .update(projects)
            .set(projectFields)
            .where(eq(projects.id, projectId)),
        db
            .delete(projectCategories)
            .where(eq(projectCategories.projectId, projectId)),
        ...(categoryIds || []).map((categoryId) =>
            db.insert(projectCategories).values({ projectId, categoryId }),
        ),
    ]);

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Files ----

export async function getFileR2Key(fileId: string): Promise<string | null> {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const row = await db
        .select({ r2Key: files.r2Key })
        .from(files)
        .where(eq(files.id, fileId))
        .get();

    return row?.r2Key ?? null;
}

/**
 * Удаляет объекты из R2 и записи из таблицы files для заданных fileId.
 * Используется, когда файл больше не ссылается ни на один проект (например,
 * при замене обложки/аватара/ассета). Best-effort: ошибки R2 игнорируются.
 */
async function deleteFilesByIds(fileIds: string[]) {
    if (fileIds.length === 0) return;

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const fileRows = await db
        .select({ id: files.id, r2Key: files.r2Key })
        .from(files)
        .where(inArray(files.id, fileIds))
        .all();

    await Promise.all(
        fileRows.map((f) =>
            env.MY_BUCKET.delete(f.r2Key).catch(() => {
                /* ignore */
            }),
        ),
    );

    await db.delete(files).where(inArray(files.id, fileIds));
}

// ---- Categories ----

export async function getCategories() {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            order: categories.order,
        })
        .from(categories)
        .orderBy(asc(categories.order), asc(categories.name))
        .all();
}

// ---- Section 02: Problem & Audience ----

export async function updateProjectProblem(
    projectId: string,
    data: {
        galleryDescription?: string;
        problemStatement?: string;
        projectGoal?: string;
        targetUsers?: string;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(projects).set(data).where(eq(projects.id, projectId));
    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Section 03: Research (db.batch) ----

export async function updateProjectResearch(
    projectId: string,
    data: {
        researchMethodology?: string;
        userStory?: string;
        personas?: Array<{
            id?: string;
            nameAndAge: string;
            avatarFileId?: string;
            bio: string;
            painPoints: string;
        }>;
        keyMetrics?: Array<{
            id?: string;
            value: string;
            description: string;
            order: number;
        }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Собираем старые avatarFileId персон до перезаписи
    const oldPersonas = await db
        .select({ avatarFileId: projectPersonas.avatarFileId })
        .from(projectPersonas)
        .where(eq(projectPersonas.projectId, projectId))
        .all();

    const oldAvatarIds = new Set<string>();
    for (const row of oldPersonas) {
        if (row.avatarFileId) oldAvatarIds.add(row.avatarFileId);
    }

    await db.batch([
        // Update project-level fields
        db
            .update(projects)
            .set({
                researchMethodology: data.researchMethodology,
                userStory: data.userStory,
            })
            .where(eq(projects.id, projectId)),

        // Replace personas
        db
            .delete(projectPersonas)
            .where(eq(projectPersonas.projectId, projectId)),
        ...(data.personas || []).map((p) =>
            db.insert(projectPersonas).values({
                id: p.id || crypto.randomUUID(),
                projectId,
                nameAndAge: p.nameAndAge,
                avatarFileId: p.avatarFileId,
                bio: p.bio,
                painPoints: p.painPoints,
            }),
        ),

        // Replace key metrics
        db
            .delete(projectKeyMetrics)
            .where(eq(projectKeyMetrics.projectId, projectId)),
        ...(data.keyMetrics || []).map((m) =>
            db.insert(projectKeyMetrics).values({
                id: m.id || crypto.randomUUID(),
                projectId,
                value: m.value,
                description: m.description,
                order: m.order,
            }),
        ),
    ]);

    // Удаляем аватары персон, которые больше не используются
    const newAvatarIds = new Set<string>();
    for (const p of data.personas || []) {
        if (p.avatarFileId) newAvatarIds.add(p.avatarFileId);
    }

    const staleAvatarIds = [...oldAvatarIds].filter(
        (id) => !newAvatarIds.has(id),
    );
    if (staleAvatarIds.length > 0) {
        await deleteFilesByIds(staleAvatarIds);
    }

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Section 04: Design System ----

export async function updateProjectDesign(
    projectId: string,
    data: {
        visualDirection?: string;
        displayFont?: string;
        bodyFont?: string;
        designApproach?: string;
        colorRoles?: Array<{ roleId: string; order: number }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const { colorRoles: roleSelections, ...projectFields } = data;

    await db.batch([
        db
            .update(projects)
            .set(projectFields)
            .where(eq(projects.id, projectId)),
        db
            .delete(projectColorRoles)
            .where(eq(projectColorRoles.projectId, projectId)),
        ...(roleSelections || []).map((r) =>
            db.insert(projectColorRoles).values({
                projectId,
                roleId: r.roleId,
                order: r.order,
            }),
        ),
    ]);

    revalidatePath(`/admin/projects/${projectId}`);
}

export async function getColorRoles() {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            id: colorRoles.id,
            name: colorRoles.name,
            slug: colorRoles.slug,
            lightColor: colorRoles.lightColor1,
            darkColor: colorRoles.darkColor1,
        })
        .from(colorRoles)
        .all();
}

export async function getProjectColorRoles(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            roleId: projectColorRoles.roleId,
            order: projectColorRoles.order,
        })
        .from(projectColorRoles)
        .where(eq(projectColorRoles.projectId, projectId))
        .orderBy(asc(projectColorRoles.order))
        .all();
}

// ---- Section 07: Showcase (db.batch) ----

export async function updateProjectShowcase(
    projectId: string,
    data: {
        finalDescription?: string;
        designApproach?: string;
        testingProcess?: string;
        assets?: Array<{
            id?: string;
            fileId: string;
            assetType: 'moodboard' | 'wireframe' | 'final_gallery';
            caption?: string;
            order: number;
        }>;
        comparisons?: Array<{
            id?: string;
            featureName: string;
            beforeFileId?: string;
            afterFileId?: string;
            beforeText?: string;
            afterText?: string;
            order: number;
        }>;
        results?: Array<{
            id?: string;
            content: string;
            order: number;
        }>;
        tools?: Array<{
            id?: string;
            content: string;
            order: number;
        }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Собираем старые fileId ассетов и сравнений до перезаписи
    const [oldAssets, oldComparisons] = await Promise.all([
        db
            .select({ fileId: projectAssets.fileId })
            .from(projectAssets)
            .where(eq(projectAssets.projectId, projectId))
            .all(),
        db
            .select({
                beforeFileId: projectComparisons.beforeFileId,
                afterFileId: projectComparisons.afterFileId,
            })
            .from(projectComparisons)
            .where(eq(projectComparisons.projectId, projectId))
            .all(),
    ]);

    const oldFileIds = new Set<string>();
    for (const row of oldAssets) if (row.fileId) oldFileIds.add(row.fileId);
    for (const row of oldComparisons) {
        if (row.beforeFileId) oldFileIds.add(row.beforeFileId);
        if (row.afterFileId) oldFileIds.add(row.afterFileId);
    }

    await db.batch([
        // Update project-level fields
        db
            .update(projects)
            .set({
                finalDescription: data.finalDescription,
                designApproach: data.designApproach,
                testingProcess: data.testingProcess,
            })
            .where(eq(projects.id, projectId)),

        // Replace assets
        db.delete(projectAssets).where(eq(projectAssets.projectId, projectId)),
        ...(data.assets || []).map((a) =>
            db.insert(projectAssets).values({
                id: a.id || crypto.randomUUID(),
                projectId,
                fileId: a.fileId,
                assetType: a.assetType,
                caption: a.caption,
                order: a.order,
            }),
        ),

        // Replace comparisons
        db
            .delete(projectComparisons)
            .where(eq(projectComparisons.projectId, projectId)),
        ...(data.comparisons || []).map((c) =>
            db.insert(projectComparisons).values({
                id: c.id || crypto.randomUUID(),
                projectId,
                featureName: c.featureName,
                beforeFileId: c.beforeFileId,
                afterFileId: c.afterFileId,
                beforeText: c.beforeText,
                afterText: c.afterText,
                order: c.order,
            }),
        ),

        // Replace result/tool items (keep next_step items intact)
        db
            .delete(projectItems)
            .where(
                and(
                    eq(projectItems.projectId, projectId),
                    inArray(projectItems.type, ['result', 'tool']),
                ),
            ),
        ...(data.results || []).map((r) =>
            db.insert(projectItems).values({
                id: r.id || crypto.randomUUID(),
                projectId,
                type: 'result',
                content: r.content,
                order: r.order,
            }),
        ),
        ...(data.tools || []).map((t) =>
            db.insert(projectItems).values({
                id: t.id || crypto.randomUUID(),
                projectId,
                type: 'tool',
                content: t.content,
                order: t.order,
            }),
        ),
    ]);

    // Удаляем файлы, которые больше не используются в showcase
    const newFileIds = new Set<string>();
    for (const a of data.assets || []) if (a.fileId) newFileIds.add(a.fileId);
    for (const c of data.comparisons || []) {
        if (c.beforeFileId) newFileIds.add(c.beforeFileId);
        if (c.afterFileId) newFileIds.add(c.afterFileId);
    }

    const staleFileIds = [...oldFileIds].filter((id) => !newFileIds.has(id));
    if (staleFileIds.length > 0) {
        await deleteFilesByIds(staleFileIds);
    }

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Section 08: Review (db.batch) ----

export async function updateProjectReview(
    projectId: string,
    data: {
        keyTakeaway?: string;
        reviews?: Array<{
            id?: string;
            text: string;
            authorName: string;
            authorRole?: string;
            avatarFileId?: string;
            order: number;
        }>;
        nextSteps?: Array<{
            id?: string;
            content: string;
            order: number;
        }>;
        publish?: boolean;
    },
): Promise<{ error?: string } | void> {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Validate title before publishing
    if (data.publish) {
        const project = await db
            .select({ title: projects.title })
            .from(projects)
            .where(eq(projects.id, projectId))
            .get();

        if (!project?.title?.trim()) {
            return { error: 'Title is required before publishing' };
        }
    }

    // Validate avatarFileId references to avoid FK constraint failures
    const avatarFileIds = (data.reviews || [])
        .map((r) => r.avatarFileId)
        .filter((id): id is string => !!id);

    let validFileIds = new Set<string>();
    if (avatarFileIds.length > 0) {
        const rows = await db
            .select({ id: files.id })
            .from(files)
            .where(inArray(files.id, avatarFileIds))
            .all();
        validFileIds = new Set(rows.map((r) => r.id));
    }

    // Собираем старые avatarFileId отзывов до перезаписи
    const oldReviews = await db
        .select({ avatarFileId: projectReviews.avatarFileId })
        .from(projectReviews)
        .where(eq(projectReviews.projectId, projectId))
        .all();

    const oldReviewAvatarIds = new Set<string>();
    for (const row of oldReviews) {
        if (row.avatarFileId) oldReviewAvatarIds.add(row.avatarFileId);
    }

    await db.batch([
        // Update project-level fields
        db
            .update(projects)
            .set({ keyTakeaway: data.keyTakeaway })
            .where(eq(projects.id, projectId)),

        // Replace reviews
        db
            .delete(projectReviews)
            .where(eq(projectReviews.projectId, projectId)),
        ...(data.reviews || []).map((r) =>
            db.insert(projectReviews).values({
                id: r.id || crypto.randomUUID(),
                projectId,
                text: r.text,
                authorName: r.authorName,
                authorRole: r.authorRole,
                avatarFileId:
                    r.avatarFileId && validFileIds.has(r.avatarFileId)
                        ? r.avatarFileId
                        : undefined,
                order: r.order,
            }),
        ),

        // Replace next_step items
        db
            .delete(projectItems)
            .where(
                and(
                    eq(projectItems.projectId, projectId),
                    eq(projectItems.type, 'next_step'),
                ),
            ),
        ...(data.nextSteps || []).map((n) =>
            db.insert(projectItems).values({
                id: n.id || crypto.randomUUID(),
                projectId,
                type: 'next_step',
                content: n.content,
                order: n.order,
            }),
        ),
    ]);

    // Удаляем аватары отзывов, которые больше не используются
    const newReviewAvatarIds = new Set<string>();
    for (const r of data.reviews || []) {
        if (r.avatarFileId) newReviewAvatarIds.add(r.avatarFileId);
    }

    const staleReviewAvatarIds = [...oldReviewAvatarIds].filter(
        (id) => !newReviewAvatarIds.has(id),
    );
    if (staleReviewAvatarIds.length > 0) {
        await deleteFilesByIds(staleReviewAvatarIds);
    }

    // Publish
    if (data.publish) {
        await db
            .update(projects)
            .set({
                status: 'published',
                publishedAt: Math.floor(Date.now() / 1000),
            })
            .where(eq(projects.id, projectId));
    }

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/');
}

// ---- Preview ----

export async function getProjectPreviewInfo(projectId: string): Promise<{
    authorSlug: string;
    projectSlug: string;
} | null> {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db.query.projects.findFirst({
        where: { id: projectId },
        with: {
            profile: { columns: { slug: true } },
        },
        columns: { slug: true },
    });

    if (!project || !project.profile) return null;

    return {
        authorSlug: project.profile.slug,
        projectSlug: project.slug,
    };
}

// ---- Archive / Restore ----

export async function archiveProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            status: 'archived',
            showOnHomepage: 0,
        })
        .where(eq(projects.id, projectId));

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function unarchiveProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db
        .update(projects)
        .set({
            status: 'published',
            publishedAt: Math.floor(Date.now() / 1000),
        })
        .where(eq(projects.id, projectId));

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function getProjectStatus(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db
        .select({ status: projects.status })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();

    return project?.status ?? null;
}

// ---- Getters (load existing data into edit forms) ----

export async function getProjectMeta(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db
        .select({
            title: projects.title,
            slug: projects.slug,
            teaser: projects.teaser,
            client: projects.client,
            year: projects.year,
            duration: projects.duration,
            myRole: projects.myRole,
            constraints: projects.constraints,
            devices: projects.devices,
            tags: projects.tags,
            coverFileId: projects.coverFileId,
            figmaPrototypeUrl: projects.figmaPrototypeUrl,
            webPrototypeUrl: projects.webPrototypeUrl,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();

    const categoryRows = await db
        .select({ categoryId: projectCategories.categoryId })
        .from(projectCategories)
        .where(eq(projectCategories.projectId, projectId))
        .all();

    return {
        ...project,
        categoryIds: categoryRows.map((r) => r.categoryId),
    };
}

export async function getProjectProblem(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            galleryDescription: projects.galleryDescription,
            problemStatement: projects.problemStatement,
            projectGoal: projects.projectGoal,
            targetUsers: projects.targetUsers,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();
}

export async function getProjectResearch(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db
        .select({
            researchMethodology: projects.researchMethodology,
            userStory: projects.userStory,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();

    const personas = await db
        .select({
            id: projectPersonas.id,
            nameAndAge: projectPersonas.nameAndAge,
            avatarFileId: projectPersonas.avatarFileId,
            bio: projectPersonas.bio,
            painPoints: projectPersonas.painPoints,
        })
        .from(projectPersonas)
        .where(eq(projectPersonas.projectId, projectId))
        .all();

    const keyMetrics = await db
        .select({
            id: projectKeyMetrics.id,
            value: projectKeyMetrics.value,
            description: projectKeyMetrics.description,
            order: projectKeyMetrics.order,
        })
        .from(projectKeyMetrics)
        .where(eq(projectKeyMetrics.projectId, projectId))
        .orderBy(asc(projectKeyMetrics.order))
        .all();

    return {
        researchMethodology: project?.researchMethodology,
        userStory: project?.userStory,
        personas,
        keyMetrics,
    };
}

export async function getProjectDesign(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            visualDirection: projects.visualDirection,
            displayFont: projects.displayFont,
            bodyFont: projects.bodyFont,
            designApproach: projects.designApproach,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();
}

export async function getProjectShowcase(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db
        .select({
            finalDescription: projects.finalDescription,
            designApproach: projects.designApproach,
            testingProcess: projects.testingProcess,
        })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();

    const assets = await db
        .select({
            id: projectAssets.id,
            fileId: projectAssets.fileId,
            assetType: projectAssets.assetType,
            caption: projectAssets.caption,
            order: projectAssets.order,
        })
        .from(projectAssets)
        .where(eq(projectAssets.projectId, projectId))
        .orderBy(asc(projectAssets.order))
        .all();

    const comparisons = await db
        .select({
            id: projectComparisons.id,
            featureName: projectComparisons.featureName,
            beforeFileId: projectComparisons.beforeFileId,
            afterFileId: projectComparisons.afterFileId,
            beforeText: projectComparisons.beforeText,
            afterText: projectComparisons.afterText,
            order: projectComparisons.order,
        })
        .from(projectComparisons)
        .where(eq(projectComparisons.projectId, projectId))
        .orderBy(asc(projectComparisons.order))
        .all();

    const results = await db
        .select({
            id: projectItems.id,
            content: projectItems.content,
            order: projectItems.order,
        })
        .from(projectItems)
        .where(
            and(
                eq(projectItems.projectId, projectId),
                eq(projectItems.type, 'result'),
            ),
        )
        .orderBy(asc(projectItems.order))
        .all();

    const tools = await db
        .select({
            id: projectItems.id,
            content: projectItems.content,
            order: projectItems.order,
        })
        .from(projectItems)
        .where(
            and(
                eq(projectItems.projectId, projectId),
                eq(projectItems.type, 'tool'),
            ),
        )
        .orderBy(asc(projectItems.order))
        .all();

    return {
        finalDescription: project?.finalDescription,
        designApproach: project?.designApproach,
        testingProcess: project?.testingProcess,
        assets,
        comparisons,
        results,
        tools,
    };
}

export async function getProjectReview(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const project = await db
        .select({ keyTakeaway: projects.keyTakeaway })
        .from(projects)
        .where(eq(projects.id, projectId))
        .get();

    const reviews = await db
        .select({
            id: projectReviews.id,
            text: projectReviews.text,
            authorName: projectReviews.authorName,
            authorRole: projectReviews.authorRole,
            avatarFileId: projectReviews.avatarFileId,
            order: projectReviews.order,
        })
        .from(projectReviews)
        .where(eq(projectReviews.projectId, projectId))
        .orderBy(asc(projectReviews.order))
        .all();

    const nextSteps = await db
        .select({
            id: projectItems.id,
            content: projectItems.content,
            order: projectItems.order,
        })
        .from(projectItems)
        .where(
            and(
                eq(projectItems.projectId, projectId),
                eq(projectItems.type, 'next_step'),
            ),
        )
        .orderBy(asc(projectItems.order))
        .all();

    return {
        keyTakeaway: project?.keyTakeaway,
        reviews,
        nextSteps,
    };
}

// ---- Delete ----

/**
 * Собирает все fileId, на которые ссылается проект, удаляет их объекты из R2
 * и записи из таблицы files. Вызывается перед удалением проекта, чтобы не
 * оставлять «осиротевшие» файлы в хранилище.
 */
async function deleteProjectFiles(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const [cover, assets, personas, comparisons, reviews] = await Promise.all([
        db
            .select({ fileId: projects.coverFileId })
            .from(projects)
            .where(eq(projects.id, projectId))
            .all(),
        db
            .select({ fileId: projectAssets.fileId })
            .from(projectAssets)
            .where(eq(projectAssets.projectId, projectId))
            .all(),
        db
            .select({ fileId: projectPersonas.avatarFileId })
            .from(projectPersonas)
            .where(eq(projectPersonas.projectId, projectId))
            .all(),
        db
            .select({
                beforeFileId: projectComparisons.beforeFileId,
                afterFileId: projectComparisons.afterFileId,
            })
            .from(projectComparisons)
            .where(eq(projectComparisons.projectId, projectId))
            .all(),
        db
            .select({ fileId: projectReviews.avatarFileId })
            .from(projectReviews)
            .where(eq(projectReviews.projectId, projectId))
            .all(),
    ]);

    const fileIds = new Set<string>();
    for (const row of cover) if (row.fileId) fileIds.add(row.fileId);
    for (const row of assets) if (row.fileId) fileIds.add(row.fileId);
    for (const row of personas) if (row.fileId) fileIds.add(row.fileId);
    for (const row of comparisons) {
        if (row.beforeFileId) fileIds.add(row.beforeFileId);
        if (row.afterFileId) fileIds.add(row.afterFileId);
    }
    for (const row of reviews) if (row.fileId) fileIds.add(row.fileId);

    if (fileIds.size === 0) return;

    const ids = [...fileIds];
    const fileRows = await db
        .select({ id: files.id, r2Key: files.r2Key })
        .from(files)
        .where(inArray(files.id, ids))
        .all();

    // Удаляем объекты из R2 (best-effort, не блокируем удаление проекта)
    await Promise.all(
        fileRows.map((f) =>
            env.MY_BUCKET.delete(f.r2Key).catch(() => {
                /* ignore */
            }),
        ),
    );

    // Удаляем записи из files
    await db.delete(files).where(inArray(files.id, ids));
}

export async function deleteProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await deleteProjectFiles(projectId);
    await db.delete(projects).where(eq(projects.id, projectId));
    revalidatePath('/admin');
}
