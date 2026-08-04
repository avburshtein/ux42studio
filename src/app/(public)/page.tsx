import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';

export const revalidate = 0;

export default async function HomePage() {
  const { env } = await getCloudflareContext();
  const db = getDb(env.DB);

  // Чистый синтаксис Drizzle RQB v2
  const profile = await db.query.profiles.findFirst({
    where: {
      slug: 'denis-zakharchenko',
    },
    with: {
      user: true,
      socialLinks: {
        orderBy: { order: 'asc' },
      },
      projects: {
        with: {
          projectCategories: {
            with: {
              category: true,
            },
          },
          keyMetrics: true,
        },
      },
    },
  });

  if (!profile) {
    return <main className="p-8 font-sans text-red-500">Профиль не найден</main>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <header className="border-b pb-6 mb-8">
        <h1 className="text-3xl font-bold">{profile.fullName}</h1>
        <p className="text-lg text-gray-600">{profile.headline}</p>
        <p className="text-sm text-gray-500 mt-1">{profile.location} • {profile.website}</p>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-4">Проекты</h2>
        <div className="grid gap-6">
          {profile.projects.map((project) => (
            <article key={project.id} className="p-6 border rounded-xl bg-card shadow-sm">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-700 mt-2">{project.teaser}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}