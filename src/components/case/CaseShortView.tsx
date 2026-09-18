import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from './BlockLabel';

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
            {/* Hero — тот же паттерн, что у полного кейса (Hero.tsx):
                full-bleed <lg, карта в контейнере ≥lg (rounded-b-3xl).
                Заголовок/теги/teaser — absolute-оверлей ВНУТРИ обложки.
                Раньше текстовый блок шёл соседом с отрицательным margin:
                absolute-картинка (Image fill) рисуется выше in-flow контента,
                поэтому title/теги «исчезали» под обложкой (фидбэк 2026-09-18). */}
            <header className='bg-background pb-8'>
                <div className='section-container flex w-full flex-col gap-6'>
                    <div className='relative -mx-4 h-[320px] w-[calc(100%+32px)] overflow-hidden bg-background sm:h-[420px] md:-mx-8 md:w-[calc(100%+64px)] lg:mx-0 lg:h-[555px] lg:w-auto lg:rounded-b-3xl'>
                        {coverUrl ? (
                            <Image
                                src={coverUrl}
                                alt={title}
                                fill
                                sizes='(max-width: 1023px) 100vw, (max-width: 1263px) calc(100vw - 128px), 1072px'
                                className='object-cover'
                                priority
                            />
                        ) : (
                            <div className='hero-block-gradient h-full w-full' />
                        )}

                        {/* Scrim gradient — тот же класс, что в Hero */}
                        <div
                            className='hero-image-scrim absolute inset-0'
                            aria-hidden='true'
                        />

                        {/* Title overlay — absolute bottom (паттерн Hero).
                            Пилюли тегов — как на полном кейсе: полупрозрачный
                            белый + blur, читаются на любом фото. */}
                        <div className='absolute inset-x-0 bottom-0 flex flex-col gap-4 px-4 pb-6 sm:px-8 sm:pb-8 lg:px-16 lg:pb-16'>
                            {categories.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {categories.map((cat) => (
                                        <span
                                            key={cat}
                                            className='inline-flex items-center rounded-full bg-[rgba(255,255,255,0.16)] px-3 py-1 text-label-sm font-medium uppercase tracking-[0.0455em] text-white backdrop-blur-sm'
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1 className='font-display text-[32px] font-medium leading-[40px] text-white sm:text-display-sm sm:leading-[60px]'>
                                {title}
                            </h1>
                            {teaser && (
                                <p className='max-w-3xl text-body-md text-white/80 sm:text-body-lg'>
                                    {teaser}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Metadata-строка (client · year · duration · role) —
                        под обложкой, по оси section-container */}
                    {metadata && (
                        <p className='text-body-sm text-on-surface-variant'>
                            {metadata}
                        </p>
                    )}
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
