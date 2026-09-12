import Link from 'next/link';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { PortfolioCard } from '@/components/PortfolioCard';
import { Carousel } from '@/components/portfolio/Carousel';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { ApproachSection } from '@/components/portfolio/ApproachSection';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import { PlatformBenefitsSection } from '@/components/portfolio/PlatformBenefitsSection';
import AuthBar from '@/components/AuthBar';

export const revalidate = 300;

// Navigation divider — как на странице дизайнера (Main_page_Spec §4)
function NavLabel({ label }: { label: string }) {
    return (
        <div className='flex w-full items-center gap-4'>
            <span className='shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-on-surface-variant'>
                {label}
            </span>
            <span aria-hidden className='h-px flex-1 bg-[rgba(140,213,179,0.16)]' />
        </div>
    );
}

/**
 * Главная страница студии — визуальный язык страницы дизайнера
 * (Main_page_Spec), контент: Hero + Approach (решение 2026-09-04 (21)) +
 * каталог проектов (showOnHomepage) + Studio (About-стиль: визуал + статы) +
 * Platform Benefits (промо платформы для дизайнеров) + CTA.
 * Решение 2026-09-02 (19), каталог возвращён 2026-09-04 (22).
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
                            /* <sm — карусель (решение (34): карточки главной и страницы
                                дизайнера идентичны: ширина 327 @375 = ширине сетки,
                                сосед виден до края экрана), ≥sm — сетка 2/3 */
                            <Carousel>
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
                            </Carousel>
                        )}
                    </div>
                </section>

                <ApproachSection />

                {/* Studio — по образцу About на странице дизайнера: слева
                    визуал, справа текст + статы с расшифровкой.
                    Статы — факты: Google UX Certificate, MSc Psychology,
                    NGO-проекты (Design for good баннер убран 2026-09-12). */}
                <section id='studio' className='bg-surface-container-lowest py-12 md:py-24'>
                    <div className='section-container flex flex-col gap-16'>
                        <NavLabel label='Studio' />

                        <div className='flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10'>
                            {/* Визуал — по образцу AboutSection (516×495):
                                одно фото (public/studio-2.webp, конверт из
                                PNG 2,37 МБ → 102 КБ); градиент — подложка
                                на время загрузки */}
                            <div className='relative aspect-[516/495] w-full shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[rgba(11,110,79,0.08)] to-[rgba(44,90,7,0.12)] lg:aspect-auto lg:w-[516px] lg:min-h-[495px]'>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src='/studio-2.webp'
                                    alt=''
                                    loading='lazy'
                                    decoding='async'
                                    className='absolute inset-0 h-full w-full object-cover'
                                />
                            </div>

                            <div className='flex w-full flex-col gap-8 lg:w-[516px]'>
                                <h2 className='font-display text-[32px] font-medium leading-[40px] text-on-surface lg:text-display-sm lg:leading-tight'>
                                    Simple by design
                                </h2>

                                <div className='flex flex-col gap-4'>
                                    <p className='text-body-lg font-normal text-on-surface-variant'>
                                        We come to design with a live, open
                                        mind — always learning, always curious.
                                    </p>
                                    <p className='text-body-lg font-normal text-on-surface-variant'>
                                        We pursue design that is simple and
                                        functional to the point of genius — and
                                        mathematically beautiful. Psychology
                                        helps us understand people; engineering
                                        keeps the architecture honest.
                                    </p>
                                    <p className='text-body-lg font-normal text-on-surface-variant'>
                                        Behind UX42.studio is a rare
                                        combination: a UX designer with a
                                        background in clinical psychology and
                                        human behaviour research, and a senior
                                        engineer with an MD/PhD in psychiatry
                                        and 8+ years building MedTech systems.
                                        We don&apos;t just make things look
                                        good — we make them make sense.
                                    </p>
                                </div>

                                <div className='flex flex-col gap-3'>
                                    <span className='text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant'>
                                        Our background
                                    </span>
                                    <ul className='flex flex-col gap-2'>
                                        {[
                                            'MSc in Psychology · UX Research · Google UX Design Certificate',
                                            '8+ years MedTech Engineering · Next.js · TypeScript',
                                            'NGO — Projects for social good',
                                        ].map((line) => (
                                            <li
                                                key={line}
                                                className='flex items-start gap-3 text-body-md text-on-surface-variant'
                                            >
                                                <span
                                                    aria-hidden
                                                    className='mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary'
                                                />
                                                {line}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <PlatformBenefitsSection />

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
