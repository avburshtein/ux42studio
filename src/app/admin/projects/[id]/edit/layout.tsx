import { headers } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { projects, profiles } from '@/db/schema';
import { notFound, redirect } from 'next/navigation';
import { WizardSidebar } from '@/components/admin/WizardSidebar';

export default async function ProjectEditLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    if (!userId) redirect('/login');

    const { env } = await getCloudflareContext();
    const db = getDb(env.DB);

    const profile = await db.query.profiles.findFirst({
        where: { userId },
        columns: { id: true },
    });

    if (!profile) redirect('/admin/profile');

    const project = await db.query.projects.findFirst({
        where: { id, profileId: profile.id },
    });

    if (!project) notFound();

    return (
        <div className='mx-auto flex max-w-container-page gap-8 px-4 py-8'>
            <WizardSidebar projectId={id} projectTitle={project.title} />
            <div className='min-w-0 flex-1'>{children}</div>
        </div>
    );
}
