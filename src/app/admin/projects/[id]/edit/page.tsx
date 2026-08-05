interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { id: projectId } = await params;

    return (
        <main className='p-8'>
            <h1 className='text-2xl font-bold'>
                Редактирование проекта #{projectId}
            </h1>
        </main>
    );
}
