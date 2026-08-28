import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SocialLink {
    platform: string;
    title: string;
    url: string;
}

interface SiteFooterProps {
    profileSlug: string;
    profileName: string;
    profileHeadline?: string | null;
    socialLinks: SocialLink[];
    className?: string;
}

// Footer Portfolio (ID: 280:2174) — 1200×263
// Padding: 64 all sides
// Brand info | Social icons | Footer links | Back to Gallery
// Copyright bar at bottom
export function SiteFooter({
    profileSlug,
    profileName,
    profileHeadline,
    socialLinks,
    className,
}: SiteFooterProps) {
    return (
        <footer
            className={cn(
                'flex w-full flex-col gap-8 bg-background py-12 lg:py-16',
                className,
            )}
        >
            {/* Контейнер контента: max-w 1200 + px 16/32/64 (mobile/tablet/desktop) */}
            <div className='section-container flex flex-col gap-8'>
            {/* Main row */}
            <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between'>
                {/* Brand: логотип основного сайта + имя дизайнера */}
                <div className='flex flex-col gap-2'>
                    <Link
                        href='/'
                        className='inline-flex items-center self-start font-display text-title-lg font-medium text-primary'
                        aria-label='UX42.studio'
                    >
                        UX42.studio
                    </Link>
                    <span className='font-display text-title-lg font-medium text-on-surface'>
                        {profileName}
                    </span>
                    {profileHeadline && (
                        <span className='text-label-md text-on-surface-variant'>
                            {profileHeadline}
                        </span>
                    )}
                </div>

                {/* Social icons */}
                {socialLinks.length > 0 && (
                    <div className='flex items-center gap-5'>
                        {socialLinks.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-opacity hover:opacity-70'
                                title={link.title}
                            >
                                <span className='text-label-md font-medium'>
                                    {link.platform.charAt(0).toUpperCase()}
                                </span>
                            </a>
                        ))}
                    </div>
                )}

                {/* Footer links */}
                <div className='flex items-center gap-4'>
                    <Link
                        href='/privacy'
                        className='inline-flex h-11 items-center text-body-md text-on-surface-variant transition-opacity hover:opacity-70'
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href='/terms'
                        className='inline-flex h-11 items-center text-body-md text-on-surface-variant transition-opacity hover:opacity-70'
                    >
                        Terms
                    </Link>
                    <Link
                        href='/cookies'
                        className='inline-flex h-11 items-center text-body-md text-on-surface-variant transition-opacity hover:opacity-70'
                    >
                        Cookies
                    </Link>
                </div>

                {/* Back to Gallery — outline-семейство: hover как у secondary */}
                <Link
                    href={`/u/${profileSlug}`}
                    className='inline-flex h-12 items-center gap-2 rounded-full border border-outline-variant px-6 text-label-lg font-medium text-primary transition-[background-color,opacity] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] hover:opacity-90'
                >
                    Back to Gallery
                </Link>
            </div>

            {/* Copyright bar */}
            <div className='flex items-center justify-between border-t border-outline-variant pt-6'>
                <span className='text-label-md text-on-surface-variant'>
                    © {new Date().getFullYear()} UX42.studio. All rights
                    reserved.
                </span>
            </div>
            </div>
        </footer>
    );
}
