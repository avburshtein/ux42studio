import { cn } from '@/lib/utils';

interface ResultsCardProps {
    content: string;
    className?: string;
}

// Карточка результата: check-иконка + текст
// Figma: Results card (master 200:1125), 524×66, padding=20, radius=14
export function ResultsCard({ content, className }: ResultsCardProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3.5 rounded-lg bg-surface-container-lowest p-5 shadow-card',
                className,
            )}
        >
            <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                aria-hidden='true'
                className='shrink-0 text-primary'
            >
                <path
                    d='M16.6667 5L7.5 14.1667L3.33334 10'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
            <span className='text-body-md text-on-surface'>
                {content}
            </span>
        </div>
    );
}
