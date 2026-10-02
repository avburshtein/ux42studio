import type { Metadata } from 'next';
import Link from 'next/link';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { ArrowRight, Check } from 'lucide-react';
import { getDb } from '@/db';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { PlatformBenefitsSection } from '@/components/portfolio/PlatformBenefitsSection';
import { SectionLabel } from '@/components/portfolio/SectionLabel';
import {
    resolveStudioProfile,
} from '@/lib/studioProfile';
import AuthBar from '@/components/AuthBar';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Portfolio platform for designers — UX42 Studio',
    description:
        'Build a portfolio page of your own at ux42.studio: a code-free case editor, your own URL, SEO included. No feeds, no noise — your work, curated.',
    alternates: { canonical: '/platform' },
};

/**
 * /platform — промо платформы для дизайнеров (решение (69), 2026-09-26).
 *
 * Зачем страница: главная `/` одновременно пыталась быть лендингом студии,
 * витриной работ дизайнеров и промо SaaS. Три аудитории плохо уживались на
 * одной странице. Разделение:
 *   /         → студия + кейсы основателя (заказы)
 *   /platform → платформа (дизайнеры)
 *   /u/[slug] → личная страница дизайнера
 *
 * Порядок секций повторяет язык главной (Hero → SectionLabel-блоки → CTA),
 * чтобы переход не выглядел как другой сайт. Ссылка на живой пример
 * (/u/aleksandra-burshtein) — сильнейший аргумент: «смотри, это уже работает».
 */

const STEPS = [
    {
        title: 'Write the case',
        body: 'Sections, metrics, before/after, reviews. Fill in what you actually did — the structure is there, the words are yours.',
    },
    {
        title: 'Make it yours',
        body: 'Theme colour, cover, typography, floating accents. Match the page to how you want to be remembered.',
    },
    {
        title: 'Publish',
        body: 'Draft, preview, go live. Your own URL, sitemap entry and social preview are handled.',
    },
];

export default async function PlatformPage() {
    // Живой пример платформы в действии — профиль студии. Резолвер учитывает
    // видимость: если профиль скрыт, пример не показывается вовсе — иначе
    // промо обещало бы страницу, которая отдаёт 404.
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env.DB);

    const exampleProfile = await resolveStudioProfile(db, env);

    return (
        <>
            <AuthBar />
            <SiteHeader
                wordmarkText='UX42.studio'
                wordmarkHref='/'
                navItems={[
                    { label: 'Back to studio', href: '/' },
                    // Пример в меню — только если есть публичный профиль:
                    // якорь на несуществующий раздел сбивает с толку.
                    ...(exampleProfile
                        ? [{ label: 'Example', href: '#example' }]
                        : []),
                ]}
                menuMode
                ctaHref='#contact'
            />
            <main>
                <HeroSection
                    headlinePart1='Your work deserves'
                    headlineAccent='its own page'
                    headlinePart2='on the web'
                    subtitle='UX42 is a portfolio platform for designers. Write the case in a code-free editor, publish it to your own URL — and keep it yours. No feeds, no noise, no template that flattens your thinking.'
                    primaryCtaLabel='Create your page'
                    primaryCtaHref='#start'
                    secondaryCtaLabel='See a live example'
                    secondaryCtaHref={
                        exampleProfile ? `/u/${exampleProfile.slug}` : '#start'
                    }
                />

                <PlatformBenefitsSection
                    id='benefits'
                    label='What you get'
                    heading={
                        'Everything a portfolio needs.\nNothing it doesn\u2019t.'
                    }
                    description='The same platform UX42.studio itself runs on — case editor, theming, publishing and SEO, already built and maintained.'
                />

                {/* Как это работает — три шага. Отвечает на главный вопрос
                    «а что мне придётся делать самому», который останавливает
                    переход с бесплатных конструкторов. */}
                <section
                    id='start'
                    className='scroll-mt-20 bg-surface-container-lowest py-12 md:py-24'
                >
                    <div className='section-container flex flex-col gap-16'>
                        <SectionLabel label='How it works' />

                        <div className='flex flex-col items-start gap-8'>
                            <h2 className='max-w-[720px] bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
                                Three steps to published
                            </h2>
                            <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
                                No code, no design system to learn, no monthly
                                bill to start.
                            </p>
                        </div>

                        <ol className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                            {STEPS.map((step, i) => (
                                <li
                                    key={step.title}
                                    className='portfolio-card platform-benefit-card flex flex-col gap-4 rounded-[24px] p-8'
                                >
                                    <span className='flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-title-md font-medium text-on-primary'>
                                        {i + 1}
                                    </span>
                                    <h3 className='font-display text-title-lg font-medium text-primary'>
                                        {step.title}
                                    </h3>
                                    <p className='text-body-md text-on-surface-variant'>
                                        {step.body}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Живой пример — самая убедительная часть страницы:
                    обещание «сделаем страницу» закрывается конкретной
                    страницей, которую можно открыть прямо сейчас. */}
                {exampleProfile && (
                    <section
                        id='example'
                        className='scroll-mt-20 bg-surface-container-lowest py-12 md:py-24'
                    >
                        <div className='section-container flex flex-col gap-16'>
                            <SectionLabel label='Example' />

                            <div className='flex flex-col items-start gap-8'>
                                <h2 className='max-w-[720px] bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
                                    This is what it looks like
                                </h2>
                                <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
                                    {exampleProfile.fullName}&apos;s page runs
                                    on this platform — hero, case studies and
                                    all. Judge the platform by it.
                                </p>
                            </div>

                            <div className='flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between'>
                                <ul className='flex flex-col gap-3'>
                                    {[
                                        'A page you can show a recruiter',
                                        'Full case studies, not thumbnails',
                                        'Yours to keep and update',
                                    ].map((line) => (
                                        <li
                                            key={line}
                                            className='flex items-start gap-3 text-body-md text-on-surface-variant'
                                        >
                                            <Check
                                                size={20}
                                                aria-hidden='true'
                                                className='mt-1 shrink-0 text-primary'
                                            />
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/u/${exampleProfile.slug}`}
                                    className='inline-flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-8 text-button font-medium text-on-primary shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[0_8px_16px_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                                >
                                    Open the live page
                                    <ArrowRight size={18} aria-hidden='true' />
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                <CtaSection
                    title='Want a page like this?'
                    bodyLines={[
                        'Tell us a little about your work and we will set you up.',
                        'We usually reply within 48 hours.',
                    ]}
                    emailHref='mailto:hello@ux42.studio'
                    emailLabel='Say hi'
                />
            </main>
            <SiteFooter
                profileHeadline='Product design studio'
                socialLinks={[]}
                showPlatformLink
            />
        </>
    );
}
