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
import Title from '@/components/ui/Title';
import ImageUploaderField from '@/components/ImageUploaderField';
import {
    updateProjectMeta,
    getCategories,
    getProjectMeta,
} from '@/lib/actions/projects';
import { slugify } from '@/lib/utils/slug';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().optional().or(z.literal('')),
    teaser: z.string().max(200).optional().or(z.literal('')),
    client: z.string().optional().or(z.literal('')),
    year: z.any().optional(),
    duration: z.string().optional().or(z.literal('')),
    myRole: z.string().optional().or(z.literal('')),
    constraints: z.string().optional().or(z.literal('')),
    devices: z.string().optional().or(z.literal('')),
    tags: z.string().optional().or(z.literal('')),
    coverFileId: z.string().optional().or(z.literal('')),
    figmaPrototypeUrl: z.string().url().optional().or(z.literal('')),
    webPrototypeUrl: z.string().url().optional().or(z.literal('')),
    categoryIds: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

type Category = {
    id: string;
    name: string;
    slug: string;
    order: number;
};

export default function GeneralPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [slugTouched, setSlugTouched] = useState(false);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]));
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            slug: '',
            teaser: '',
            client: '',
            year: '',
            duration: '',
            myRole: '',
            constraints: '',
            devices: '',
            tags: '',
            coverFileId: '',
            figmaPrototypeUrl: '',
            webPrototypeUrl: '',
            categoryIds: [],
        },
    });

    useEffect(() => {
        if (!projectId) return;
        getProjectMeta(projectId)
            .then((meta) => {
                if (meta.slug) setSlugTouched(true);
                reset({
                    title: meta.title ?? '',
                    slug: meta.slug ?? '',
                    teaser: meta.teaser ?? '',
                    client: meta.client ?? '',
                    year: meta.year ? String(meta.year) : '',
                    duration: meta.duration ?? '',
                    myRole: meta.myRole ?? '',
                    constraints: meta.constraints ?? '',
                    devices: meta.devices ?? '',
                    tags: meta.tags ?? '',
                    coverFileId: meta.coverFileId ?? '',
                    figmaPrototypeUrl: meta.figmaPrototypeUrl ?? '',
                    webPrototypeUrl: meta.webPrototypeUrl ?? '',
                    categoryIds: meta.categoryIds ?? [],
                });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const selectedCategoryIds = watch('categoryIds') ?? [];
    const titleValue = watch('title');

    // Auto-fill slug from title until the user manually edits it
    useEffect(() => {
        if (!slugTouched && titleValue) {
            setValue('slug', slugify(titleValue));
        }
    }, [titleValue, slugTouched, setValue]);

    const toggleCategory = (categoryId: string) => {
        const current = selectedCategoryIds;
        const next = current.includes(categoryId)
            ? current.filter((id) => id !== categoryId)
            : [...current, categoryId];
        setValue('categoryIds', next);
    };

    const onSubmit = async (data: FormData) => {
        if (!projectId) return;
        setSaving(true);
        setError(null);
        try {
            await updateProjectMeta(projectId, {
                ...data,
                teaser: data.teaser || undefined,
                client: data.client || undefined,
                year: data.year ? parseInt(data.year, 10) : undefined,
                duration: data.duration || undefined,
                myRole: data.myRole || undefined,
                constraints: data.constraints || undefined,
                devices: data.devices || undefined,
                tags: data.tags || undefined,
                coverFileId: data.coverFileId || null,
                figmaPrototypeUrl: data.figmaPrototypeUrl || undefined,
                webPrototypeUrl: data.webPrototypeUrl || undefined,
                categoryIds: data.categoryIds ?? [],
            });
            router.push(`/admin/projects/${projectId}/edit/problem`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <Title className='mb-6'>General (Meta)</Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <Label htmlFor='title'>Title *</Label>
                    <Input id='title' {...register('title')} />
                    {errors.title && (
                        <p className='mt-1 text-body-sm text-error'>
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor='slug'>Slug</Label>
                    <Input
                        id='slug'
                        {...register('slug')}
                        onChange={(e) => {
                            setSlugTouched(true);
                            register('slug').onChange(e);
                        }}
                    />
                    {errors.slug && (
                        <p className='mt-1 text-body-sm text-error'>
                            {errors.slug.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor='teaser'>Teaser (max 200)</Label>
                    <textarea
                        id='teaser'
                        {...register('teaser')}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                        rows={3}
                        maxLength={200}
                    />
                </div>

                <div>
                    <Label htmlFor='client'>Client</Label>
                    <Input id='client' {...register('client')} />
                </div>

                <div>
                    <Label htmlFor='year'>Year</Label>
                    <Input id='year' type='number' {...register('year')} />
                </div>

                <div>
                    <Label htmlFor='duration'>Duration</Label>
                    <Input id='duration' {...register('duration')} />
                </div>

                <div>
                    <Label htmlFor='myRole'>My Role</Label>
                    <Input id='myRole' {...register('myRole')} />
                </div>

                <div>
                    <Label htmlFor='constraints'>Constraints</Label>
                    <Input id='constraints' {...register('constraints')} />
                </div>

                <div>
                    <Label htmlFor='devices'>Devices</Label>
                    <Input id='devices' {...register('devices')} />
                </div>

                <div>
                    <Label htmlFor='tags'>Tags (comma-separated)</Label>
                    <Input id='tags' {...register('tags')} />
                </div>

                <div>
                    <Label>Cover Image</Label>
                    <ImageUploaderField
                        value={watch('coverFileId') || null}
                        onChange={(fileId) =>
                            setValue('coverFileId', fileId ?? '')
                        }
                        aspectRatio={16 / 9}
                    />
                </div>

                <div>
                    <Label>Categories</Label>
                    {categories.length === 0 ? (
                        <p className='text-body-sm text-on-surface-variant'>
                            No categories available
                        </p>
                    ) : (
                        <div className='flex flex-wrap gap-2'>
                            {categories.map((cat) => {
                                const selected = selectedCategoryIds.includes(
                                    cat.id,
                                );
                                return (
                                    <button
                                        key={cat.id}
                                        type='button'
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-md transition-colors ${
                                            selected
                                                ? 'border-primary bg-primary-container text-on-primary-container'
                                                : 'border-outline-variant text-on-surface-variant hover:border-outline'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor='figmaPrototypeUrl'>
                        Figma Prototype URL
                    </Label>
                    <Input
                        id='figmaPrototypeUrl'
                        type='url'
                        {...register('figmaPrototypeUrl')}
                    />
                </div>

                <div>
                    <Label htmlFor='webPrototypeUrl'>Web Prototype URL</Label>
                    <Input
                        id='webPrototypeUrl'
                        type='url'
                        {...register('webPrototypeUrl')}
                    />
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='flex justify-end gap-3 pt-4'>
                    <Button type='submit' disabled={saving}>
                        {saving ? 'Saving...' : 'Save & Next →'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
