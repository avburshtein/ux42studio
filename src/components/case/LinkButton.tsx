import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
    className?: string;
}

// Кнопка-ссылка: «View prototype in Figma», «View Hi-Fi prototype»
// Figma: Link Button (master 410:535), 262×44, gap=8
export function LinkButton({
    href,
    children,
    external = false,
    className,
}: LinkButtonProps) {
    const content = (
        <>
            <span className='text-label-lg font-medium text-primary'>
                {children}
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
                    d='M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </>
    );

    if (external) {
        return (
            <a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                    'inline-flex h-11 items-center gap-2 rounded-base border border-outline-variant px-6 transition-colors hover:bg-surface-variant',
                    className,
                )}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={cn(
                'inline-flex h-11 items-center gap-2 rounded-base border border-outline-variant px-6 transition-colors hover:bg-surface-variant',
                className,
            )}
        >
            {content}
        </Link>
    );
}
