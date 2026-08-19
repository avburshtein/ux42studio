'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
}

// Figma: Switcher/Toggle — Mode Button, 48×48
// HORIZONTAL, pad 4×12, border 1px Surface Container Highest, radius full
// Icon 24×24
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
                'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full px-3 py-1 transition-colors',
                'text-on-surface-variant hover:bg-surface-variant',
                className,
            )}
        >
            {isDark ? (
                <Sun size={24} aria-hidden='true' />
            ) : (
                <Moon size={24} aria-hidden='true' />
            )}
        </button>
    );
}
