import { RichText } from './RichText';

interface StatementCardProps {
    label: string;
    text?: string | null;
}

/**
 * Карточка «проблема» — мягкая подложка с оттенком бренда, без тени и без
 * зелёной линии слева (фидбэк 2026-11-03, по макету Figma).
 *
 * Подложка = 5% бренда поверх почти белого фона (≈ #f3f8f6 на белом);
 * в тёмной теме — 12% (иначе на почти чёрном фоне карточка не видна).
 * Ярлык — фирменным цветом темы (`primary-text`), 11px / 600 / uppercase.
 */
export function StatementCard({ label, text }: StatementCardProps) {
    if (!text?.trim()) return null;
    return (
        <div className='case-card flex flex-col gap-2 rounded-2xl p-6'>
            <span className='text-label-sm uppercase tracking-[0.1em] text-primary-text'>
                {label}
            </span>
            <RichText
                text={text}
                className='text-body-md leading-[1.75] text-on-surface-variant'
            />
        </div>
    );
}
