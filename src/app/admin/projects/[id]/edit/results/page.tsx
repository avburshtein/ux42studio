'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import {
    updateProjectResults,
    getProjectShowcase,
} from '@/lib/actions/projects';

const projectItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
    order: z.number().int(),
});

const baCardSchema = z.object({
    id: z.string().optional(),
    featureName: z.string().min(1, 'Feature name is required'),
    beforeText: z.string().min(1, 'Before text is required'),
    afterText: z.string().min(1, 'After text is required'),
    order: z.number().int(),
});

const formSchema = z.object({
    results: z.array(projectItemSchema),
    tools: z.array(projectItemSchema),
    baCards: z.array(baCardSchema),
});

type FormData = z.infer<typeof formSchema>;

export default function ResultsPage({
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
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            results: [],
            tools: [],
            baCards: [],
        },
    });

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

    const {
        fields: baCardFields,
        append: appendBaCard,
        remove: removeBaCard,
    } = useFieldArray({ control, name: 'baCards' });

    useEffect(() => {
        if (!projectId) return;
        getProjectShowcase(projectId)
            .then((s) => {
                reset({
                    results: s?.results ?? [],
                    tools: s?.tools ?? [],
                    baCards: s?.baCards ?? [],
                });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectResults(projectId, {
                results: data.results.map((r, i) => ({
                    ...r,
                    order: i,
                })),
                tools: data.tools.map((t, i) => ({
                    ...t,
                    order: i,
                })),
                baCards: data.baCards.map((c, i) => ({
                    ...c,
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
            <Title className='mb-6'>Results</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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

                {/* Before/After Cards */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Before/After Cards</Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                appendBaCard({
                                    featureName: '',
                                    beforeText: '',
                                    afterText: '',
                                    order: baCardFields.length,
                                })
                            }
                        >
                            + Add Card
                        </Button>
                    </div>
                    {baCardFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-lg border border-outline-variant bg-surface p-4 space-y-3'
                        >
                            <div className='flex items-center justify-between'>
                                <span className='text-label-sm text-on-surface-variant'>
                                    Card #{index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removeBaCard(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div>
                                <Input
                                    {...register(
                                        `baCards.${index}.featureName`,
                                    )}
                                    placeholder='Feature name'
                                />
                                {errors.baCards?.[index]?.featureName && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register(`baCards.${index}.beforeText`)}
                                    placeholder='Before text'
                                />
                                {errors.baCards?.[index]?.beforeText && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register(`baCards.${index}.afterText`)}
                                    placeholder='After text'
                                />
                                {errors.baCards?.[index]?.afterText && (
                                    <p className='mt-1 text-body-sm text-error'>
                                        Required
                                    </p>
                                )}
                            </div>
                            <input
                                type='hidden'
                                {...register(`baCards.${index}.order`)}
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
                                `/admin/projects/${projectId}/edit/showcase`,
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
