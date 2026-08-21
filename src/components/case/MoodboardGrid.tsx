import { GRID_PRESETS } from '@/lib/grid-presets.config';

interface MoodboardAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
}

interface MoodboardGridProps {
    assets: MoodboardAsset[];
    presetId?: string | null;
}

export function MoodboardGrid({ assets, presetId }: MoodboardGridProps) {
    const preset = presetId ? GRID_PRESETS[presetId] : null;

    if (!preset) {
        // Fallback: простая сетка 2 колонки
        return (
            <div className='grid grid-cols-2 gap-4'>
                {assets.map((asset) => (
                    <div key={asset.id} className='overflow-hidden rounded-lg'>
                        {asset.url ? (
                            <img
                                src={asset.url}
                                alt={asset.alt ?? asset.caption ?? ''}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full aspect-video bg-[var(--md-sys-color-surface-variant)] flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] text-sm'>
                                Нет фото
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className='grid grid-cols-8 gap-4 auto-rows-[200px]'>
            {preset.layoutClasses.map((className, index) => {
                const asset = assets[index];
                return (
                    <div
                        key={asset?.id ?? index}
                        className={`${className} overflow-hidden rounded-lg bg-[var(--md-sys-color-surface-variant)]`}
                    >
                        {asset?.url ? (
                            <img
                                src={asset.url}
                                alt={asset.alt ?? asset.caption ?? ''}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] text-sm'>
                                {index + 1}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
