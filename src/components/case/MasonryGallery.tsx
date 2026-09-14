'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Lightbox } from './Lightbox';

interface MasonryAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
    /** Натуральные размеры (files.width/height) — пропорции кадра */
    width?: number | null;
    height?: number | null;
}

interface MasonryGalleryProps {
    assets: MasonryAsset[];
    className?: string;
}

// Masonry-вариант финальной галереи (Pinterest-стиль, решение (51)
// 2026-09-14 в Main_page_Spec.md) — для иллюстраторов/фотографов:
// оригинальные пропорции кадров (никакого кропа), 2 колонки на mobile,
// 3 на ≥lg. Все фото показываются сразу (длинная страница здесь
// осознанный выбор автора), caption под фото — одна строка с «…» по
// ширине колонки, влево (решение (55)), клик — общий лайтбокс.
// next/image с width/height из files — инверсия только при отсутствии
// размеров в БД (fallback квадрат).
export function MasonryGallery({ assets, className }: MasonryGalleryProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (assets.length === 0) return null;

    return (
        <>
            <div
                className={cn(
                    'columns-2 gap-4 lg:columns-3 [&>*]:mb-4',
                    className,
                )}
            >
                {assets.map((asset, index) => (
                    <button
                        key={asset.id}
                        type='button'
                        onClick={() =>
                            asset.url && setOpenIndex(index)
                        }
                        aria-label={
                            asset.url
                                ? `Open photo ${index + 1} of ${assets.length}`
                                : undefined
                        }
                        className={cn(
                            'group block w-full break-inside-avoid text-left',
                            asset.url && 'cursor-zoom-in',
                        )}
                    >
                        <figure className='flex flex-col gap-2'>
                            <span className='block overflow-hidden rounded-xl bg-surface-variant'>
                                {asset.url ? (
                                    asset.width && asset.height ? (
                                        <Image
                                            src={asset.url}
                                            alt={
                                                asset.alt ??
                                                asset.caption ??
                                                ''
                                            }
                                            width={asset.width}
                                            height={asset.height}
                                            sizes='(max-width: 1024px) 50vw, 33vw'
                                            className='h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]'
                                        />
                                    ) : (
                                        // Размеры не записаны в БД —
                                        // держим квадрат, чтобы columns
                                        // не схлопнулся
                                        <Image
                                            src={asset.url}
                                            alt={
                                                asset.alt ??
                                                asset.caption ??
                                                ''
                                            }
                                            width={800}
                                            height={800}
                                            sizes='(max-width: 1024px) 50vw, 33vw'
                                            className='h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]'
                                        />
                                    )
                                ) : (
                                    <span className='flex aspect-square items-center justify-center text-body-sm text-on-surface-variant'>
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
                ))}
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