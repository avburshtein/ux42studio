import { HeroSection } from '@/components/portfolio/HeroSection';
import { ApproachSection } from '@/components/portfolio/ApproachSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import AuthBar from '@/components/AuthBar';

/**
 * Главная страница студии — визуальный язык страницы дизайнера
 * (Main_page_Spec). Состав по решению 2026-09-04 (21): Header → Hero →
 * Approach (паттерн Layout2 из исходника) → CTA → Footer. Блоки Work/Studio
 * и карточки каталога сняты до отдельного решения.
 */
export default function HomePage() {
    return (
        <>
            <AuthBar />
            <SiteHeader
                wordmarkText='UX42.studio'
                wordmarkHref='/'
                navItems={[
                    { label: 'Approach', href: '#approach' },
                    { label: 'Contact', href: '#contact' },
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
                    primaryCtaLabel='Our approach'
                    primaryCtaHref='#approach'
                    secondaryCtaLabel='Get in touch'
                    secondaryCtaHref='#contact'
                />

                <ApproachSection />

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
