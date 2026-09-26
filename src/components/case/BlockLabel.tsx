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
            {/* a11y (LH color-contrast): text-outline[-variant] на белом —
                < 4.5:1 для 11px; on-surface-variant проходит AA в обеих темах */}
            <span className='text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-on-surface-variant'>
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
                // a11y (LH color-contrast): text-outline на белом < 4.5:1 —
                // on-surface-variant проходит AA; вызовы с text-primary
                // переопределяют цвет через tailwind-merge как раньше
                'text-[11px] font-semibold uppercase leading-4 tracking-[0.0455em] text-on-surface-variant',
                className,
            )}
        >
            {children}
        </span>
    );
}
