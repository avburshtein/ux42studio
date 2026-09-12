import {
    PenLine,
    Globe,
    Palette,
    Sparkles,
    TrendingUp,
    Rocket,
} from 'lucide-react';

/**
 * Platform Benefits Section — промо-блок преимуществ платформы для дизайнеров
 * на главной студии. Bento-грид 3×2: иконка в кружке + заголовок + описание.
 * Стили — токены проекта (Main_page_Spec): NavLabel-разделитель, градиентный
 * заголовок (как ApproachSection), карточки surface-container-low
 * rounded-[24px]. Размещение — между Studio и CTA.
 * Копирайт намеренно без упоминания Material Design / Google.
 */

const BENEFITS: Array<{
    icon: typeof PenLine;
    title: string;
    description: string;
}> = [
    {
        icon: PenLine,
        title: 'Code-free case editor',
        description:
            'Write, upload, rearrange. Case pages update straight from the admin panel — no code involved.',
    },
    {
        icon: Globe,
        title: 'Your own page',
        description:
            'A personal page at /u/your-name. Your space on the web — not another feed.',
    },
    {
        icon: Palette,
        title: 'Design-system quality',
        description:
            'Every case follows a solid typographic grid. Your work looks curated, not templated.',
    },
    {
        icon: Sparkles,
        title: 'Make it yours',
        description:
            'Pick a color theme, tune the header and background, add floating accents.',
    },
    {
        icon: TrendingUp,
        title: 'SEO out of the box',
        description:
            'Sitemap, Open Graph, metadata — handled for you automatically.',
    },
    {
        icon: Rocket,
        title: 'Publish in one click',
        description: 'Draft, preview, publish. Your case goes live in one click.',
    },
];

export function PlatformBenefitsSection() {
    return (
        <section
            id='platform'
            className='bg-surface-container-lowest py-12 md:py-24'
        >
            <div className='section-container flex flex-col gap-16'>
                {/* Разделитель — как в блоках Work/Approach */}
                <div className='flex w-full items-center gap-4'>
                    <span className='shrink-0 text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-on-surface-variant'>
                        Platform
                    </span>
                    <span
                        aria-hidden
                        className='h-px flex-1 bg-[rgba(140,213,179,0.16)]'
                    />
                </div>

                <div className='flex flex-col items-start gap-8'>
                    <h2 className='max-w-[720px] bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
                        Not just a portfolio
                        <br aria-hidden='true' />— a platform.
                    </h2>
                    <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
                        UX42 runs on the same platform we offer to designers.
                        No feeds, no noise — your work, curated.
                    </p>
                </div>

                {/* Bento-грид: 1 → 2 → 3 колонки */}
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {BENEFITS.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className='flex flex-col gap-4 rounded-[24px] bg-surface-container-low p-8 shadow-card transition-shadow duration-200 ease-out hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]'
                        >
                            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(11,110,79,0.1)] text-primary'>
                                <Icon size={24} aria-hidden='true' />
                            </span>
                            <h3 className='font-display text-title-lg font-medium text-on-surface'>
                                {title}
                            </h3>
                            <p className='text-body-md text-on-surface-variant'>
                                {description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Финал: приглашение + CTA */}
                <div className='flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between'>
                    <p className='text-body-lg text-on-surface-variant'>
                        Want a page like this?{' '}
                        <span className='font-medium text-on-surface'>
                            Say hi.
                        </span>
                    </p>
                    <a
                        href='mailto:hello@ux42.studio'
                        className='inline-flex h-14 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-8 text-button font-medium text-on-primary shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[0_8px_16px_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                    >
                        Say hi
                    </a>
                </div>
            </div>
        </section>
    );
}
