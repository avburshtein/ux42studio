import type { MetadataRoute } from 'next';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';

// C3 (решение (42)): sitemap.xml — статика + динамика из D1 (публичные
// профили isPublic и их published-проекты). force-dynamic: prerender на
// билде заморозил бы динамическую часть (биндингов БД при билде нет);
// try/catch — без БД (например, dev) отдаётся только статика.
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://ux42.studio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1 },
        { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.5 },
    ];

    try {
        const { env } = await getCloudflareContext();
        const db = getDb(env.DB);

        // Публичные профили → /u/{slug} (isPublic — integer 0/1)
        const publicProfiles = await db.query.profiles.findMany({
            where: { isPublic: 1 },
            columns: { id: true, slug: true },
        });
        const slugById = new Map(publicProfiles.map((p) => [p.id, p.slug]));

        // Published-проекты публичных профилей → /u/{profileSlug}/{projectSlug}
        const publishedProjects = await db.query.projects.findMany({
            where: { status: 'published' },
            columns: { slug: true, profileId: true, updatedAt: true },
        });

        const dynamicEntries: MetadataRoute.Sitemap = publicProfiles.map(
            (profile) => ({
                url: `${BASE_URL}/u/${profile.slug}`,
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            }),
        );

        for (const project of publishedProjects) {
            const profileSlug = slugById.get(project.profileId);
            if (!profileSlug) continue;
            dynamicEntries.push({
                url: `${BASE_URL}/u/${profileSlug}/${project.slug}`,
                lastModified: project.updatedAt
                    ? new Date(project.updatedAt * 1000)
                    : undefined,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        }

        return [...staticEntries, ...dynamicEntries];
    } catch {
        // D1 недоступна — отдаём только статику (страница не падает)
        return staticEntries;
    }
}
