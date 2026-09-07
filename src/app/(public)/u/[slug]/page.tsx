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
import { normalizeMainPageContent } from '@/lib/mainPageContent';

export const revalidate = 3600;

// Navigation divider: label + green line (11px Inter Semi Bold UPPERCASE)
function NavLabel({ label }: { label: string }) {
    return (
        <div className="section-container flex w-full items-center gap-4 py-0">
            <span className="shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant">
                {label}
            </span>
            <span aria-hidden className="h-px flex-1 bg-[rgba(140,213,179,0.16)]" />
        </div>
    );
}

function getImageUrl(r2Key: string): string {
    return `/r2/${r2Key}`;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

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
            mainPageContent: true,
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

    // Контент главной страницы — из админки (/admin/profile → Main Page Content),
    // с fallback на дефолты (Main Page Admin Panel Fields.md)
    const mpc = normalizeMainPageContent(profile.mainPageContent, bioParagraphs);
    const aboutParagraphs = [
        mpc.about.paragraph1,
        mpc.about.paragraph2,
        mpc.about.paragraph3,
    ].filter((p) => p.length > 0);

    // Process image — fileId → /r2/ URL
    const processImage = mpc.about.processImageFileId
        ? await db.query.files.findFirst({
              where: { id: mpc.about.processImageFileId },
              columns: { r2Key: true },
          })
        : null;

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
        <div className='min-h-screen w-full bg-surface-container-low'>
            <SiteHeader profileSlug={slug} displayName={profile.fullName} ctaLabel="Hire me" ctaHref="#contact" />
            <HeroSection
                headlinePart1={mpc.hero.headingLine1}
                headlineAccent={mpc.hero.headingAccent}
                headlinePart2={mpc.hero.headingLine2}
                subtitle={mpc.hero.description}
                primaryCtaLabel={mpc.hero.ctaPrimaryLabel}
                primaryCtaHref={mpc.hero.ctaPrimaryUrl || '#portfolio'}
                secondaryCtaLabel={mpc.hero.ctaSecondaryLabel}
                secondaryCtaHref={mpc.hero.ctaSecondaryUrl || '#contact'}
            />
            <main>
                <div className='bg-surface-container-lowest'>
                    <div className='pt-6'>
                        <NavLabel label='Work' />
                    </div>
                    <PortfolioGallerySection
                        title={mpc.portfolio.title}
                        subtitle={mpc.portfolio.subtitle || undefined}
                        viewAllLabel={
                            mpc.portfolio.ctaUrl ? mpc.portfolio.ctaLabel : undefined
                        }
                        viewAllHref={mpc.portfolio.ctaUrl || undefined}
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
                                    overlayTags={catTags}
                                />
                            );
                        })}
                    </PortfolioGallerySection>
                    <NavLabel label='About' />
                    {aboutParagraphs.length > 0 && (
                        <AboutSection
                            title={mpc.about.heading}
                            paragraphs={aboutParagraphs}
                            imageUrl={
                                processImage ? getImageUrl(processImage.r2Key) : undefined
                            }
                        />
                    )}
                    <NavLabel label='Skills' />
                    <SkillsSection
                        skillsLabel={mpc.expertise.skillsLabel}
                        expertiseTags={mpc.expertise.skills}
                        toolsLabel={mpc.expertise.toolsLabel}
                        toolTags={mpc.expertise.tools}
                        processLabel={mpc.expertise.processLabel}
                        processSteps={mpc.expertise.processSteps.map((title, i) => ({
                            number: String(i + 1).padStart(2, '0'),
                            title,
                            description: '',
                        }))}
                    />
                    <NavLabel label='Reach' />
                </div>
                <FAB href='#contact' />
            </main>

            <CtaSection
                title={mpc.cta.heading}
                bodyLines={[mpc.cta.description1, mpc.cta.description2].filter(
                    (l) => l.length > 0,
                )}
                emailHref={`mailto:${mpc.cta.emailAddress}`}
                emailLabel={mpc.cta.emailLabel}
                whatsappHref={mpc.cta.whatsappUrl || undefined}
                whatsappLabel={mpc.cta.whatsappLabel || undefined}
            />
            <SiteFooter
                profileSlug={slug}
                profileName={profile.fullName}
                profileHeadline={profile.headline}
                socialLinks={socials}
            />
        </div>
    );
}
