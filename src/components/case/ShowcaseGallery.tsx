'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';

interface ShowcaseAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
}

interface ShowcaseGalleryProps {
    assets: ShowcaseAsset[];
    className?: string;
}

// Editorial-галерея финальных дизайнов (Section 06 Final Design;
// решение (50) 2026-09-14 в Main_page_Spec.md). Вместо «кинопленты»
// (карусель <sm / вертикальный стек 1072×420 на каждое фото) —
// композиция из первых трёх фото: длинное 1072/420 + ряд «квадрат +
// плоское» (Figma: Showcase Image master 410:539 — 1072×420, r=16;
// mobile: длинное 4/3 + пара 1/1). Любые пропорции входа — object-cover
// в фикс. слоты. Если фото > 3 — на третьем слоте постоянный оверлей
// «+N photos» (информационный: клик открывает само третье фото).
// Клик по слоту — общий лайтбокс на этом фото (Lightbox.tsx). Caption
// показывается под слотом мелкой строкой (решение (54) — раньше скрывали
// ради ровности ряда; панели фикс. aspect, подписи их высоту не меняют);
// длинная подпись — одна строка с «…» по ширине слота, влево (решение (55)).
export function ShowcaseGallery({ assets, className }: ShowcaseGalleryProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const total = assets.length;
    const visible = assets.slice(0, 3);
    const hiddenCount = Math.max(total - 3, 0);

    if (total === 0) return null;

    return (
        <div className={cn('flex flex-col gap-4 sm:gap-6', className)}>
            {/* Слот 1 — длинное (mobile 4/3, ≥sm 1072/420 — Figma-эталон) */}
            <Slot
                asset={visible[0]}
                index={0}
                total={total}
                sizes='(max-width: 640px) 100vw, 1072px'
                className='aspect-[4/3] sm:aspect-[1072/420]'
                onOpen={setOpenIndex}
            />

            {/* Ряд 2 — квадрат + плоское (mobile: пара 1/1;
                ≥sm: колонки 420fr/628fr, высота ряда 1072/420) */}
            {visible.length > 1 && (
                <div className='grid aspect-[2/1] grid-cols-2 gap-4 sm:aspect-[1072/420] sm:grid-cols-[420fr_628fr] sm:gap-6'>
                    <Slot
                        asset={visible[1]}
                        index={1}
                        total={total}
                        sizes='(max-width: 640px) 50vw, 420px'
                        className='h-full w-full'
                        onOpen={setOpenIndex}
                    />
                    {visible.length > 2 && (
                        <Slot
                            asset={visible[2]}
                            index={2}
                            total={total}
                            sizes='(max-width: 640px) 50vw, 628px'
                            className='h-full w-full'
                            onOpen={setOpenIndex}
                            overlayCount={
                                hiddenCount > 0 ? hiddenCount : undefined
                            }
                        />
                    )}
                </div>
            )}

            {/* Полноэкранный лайтбокс — общий (Lightbox.tsx) */}
            <Lightbox
                assets={assets}
                openIndex={openIndex}
                onClose={() => setOpenIndex(null)}
                onNavigate={setOpenIndex}
            />
        </div>
    );
}

interface SlotProps {
    asset?: ShowcaseAsset;
    index: number;
    total: number;
    sizes: string;
    className?: string;
    /** Информационный оверлей «+N photos» на последнем видимом слоте */
    overlayCount?: number;
    onOpen: (index: number) => void;
}

function Slot({
    asset,
    index,
    total,
    sizes,
    className,
    overlayCount,
    onOpen,
}: SlotProps) {
    return (
        <figure className='flex min-w-0 flex-col gap-2'>
            <button
                type='button'
                onClick={() => asset?.url && onOpen(index)}
                aria-label={
                    asset?.url ? `Open photo ${index + 1} of ${total}` : undefined
                }
                className={cn(
                    'group relative block overflow-hidden rounded-xl bg-surface-variant',
                    asset?.url && 'cursor-zoom-in',
                    className,
                )}
            >
                {asset?.url && (
                    <Image
                        src={asset.url}
                        alt={asset.alt ?? asset.caption ?? ''}
                        fill
                        sizes={sizes}
                        className='object-cover'
                    />
                )}
                {overlayCount !== undefined && (
                    <span
                        aria-hidden='true'
                        className='absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50'
                    >
                        <span className='font-display text-[20px] font-medium text-white sm:text-[24px]'>
                            +{overlayCount}{' '}
                            {overlayCount === 1 ? 'photo' : 'photos'}
                        </span>
                    </span>
                )}
            </button>
            {/* Caption под слотом (решение (54): раньше скрывали ради
                ровности ряда) — одна строка с «…» по ширине слота, влево
                (решение (55)); полный текст по hover (title) и в лайтбоксе */}
            {asset?.caption && (
                <figcaption
                    title={asset.caption}
                    className='min-w-0 truncate text-left text-body-sm text-on-surface-variant'
                >
                    {asset.caption}
                </figcaption>
            )}
        </figure>
    );
}