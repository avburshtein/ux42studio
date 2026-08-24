import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface SiteHeaderProps {
    profileSlug?: string;
    /** CTA button label (default: "Hire me") */
    ctaLabel?: string;
    /** CTA button href (default: #contact) */
    ctaHref?: string;
    className?: string;
}

// Header (Component set ID: 245:1632)
// Width: 1200px FIXED (parent column), Height: HUG
// Layout: HORIZONTAL, justify-between, align-center, gap: 0
// Padding: 16px 64px (top/bottom 16, left/right 64)
// Three zones: left (nav), center (logo), right (theme toggle + CTA)
// Background + effects → class: header-glass
export function SiteHeader({
    profileSlug,
    ctaLabel = 'Hire me',
    ctaHref = '#contact',
    className,
}: SiteHeaderProps) {
    return (
        <header
            className={cn(
                'header-glass flex w-full items-center justify-between gap-0 lg:px-16 py-4',
                className,
            )}
        >
            {/* Left zone: Nav Links — gap 24 */}
            <nav className='flex items-center gap-6'>
                <NavLink href={`/u/${profileSlug}`}>Work</NavLink>
                <NavLink href={`/u/${profileSlug}/about`}>About</NavLink>
            </nav>

            {/* Center: Logo — 89×64 */}
            <LogoLink />

            {/* Right zone: Theme Toggle + CTA — gap 24 */}
            <div className='flex items-center justify-end gap-6'>
                <ThemeToggle />
                <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Breadcrumb variant — used on deep pages like case portfolio
// ---------------------------------------------------------------------------

interface SiteHeaderBreadcrumbProps {
    profileSlug: string;
    /** Current page title (shown as last breadcrumb item) */
    currentTitle: string;
    /** Label for the back button (default: "Back") */
    backLabel?: string;
    /** CTA button label */
    ctaLabel?: string;
    /** CTA button href */
    ctaHref?: string;
    className?: string;
}

export function SiteHeaderBreadcrumb({
    profileSlug,
    currentTitle,
    backLabel = 'Back',
    ctaLabel = 'Hire me',
    ctaHref = '#contact',
    className,
}: SiteHeaderBreadcrumbProps) {
    return (
        <header
            className={cn(
                'header-glass flex w-full items-center justify-between gap-6 lg:px-16 py-4',
                className,
            )}
        >
            {/* Left zone: Back + Breadcrumb — gap 24 */}
            <div className='flex min-w-0 items-center gap-6'>
                {/* Back — Ghost Large Arrow=Left: pad 12×16, gap 8, radius 8 */}
                <Link
                    href={`/u/${profileSlug}`}
                    className='inline-flex h-12 shrink-0 items-center gap-2 rounded-sm px-4 py-3 text-button font-medium text-on-surface-variant transition-colors hover:bg-surface-variant'
                >
                    <ArrowLeft size={24} aria-hidden='true' />
                    {backLabel}
                </Link>

                {/* Breadcrumb Navigation — gap 8 */}
                <nav
                    className='flex min-w-0 items-center gap-2 shrink'
                    aria-label='Breadcrumb'
                >
                    <BreadcrumbLink href={`/u/${profileSlug}`}>
                        Portfolio
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                    <BreadcrumbCurrent>{currentTitle}</BreadcrumbCurrent>
                </nav>
            </div>

            {/* Center: Logo — 89×64 */}
            <LogoLink />

            {/* Right zone: Theme Toggle + CTA — gap 24 */}
            <div className='flex shrink-0 items-center justify-end gap-6'>
                <ThemeToggle />
                <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function LogoLink({ href = '/' }: { href?: string }) {
    return (
        <Link
            href={href}
            className='inline-flex h-16 shrink-0 items-center justify-center p-2.5 font-display text-title-lg font-medium text-primary'
            aria-label='UX42.studio'
        >
            UX42.studio
        </Link>
    );
}

function CtaButton({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    // Button / Ghost Large: 123×48, pad 12×16, radius 8, Surface Tint
    return (
        <Link
            href={href}
            className='inline-flex h-12  items-center justify-center rounded-sm px-4 py-3 text-button font-medium text-[var(--md-sys-color-surface-tint)] transition-colors hover:bg-surface-variant'
        >
            {children}
        </Link>
    );
}

function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    // Nav Link: pad 10×0, Inter Regular 16/24, On Surface Variant
    return (
        <Link
            href={href}
            className='inline-flex items-center px-0 py-2.5 text-body-md font-normal text-on-surface-variant transition-colors hover:text-on-surface'
        >
            {children}
        </Link>
    );
}

function BreadcrumbLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className='shrink-0 text-body-md font-normal text-primary transition-colors hover:underline'
        >
            {children}
        </Link>
    );
}

function BreadcrumbSeparator() {
    return (
        <span
            className='shrink-0 select-none text-body-md font-normal text-outline'
            aria-hidden='true'
        >
            /
        </span>
    );
}

function BreadcrumbCurrent({ children }: { children: React.ReactNode }) {
    return (
        <span className='min-w-0 truncate text-body-md font-normal text-on-surface'>
            {children}
        </span>
    );
}
