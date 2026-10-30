'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import WizardSaveBar, {
    useSavedFlag,
} from '@/components/admin/WizardSaveBar';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import ImageUploaderField from '@/components/ImageUploaderField';
import {
    updateProjectShowcase,
    getProjectShowcase,
} from '@/lib/actions/projects';
import SubsectionsEditor from '@/components/admin/SubsectionsEditor';

const comparisonSchema = z.object({
    id: z.string().optional(),
    featureName: z.string().min(1, 'Feature name is required'),
    beforeFileId: z.string().optional().or(z.literal('')),
    afterFileId: z.string().optional().or(z.literal('')),
    beforeText: z.string().optional().or(z.literal('')),
    afterText: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const formSchema = z.object({
    finalDescription: z.string().optional().or(z.literal('')),
    // Секция 05 «Testing & Iteration»: описание процесса тестирования —
    // секция видна при testingProcess и/или comparisons
    testingProcess: z.string().optional().or(z.literal('')),
    // Кастомные заголовки секций на кейс-странице (D-009)
    finalDesignTitle: z.string().optional().or(z.literal('')),
    testingTitle: z.string().optional().or(z.literal('')),
    comparisons: z.array(comparisonSchema),
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
    const [saved, markSaved] = useSavedFlag();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            finalDescription: '',
            testingProcess: '',
            finalDesignTitle: '',
            testingTitle: '',
            comparisons: [],
        },
    });

    const {
        fields: comparisonFields,
        append: prependComparison,
        remove: removeComparison,
    } = useFieldArray({ control, name: 'comparisons' });

    useEffect(() => {
        if (!projectId) return;
        getProjectShowcase(projectId)
            .then((s) => {
                reset({
                    finalDescription: s?.finalDescription ?? '',
                    testingProcess: s?.testingProcess ?? '',
                    finalDesignTitle: s?.finalDesignTitle ?? '',
                    testingTitle: s?.testingTitle ?? '',
                    comparisons: (s?.comparisons ?? []).map((c) => ({
                        ...c,
                        beforeFileId: c.beforeFileId ?? '',
                        afterFileId: c.afterFileId ?? '',
                        beforeText: c.beforeText ?? '',
                        afterText: c.afterText ?? '',
                    })),
                }, { keepDirtyValues: true });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const submitData = async (data: FormData): Promise<boolean> => {
        if (!projectId) return false;
        setSaving(true);
        setError(null);
        try {
            await updateProjectShowcase(projectId, {
                finalDescription: data.finalDescription || undefined,
                testingProcess: data.testingProcess || undefined,
                finalDesignTitle: data.finalDesignTitle || undefined,
                testingTitle: data.testingTitle || undefined,
                comparisons: data.comparisons.map((c) => ({
                    ...c,
                    beforeFileId: c.beforeFileId || undefined,
                    afterFileId: c.afterFileId || undefined,
                    beforeText: c.beforeText || undefined,
                    afterText: c.afterText || undefined,
                })),
            });
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (await submitData(data)) {
            router.push(`/admin/projects/${projectId}/edit/results`);
        }
    };

    const onSaveOnly = async (data: FormData) => {
        if (await submitData(data)) {
            markSaved();
        }
    };

    return (
        <div>
            <Title className='mb-6' tag='h1'>
                Showcase
            </Title>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-12'
            >
                {/* Кастомные заголовки секций (D-009): пусто → дефолты
                    «The Finished Product» / «What users taught me» */}
                <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                        <Label htmlFor='finalDesignTitle'>
                            Заголовок «Final Design» (необязательно)
                        </Label>
                        <input
                            id='finalDesignTitle'
                            {...register('finalDesignTitle')}
                            placeholder='The Finished Product'
                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        />
                    </div>
                    <div>
                        <Label htmlFor='testingTitle'>
                            Заголовок «Testing & Iteration» (необязательно)
                        </Label>
                        <input
                            id='testingTitle'
                            {...register('testingTitle')}
                            placeholder='What users taught me'
                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor='finalDescription'>Final Description</Label>
                    <textarea
                        id='finalDescription'
                        {...register('finalDescription')}
                        placeholder='Describe the final delivered solution and its impact…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Формат: [текст](ссылка) — ссылка, **жирный**,
                        *курсив*, переносы — новые абзацы.
                    </p>
                </div>

                {/* Testing & Iteration — секция 05 публичного кейса. Видна,
                    если заполнено это поле и/или есть comparisons. */}
                <div>
                    <Label htmlFor='testingProcess'>Testing Process</Label>
                    <textarea
                        id='testingProcess'
                        {...register('testingProcess')}
                        placeholder={'How you tested and iterated on the solution…\n- Usability tests with 5 users\n- Iterated on navigation based on findings'}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Необязательно. Переносы строк сохраняются; строки с
                        «- » становятся списком; [текст](ссылка) — ссылка;
                        **жирный**, *курсив*.
                    </p>
                </div>

                {/* Before/After Comparisons */}
                <div>
                    <div className='mb-3 flex items-center justify-between'>
                        <Title variant='headline-md'>
                            Before/After Comparisons
                        </Title>
                        <Label></Label>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() =>
                                prependComparison({
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
                            className='mb-4 rounded-md border border-outline-variant p-4 bg-surface-container-high'
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
                                        placeholder='Navigation redesign'
                                    />
                                    {errors.comparisons?.[index]
                                        ?.featureName && (
                                        <p className='mt-1 text-body-sm text-error'>
                                            Required
                                        </p>
                                    )}
                                </div>
                                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                    <div>
                                        <Label>Before Image</Label>
                                        <ImageUploaderField
                                            value={
                                                watch(
                                                    `comparisons.${index}.beforeFileId`,
                                                ) || null
                                            }
                                            onChange={(fileId) =>
                                                setValue(
                                                    `comparisons.${index}.beforeFileId`,
                                                    fileId ?? '',
                                                )
                                            }
                                            aspectRatio={4 / 3}
                                            cropRatio={4 / 3}
                                        />
                                    </div>
                                    <div>
                                        <Label>After Image</Label>
                                        <ImageUploaderField
                                            value={
                                                watch(
                                                    `comparisons.${index}.afterFileId`,
                                                ) || null
                                            }
                                            onChange={(fileId) =>
                                                setValue(
                                                    `comparisons.${index}.afterFileId`,
                                                    fileId ?? '',
                                                )
                                            }
                                            aspectRatio={4 / 3}
                                            cropRatio={4 / 3}
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                    <div>
                                        <Label>Before Text</Label>
                                        <textarea
                                            {...register(
                                                `comparisons.${index}.beforeText`,
                                            )}
                                            placeholder='Describe the state before the redesign…'
                                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <Label>After Text</Label>
                                        <textarea
                                            {...register(
                                                `comparisons.${index}.afterText`,
                                            )}
                                            placeholder='Describe the improvements after the redesign…'
                                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
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

                {/* D-011: подразделы секций Final Design / Testing */}
                {projectId && (
                    <div className='mt-12'>
                        <SubsectionsEditor
                            projectId={projectId}
                            sectionKeys={[
                                { key: 'finalDesign', label: 'Final Design' },
                                {
                                    key: 'testing',
                                    label: 'Testing & Iteration',
                                },
                            ]}
                        />
                    </div>
                )}

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='sticky bottom-0 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/gallery`,
                            )
                        }
                    >
                        ← Back
                    </Button>
                    <WizardSaveBar
                        saving={saving}
                        saved={saved}
                        onSave={handleSubmit(onSaveOnly)}
                    />
                </div>
            </form>
        </div>
    );
}
