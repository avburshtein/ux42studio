import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

const ASSET_DOMAIN = 'https://assets.ux42.studio';

export const revalidate = 600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getImageUrl(r2Key: string): string {
    return `${ASSET_DOMAIN}/${r2Key}`;
}

export default async function ProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { slug },
        with: {
            socialLinks: { orderBy: { order: 'asc' } },
            avatarFile: true,
            coverFile: true,
        },
    });

    if (!profile) {
        notFound();
    }

    const projects = await db.query.projects.findMany({
        where: {
            profileId: profile.id,
            status: 'published',
        },
        with: {
            profile: {
                columns: { slug: true, fullName: true },
            },
            projectCategories: { with: { category: true } },
            coverFile: true,
        },
        orderBy: { publishedAt: 'desc' },
    });

    return (
        <main className='max-w-page mx-auto'>
            {/* Cover + Avatar Header */}
            <section className='relative'>
                {profile.coverFile ? (
                    <div className='relative w-full h-48 sm:h-64 md:h-80'>
                        <Image
                            src={getImageUrl(profile.coverFile.r2Key)}
                            alt=''
                            fill
                            sizes='100vw'
                            className='object-cover'
                            priority
                        />
                        <div className='absolute inset-0 hero-title-scrim' />
                    </div>
                ) : (
                    <div className='w-full h-48 sm:h-64 md:h-80 bg-surface-variant' />
                )}

                <div className='max-w-content mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6'>
                        {profile.avatarFile ? (
                            <div className='relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-background bg-surface-variant shrink-0'>
                                <Image
                                    src={getImageUrl(profile.avatarFile.r2Key)}
                                    alt={profile.fullName}
                                    fill
                                    sizes='128px'
                                    className='object-cover'
                                />
                            </div>
                        ) : (
                            <div className='w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background bg-surface-variant shrink-0 flex items-center justify-center text-on-surface-variant text-title-lg'>
                                {profile.fullName.charAt(0)}
                            </div>
                        )}
                        <div className='pb-2'>
                            <h1 className='text-headline-sm sm:text-headline-md text-on-background'>
                                {profile.fullName}
                            </h1>
                            {profile.headline && (
                                <p className='text-body-lg text-on-surface-variant mt-1'>
                                    {profile.headline}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bio + Meta */}
            <section className='max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
                {(profile.bio || profile.location || profile.website) && (
                    <div className='space-y-3'>
                        {profile.bio && (
                            <p className='text-body-md text-on-surface-variant whitespace-pre-line'>
                                {profile.bio}
                            </p>
                        )}
                        <div className='flex flex-wrap gap-4 text-body-sm text-on-surface-variant'>
                            {profile.location && (
                                <span>{profile.location}</span>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-primary hover:underline'
                                >
                                    {profile.website.replace(
                                        /^https?:\/\//,
                                        '',
                                    )}
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Social Links */}
                {profile.socialLinks.length > 0 && (
                    <div className='flex flex-wrap gap-3'>
                        {profile.socialLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline text-label-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors'
                            >
                                {link.title}
                            </a>
                        ))}
                    </div>
                )}
            </section>

            {/* Projects Grid */}
            <section className='max-w-content mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
                <h2 className='text-headline-sm text-on-background mb-6'>
                    Проекты
                </h2>
                {projects.length === 0 ? (
                    <p className='text-body-lg text-on-surface-variant text-center py-12'>
                        Пока нет проектов
                    </p>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
