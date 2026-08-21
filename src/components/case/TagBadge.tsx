import { cn } from '@/lib/utils';

type TagVariant = 'filled' | 'outlined' | 'ghost';

interface TagBadgeProps {
    label: string;
    variant?: TagVariant;
    className?: string;
}

// Tag / Badge (Spec: 43:8) — 3 variants: Filled, Outlined, Ghost
export function TagBadge({
    label,
    variant = 'outlined',
    className,
}: TagBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap text-label-md font-medium',
                // Filled: bg surface-tint, white text, shadow, pad 8×14, radius 12
                variant === 'filled' &&
                    'rounded-base bg-surface-tint px-3.5 py-2 text-white shadow-[1px_1px_4px_rgba(0,0,0,0.1)]',
                // Outlined: bg container-lowest, border primary/16, pad 6×12, radius 10
                variant === 'outlined' &&
                    'rounded-[10px] border border-primary/16 bg-surface-container-lowest px-3 py-1.5 text-on-surface-variant',
                // Ghost: frosted glass bg on-secondary/16 + blur, pad 4×12, radius 12
                variant === 'ghost' &&
                    'rounded-base bg-on-secondary/16 px-3 py-1 text-on-primary backdrop-blur-sm',
                className,
            )}
        >
            {label}
        </span>
    );
}