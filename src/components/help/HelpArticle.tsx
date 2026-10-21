import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RichText } from '@/components/case/RichText';
import type { HelpArticle, HelpSection, HelpTable } from '@/lib/help/content';

// Рендерер статьи справки /help — типизированный аналог LegalArticle,
// но: одна колонка max-w-3xl (статья, не юридический двухъязычный документ),
// нумерованные шаги вместо таблицlegal, и RichText markdown-lite для абзацев
// (списки, **жирный**, *курсив* — как в текстовых полях кейса, чтобы автору
// справки не учить второй синтаксис).

function HelpTableBlock({ table }: { table: HelpTable }) {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full min-w-[420px] border-collapse text-left align-top'>
                <thead>
                    <tr>
                        {table.headers.map((header, i) => (
                            <th
                                key={i}
                                scope='col'
                                className='border-b border-outline-variant bg-surface-container px-4 py-2 text-title-sm text-on-surface'
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td
                                    key={c}
                                    className={cn(
                                        'border-b border-outline-variant px-4 py-2.5 text-body-sm align-top',
                                        c === 0
                                            ? 'font-medium text-on-surface'
                                            : 'text-on-surface-variant',
                                    )}
                                >
                                    <RichText text={cell} className='text-body-sm' />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function HelpSectionBlock({ section }: { section: HelpSection }) {
    return (
        <section className='flex flex-col gap-4'>
            <h2 className='font-display text-title-lg font-medium text-on-surface'>
                {section.heading}
            </h2>

            {section.paragraphs?.map((paragraph, i) => (
                <RichText key={`p-${i}`} text={paragraph} />
            ))}

            {section.steps && (
                <ol className='flex flex-col gap-2'>
                    {section.steps.map((step, i) => (
                        <li key={i} className='flex gap-3 text-body-md text-on-surface-variant'>
                            <span
                                aria-hidden='true'
                                className='mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-label-sm font-semibold text-on-primary-container'
                            >
                                {i + 1}
                            </span>
                            <span className='min-w-0'>
                                <RichText text={step} />
                            </span>
                        </li>
                    ))}
                </ol>
            )}

            {section.bullets && (
                <ul className='list-disc space-y-2 pl-5'>
                    {section.bullets.map((item, i) => (
                        <li key={i} className='text-body-md text-on-surface-variant'>
                            <RichText text={item} />
                        </li>
                    ))}
                </ul>
            )}

            {section.table && <HelpTableBlock table={section.table} />}
        </section>
    );
}

interface HelpArticleProps {
    article: HelpArticle;
    /** Статьи той же категории — блок «Related» внизу */
    related?: HelpArticle[];
}

export function HelpArticleBody({ article, related }: HelpArticleProps) {
    return (
        <div className='flex flex-col gap-14'>
            <header className='flex flex-col gap-3'>
                <h1 className='font-display text-headline-lg font-medium text-on-surface'>
                    {article.title}
                </h1>
                <p className='text-body-lg text-on-surface-variant'>{article.summary}</p>
                <p className='text-label-md text-on-surface-variant'>
                    Updated: {article.lastUpdated}
                </p>
            </header>

            <div className='flex flex-col gap-10'>
                {article.sections.map((section, i) => (
                    <HelpSectionBlock key={i} section={section} />
                ))}
            </div>

            {related && related.length > 0 && (
                <aside className='flex flex-col gap-3 border-t border-outline-variant pt-8'>
                    <h2 className='text-title-sm font-medium text-on-surface'>
                        Related articles
                    </h2>
                    <ul className='flex flex-col gap-2'>
                        {related.map((rel) => (
                            <li key={rel.slug}>
                                <Link
                                    href={`/help/${rel.slug}`}
                                    className='text-body-md text-primary underline decoration-1 underline-offset-2 transition-opacity hover:opacity-80'
                                >
                                    {rel.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
    );
}

export default HelpArticleBody;
