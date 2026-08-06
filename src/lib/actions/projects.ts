'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import {
    projects,
    projectCategories,
    projectAssets,
} from '@/db/schema/projects';
import {
    projectPersonas,
    projectKeyMetrics,
    projectComparisons,
    projectReviews,
    projectItems,
} from '@/db/schema/project-details';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(projects).set(data).where(eq(projects.id, projectId));
    revalidatePath(`/admin/projects/${projectId}`);
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

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Section 04: Design System ----

export async function updateProjectDesign(
    projectId: string,
    data: {
        visualDirection?: string;
        displayFont?: string;
        bodyFont?: string;
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.update(projects).set(data).where(eq(projects.id, projectId));
    revalidatePath(`/admin/projects/${projectId}`);
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

        // Replace result items
        db.delete(projectItems).where(
            eq(projectItems.projectId, projectId),
            // Удаляем только results и tools, не next_steps
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
    },
) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

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
                avatarFileId: r.avatarFileId,
                order: r.order,
            }),
        ),

        // Replace next_step items
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

    revalidatePath(`/admin/projects/${projectId}`);
}

// ---- Delete ----

export async function deleteProject(projectId: string) {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    await db.delete(projects).where(eq(projects.id, projectId));
    revalidatePath('/admin');
}
