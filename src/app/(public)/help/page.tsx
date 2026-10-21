import type { Metadata } from 'next';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { HelpSearch } from '@/components/help/HelpSearch';
import { HELP_ARTICLES, HELP_CATEGORIES } from '@/lib/help/content';

export const metadata: Metadata = {
    title: 'Help center — ux42.studio',
    description:
        'Answers to any question about the platform: registration, profile, case editor, publishing, privacy.',
};

// Индекс справки: поиск сверху + все категории со статьями.
// Всё строится из реестра HELP_ARTICLES — новая статья появляется тут сама.
export default function HelpIndexPage() {
    return (
        <LegalPageShell breadcrumbLabel='Help'>
            <div className='flex flex-col gap-12'>
                <header className='flex flex-col gap-4'>
                    <h1 className='font-display text-headline-lg font-medium text-on-surface'>
                        Help center
                    </h1>
                    <p className='max-w-2xl text-body-lg text-on-surface-variant'>
                        Everything about how the platform works — registration, your page, the
                        case editor, publishing and privacy. Search or browse by topic.
                    </p>
                </header>

                <HelpSearch articles={HELP_ARTICLES} categories={HELP_CATEGORIES} />

                <nav aria-label='Help categories' className='flex flex-col gap-10'>
                    {HELP_CATEGORIES.map((category) => {
                        const articles = HELP_ARTICLES.filter(
                            (a) => a.category === category.id,
                        );
                        if (articles.length === 0) return null;
                        return (
                            <section
                                key={category.id}
                                aria-labelledby={`help-cat-${category.id}`}
                                className='flex flex-col gap-4'
                            >
                                <div className='flex flex-col gap-1'>
                                    <h2
                                        id={`help-cat-${category.id}`}
                                        className='font-display text-title-lg font-medium text-on-surface'
                                    >
                                        {category.title}
                                    </h2>
                                    <p className='text-body-md text-on-surface-variant'>
                                        {category.description}
                                    </p>
                                </div>
                                <ul className='flex flex-col divide-y divide-outline-variant'>
                                    {articles.map((article) => (
                                        <li key={article.slug}>
                                            <a
                                                href={`/help/${article.slug}`}
                                                className='group flex flex-col gap-1 py-4 transition-colors'
                                            >
                                                <span className='text-title-sm font-medium text-primary transition-opacity group-hover:opacity-80'>
                                                    {article.title}
                                                </span>
                                                <span className='text-body-md text-on-surface-variant'>
                                                    {article.summary}
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </nav>
            </div>
        </LegalPageShell>
    );
}
