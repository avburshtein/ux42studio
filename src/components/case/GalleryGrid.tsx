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
            <div className={cn('flex flex-col gap-6', className)}>
                {assets.map((asset) => (
                    <figure
                        key={asset.id}
                        className='flex flex-col gap-3'
                    >
                        <div className='relative aspect-[1072/420] w-full overflow-hidden rounded-xl bg-surface-variant'>
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
              : 'grid-cols-1';

    return (
        <div className={cn('grid grid-cols-1 gap-6', colsClass, className)}>
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
