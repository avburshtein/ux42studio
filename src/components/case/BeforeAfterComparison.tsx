import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SectionLabel } from './BlockLabel';

interface BeforeAfterComparisonProps {
    featureName: string;
    beforeUrl?: string;
    afterUrl?: string;
    beforeText?: string | null;
    afterText?: string | null;
    className?: string;
}

// Блок «Before/After»: label + 2 изображения side-by-side
// Figma: Before/After (master 195:1299), gap=24
export function BeforeAfterComparison({
    featureName,
    beforeUrl,
    afterUrl,
    beforeText,
    afterText,
    className,
}: BeforeAfterComparisonProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <SectionLabel>{featureName}</SectionLabel>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {/* Before */}
                <div className='flex flex-col gap-3'>
                    <div className='relative aspect-[4/3] overflow-hidden rounded-base bg-surface-variant'>
                        {beforeUrl ? (
                            <Image
                                src={beforeUrl}
                                alt={beforeText ?? `Before — ${featureName}`}
                                fill
                                sizes='(max-width: 640px) 100vw, 50vw'
                                className='object-cover'
                            />
                        ) : (
                            <div className='flex h-full items-center justify-center text-body-sm text-on-surface-variant'>
                                No image
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-label-md font-semibold uppercase text-outline'>
                            Before
                        </span>
                        {beforeText && (
                            <span className='text-body-sm text-on-surface-variant'>
                                {beforeText}
                            </span>
                        )}
                    </div>
                </div>

                {/* After */}
                <div className='flex flex-col gap-3'>
                    <div className='relative aspect-[4/3] overflow-hidden rounded-base bg-surface-variant'>
                        {afterUrl ? (
                            <Image
                                src={afterUrl}
                                alt={afterText ?? `After — ${featureName}`}
                                fill
                                sizes='(max-width: 640px) 100vw, 50vw'
                                className='object-cover'
                            />
                        ) : (
                            <div className='flex h-full items-center justify-center text-body-sm text-on-surface-variant'>
                                No image
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-label-md font-semibold uppercase text-primary'>
                            After
                        </span>
                        {afterText && (
                            <span className='text-body-sm text-on-surface-variant'>
                                {afterText}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
