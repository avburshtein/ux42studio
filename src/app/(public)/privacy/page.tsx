import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/case/SiteFooter';
import { ThemeToggle } from '@/components/case/ThemeToggle';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';

// Legal-страница /privacy — Privacy Policy EN+ES (решение (36),
// Docs/ui/Main_page_Spec.md); закрывает 404 по ссылке из футера (решение (29)).
// Статическая: контент из src/lib/privacyContent.ts, БД не трогается —
// prerender. Верхняя панель по макету PP: Back + breadcrumb Main /
// Privacy Policy + ThemeToggle (SiteHeader не используется — у него якорная
// навигация главной). Футер без иконок соцсетей (источник ссылок студии
// не определён — не хардкодить); Terms/Cookies скрыты через profileName —
// как на страницах дизайнера (решение (29)).
export const metadata: Metadata = {
    title: 'Privacy Policy — UX42 Studio',
    description:
        'Privacy Policy of UX42.studio: data controller, legal bases, data retention, recipients and international transfers (GDPR, LOPDGDD, LSSI-CE).',
};

export default function PrivacyPage() {
    return (
        <div className='flex min-h-screen flex-col bg-background'>
            <header className='sticky top-0 z-30 bg-background shadow-card'>
                <div className='section-container flex h-14 items-center justify-between gap-4'>
                    <div className='flex min-w-0 items-center gap-3 md:gap-6'>
                        <Link
                            href='/'
                            className='inline-flex h-10 shrink-0 items-center gap-1.5 text-body-sm text-on-surface transition-colors hover:text-primary'
                        >
                            <ArrowLeft size={18} aria-hidden='true' />
                            Back
                        </Link>
                        <nav aria-label='Breadcrumb' className='flex min-w-0 items-center gap-2'>
                            <Link
                                href='/'
                                className='shrink-0 text-body-sm text-primary transition-opacity hover:opacity-80'
                            >
                                Main
                            </Link>
                            <span
                                aria-hidden='true'
                                className='shrink-0 select-none text-body-sm text-outline'
                            >
                                /
                            </span>
                            <span className='min-w-0 truncate text-body-sm text-on-surface'>
                                Privacy Policy
                            </span>
                        </nav>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className='flex-1'>
                <PrivacyPolicy />
            </main>

            <SiteFooter
                profileName='Aleksandra Burshtein'
                profileHeadline='UX/UI Designer'
                socialLinks={[]}
            />
        </div>
    );
}
