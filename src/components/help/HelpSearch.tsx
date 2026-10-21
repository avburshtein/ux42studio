'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HelpArticle, HelpCategory } from '@/lib/help/content';

// Поиск по справке — клиентский, без сервера и БД: реестр статей статический,
// поэтому фильтр по title/summary/keywords даёт мгновенный ответ.
// Правила a11y: input связан с Label (визуально скрытой), результаты —
// role='region' с aria-label, пустой результат озвучивается текстом.

interface HelpSearchProps {
    articles: HelpArticle[];
    categories: HelpCategory[];
}

export function HelpSearch({ articles, categories }: HelpSearchProps) {
    const [query, setQuery] = useState('');

    const categoryById = useMemo(
        () => new Map(categories.map((c) => [c.id, c])),
        [categories],
    );

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return null;
        return articles.filter((a) => {
            const haystack = [
                a.title,
                a.summary,
                ...a.keywords,
                categoryById.get(a.category)?.title ?? '',
            ]
                .join(' ')
                .toLowerCase();
            return q.split(/\s+/).every((token) => haystack.includes(token));
        });
    }, [query, articles, categoryById]);

    return (
        <div className='flex flex-col gap-4'>
            <div className='relative'>
                <Search
                    size={20}
                    aria-hidden='true'
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant'
                />
                <label htmlFor='help-search' className='sr-only'>
                    Search help articles
                </label>
                <input
                    id='help-search'
                    type='search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search articles — try “invite”, “slug”, “publish”…'
                    autoComplete='off'
                    className='h-12 w-full rounded-md border border-outline bg-surface-container-lowest pl-11 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                />
            </div>

            {results && (
                <div
                    role='region'
                    aria-label='Search results'
                    className='flex flex-col gap-2'
                >
                    <p aria-live='polite' className='text-body-sm text-on-surface-variant'>
                        {results.length === 0
                            ? 'Nothing found — try another word, or browse the categories below.'
                            : `Found ${results.length} article${results.length === 1 ? '' : 's'}:`}
                    </p>
                    <ul className={cn('flex flex-col gap-1', results.length === 0 && 'hidden')}>
                        {results.map((a) => (
                            <li key={a.slug}>
                                <Link
                                    href={`/help/${a.slug}`}
                                    className='block rounded-md px-3 py-2 text-body-md text-primary transition-colors hover:bg-surface-container'
                                >
                                    {a.title}
                                    <span className='ml-2 text-body-sm text-on-surface-variant'>
                                        — {categoryById.get(a.category)?.title}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HelpSearch;
