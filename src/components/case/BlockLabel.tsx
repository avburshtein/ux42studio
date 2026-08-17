import { cn } from '@/lib/utils';

interface BlockLabelProps {
    number: string;
    label: string;
    className?: string;
}

// «01 —— Problem & Audience»: номер + разделитель + название блока
export function BlockLabel({ number, label, className }: BlockLabelProps) {
    return (
        <div className={cn('flex w-full items-center gap-4', className)}>
            <span className='text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.14em] text-primary'>
                {number}
            </span>
            <span
                aria-hidden
                className='h-px flex-1 bg-[rgba(30,106,79,0.16)]'
            />
            <span className='text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant'>
                {label}
            </span>
        </div>
    );
}

interface SectionLabelProps {
    children: React.ReactNode;
    className?: string;
}

// Малая overline-подпись: «Moodboard», «Results», «Tools», «Next steps»
export function SectionLabel({ children, className }: SectionLabelProps) {
    return (
        <span
            className={cn(
                'text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-outline',
                className,
            )}
        >
            {children}
        </span>
    );
}
