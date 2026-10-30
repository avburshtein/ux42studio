'use client';

import { useAdminLang } from '@/components/admin/AdminLang';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PasswordInput } from '../ui/PasswordInput';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { changePassword } from '@/lib/actions/auth';

const formSchema = z
    .object({
        currentPassword: z.string().min(1, 'changePw.zodCurrent'),
        newPassword: z
            .string()
            .min(6, 'changePw.zodNew'),
        confirmPassword: z.string().min(1, 'changePw.zodConfirm'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'changePw.mismatch',
        path: ['confirmPassword'],
    });

type FormData = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
    const { t } = useAdminLang();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await changePassword(
                data.currentPassword,
                data.newPassword,
            );
            if (result.success) {
                setSuccess(true);
                reset();
            } else {
                setError(result.error ?? t('changePw.fail'));
            }
        } catch {
            setError(t('changePw.network'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
                <Label htmlFor='currentPassword'>{t('changePw.current')}</Label>
                <PasswordInput
                    id='currentPassword'
                    autoComplete='current-password'
                    {...register('currentPassword')}
                />
                {errors.currentPassword && (
                    <p className='mt-1 text-body-sm text-error'>
                        {errors.currentPassword.message && t(errors.currentPassword.message)}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor='newPassword'>{t('changePw.new')}</Label>
                <PasswordInput
                    id='newPassword'
                    autoComplete='new-password'
                    {...register('newPassword')}
                />
                {errors.newPassword && (
                    <p className='mt-1 text-body-sm text-error'>
                        {errors.newPassword.message && t(errors.newPassword.message)}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor='confirmPassword'>{t('changePw.confirm')}</Label>
                <PasswordInput
                    id='confirmPassword'
                    autoComplete='new-password'
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className='mt-1 text-body-sm text-error'>
                        {errors.confirmPassword.message && t(errors.confirmPassword.message)}
                    </p>
                )}
            </div>

            {error && <p className='text-body-sm text-error'>{error}</p>}
            {success && (
                <p className='text-body-sm text-primary'>
                    {t('changePw.success')}
                </p>
            )}

            <div className='flex justify-end'>
                <Button type='submit' disabled={saving}>
                    {saving ? t('changePw.saving') : t('changePw.submit')}
                </Button>
            </div>
        </form>
    );
}
