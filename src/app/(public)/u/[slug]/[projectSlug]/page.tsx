import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/jwt';
import type { Metadata } from 'next';
import { SiteHeaderBreadcrumb } from '@/components/case/SiteHeader';
import { Hero } from '@/components/case/Hero';
import { CaseSection } from '@/components/case/CaseSection';
import { RichText } from '@/components/case/RichText';
import { SectionLabel } from '@/components/case/BlockLabel';
import { PortfolioCard } from '@/components/case/PortfolioCard';
import { MetricCard } from '@/components/case/MetricCard';
import { PersonaCard } from '@/components/case/PersonaCard';
import { BeforeAfterComparison } from '@/components/case/BeforeAfterComparison';
import { GalleryGrid } from '@/components/case/GalleryGrid';
import { ShowcaseGallery } from '@/components/case/ShowcaseGallery';
import { MasonryGallery } from '@/components/case/MasonryGallery';
import { JustifiedGallery } from '@/components/case/JustifiedGallery';
import { MoodboardGrid } from '@/components/case/MoodboardGrid';
import { DesignSystemColors } from '@/components/case/DesignSystemColors';
import { TypographyScale } from '@/components/case/TypographyScale';
import { LinkButton } from '@/components/case/LinkButton';
import { ResultsCard } from '@/components/case/ResultsCard';
import { TagBadge } from '@/components/case/TagBadge';
import { NextStepsList } from '@/components/case/NextStepsList';
import { TestimonialCard } from '@/components/case/TestimonialCard';
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

// Ключи секций кейса (совпадают с SectionsVisibilityEditor) —
// порядок массива = порядок секций на странице
type CaseSectionKey =
    | 'problem'
    | 'research'
    | 'designProcess'
    | 'designSystem'
    | 'testing'
    | 'finalDesign'
    | 'reflection';

const CASE_SECTION_ORDER: CaseSectionKey[] = [
    'problem',
    'research',
    'designProcess',
    'designSystem',
    'testing',
    'finalDesign',
    'reflection',
];

// ---- SEO (C6, решение (42)): title/description кейса; OG наследуется
// (специфичная OG-картинка есть только у профиля — ogFile).
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug, projectSlug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: { id: true, fullName: true },
    });
    if (!profile) return { title: 'UX42 Studio' };

    const project = await db.query.projects.findFirst({
        where: { profileId: profile.id, slug: projectSlug, status: 'published' },
        columns: { title: true, teaser: true },
    });
    if (!project) return { title: 'UX42 Studio' };

    return {
        title: `${project.title} — ${profile.fullName}`,
        description: project.teaser ?? undefined,
    };
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

    // 2. Найти проект (любой статус — черновик видит владелец, см. ниже)
    const project = await db.query.projects.findFirst({
        where: {
            profileId: profile.id,
            slug: projectSlug,
        },
        with: {
            coverFile: true,
            projectCategories: { with: { category: true } },
        },
    });
    if (!project) notFound();

    // Превью черновиков: неопубликованный кейс виден только владельцу,
    // остальным — 404 (тот же паттерн, что на странице профиля).
    let isOwner = false;
    if (project.status !== 'published') {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        const jwtSecret = env.JWT_SECRET || process.env.JWT_SECRET;
        if (token && jwtSecret) {
            const payload = await verifyJwt(token, jwtSecret);
            const viewerId =
                payload && typeof payload.userId === 'string'
                    ? payload.userId
                    : null;
            isOwner = viewerId === profile.userId;
        }
        if (!isOwner) notFound();
    }

    // 3. Параллельная загрузка всех данных кейса
    const [assets, personas, keyMetrics, comparisons, items, colorRolesData, reviews, baCardsData] =
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
            db.query.projectReviews.findMany({
                where: { projectId: project.id },
                with: { avatarFile: true },
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
    const nextProject = siblingProjects.find((p) => p.id !== project.id);

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
        // Натуральные размеры кадра — для masonry/stack (решение (51));
        // editorial-слоты их не используют (кроп в фикс. слоты)
        width: a.file?.width,
        height: a.file?.height,
        // Фокус-точка object-position (мудборд: панорамирование в слоте)
        posX: a.posX ?? 50,
        posY: a.posY ?? 50,
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

    // Вариант лейаута финальной галереи (решение (51) 2026-09-14):
    // editorial (дефолт) / masonry / stack — задаётся в админке
    const galleryLayout = project.galleryLayout ?? 'editorial';

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
        project.designApproach || wireframeAssets.length > 0
    );
    const showDesignSystem = !!(
        moodboardAssets.length > 0 ||
        colorRolesData.length > 0 ||
        project.displayFont ||
        project.bodyFont
    );
    const showTesting =
        comparisons.length > 0 || !!project.testingProcess?.trim();
    const showFinalDesign = !!(
        finalGalleryAssets.length > 0 ||
        resultItems.length > 0 ||
        toolItems.length > 0 ||
        project.figmaPrototypeUrl ||
        project.webPrototypeUrl
    );
    const showReflection = !!(project.keyTakeaway || nextStepItems.length > 0);

    // Видимость секций: авто-скрытие пустых секций + чекбоксы визарда
    // (projects.sectionsVisibility, ключ absent = показывать). Номера секций
    // перенумеровываются подряд по фактически показанным.
    const visibility = project.sectionsVisibility ?? {};
    const sectionHasData: Record<CaseSectionKey, boolean> = {
        problem: showProblem,
        research: showResearch,
        designProcess: showDesignProcess,
        designSystem: showDesignSystem,
        testing: showTesting,
        finalDesign: showFinalDesign,
        reflection: showReflection,
    };
    const caseNumbers: Record<CaseSectionKey, string | undefined> = {
        problem: undefined,
        research: undefined,
        designProcess: undefined,
        designSystem: undefined,
        testing: undefined,
        finalDesign: undefined,
        reflection: undefined,
    };
    {
        let n = 0;
        for (const key of CASE_SECTION_ORDER) {
            if (sectionHasData[key] && visibility[key] !== false) {
                n += 1;
                caseNumbers[key] = String(n).padStart(2, '0');
            }
        }
    }

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
            <AuthBar projectId={project?.id} profileUserId={profile?.userId} />

            {/* Превью черновика: видит только владелец (страница не отдаёт
                404 хозяину кейса). role='status' — озвучивается скринридером. */}
            {project.status !== 'published' && (
                <div
                    role='status'
                    className='border-b border-outline-variant bg-primary-container text-on-primary-container'
                >
                    <div className='mx-auto max-w-container-content px-4 py-2 text-label-sm sm:px-6 lg:px-8'>
                        Draft — only you can see this case. Publish it from
                        your dashboard.
                    </div>
                </div>
            )}

            {/* Header [245:1632] — Breadcrumb variant with glass effects.
                Паттерн главной: full-bleed ленты + section-container —
                столбец max-w-container-content удалён (фидбэк (13) §14:
                «ширину блоков — как на главной, пусть в разрез со спекой»). */}
                <SiteHeaderBreadcrumb
                    profileSlug={slug}
                    displayName={profile.fullName}
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
                    {/* section-container: pads 24/48/64 — единая ось с шапкой,
                        футером и главной. Вертикаль: Mobile Frame §11 gap=32,
                        десктоп 64; py 64 → lg 80 (pad=80/64). */}
                        <div className='section-container flex flex-col gap-8 py-16 md:gap-16 lg:py-20'>
                            {/* Section 01 — Problem & Audience [199:26] */}
                            {caseNumbers.problem && (
                                <CaseSection
                                    number={caseNumbers.problem}
                                    label='Problem & Audience'
                                    title={project.problemTitle ?? 'The challenge'}
                                    description={project.problemStatement}
                                >
                                    <div className='flex flex-col gap-6 md:flex-row'>
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
                            {caseNumbers.research && (
                                <CaseSection
                                    number={caseNumbers.research}
                                    label='User Research'
                                    title={project.researchTitle ?? 'What the data revealed'}
                                    description={project.researchMethodology}
                                >
                                    {keyMetrics.length > 0 && (
                                        <div className='flex flex-col gap-6 md:flex-row'>
                                            {keyMetrics.map((metric) => (
                                                <MetricCard
                                                    key={metric.id}
                                                    value={metric.value}
                                                    description={
                                                        metric.description
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {personas.map((persona) => (
                                        <PersonaCard
                                            key={persona.id}
                                            nameAndAge={persona.nameAndAge}
                                            role={persona.role}
                                            description={persona.description}
                                            avatarUrl={
                                                persona.avatarFile
                                                    ? getImageUrl(
                                                          persona.avatarFile
                                                              .r2Key,
                                                      )
                                                    : undefined
                                            }
                                        />
                                    ))}
                                    {project.userStory && (
                                        <PortfolioCard
                                            title='User story'
                                            body={project.userStory}
                                        />
                                    )}
                                </CaseSection>
                            )}

                            {/* Section 03 — Design Process [199:49] */}
                            {caseNumbers.designProcess && (
                                <CaseSection
                                    number={caseNumbers.designProcess}
                                    label='Design Process'
                                    title={project.designProcessTitle ?? 'From blank page to structure'}
                                    description={project.designApproach}
                                >
                                    <div className='flex flex-col gap-8'>
                                        {/* Wireframes Grid [199:57] */}
                                        {wireframeAssets.length > 0 && (
                                            <div className='flex flex-col gap-6'>
                                                <SectionLabel>
                                                    Wireframes
                                                </SectionLabel>
                                                <GalleryGrid
                                                    assets={wireframeAssets}
                                                    columns={2}
                                                />
                                            </div>
                                        )}

                                        {/* Prototype link перенесён в Final
                                            Design — webPrototypeUrl это
                                            финальная веб-демка, а не lo-fi
                                            (фидбэк 2026-10-26) */}
                                    </div>
                                </CaseSection>
                            )}

                            {/* Section 04 — Design System [276:135] */}
                            {caseNumbers.designSystem && (
                                <CaseSection
                                    number={caseNumbers.designSystem}
                                    label='Design System'
                                    title={
                                        project.designSystemTitle ??
                                        'Visual language & token system'
                                    }
                                    description={project.visualDirection}
                                >
                                    <div className='flex flex-col gap-8'>
                                        {/* 4a. Moodboard [276:142] */}
                                        {moodboardAssets.length > 0 && (
                                            <div className='flex flex-col gap-6'>
                                                <SectionLabel>
                                                    Moodboard
                                                </SectionLabel>
                                                <MoodboardGrid
                                                    assets={moodboardAssets}
                                                    presetId={
                                                        project.moodboardPresetId
                                                    }
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
                                            displayFontSpec={
                                                project.displayFontSpec
                                            }
                                            bodyFont={project.bodyFont}
                                            bodyFontSpec={project.bodyFontSpec}
                                        />
                                    </div>
                                </CaseSection>
                            )}

                            {/* Section 05 — Testing & Iteration [199:76] */}
                            {caseNumbers.testing && (
                                <CaseSection
                                    number={caseNumbers.testing}
                                    label='Testing & Iteration'
                                    title={project.testingTitle ?? 'What users taught me'}
                                    description={project.testingProcess}
                                >
                                    {/* Карусель <sm: слайд = один Before/After
                                        блок; ≥sm — вертикальный стек по спеке */}
                                    <div className='-mr-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:basis-[calc(100%-16px)] [&>*]:snap-start sm:mr-0 sm:flex-col sm:gap-8 sm:overflow-x-visible sm:pb-0 sm:pr-0 sm:snap-none sm:[&>*]:basis-auto'>
                                        {comparisons.map((comp) => (
                                            <BeforeAfterComparison
                                                key={comp.id}
                                                featureName={comp.featureName}
                                                beforeUrl={
                                                    comp.beforeFile
                                                        ? getImageUrl(
                                                              comp.beforeFile
                                                                  .r2Key,
                                                          )
                                                        : undefined
                                                }
                                                afterUrl={
                                                    comp.afterFile
                                                        ? getImageUrl(
                                                              comp.afterFile
                                                                  .r2Key,
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
                            {caseNumbers.finalDesign && (
                                <CaseSection
                                    number={caseNumbers.finalDesign}
                                    label='Final Design'
                                    title={project.finalDesignTitle ?? 'The Finished Product'}
                                    description={project.finalDescription}
                                >
                                    <div className='flex flex-col gap-8'>
                                        {/* Showcase Images — лейаут по
                                            projects.galleryLayout (решения
                                            (51)-(52)): editorial / masonry /
                                            justified, у всех общий лайтбокс */}
                                        {finalGalleryAssets.length > 0 &&
                                            (galleryLayout === 'masonry' ? (
                                                <MasonryGallery
                                                    assets={
                                                        finalGalleryAssets
                                                    }
                                                />
                                            ) : galleryLayout ===
                                              'justified' ? (
                                                <JustifiedGallery
                                                    assets={
                                                        finalGalleryAssets
                                                    }
                                                />
                                            ) : (
                                                <ShowcaseGallery
                                                    assets={
                                                        finalGalleryAssets
                                                    }
                                                />
                                            ))}

                                        {/* Prototype links — привязка строго
                                            к полям админки (фидбэк 2026-10-26:
                                            webPrototypeUrl подписывался «View
                                            Lo-Fi prototype in Figma», хотя
                                            web-прототип — не Figma и не
                                            обязательно lo-fi). Лейбл по
                                            инструменту, без утверждений о
                                            fidelity; обе ссылки в Final
                                            Design — это финальные демки */}
                                        {(project.figmaPrototypeUrl ||
                                            project.webPrototypeUrl) && (
                                            <div className='flex flex-wrap items-center gap-x-8 gap-y-2'>
                                                {project.figmaPrototypeUrl && (
                                                    <LinkButton
                                                        href={
                                                            project.figmaPrototypeUrl
                                                        }
                                                        label='View prototype in Figma'
                                                    />
                                                )}
                                                {project.webPrototypeUrl && (
                                                    <LinkButton
                                                        href={
                                                            project.webPrototypeUrl
                                                        }
                                                        label='View Web prototype'
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Results — 2-col grid, gap=24 */}
                                        {resultItems.length > 0 && (
                                            <div className='flex flex-col gap-6'>
                                                <SectionLabel>
                                                    Results
                                                </SectionLabel>
                                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                                    {resultItems.map((item) => (
                                                        <ResultsCard
                                                            key={item.id}
                                                            content={
                                                                item.content
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Textual Before/After (шаг results
                                            в админке) — текстовые карточки
                                            фич: было → стало */}
                                        {baCardsData.length > 0 && (
                                            <div className='flex flex-col gap-6'>
                                                <SectionLabel>
                                                    Before / After
                                                </SectionLabel>
                                                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                                    {baCardsData.map((c) => (
                                                        <div
                                                            key={c.id}
                                                            className='rounded-base border border-outline-faint bg-surface-container-lowest p-5'
                                                        >
                                                            <p className='text-title-sm text-on-surface'>
                                                                {c.featureName}
                                                            </p>
                                                            <div className='mt-3 flex flex-col gap-3'>
                                                                <div>
                                                                    <p className='text-label-sm font-medium uppercase tracking-[0.5px] text-on-surface-variant'>
                                                                        Before
                                                                    </p>
                                                                    <RichText
                                                                        text={
                                                                            c.beforeText
                                                                        }
                                                                        className='mt-1 text-body-sm'
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className='text-label-sm font-medium uppercase tracking-[0.5px] text-primary'>
                                                                        After
                                                                    </p>
                                                                    <RichText
                                                                        text={
                                                                            c.afterText
                                                                        }
                                                                        className='mt-1 text-body-sm'
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                        <TagBadge
                                                            key={tool.id}
                                                            variant='filled'
                                                            label={tool.content}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CaseSection>
                            )}

                            {/* Section 07 — Reflection [199:110] */}
                            {caseNumbers.reflection && (
                                <CaseSection
                                    number={caseNumbers.reflection}
                                    label='Reflection'
                                    title={project.reflectionTitle ?? 'What I learned'}
                                    description={project.keyTakeaway}
                                >
                                        {nextStepItems.length > 0 && (
                                        <div className='flex flex-col gap-6'>
                                            <SectionLabel>
                                                Next steps
                                            </SectionLabel>
                                            <NextStepsList
                                                items={nextStepItems}
                                            />
                                        </div>
                                    )}

                                    {/* Client reviews [Sec 08] — TestimonialCard,
                                        Figma 176:378 (white r=14 + shadow-card,
                                        кавычка Poppins 100/76) */}
                                    {reviews.length > 0 && (
                                        <div className='flex flex-col gap-6'>
                                            <SectionLabel>
                                                Client reviews
                                            </SectionLabel>
                                            <div className='flex flex-col gap-8'>
                                                {reviews.map((r) => (
                                                    <TestimonialCard
                                                        key={r.id}
                                                        text={r.text}
                                                        authorName={
                                                            r.authorName
                                                        }
                                                        authorRole={
                                                            r.authorRole
                                                        }
                                                        avatarUrl={
                                                            r.avatarFile
                                                                ?.r2Key
                                                                ? getImageUrl(
                                                                      r
                                                                          .avatarFile
                                                                          .r2Key,
                                                                  )
                                                                : null
                                                        }
                                                    />
                                                ))}
                                            </div>
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
    );
}
