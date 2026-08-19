import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    title: string;
    description?: string | null;
    className?: string;
}

// Заголовок секции: H2 (headline/medium) + описание (body/medium)
export function SectionHeader({
    title,
    description,
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn('flex w-full flex-col gap-6', className)}>
            <h2 className='font-display text-headline-md text-on-surface'>
                {title}
            </h2>
            {description ? (
                <p className='text-body-md text-on-surface-variant'>
                    {description}
                </p>
            ) : null}
        </div>
    );
}
