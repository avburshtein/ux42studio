'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { updateProjectProblem } from '@/lib/actions/projects';

const formSchema = z.object({
    problemStatement: z.string().optional().or(z.literal('')),
    projectGoal: z.string().optional().or(z.literal('')),
    targetUsers: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function ProblemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemStatement: '',
            projectGoal: '',
            targetUsers: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectProblem(projectId, {
                problemStatement: data.problemStatement || undefined,
                projectGoal: data.projectGoal || undefined,
                targetUsers: data.targetUsers || undefined,
            });
            router.push(`/admin/projects/${projectId}/edit/research`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <h2 className='mb-6 text-title-lg text-on-background'>
                Problem & Audience
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <Label htmlFor='problemStatement'>Problem Statement</Label>
                    <textarea
                        id='problemStatement'
                        {...register('problemStatement')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={5}
                    />
                </div>

                <div>
                    <Label htmlFor='projectGoal'>Project Goal</Label>
                    <textarea
                        id='projectGoal'
                        {...register('projectGoal')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={5}
                    />
                </div>

                <div>
                    <Label htmlFor='targetUsers'>Target Users</Label>
                    <textarea
                        id='targetUsers'
                        {...register('targetUsers')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={5}
                    />
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='flex justify-between gap-3 pt-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/general`,
                            )
                        }
                    >
                        ← Back
                    </Button>
                    <Button type='submit' disabled={saving}>
                        {saving ? 'Saving...' : 'Save & Next →'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
