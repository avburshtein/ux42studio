import PageTitle from '@/components/ui/PageTitle';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { id: projectId } = await params;

    return (
        <main className='p-8'>
            <PageTitle>Редактирование проекта #{projectId}</PageTitle>
        </main>
    );
}
