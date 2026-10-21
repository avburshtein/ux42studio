import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPageShell } from '@/components/legal/LegalPageShell';
import { HelpArticleBody } from '@/components/help/HelpArticle';
import { HELP_ARTICLES, getHelpArticle } from '@/lib/help/content';

interface HelpArticlePageProps {
    params: Promise<{ slug: string }>;
}

// SSG: все статьи собираются на билде из реестра — новая статья получает
// свою страницу автоматически без ручной регистрации маршрута.
export function generateStaticParams(): { slug: string }[] {
    return HELP_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: HelpArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = getHelpArticle(slug);
    if (!article) return {};
    return {
        title: `${article.title} — Help — ux42.studio`,
        description: article.summary,
    };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
    const { slug } = await params;
    const article = getHelpArticle(slug);
    if (!article) notFound();

    const related = HELP_ARTICLES.filter(
        (a) => a.category === article.category && a.slug !== article.slug,
    );

    return (
        <LegalPageShell
            breadcrumbLabel={article.title}
            breadcrumbParent={{ href: '/help', label: 'Help' }}
        >
            <HelpArticleBody article={article} related={related} />
        </LegalPageShell>
    );
}
