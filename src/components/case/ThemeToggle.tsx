'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
}

// Figma: Switcher/Toggle — Mode Button, 48×48
// HORIZONTAL, pad 4×12, radius full. Icon 24×24.
// Ховер (решение 2026-08-27 (11) + уточнение там же, Main_page_Spec.md):
// без заливки и без бордера — в ховере меняется только цвет иконки
// на green (hover:text-primary). Форма круга 48×48 сохранена.
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
                'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full px-3 py-1',
                'text-on-surface-variant transition-colors duration-150 ease-out hover:text-primary',
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
