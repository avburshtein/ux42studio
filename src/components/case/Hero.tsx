import Image from 'next/image';
import { cn } from '@/lib/utils';
import { MetadataCard } from './MetadataCard';

interface HeroProps {
    title: string;
    teaser?: string | null;
    coverUrl?: string;
    categories: string[];
    client?: string | null;
    timeline?: string;
    role?: string | null;
    devices?: string | null;
    className?: string;
}

// Hero Outer (ID: 198:1312) — 1200×775
// ├── Image + Title (1200×555) — hero image + scrim + title overlay
// └── Metadata Grid (1200×172) — 4 карточки, gap=24, pad=64
export function Hero({
    title,
    teaser,
    coverUrl,
    categories,
    client,
    timeline,
    role,
    devices,
    className,
}: HeroProps) {
    return (
        <section
            className={cn(
                'flex w-full flex-col bg-background pb-8',
                className,
            )}
        >
            {/* Паттерн главной: full-bleed band → section-container
                (max-w 1200 + px 16/32/64) — все блоки кейса одной ширины. */}
            <div className='section-container flex w-full flex-col gap-8'>
            {/* === Cover-карта — radius 24 по иерархии карточек (deviation
                от spec «1200, radius=0» — осознанно, фидбэк (13)) === */}
            <div className='relative h-[320px] w-full overflow-hidden rounded-3xl bg-background sm:h-[420px] lg:h-[555px]'>
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes='(max-width: 767px) calc(100vw - 32px), (max-width: 1263px) calc(100vw - 64px), 1072px'
                        className='object-cover'
                        priority
                    />
                ) : (
                    <div className='hero-block-gradient h-full w-full' />
                )}

                {/* Scrim gradient (bottom→top dark) */}
                <div
                    className='hero-image-scrim absolute inset-0'
                    aria-hidden='true'
                />

                {/* Title overlay — absolute bottom.
                    Горизонтальные паддинги = осям section-container
                    (16/32/64): картинка edge-to-edge контейнера, поэтому
                    заголовок встаёт на одну вертикаль с текстом секций. */}
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
                    {/* Пропорциональное уменьшение на мобильных (паттерн главной
                        40/48→68/76): 32/40 → sm display-sm 52/60. Иначе длинный
                        заголовок не помещается и оверлей срезается под шапкой. */}
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

            {/* === Metadata Grid — 4 cards, gap=24, pad=64 ===
                Адаптив: на <sm складывается в колонку (Mobile Frame §11
                «Metadata Grid stacks vertically»), sm 2×2, lg+ — ряд 4×1.
                section-container: выравнивание 16/32/64 как у шапки/футера. */}
            {/* 2×2 на мобильных (фидбэк: стопка — слишком много места),
                sm 2×2 с шагом 24, lg+ ряд 4×1. Горизонтальный паддинг даёт
                обёртка section-container — свой контейнер не нужен. */}
            <div className='grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-6'>
                <MetadataCard label='Client' value={client ?? '—'} />
                <MetadataCard label='Timeline' value={timeline ?? '—'} />
                <MetadataCard label='My role' value={role ?? '—'} />
                <MetadataCard label='Devices' value={devices ?? '—'} />
            </div>
            </div>
        </section>
    );
}
