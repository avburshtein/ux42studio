interface PortfolioCardProps {
    title: string;
    body: string;
}

// Универсальная карточка кейса: заголовок (headline/small) + текст
export function PortfolioCard({ title, body }: PortfolioCardProps) {
    return (
        <div className='flex flex-1 flex-col gap-3 rounded-lg bg-surface-container-low p-6 shadow-card'>
            <h3 className='font-display text-headline-sm text-on-surface'>
                {title}
            </h3>
            <p className='text-body-md text-on-surface-variant'>{body}</p>
        </div>
    );
}
