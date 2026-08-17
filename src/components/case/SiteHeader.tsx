import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface SiteHeaderProps {
    profileSlug: string;
    className?: string;
}

// Header (ID: 268:163) — 1200×96
// Horizontal, space-between, padding 16/64/16/64
// Nav Container | Logo | Theme Toggles
export function SiteHeader({ profileSlug, className }: SiteHeaderProps) {
    return (
        <header
            className={cn(
                'flex min-h-[96px] w-full items-center justify-between bg-background px-8 py-4 lg:px-16',
                className,
            )}
        >
            {/* Nav Container */}
            <nav className='flex items-center gap-6'>
                <Link
                    href={`/u/${profileSlug}`}
                    className='inline-flex h-11 items-center rounded-base px-3 text-body-md font-medium text-on-surface-variant transition-colors hover:text-on-surface'
                >
                    Works
                </Link>
                <Link
                    href={`/u/${profileSlug}/about`}
                    className='inline-flex h-11 items-center rounded-base px-3 text-body-md font-medium text-on-surface-variant transition-colors hover:text-on-surface'
                >
                    About Me
                </Link>
            </nav>

            {/* Logo */}
            <Link
                href={`/u/${profileSlug}`}
                className='font-display text-title-lg font-medium text-primary'
            >
                UX42.studio
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
        </header>
    );
}
