import { RichText } from './RichText';

interface PortfolioCardProps {
    title: string;
    body: string;
}

// Универсальная карточка кейса: заголовок (headline/small) + текст
// (RichText: переносы, списки с зелёными маркерами, **жирный**, *курсив*)
export function PortfolioCard({ title, body }: PortfolioCardProps) {
    return (
        <div className='flex flex-1 flex-col gap-3 rounded-lg bg-surface-container-lowest p-6 shadow-card'>
            <h3 className='font-display text-headline-sm text-primary'>
                {title}
            </h3>
            <RichText text={body} />
        </div>
    );
}
