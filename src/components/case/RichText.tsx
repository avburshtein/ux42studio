import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Rich text для текстовых полей кейса — markdown-lite.
 *
 * Формат (простой и предсказуемый для дизайнера):
 *  - двойной перенос  → новый абзац;
 *  - одинарный перенос → <br/> (принудительная строка);
 *  - строка с «- » или «* » в начале → элемент списка, маркер зелёный
 *    (text-primary — насыщенный зелёный бренда; заметнее
 *    primary-container, который на белом фоне пастельный);
 *  - **текст** → жирный, *текст* → курсив.
 *
 * Рендер — React-элементы (никакого dangerouslySetInnerHTML):
 * пользовательский текст не может инъекцировать разметку.
 * Однострочные поля (введённые раньше через Input) читаются как есть —
 * без переносов просто абзац.
 */

interface RichTextProps {
    text?: string | null;
    className?: string;
}

/** Инлайн-разметка: **жирный** и *курсив*. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
                <strong key={`${keyPrefix}-${i}`} className='font-semibold text-on-surface'>
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return (
                <em key={`${keyPrefix}-${i}`} className='italic'>
                    {part.slice(1, -1)}
                </em>
            );
        }
        return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
    });
}

function renderBlock(block: string, keyPrefix: string): {
    hasList: boolean;
    node: React.ReactNode;
} {
    const lines = block.split('\n');
    let listLines: string[] = [];
    const result: React.ReactNode[] = [];
    let plainLines: string[] = [];
    let hasList = false;
    const flushPlain = (idx: number) => {
        if (plainLines.length > 0) {
            result.push(
                <span key={`${keyPrefix}-p-${idx}`}>
                    {plainLines.map((l, j) => (
                        <React.Fragment key={j}>
                            {j > 0 && <br />}
                            {renderInline(l, `${keyPrefix}-pl-${idx}-${j}`)}
                        </React.Fragment>
                    ))}
                </span>,
            );
            plainLines = [];
        }
    };

    const flushList = (idx: number) => {
        if (listLines.length > 0) {
            hasList = true;
            result.push(
                <ul key={`${keyPrefix}-ul-${idx}`} className='my-1 flex list-none flex-col gap-1 pl-1'>
                    {listLines.map((item, k) => (
                        <li key={k} className='flex items-start gap-2'>
                            {/* Маркер — фирменный зелёный (primary) */}
                            <span aria-hidden='true' className='mt-[0.45em] block h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                            <span>{renderInline(item, `${keyPrefix}-li-${idx}-${k}`)}</span>
                        </li>
                    ))}
                </ul>,
            );
            listLines = [];
        }
    };

    lines.forEach((line, j) => {
        const listMatch = line.match(/^\s*[-*]\s+(.*)$/);
        if (listMatch) {
            flushPlain(j);
            listLines.push(listMatch[1]);
        } else {
            flushList(j);
            plainLines.push(line);
        }
    });
    flushPlain(lines.length);
    flushList(lines.length);

    return { hasList, node: <>{result}</> };
}

export function RichText({ text, className }: RichTextProps) {
    if (!text?.trim()) return null;

    const blocks = text.trim().split(/\n{2,}/);

    return (
        <div
            className={cn(
                'flex flex-col gap-2 text-body-md text-on-surface-variant',
                className,
            )}
        >
            {blocks.map((block, i) => {
                const { hasList, node } = renderBlock(block, `${i}`);
                // ul внутри p невалиден — блоки со списками оборачиваем в div
                const Tag = hasList ? 'div' : 'p';
                return <Tag key={i}>{node}</Tag>;
            })}
        </div>
    );
}

export default RichText;
