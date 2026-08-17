import { cn } from '@/lib/utils';

interface TagBadgeProps {
    children: React.ReactNode;
    className?: string;
}

// Tag / Badge (Figma master 43:2) — height=36, radius=12, gap=12
export function TagBadge({ children, className }: TagBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex h-9 items-center justify-center rounded-base bg-primary-container px-3.5 text-label-md font-medium text-on-primary-container',
                className,
            )}
        >
            {children}
        </span>
    );
}