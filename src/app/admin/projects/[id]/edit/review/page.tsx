'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import Title from '@/components/ui/Title';
import {
    updateProjectReview,
    getProjectPreviewInfo,
    archiveProject,
    getProjectStatus,
    getProjectReview,
} from '@/lib/actions/projects';
import Link from 'next/link';

const reviewItemSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'Text is required'),
    authorName: z.string().min(1, 'Author name is required'),
    authorRole: z.string().optional().or(z.literal('')),
    avatarFileId: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const projectItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    order: z.number().int(),
});

const formSchema = z.object({
    keyTakeaway: z.string().optional().or(z.literal('')),
    reviews: z.array(reviewItemSchema),
    nextSteps: z.array(projectItemSchema),
    publish: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [projectStatus, setProjectStatus] = useState<string | null>(null);
    const [archiving, setArchiving] = useState(false);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    useEffect(() => {
        if (!projectId) return;
        getProjectStatus(projectId).then((status) => setProjectStatus(status));
    }, [projectId]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyTakeaway: '',
            reviews: [],
            nextSteps: [],
            publish: false,
        },
    });

    const {
        fields: reviewFields,
        append: appendReview,
        remove: removeReview,
    } = useFieldArray({ control, name: 'reviews' });

    const {
        fields: nextStepFields,
        append: appendNextStep,
        remove: removeNextStep,
    } = useFieldArray({ control, name: 'nextSteps' });

    useEffect(() => {
        if (!projectId) return;
        getProjectReview(projectId)
            .then((r) => {
                reset({
                    keyTakeaway: r?.keyTakeaway ?? '',
                    reviews: (r?.reviews ?? []).map((rev) => ({
                        ...rev,
                        authorRole: rev.authorRole ?? '',
                        avatarFileId: rev.avatarFileId ?? '',
                    })),
                    nextSteps: r?.nextSteps ?? [],
                    publish: false,
                });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        setPreviewUrl(null);
        try {
            const result = await updateProjectReview(projectId, {
                keyTakeaway: data.keyTakeaway || undefined,
                reviews: data.reviews.map((r) => ({
                    ...r,
                    authorRole: r.authorRole || undefined,
                    avatarFileId: r.avatarFileId || undefined,
                })),
                nextSteps: data.nextSteps.map((n, i) => ({
                    ...n,
                    order: i,
                })),
                publish: data.publish,
            });

            if (result && 'error' in result && result.error) {
                setError(result.error);
                return;
            }

            if (data.publish) {
                const info = await getProjectPreviewInfo(projectId);
                if (info) {
                    setPreviewUrl(`/u/${info.authorSlug}/${info.projectSlug}`);
                }
            } else {
                router.push('/admin');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <Title className='mb-6'>Review & Publish</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                    <Label htmlFor='keyTakeaway'>Key Takeaway</Label>
                    <textarea
                        id='keyTakeaway'
                        {...register('keyTakeaway')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                {/* Reviews */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Reviews</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendReview({
                                    text: '',
                                    authorName: '',
                                    authorRole: '',
                                    avatarFileId: '',
                                    order: reviewFields.length,
                                })
                            }
                        >
                            + Add Review
                        </Button>
                    </div>
                    {reviewFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-md border border-outline-variant p-4'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-sm text-on-surface'>
                                    Review {index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removeReview(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className='space-y-3'>
                                <div>
                                    <Label>Text *</Label>
                                    <textarea
                                        {...register(`reviews.${index}.text`)}
                                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                        rows={3}
                                    />
                                    {errors.reviews?.[index]?.text && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Author Name *</Label>
                                    <Input
                                        {...register(
                                            `reviews.${index}.authorName`,
                                        )}
                                    />
                                    {errors.reviews?.[index]?.authorName && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Author Role</Label>
                                    <Input
                                        {...register(
                                            `reviews.${index}.authorRole`,
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label>Avatar File ID</Label>
                                    <Input
                                        {...register(
                                            `reviews.${index}.avatarFileId`,
                                        )}
                                    />
                                </div>
                                <input
                                    type='hidden'
                                    {...register(`reviews.${index}.order`)}
                                    value={index}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Next Steps */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Next Steps</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendNextStep({
                                    content: '',
                                    order: nextStepFields.length,
                                })
                            }
                        >
                            + Add Next Step
                        </Button>
                    </div>
                    {nextStepFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-3 flex items-start gap-3'
                        >
                            <div className='flex-1'>
                                <Input
                                    {...register(`nextSteps.${index}.content`)}
                                    placeholder='Next step description'
                                />
                                {errors.nextSteps?.[index]?.content && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() => removeNextStep(index)}
                            >
                                Remove
                            </Button>
                            <input
                                type='hidden'
                                {...register(`nextSteps.${index}.order`)}
                                value={index}
                            />
                        </div>
                    ))}
                </div>

                {/* Publish */}
                <div className='flex items-center gap-2'>
                    <input
                        type='checkbox'
                        id='publish'
                        {...register('publish')}
                        className='h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary'
                    />
                    <Label htmlFor='publish'>Publish project</Label>
                </div>

                {/* Archive */}
                {projectStatus === 'published' && (
                    <div className='flex items-center gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            disabled={archiving}
                            onClick={async () => {
                                if (!projectId) return;
                                setArchiving(true);
                                try {
                                    await archiveProject(projectId);
                                    setProjectStatus('archived');
                                } finally {
                                    setArchiving(false);
                                }
                            }}
                        >
                            {archiving ? 'Архивация...' : 'В архив'}
                        </Button>
                    </div>
                )}

                {/* Reserved helper text space (no layout shift) */}
                <div className='min-h-[1.5rem]'>
                    {error && (
                        <p className='text-body-sm text-error'>{error}</p>
                    )}
                    {previewUrl && (
                        <p className='text-body-sm text-primary'>
                            Published!{' '}
                            <Link
                                href={previewUrl}
                                className='underline hover:opacity-80'
                            >
                                View live preview
                            </Link>
                        </p>
                    )}
                </div>

                <div className='flex justify-between gap-3 pt-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/showcase`,
                            )
                        }
                    >
                        ← Back
                    </Button>
                    <div className='flex gap-3'>
                        <Button type='submit' disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
}
