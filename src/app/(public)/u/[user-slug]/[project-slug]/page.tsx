export default function ProjectPage({
  params,
}: {
  params: { 'user-slug': string; 'project-slug': string };
}) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Проект: {params['project-slug']}</h1>
      <p className="mt-2 text-gray-600">Автор: {params['user-slug']}</p>
    </main>
  );
}
