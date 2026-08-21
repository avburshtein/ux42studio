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
import { colorRoles } from '@/db/schema/color-roles';
import {
    projectPersonas,
    projectKeyMetrics,
    projectComparisons,
    projectReviews,
    projectItems,
    baCards,
} from '@/db/schema/project-details';
import { eq, and, inArray, asc, desc, sql } from 'drizzle-orm';
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
        coverFileId?: string | null;
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

    // Запоминаем старую обложку до обновления
    let oldCoverId: string | null = null;
    if (data.coverFileId !== undefined) {
        const current = await db
            .select({ coverFileId: projects.coverFileId })
            .from(projects)
            .where(eq(projects.id, projectId))
            .get();

        oldCoverId = current?.coverFileId ?? null;
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

    // Удаляем старую обложку ПОСЛЕ обновления проекта, чтобы не нарушить
    // внешний ключ (projects.coverFileId -> files.id)
    if (oldCoverId && oldCoverId !== data.coverFileId) {
        await deleteFilesByIds([oldCoverId]);
    }

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

    for (const f of fileRows) {
        // Сначала удаляем запись из БД. Если файл всё ещё используется
        // (внешний ключ), удаление не пройдёт — тогда не трогаем и R2.
        try {
            await db.delete(files).where(eq(files.id, f.id));
        } catch {
            continue; // файл всё ещё на что-то ссылается
        }

        // Запись удалена — теперь можно удалить объект из R2
        await env.MY_BUCKET.delete(f.r2Key).catch(() => {
            /* ignore */
        });
    }
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

export async function createCategory(name: string) {
    'use server';
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const slug = slugify(name);
    const id = crypto.randomUUID();

    // Get max order
    const last = await db
        .select({ order: categories.order })
        .from(categories)
        .orderBy(desc(categories.order))
        .limit(1)
        .get();

    await db.insert(categories).values({
        id,
        name: name.trim(),
        slug,
        order: (last?.order ?? 0) + 1,
    });

    revalidatePath('/');
    return { id, name: name.trim(), slug, order: (last?.order ?? 0) + 1 };
}

export async function updateCategory(id: string, name: string) {
    'use server';
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const slug = slugify(name);

    await db
        .update(categories)
        .set({ name: name.trim(), slug })
        .where(eq(categories.id, id));

    revalidatePath('/');
}

export async function deleteCategory(id: string) {
    'use server';
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Delete junction rows first, then the category
    await db
        .delete(projectCategories)
        .where(eq(projectCategories.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath('/');
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
            role: string;
            description: string;
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
                role: p.role,
                description: p.description,
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
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(projects).set(data).where(eq(projects.id, projectId));
    revalidatePath(`/admin/projects/${projectId}`);
}

export async function getProjectColorRoles(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    return db
        .select({
            id: colorRoles.id,
            name1: colorRoles.name1,
            name2: colorRoles.name2,
            lightColor1: colorRoles.lightColor1,
            lightColor2: colorRoles.lightColor2,
            darkColor1: colorRoles.darkColor1,
            darkColor2: colorRoles.darkColor2,
            lightContrastRatio: colorRoles.lightContrastRatio,
            darkContrastRatio: colorRoles.darkContrastRatio,
            order: colorRoles.order,
        })
        .from(colorRoles)
        .where(eq(colorRoles.projectId, projectId))
        .orderBy(asc(colorRoles.order))
        .all();
}

export async function createColorRole(
    projectId: string,
    data: {
        name1: string;
        name2: string;
        lightColor1: string;
        lightColor2: string;
        darkColor1: string;
        darkColor2: string;
        lightContrastRatio?: number | null;
        darkContrastRatio?: number | null;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const last = await db
        .select({ order: colorRoles.order })
        .from(colorRoles)
        .where(eq(colorRoles.projectId, projectId))
        .orderBy(desc(colorRoles.order))
        .limit(1)
        .get();

    const nextOrder = (last?.order ?? -1) + 1;

    // Проверяем уникальность name2 в рамках проекта
    const existing = await db
        .select({ id: colorRoles.id })
        .from(colorRoles)
        .where(
            and(
                eq(colorRoles.projectId, projectId),
                eq(colorRoles.name2, data.name2),
            ),
        )
        .get();

    if (existing) {
        throw new Error(
            `Роль с name2 "${data.name2}" уже существует в проекте`,
        );
    }

    await db.insert(colorRoles).values({
        id: crypto.randomUUID(),
        projectId,
        name1: data.name1,
        name2: data.name2,
        lightColor1: data.lightColor1,
        lightColor2: data.lightColor2,
        darkColor1: data.darkColor1,
        darkColor2: data.darkColor2,
        lightContrastRatio: data.lightContrastRatio ?? null,
        darkContrastRatio: data.darkContrastRatio ?? null,
        order: nextOrder,
    });

    revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateColorRole(
    roleId: string,
    data: {
        name1: string;
        name2: string;
        lightColor1: string;
        lightColor2: string;
        darkColor1: string;
        darkColor2: string;
        lightContrastRatio?: number | null;
        darkContrastRatio?: number | null;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const existing = await db
        .select({ projectId: colorRoles.projectId })
        .from(colorRoles)
        .where(eq(colorRoles.id, roleId))
        .get();

    if (!existing) return;

    // Проверяем уникальность name2 в рамках проекта
    const duplicate = await db
        .select({ id: colorRoles.id })
        .from(colorRoles)
        .where(
            and(
                eq(colorRoles.projectId, existing.projectId),
                eq(colorRoles.name2, data.name2),
                sql`${colorRoles.id} != ${roleId}`,
            ),
        )
        .get();
    if (duplicate) {
        throw new Error(
            `Роль с name2 "${data.name2}" уже существует в проекте`,
        );
    }

    await db
        .update(colorRoles)
        .set({
            name1: data.name1,
            name2: data.name2,
            lightColor1: data.lightColor1,
            lightColor2: data.lightColor2,
            darkColor1: data.darkColor1,
            darkColor2: data.darkColor2,
            lightContrastRatio: data.lightContrastRatio ?? null,
            darkContrastRatio: data.darkContrastRatio ?? null,
        })
        .where(eq(colorRoles.id, roleId));

    revalidatePath(`/admin/projects/${existing.projectId}`);
}

export async function deleteColorRole(roleId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.delete(colorRoles).where(eq(colorRoles.id, roleId));
}

export async function reorderColorRoles(projectId: string, roleIds: string[]) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    for (let index = 0; index < roleIds.length; index++) {
        await db
            .update(colorRoles)
            .set({ order: index })
            .where(
                and(
                    eq(colorRoles.id, roleIds[index]),
                    eq(colorRoles.projectId, projectId),
                ),
            );
    }

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Section 06b: Gallery (project assets) ----

export async function updateProjectGallery(
    projectId: string,
    data: {
        assets?: Array<{
            id?: string;
            fileId: string;
            assetType: 'moodboard' | 'wireframe' | 'final_gallery';
            caption?: string;
            order: number;
        }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Собираем старые fileId ассетов до перезаписи
    const oldAssets = await db
        .select({ fileId: projectAssets.fileId })
        .from(projectAssets)
        .where(eq(projectAssets.projectId, projectId))
        .all();

    const oldFileIds = new Set<string>();
    for (const row of oldAssets) if (row.fileId) oldFileIds.add(row.fileId);

    await db.batch([
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
    ]);

    // Удаляем файлы, которые больше не используются в галерее
    const newFileIds = new Set<string>();
    for (const a of data.assets || []) if (a.fileId) newFileIds.add(a.fileId);

    const staleFileIds = [...oldFileIds].filter((id) => !newFileIds.has(id));
    if (staleFileIds.length > 0) {
        await deleteFilesByIds(staleFileIds);
    }

    revalidatePath(`/admin/projects/${projectId}`);
}

export async function getProjectGallery(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

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

    return { assets };
}

// ---- Section 07: Showcase (db.batch) ----

export async function updateProjectShowcase(
    projectId: string,
    data: {
        finalDescription?: string;
        designApproach?: string;
        testingProcess?: string;
        comparisons?: Array<{
            id?: string;
            featureName: string;
            beforeFileId?: string;
            afterFileId?: string;
            beforeText?: string;
            afterText?: string;
            order: number;
        }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // Собираем старые fileId сравнений до перезаписи
    const oldComparisons = await db
        .select({
            beforeFileId: projectComparisons.beforeFileId,
            afterFileId: projectComparisons.afterFileId,
        })
        .from(projectComparisons)
        .where(eq(projectComparisons.projectId, projectId))
        .all();

    const oldFileIds = new Set<string>();
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
    ]);

    // Удаляем файлы сравнений, которые больше не используются в showcase
    const newFileIds = new Set<string>();
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

// ---- Section 07b: Results & Tools ----

export async function updateProjectResults(
    projectId: string,
    data: {
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
        baCards?: Array<{
            id?: string;
            featureName: string;
            beforeText: string;
            afterText: string;
            order: number;
        }>;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.batch([
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

        // Replace ba_cards
        db.delete(baCards).where(eq(baCards.projectId, projectId)),
        ...(data.baCards || []).map((c) =>
            db.insert(baCards).values({
                id: c.id || crypto.randomUUID(),
                projectId,
                featureName: c.featureName,
                beforeText: c.beforeText,
                afterText: c.afterText,
                order: c.order,
            }),
        ),
    ]);

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
            role: projectPersonas.role,
            description: projectPersonas.description,
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

    const baCardsData = await db
        .select({
            id: baCards.id,
            featureName: baCards.featureName,
            beforeText: baCards.beforeText,
            afterText: baCards.afterText,
            order: baCards.order,
        })
        .from(baCards)
        .where(eq(baCards.projectId, projectId))
        .orderBy(asc(baCards.order))
        .all();

    return {
        finalDescription: project?.finalDescription,
        designApproach: project?.designApproach,
        testingProcess: project?.testingProcess,
        assets,
        comparisons,
        results,
        tools,
        baCards: baCardsData,
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
async function collectProjectFileIds(projectId: string): Promise<string[]> {
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

    return [...fileIds];
}

export async function deleteProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // 1. Собираем fileId ДО удаления проекта (пока ссылки ещё существуют)
    const fileIds = await collectProjectFileIds(projectId);

    // 2. Удаляем проект — каскадно удалятся projectAssets, projectPersonas,
    //    projectComparisons, projectReviews. Ссылка projects.coverFileId
    //    исчезнет вместе со строкой проекта.
    await db.delete(projects).where(eq(projects.id, projectId));

    // 3. Теперь файлы осиротели — удаляем их из R2 и из таблицы files
    if (fileIds.length > 0) {
        await deleteFilesByIds(fileIds);
    }

    revalidatePath('/admin');
}
