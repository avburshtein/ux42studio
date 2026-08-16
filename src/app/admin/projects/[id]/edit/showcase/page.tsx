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
import ImageUploaderField from '@/components/ImageUploaderField';
import {
    updateProjectShowcase,
    getProjectShowcase,
} from '@/lib/actions/projects';

const assetSchema = z.object({
    id: z.string().optional(),
    fileId: z.string().min(1, 'File ID is required'),
    assetType: z.enum(['moodboard', 'wireframe', 'final_gallery']),
    caption: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const comparisonSchema = z.object({
    id: z.string().optional(),
    featureName: z.string().min(1, 'Feature name is required'),
    beforeFileId: z.string().optional().or(z.literal('')),
    afterFileId: z.string().optional().or(z.literal('')),
    beforeText: z.string().optional().or(z.literal('')),
    afterText: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const projectItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    order: z.number().int(),
});

const formSchema = z.object({
    finalDescription: z.string().optional().or(z.literal('')),
    assets: z.array(assetSchema),
    comparisons: z.array(comparisonSchema),
    results: z.array(projectItemSchema),
    tools: z.array(projectItemSchema),
});

type FormData = z.infer<typeof formSchema>;

export default function ShowcasePage({
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

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            finalDescription: '',
            assets: [],
            comparisons: [],
            results: [],
            tools: [],
        },
    });

    const {
        fields: assetFields,
        append: appendAsset,
        remove: removeAsset,
    } = useFieldArray({ control, name: 'assets' });

    const {
        fields: comparisonFields,
        append: appendComparison,
        remove: removeComparison,
    } = useFieldArray({ control, name: 'comparisons' });

    const {
        fields: resultFields,
        append: appendResult,
        remove: removeResult,
    } = useFieldArray({ control, name: 'results' });

    const {
        fields: toolFields,
        append: appendTool,
        remove: removeTool,
    } = useFieldArray({ control, name: 'tools' });

    useEffect(() => {
        if (!projectId) return;
        getProjectShowcase(projectId)
            .then((s) => {
                reset({
                    finalDescription: s?.finalDescription ?? '',
                    assets: (s?.assets ?? []).map((a) => ({
                        ...a,
                        caption: a.caption ?? '',
                    })),
                    comparisons: (s?.comparisons ?? []).map((c) => ({
                        ...c,
                        beforeFileId: c.beforeFileId ?? '',
                        afterFileId: c.afterFileId ?? '',
                        beforeText: c.beforeText ?? '',
                        afterText: c.afterText ?? '',
                    })),
                    results: s?.results ?? [],
                    tools: s?.tools ?? [],
                });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectShowcase(projectId, {
                finalDescription: data.finalDescription || undefined,
                assets: data.assets.map((a) => ({
                    ...a,
                    caption: a.caption || undefined,
                })),
                comparisons: data.comparisons.map((c) => ({
                    ...c,
                    beforeFileId: c.beforeFileId || undefined,
                    afterFileId: c.afterFileId || undefined,
                    beforeText: c.beforeText || undefined,
                    afterText: c.afterText || undefined,
                })),
                results: data.results.map((r, i) => ({
                    ...r,
                    order: i,
                })),
                tools: data.tools.map((t, i) => ({
                    ...t,
                    order: i,
                })),
            });
            router.push(`/admin/projects/${projectId}/edit/review`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Title className='mb-6'>Showcase</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                    <Label htmlFor='finalDescription'>Final Description</Label>
                    <textarea
                        id='finalDescription'
                        {...register('finalDescription')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                {/* Gallery Assets */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Gallery Assets</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendAsset({
                                    fileId: '',
                                    assetType: 'final_gallery',
                                    caption: '',
                                    order: assetFields.length,
                                })
                            }
                        >
                            + Add Asset
                        </Button>
                    </div>
                    {assetFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-md border border-outline-variant p-4'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-sm text-on-surface'>
                                    Asset {index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removeAsset(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className='space-y-3'>
                                <div>
                                    <Label>Image *</Label>
                                    <ImageUploaderField
                                        value={
                                            (field as { fileId?: string })
                                                .fileId || null
                                        }
                                        onChange={(fileId) =>
                                            setValue(
                                                `assets.${index}.fileId`,
                                                fileId ?? '',
                                            )
                                        }
                                        aspectRatio={4 / 3}
                                    />
                                    {errors.assets?.[index]?.fileId && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Asset Type</Label>
                                    <select
                                        {...register(
                                            `assets.${index}.assetType`,
                                        )}
                                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                    >
                                        <option value='moodboard'>
                                            Moodboard
                                        </option>
                                        <option value='wireframe'>
                                            Wireframe
                                        </option>
                                        <option value='final_gallery'>
                                            Final Gallery
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Caption</Label>
                                    <Input
                                        {...register(`assets.${index}.caption`)}
                                    />
                                </div>
                                <input
                                    type='hidden'
                                    {...register(`assets.${index}.order`)}
                                    value={index}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Before/After Comparisons */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Before/After Comparisons</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendComparison({
                                    featureName: '',
                                    beforeFileId: '',
                                    afterFileId: '',
                                    beforeText: '',
                                    afterText: '',
                                    order: comparisonFields.length,
                                })
                            }
                        >
                            + Add Comparison
                        </Button>
                    </div>
                    {comparisonFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-md border border-outline-variant p-4'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-sm text-on-surface'>
                                    Comparison {index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removeComparison(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className='space-y-3'>
                                <div>
                                    <Label>Feature Name *</Label>
                                    <Input
                                        {...register(
                                            `comparisons.${index}.featureName`,
                                        )}
                                    />
                                    {errors.comparisons?.[index]
                                        ?.featureName && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <Label>Before Image</Label>
                                        <ImageUploaderField
                                            value={
                                                (
                                                    field as {
                                                        beforeFileId?: string;
                                                    }
                                                ).beforeFileId || null
                                            }
                                            onChange={(fileId) =>
                                                setValue(
                                                    `comparisons.${index}.beforeFileId`,
                                                    fileId ?? '',
                                                )
                                            }
                                            aspectRatio={16 / 10}
                                        />
                                    </div>
                                    <div>
                                        <Label>After Image</Label>
                                        <ImageUploaderField
                                            value={
                                                (
                                                    field as {
                                                        afterFileId?: string;
                                                    }
                                                ).afterFileId || null
                                            }
                                            onChange={(fileId) =>
                                                setValue(
                                                    `comparisons.${index}.afterFileId`,
                                                    fileId ?? '',
                                                )
                                            }
                                            aspectRatio={16 / 10}
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <Label>Before Text</Label>
                                        <textarea
                                            {...register(
                                                `comparisons.${index}.beforeText`,
                                            )}
                                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <Label>After Text</Label>
                                        <textarea
                                            {...register(
                                                `comparisons.${index}.afterText`,
                                            )}
                                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <input
                                    type='hidden'
                                    {...register(`comparisons.${index}.order`)}
                                    value={index}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Results */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Results</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendResult({
                                    content: '',
                                    order: resultFields.length,
                                })
                            }
                        >
                            + Add Result
                        </Button>
                    </div>
                    {resultFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-3 flex items-start gap-3'
                        >
                            <div className='flex-1'>
                                <Input
                                    {...register(`results.${index}.content`)}
                                    placeholder='Result description'
                                />
                                {errors.results?.[index]?.content && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() => removeResult(index)}
                            >
                                Remove
                            </Button>
                            <input
                                type='hidden'
                                {...register(`results.${index}.order`)}
                                value={index}
                            />
                        </div>
                    ))}
                </div>

                {/* Tools */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Tools</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendTool({
                                    content: '',
                                    order: toolFields.length,
                                })
                            }
                        >
                            + Add Tool
                        </Button>
                    </div>
                    {toolFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-3 flex items-start gap-3'
                        >
                            <div className='flex-1'>
                                <Input
                                    {...register(`tools.${index}.content`)}
                                    placeholder='Tool name'
                                />
                                {errors.tools?.[index]?.content && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() => removeTool(index)}
                            >
                                Remove
                            </Button>
                            <input
                                type='hidden'
                                {...register(`tools.${index}.order`)}
                                value={index}
                            />
                        </div>
                    ))}
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='flex justify-between gap-3 pt-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/design`,
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
        </div>
    );
}
