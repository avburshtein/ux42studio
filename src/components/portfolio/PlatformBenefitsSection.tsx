import {
    PenLine,
    Globe,
    Palette,
    Sparkles,
    TrendingUp,
    Rocket,
} from 'lucide-react';
import { SectionLabel } from './SectionLabel';

/**
 * Platform Benefits Section — промо-блок преимуществ платформы для
 * дизайнеров. Живёт на /platform (решение (69), 2026-09-26): раньше блок
 * стоял на главной студии и смешивал две аудитории — клиентов студии и
 * других дизайнеров.
 *
 * Bento-грид 3×2: иконка + заголовок + описание.
 * Стили — токены проекта (Main_page_Spec): SectionLabel-разделитель,
 * градиентный заголовок (как ApproachSection), карточки как у карточек
 * портфолио (case/PortfolioCard): тень через класс .portfolio-card, фон
 * темнее канваса через .platform-benefit-card (globals.css). Иконки —
 * зелёные, без фона-кружка. Копирайт намеренно без упоминания
 * Material Design / Google.
 *
 * Компонент параметризован текстами, чтобы /platform могла переиспользовать
 * его со своим заголовком, не дублируя вёрстку.
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
        title: 'Proven structure, your story',
        description:
            'A case study template built to industry standards. Publish the full case — or just the sections you need.',
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

interface PlatformBenefitsSectionProps {
    /** Подпись разделителя секции */
    label?: string;
    /** Заголовок. \n — принудительный перенос (рендерится <br aria-hidden>) */
    heading?: string;
    /** Подзаголовок под заголовком */
    description?: string;
    /** id секции (для якорей) */
    id?: string;
}

export function PlatformBenefitsSection({
    label = 'Platform',
    heading = 'Not just a portfolio\n— a platform.',
    description = 'UX42 runs on the same platform we offer to designers. No feeds, no noise — your work, curated.',
    id = 'platform',
}: PlatformBenefitsSectionProps = {}) {
    return (
        <section
            id={id}
            className='bg-surface-container-lowest py-12 md:py-24'
        >
            <div className='section-container flex flex-col gap-16'>
                <SectionLabel label={label} />

                <div className='flex flex-col items-start gap-8'>
                    <h2 className='max-w-[720px] whitespace-pre-line bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
                        {heading}
                    </h2>
                    <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
                        {description}
                    </p>
                </div>

                {/* Bento-грид: 1 → 2 → 3 колонки */}
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {BENEFITS.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className='portfolio-card platform-benefit-card flex flex-col gap-4 rounded-[24px] p-8'
                        >
                            <span className='shrink-0 text-primary'>
                                <Icon size={28} aria-hidden='true' />
                            </span>
                            <h3 className='font-display text-title-lg font-medium text-primary'>
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
