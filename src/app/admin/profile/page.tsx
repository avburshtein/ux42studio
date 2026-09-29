'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Field from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import PageTitle from '@/components/ui/PageTitle';
import {
    updateProfile,
    getOrCreateProfileId,
    getMyProfile,
    getMyMainPageContent,
} from '@/lib/actions/profile';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import ImageUploaderField from '@/components/ImageUploaderField';
import SocialLinksEditor from '@/components/SocialLinksEditor';
import MainPageContentEditor from '@/components/admin/MainPageContentEditor';
import { DEFAULT_MAIN_PAGE_CONTENT, type MainPageContent } from '@/lib/mainPageContent';

// В разделе «Брендинг и SEO» живёт всё, что описывает публичную страницу:
// адрес, заголовок, био, город, сайт, ссылки и превью. Имя владельца и
// email — в /admin/settings (раздел «Настройки профиля»).
const formSchema = z.object({
    slug: z
        .string()
        .min(1, 'Slug обязателен')
        .regex(
            /^[a-z0-9-]+$/i,
            'Только латиница, цифры и дефис — например ivan-petrov',
        ),
    headline: z.string().optional().or(z.literal('')),
    bio: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    website: z
        .string()
        .url('Полный адрес, например https://ux42.studio')
        .optional()
        .or(z.literal('')),
    ogImageFileId: z.string().optional().or(z.literal('')),
    faviconFileId: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

type SocialLink = {
    id: string;
    platform: string;
    title: string;
    url: string;
    order: number;
};

// Разделы левого сайдбара (как в редакторе кейса портфолио)
const SECTIONS = [
    { id: 'seo', label: 'Брендинг и SEO' },
    { id: 'hero', label: '01 · Hero' },
    { id: 'portfolio', label: '02 · Portfolio Gallery' },
    { id: 'about', label: '03 · About' },
    { id: 'expertise', label: '04 · Expertise' },
    { id: 'cta', label: '05 · CTA (Get in Touch)' },
    { id: 'theme', label: '06 · Color Theme' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function ProfilePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);
    // Slug живёт в настройках (/admin/settings), но нужен здесь для ссылки
    // «Просмотр страницы» в сайдбаре.
    const [profileSlug, setProfileSlug] = useState('');
    // Пока профиль не загружен, форму показываем, но сохранять нельзя:
    // значения по умолчанию пустые, и сохранение затёрло бы OG-обложку.
    const [profileLoaded, setProfileLoaded] = useState(false);
    // Редактор ссылок монтируем только после загрузки профиля: иначе он
    // фиксирует пустой initialLinks и игнорирует данные из БД (решение (26))
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [mainContent, setMainContent] = useState<MainPageContent | null>(null);
    // Активный раздел сайдбара
    const [section, setSection] = useState<SectionId>('seo');
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
            slug: '',
            headline: '',
            bio: '',
            location: '',
            website: '',
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
                        slug: profile.slug,
                        headline: profile.headline ?? '',
                        bio: profile.bio ?? '',
                        location: profile.location ?? '',
                        website: profile.website ?? '',
                        ogImageFileId: profile.ogImageFileId ?? '',
                        faviconFileId: profile.faviconFileId ?? '',
                    });
                    setInitialFiles({
                        avatar: profile.avatarFileId ?? '',
                        cover: profile.coverFileId ?? '',
                        og: profile.ogImageFileId ?? '',
                        favicon: profile.faviconFileId ?? '',
                    });
                    setProfileSlug(profile.slug);
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
                setError('Профиль не найден');
                return;
            }
            await updateProfile(id, {
                slug: data.slug,
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

    return (
        <main className=''>
            {/* Тот же зазор между шапкой и содержимым, что в настройках
                профиля (mb-10) — раньше шапка стояла встык с формой. */}
            <header className='mb-10'>
                <PageTitle className='mb-2'>
                    Редактировать страницу сайта
                </PageTitle>
                <p className='text-body-sm text-on-surface-variant'>
                    Контент публичной страницы: обложка, блоки и оформление
                </p>
            </header>

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
                                        className={`block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-body-sm transition-colors cursor-pointer ${
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
                        {profileSlug && (
                            <div className='mt-4 border-t border-outline-variant pt-4'>
                                <Link
                                    href={`/u/${profileSlug}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    // C2: см. WizardSidebar — hover:text-primary-variant
                                    // заменён на state layer (opacity), токена в M3 нет.
                                    className='flex items-center gap-1 text-body-sm text-primary transition-opacity duration-150 ease-out hover:opacity-80'
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
                <div className={section === 'seo' ? '' : 'hidden'}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className='p-6'>
                            <h2 className='text-title-md text-on-surface'>
                                Брендинг и SEO
                            </h2>
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                Всё, что описывает вашу публичную страницу:
                                адрес, тексты, ссылки и превью. Имя владельца
                                и email — в «Настройках профиля».
                            </p>

                            <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2'>
                                <Field
                                    id='slug'
                                    label='Адрес страницы *'
                                    error={errors.slug?.message}
                                    hint='Это часть ссылки /u/ваш-slug'
                                >
                                    <div className='flex items-center gap-2'>
                                        <span className='shrink-0 text-body-sm text-on-surface-variant'>
                                            /u/
                                        </span>
                                        <Input
                                            id='slug'
                                            className='font-mono'
                                            disabled={!profileLoaded}
                                            {...register('slug')}
                                        />
                                    </div>
                                </Field>

                                <Field
                                    id='headline'
                                    label='Заголовок'
                                    error={errors.headline?.message}
                                    hint='Например: Product Designer'
                                >
                                    <Input
                                        id='headline'
                                        disabled={!profileLoaded}
                                        {...register('headline')}
                                    />
                                </Field>

                                <Field
                                    id='location'
                                    label='Город'
                                    error={errors.location?.message}
                                    hint='Можно указать страну или «удалённо»'
                                >
                                    <Input
                                        id='location'
                                        disabled={!profileLoaded}
                                        {...register('location')}
                                    />
                                </Field>

                                <Field
                                    id='website'
                                    label='Личный сайт'
                                    error={errors.website?.message}
                                >
                                    <Input
                                        id='website'
                                        type='url'
                                        placeholder='https://'
                                        disabled={!profileLoaded}
                                        {...register('website')}
                                    />
                                </Field>

                                <Field
                                    id='bio'
                                    label='О себе'
                                    error={errors.bio?.message}
                                    hint='Пустая строка между абзацами = новый абзац'
                                    className='md:col-span-2'
                                >
                                    <Textarea
                                        id='bio'
                                        rows={5}
                                        disabled={!profileLoaded}
                                        {...register('bio')}
                                    />
                                </Field>
                            </div>

                            {/* Ссылка профиля монтируется после загрузки
                                (решение (26)) и сохраняется сама. */}
                            <div className='mt-2 border-t border-outline-variant pt-6'>
                                <Label>Ссылки</Label>
                                {profileId && profileLoaded ? (
                                    <div className='mt-3'>
                                        <SocialLinksEditor
                                            profileId={profileId}
                                            initialLinks={socialLinks}
                                        />
                                    </div>
                                ) : (
                                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                                        Загрузка…
                                    </p>
                                )}
                            </div>

                            <h3 className='mt-8 text-title-sm text-on-surface'>
                                Превью и иконка
                            </h3>
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                Как ссылка выглядит в соцсетях и мессенджерах
                                и как открывается в браузере.
                            </p>

                            <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div>
                                    <Label>OG-обложка (1200×630)</Label>
                                    <ImageUploaderField
                                        value={
                                            watch('ogImageFileId') || null
                                        }
                                        onChange={(fileId) =>
                                            setValue(
                                                'ogImageFileId',
                                                fileId ?? '',
                                            )
                                        }
                                        aspectRatio={1200 / 630}
                                        cropRatio={1200 / 630}
                                    />
                                    <p className='mt-1 min-h-[1.5rem] text-body-sm text-on-surface-variant'>
                                        Превью ссылки в соцсетях.
                                    </p>
                                </div>
                                <div>
                                    <Label>Фавикон (квадрат)</Label>
                                    <ImageUploaderField
                                        value={
                                            watch('faviconFileId') || null
                                        }
                                        onChange={(fileId) =>
                                            setValue(
                                                'faviconFileId',
                                                fileId ?? '',
                                            )
                                        }
                                        aspectRatio={1}
                                        cropRatio={1}
                                    />
                                    <p className='mt-1 min-h-[1.5rem] text-body-sm text-on-surface-variant'>
                                        Иконка во вкладке браузера.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <p
                                    role='alert'
                                    className='mt-4 text-body-sm text-error'
                                >
                                    {error}
                                </p>
                            )}

                            {/* Панель сохранения по образцу WizardSaveBar
                                (§3.6): статус слева, действие справа.
                                До загрузки профиля кнопка отключена —
                                иначе сохранение пустых значений стёрло бы
                                OG-обложку. */}
                            <div className='mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-4'>
                                <p
                                    role='status'
                                    className='text-body-sm text-primary'
                                >
                                    {success ? 'Сохранено' : ''}
                                </p>
                                <Button
                                    type='submit'
                                    disabled={saving || !profileLoaded}
                                >
                                    {saving ? 'Сохраняем…' : 'Сохранить'}
                                </Button>
                            </div>
                        </Card>
                    </form>
                </div>

                {/* Редактор контента главной страницы дизайнера (/u/[slug]) —
                    спека: Docs/specs/Main Page Admin Panel Fields.md.
                    Рендерится всегда (состояние форм сохраняется при
                    переключении разделов), видим только активный раздел. */}
                {profileId && mainContent && (
                    <div className={section === 'seo' ? 'hidden' : ''}>
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
