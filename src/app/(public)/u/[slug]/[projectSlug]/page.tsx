import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import {
    projects,
    projectAssets,
    projectPersonas,
    projectKeyMetrics,
    projectComparisons,
    projectReviews,
    projectItems,
    projectColorRoles,
} from '@/db/schema';
import { eq, and, asc, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const ASSET_DOMAIN = 'https://assets.ux42.studio';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string; projectSlug: string }>;
}

function getImageUrl(r2Key: string): string {
    return `${ASSET_DOMAIN}/${r2Key}`;
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className='max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-outline-variant last:border-b-0'>
            <h2 className='text-headline-sm text-on-background mb-6'>
                {title}
            </h2>
            {children}
        </section>
    );
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug, projectSlug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // 1. Find profile
    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: { id: true, slug: true, fullName: true, avatarFileId: true },
    });
    if (!profile) notFound();

    // 2. Find project
    const project = await db.query.projects.findFirst({
        where: {
            profileId: profile.id,
            slug: projectSlug,
            status: 'published',
        },
        with: {
            coverFile: true,
            projectCategories: { with: { category: true } },
        },
    });
    if (!project) notFound();

    // 3. Parallel load all related data
    const [
        assets,
        personas,
        keyMetrics,
        comparisons,
        reviews,
        items,
        colorRolesData,
    ] = await Promise.all([
        db.query.projectAssets.findMany({
            where: { projectId: project.id },
            with: { file: true },
            orderBy: { order: 'asc' },
        }),
        db.query.projectPersonas.findMany({
            where: { projectId: project.id },
            with: { avatarFile: true },
        }),
        db.query.projectKeyMetrics.findMany({
            where: { projectId: project.id },
            orderBy: { order: 'asc' },
        }),
        db.query.projectComparisons.findMany({
            where: { projectId: project.id },
            with: { beforeFile: true, afterFile: true },
            orderBy: { order: 'asc' },
        }),
        db.query.projectReviews.findMany({
            where: { projectId: project.id },
            with: { avatarFile: true },
            orderBy: { order: 'asc' },
        }),
        db.query.projectItems.findMany({
            where: { projectId: project.id },
            orderBy: { order: 'asc' },
        }),
        db.query.projectColorRoles.findMany({
            where: { projectId: project.id },
            with: { role: true },
            orderBy: { order: 'asc' },
        }),
    ]);

    // 4. Increment views (fire-and-forget)
    db.update(projects)
        .set({ viewsCount: sql`${projects.viewsCount} + 1` })
        .where(eq(projects.id, project.id))
        .run()
        .catch(() => {
            /* ignore */
        });

    const categories = project.projectCategories
        .map((pc) => pc.category)
        .filter((c): c is NonNullable<typeof c> => c !== null);

    const moodboardAssets = assets.filter((a) => a.assetType === 'moodboard');
    const wireframeAssets = assets.filter((a) => a.assetType === 'wireframe');
    const finalGalleryAssets = assets.filter(
        (a) => a.assetType === 'final_gallery',
    );
    const resultItems = items.filter((i) => i.type === 'result');
    const toolItems = items.filter((i) => i.type === 'tool');
    const nextStepItems = items.filter((i) => i.type === 'next_step');

    const hasSection01 =
        project.title ||
        project.teaser ||
        project.client ||
        project.year ||
        project.duration ||
        project.myRole ||
        project.devices ||
        project.tags ||
        project.figmaPrototypeUrl ||
        project.webPrototypeUrl ||
        categories.length > 0;
    const hasSection02 = !!(
        project.problemStatement ||
        project.projectGoal ||
        project.targetUsers
    );
    const hasSection03 = !!(
        project.researchMethodology ||
        project.userStory ||
        personas.length > 0 ||
        keyMetrics.length > 0
    );
    const hasSection04 = !!(
        project.visualDirection ||
        project.displayFont ||
        project.bodyFont ||
        project.designApproach ||
        colorRolesData.length > 0
    );
    const hasSection05 = !!(project.testingProcess || comparisons.length > 0);
    const hasSection06 = !!(
        project.finalDescription ||
        assets.length > 0 ||
        resultItems.length > 0 ||
        toolItems.length > 0
    );
    const hasSection07 = !!(
        project.keyTakeaway ||
        reviews.length > 0 ||
        nextStepItems.length > 0
    );

    return (
        <main className='max-w-page mx-auto'>
            {/* ====== Section 01: Intro & Meta ====== */}
            {hasSection01 && (
                <section className='relative'>
                    {project.coverFile ? (
                        <div className='relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem]'>
                            <Image
                                src={getImageUrl(project.coverFile.r2Key)}
                                alt={project.title}
                                fill
                                sizes='100vw'
                                className='object-cover'
                                priority
                            />
                            <div className='absolute inset-0 hero-title-scrim' />
                        </div>
                    ) : (
                        <div className='w-full h-64 sm:h-80 md:h-96 bg-surface-variant' />
                    )}

                    <div className='max-w-content mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-10'>
                        <h1 className='text-display-sm text-on-background mb-3'>
                            {project.title}
                        </h1>
                        {project.teaser && (
                            <p className='text-body-lg text-on-surface-variant mb-6 max-w-2xl'>
                                {project.teaser}
                            </p>
                        )}

                        {/* Meta table */}
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                            {project.client && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        Client
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.client}
                                    </span>
                                </div>
                            )}
                            {project.year && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        Year
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.year}
                                    </span>
                                </div>
                            )}
                            {project.duration && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        Duration
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.duration}
                                    </span>
                                </div>
                            )}
                            {project.myRole && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        My Role
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.myRole}
                                    </span>
                                </div>
                            )}
                            {project.devices && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        Devices
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.devices}
                                    </span>
                                </div>
                            )}
                            {project.tags && (
                                <div>
                                    <span className='text-label-sm text-on-surface-variant block'>
                                        Tags
                                    </span>
                                    <span className='text-body-md text-on-surface'>
                                        {project.tags}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Prototype links */}
                        {(project.figmaPrototypeUrl ||
                            project.webPrototypeUrl) && (
                            <div className='flex flex-wrap gap-3 mt-6'>
                                {project.figmaPrototypeUrl && (
                                    <a
                                        href={project.figmaPrototypeUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-label-md hover:opacity-90 transition-opacity'
                                    >
                                        Figma Prototype
                                    </a>
                                )}
                                {project.webPrototypeUrl && (
                                    <a
                                        href={project.webPrototypeUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary text-label-md hover:opacity-90 transition-opacity'
                                    >
                                        Web Prototype
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-4'>
                                {categories.map((cat) => (
                                    <span
                                        key={cat.slug}
                                        className='inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-sm'
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ====== Section 02: Problem & Audience ====== */}
            {hasSection02 && (
                <Section title='Problem & Audience'>
                    <div className='space-y-6'>
                        {project.problemStatement && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Problem Statement
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.problemStatement}
                                </p>
                            </div>
                        )}
                        {project.projectGoal && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Project Goal
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.projectGoal}
                                </p>
                            </div>
                        )}
                        {project.targetUsers && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Target Users
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.targetUsers}
                                </p>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* ====== Section 03: User Research ====== */}
            {hasSection03 && (
                <Section title='User Research'>
                    <div className='space-y-8'>
                        {project.researchMethodology && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Research Methodology
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.researchMethodology}
                                </p>
                            </div>
                        )}
                        {project.userStory && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    User Story
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.userStory}
                                </p>
                            </div>
                        )}

                        {/* Personas */}
                        {personas.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Personas
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {personas.map((persona) => (
                                        <div
                                            key={persona.id}
                                            className='rounded-xl border border-outline-variant bg-surface p-4 space-y-3'
                                        >
                                            <div className='flex items-center gap-3'>
                                                {persona.avatarFile ? (
                                                    <div className='relative w-12 h-12 rounded-full overflow-hidden bg-surface-variant shrink-0'>
                                                        <Image
                                                            src={getImageUrl(
                                                                persona
                                                                    .avatarFile
                                                                    .r2Key,
                                                            )}
                                                            alt={
                                                                persona.nameAndAge
                                                            }
                                                            fill
                                                            sizes='48px'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className='w-12 h-12 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-on-surface-variant text-title-sm'>
                                                        {persona.nameAndAge.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                )}
                                                <span className='text-title-md text-on-surface'>
                                                    {persona.nameAndAge}
                                                </span>
                                            </div>
                                            <p className='text-body-sm text-on-surface-variant'>
                                                {persona.bio}
                                            </p>
                                            <div>
                                                <span className='text-label-sm text-on-surface-variant block mb-1'>
                                                    Pain Points
                                                </span>
                                                <p className='text-body-sm text-on-surface-variant'>
                                                    {persona.painPoints}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Key Metrics */}
                        {keyMetrics.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Key Metrics
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                    {keyMetrics.map((metric) => (
                                        <div
                                            key={metric.id}
                                            className='rounded-xl border border-outline-variant bg-surface p-4 text-center'
                                        >
                                            <p className='text-headline-sm text-primary'>
                                                {metric.value}
                                            </p>
                                            <p className='text-body-sm text-on-surface-variant mt-1'>
                                                {metric.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* ====== Section 04: Design Process ====== */}
            {hasSection04 && (
                <Section title='Design Process'>
                    <div className='space-y-8'>
                        {project.visualDirection && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Visual Direction
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.visualDirection}
                                </p>
                            </div>
                        )}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {project.displayFont && (
                                <div>
                                    <h3 className='text-title-md text-on-surface mb-1'>
                                        Display Font
                                    </h3>
                                    <p className='text-body-md text-on-surface-variant'>
                                        {project.displayFont}
                                    </p>
                                </div>
                            )}
                            {project.bodyFont && (
                                <div>
                                    <h3 className='text-title-md text-on-surface mb-1'>
                                        Body Font
                                    </h3>
                                    <p className='text-body-md text-on-surface-variant'>
                                        {project.bodyFont}
                                    </p>
                                </div>
                            )}
                        </div>
                        {project.designApproach && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Design Approach
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.designApproach}
                                </p>
                            </div>
                        )}

                        {/* Color Roles */}
                        {colorRolesData.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Color Roles
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {colorRolesData
                                        .filter((cr) => cr.role !== null)
                                        .map((cr) => {
                                            const role = cr.role!;
                                            return (
                                                <div
                                                    key={cr.roleId}
                                                    className='rounded-xl border border-outline-variant bg-surface p-4 space-y-3'
                                                >
                                                    <p className='text-title-sm text-on-surface'>
                                                        {role.name}
                                                    </p>
                                                    <div className='space-y-2'>
                                                        <div className='flex items-center gap-2'>
                                                            <span className='text-label-sm text-on-surface-variant w-12'>
                                                                Light
                                                            </span>
                                                            <div className='flex gap-1'>
                                                                <div
                                                                    className='w-8 h-8 rounded border border-outline-variant'
                                                                    style={{
                                                                        backgroundColor:
                                                                            role.lightColor1,
                                                                    }}
                                                                />
                                                                <div
                                                                    className='w-8 h-8 rounded border border-outline-variant'
                                                                    style={{
                                                                        backgroundColor:
                                                                            role.lightColor2,
                                                                    }}
                                                                />
                                                            </div>
                                                            {role.lightContrastRatio && (
                                                                <span className='text-label-sm text-on-surface-variant'>
                                                                    {
                                                                        role.lightContrastRatio
                                                                    }
                                                                    :1
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <span className='text-label-sm text-on-surface-variant w-12'>
                                                                Dark
                                                            </span>
                                                            <div className='flex gap-1'>
                                                                <div
                                                                    className='w-8 h-8 rounded border border-outline-variant'
                                                                    style={{
                                                                        backgroundColor:
                                                                            role.darkColor1,
                                                                    }}
                                                                />
                                                                <div
                                                                    className='w-8 h-8 rounded border border-outline-variant'
                                                                    style={{
                                                                        backgroundColor:
                                                                            role.darkColor2,
                                                                    }}
                                                                />
                                                            </div>
                                                            {role.darkContrastRatio && (
                                                                <span className='text-label-sm text-on-surface-variant'>
                                                                    {
                                                                        role.darkContrastRatio
                                                                    }
                                                                    :1
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* ====== Section 05: Testing & Iteration ====== */}
            {hasSection05 && (
                <Section title='Testing & Iteration'>
                    <div className='space-y-8'>
                        {project.testingProcess && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Testing Process
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.testingProcess}
                                </p>
                            </div>
                        )}

                        {/* Before/After Comparisons */}
                        {comparisons.length > 0 && (
                            <div className='space-y-6'>
                                {comparisons.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className='rounded-xl border border-outline-variant bg-surface p-4 space-y-4'
                                    >
                                        <h4 className='text-title-md text-on-surface'>
                                            {comp.featureName}
                                        </h4>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='space-y-2'>
                                                <span className='text-label-sm text-on-surface-variant'>
                                                    Before
                                                </span>
                                                {comp.beforeFile ? (
                                                    <div className='relative aspect-[16/10] rounded-lg overflow-hidden bg-surface-variant'>
                                                        <Image
                                                            src={getImageUrl(
                                                                comp.beforeFile
                                                                    .r2Key,
                                                            )}
                                                            alt={`Before: ${comp.featureName}`}
                                                            fill
                                                            sizes='(max-width: 768px) 100vw, 50vw'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className='aspect-[16/10] rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant text-body-sm'>
                                                        No image
                                                    </div>
                                                )}
                                                {comp.beforeText && (
                                                    <p className='text-body-sm text-on-surface-variant'>
                                                        {comp.beforeText}
                                                    </p>
                                                )}
                                            </div>
                                            <div className='space-y-2'>
                                                <span className='text-label-sm text-on-surface-variant'>
                                                    After
                                                </span>
                                                {comp.afterFile ? (
                                                    <div className='relative aspect-[16/10] rounded-lg overflow-hidden bg-surface-variant'>
                                                        <Image
                                                            src={getImageUrl(
                                                                comp.afterFile
                                                                    .r2Key,
                                                            )}
                                                            alt={`After: ${comp.featureName}`}
                                                            fill
                                                            sizes='(max-width: 768px) 100vw, 50vw'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className='aspect-[16/10] rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant text-body-sm'>
                                                        No image
                                                    </div>
                                                )}
                                                {comp.afterText && (
                                                    <p className='text-body-sm text-on-surface-variant'>
                                                        {comp.afterText}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* ====== Section 06: Final Showcase ====== */}
            {hasSection06 && (
                <Section title='Final Showcase'>
                    <div className='space-y-8'>
                        {project.finalDescription && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Final Description
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.finalDescription}
                                </p>
                            </div>
                        )}

                        {/* Gallery: Moodboard */}
                        {moodboardAssets.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Moodboard
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {moodboardAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className='space-y-2'
                                        >
                                            {asset.file && (
                                                <div className='relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-variant'>
                                                    <Image
                                                        src={getImageUrl(
                                                            asset.file.r2Key,
                                                        )}
                                                        alt={
                                                            asset.caption ?? ''
                                                        }
                                                        fill
                                                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                                        className='object-cover'
                                                    />
                                                </div>
                                            )}
                                            {asset.caption && (
                                                <p className='text-body-sm text-on-surface-variant text-center'>
                                                    {asset.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery: Wireframes */}
                        {wireframeAssets.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Wireframes
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {wireframeAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className='space-y-2'
                                        >
                                            {asset.file && (
                                                <div className='relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-variant'>
                                                    <Image
                                                        src={getImageUrl(
                                                            asset.file.r2Key,
                                                        )}
                                                        alt={
                                                            asset.caption ?? ''
                                                        }
                                                        fill
                                                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                                        className='object-cover'
                                                    />
                                                </div>
                                            )}
                                            {asset.caption && (
                                                <p className='text-body-sm text-on-surface-variant text-center'>
                                                    {asset.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery: Final */}
                        {finalGalleryAssets.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Final Gallery
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {finalGalleryAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className='space-y-2'
                                        >
                                            {asset.file && (
                                                <div className='relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-variant'>
                                                    <Image
                                                        src={getImageUrl(
                                                            asset.file.r2Key,
                                                        )}
                                                        alt={
                                                            asset.caption ?? ''
                                                        }
                                                        fill
                                                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                                        className='object-cover'
                                                    />
                                                </div>
                                            )}
                                            {asset.caption && (
                                                <p className='text-body-sm text-on-surface-variant text-center'>
                                                    {asset.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {resultItems.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-3'>
                                    Results
                                </h3>
                                <ul className='space-y-2'>
                                    {resultItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className='flex items-start gap-2 text-body-md text-on-surface-variant'
                                        >
                                            <span className='text-primary mt-1.5 shrink-0'>
                                                •
                                            </span>
                                            {item.content}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tools */}
                        {toolItems.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-3'>
                                    Tools
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                    {toolItems.map((item) => (
                                        <span
                                            key={item.id}
                                            className='inline-block px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-label-md'
                                        >
                                            {item.content}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* ====== Section 07: Reflection & Next Steps ====== */}
            {hasSection07 && (
                <Section title='Reflection & Next Steps'>
                    <div className='space-y-8'>
                        {project.keyTakeaway && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-2'>
                                    Key Takeaway
                                </h3>
                                <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                    {project.keyTakeaway}
                                </p>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-4'>
                                    Reviews
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className='rounded-xl border border-outline-variant bg-surface p-4 space-y-3'
                                        >
                                            <p className='text-body-md text-on-surface-variant italic'>
                                                &ldquo;{review.text}&rdquo;
                                            </p>
                                            <div className='flex items-center gap-3'>
                                                {review.avatarFile ? (
                                                    <div className='relative w-10 h-10 rounded-full overflow-hidden bg-surface-variant shrink-0'>
                                                        <Image
                                                            src={getImageUrl(
                                                                review
                                                                    .avatarFile
                                                                    .r2Key,
                                                            )}
                                                            alt={
                                                                review.authorName
                                                            }
                                                            fill
                                                            sizes='40px'
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className='w-10 h-10 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-on-surface-variant text-label-md'>
                                                        {review.authorName.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='text-title-sm text-on-surface'>
                                                        {review.authorName}
                                                    </p>
                                                    {review.authorRole && (
                                                        <p className='text-body-sm text-on-surface-variant'>
                                                            {review.authorRole}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Next Steps */}
                        {nextStepItems.length > 0 && (
                            <div>
                                <h3 className='text-title-lg text-on-surface mb-3'>
                                    Next Steps
                                </h3>
                                <ul className='space-y-2'>
                                    {nextStepItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className='flex items-start gap-2 text-body-md text-on-surface-variant'
                                        >
                                            <span className='text-primary mt-1.5 shrink-0'>
                                                →
                                            </span>
                                            {item.content}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Section>
            )}
        </main>
    );
}
