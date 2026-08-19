import { cn } from '@/lib/utils';

interface NextStepsListProps {
    items: Array<{ id: string; content: string }>;
    className?: string;
}

// Список «Next steps»: маркер-точка (6×6) + текст
// Figma: 3 bullet items, HORIZONTAL gap=14
export function NextStepsList({ items, className }: NextStepsListProps) {
    return (
        <ul className={cn('flex flex-col gap-3.5', className)}>
            {items.map((item) => (
                <li
                    key={item.id}
                    className='flex items-start gap-3.5'
                >
                    <span className='mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                    <span className='text-body-md text-on-surface-variant'>
                        {item.content}
                    </span>
                </li>
            ))}
        </ul>
    );
}
