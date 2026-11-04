import { RichText } from './RichText';

interface CaseBlockProps {
    title: string;
    body: string;
}

/**
 * Контейнер с бордером — как блоки «Color Tokens» и «Type scale»
 * (фидбэк 2026-11-03): для контента без отдельного поля — «User story»
 * и дополнительные блоки «заголовок + текст».
 *
 * Отличие от карточки: не заливка, а тонкая рамка + тот же фон, что у
 * секции, — блок читается как часть структуры, а не как плитка.
 */
export function CaseBlock({ title, body }: CaseBlockProps) {
    return (
        <div className='flex flex-col gap-3 rounded-base border border-outline-faint bg-surface-container-lowest p-6'>
            <h3 className='font-display text-headline-sm text-on-surface'>
                {title}
            </h3>
            <RichText text={body} />
        </div>
    );
}
