'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useForm,
    useFieldArray,
    type UseFieldArrayReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import ImageUploaderField from '@/components/ImageUploaderField';
import {
    updateProjectGallery,
    getProjectGallery,
} from '@/lib/actions/projects';

const ASSET_TYPES = ['moodboard', 'wireframe', 'final_gallery'] as const;

const assetSchema = z.object({
    id: z.string().optional(),
    fileId: z.string().min(1, 'Image is required'),
    assetType: z.enum(ASSET_TYPES),
    caption: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const formSchema = z.object({
    moodboard: z.array(assetSchema),
    wireframe: z.array(assetSchema),
    final_gallery: z.array(assetSchema),
});

type FormData = z.infer<typeof formSchema>;
type AssetType = (typeof ASSET_TYPES)[number];

const SECTIONS: Array<{
    key: AssetType;
    label: string;
    placeholder: string;
}> = [
    { key: 'moodboard', label: 'Moodboard', placeholder: 'Moodboard asset' },
    { key: 'wireframe', label: 'Wireframe', placeholder: 'Wireframe asset' },
    {
        key: 'final_gallery',
        label: 'Final gallery',
        placeholder: 'Final gallery asset',
    },
];

type DefaultValues = {
    moodboard: AssetDraft[];
    wireframe: AssetDraft[];
    final_gallery: AssetDraft[];
};

type AssetDraft = z.infer<typeof assetSchema>;

export default function GalleryPage({
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
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            moodboard: [],
            wireframe: [],
            final_gallery: [],
        },
    });

    const moodboard = useFieldArray({ control, name: 'moodboard' });
    const wireframe = useFieldArray({ control, name: 'wireframe' });
    const finalGallery = useFieldArray({ control, name: 'final_gallery' });

    const fieldArrays: Record<
        AssetType,
        UseFieldArrayReturn<FormData, AssetType>
    > = {
        moodboard,
        wireframe,
        final_gallery: finalGallery,
    };

    useEffect(() => {
        if (!projectId) return;
        getProjectGallery(projectId)
            .then((s) => {
                const byType = (type: AssetType) =>
                    (s?.assets ?? [])
                        .filter((a) => a.assetType === type)
                        .map((a, index) => ({
                            id: a.id,
                            fileId: a.fileId,
                            assetType: type,
                            caption: a.caption ?? '',
                            order: index,
                        }));
                reset({
                    moodboard: byType('moodboard'),
                    wireframe: byType('wireframe'),
                    final_gallery: byType('final_gallery'),
                } satisfies DefaultValues);
            })
            .catch(() => {});
    }, [projectId, reset]);

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            const assets = [
                ...data.moodboard.map((a) => ({
                    ...a,
                    assetType: 'moodboard' as const,
                })),
                ...data.wireframe.map((a) => ({
                    ...a,
                    assetType: 'wireframe' as const,
                })),
                ...data.final_gallery.map((a) => ({
                    ...a,
                    assetType: 'final_gallery' as const,
                })),
            ].map((a, index) => ({
                ...a,
                caption: a.caption || undefined,
                order: index,
            }));

            await updateProjectGallery(projectId, { assets });
            router.push(`/admin/projects/${projectId}/edit/showcase`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const renderSection = (section: (typeof SECTIONS)[number]) => {
        const fa = fieldArrays[section.key];

        return (
            <div key={section.key}>
                <div className='mb-3 flex items-center justify-between'>
                    <Label>{section.label}</Label>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            fa.append({
                                fileId: '',
                                assetType: section.key,
                                caption: '',
                                order: fa.fields.length,
                            })
                        }
                    >
                        + Add Asset
                    </Button>
                </div>

                {fa.fields.map((field, index) => (
                    <div
                        key={field.id}
                        className='mb-3 flex items-center gap-3 rounded-md border border-outline-variant p-3'
                    >
                        <div className='min-w-0 flex-1'>
                            <ImageUploaderField
                                compact
                                value={
                                    watch(`${section.key}.${index}.fileId`) ||
                                    null
                                }
                                onChange={(fileId) =>
                                    setValue(
                                        `${section.key}.${index}.fileId`,
                                        fileId ?? '',
                                    )
                                }
                                aspectRatio={4 / 3}
                            />
                            {errors[section.key]?.[index]?.fileId && (
                                <p className='mt-1 text-body-sm text-error'>
                                    Required
                                </p>
                            )}
                        </div>

                        <div className='min-w-0 flex-1'>
                            <Input
                                {...register(`${section.key}.${index}.caption`)}
                                placeholder={section.placeholder}
                            />
                        </div>

                        <Button
                            type='button'
                            variant='ghost'
                            className='h-auto shrink-0 p-0 text-error'
                            onClick={() => fa.remove(index)}
                        >
                            Remove
                        </Button>

                        <input
                            type='hidden'
                            {...register(`${section.key}.${index}.order`)}
                            value={index}
                        />
                    </div>
                ))}

                {fa.fields.length === 0 && (
                    <p className='mb-3 text-body-sm text-on-surface-variant'>
                        No assets yet.
                    </p>
                )}
            </div>
        );
    };

    return (
        <div>
            <Title className='mb-6'>Gallery</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {SECTIONS.map(renderSection)}

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
                    </Button>{' '}
                </div>
            </form>
        </div>
    );
}
