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
                {/* Before — label НАД изображением: текст описания ниже
                    занимает всю ширину карточки, без отступа от inline-лейбла
                    (фидбэк 2026-09-18) */}
                <div className='flex flex-col gap-3'>
                    <span className='text-label-md font-semibold uppercase text-outline'>
                        Before
                    </span>
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
                    {beforeText && (
                        <p className='text-body-sm text-on-surface-variant'>
                            {beforeText}
                        </p>
                    )}
                </div>

                {/* After — label НАД изображением, текст — на всю ширину */}
                <div className='flex flex-col gap-3'>
                    <span className='text-label-md font-semibold uppercase text-primary'>
                        After
                    </span>
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
                    {afterText && (
                        <p className='text-body-sm text-on-surface-variant'>
                            {afterText}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
