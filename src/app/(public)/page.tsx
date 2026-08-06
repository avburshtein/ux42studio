import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import ProjectCard from '@/components/ProjectCard';

export const revalidate = 300;

export default async function HomePage() {
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const [publishedProjects, allCategories] = await Promise.all([
        db.query.projects.findMany({
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
            limit: 20,
        }),
        db.query.categories.findMany({
            orderBy: { order: 'asc' },
        }),
    ]);

    return (
        <main className='max-w-page mx-auto px-4 py-8 sm:px-6 lg:px-8'>
            <header className='mb-8'>
                <h1 className='text-headline-md text-on-background mb-2'>
                    Каталог дизайнеров
                </h1>
                {allCategories.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-4'>
                        {allCategories.map((cat) => (
                            <button
                                key={cat.id}
                                type='button'
                                className='px-4 py-1.5 rounded-full border border-outline text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                            >
                                {cat.name}
                            </button>
                        ))}
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
    );
}
