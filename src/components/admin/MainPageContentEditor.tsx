'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import PageTitle from '@/components/ui/PageTitle';
import FormBox from '@/components/ui/FormBox';
import { Plus, Trash2 } from 'lucide-react';
import { saveMainPageContent } from '@/lib/actions/profile';
import ImageUploaderField from '@/components/ImageUploaderField';
import type { MainPageContent } from '@/lib/mainPageContent';

type Props = {
    profileId: string;
    initialContent: MainPageContent;
};

const textareaClass =
    'w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary';

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
                            aria-label={`Remove ${tag}`}
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
                    placeholder='Add tag…'
                />
                <Button type='button' variant='outline' size='sm' onClick={add}>
                    <Plus className='mr-1 h-4 w-4' /> Add
                </Button>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <fieldset className='rounded-xl border border-outline-variant p-4'>
            <legend className='px-2 text-title-sm font-semibold text-on-surface'>
                {title}
            </legend>
            <div className='space-y-4'>{children}</div>
        </fieldset>
    );
}

export default function MainPageContentEditor({ profileId, initialContent }: Props) {
    const [content, setContent] = useState<MainPageContent>(initialContent);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <FormBox className='mt-8'>
            <PageTitle className='mb-4'>Main Page Content</PageTitle>
            <p className='mb-6 text-body-sm text-on-surface-variant'>
                Контент главной страницы дизайнера (/u/[slug]). Пустые поля
                используют значения по умолчанию.
            </p>
            <form onSubmit={onSubmit} className='space-y-6'>
                <Section title='01 · Hero'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div>
                            <Label htmlFor='mp-h1'>Heading line 1 *</Label>
                            <Input
                                id='mp-h1'
                                value={content.hero.headingLine1}
                                onChange={(e) => set('hero', { headingLine1: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-ha'>Heading accent *</Label>
                            <Input
                                id='mp-ha'
                                value={content.hero.headingAccent}
                                onChange={(e) => set('hero', { headingAccent: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-h2'>Heading line 2</Label>
                            <Input
                                id='mp-h2'
                                value={content.hero.headingLine2}
                                onChange={(e) => set('hero', { headingLine2: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor='mp-hd'>Description *</Label>
                        <textarea
                            id='mp-hd'
                            rows={3}
                            className={textareaClass}
                            value={content.hero.description}
                            onChange={(e) => set('hero', { description: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-hpl'>CTA primary — label</Label>
                            <Input
                                id='mp-hpl'
                                value={content.hero.ctaPrimaryLabel}
                                onChange={(e) => set('hero', { ctaPrimaryLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-hpu'>CTA primary — link</Label>
                            <Input
                                id='mp-hpu'
                                value={content.hero.ctaPrimaryUrl}
                                onChange={(e) => set('hero', { ctaPrimaryUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-hsl'>CTA secondary — label</Label>
                            <Input
                                id='mp-hsl'
                                value={content.hero.ctaSecondaryLabel}
                                onChange={(e) => set('hero', { ctaSecondaryLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-hsu'>CTA secondary — link</Label>
                            <Input
                                id='mp-hsu'
                                value={content.hero.ctaSecondaryUrl}
                                onChange={(e) => set('hero', { ctaSecondaryUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>

                <Section title='02 · Portfolio Gallery'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-pt'>Section title *</Label>
                            <Input
                                id='mp-pt'
                                value={content.portfolio.title}
                                onChange={(e) => set('portfolio', { title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-ps'>Section subtitle</Label>
                            <Input
                                id='mp-ps'
                                value={content.portfolio.subtitle}
                                onChange={(e) => set('portfolio', { subtitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-pcl'>CTA button — label</Label>
                            <Input
                                id='mp-pcl'
                                value={content.portfolio.ctaLabel}
                                onChange={(e) => set('portfolio', { ctaLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-pcu'>CTA button — link</Label>
                            <Input
                                id='mp-pcu'
                                value={content.portfolio.ctaUrl}
                                onChange={(e) => set('portfolio', { ctaUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>

                <Section title='03 · About'>
                    <div>
                        <Label htmlFor='mp-ah'>About heading *</Label>
                        <Input
                            id='mp-ah'
                            value={content.about.heading}
                            onChange={(e) => set('about', { heading: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap1'>Paragraph 1 *</Label>
                        <textarea
                            id='mp-ap1'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph1}
                            onChange={(e) => set('about', { paragraph1: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap2'>Paragraph 2</Label>
                        <textarea
                            id='mp-ap2'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph2}
                            onChange={(e) => set('about', { paragraph2: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor='mp-ap3'>Paragraph 3</Label>
                        <textarea
                            id='mp-ap3'
                            rows={3}
                            className={textareaClass}
                            value={content.about.paragraph3}
                            onChange={(e) => set('about', { paragraph3: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Process image</Label>
                        <ImageUploaderField
                            value={content.about.processImageFileId}
                            onChange={(fileId) =>
                                set('about', { processImageFileId: fileId ?? null })
                            }
                            aspectRatio={516 / 495}
                        />
                    </div>
                </Section>

                <Section title='04 · Expertise'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-esl'>Skills label</Label>
                            <Input
                                id='mp-esl'
                                value={content.expertise.skillsLabel}
                                onChange={(e) => set('expertise', { skillsLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-etl'>Tools label</Label>
                            <Input
                                id='mp-etl'
                                value={content.expertise.toolsLabel}
                                onChange={(e) => set('expertise', { toolsLabel: e.target.value })}
                            />
                        </div>
                    </div>
                    <TagList
                        label='Skills tags'
                        tags={content.expertise.skills}
                        onChange={(skills) => set('expertise', { skills })}
                    />
                    <TagList
                        label='Tools tags'
                        tags={content.expertise.tools}
                        onChange={(tools) => set('expertise', { tools })}
                    />
                    <div>
                        <Label htmlFor='mp-epl'>Process label</Label>
                        <Input
                            id='mp-epl'
                            value={content.expertise.processLabel}
                            onChange={(e) => set('expertise', { processLabel: e.target.value })}
                        />
                    </div>
                    <TagList
                        label='Process steps'
                        tags={content.expertise.processSteps}
                        onChange={(processSteps) => set('expertise', { processSteps })}
                    />
                    <div>
                        <Label htmlFor='mp-epb'>Pro Bono text</Label>
                        <textarea
                            id='mp-epb'
                            rows={3}
                            className={textareaClass}
                            value={content.expertise.proBonoText}
                            onChange={(e) => set('expertise', { proBonoText: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-epbl'>Pro Bono CTA — label</Label>
                            <Input
                                id='mp-epbl'
                                value={content.expertise.proBonoCtaLabel}
                                onChange={(e) => set('expertise', { proBonoCtaLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-epbu'>Pro Bono CTA — link</Label>
                            <Input
                                id='mp-epbu'
                                value={content.expertise.proBonoCtaUrl}
                                onChange={(e) => set('expertise', { proBonoCtaUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>

                <Section title='05 · CTA (Get in Touch)'>
                    <div>
                        <Label htmlFor='mp-ch'>CTA heading *</Label>
                        <Input
                            id='mp-ch'
                            value={content.cta.heading}
                            onChange={(e) => set('cta', { heading: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                            <Label htmlFor='mp-cd1'>Description line 1</Label>
                            <Input
                                id='mp-cd1'
                                value={content.cta.description1}
                                onChange={(e) => set('cta', { description1: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cd2'>Description line 2</Label>
                            <Input
                                id='mp-cd2'
                                value={content.cta.description2}
                                onChange={(e) => set('cta', { description2: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cel'>Email button — label</Label>
                            <Input
                                id='mp-cel'
                                value={content.cta.emailLabel}
                                onChange={(e) => set('cta', { emailLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cea'>Email address</Label>
                            <Input
                                id='mp-cea'
                                type='email'
                                value={content.cta.emailAddress}
                                onChange={(e) => set('cta', { emailAddress: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cwl'>WhatsApp button — label</Label>
                            <Input
                                id='mp-cwl'
                                value={content.cta.whatsappLabel}
                                onChange={(e) => set('cta', { whatsappLabel: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor='mp-cwu'>WhatsApp link</Label>
                            <Input
                                id='mp-cwu'
                                value={content.cta.whatsappUrl}
                                onChange={(e) => set('cta', { whatsappUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </Section>

                {error && <p className='text-body-sm text-error'>{error}</p>}
                {success && (
                    <p className='text-body-sm text-primary'>
                        Main page content saved successfully!
                    </p>
                )}

                <div className='flex justify-end gap-3 pt-2'>
                    <Button type='submit' disabled={saving}>
                        {saving ? 'Saving...' : 'Save Main Page Content'}
                    </Button>
                </div>
            </form>
        </FormBox>
    );
}

