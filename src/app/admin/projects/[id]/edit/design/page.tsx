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
import ColorRolePicker from '@/components/ColorRolePicker';
import { cn } from '@/lib/utils';
import {
    updateProjectDesign,
    getProjectDesign,
    replaceProjectAssetsByType,
    getProjectAssetsByType,
} from '@/lib/actions/projects';

const wireframeSchema = z.object({
    id: z.string().optional(),
    fileId: z.string().optional().or(z.literal('')),
    caption: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const formSchema = z.object({
    visualDirection: z.string().optional().or(z.literal('')),
    displayFont: z.string().optional().or(z.literal('')),
    displayFontSpec: z.string().optional().or(z.literal('')),
    bodyFont: z.string().optional().or(z.literal('')),
    bodyFontSpec: z.string().optional().or(z.literal('')),
    designApproach: z.string().optional().or(z.literal('')),
    // Кастомные заголовки секций на кейс-странице (D-009)
    designProcessTitle: z.string().optional().or(z.literal('')),
    designSystemTitle: z.string().optional().or(z.literal('')),
    // Wireframe-ассеты — хранятся в projectAssets (тип 'wireframe'),
    // редактируются здесь, чтобы секция «Design Process» на кейс-странице
    // показывала подход + эскизы вместе.
    wireframe: z.array(wireframeSchema),
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
    const [saved, markSaved] = useSavedFlag();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    const { register, handleSubmit, control, setValue, watch } =
        useForm<FormData>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                visualDirection: '',
                displayFont: '',
                displayFontSpec: '',
                bodyFont: '',
                bodyFontSpec: '',
                designApproach: '',
                designProcessTitle: '',
                designSystemTitle: '',
                wireframe: [],
            },
        });

    const {
        fields: wireframeFields,
        append: appendWireframe,
        remove: removeWireframe,
    } = useFieldArray({ control, name: 'wireframe' });

    useEffect(() => {
        if (!projectId) return;
        getProjectDesign(projectId)
            .then((d) => {
                setValue('visualDirection', d?.visualDirection ?? '');
                setValue('displayFont', d?.displayFont ?? '');
                setValue('displayFontSpec', d?.displayFontSpec ?? '');
                setValue('bodyFont', d?.bodyFont ?? '');
                setValue('bodyFontSpec', d?.bodyFontSpec ?? '');
                setValue('designApproach', d?.designApproach ?? '');
                setValue(
                    'designProcessTitle',
                    d?.designProcessTitle ?? '',
                );
                setValue('designSystemTitle', d?.designSystemTitle ?? '');
            })
            .catch(() => {});
    }, [projectId, setValue]);

    useEffect(() => {
        if (!projectId) return;
        getProjectAssetsByType(projectId, 'wireframe').then((rows) => {
            setValue(
                'wireframe',
                (rows ?? []).map((r, i) => ({
                    id: r.id,
                    fileId: r.fileId ?? '',
                    caption: r.caption ?? '',
                    order: r.order ?? i,
                })),
            );
        });
    }, [projectId, setValue]);

    const submitData = async (data: FormData): Promise<boolean> => {
        if (!projectId) return false;
        setSaving(true);
        setError(null);
        try {
            await updateProjectDesign(projectId, {
                visualDirection: data.visualDirection || undefined,
                displayFont: data.displayFont || undefined,
                displayFontSpec: data.displayFontSpec || undefined,
                bodyFont: data.bodyFont || undefined,
                bodyFontSpec: data.bodyFontSpec || undefined,
                designApproach: data.designApproach || undefined,
                designProcessTitle: data.designProcessTitle || undefined,
                designSystemTitle: data.designSystemTitle || undefined,
            });
            // Wireframe-ассеты хранятся отдельно (projectAssets, тип 'wireframe')
            await replaceProjectAssetsByType(
                projectId,
                'wireframe',
                data.wireframe
                    .filter((a) => a.fileId)
                    .map((a, i) => ({
                        id: a.id,
                        fileId: a.fileId!,
                        caption: a.caption,
                        order: i,
                    })),
            );
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
            router.push(`/admin/projects/${projectId}/edit/gallery`);
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
                Design
            </Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {/* Кастомные заголовки секций (D-009): пусто → дефолты
                    «From blank page to structure» / «Visual language & token system» */}
                <div className='grid gap-4 sm:grid-cols-2'>
                    <div>
                        <Label htmlFor='designProcessTitle'>
                            Заголовок «Design Process» (необязательно)
                        </Label>
                        <input
                            id='designProcessTitle'
                            {...register('designProcessTitle')}
                            placeholder='From blank page to structure'
                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        />
                    </div>
                    <div>
                        <Label htmlFor='designSystemTitle'>
                            Заголовок «Design System» (необязательно)
                        </Label>
                        <input
                            id='designSystemTitle'
                            {...register('designSystemTitle')}
                            placeholder='Visual language & token system'
                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor='visualDirection'>Visual Direction</Label>
                    <textarea
                        id='visualDirection'
                        {...register('visualDirection')}
                        placeholder={'Describe the visual style, mood, and aesthetic direction…\n- Calm and trustworthy\n- Rounded shapes, soft shadows'}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Переносы сохраняются; «- » — список с зелёным маркером;
                        **жирный**, *курсив*.
                    </p>
                </div>

                <div>
                    <Label htmlFor='displayFont'>Display Font</Label>
                    <Input
                        id='displayFont'
                        {...register('displayFont')}
                        placeholder='Inter'
                    />
                </div>

                <div>
                    <Label htmlFor='displayFontSpec'>
                        Display Font — характеристики
                    </Label>
                    <Input
                        id='displayFontSpec'
                        {...register('displayFontSpec')}
                        placeholder='Например: Bold 64/72, Black для заголовков, Italic для акцентов'
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Необязательно: вес, размеры, начертания — если не
                        следуете стандартам Material.
                    </p>
                </div>

                <div>
                    <Label htmlFor='bodyFont'>Body Font</Label>
                    <Input
                        id='bodyFont'
                        {...register('bodyFont')}
                        placeholder='Roboto'
                    />
                </div>

                <div>
                    <Label htmlFor='bodyFontSpec'>
                        Body Font — характеристики
                    </Label>
                    <Input
                        id='bodyFontSpec'
                        {...register('bodyFontSpec')}
                        placeholder='Например: Regular 16/24, Medium для выделений'
                    />
                </div>

                <div>
                    <Label htmlFor='designApproach'>Design Approach</Label>
                    <textarea
                        id='designApproach'
                        {...register('designApproach')}
                        placeholder='Explain the design methodology, principles, and key decisions…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                </div>

                {/* Wireframe — часть секции «Design Process» на кейс-странице:
                    эскизы идут вместе с описанием подхода. */}
                <div className='mt-8'>
                    <Title variant='headline-md'>Wireframe</Title>
                    {wireframeFields.length > 0 ? (
                        <div className='mt-3 space-y-3'>
                            {wireframeFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className='flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 border rounded-lg p-3'
                                >
                                    <div className='min-w-0 flex-1'>
                                        <ImageUploaderField
                                            compact
                                            value={
                                                watch(
                                                    `wireframe.${index}.fileId`,
                                                ) || null
                                            }
                                            onChange={(fileId) =>
                                                setValue(
                                                    `wireframe.${index}.fileId`,
                                                    fileId ?? '',
                                                )
                                            }
                                            aspectRatio={4 / 3}
                                        />
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <Input
                                            {...register(
                                                `wireframe.${index}.caption`,
                                            )}
                                            placeholder='Подпись к эскизу'
                                        />
                                    </div>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        className='shrink-0 self-start p-0 text-error sm:self-center'
                                        onClick={() => removeWireframe(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='mt-1 text-body-sm text-on-surface-variant'>
                            Wireframes not added yet.
                        </p>
                    )}
                    <div className='mt-3'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                                appendWireframe({
                                    fileId: '',
                                    caption: '',
                                    order: wireframeFields.length,
                                })
                            }
                        >
                            Add wireframe
                        </Button>
                    </div>
                </div>

                <div className='mt-12'>
                    <Title variant='headline-md'>Color Roles</Title>
                    {projectId ? (
                        <ColorRolePicker projectId={projectId} />
                    ) : (
                        <p className='text-body-sm text-on-surface-variant'>
                            Загрузка...
                        </p>
                    )}
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='sticky bottom-0 z-30 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8'>
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
