export default function ProfilePage({ params }: { params: { 'user-slug': string } }) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Профиль дизайнера: {params['user-slug']}</h1>
    </main>
  );
}
