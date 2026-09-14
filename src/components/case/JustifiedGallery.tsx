'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';

interface JustifiedAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
    /** Натуральные размеры (files.width/height) — аспект кадра */
    width?: number | null;
    height?: number | null;
}

interface JustifiedGalleryProps {
    assets: JustifiedAsset[];
    className?: string;
}

// Justified-вариант финальной галереи («гармоничная сетка», решение (52)
// 2026-09-14 в Main_page_Spec.md; референс — портфолио фотографов типа
// ryangammaphotography.com): равновысокие ряды, края заподлицо,
// оригинальные пропорции кадров — КРОПА НЕТ. Чистый CSS, без JS/замеров:
// flex-wrap + у каждого фото flex-basis = ar × --target-h (по нему идёт
// перенос строк) и flex-grow = ar (остаток ширины ряда распределяется
// пропорционально аспектам) → все фото ряда одной высоты, бокс совпадает
// с кадром. Целевая высота ряда адаптивная: 130px mobile → 240px desktop.
// Защита от «одинокого портрета» (растянулся бы на всю строку и стал
// ~1600px высотой): у кадров ar < 1.15 кап ширины 2.2 × target-h — ряд
// может не дотянуться до правого края, это осознанный компромисс.
// Клик — общий лайтбокс; caption под фото — одна строка с «…» по ширине
// кадра, влево (решение (55); figcaption лежит внутри <button> и без
// явного text-left наследовал браузерный center).
export function JustifiedGallery({ assets, className }: JustifiedGalleryProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (assets.length === 0) return null;

    return (
        <>
            <div
                className={cn(
                    'flex flex-wrap items-start gap-4 [--target-h:130px] sm:gap-6 sm:[--target-h:200px] lg:[--target-h:240px]',
                    className,
                )}
            >
                {assets.map((asset, index) => {
                    const ar =
                        asset.width && asset.height && asset.height > 0
                            ? asset.width / asset.height
                            : 4 / 3;
                    return (
                        <button
                            key={asset.id}
                            type='button'
                            onClick={() => asset.url && setOpenIndex(index)}
                            aria-label={
                                asset.url
                                    ? `Open photo ${index + 1} of ${assets.length}`
                                    : undefined
                            }
                            style={
                                {
                                    '--ar': ar,
                                    ...(ar < 1.15 && {
                                        maxWidth: `calc(var(--ar) * var(--target-h) * 2.2)`,
                                    }),
                                } as React.CSSProperties
                            }
                            className={cn(
                                'group min-w-0 flex-[var(--ar)_1_calc(var(--ar)*var(--target-h))]',
                                asset.url && 'cursor-zoom-in',
                            )}
                        >
                            <figure className='flex flex-col gap-2'>
                                <span className='block overflow-hidden rounded-xl bg-surface-variant'>
                                    {asset.url ? (
                                        <Image
                                            src={asset.url}
                                            alt={
                                                asset.alt ??
                                                asset.caption ??
                                                ''
                                            }
                                            width={asset.width ?? 800}
                                            height={asset.height ?? 600}
                                            sizes='100vw'
                                            style={{ aspectRatio: ar }}
                                            className='h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]'
                                        />
                                    ) : (
                                        <span
                                            className='flex items-center justify-center text-body-sm text-on-surface-variant'
                                            style={{ aspectRatio: ar }}
                                        >
                                            No image
                                        </span>
                                    )}
                                </span>
                                {asset.caption && (
                                    <figcaption
                                        title={asset.caption}
                                        className='min-w-0 truncate text-left text-body-sm text-on-surface-variant'
                                    >
                                        {asset.caption}
                                    </figcaption>
                                )}
                            </figure>
                        </button>
                    );
                })}
            </div>

            <Lightbox
                assets={assets}
                openIndex={openIndex}
                onClose={() => setOpenIndex(null)}
                onNavigate={setOpenIndex}
            />
        </>
    );
}