'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Field from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { getOrCreateProfileId, getMyProfile, updateProfileSlug } from '@/lib/actions/profile';

const formSchema = z.object({
    slug: z
        .string()
        .min(2, 'Адрес слишком короткий (минимум 2 символа)')
        .max(50, 'Адрес слишком длинный (максимум 50 символов)'),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Адрес публичной страницы (`/u/{slug}`) — отдельная карточка в разделе
 * «Брендинг и SEO» на /admin/profile. Вынесено из общей формы намеренно:
 * смена адреса редка и ответственна (ломает старые ссылки, влияет на главную
 * через STUDIO_PROFILE_SLUG). Пишется только через защищённый экшн
 * `updateProfileSlug` (нормализация + уникальность + инвалидация путей),
 * а не слепо через `updateProfile`.
 */
export default function ProfileSlugForm() {
    const [profileId, setProfileId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [studioWarning, setStudioWarning] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { slug: '' },
    });

    const slugValue = watch('slug');

    useEffect(() => {
        const load = async () => {
            try {
                const id = await getOrCreateProfileId();
                setProfileId(id);
                if (!id) return;
                const profile = await getMyProfile();
                if (profile) reset({ slug: profile.slug });
            } finally {
                setLoaded(true);
            }
        };
        load();
    }, [reset]);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        setError(null);
        setSaved(false);
        setStudioWarning(false);
        try {
            const id = profileId ?? (await getOrCreateProfileId());
            if (!id) {
                setError('Профиль не найден');
                return;
            }
            const res = await updateProfileSlug(id, data.slug);
            if (res.error) {
                setError(res.error);
                return;
            }
            if (res.slug) reset({ slug: res.slug });
            setStudioWarning(Boolean(res.wasStudioSlug));
            setSaved(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Не удалось сохранить');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className='p-6'>
            <h2 className='text-title-md text-on-surface'>Адрес страницы</h2>
            <p className='mt-1 text-body-sm text-on-surface-variant'>
                Часть URL после <span className='font-mono'>/u/</span>. Меняйте
                осторожно: старые ссылки перестанут работать.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className='mt-6'>
                <Field
                    id='slug'
                    label='Адрес страницы *'
                    error={errors.slug?.message}
                    hint='Латиница, цифры и дефисы. Пробелы и заглавные преобразуются автоматически.'
                    className='max-w-sm'
                >
                    <div className='flex items-center gap-2'>
                        <span className='text-body-sm text-on-surface-variant'>/u/</span>
                        <Input
                            id='slug'
                            autoComplete='off'
                            spellCheck={false}
                            disabled={!loaded}
                            {...register('slug')}
                        />
                    </div>
                </Field>

                {slugValue && (
                    <p className='text-body-sm text-on-surface-variant'>
                        Страница будет доступна по адресу:{' '}
                        <span className='font-mono text-primary'>/u/{slugValue}</span>
                    </p>
                )}

                {studioWarning && (
                    <p role='alert' className='mt-2 text-body-sm text-error'>
                        Этот профиль был привязан к главной (STUDIO_PROFILE_SLUG). Обновите
                        STUDIO_PROFILE_SLUG на новый адрес, иначе на главной пропадут кейсы.
                    </p>
                )}

                {error && (
                    <p role='alert' className='mt-2 text-body-sm text-error'>
                        {error}
                    </p>
                )}

                <div className='mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4'>
                    <p role='status' className='text-body-sm text-primary'>
                        {saved ? 'Сохранено' : ''}
                    </p>
                    <Button type='submit' disabled={saving || !loaded || !isDirty}>
                        {saving ? 'Сохраняем…' : 'Сохранить адрес'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
