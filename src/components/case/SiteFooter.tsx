import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface SocialLink {
    platform: string;
    title: string;
    url: string;
}

// Брендовые иконки удалены из lucide-react — инлайн SVG (Simple Icons, 24×24,
// fill: currentColor). Неизвестные платформы — Globe (раньше рендерилась
// первая буква платформы, из-за чего для 'custom' показывалась «C»).
const brand = (path: string) =>
    function BrandIcon({ size = 20 }: { size?: number }) {
        return (
            <svg
                width={size}
                height={size}
                viewBox='0 0 24 24'
                fill='currentColor'
                aria-hidden='true'
            >
                <path d={path} />
            </svg>
        );
    };

const GithubIcon = brand(
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
);
const LinkedinIcon = brand(
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
);
const InstagramIcon = brand(
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
);
const XIcon = brand(
    'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
);
const YoutubeIcon = brand(
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
);
const TelegramIcon = brand(
    'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
);
const DribbbleIcon = brand(
    'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z',
);
const BehanceIcon = brand(
    'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z',
);
const MediumIcon = brand(
    'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75S24 8.83 24 12z',
);

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
    github: GithubIcon,
    behance: BehanceIcon,
    dribbble: DribbbleIcon,
    telegram: TelegramIcon,
    linkedin: LinkedinIcon,
    twitter: XIcon,
    instagram: InstagramIcon,
    youtube: YoutubeIcon,
    medium: MediumIcon,
    custom: Globe,
};

function SocialIcon({ platform }: { platform: string }) {
    const Icon = SOCIAL_ICONS[platform] ?? Globe;
    return <Icon size={20} />;
}

interface SiteFooterProps {
    /** Slug дизайнера — включает кнопку Back to Gallery (на главной не передаётся) */
    profileSlug?: string;
    /** Имя дизайнера под брендом (на главной не передаётся) */
    profileName?: string;
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
                    {profileName && (
                        <span className='font-display text-title-lg font-medium text-on-surface'>
                            {profileName}
                        </span>
                    )}
                    {profileHeadline && (
                        <span className='text-label-md text-on-surface-variant'>
                            {profileHeadline}
                        </span>
                    )}
                </div>

                {/* Social icons */}
                {socialLinks.length > 0 && (
                    <div className='flex items-center gap-5'>
                        {socialLinks.map((link, i) => (
                            <a
                                key={`${link.platform}-${link.title}-${i}`}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-opacity hover:opacity-70'
                                title={link.title}
                            >
                                <SocialIcon platform={link.platform} />
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
                {/* Back to Gallery — outline-семейство: hover как у secondary.
                    Только на страницах дизайнера (profileSlug передан). */}
                {profileSlug && (
                    <Link
                        href={`/u/${profileSlug}`}
                        className='inline-flex h-12 self-start items-center gap-2 whitespace-nowrap rounded-full border border-outline-variant px-6 text-label-lg font-medium text-primary transition-[background-color,opacity] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] hover:opacity-90'
                    >
                        Back to Gallery
                    </Link>
                )}
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
