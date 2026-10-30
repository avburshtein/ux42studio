'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
    updateProjectMeta,
    getCategories,
    getProjectMeta,
    createCategory,
} from '@/lib/actions/projects';
import { slugify } from '@/lib/utils/slug';

// Лимиты hero (фидбэк 2026-10-26): заголовок ≤2 строки на десктопе
// (~40 симв./строка при display-sm), teaser ≤1 строка (~92 симв. при
// body-lg на max-w-3xl). maxLength блокирует ввод сверх лимита,
// счётчик показывает остаток; zod не даст сохранить старые длинные значения.
const TITLE_MAX = 80;
const TEASER_MAX = 92;
// Остаток, при котором счётчик подсвечивается ошибкой
const COUNTER_WARN = 10;

const formSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(
            TITLE_MAX,
            `Max ${TITLE_MAX} characters (2 lines on the case page)`,
        ),
    slug: z.string().optional().or(z.literal('')),
    teaser: z
        .string()
        .max(
            TEASER_MAX,
            `Max ${TEASER_MAX} characters (1 line on the case page)`,
        )
        .optional()
        .or(z.literal('')),
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
    const { t } = useAdminLang();
    const [projectId, setProjectId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [saved, markSaved] = useSavedFlag();
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [slugTouched, setSlugTouched] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);

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
                }, { keepDirtyValues: true });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const selectedCategoryIds = watch('categoryIds') ?? [];
    const titleValue = watch('title');
    const teaserValue = watch('teaser');

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

    const handleAddCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        setAddingCategory(true);
        try {
            const created = await createCategory(name);
            setCategories((prev) => [...prev, created]);
            setValue('categoryIds', [...selectedCategoryIds, created.id]);
            setNewCategoryName('');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to add category');
        } finally {
            setAddingCategory(false);
        }
    };

    const submitData = async (data: FormData): Promise<boolean> => {
        if (!projectId) return false;
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
                // null (не undefined!): пустое поле должно ОЧИЩАТЬ ссылку —
                // иначе кнопка «View … prototype» остаётся на кейсе навсегда
                figmaPrototypeUrl: data.figmaPrototypeUrl || null,
                webPrototypeUrl: data.webPrototypeUrl || null,
                categoryIds: data.categoryIds ?? [],
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
            router.push(`/admin/projects/${projectId}/edit/problem`);
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
                General (Meta)
            </Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <Label htmlFor='title'>Title * (max {TITLE_MAX})</Label>
                    <textarea
                        id='title'
                        {...register('title')}
                        placeholder='My Awesome Project'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={2}
                        maxLength={TITLE_MAX}
                    />
                    <p
                        className={
                            TITLE_MAX - (titleValue?.length ?? 0) <=
                            COUNTER_WARN
                                ? 'mt-1 text-right text-body-sm text-error'
                                : 'mt-1 text-right text-body-sm text-on-surface-variant'
                        }
                        aria-live='polite'
                    >
                        {(titleValue?.length ?? 0)} / {TITLE_MAX} — fits 2
                        lines on the case page
                    </p>
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
                        placeholder='my-awesome-project'
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
                    <Label htmlFor='teaser'>
                        Teaser (max {TEASER_MAX})
                    </Label>
                    <textarea
                        id='teaser'
                        {...register('teaser')}
                        placeholder='A short teaser describing the project in 1–2 sentences…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={3}
                        maxLength={TEASER_MAX}
                    />
                    <p
                        className={
                            TEASER_MAX - (teaserValue?.length ?? 0) <=
                            COUNTER_WARN
                                ? 'mt-1 text-right text-body-sm text-error'
                                : 'mt-1 text-right text-body-sm text-on-surface-variant'
                        }
                        aria-live='polite'
                    >
                        {(teaserValue?.length ?? 0)} / {TEASER_MAX} — fits 1
                        line on the case page
                    </p>
                    {errors.teaser && (
                        <p className='mt-1 text-body-sm text-error'>
                            {errors.teaser.message}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor='client'>Client</Label>
                    <Input
                        id='client'
                        {...register('client')}
                        placeholder='Acme Inc.'
                    />
                </div>

                <div>
                    <Label htmlFor='year'>Year</Label>
                    <Input
                        id='year'
                        type='number'
                        {...register('year')}
                        placeholder='2025'
                    />
                </div>

                <div>
                    <Label htmlFor='duration'>Duration</Label>
                    <Input
                        id='duration'
                        {...register('duration')}
                        placeholder='3 months'
                    />
                </div>

                <div>
                    <Label htmlFor='myRole'>My Role</Label>
                    <Input
                        id='myRole'
                        {...register('myRole')}
                        placeholder='UX Designer, Frontend Developer'
                    />
                </div>

                <div>
                    <Label htmlFor='constraints'>Constraints</Label>
                    <Input
                        id='constraints'
                        {...register('constraints')}
                        placeholder='Budget, timeline, technical limitations…'
                    />
                </div>

                <div>
                    <Label htmlFor='devices'>Devices</Label>
                    <Input
                        id='devices'
                        {...register('devices')}
                        placeholder='iOS, Android, Web'
                    />
                </div>

                <div>
                    <Label htmlFor='tags'>Tags (comma-separated)</Label>
                    <Input
                        id='tags'
                        {...register('tags')}
                        placeholder='fintech, dashboard, mobile'
                    />
                </div>

                <div>
                    <Label>Cover Image</Label>
                    <ImageUploaderField
                        value={watch('coverFileId') || null}
                        onChange={(fileId) =>
                            setValue('coverFileId', fileId ?? '')
                        }
                        aspectRatio={16 / 9}
                        cropRatio={16 / 9}
                    />
                </div>

                <div>
                    <Label>Categories</Label>
                    {categories.length === 0 && (
                        <p className='text-body-sm text-on-surface-variant mb-2'>
                            No categories available
                        </p>
                    )}
                    <div className='flex flex-wrap gap-2 mb-3'>
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
                    <div className='flex gap-2'>
                        <Input
                            placeholder='New category name…'
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCategory();
                                }
                            }}
                        />
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleAddCategory}
                            disabled={addingCategory || !newCategoryName.trim()}
                        >
                            {addingCategory ? 'Adding…' : 'Add'}
                        </Button>
                    </div>
                </div>

                <div>
                    <Label htmlFor='figmaPrototypeUrl'>
                        Figma Prototype URL
                    </Label>
                    <Input
                        id='figmaPrototypeUrl'
                        type='url'
                        {...register('figmaPrototypeUrl')}
                        placeholder='https://www.figma.com/proto/…'
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        {t('wizard.figmaProtoHint')}
                    </p>
                </div>

                <div>
                    <Label htmlFor='webPrototypeUrl'>Web Prototype URL</Label>
                    <Input
                        id='webPrototypeUrl'
                        type='url'
                        {...register('webPrototypeUrl')}
                        placeholder='https://prototype.example.com'
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        {t('wizard.webProtoHint')}
                    </p>
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='sticky bottom-0 z-30 -mx-4 flex items-center justify-end gap-3 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8'>
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
