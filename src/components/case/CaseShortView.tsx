import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from './BlockLabel';
import { TagBadge } from './TagBadge';

// ------------------------------------------------------------------
// Типы — совпадают со структурой, которую отдаёт page.tsx роута /short
// ------------------------------------------------------------------

interface TldrMetric {
    value: string;
    description: string;
}

interface TldrAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
}

export interface CaseShortViewProps {
    profileSlug: string;
    profileName: string;
    projectSlug: string;
    title: string;
    teaser?: string | null;
    coverUrl?: string;
    categories: string[];
    metadata: string; // «B2B · 2024 · 3 months · Lead UX Designer»
    problemSnippet?: string | null; // 1–2 первых предложения
    goal?: string | null;
    metrics: TldrMetric[];
    keyScreens: TldrAsset[];
    takeaway?: string | null;
}

// ------------------------------------------------------------------
// Утилиты
// ------------------------------------------------------------------

/** Обрезает текст до 1–2 первых предложений (для problemStatement). */
function firstSentences(text: string, max = 2): string {
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0);
    return sentences.slice(0, max).join(' ').trim();
}

// ------------------------------------------------------------------
// Компонент
// ------------------------------------------------------------------

/**
 * Короткая версия кейса (TL;DR) для hiring manager / рекрутера.
 * Авто-генерируется из уже структурированных данных — дизайнеру не
 * нужно заполнять отдельные поля. Решение 2026-09-18 (63).
 *
 * URL: /u/[slug]/[projectSlug]/short
 * CTA «View full case study →» ведёт на полный кейс.
 */
export function CaseShortView({
    profileSlug,
    profileName,
    projectSlug,
    title,
    teaser,
    coverUrl,
    categories,
    metadata,
    problemSnippet,
    goal,
    metrics,
    keyScreens,
    takeaway,
}: CaseShortViewProps) {
    const fullCaseHref = `/u/${profileSlug}/${projectSlug}`;
    const hasScreens = keyScreens.length > 0;

    return (
        <article className='min-h-screen bg-surface-container-low pb-16'>
            {/* Hero — обложка + заголовок + метаданные */}
            <header className='relative'>
                {coverUrl && (
                    <div className='relative h-[320px] w-full overflow-hidden bg-surface sm:h-[420px] lg:h-[480px]'>
                        <Image
                            src={coverUrl}
                            alt={title}
                            fill
                            sizes='100vw'
                            className='object-cover'
                            priority
                        />
                        <div
                            className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                            aria-hidden='true'
                        />
                    </div>
                )}
                <div className='section-container -mt-20 flex flex-col gap-4 sm:-mt-28 lg:-mt-32'>
                    <div className='flex flex-col gap-3'>
                        {categories.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {categories.map((cat) => (
                                    <TagBadge key={cat} label={cat} />
                                ))}
                            </div>
                        )}
                        <h1 className='font-display text-headline-sm text-on-surface lg:text-headline-md'>
                            {title}
                        </h1>
                        {teaser && (
                            <p className='text-body-lg text-on-surface-variant'>
                                {teaser}
                            </p>
                        )}
                        {metadata && (
                            <p className='text-body-sm text-on-surface-variant'>
                                {metadata}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* Body — Problem / Goal / Results / Key screens / Takeaway */}
            <div className='section-container mt-12 flex flex-col gap-12 lg:mt-16'>
                {(problemSnippet || goal) && (
                    <section className='flex flex-col gap-6 lg:flex-row lg:gap-12'>
                        {problemSnippet && (
                            <div className='flex flex-1 flex-col gap-3'>
                                <SectionLabel>Problem</SectionLabel>
                                <p className='text-body-lg text-on-surface'>
                                    {firstSentences(problemSnippet)}
                                </p>
                            </div>
                        )}
                        {goal && (
                            <div className='flex flex-1 flex-col gap-3'>
                                <SectionLabel>Goal</SectionLabel>
                                <p className='text-body-lg text-on-surface'>
                                    {goal}
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {metrics.length > 0 && (
                    <section className='flex flex-col gap-4'>
                        <SectionLabel>Results</SectionLabel>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {metrics.map((metric, i) => (
                                <div
                                    key={i}
                                    className='rounded-2xl border border-outline-variant bg-surface-container-lowest p-6'
                                >
                                    <p className='font-display text-headline-sm text-primary'>
                                        {metric.value}
                                    </p>
                                    {metric.description && (
                                        <p className='mt-1 text-body-sm text-on-surface-variant'>
                                            {metric.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {hasScreens && (
                    <section className='flex flex-col gap-4'>
                        <SectionLabel>Key screens</SectionLabel>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {keyScreens.map((asset) => (
                                <div
                                    key={asset.id}
                                    className='relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest'
                                >
                                    {asset.url && (
                                        <Image
                                            src={asset.url}
                                            alt={asset.alt ?? ''}
                                            fill
                                            sizes='(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw'
                                            className='object-cover'
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {takeaway && (
                    <section className='flex flex-col gap-3'>
                        <SectionLabel>Takeaway</SectionLabel>
                        <p className='text-body-lg text-on-surface'>
                            {takeaway}
                        </p>
                    </section>
                )}

                {/* CTA → полный кейс */}
                <section className='flex flex-col items-start gap-6 border-t border-outline-variant pt-8'>
                    <Link
                        href={fullCaseHref}
                        className='inline-flex h-12 items-center gap-2 rounded-5xl bg-primary px-6 text-label-lg font-medium text-on-primary transition-opacity hover:opacity-90'
                    >
                        View full case study
                        <ArrowRight className='h-4 w-4' aria-hidden='true' />
                    </Link>
                    <p className='text-body-sm text-on-surface-variant'>
                        More work by{' '}
                        <Link
                            href={`/u/${profileSlug}`}
                            className='text-primary hover:opacity-80'
                        >
                            {profileName}
                        </Link>
                    </p>
                </section>
            </div>
        </article>
    );
}
