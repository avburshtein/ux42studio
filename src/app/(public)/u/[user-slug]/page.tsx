interface PageProps {
    params: Promise<{
        'user-slug': string;
    }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { 'user-slug': userSlug } = await params;

    return (
        <main className='max-w-4xl mx-auto p-8 font-sans'>
            <h1 className='text-2xl font-bold'>Профиль: {userSlug}</h1>
        </main>
    );
}
