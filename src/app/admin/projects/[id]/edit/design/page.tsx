'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { updateProjectDesign } from '@/lib/actions/projects';

const formSchema = z.object({
    visualDirection: z.string().optional().or(z.literal('')),
    displayFont: z.string().optional().or(z.literal('')),
    bodyFont: z.string().optional().or(z.literal('')),
    designApproach: z.string().optional().or(z.literal('')),
    colorRoleIds: z
        .array(
            z.object({
                roleId: z.string(),
                order: z.number().int(),
            }),
        )
        .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function DesignPage({
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
            visualDirection: '',
            displayFont: '',
            bodyFont: '',
            designApproach: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectDesign(projectId, {
                visualDirection: data.visualDirection || null,
                displayFont: data.displayFont || null,
                bodyFont: data.bodyFont || null,
                designApproach: data.designApproach || null,
                colorRoleIds: data.colorRoleIds,
            });
            router.push(`/admin/projects/${projectId}/edit/showcase`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <h2 className='mb-6 text-title-lg text-on-background'>Design</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <Label htmlFor='visualDirection'>Visual Direction</Label>
                    <textarea
                        id='visualDirection'
                        {...register('visualDirection')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                <div>
                    <Label htmlFor='displayFont'>Display Font</Label>
                    <Input id='displayFont' {...register('displayFont')} />
                </div>

                <div>
                    <Label htmlFor='bodyFont'>Body Font</Label>
                    <Input id='bodyFont' {...register('bodyFont')} />
                </div>

                <div>
                    <Label htmlFor='designApproach'>Design Approach</Label>
                    <textarea
                        id='designApproach'
                        {...register('designApproach')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                <div>
                    <Label>Color Roles</Label>
                    <p className='text-body-sm text-on-surface-variant'>
                        Color role selection will be available in a future
                        update.
                    </p>
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='flex justify-between gap-3 pt-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/research`,
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
