'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
}

// Figma: Light/Dark toggle (48×48) — Switcher/Toggle instance
export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isDark = mounted && theme === 'dark';

    return (
        <button
            type='button'
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant',
                className,
            )}
        >
            {isDark ? (
                /* Sun icon */
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    aria-hidden='true'
                >
                    <circle
                        cx='12'
                        cy='12'
                        r='4'
                        stroke='currentColor'
                        strokeWidth='2'
                    />
                    <path
                        d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                    />
                </svg>
            ) : (
                /* Moon icon */
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    aria-hidden='true'
                >
                    <path
                        d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            )}
        </button>
    );
}
