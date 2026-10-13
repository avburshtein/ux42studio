import { cn } from '@/lib/utils';
import { RichText } from './RichText';

interface SectionHeaderProps {
    title: string;
    description?: string | null;
    className?: string;
}

// Заголовок секции: H2 (headline/medium) + описание (body/medium).
// Описание — RichText (markdown-lite): переносы строк, списки с
// зелёными маркерами, **жирный**, *курсив*.
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
            <RichText text={description} />
        </div>
    );
}
