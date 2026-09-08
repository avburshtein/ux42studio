'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import PageTitle from '@/components/ui/PageTitle';
import {
    updateProfile,
    getOrCreateProfileId,
    getMyProfile,
} from '@/lib/actions/profile';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import FormBox from '@/components/ui/FormBox';
import ImageUploaderField from '@/components/ImageUploaderField';
import SocialLinksEditor from '@/components/SocialLinksEditor';
import MainPageContentEditor from '@/components/admin/MainPageContentEditor';
import { getMyMainPageContent } from '@/lib/actions/profile';
import { DEFAULT_MAIN_PAGE_CONTENT, type MainPageContent } from '@/lib/mainPageContent';

const formSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    headline: z.string().optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    slug: z.string().min(1, 'Slug is required'),
    ogImageFileId: z.string().optional().or(z.literal('')),
    faviconFileId: z.string().optional().or(z.literal('')),
});

// Разделы левого сайдбара (как в редакторе кейса портфолио)
const SECTIONS = [
    { id: 'profile', label: 'Profile' },
    { id: 'hero', label: '01 · Hero' },
    { id: 'portfolio', label: '02 · Portfolio Gallery' },
    { id: 'about', label: '03 · About' },
    { id: 'expertise', label: '04 · Expertise' },
    { id: 'cta', label: '05 · CTA (Get in Touch)' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

type FormData = z.infer<typeof formSchema>;

type SocialLink = {
    id: string;
    platform: string;
    title: string;
    url: string;
    order: number;
};

export default function ProfilePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);
    // Редактор соцсетей монтируем только после загрузки профиля: иначе он
    // фиксирует пустой initialLinks и игнорирует данные из БД (решение (26))
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [mainContent, setMainContent] = useState<MainPageContent | null>(null);
    // Активный раздел сайдбара
    const [section, setSection] = useState<SectionId>('profile');
    // Аватар/обложка редактируются в разделе Hero (MainPageContentEditor)
    const [initialFiles, setInitialFiles] = useState({
        avatar: '',
        cover: '',
        og: '',
        favicon: '',
    });

    const {
        register,
        handleSubmit,
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
            ogImageFileId: '',
            faviconFileId: '',
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
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
                    });
                    setInitialFiles({
                        avatar: profile.avatarFileId ?? '',
                        cover: profile.coverFileId ?? '',
                        og: profile.ogImageFileId ?? '',
                        favicon: profile.faviconFileId ?? '',
                    });
                    setSocialLinks(
                        (profile.socialLinks ?? []).map((link) => ({
                            id: link.id,
                            platform: link.platform,
                            title: link.title,
                            url: link.url,
                            order: link.order,
                        })),
                    );
                    const mpc = await getMyMainPageContent();
                    setMainContent(mpc ?? DEFAULT_MAIN_PAGE_CONTENT);
                }
            } finally {
                // Показываем редактор (даже при ошибке загрузки) — иначе
                // «Loading...» висит навсегда (решение (26))
                setProfileLoaded(true);
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
                ogImageFileId: data.ogImageFileId || null,
                faviconFileId: data.faviconFileId || null,
            });
            setSuccess(true);
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const slug = watch('slug');

    return (
        <main className=''>
            <div className='flex items-center justify-between gap-4'>
                <PageTitle className='mb-8'>Настройки профиля</PageTitle>
            </div>

            <div className='flex flex-col gap-8 md:flex-row'>
                {/* Сайдбар разделов — как в редакторе кейса (WizardSidebar) */}
                <aside className='w-full shrink-0 md:w-64'>
                    <nav className='md:sticky md:top-8'>
                        <ul className='flex gap-1 overflow-x-auto pb-2 md:flex-col md:space-y-1 md:overflow-visible md:pb-0'>
                            {SECTIONS.map((s) => (
                                <li key={s.id} className='shrink-0 md:shrink'>
                                    <button
                                        type='button'
                                        onClick={() => setSection(s.id)}
                                        className={`block w-full whitespace-nowrap rounded-md px-3 py-2 text-body-sm transition-colors cursor-pointer ${
                                            section === s.id
                                                ? 'bg-primary-container text-on-primary-container font-medium'
                                                : 'text-on-surface-variant hover:bg-surface-variant/50'
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {slug && (
                            <div className='mt-8 hidden border-t border-outline-variant pt-4 md:block'>
                                <Link
                                    href={`/u/${slug}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-1 text-body-sm text-primary transition-colors hover:text-primary-variant'
                                >
                                    <Eye />{' '}
                                    <span className='font-medium'>
                                        Просмотр страницы
                                    </span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </aside>

                <div className='min-w-0 flex-1'>
                <div className={section === 'profile' ? '' : 'hidden'}>
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

                    {/* Change Password */}
                    <div className=''>
                        <Link
                            href='/admin/profile/password'
                            className='text-body-sm text-primary hover:underline'
                        >
                            Перейти к смене пароля →
                        </Link>
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

                    {/* SEO: OG-обложка и фавикон страницы дизайнера */}
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label>OG Cover (1200×630)</Label>
                            <ImageUploaderField
                                value={watch('ogImageFileId') || null}
                                onChange={(fileId) =>
                                    setValue('ogImageFileId', fileId ?? '')
                                }
                                aspectRatio={1200 / 630}
                            />
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                Превью ссылки в соцсетях и мессенджерах.
                            </p>
                        </div>
                        <div>
                            <Label>Favicon (square)</Label>
                            <ImageUploaderField
                                value={watch('faviconFileId') || null}
                                onChange={(fileId) =>
                                    setValue('faviconFileId', fileId ?? '')
                                }
                                aspectRatio={1}
                            />
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                Иконка во вкладке браузера (32×32+).
                            </p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <Label>Social Links</Label>
                        {profileId && profileLoaded ? (
                            <SocialLinksEditor
                                profileId={profileId}
                                initialLinks={socialLinks}
                            />
                        ) : (
                            <p className='text-body-sm text-on-surface-variant'>
                                Loading...
                            </p>
                        )}
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
                </div>

                {/* Редактор контента главной страницы дизайнера (/u/[slug]) —
                    спека: Docs/specs/Main Page Admin Panel Fields.md.
                    Рендерится всегда (состояние форм сохраняется при
                    переключении разделов), видим только активный раздел. */}
                {profileId && mainContent && (
                    <div className={section === 'profile' ? 'hidden' : ''}>
                        <MainPageContentEditor
                            profileId={profileId}
                            initialContent={mainContent}
                            avatarFileId={initialFiles.avatar}
                            coverFileId={initialFiles.cover}
                            visibleSection={section}
                        />
                    </div>
                )}
                </div>
            </div>
        </main>
    );
}
