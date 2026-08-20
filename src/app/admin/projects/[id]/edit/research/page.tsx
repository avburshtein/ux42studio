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
    updateProjectResearch,
    getProjectResearch,
} from '@/lib/actions/projects';

const personaSchema = z.object({
    id: z.string().optional(),
    nameAndAge: z.string().min(1, 'Required'),
    avatarFileId: z.string().optional().or(z.literal('')),
    bio: z.string().min(1, 'Required'),
    painPoints: z.string().min(1, 'Required'),
});

const keyMetricSchema = z.object({
    id: z.string().optional(),
    value: z.string().min(1, 'Required'),
    description: z.string().min(1, 'Required'),
});

const formSchema = z.object({
    researchMethodology: z.string().optional().or(z.literal('')),
    userStory: z.string().optional().or(z.literal('')),
    personas: z.array(personaSchema).max(5),
    keyMetrics: z.array(keyMetricSchema).max(3),
});

type FormData = z.infer<typeof formSchema>;

export default function ResearchPage({
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
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            researchMethodology: '',
            userStory: '',
            personas: [],
            keyMetrics: [],
        },
    });

    const {
        fields: personaFields,
        append: appendPersona,
        remove: removePersona,
    } = useFieldArray({ control, name: 'personas' });

    const {
        fields: metricFields,
        append: appendMetric,
        remove: removeMetric,
    } = useFieldArray({ control, name: 'keyMetrics' });

    useEffect(() => {
        if (!projectId) return;
        getProjectResearch(projectId)
            .then((r) => {
                reset({
                    researchMethodology: r?.researchMethodology ?? '',
                    userStory: r?.userStory ?? '',
                    personas: (r?.personas ?? []).map((p) => ({
                        ...p,
                        avatarFileId: p.avatarFileId ?? undefined,
                    })),
                    keyMetrics: r?.keyMetrics ?? [],
                });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectResearch(projectId, {
                researchMethodology: data.researchMethodology || undefined,
                userStory: data.userStory || undefined,
                personas: data.personas.map((p) => ({
                    ...p,
                    avatarFileId: p.avatarFileId || undefined,
                })),
                keyMetrics: data.keyMetrics.map((m, i) => ({
                    ...m,
                    order: i,
                })),
            });
            router.push(`/admin/projects/${projectId}/edit/design`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Title className='mb-6'>Research</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div>
                    <Label htmlFor='researchMethodology'>
                        Research Methodology
                    </Label>
                    <textarea
                        id='researchMethodology'
                        {...register('researchMethodology')}
                        placeholder='e.g. User interviews, competitive analysis, surveys…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                <div>
                    <Label htmlFor='userStory'>User Story</Label>
                    <textarea
                        id='userStory'
                        {...register('userStory')}
                        placeholder='As a [user], I want to [action] so that [benefit]…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={4}
                    />
                </div>

                {/* Personas */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Personas (max 5)</Label>
                        {personaFields.length < 5 && (
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() =>
                                    appendPersona({
                                        nameAndAge: '',
                                        avatarFileId: '',
                                        bio: '',
                                        painPoints: '',
                                    })
                                }
                            >
                                + Add Persona
                            </Button>
                        )}
                    </div>
                    {personaFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-md border border-outline-variant p-4'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-sm text-on-surface'>
                                    Persona {index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removePersona(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className='space-y-3'>
                                <div>
                                    <Label>Name & Age *</Label>
                                    <Input
                                        {...register(
                                            `personas.${index}.nameAndAge`,
                                        )}
                                        placeholder='Anna, 34'
                                    />
                                    {errors.personas?.[index]?.nameAndAge && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Avatar</Label>
                                    <ImageUploaderField
                                        value={
                                            watch(
                                                `personas.${index}.avatarFileId`,
                                            ) || null
                                        }
                                        onChange={(fileId) =>
                                            setValue(
                                                `personas.${index}.avatarFileId`,
                                                fileId ?? '',
                                            )
                                        }
                                        aspectRatio={1}
                                    />
                                </div>
                                <div>
                                    <Label>Bio *</Label>
                                    <textarea
                                        {...register(`personas.${index}.bio`)}
                                        placeholder='Short bio describing background, occupation, and lifestyle…'
                                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                        rows={3}
                                    />
                                    {errors.personas?.[index]?.bio && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>User Scenario *</Label>
                                    <textarea
                                        {...register(
                                            `personas.${index}.painPoints`,
                                        )}
                                        placeholder='Describe a typical scenario: when, where, and why they use the product…'
                                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                        rows={3}
                                    />
                                    {errors.personas?.[index]?.painPoints && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Metrics */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Label>Key Metrics (max 3)</Label>
                        {metricFields.length < 3 && (
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() =>
                                    appendMetric({ value: '', description: '' })
                                }
                            >
                                + Add Metric
                            </Button>
                        )}
                    </div>
                    {metricFields.map((field, index) => (
                        <div
                            key={field.id}
                            className='mb-4 rounded-md border border-outline-variant p-4'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-sm text-on-surface'>
                                    Metric {index + 1}
                                </span>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    onClick={() => removeMetric(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className='space-y-3'>
                                <div>
                                    <Label>Value *</Label>
                                    <Input
                                        {...register(
                                            `keyMetrics.${index}.value`,
                                        )}
                                        placeholder='+30%'
                                    />
                                    {errors.keyMetrics?.[index]?.value && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Description *</Label>
                                    <Input
                                        {...register(
                                            `keyMetrics.${index}.description`,
                                        )}
                                        placeholder='Increase in user engagement'
                                    />
                                    {errors.keyMetrics?.[index]
                                        ?.description && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                            </div>
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
                                `/admin/projects/${projectId}/edit/problem`,
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
