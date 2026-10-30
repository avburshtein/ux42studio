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
    updateProjectReview,
    getProjectPreviewInfo,
    getProjectReview,
} from '@/lib/actions/projects';
import Link from 'next/link';
import SectionsVisibilityEditor from '@/components/admin/SectionsVisibilityEditor';
import { TldrShareButtons } from '@/components/admin/TldrShareButtons';

// Поля опциональны намеренно: добавленная, но ещё не заполненная строка
// не должна блокировать сохранение шага и публикацию кейса («гибкость в
// заполнении разделов»). Полностью пустые строки отфильтровываются в
// onSubmit перед отправкой.
const reviewItemSchema = z.object({
    id: z.string().optional(),
    text: z.string().optional().or(z.literal('')),
    authorName: z.string().optional().or(z.literal('')),
    authorRole: z.string().optional().or(z.literal('')),
    avatarFileId: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const projectItemSchema = z.object({
    id: z.string().optional(),
    content: z.string().optional().or(z.literal('')),
    order: z.number().int(),
});

const formSchema = z.object({
    keyTakeaway: z.string().optional().or(z.literal('')),
    // Кастомный заголовок секции на кейс-странице (D-009)
    reflectionTitle: z.string().optional().or(z.literal('')),
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
    const [saved, markSaved] = useSavedFlag();
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    // Раньше здесь был эффект getProjectStatus(projectId) -> setProjectStatus:
    // статус загружался, но нигде не рендерился. Удалено вместе с состоянием
    // и импортом archiveProject/getProjectStatus (мёртвый код).

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyTakeaway: '',
            reflectionTitle: '',
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
                    reflectionTitle: r?.reflectionTitle ?? '',
                    reviews: (r?.reviews ?? []).map((rev) => ({
                        ...rev,
                        authorRole: rev.authorRole ?? '',
                        avatarFileId: rev.avatarFileId ?? '',
                    })),
                    nextSteps: r?.nextSteps ?? [],
                    publish: false,
                }, { keepDirtyValues: true });
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
                reflectionTitle: data.reflectionTitle || undefined,
                // Пустые строки не отправляем: сгенерированные сервером
                // пустые отзывы/шаги не должны попадать в БД и на публикацию.
                reviews: data.reviews
                    .filter((r) => r.text?.trim() || r.authorName?.trim())
                    .map((r) => ({
                    ...r,
                    authorRole: r.authorRole || undefined,
                    avatarFileId: r.avatarFileId || undefined,
                })),
                nextSteps: data.nextSteps
                    .filter((n) => n.content?.trim())
                    .map((n, i) => ({
                    ...n,
                    order: i,
                })),
                publish: data.publish,
            });

            if (result && 'error' in result && result.error) {
                setError(result.error);
                return;
            }

            markSaved();
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
        <div>
            <Title className='mb-6' tag='h1'>
                Review & Publish
            </Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Кастомный заголовок секции (D-009): пусто → дефолт «What I learned» */}
                <div>
                    <Label htmlFor='reflectionTitle'>
                        Заголовок секции (необязательно)
                    </Label>
                    <input
                        id='reflectionTitle'
                        {...register('reflectionTitle')}
                        placeholder='What I learned'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                    />
                </div>

                <div>
                    <Label htmlFor='keyTakeaway'>Key Takeaway</Label>
                    <textarea
                        id='keyTakeaway'
                        {...register('keyTakeaway')}
                        placeholder='Summarise the main lesson or takeaway from this project…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Формат: [текст](ссылка) — ссылка, **жирный**,
                        *курсив*, переносы — новые абзацы.
                    </p>
                </div>

                {/* Reviews */}
                <div>
                    <div className='mb-3 flex items-center justify-between mt-12'>
                        <Title variant='headline-md'>Reviews</Title>
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
                            className='mb-4 rounded-md border border-outline-variant p-4 bg-surface-container-high'
                        >
                            <div className='mb-3 flex items-center justify-between'>
                                <span className='text-title-lg text-on-surface '>
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
                                        placeholder='What did the reviewer say about the project?'
                                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
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
                                        placeholder='John Smith'
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
                                        placeholder='Product Manager at Acme Inc.'
                                    />
                                </div>
                                <div>
                                    <Label>Avatar</Label>
                                    <ImageUploaderField
                                        value={
                                            (field as { avatarFileId?: string })
                                                .avatarFileId || null
                                        }
                                        onChange={(fileId) =>
                                            setValue(
                                                `reviews.${index}.avatarFileId`,
                                                fileId ?? '',
                                            )
                                        }
                                        aspectRatio={1}
                                        cropRatio={1}
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
                    <div className='mb-3 flex items-center justify-between mt-12'>
                        <Title variant='headline-md'>Next Steps</Title>
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
                                <textarea
                                    {...register(`nextSteps.${index}.content`)}
                                    placeholder='Next step description'
                                    className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                                    rows={2}
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

                {/* Section visibility on the public case page (автосейв) */}
                {projectId && <SectionsVisibilityEditor projectId={projectId} />}

                <div className='mt-12'></div>

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

                {/* Reserved helper text space (no layout shift) */}
                {(error || previewUrl) && (
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
                )}

                {/* TL;DR — короткая версия кейса для hiring manager.
                    Авто-генерируется из уже структурированных данных;
                    дизайнер только копирует ссылку. Решение (63).
                    Показываем только для опубликованных проектов (есть URL). */}
                {previewUrl && (
                    <div className='flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface-container-low p-4'>
                        <p className='text-label-md font-medium text-on-surface'>
                            Короткая версия (TL;DR)
                        </p>
                        <p className='text-body-sm text-on-surface-variant'>
                            Авто-сводка из метаданных кейса — для рекрутеров
                            и отклика на вакансию.
                        </p>
                        <div className='mt-1'>
                            <TldrShareButtons
                                shortUrl={`${previewUrl}/short`}
                                previewHref={`${previewUrl}/short`}
                            />
                        </div>
                    </div>
                )}

                <div className='sticky bottom-0 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/results`,
                            )
                        }
                    >
                        ← Back
                    </Button>
                    <div className='flex gap-3'>
                        <WizardSaveBar
                            saving={saving}
                            saved={saved}
                            onSave={handleSubmit(onSubmit)}
                            nextHidden
                            saveVariant='default'
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
