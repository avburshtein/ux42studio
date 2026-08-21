import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LinkButtonProps {
    label: string;
    href: string;
    disabled?: boolean;
    className?: string;
}

// Plain text link with chevron-right icon
// Spec: Link Button (604:597) — 4 states: Enabled, Hovered, Focused, Disabled
export function LinkButton({
    label,
    href,
    disabled = false,
    className,
}: LinkButtonProps) {
    const isExternal = href.startsWith('http');

    const content = (
        <>
            <span className='text-title-md tracking-[0.15px] text-primary'>
                {label}
            </span>
            <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                aria-hidden='true'
                className='shrink-0 text-primary'
            >
                <path
                    d='M7.5 3.75L13.75 10L7.5 16.25'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </>
    );

    const styles = cn(
        'inline-flex h-11 items-center gap-2 py-2.5',
        'transition-opacity',
        'hover:opacity-80',
        'focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-2',
        disabled && 'pointer-events-none opacity-[0.38]',
        className,
    );

    if (isExternal) {
        return (
            <a
                href={disabled ? undefined : href}
                target='_blank'
                rel='noopener noreferrer'
                className={styles}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={styles}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
        >
            {content}
        </Link>
    );
}
