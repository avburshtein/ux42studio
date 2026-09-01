import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
    assets: Array<{
        id: string;
        url?: string;
        caption?: string | null;
        alt?: string;
    }>;
    columns?: 1 | 2 | 3;
    showcase?: boolean;
    masonry?: boolean;
    className?: string;
}

// Сетка изображений: wireframes (2 колонки) или showcase (1 колонка, full-width)
// Figma: Wireframes Grid [199:57] — 2×2, gap=24
// Figma: Showcase Image (master 410:539) — 1072×420, radius=16
export function GalleryGrid({
    assets,
    columns = 2,
    showcase = false,
    masonry = false,
    className,
}: GalleryGridProps) {
    if (assets.length === 0) return null;

    // Figma: Moodboard [271:498] — CSS GRID auto-fill min 240px, gap 16,
    // первая ячейка крупная (span 2 rows), остальные ~247×238
    if (masonry) {
        return (
            <div
                className={cn(
                    'grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[238px] sm:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]',
                    className,
                )}
            >
                {assets.map((asset, index) => (
                    <div
                        key={asset.id}
                        className={cn(
                            'relative overflow-hidden rounded-base bg-surface-variant',
                            index === 0 && 'row-span-2',
                        )}
                    >
                        {asset.url && (
                            <Image
                                src={asset.url}
                                alt={asset.alt ?? asset.caption ?? ''}
                                fill
                                sizes='(max-width: 640px) 50vw, 508px'
                                className='object-cover'
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (showcase) {
        return (
            // Карусель <sm (слайд = одна showcase-картинка 4/3), ≥sm —
            // вертикальный стек full-width 1072/420 по спеке
            <div
                className={cn(
                    '-mr-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:basis-[calc(100%-16px)] [&>*]:snap-start sm:mr-0 sm:flex-col sm:gap-6 sm:overflow-x-visible sm:pb-0 sm:pr-0 sm:snap-none sm:[&>*]:basis-auto',
                    className,
                )}
            >
                {assets.map((asset) => (
                    <figure
                        key={asset.id}
                        className='flex flex-col gap-3'
                    >
                        {/* 4/3 на <sm: 1072/420 даёт плоскую ленту 343×134 */}
                        <div className='relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-variant sm:aspect-[1072/420]'>
                            {asset.url && (
                                <Image
                                    src={asset.url}
                                    alt={asset.alt ?? asset.caption ?? ''}
                                    fill
                                    sizes='(max-width: 640px) 100vw, 1072px'
                                    className='object-cover'
                                />
                            )}
                        </div>
                        {asset.caption && (
                            <figcaption className='text-body-sm text-on-surface-variant'>
                                {asset.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        );
    }

    const colsClass =
        columns === 3
            ? 'sm:grid-cols-2 lg:grid-cols-3'
            : columns === 2
              ? 'sm:grid-cols-2'
              : '';

    // Карусель <sm (паттерн главной, решения (15)/(16) Main_page_Spec):
    // слайд = 100% контент-бокса скроллера − 16px, bleed справа (-mr-4/pr-4),
    // peek соседа 16px вплотную к краю; ≥sm — сетка по columns.
    return (
        <div
            className={cn(
                '-mr-4 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:basis-[calc(100%-16px)] [&>*]:snap-start sm:mr-0 sm:grid sm:snap-none sm:overflow-x-visible sm:pr-0 sm:pb-0 sm:[&>*]:basis-auto',
                colsClass,
                className,
            )}
        >
            {assets.map((asset) => (
                <figure
                    key={asset.id}
                    className='flex flex-col gap-3'
                >
                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-base bg-surface-variant'>
                        {asset.url && (
                            <Image
                                src={asset.url}
                                alt={asset.alt ?? asset.caption ?? ''}
                                fill
                                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                className='object-cover'
                            />
                        )}
                    </div>
                    {asset.caption && (
                        <figcaption className='text-body-sm text-on-surface-variant'>
                            {asset.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}
