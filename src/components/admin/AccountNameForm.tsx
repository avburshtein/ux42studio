'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Field from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import {
    getMyProfile,
    getOrCreateProfileId,
    updateProfile,
} from '@/lib/actions/profile';

const formSchema = z.object({
    fullName: z.string().min(1, 'nameForm.zod'),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Имя и фамилия владельца профиля (раздел «Аккаунт» в /admin/settings).
 *
 * Отдельно от остальных полей профиля (заголовок, био, город, сайт,
 * ссылки) — те описывают публичную страницу и живут в разделе
 * «Брендинг и SEO» на /admin/profile. Имя принадлежит владельцу, поэтому
 * остаётся в настройках аккаунта.
 */
export default function AccountNameForm() {
    const { t } = useAdminLang();
    const [profileId, setProfileId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { fullName: '' },
    });

    useEffect(() => {
        const load = async () => {
            try {
                const id = await getOrCreateProfileId();
                setProfileId(id);
                if (!id) return;
                const profile = await getMyProfile();
                if (profile) reset({ fullName: profile.fullName });
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
        try {
            const id = profileId ?? (await getOrCreateProfileId());
            if (!id) {
                setError(t('nameForm.notFound'));
                return;
            }
            await updateProfile(id, { fullName: data.fullName });
            setSaved(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : t('common.saveFailed'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className='p-6'>
            <h2 className='text-title-md text-on-surface'>{t('nameForm.title')}</h2>
            <p className='mt-1 text-body-sm text-on-surface-variant'>
                {t('nameForm.desc')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className='mt-6'>
                <Field
                    id='fullName'
                    label={t('nameForm.label')}
                    error={
                        errors.fullName?.message
                            ? t(errors.fullName.message)
                            : undefined
                    }
                    hint={t('nameForm.hint')}
                    className='max-w-sm'
                >
                    <Input
                        id='fullName'
                        autoComplete='name'
                        disabled={!loaded}
                        {...register('fullName')}
                    />
                </Field>

                {error && (
                    <p role='alert' className='text-body-sm text-error'>
                        {error}
                    </p>
                )}

                {/* Панель сохранения по образцу WizardSaveBar (§3.6). */}
                <div className='mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4'>
                    <p role='status' className='text-body-sm text-primary'>
                        {saved ? t('common.saved') : ''}
                    </p>
                    <Button type='submit' disabled={saving || !loaded}>
                        {saving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
