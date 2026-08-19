import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects     baCards,
} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { SiteHeaderBreadcrumb } from '@/components/case/SiteHeader';
import { Hero } from '@/components/case/Hero';
import { CaseSection } from '@/components/case/CaseSection';
import { SectionLabel } from '@/components/case/BlockLabel';
import { PortfolioCard } from '@/components/case/PortfolioCard';
import { MetricCard } from '@/components/case/MetricCard';
import { PersonaCard } from '@/components/case/PersonaCard';
import { BeforeAfterComparison } from '@/components/case/BeforeAfterComparison';
import { GalleryGrid } from '@/components/case/GalleryGrid';
import { DesignSystemColors } from '@/components/case/DesignSystemColors';
import { TypographyScale } from '@/components/case/TypographyScale';
import { LinkButton } from '@/components/case/LinkButton';
import { ResultsCard } from '@/components/case/ResultsCard';
import { TagBadge } from '@/components/case/TagBadge';
import { NextStepsList } from '@/components/case/NextStepsList';
import { NextProjectShowcase } from '@/components/case/NextProjectShowcase';
import { SiteFooter } from '@/components/case/SiteFooter';
import AuthBar from '@/components/AuthBar';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string; projectSlug: string }>;
}

function getImageUrl(r2Key: string): string {
    return `/r2/${r2Key}`;
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug, projectSlug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    // 1. Найти профиль
    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: {
            id: true,
            userId: true,
            slug: true,
            fullName: true,
            avatarFileId: true,
        },
    });
    if (!profile) notFound();

    // 2. Найти проект
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

    // 3. Параллельная загрузка всех данных кейса
    const [assets, personas, keyMetrics, comparisons, items, colorRolesData] =
        baCardsData,
        await Promise.all([
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
            db.query.projectItems.findMany({
                where: { projectId: project.id },
                orderBy: { order: 'asc' },
            }),
            db.query.colorRoles.findMany({
                where: { projectId: project.id },
                orderBy: { order: 'asc' },
            }),
            db.query.baCards.findMany({
            where: { projectId: project.id },
            orderBy: { order: 'asc' },
        }),
    ]);

    // 4. Инкремент просмотров (fire-and-forget)
    void db
        .update(projects)
        .set({ viewsCount: sql`${projects.viewsCount} + 1` })
        .where(eq(projects.id, project.id));

    // 5. Следующий проект (самый свежий опубликованный, не текущий)
    const siblingProjects = await db.query.projects.findMany({
        where: {
            profileId: profile.id,
            status: 'published',
        },
        with: { coverFile: true },
        orderBy: { createdAt: 'desc' },
    });
    const nextProject = siblingProjects.find(
        (p) => p.id !== project.id,
    );

    // ---- Производные данные ----

    const categories = project.projectCategories
        .map((pc) => pc.category?.name)
        .filter((name): name is string => !!name);

    const timeline = [project.year, project.duration]
        .filter(Boolean)
        .join(' · ');

    const toAsset = (a: (typeof assets)[number]) => ({
        id: a.id,
        url: a.file?.r2Key ? getImageUrl(a.file.r2Key) : undefined,
        caption: a.caption,
        alt: a.caption ?? undefined,
    });

    const moodboardAssets = assets
        .filter((a) => a.assetType === 'moodboard')
        .map(toAsset);
    const wireframeAssets = assets
        .filter((a) => a.assetType === 'wireframe')
        .map(toAsset);
    const finalGalleryAssets = assets
        .filter((a) => a.assetType === 'final_gallery')
        .map(toAsset);

    const resultItems = items.filter((i) => i.type === 'result');
    const toolItems = items.filter((i) => i.type === 'tool');
    const nextStepItems = items.filter((i) => i.type === 'next_step');

    const showProblem = !!(
        project.problemStatement ||
        project.projectGoal ||
        project.targetUsers
    );
    const showResearch = !!(
        project.researchMethodology ||
        keyMetrics.length > 0 ||
        personas.length > 0
    );
    const showDesignProcess = !!(
        project.designApproach ||
        wireframeAssets.length > 0 ||
        project.webPrototypeUrl
    );
    const showDesignSystem = !!(
        moodboardAssets.length > 0 ||
        colorRolesData.length > 0 ||
        project.displayFont ||
        project.bodyFont
    );
    const showTesting = comparisons.length > 0;
    const showFinalDesign = !!(
        finalGalleryAssets.length > 0 ||
        resultItems.length > 0 ||
        toolItems.length > 0 ||
        project.figmaPrototypeUrl
    );
    const showReflection = !!(
        project.keyTakeaway ||
        nextStepItems.length > 0
    );

    const nextProjectCard = nextProject
        ? {
              slug: nextProject.slug,
              title: nextProject.title,
              teaser: nextProject.teaser,
              coverUrl: nextProject.coverFile?.r2Key
                  ? getImageUrl(nextProject.coverFile.r2Key)
                  : undefined,
          }
        : null;

    return (
        <div className='min-h-screen w-full bg-surface-container-low'>
            {/* Content column: 1200px centered [198:1310] */}
            <div className='mx-auto w-full max-w-container-content'>
                {/* Header [245:1632] — Breadcrumb variant with glass effects */}
                <SiteHeaderBreadcrumb
                    profileSlug={slug}
                    currentTitle={project.title}
                />

                <main>
                    {/* Hero [198:1312] — Schemes/Background */}
                    <Hero
                        title={project.title}
                        teaser={project.teaser}
                        coverUrl={
                            project.coverFile
                                ? getImageUrl(project.coverFile.r2Key)
                                : undefined
                        }
                        categories={categories}
                        client={project.client}
                        timeline={timeline || undefined}
                        role={project.myRole}
                        devices={project.devices}
                    />

                    {/* Main Content Sections [199:25] + Next Project [198:1336]
                        Schemes/Surface Container Lowest, gap=64, pad=80/64 */}
                    <div className='bg-surface-container-lowest'>
                        <div className='flex flex-col gap-16 px-8 py-20 sm:px-12 lg:px-16'>
                    {/* Section 01 — Problem & Audience [199:26] */}
                    {showProblem && (
                        <CaseSection
                            number='01'
                            label='Problem & Audience'
                            title='What problem are we solving?'
                            description={project.problemStatement}
                        >
                            <div className='flex flex-col gap-6 sm:flex-row'>
                                {project.projectGoal && (
                                    <PortfolioCard
                                        title='Goal'
                                        body={project.projectGoal}
                                    />
                                )}
                                {project.targetUsers && (
                                    <PortfolioCard
                                        title='Target users'
                                        body={project.targetUsers}
                                    />
                                )}
                            </div>
                        </CaseSection>
                    )}

                    {/* Section 02 — User Research [195:1178] */}
                    {showResearch && (
                        <CaseSection
                            number='02'
                            label='User Research'
                            title='What the data revealed.'
                            description={project.researchMethodology}
                        >
                            {keyMetrics.length > 0 && (
                                <div className='flex flex-col gap-6 sm:flex-row'>
                                    {keyMetrics.map((metric) => (
                                        <MetricCard
                                            key={metric.id}
                                            value={metric.value}
                                            description={metric.description}
                                        />
                                    ))}
                                </div>
                            )}
                            {personas.map((persona) => (
                                <PersonaCard
                                    key={persona.id}
                                    nameAndAge={persona.nameAndAge}
                                    avatarUrl={
                                        persona.avatarFile
                                            ? getImageUrl(
                                                  persona.avatarFile.r2Key,
                                              )
                                            : undefined
                                    }
                                    bio={persona.bio}
                                    painPoints={persona.painPoints}
                                />
                            ))}
                        </CaseSection>
                    )}

                    {/* Section 03 — Design Process [199:49] */}
                    {showDesignProcess && (
                        <CaseSection
                            number='03'
                            label='Design Process'
                            title='From blank page to structure.'
                            description={project.designApproach}
                        >
                            <div className='flex flex-col gap-8'>
                                {/* Wireframes Grid [199:57] */}
                                {wireframeAssets.length > 0 && (
                                    <div className='flex flex-col gap-6'>
                                        <SectionLabel>Wireframes</SectionLabel>
                                        <GalleryGrid
                                            assets={wireframeAssets}
                                            columns={2}
                                        />
                                    </div>
                                )}

                                {/* Lo-Fi Prototype Link [412:854] */}
                                {project.webPrototypeUrl && (
                                    <LinkButton
                                        href={project.webPrototypeUrl}
                                        external
                                    >
                                        View Lo-Fi prototype in Figma
                                    </LinkButton>
                                )}
                            </div>
                        </CaseSection>
                    )}

                    {/* Section 04 — Design System [276:135] */}
                    {showDesignSystem && (
                        <CaseSection
                            number='04'
                            label='Design System'
                            title='Visual language & token system.'
                            description={project.visualDirection}
                        >
                            <div className='flex flex-col gap-8'>
                                {/* 4a. Moodboard [276:142] */}
                                {moodboardAssets.length > 0 && (
                                    <div className='flex flex-col gap-6'>
                                        <SectionLabel>Moodboard</SectionLabel>
                                        <GalleryGrid
                                            assets={moodboardAssets}
                                            masonry
                                        />
                                    </div>
                                )}

                                {/* 4b. Color Tokens [276:148] */}
                                {colorRolesData.length > 0 && (
                                    <DesignSystemColors
                                        roles={colorRolesData}
                                    />
                                )}

                                {/* 4c. Typography Scale [280:217] */}
                                <TypographyScale
                                    displayFont={project.displayFont}
                                    bodyFont={project.bodyFont}
                                />
                            </div>
                        </CaseSection>
                    )}

                    {/* Section 05 — Testing & Iteration [199:76] */}
                    {showTesting && (
                        <CaseSection
                            number='05'
                            label='Testing & Iteration'
                            title='What users taught me.'
                            description={project.testingProcess}
                        >
                            <div className='flex flex-col gap-8'>
                                {comparisons.map((comp) => (
                                    <BeforeAfterComparison
                                        key={comp.id}
                                        featureName={comp.featureName}
                                        beforeUrl={
                                            comp.beforeFile
                                                ? getImageUrl(
                                                      comp.beforeFile.r2Key,
                                                  )
                                                : undefined
                                        }
                                        afterUrl={
                                            comp.afterFile
                                                ? getImageUrl(
                                                      comp.afterFile.r2Key,
                                                  )
                                                : undefined
                                        }
                                        beforeText={comp.beforeText}
                                        afterText={comp.afterText}
                                    />
                                ))}
                            </div>
                        </CaseSection>
                    )}

                    {/* Section 06 — Final Design [199:93] */}
                    {showFinalDesign && (
                        <CaseSection
                            number='06'
                            label='Final Design'
                            title='The Finished Product'
                            description={project.finalDescription}
                        >
                            <div className='flex flex-col gap-8'>
                                {/* Showcase Images */}
                                {finalGalleryAssets.length > 0 && (
                                    <GalleryGrid
                                        assets={finalGalleryAssets}
                                        showcase
                                    />
                                )}

                                {/* Hi-Fi Prototype Link */}
                                {project.figmaPrototypeUrl && (
                                    <LinkButton
                                        href={project.figmaPrototypeUrl}
                                        external
                                    >
                                        View Hi-Fi prototype in Figma
                                    </LinkButton>
                                )}

                                {/* Results — 2-col grid, gap=24 */}
                                {resultItems.length > 0 && (
                                    <div className='flex flex-col gap-6'>
                                        <SectionLabel>Results</SectionLabel>
                                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                            {resultItems.map((item) => (
                                                <ResultsCard
                                                    key={item.id}
                                                    content={item.content}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tools & technologies — horizontal TagBadge */}
                                {toolItems.length > 0 && (
                                    <div className='flex flex-col gap-4'>
                                        <SectionLabel>
                                            Tools &amp; technologies
                                        </SectionLabel>
                                        <div className='flex flex-wrap gap-3'>
                                            {toolItems.map((tool) => (
                                                <TagBadge key={tool.id}>
                                                    {tool.content}
                                                </TagBadge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CaseSection>
                    )}

                    {/* Section 07 — Reflection [199:110] */}
                    {showReflection && (
                        <CaseSection
                            number='07'
                            label='Reflection'
                            title='What I learned.'
                            description={project.keyTakeaway}
                        >
                            {nextStepItems.length > 0 && (
                                <div className='flex flex-col gap-6'>
                                    <SectionLabel>Next steps</SectionLabel>
                                    <NextStepsList items={nextStepItems} />
                                </div>
                            )}
                        </CaseSection>
                    )}
                        </div>

                        {/* Next Project Showcase [198:1336] */}
                        <NextProjectShowcase
                            nextProject={nextProjectCard}
                            profileSlug={slug}
                            contactUrl={null}
                        />
                    </div>

                    {/* Footer [234:1544] */}
                    <SiteFooter
                        profileSlug={slug}
                        profileName={profile.fullName}
                        profileHeadline={null}
                        socialLinks={[]}
                    />
                </main>
            </div>
        </div>
    );
}





