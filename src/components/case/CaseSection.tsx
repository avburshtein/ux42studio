import { cn } from '@/lib/utils';
import { BlockLabel } from './BlockLabel';
import { SectionHeader } from './SectionHeader';

interface CaseSectionProps {
    number: string;
    label: string;
    title: string;
    description?: string | null;
    children?: React.ReactNode;
    className?: string;
}

// Обёртка секции кейса: BlockLabel + SectionHeader + контент (gap 32)
export function CaseSection({
    number,
    label,
    title,
    description,
    children,
    className,
}: CaseSectionProps) {
    return (
        <section className={cn('flex w-full flex-col gap-8', className)}>
            <BlockLabel number={number} label={label} />
            <SectionHeader title={title} description={description} />
            {children}
        </section>
    );
}
