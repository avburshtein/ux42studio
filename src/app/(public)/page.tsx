import Link from 'next/link';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { PortfolioCard } from '@/components/PortfolioCard';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import AuthBar from '@/components/AuthBar';

export const revalidate = 300;

// Navigation divider — как на странице дизайнера (Main_page_Spec §4)
function NavLabel({ label }: { label: string }) {
    return (
        <div className='flex w-full items-center gap-4'>
            <span className='shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant'>
                {label}
            </span>
            <span aria-hidden className='h-px flex-1 bg-[rgba(140,213,179,0.16)]' />
        </div>
    );
}

/**
 * Главная страница студии — визуальный язык страницы дизайнера
 * (Main_page_Spec), контент: каталог проектов (showOnHomepage) + Stats +
 * Pro Bono Banner + CTA. Решение 2026-09-02 (19).
 */
export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env.DB);

    const allCategories = await db.query.categories.findMany({
        orderBy: { order: 'asc' },
    });

    const selectedCategory = category
        ? allCategories.find((c) => c.slug === category)
        : undefined;

    let publishedProjects = await db.query.projects.findMany({
        where: {
            status: 'published',
            showOnHomepage: 1,
        },
        with: {
            profile: {
                columns: { slug: true, fullName: true, avatarFileId: true },
            },
            projectCategories: {
                with: { category: true },
            },
            coverFile: true,
        },
        orderBy: { publishedAt: 'desc' },
        limit: 100,
    });

    if (selectedCategory) {
        publishedProjects = publishedProjects.filter((p) =>
            p.projectCategories.some(
                (pc) => pc.category?.slug === selectedCategory.slug,
            ),
        );
    }

    // Карточка нового стиля требует обложку — проекты без неё не рендерим
    const cards = publishedProjects.filter((p) => p.coverFile);

    const chipClass = (selected: boolean) =>
        selected
            ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-colors duration-150 ease-out hover:bg-[rgba(11,110,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

    return (
        <>
            <AuthBar />
            <SiteHeader
                wordmarkText='UX42.studio'
                wordmarkHref='/'
                navItems={[
                    { label: 'Work', href: '#work' },
                    { label: 'About', href: '#studio' },
                ]}
                menuMode
                ctaHref='#contact'
            />
            <main>
                <HeroSection
                    headlinePart1='We design for the moment'
                    headlineAccent='when everything'
                    headlinePart2='just clicks'
                    subtitle='UX42.studio is a product design studio. We help teams ship clear, human interfaces — from first sketch to final pixel.'
                    primaryCtaLabel='View our work'
                    primaryCtaHref='#work'
                    secondaryCtaLabel='Get in touch'
                    secondaryCtaHref='#contact'
                />

                {/* Work — каталог проектов (Main_page_Spec §6 паттерн) */}
                <section id='work' className='bg-surface-container-lowest py-12 md:py-24'>
                    <div className='section-container flex flex-col items-center gap-16'>
                        <NavLabel label='Work' />
                        <div className='flex flex-col items-center gap-8 text-center'>
                            <h2 className='font-display text-[32px] font-medium leading-[40px] text-on-surface lg:text-display-sm lg:leading-tight'>
                                Selected work
                            </h2>
                            <p className='max-w-[734px] text-body-lg text-on-surface-variant'>
                                Projects we are proud of — each one a full case
                                study with process, results and lessons.
                            </p>
                        </div>

                        {allCategories.length > 0 && (
                            <div className='hidden flex-wrap justify-center gap-3 md:flex'>
                                <Link
                                    href='/'
                                    scroll={false}
                                    className={chipClass(!selectedCategory)}
                                    aria-current={!selectedCategory || undefined}
                                >
                                    All
                                </Link>
                                {allCategories.map((cat) => {
                                    const active =
                                        selectedCategory?.slug === cat.slug;
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/?category=${encodeURIComponent(cat.slug)}#portfolio`}
                                            scroll={false}
                                            className={chipClass(active)}
                                            aria-current={active || undefined}
                                        >
                                            {cat.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {cards.length === 0 ? (
                            <p className='py-16 text-body-lg text-on-surface-variant'>
                                No published projects yet
                            </p>
                        ) : (
                            <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                                {cards.map((project) => (
                                    <PortfolioCard
                                        key={project.id}
                                        title={project.title}
                                        tag={
                                            project.profile?.fullName ??
                                            project.projectCategories[0]?.category?.name ??
                                            'Case study'
                                        }
                                        imageUrl={`/r2/${project.coverFile!.r2Key}`}
                                        href={`/u/${project.profile?.slug ?? 'unknown'}/${project.slug}`}
                                        overlayTags={project.projectCategories
                                            .map((pc) => pc.category?.name)
                                            .filter((n): n is string => Boolean(n))}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Studio — stats (эталон: Stats-блок) + Pro Bono Banner */}
                <section id='studio' className='bg-surface-container-lowest py-12 md:py-24'>
                    <div className='section-container flex flex-col gap-16'>
                        <NavLabel label='Studio' />
                        <div className='grid gap-10 text-center sm:grid-cols-3'>
                            {[['10+', 'Years of design experience'], ['MSc', 'Human-Centered Design'], ['NGO', 'Projects for social good']].map(
                                ([value, label]) => (
                                    <div key={label} className='flex flex-col gap-2'>
                                        <span className='font-display text-[52px] font-medium leading-[65px] text-primary'>
                                            {value}
                                        </span>
                                        <span className='text-body-md text-on-surface-variant'>
                                            {label}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className='flex flex-col items-start gap-6 rounded-[24px] bg-primary p-8 md:flex-row md:items-center md:justify-between md:p-12'>
                            <div className='flex flex-col gap-2'>
                                <h3 className='font-display text-title-lg font-medium text-on-primary'>
                                    Design for good
                                </h3>
                                <p className='max-w-[560px] text-body-md text-on-primary/90'>
                                    We reserve part of our studio time for NGOs
                                    and social initiatives. If your organization
                                    needs design help — reach out.
                                </p>
                            </div>
                            <Link
                                href='#contact'
                                className='inline-flex h-14 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-surface-container-lowest px-8 text-button font-medium text-primary transition-opacity duration-150 ease-out hover:opacity-90'
                            >
                                Start a project
                            </Link>
                        </div>
                    </div>
                </section>

                <CtaSection
                    title='Get in touch'
                    bodyLines={[
                        'Have a project in mind — or just want to say hi?',
                        'Tell us about it. We usually reply within 48 hours.',
                    ]}
                    emailHref='mailto:hello@ux42.studio'
                    emailLabel='Send an email'
                />
            </main>
            <SiteFooter profileHeadline='Product design studio' socialLinks={[]} />
        </>
    );
}
