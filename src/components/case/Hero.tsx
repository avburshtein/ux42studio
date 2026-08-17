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
        <section className={cn('flex w-full flex-col gap-8', className)}>
            {/* === Image + Title (1200×555) === */}
            <div className='relative w-full h-[320px] sm:h-[420px] lg:h-[555px] overflow-hidden bg-surface-variant'>
                {coverUrl ? (
                    <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        sizes='100vw'
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

                {/* Title overlay — absolute bottom */}
                <div className='absolute inset-x-0 bottom-0 flex flex-col gap-3 px-6 pb-8 lg:px-16 lg:pb-12'>
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
                    <h1 className='font-display text-display-sm text-white'>
                        {title}
                    </h1>
                    {teaser && (
                        <p className='max-w-3xl text-body-lg text-white/80'>
                            {teaser}
                        </p>
                    )}
                </div>
            </div>

            {/* === Metadata Grid (1200×172) — 4 cards, gap=24, pad=64 === */}
            <div className='grid grid-cols-2 gap-4 px-8 sm:gap-6 sm:px-12 lg:grid-cols-4 lg:gap-6 lg:px-16'>
                <MetadataCard label='Client' value={client ?? '—'} />
                <MetadataCard label='Timeline' value={timeline ?? '—'} />
                <MetadataCard label='My role' value={role ?? '—'} />
                <MetadataCard label='Devices' value={devices ?? '—'} />
            </div>
        </section>
    );
}
