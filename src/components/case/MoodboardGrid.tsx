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

    // Пресет рассчитан на 8-колоночный грид и действует только на lg+.
    // Ниже lg: mobile 2 колонки, sm 4 (равномерные ячейки без span'ов).
    // Классы собираются конкатенацией в рантайме — сканер Tailwind их
    // не видит, поэтому lg:col-span-{2,3,4,5,8} / lg:row-span-{1,2}
    // явно сгенерированы в globals.css через @source inline (TW 4.1+).
    const presetClasses = (cls: string) =>
        cls
            .split(/\s+/)
            .filter(Boolean)
            .map((c) => `lg:${c}`)
            .join(' ');

    return (
        <div className='grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8'>
            {preset.layoutClasses.map((className, index) => {
                const asset = assets[index];
                return (
                    <div
                        key={asset?.id ?? index}
                        className={`${presetClasses(className)} overflow-hidden rounded-lg bg-[var(--md-sys-color-surface-variant)]`}
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
