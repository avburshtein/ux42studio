interface MetricCardProps {
    value: string;
    description: string;
}

// Карточка ключевой метрики: крупное значение + подпись
export function MetricCard({ value, description }: MetricCardProps) {
    return (
        <div className='flex flex-1 flex-col gap-2 rounded-base bg-surface-container-lowest p-5 shadow-card'>
            <span className='font-display text-headline-lg text-primary'>
                {value}
            </span>
            <span className='text-body-sm text-on-surface-variant'>
                {description}
            </span>
        </div>
    );
}
