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
import PageTitle from '@/components/ui/PageTitle';
import {
    updateProfile,
    getOrCreateProfileId,
    getMyProfile,
} from '@/lib/actions/profile';
import Link from 'next/link';
import FormBox from '@/components/ui/FormBox';
import ImageUploaderField from '@/components/ImageUploaderField';

const socialLinkSchema = z.object({
    id: z.string().optional(),
    platform: z.enum(['github', 'behance', 'dribbble', 'telegram', 'custom']),
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Must be a valid URL'),
    order: z.number().int(),
});

const formSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    headline: z.string().optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    slug: z.string().min(1, 'Slug is required'),
    avatarFileId: z.string().optional().or(z.literal('')),
    coverFileId: z.string().optional().or(z.literal('')),
    socialLinks: z.array(socialLinkSchema),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            headline: '',
            bio: '',
            location: '',
            website: '',
            slug: '',
            avatarFileId: '',
            coverFileId: '',
            socialLinks: [],
        },
    });

    const {
        fields: linkFields,
        append: appendLink,
        remove: removeLink,
    } = useFieldArray({ control, name: 'socialLinks' });

    useEffect(() => {
        const fetchProfile = async () => {
            const id = await getOrCreateProfileId();
            setProfileId(id);
            if (!id) return;

            const profile = await getMyProfile();
            if (profile) {
                reset({
                    fullName: profile.fullName,
                    headline: profile.headline ?? '',
                    bio: profile.bio ?? '',
                    location: profile.location ?? '',
                    website: profile.website ?? '',
                    slug: profile.slug,
                    avatarFileId: profile.avatarFileId ?? '',
                    coverFileId: profile.coverFileId ?? '',
                    socialLinks: profile.socialLinks.map((link) => ({
                        id: link.id,
                        platform:
                            link.platform as FormData['socialLinks'][number]['platform'],
                        title: link.title,
                        url: link.url,
                        order: link.order,
                    })),
                });
            }
        };
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            const id = profileId ?? (await getOrCreateProfileId());
            if (!id) {
                setError('Profile not found');
                return;
            }
            await updateProfile(id, {
                ...data,
                headline: data.headline || undefined,
                bio: data.bio || undefined,
                location: data.location || undefined,
                website: data.website || undefined,
                avatarFileId: data.avatarFileId || undefined,
                coverFileId: data.coverFileId || undefined,
            });
            setSuccess(true);
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className=''>
            <div className='flex items-center justify-between gap-4'>
                <PageTitle className='mb-8'>Настройки профиля</PageTitle>
                {profileId && (
                    <Link
                        href='/admin'
                        className='text-body-sm text-primary hover:underline'
                    >
                        Дашборд
                    </Link>
                )}
            </div>

            <FormBox className=''>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <Label htmlFor='fullName'>Full Name *</Label>
                        <Input id='fullName' {...register('fullName')} />
                        {errors.fullName && (
                            <p className='mt-1 text-body-sm text-error'>
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor='slug'>Slug *</Label>
                        <Input id='slug' {...register('slug')} />
                        {errors.slug && (
                            <p className='mt-1 text-body-sm text-error'>
                                {errors.slug.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor='headline'>Headline</Label>
                        <Input id='headline' {...register('headline')} />
                    </div>

                    <div>
                        <Label htmlFor='bio'>Bio</Label>
                        <textarea
                            id='bio'
                            {...register('bio')}
                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor='location'>Location</Label>
                        <Input id='location' {...register('location')} />
                    </div>

                    <div>
                        <Label htmlFor='website'>Website</Label>
                        <Input
                            id='website'
                            type='url'
                            {...register('website')}
                        />
                    </div>

                    <div>
                        <Label>Avatar</Label>
                        <ImageUploaderField
                            value={watch('avatarFileId') || null}
                            onChange={(fileId) =>
                                setValue('avatarFileId', fileId ?? '')
                            }
                            aspectRatio={1}
                        />
                    </div>

                    <div>
                        <Label>Cover</Label>
                        <ImageUploaderField
                            value={watch('coverFileId') || null}
                            onChange={(fileId) =>
                                setValue('coverFileId', fileId ?? '')
                            }
                            aspectRatio={16 / 5}
                        />
                    </div>

                    {/* Social Links */}
                    <div>
                        <div className='mb-3 flex items-center justify-between'>
                            <Label>Social Links</Label>
                            <Button
                                type='button'
                                variant='ghost'
                                onClick={() =>
                                    appendLink({
                                        platform: 'custom',
                                        title: '',
                                        url: '',
                                        order: linkFields.length,
                                    })
                                }
                            >
                                + Add Link
                            </Button>
                        </div>
                        {linkFields.map((field, index) => (
                            <div
                                key={field.id}
                                className='mb-4 rounded-md border border-outline-variant p-4'
                            >
                                <div className='mb-3 flex items-center justify-between'>
                                    <span className='text-title-sm text-on-surface'>
                                        Link {index + 1}
                                    </span>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        onClick={() => removeLink(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                <div className='space-y-3'>
                                    <div>
                                        <Label>Platform</Label>
                                        <select
                                            {...register(
                                                `socialLinks.${index}.platform`,
                                            )}
                                            className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary'
                                        >
                                            <option value='github'>
                                                GitHub
                                            </option>
                                            <option value='behance'>
                                                Behance
                                            </option>
                                            <option value='dribbble'>
                                                Dribbble
                                            </option>
                                            <option value='telegram'>
                                                Telegram
                                            </option>
                                            <option value='custom'>
                                                Custom
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Title *</Label>
                                        <Input
                                            {...register(
                                                `socialLinks.${index}.title`,
                                            )}
                                        />
                                        {errors.socialLinks?.[index]?.title && (
                                            <p className='mt-1 text-body-sm text-error'>
                                                Required
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>URL *</Label>
                                        <Input
                                            type='url'
                                            {...register(
                                                `socialLinks.${index}.url`,
                                            )}
                                        />
                                        {errors.socialLinks?.[index]?.url && (
                                            <p className='mt-1 text-body-sm text-error'>
                                                Must be a valid URL
                                            </p>
                                        )}
                                    </div>
                                    <input
                                        type='hidden'
                                        {...register(
                                            `socialLinks.${index}.order`,
                                        )}
                                        value={index}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className='text-body-sm text-error'>{error}</p>
                    )}
                    {success && (
                        <p className='text-body-sm text-primary'>
                            Profile saved successfully!
                        </p>
                    )}

                    <div className='flex justify-end gap-3 pt-4'>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => router.push('/admin')}
                        >
                            ← Back to Dashboard
                        </Button>
                        <Button type='submit' disabled={saving}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            </FormBox>
        </main>
    );
}
