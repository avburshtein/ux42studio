export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Редактирование проекта #{params.id}</h1>
    </main>
  );
}
