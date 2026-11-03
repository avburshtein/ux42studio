'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminLang } from '@/components/admin/AdminLang';
import {
    saveMainPageContent,
    updateProfile,
    updateProfileThemeSettings,
} from '@/lib/actions/profile';
import ImageUploaderField from '@/components/ImageUploaderField';
import { ExperienceItemsEditor } from '@/components/admin/ExperienceItemsEditor';
import { EducationItemsEditor } from '@/components/admin/EducationItemsEditor';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { isValidSeed, PRESET_SEEDS } from '@/lib/theme';
import { buildThemeCss } from '@/lib/theme-engine';
import { generateChromaThemeCss } from '@/lib/chroma42';
import type {
    ButtonVariant,
    MainPageContent,
    ProcessStep,
    ToolGroup,
} from '@/lib/mainPageContent';

type Props = {
    profileId: string;
    initialContent: MainPageContent;
    /** Аватар/обложка профиля ( редактируются в разделе Hero) */
    avatarFileId: string;
    coverFileId: string;
    /** Активный раздел сайдбара — рендерим только его */
    visibleSection: string;
    /** D-010: применять кастомную тему к кейс-страницам (чекбокс в 06) */
    applyThemeToChildPages: boolean;
};

const textareaClass =
    'w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]';

/** Редактор одного тег-массива (skills / tools / process steps). */
function TagList({
    label,
    tags,
    onChange,
}: {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
}) {
    const { t } = useAdminLang();
    const [draft, setDraft] = useState('');

    const add = () => {
        const v = draft.trim();
        if (!v || tags.includes(v)) return;
        onChange([...tags, v]);
        setDraft('');
    };

    return (
        <div>
            <Label>{label}</Label>
            <div className='mb-2 flex flex-wrap gap-2'>
                {tags.map((tag, i) => (
                    <span
                        key={`${tag}-${i}`}
                        className='inline-flex items-center gap-1 rounded-full bg-surface-variant px-3 py-1 text-body-sm text-on-surface'
                    >
                        {tag}
                        <button
                            type='button'
                            onClick={() => onChange(tags.filter((_, j) => j !== i))}
                            className='cursor-pointer text-on-surface-variant hover:text-error'
                            aria-label={`${t('mpc.removeItem')} ${tag}`}
                        >
                            <Trash2 className='h-3 w-3' />
                        </button>
                    </span>
                ))}
            </div>
            <div className='flex gap-2'>
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            add();
                        }
                    }}
                    placeholder={t('mpc.addTag')}
                />
                <Button type='button' variant='outline' size='sm' onClick={add}>
                    <Plus className='mr-1 h-4 w-4' /> {t('mpc.add')}
                </Button>
            </div>
        </div>
    );
}

/** Редактор групп Tools (D-013): подзаголовок группы + чипы.
 *  Группы можно добавлять/удалять; каждая — как TagList. */
function ToolGroupsEditor({
    label,
    groups,
    onChange,
}: {
    label: string;
    groups: ToolGroup[];
    onChange: (groups: ToolGroup[]) => void;
}) {
    const { t } = useAdminLang();
    const update = (i: number, patch: Partial<ToolGroup>) => {
        onChange(groups.map((g, j) => (j === i ? { ...g, ...patch } : g)));
    };

    return (
        <div className='flex flex-col gap-4'>
            <Label>{label}</Label>
            {groups.map((group, i) => (
                <div
                    key={i}
                    className='flex flex-col gap-3 rounded-md border border-outline-variant p-4'
                >
                    <div className='flex items-end gap-2'>
                        <div className='flex-1'>
                            <Label htmlFor={`mp-tg-l-${i}`}>{t('mpc.groupLabel')}</Label>
                            <Input
                                id={`mp-tg-l-${i}`}
                                value={group.label}
                                onChange={(e) => update(i, { label: e.target.value })}
                            />
                        </div>
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => onChange(groups.filter((_, j) => j !== i))}
                            aria-label={`${t('mpc.removeItem')} ${group.label}`}
                        >
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                    <TagList
                        label={t('mpc.tags')}
                        tags={group.items}
                        onChange={(items) => update(i, { items })}
                    />
                </div>
            ))}
            <div>
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onChange([...groups, { label: '', items: [] }])}
                >
                    <Plus className='mr-1 h-4 w-4' /> {t('mpc.addGroup')}
                </Button>
            </div>
        </div>
    );
}

const VARIANT_OPTIONS: { value: ButtonVariant; labelKey: string }[] = [
    { value: 'primary', labelKey: 'mpc.variantPrimary' },
    { value: 'secondary', labelKey: 'mpc.variantSecondary' },
    { value: 'ghost', labelKey: 'mpc.variantGhost' },
    { value: 'link', labelKey: 'mpc.variantLink' },
];

/** Выбор варианта кнопки (семейства: primary/secondary/ghost/link). */
function VariantSelect({
    id,
    label,
    value,
    onChange,
}: {
    id: string;
    label: string;
    value: ButtonVariant;
    onChange: (v: ButtonVariant) => void;
}) {
    const { t } = useAdminLang();
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={value}
                onValueChange={(v) => onChange(v as ButtonVariant)}
            >
                <SelectTrigger id={id}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {VARIANT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

/** Редактор этапов работы (My process): заголовок + описание. */
function StepsEditor({
    label,
    steps,
    onChange,
}: {
    label: string;
    steps: ProcessStep[];
    onChange: (steps: ProcessStep[]) => void;
}) {
    const { t } = useAdminLang();
    const update = (i: number, patch: Partial<ProcessStep>) =>
        onChange(steps.map((s, j) => (j === i ? { ...s, ...patch } : s)));

    return (
        <div>
            <Label>{label}</Label>
            <div className='space-y-3'>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className='space-y-2 rounded-lg border border-outline-variant p-3'
                    >
                        <div className='flex items-center gap-2'>
                            <span className='shrink-0 text-body-sm text-on-surface-variant'>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <Input
                                value={step.title}
                                onChange={(e) => update(i, { title: e.target.value })}
                                placeholder={t('mpc.stepTitle')}
                                aria-label={`Step ${i + 1} title`}
                            />
                            <button
                                type='button'
                                onClick={() =>
                                    onChange(steps.filter((_, j) => j !== i))
                                }
                                className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-error'
                                aria-label={`${t('mpc.removeItem')} ${t('mpc.processSteps')} ${i + 1}`}
                            >
                                <Trash2 className='h-4 w-4' />
                            </button>
                        </div>
                        <textarea
                            rows={2}
                            className={textareaClass}
                            value={step.description}
                            onChange={(e) =>
                                update(i, { description: e.target.value })
                            }
                            placeholder={t('mpc.stepDescription')}
                            aria-label={`Step ${i + 1} description`}
                        />
                    </div>
                ))}
            </div>
            <Button
                type='button'
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => onChange([...steps, { title: '', description: '' }])}
            >
                <Plus className='mr-1 h-4 w-4' /> {t('mpc.addStep')}
            </Button>
        </div>
    );
}

function Section({
    title,
    visible,
    onVisibleChange,
    children,
}: {
    title: string;
    visible?: boolean;
    onVisibleChange?: (v: boolean) => void;
    children: React.ReactNode;
}) {
    const { t } = useAdminLang();
    return (
        <fieldset className='rounded-xl border border-outline-variant p-4'>
            <legend className='flex w-full items-center gap-3 px-2 text-left'>
                <span className='text-title-sm font-semibold text-on-surface'>
                    {title}
                </span>
                {onVisibleChange && (
                    <label className='flex cursor-pointer items-center gap-1.5 text-body-sm text-on-surface-variant'>
                        <input
                            type='checkbox'
                            checked={visible ?? true}
                            onChange={(e) => onVisibleChange(e.target.checked)}
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        {t('mpc.showOnPage')}
                    </label>
                )}
            </legend>
            <div className='space-y-4'>{children}</div>
        </fieldset>
    );
}

export default function MainPageContentEditor({
    profileId,
    initialContent,
    avatarFileId: initialAvatar,
    coverFileId: initialCover,
    visibleSection,
    applyThemeToChildPages: initialApplyTheme,
}: Props) {
    const { t } = useAdminLang();
    const [content, setContent] = useState<MainPageContent>(initialContent);
    const [avatarFileId, setAvatarFileId] = useState(initialAvatar);
    const [coverFileId, setCoverFileId] = useState(initialCover);
    // D-010: применение темы к кейсам — автосейв отдельно от контента
    const [applyThemeToChildPages, setApplyThemeToChildPages] =
        useState(initialApplyTheme);
    const [applyThemeSaving, setApplyThemeSaving] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Автосейв чекбокса «тема на кейсах» (как у SectionsVisibilityEditor)
    const onApplyThemeChange = async (checked: boolean) => {
        setApplyThemeToChildPages(checked);
        setApplyThemeSaving(true);
        try {
            await updateProfileThemeSettings(profileId, checked);
        } catch {
            setApplyThemeToChildPages(!checked);
        } finally {
            setApplyThemeSaving(false);
        }
    };

    // Обёртка секции: показываем только активный раздел сайдбара
    const wrap = (id: string, node: React.ReactNode) => (
        <div className={visibleSection === id ? '' : 'hidden'}>{node}</div>
    );

    // D-019: тема Chroma42 — из неё получаем и CSS, и «паспорт доступности».
    const chromaResult = useMemo(
        () =>
            content.theme.engine === 'chroma42' &&
            isValidSeed(content.theme.seedColor)
                ? generateChromaThemeCss(content.theme.seedColor)
                : null,
        [content.theme.engine, content.theme.seedColor],
    );

    // Live-превью темы в админке: инжектим CSS пока открыт раздел 06
    useEffect(() => {
        if (visibleSection !== 'theme') return;
        const css = content.theme.useCustomTheme
            ? chromaResult?.css ||
              (content.theme.engine === 'm3'
                  ? buildThemeCss(content.theme.seedColor, 'm3')
                  : '')
            : '';
        let styleTag = document.getElementById('admin-theme-preview');
        if (!css) {
            styleTag?.remove();
            return;
        }
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'admin-theme-preview';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;
    }, [
        visibleSection,
        content.theme.useCustomTheme,
        content.theme.seedColor,
        content.theme.engine,
        chromaResult,
    ]);

    const set = <S extends keyof MainPageContent>(
        section: S,
        patch: Partial<MainPageContent[S]>,
    ) =>
        setContent((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...patch },
        }));

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            await saveMainPageContent(profileId, content);
            // Аватар/обложка (раздел Hero): null = явное удаление
            await updateProfile(profileId, {
                avatarFileId: avatarFileId || null,
                coverFileId: coverFileId || null,
            });
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className='space-y-6'>
                {wrap('hero', (
                <Section
                    title={t('mpc.sectionHero')}
                    visible={content.hero.visible}
                    onVisibleChange={(v) => set('hero', { visible: v })}
                >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label>{t('mpc.avatar')}</Label>
                            <ImageUploaderField
                                value={avatarFileId || null}
                                onChange={(fileId) => setAvatarFileId(fileId ?? '')}
                                aspectRatio={1}
                                cropRatio={1}
                            />
                        </div>
                        <div>
                            <Label>{t('mpc.cover')}</Label>
                            <ImageUploaderField
                                value={coverFileId || null}
                                onChange={(fileId) => setCoverFileId(fileId ?? '')}
                                aspectRatio={16 / 5}
                                cropRatio={16 / 5}
                            />
                        </div>
                    </div>
                    <label className='flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant'>
                        <input
                            type='checkbox'
                            checked={content.hero.floatingElements}
                            onChange={(e) =>
                                set('hero', { floatingElements: e.target.checked })
                            }
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        {t('mpc.floatingElements')}
                    </label>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label htmlFor='mp-h1'>{t('mpc.headingLine1')}</Label>
                            <Input
                                id='mp-h1'
                                value={content.hero.headingLine1}
                                onChange={(e) => set('hero', { headingLine1: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-ha'>{t('mpc.headingAccent')}</Label>
                            <Input
                                id='mp-ha'
                                value={content.hero.headingAccent}
                                onChange={(e) => set('hero', { headingAccent: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-h2'>{t('mpc.headingLine2')}</Label>
                            <Input
                                id='mp-h2'
                                value={content.hero.headingLine2}
                                onChange={(e) => set('hero', { headingLine2: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor='mp-hd'>{t('mpc.description')}</Label>
                        <textarea
                            id='mp-hd'
                            rows={3}
                            className={textareaClass}
                            value={content.hero.description}
                            onChange={(e) => set('hero', { description: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <VariantSelect
                            id='mp-hpv'
                            label={t('mpc.ctaPrimaryStyle')}
                            value={content.hero.ctaPrimaryVariant}
                            onChange={(v) => set('hero', { ctaPrimaryVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-hpl'>{t('mpc.ctaPrimaryLabel')}</Label>
                            <Input
                                id='mp-hpl'
                                value={content.hero.ctaPrimaryLabel}
                                onChange={(e) => set('hero', { ctaPrimaryLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-hpu'>{t('mpc.ctaPrimaryLink')}</Label>
                            <Input
                                id='mp-hpu'
                                value={content.hero.ctaPrimaryUrl}
                                onChange={(e) => set('hero', { ctaPrimaryUrl: e.target.value })}
                            />
                        </div>
                        <VariantSelect
                            id='mp-hsv'
                            label={t('mpc.ctaSecondaryStyle')}
                            value={content.hero.ctaSecondaryVariant}
                            onChange={(v) => set('hero', { ctaSecondaryVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-hsl'>{t('mpc.ctaSecondaryLabel')}</Label>
                            <Input
                                id='mp-hsl'
                                value={content.hero.ctaSecondaryLabel}
                                onChange={(e) => set('hero', { ctaSecondaryLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-hsu'>{t('mpc.ctaSecondaryLink')}</Label>
                            <Input
                                id='mp-hsu'
                                value={content.hero.ctaSecondaryUrl}
                                onChange={(e) => set('hero', { ctaSecondaryUrl: e.target.value })}
                            />
                        </div>
                        <VariantSelect
                            id='mp-htv'
                            label={t('mpc.ctaTertiaryStyle')}
                            value={content.hero.ctaTertiaryVariant}
                            onChange={(v) => set('hero', { ctaTertiaryVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-htl'>{t('mpc.ctaTertiaryLabel')}</Label>
                            <Input
                                id='mp-htl'
                                placeholder='Download CV'
                                value={content.hero.ctaTertiaryLabel}
                                onChange={(e) => set('hero', { ctaTertiaryLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-htu'>{t('mpc.ctaTertiaryLink')}</Label>
                            <Input
                                id='mp-htu'
                                placeholder='https://…/cv.pdf'
                                value={content.hero.ctaTertiaryUrl}
                                onChange={(e) => set('hero', { ctaTertiaryUrl: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Полоса фактов под кнопками («первый экран CV», D-013) */}
                    <TagList
                        label={t('mpc.heroFacts')}
                        tags={content.hero.facts}
                        onChange={(facts) => set('hero', { facts })}
                    />
                </Section>
                ))}

                {wrap('portfolio', (
                <Section
                    title={t('mpc.sectionPortfolio')}
                    visible={content.portfolio.visible}
                    onVisibleChange={(v) => set('portfolio', { visible: v })}
                >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-pt'>{t('mpc.portfolioTitle')}</Label>
                            <Input
                                id='mp-pt'
                                value={content.portfolio.title}
                                onChange={(e) => set('portfolio', { title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-ps'>{t('mpc.portfolioSubtitle')}</Label>
                            <Input
                                id='mp-ps'
                                value={content.portfolio.subtitle}
                                onChange={(e) => set('portfolio', { subtitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-pcl'>{t('mpc.portfolioCtaLabel')}</Label>
                            <Input
                                id='mp-pcl'
                                value={content.portfolio.ctaLabel}
                                onChange={(e) => set('portfolio', { ctaLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-pcu'>{t('mpc.portfolioCtaLink')}</Label>
                            <Input
                                id='mp-pcu'
                                value={content.portfolio.ctaUrl}
                                onChange={(e) => set('portfolio', { ctaUrl: e.target.value })}
                            />
                        </div>
                        <VariantSelect
                            id='mp-pcv'
                            label={t('mpc.portfolioCtaStyle')}
                            value={content.portfolio.ctaVariant}
                            onChange={(v) => set('portfolio', { ctaVariant: v })}
                        />
                    </div>
                </Section>
                ))}

                {wrap('experience', (
                <Section
                    title={t('mpc.sectionExperience')}
                    visible={content.experience.visible}
                    onVisibleChange={(v) => set('experience', { visible: v })}
                >
                    <div>
                        <Label htmlFor='mp-exp-heading'>{t('mpc.heading')}</Label>
                        <Input
                            id='mp-exp-heading'
                            value={content.experience.heading}
                            onChange={(e) =>
                                set('experience', { heading: e.target.value })
                            }
                        />
                    </div>
                    <div className='mt-6'>
                        <ExperienceItemsEditor
                            items={content.experience.items}
                            onChange={(items) => set('experience', { items })}
                        />
                    </div>
                </Section>
                ))}

                {wrap('about', (
                <Section
                    title={t('mpc.sectionAbout')}
                    visible={content.about.visible}
                    onVisibleChange={(v) => set('about', { visible: v })}
                >
                    <div>
                        <Label htmlFor='mp-ah'>{t('mpc.aboutHeading')}</Label>
                        <Input
                            id='mp-ah'
                            value={content.about.heading}
                            onChange={(e) => set('about', { heading: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap1'>{t('mpc.paragraph1')}</Label>
                        <textarea
                            id='mp-ap1'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph1}
                            onChange={(e) => set('about', { paragraph1: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap2'>{t('mpc.paragraph2')}</Label>
                        <textarea
                            id='mp-ap2'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph2}
                            onChange={(e) => set('about', { paragraph2: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap3'>{t('mpc.paragraph3')}</Label>
                        <textarea
                            id='mp-ap3'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph3}
                            onChange={(e) => set('about', { paragraph3: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap4'>{t('mpc.paragraph4')}</Label>
                        <textarea
                            id='mp-ap4'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph4}
                            onChange={(e) => set('about', { paragraph4: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap5'>{t('mpc.paragraph5')}</Label>
                        <textarea
                            id='mp-ap5'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph5}
                            onChange={(e) => set('about', { paragraph5: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>{t('mpc.processImage')}</Label>
                        <ImageUploaderField
                            value={content.about.processImageFileId}
                            onChange={(fileId) =>
                                set('about', { processImageFileId: fileId ?? null })
                            }
                            aspectRatio={516 / 495}
                            cropRatio={516 / 495}
                        />
                    </div>
                </Section>
                ))}

                {wrap('expertise', (
                <Section
                    title={t('mpc.sectionExpertise')}
                    visible={content.expertise.visible}
                    onVisibleChange={(v) => set('expertise', { visible: v })}
                >
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-esl'>{t('mpc.skillsLabel')}</Label>
                            <Input
                                id='mp-esl'
                                value={content.expertise.skillsLabel}
                                onChange={(e) => set('expertise', { skillsLabel: e.target.value })}
                            />
                        </div>
                    </div>
                    <TagList
                        label={t('mpc.skillsTags')}
                        tags={content.expertise.skills}
                        onChange={(skills) => set('expertise', { skills })}
                    />
                    <ToolGroupsEditor
                        label={t('mpc.toolsGroups')}
                        groups={content.expertise.toolGroups}
                        onChange={(toolGroups) => set('expertise', { toolGroups })}
                    />
                    <div>
                        <Label htmlFor='mp-esn'>Project stack note (honest line, e.g. “Worked with, together with AI agents: …”)</Label>
                        <Input
                            id='mp-esn'
                            value={content.expertise.stackNote}
                            onChange={(e) => set('expertise', { stackNote: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-epl'>{t('mpc.processLabel')}</Label>
                        <Input
                            id='mp-epl'
                            value={content.expertise.processLabel}
                            onChange={(e) => set('expertise', { processLabel: e.target.value })}
                        />
                    </div>
                    <StepsEditor
                        label={t('mpc.processSteps')}
                        steps={content.expertise.processSteps}
                        onChange={(processSteps) => set('expertise', { processSteps })}
                    />
                    <label className='flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant'>
                        <input
                            type='checkbox'
                            checked={content.expertise.proBonoVisible}
                            onChange={(e) =>
                                set('expertise', { proBonoVisible: e.target.checked })
                            }
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        Pro Bono — show banner on page
                    </label>
                    <div>
                        <Label htmlFor='mp-epb'>{t('mpc.proBonoText')}</Label>
                        <textarea
                            id='mp-epb'
                            rows={3}
                            className={textareaClass}
                            value={content.expertise.proBonoText}
                            onChange={(e) => set('expertise', { proBonoText: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <VariantSelect
                            id='mp-epbv'
                            label={t('mpc.proBonoCtaStyle')}
                            value={content.expertise.proBonoCtaVariant}
                            onChange={(v) => set('expertise', { proBonoCtaVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-epbl'>{t('mpc.proBonoCtaLabel')}</Label>
                            <Input
                                id='mp-epbl'
                                value={content.expertise.proBonoCtaLabel}
                                onChange={(e) => set('expertise', { proBonoCtaLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-epbu'>{t('mpc.proBonoCtaLink')}</Label>
                            <Input
                                id='mp-epbu'
                                value={content.expertise.proBonoCtaUrl}
                                onChange={(e) => set('expertise', { proBonoCtaUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>
                ))}

                {wrap('education', (
                <Section
                    title={t('mpc.sectionEducation')}
                    visible={content.education.visible}
                    onVisibleChange={(v) => set('education', { visible: v })}
                >
                    <div>
                        <Label htmlFor='mp-edu-heading'>{t('mpc.heading')}</Label>
                        <Input
                            id='mp-edu-heading'
                            value={content.education.heading}
                            onChange={(e) =>
                                set('education', { heading: e.target.value })
                            }
                        />
                    </div>
                    <div className='mt-6'>
                        <EducationItemsEditor
                            items={content.education.items}
                            onChange={(items) => set('education', { items })}
                        />
                    </div>
                </Section>
                ))}

                {wrap('cta', (
                <Section
                    title={t('mpc.sectionCta')}
                    visible={content.cta.visible}
                    onVisibleChange={(v) => set('cta', { visible: v })}
                >
                    <div>
                        <Label htmlFor='mp-ch'>{t('mpc.ctaHeading')}</Label>
                        <Input
                            id='mp-ch'
                            value={content.cta.heading}
                            onChange={(e) => set('cta', { heading: e.target.value })}
                        />
                    </div>
                    <label className='flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant'>
                        <input
                            type='checkbox'
                            checked={content.cta.floatingElements}
                            onChange={(e) =>
                                set('cta', { floatingElements: e.target.checked })
                            }
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        {t('mpc.floatingElements')}
                    </label>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-cd1'>{t('mpc.descriptionLine1')}</Label>
                            <Input
                                id='mp-cd1'
                                value={content.cta.description1}
                                onChange={(e) => set('cta', { description1: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cd2'>{t('mpc.descriptionLine2')}</Label>
                            <Input
                                id='mp-cd2'
                                value={content.cta.description2}
                                onChange={(e) => set('cta', { description2: e.target.value })}
                            />
                        </div>
                        <VariantSelect
                            id='mp-cev'
                            label={t('mpc.emailButtonStyle')}
                            value={content.cta.emailVariant}
                            onChange={(v) => set('cta', { emailVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-cel'>{t('mpc.emailButtonLabel')}</Label>
                            <Input
                                id='mp-cel'
                                value={content.cta.emailLabel}
                                onChange={(e) => set('cta', { emailLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cea'>{t('mpc.emailAddress')}</Label>
                            <Input
                                id='mp-cea'
                                type='email'
                                value={content.cta.emailAddress}
                                onChange={(e) => set('cta', { emailAddress: e.target.value })}
                            />
                        </div>
                        <VariantSelect
                            id='mp-cwv'
                            label={t('mpc.whatsappButtonStyle')}
                            value={content.cta.whatsappVariant}
                            onChange={(v) => set('cta', { whatsappVariant: v })}
                        />
                        <div />
                        <div>
                            <Label htmlFor='mp-cwl'>{t('mpc.whatsappButtonLabel')}</Label>
                            <Input
                                id='mp-cwl'
                                value={content.cta.whatsappLabel}
                                onChange={(e) => set('cta', { whatsappLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cwu'>{t('mpc.whatsappLink')}</Label>
                            <Input
                                id='mp-cwu'
                                value={content.cta.whatsappUrl}
                                onChange={(e) => set('cta', { whatsappUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>
                ))}

                {/* 06 · Color Theme: seed → M3-схема (light+dark), live-превью */}
                {wrap('theme', (
                <Section title={t('mpc.sectionTheme')}>
                    <label className='flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant'>
                        <input
                            type='checkbox'
                            checked={content.theme.useCustomTheme}
                            onChange={(e) =>
                                set('theme', { useCustomTheme: e.target.checked })
                            }
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        {t('mpc.customTheme')}
                    </label>

                    {/* D-010: распространение темы на кейс-страницы — здесь,
                        рядом с настройкой темы (фидбэк 2026-10-30: пользователь
                        изучает интерфейс сверху вниз и в первом разделе не
                        поймёт, о чём речь). Автосейв, работает только вместе
                        с кастомной темой. */}
                    <label
                        className={`flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 pl-4 text-body-sm ${
                            content.theme.useCustomTheme
                                ? 'cursor-pointer text-on-surface'
                                : 'cursor-not-allowed text-on-surface-variant opacity-60'
                        }`}
                    >
                        <input
                            type='checkbox'
                            checked={applyThemeToChildPages}
                            disabled={
                                !content.theme.useCustomTheme ||
                                applyThemeSaving
                            }
                            onChange={(e) =>
                                onApplyThemeChange(e.target.checked)
                            }
                            className='h-4 w-4 cursor-pointer accent-[var(--md-sys-color-primary)]'
                        />
                        <span>
                            {t('mpc.applyThemeToCases')}
                            <span className='mt-0.5 block text-body-sm text-on-surface-variant'>
                                {t('mpc.applyThemeToCasesHint')}
                            </span>
                        </span>
                    </label>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label>{t('mpc.engine')}</Label>
                            <div className='flex gap-2'>
                                {(
                                    [
                                        ['m3', t('mpc.engineM3')],
                                        ['chroma42', t('mpc.engineChroma42')],
                                    ] as const
                                ).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type='button'
                                        onClick={() =>
                                            set('theme', { engine: value })
                                        }
                                        disabled={!content.theme.useCustomTheme}
                                        aria-pressed={
                                            content.theme.engine === value
                                        }
                                        className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-body-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                            content.theme.engine === value
                                                ? 'border-transparent bg-primary text-on-primary'
                                                : 'border-outline-variant bg-surface text-on-surface-variant hover:border-outline'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                {t('mpc.engineHint')}
                            </p>
                        </div>
                        <div>
                            <Label htmlFor='mp-seed'>{t('mpc.seedColor')}</Label>
                            <div className='flex items-center gap-2'>
                                <input
                                    id='mp-seed'
                                    type='color'
                                    value={
                                        isValidSeed(content.theme.seedColor)
                                            ? content.theme.seedColor
                                            : '#0b6e4f'
                                    }
                                    onChange={(e) =>
                                        set('theme', { seedColor: e.target.value })
                                    }
                                    className='h-10 w-14 cursor-pointer rounded-md border border-outline-variant bg-surface p-1'
                                    disabled={!content.theme.useCustomTheme}
                                />
                                <Input
                                    value={content.theme.seedColor}
                                    onChange={(e) =>
                                        set('theme', { seedColor: e.target.value })
                                    }
                                    placeholder='#0b6e4f'
                                    disabled={!content.theme.useCustomTheme}
                                />
                            </div>
                            {!isValidSeed(content.theme.seedColor) && (
                                <p className='mt-1 text-body-sm text-error'>
                                    {t('mpc.hexFormat')}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>{t('mpc.presets')}</Label>
                            <div className='flex flex-wrap gap-2'>
                                {PRESET_SEEDS.map((preset) => (
                                    <button
                                        key={preset.value}
                                        type='button'
                                        onClick={() =>
                                            set('theme', {
                                                seedColor: preset.value,
                                                useCustomTheme: true,
                                            })
                                        }
                                        title={preset.label}
                                        disabled={!content.theme.useCustomTheme}
                                        className='h-10 w-10 cursor-pointer rounded-full border-2 border-outline-variant transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50'
                                        style={{ background: preset.value }}
                                        aria-label={preset.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className='text-body-sm text-on-surface-variant'>
                        {t('mpc.themeAutoNote')}
                    </p>

                    {/* D-019: паспорт доступности Chroma42 — сводка аудита
                        контрастных пар по всем режимам темы. */}
                    {chromaResult && (
                        <div className='rounded-lg border border-outline-variant bg-surface-container-lowest p-3'>
                            <div className='flex flex-wrap items-center justify-between gap-2'>
                                <span className='text-body-sm font-medium text-on-surface'>
                                    {t('mpc.auditTitle')}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-body-sm ${
                                        chromaResult.audit.failed > 0
                                            ? 'bg-error-container text-on-error-container'
                                            : 'bg-primary-container text-on-primary-container'
                                    }`}
                                >
                                    {chromaResult.audit.failed > 0
                                        ? t('mpc.auditFail')
                                        : t('mpc.auditOk')}
                                </span>
                            </div>
                            <dl className='mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-body-sm sm:grid-cols-4'>
                                <div>
                                    <dt className='text-on-surface-variant'>
                                        {t('mpc.auditPairs')}
                                    </dt>
                                    <dd className='text-on-surface'>
                                        {chromaResult.audit.totalPairsChecked}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-on-surface-variant'>
                                        {t('mpc.auditPassed')}
                                    </dt>
                                    <dd className='text-on-surface'>
                                        {chromaResult.audit.passed}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-on-surface-variant'>
                                        {t('mpc.auditWarnings')}
                                    </dt>
                                    <dd className='text-on-surface'>
                                        {chromaResult.audit.warnings}
                                    </dd>
                                </div>
                                <div>
                                    <dt className='text-on-surface-variant'>
                                        {t('mpc.auditFailed')}
                                    </dt>
                                    <dd className='text-on-surface'>
                                        {chromaResult.audit.failed}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    )}

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-header-mode'>{t('mpc.header')}</Label>
                            <Select
                                value={content.theme.header.mode}
                                onValueChange={(v) =>
                                    set('theme', {
                                        header: {
                                            ...content.theme.header,
                                            mode: v as MainPageContent['theme']['header']['mode'],
                                        },
                                    })
                                }
                                disabled={!content.theme.useCustomTheme}
                            >
                                <SelectTrigger id='mp-header-mode'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='default'>
                                        {t('mpc.modeDefaultGlass')}
                                    </SelectItem>
                                    <SelectItem value='transparent'>
                                        {t('mpc.modeTransparent')}
                                    </SelectItem>
                                    <SelectItem value='solid'>
                                        {t('mpc.modeSolidColor')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {content.theme.header.mode === 'solid' && (
                                <div className='mt-2 flex items-center gap-2'>
                                    <input
                                        type='color'
                                        aria-label={t('mpc.headerColor')}
                                        value={content.theme.header.color ?? '#0b6e4f'}
                                        onChange={(e) =>
                                            set('theme', {
                                                header: {
                                                    ...content.theme.header,
                                                    color: e.target.value,
                                                },
                                            })
                                        }
                                        className='h-10 w-14 cursor-pointer rounded-md border border-outline-variant bg-surface p-1'
                                    />
                                    <Input
                                        value={content.theme.header.color ?? ''}
                                        onChange={(e) =>
                                            set('theme', {
                                                header: {
                                                    ...content.theme.header,
                                                    color: e.target.value,
                                                },
                                            })
                                        }
                                        placeholder='#0b6e4f'
                                    />
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                            set('theme', {
                                                header: {
                                                    ...content.theme.header,
                                                    color: null,
                                                },
                                            })
                                        }
                                    >
                                        {t('mpc.reset')}
                                    </Button>
                                </div>
                            )}
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                {t('mpc.headerSolidHint')}
                            </p>
                        </div>
                        <div>
                            <Label htmlFor='mp-bg-mode'>{t('mpc.background')}</Label>
                            <Select
                                value={content.theme.background.mode}
                                onValueChange={(v) =>
                                    set('theme', {
                                        background: {
                                            ...content.theme.background,
                                            mode: v as MainPageContent['theme']['background']['mode'],
                                        },
                                    })
                                }
                                disabled={!content.theme.useCustomTheme}
                            >
                                <SelectTrigger id='mp-bg-mode'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='default'>
                                        {t('mpc.modeDefaultSurface')}
                                    </SelectItem>
                                    <SelectItem value='seed-tint'>
                                        {t('mpc.modeAccentTint')}
                                    </SelectItem>
                                    <SelectItem value='solid'>
                                        {t('mpc.modeSolidColor')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {content.theme.background.mode === 'solid' && (
                                <div className='mt-2 flex items-center gap-2'>
                                    <input
                                        type='color'
                                        aria-label={t('mpc.backgroundColor')}
                                        value={content.theme.background.color ?? '#f7faf5'}
                                        onChange={(e) =>
                                            set('theme', {
                                                background: {
                                                    ...content.theme.background,
                                                    color: e.target.value,
                                                },
                                            })
                                        }
                                        className='h-10 w-14 cursor-pointer rounded-md border border-outline-variant bg-surface p-1'
                                    />
                                    <Input
                                        value={content.theme.background.color ?? ''}
                                        onChange={(e) =>
                                            set('theme', {
                                                background: {
                                                    ...content.theme.background,
                                                    color: e.target.value,
                                                },
                                            })
                                        }
                                        placeholder='#f7faf5'
                                    />
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                            set('theme', {
                                                background: {
                                                    ...content.theme.background,
                                                    color: null,
                                                },
                                            })
                                        }
                                    >
                                        {t('mpc.reset')}
                                    </Button>
                                </div>
                            )}
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                {t('mpc.bgSolidHint')}
                            </p>
                        </div>
                    </div>

                    <div className='rounded-xl border border-outline-variant p-4'>
                        <h3 className='mb-3 text-title-sm font-semibold text-on-surface'>
                            {t('mpc.floatingTitle')}
                        </h3>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                                <Label htmlFor='mp-float-color'>{t('mpc.color')}</Label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        id='mp-float-color'
                                        type='color'
                                        value={content.floating.color ?? '#0b6e4f'}
                                        onChange={(e) =>
                                            set('floating', { color: e.target.value })
                                        }
                                        className='h-10 w-14 cursor-pointer rounded-md border border-outline-variant bg-surface p-1'
                                    />
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => set('floating', { color: null })}
                                    >
                                        {t('mpc.reset')}
                                    </Button>
                                </div>
                                <p className='mt-1 text-body-sm text-on-surface-variant'>
                                    {t('mpc.floatingColorHint')}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor='mp-float-shape'>{t('mpc.shape')}</Label>
                                <Select
                                    value={content.floating.shape}
                                    onValueChange={(v) =>
                                        set('floating', {
                                            shape: v as MainPageContent['floating']['shape'],
                                        })
                                    }
                                >
                                    <SelectTrigger id='mp-float-shape'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='default'>
                                            {t('mpc.shapeDefault')}
                                        </SelectItem>
                                        <SelectItem value='circle'>
                                            {t('mpc.shapeCircles')}
                                        </SelectItem>
                                        <SelectItem value='square'>
                                            {t('mpc.shapeSquares')}
                                        </SelectItem>
                                        <SelectItem value='triangle'>
                                            {t('mpc.shapeTriangles')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Section>
                ))}

                {error && <p className='text-body-sm text-error'>{error}</p>}
                {success && (
                    <p className='text-body-sm text-primary'>
                        {t('mpc.saveSuccess')}
                    </p>
                )}

                <div className='flex justify-end gap-3 pt-2'>
                    <Button type='submit' disabled={saving}>
                        {saving ? t('mpc.saving') : t('mpc.save')}
                    </Button>
                </div>
            </form>
    );
}

