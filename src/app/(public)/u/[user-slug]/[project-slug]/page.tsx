interface PageProps {
  params: Promise<{
    'user-slug': string;
    'project-slug': string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { 'user-slug': userSlug, 'project-slug': projectSlug } = await params;

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold">Профиль: {userSlug}</h1>
      <p className="text-gray-600 mt-2">Проект: {projectSlug}</p>
    </main>
  );
}

// Если в файле объявлен generateMetadata, обновите и его сигнатуру:
export async function generateMetadata({ params }: PageProps) {
  const { 'project-slug': projectSlug } = await params;
  return {
    title: `Проект ${projectSlug}`,
  };
}