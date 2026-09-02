'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface SiteHeaderProps {
    profileSlug: string;
    /** Имя (логин) дизайнера — отображается в центре шапки вместо логотипа UX42 */
    displayName?: string;
    /** CTA button label (default: "Hire me") */
    ctaLabel?: string;
    /** CTA button href (default: #contact) */
    ctaHref?: string;
    className?: string;
}

// Header (Component set ID: 245:1632) × паттерн Navbar из Figma Make
// Sticky top-0 z-40: шапка заморожена, контент скроллится под ней.
// Стекло: фон/тень → class header-glass (#f7faf5 70%, спека (8));
// БЛЮР → utility-классы backdrop-blur-md + backdrop-saturate-[1.8]
// (12px/180%), а НЕ в .header-glass: LightningCSS в пайплайне Tailwind v4
// вырезает стандартный backdrop-filter из literal-правил, оставляя только
// -webkit- (молча не работает в Firefox). Утилиты генерируют ОБЕ формы —
// см. Main_page_Spec 2026-08-27 (7).
// Высота: 72px desktop (py-2*2 + контент h-14=56, стандарт индустрии 56–72px,
// решение 2026-09-02 (18) в Main_page_Spec.md) / 64px mobile (<768: py-2 + h-12).
// Контент — внутри .section-container (max-w 1200, pads 16/32/64).
// Mobile (<768): nav скрыт, имя слева, справа ThemeToggle + бургер; бургер
// открывает панель Work/About/Hire me (backdrop + absolute top-full под шапкой).
// Зоны: nav | имя дизайнера | theme toggle + CTA (+ burger на мобильных)
export function SiteHeader({
    profileSlug,
    displayName,
    ctaLabel = 'Hire me',
    ctaHref = '#contact',
    className,
}: SiteHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header
            className={cn('header-glass sticky top-0 z-40 w-full py-2 backdrop-blur-md backdrop-saturate-[1.8] md:py-2', className)}
        >
            {/* Mobile menu (<768): backdrop + панель под шапкой.
                ВАЖНО: backdrop-filter на <header> создаёт containing block для
                fixed-потомков (filter-effects-2), поэтому размеры заданы явно:
                top-16 (64px = высота мобильной шапки) + h-[calc(100dvh-64px)] —
                результат одинаков и при CB=header, и при CB=viewport,
                т.к. sticky-шапка всегда прижата к top:0.
                Решение 2026-08-29 (13) в Main_page_Spec.md. */}
            {menuOpen && (
                <>
                    <button
                        type='button'
                        aria-label='Close menu'
                        onClick={closeMenu}
                        className='fixed inset-x-0 top-16 z-0 h-[calc(100dvh-64px)] cursor-default md:hidden'
                    />
                    <div className='fixed inset-x-0 top-16 z-10 border-b border-outline/30 bg-surface-container-lowest shadow-[0_16px_32px_0_rgba(0,0,0,0.12)] md:hidden'>
                        <nav className='section-container flex flex-col items-stretch gap-1 py-6'>
                            <MobileNavLink href={`/u/${profileSlug}`} onClick={closeMenu}>
                                Work
                            </MobileNavLink>
                            <MobileNavLink href={`/u/${profileSlug}#about`} onClick={closeMenu}>
                                About
                            </MobileNavLink>
                            <div className='my-3 h-px bg-outline/30' aria-hidden='true' />
                            <Link
                                href={ctaHref}
                                onClick={closeMenu}
                                className='inline-flex h-14 self-center items-center justify-center rounded-full bg-primary px-8 text-button font-medium text-on-primary transition-opacity duration-150 ease-out hover:opacity-90'
                            >
                                {ctaLabel}
                            </Link>
                        </nav>
                    </div>
                </>
            )}

            {/* Контент шапки — в общем контейнере секций (max-w 1200 + pads 16/32/64) */}
            <div className='section-container relative flex w-full items-center justify-between'>
                {/* Left zone: Nav Links — только ≥768 */}
                <nav className='hidden items-center gap-6 md:flex'>
                    <NavLink href={`/u/${profileSlug}`}>Work</NavLink>
                    <NavLink href={`/u/${profileSlug}#about`}>About</NavLink>
                </nav>

                {/* Center (desktop) / Left (mobile): имя дизайнера — вместо логотипа UX42 */}
                <WordmarkLink href={`/u/${profileSlug}`} label={displayName} />

                {/* Right zone: Theme Toggle + CTA (≥768) + burger (<768) */}
                <div className='flex items-center justify-end gap-3 md:gap-6'>
                    <ThemeToggle />
                    <div className='hidden md:inline-flex'>
                        <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
                    </div>
                    <button
                        type='button'
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className='inline-flex h-12 w-12 items-center justify-center rounded-full text-on-surface-variant transition-colors duration-150 ease-out hover:text-primary md:hidden'
                    >
                        {menuOpen ? <X size={24} aria-hidden='true' /> : <Menu size={24} aria-hidden='true' />}
                    </button>
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Breadcrumb variant — used on deep pages like case portfolio
// ---------------------------------------------------------------------------

interface SiteHeaderBreadcrumbProps {
    profileSlug: string;
    /** Имя (логин) дизайнера — в центре шапки вместо логотипа UX42 */
    displayName?: string;
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
    displayName,
    currentTitle,
    backLabel = 'Back',
    ctaLabel = 'Hire me',
    ctaHref = '#contact',
    className,
}: SiteHeaderBreadcrumbProps) {
    return (
        <header
            className={cn('header-glass sticky top-0 z-40 w-full py-2 backdrop-blur-md backdrop-saturate-[1.8] md:py-2', className)}
        >
            {/* Контент шапки — в общем контейнере секций (max-w 1200 + pads 16/32/64) */}
            <div className='section-container flex w-full items-center justify-between gap-0'>
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
                        className='hidden min-w-0 items-center gap-2 md:flex'
                        aria-label='Breadcrumb'
                    >
                        <BreadcrumbLink href={`/u/${profileSlug}`}>
                            Portfolio
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                        <BreadcrumbLink href={`/u/${profileSlug}`}>
                            Cases
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                        <BreadcrumbCurrent>{currentTitle}</BreadcrumbCurrent>
                    </nav>
                </div>

                {/* Center: имя дизайнера — только ≥768 (на мобильных место отдано бэк-навигации) */}
                <WordmarkLink href={`/u/${profileSlug}`} label={displayName} className='hidden md:inline-flex' />

                {/* Right zone: Theme Toggle + CTA (CTA — только ≥768) */}
                <div className='flex shrink-0 items-center justify-end gap-3 md:gap-6'>
                    <ThemeToggle />
                    <div className='hidden md:inline-flex'>
                        <CtaButton href={ctaHref}>{ctaLabel}</CtaButton>
                    </div>
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

/**
 * Центр шапки: имя (логин) дизайнера вместо логотипа.
 * Логотип UX42.studio перенесён в футер (SiteFooter).
 * Без label (legacy) показываем старый логотип.
 */
function WordmarkLink({
    href,
    label,
    className,
}: {
    href: string;
    label?: string;
    className?: string;
}) {
    if (!label) return <LogoLink href={href} className={className} />;
    return (
        <Link
            href={href}
            className={cn(
                'inline-flex h-12 shrink-0 items-center justify-center px-2.5 font-display text-title-lg font-medium text-primary md:h-14',
                className,
            )}
            aria-label={label}
        >
            {label}
        </Link>
    );
}

function LogoLink({ href, className }: { href: string; className?: string }) {
    return (
        <Link
            href={href}
            className={cn(
                'inline-flex h-12 shrink-0 items-center justify-center p-2.5 font-display text-title-lg font-medium text-primary md:h-14',
                className,
            )}
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
    // Nav CTA "Hire me" — пилюля семейства secondary (решение 2026-08-27 (10)
    // в Main_page_Spec.md, фидбэк: был серый прямоугольный hover-фон):
    // дефолт — только текст (прозрачный фон и бордер); в hover/focus
    // появляется тонкий бордер primary-container — как у secondary,
    // + его ховер-фидбек opacity-90. border-transparent держит место —
    // layout не сдвигается при появлении рамки. Размер как у secondary:
    // h-14 px-8 (в Make: px-[32px] py-[16px] rounded-[48px]).
    return (
        <Link
            href={href}
            className='inline-flex h-14 items-center justify-center rounded-full border border-transparent px-8 text-button font-medium text-primary transition-[border-color,opacity] duration-150 ease-out hover:border-primary-container hover:opacity-90'
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

function MobileNavLink({
    href,
    onClick,
    children,
}: {
    href: string;
    onClick: () => void;
    children: React.ReactNode;
}) {
    // Мобильное меню: крупные тач-цели (py-3 → строка 48px)
    return (
        <Link
            href={href}
            onClick={onClick}
            className='inline-flex w-full items-center px-2 py-3 text-body-lg font-normal text-on-surface-variant transition-colors hover:text-on-surface'
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
