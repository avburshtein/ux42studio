import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import ProjectCard from '@/components/ProjectCard';
import PageTitle from '@/components/ui/PageTitle';
import AuthBar from '@/components/AuthBar';
import Link from 'next/link';

export const revalidate = 300;

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const { env } = await getCloudflareContext({ async: true });
    const db = getDb(env.DB);

    const allCategories = await db.query.categories.findMany({
        orderBy: { order: 'asc' },
    });

    const selectedCategory = category
        ? allCategories.find((c) => c.slug === category)
        : undefined;

    let publishedProjects = await db.query.projects.findMany({
        where: {
            status: 'published',
            showOnHomepage: 1,
        },
        with: {
            profile: {
                columns: { slug: true, fullName: true, avatarFileId: true },
            },
            projectCategories: {
                with: { category: true },
            },
            coverFile: true,
        },
        orderBy: { publishedAt: 'desc' },
        limit: 100,
    });

    if (selectedCategory) {
        publishedProjects = publishedProjects.filter((p) =>
            p.projectCategories.some(
                (pc) => pc.category?.slug === selectedCategory.slug,
            ),
        );
    }

    return (
        <>
            <AuthBar />
            <main className='max-w-page mx-auto px-4 py-8 sm:px-6 lg:px-8'>
                <header className='mb-8'>
                    <PageTitle className='mb-2'>Каталог дизайнеров</PageTitle>
                    {allCategories.length > 0 && (
                        <div className='flex flex-wrap gap-2 mt-4'>
                            <Link
                                href='/'
                                className={`px-4 py-1.5 rounded-full border text-label-md transition-colors ${
                                    !selectedCategory
                                        ? 'border-primary bg-primary-container text-on-primary-container'
                                        : 'border-outline text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                                }`}
                            >
                                Все
                            </Link>
                            {allCategories.map((cat) => {
                                const active =
                                    selectedCategory?.slug === cat.slug;
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/?category=${encodeURIComponent(cat.slug)}`}
                                        className={`px-4 py-1.5 rounded-full border text-label-md transition-colors ${
                                            active
                                                ? 'border-primary bg-primary-container text-on-primary-container'
                                                : 'border-outline text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                                        }`}
                                    >
                                        {cat.name}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </header>

                {publishedProjects.length === 0 ? (
                    <p className='text-body-lg text-on-surface-variant text-center py-16'>
                        Пока нет опубликованных проектов
                    </p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {publishedProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
