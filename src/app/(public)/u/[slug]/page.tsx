import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { PortfolioGallerySection } from '@/components/portfolio/PortfolioGallerySection';
import { PortfolioCard } from '@/components/PortfolioCard';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { FAB } from '@/components/FAB';
import AuthBar from '@/components/AuthBar';

export const revalidate = 3600;

// Navigation divider: label + green line (11px Inter Semi Bold UPPERCASE)
function NavLabel({ label }: { label: string }) {
    return (
        <div className='flex w-full items-center gap-4 px-8 py-0 lg:px-16'>
            <span className='shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant'>
                {label}
            </span>
            <span
                aria-hidden
                className='h-px flex-1 bg-[rgba(140,213,179,0.16)]'
            />
        </div>
    );
}

function getImageUrl(r2Key: string): string {
    return `/r2/${r2Key}`;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ---- Hardcoded Skills (from Main_page_Spec §8) ----
const EXPERTISE_TAGS = [
    'UX Research',
    'Wireframing',
    'Prototyping',
    'Figma Handoff',
    'Web Design',
    'Mobile Apps',
    'Landing Pages',
    'Psychology-led UX',
    'Design Engineering',
    'Design-to-code workflow',
];
const TOOL_TAGS = [
    'Figma',
    'FigJam',
    'Maze',
    'Protopie',
    'Webflow',
    'Adobe Firefly',
    'Cursor',
    'VS Code',
    'Github',
];
const PROCESS_STEPS = [
    {
        number: '01',
        title: 'Research & Insight',
        description:
            'I start by understanding the problem, users, and business context through interviews and competitive analysis.',
    },
    {
        number: '02',
        title: 'Wireframe & Structure',
        description:
            'I create low-fidelity wireframes and information architecture to map the user journey.',
    },
    {
        number: '03',
        title: 'Prototype & Test',
        description:
            'I build interactive prototypes and test with real users to validate assumptions and refine the experience.',
    },
    {
        number: '04',
        title: 'Handoff & Support',
        description:
            'I deliver production-ready designs with detailed specs and support developers through implementation.',
    },
];

// ---- SEO ----
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);
    const p = await db.query.profiles.findFirst({
        where: { slug },
        columns: { fullName: true, headline: true },
    });
    if (!p) return { title: 'UX42 Studio' };
    return {
        title: `${p.fullName} — UX42 Studio`,
        description: p.headline ?? `Портфолио дизайнера ${p.fullName}`,
        openGraph: {
            title: `${p.fullName} — UX42 Studio`,
            description: p.headline ?? `Портфолио дизайнера ${p.fullName}`,
            type: 'profile',
        },
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { slug },
        columns: {
            id: true,
            userId: true,
            slug: true,
            fullName: true,
            headline: true,
            bio: true,
            isPublic: true,
        },
        with: {
            socialLinks: { orderBy: { order: 'asc' } },
            avatarFile: true,
            coverFile: true,
        },
    });
    if (!profile) notFound();
    if (!profile.isPublic) notFound();

    const projects = await db.query.projects.findMany({
        where: { profileId: profile.id, status: 'published' },
        with: {
            profile: { columns: { slug: true, fullName: true } },
            projectCategories: { with: { category: true } },
            coverFile: true,
        },
        orderBy: { publishedAt: 'desc' },
    });

    const bioParagraphs = profile.bio
        ? profile.bio.split(/\n\n/).filter(Boolean)
        : [];
    const categoryFilters = Array.from(
        new Map(
            projects
                .flatMap((p) =>
                    p.projectCategories
                        .map((pc) => pc.category?.name)
                        .filter(Boolean),
                )
                .map((n) => [n, n as string]),
        ).values(),
    );
    const socials = profile.socialLinks
        .slice(0, 3)
        .map((l) => ({ platform: l.platform, title: l.title, url: l.url }));

    return (
        <>
            <AuthBar profileUserId={profile.userId} />
            <div className='min-h-screen w-full bg-surface-container-low'>
                <div className='mx-auto w-full max-w-container-content shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)]'>
                    <SiteHeader ctaLabel='Hire me' ctaHref='#contact' />
                    <HeroSection
                        headlinePart1='I design for the moment '
                        headlineAccent='when everything'
                        headlinePart2=' just clicks'
                        subtitle='A psychology degree and 10 years learning how great environments shape human decisions.'
                        primaryCtaLabel='View case studies'
                        primaryCtaHref='#portfolio'
                        secondaryCtaLabel='Get in touch'
                        secondaryCtaHref='#contact'
                    />
                    <main>
                        <div className='bg-surface-container-lowest'>
                            <div className='pt-6'>
                                <NavLabel label='Work' />
                            </div>
                            <PortfolioGallerySection
                                title='Portfolio'
                                subtitle='Explore my work in web design, UX Research and digital products'
                                filters={
                                    categoryFilters.length > 0
                                        ? [
                                              'All',
                                              ...categoryFilters.slice(0, 3),
                                          ]
                                        : undefined
                                }
                            >
                                {projects.slice(0, 6).map((project) => {
                                    const catName =
                                        project.projectCategories
                                            .map((pc) => pc.category?.name)
                                            .filter(Boolean)[0] ?? '';
                                    const catTags = project.projectCategories
                                        .map((pc) => pc.category?.name)
                                        .filter(Boolean)
                                        .slice(0, 3) as string[];
                                    return (
                                        <PortfolioCard
                                            key={project.id}
                                            title={project.title}
                                            tag={catName}
                                            imageUrl={
                                                project.coverFile
                                                    ? getImageUrl(
                                                          project.coverFile
                                                              .r2Key,
                                                      )
                                                    : '/placeholder-project.svg'
                                            }
                                            href={`/u/${slug}/${project.slug}`}
                                            overlayTitle={project.title}
                                            overlayTags={catTags}
                                        />
                                    );
                                })}
                            </PortfolioGallerySection>
                            <NavLabel label='About' />
                            {bioParagraphs.length > 0 && (
                                <AboutSection
                                    title='People-centered design begins with real curiosity'
                                    paragraphs={bioParagraphs}
                                />
                            )}
                            <NavLabel label='Skills' />
                            <SkillsSection
                                expertiseTags={EXPERTISE_TAGS}
                                toolTags={TOOL_TAGS}
                                processSteps={PROCESS_STEPS}
                            />
                            <NavLabel label='Reach' />
                        </div>
                        <FAB href='#contact' />
                    </main>

                    <CtaSection
                        title='Get in touch'
                        bodyLines={[
                            'We answer emails fast.',
                            'Pro bono spots available.',
                        ]}
                        emailHref='mailto:hello@ux42.studio'
                        emailLabel='Send an email'
                    />
                    <SiteFooter
                        profileSlug={slug}
                        profileName={profile.fullName}
                        profileHeadline={profile.headline}
                        socialLinks={socials}
                    />
                </div>
            </div>
        </>
    );
}
