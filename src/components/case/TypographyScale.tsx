import { cn } from '@/lib/utils';
import { SectionLabel } from './BlockLabel';

interface TypographyScaleProps {
    displayFont?: string | null;
    bodyFont?: string | null;
    className?: string;
}

// Шкала типографики: образцы display- и body-шрифтов
// Figma: Moodboard/TypeScale Grid [280:214] — 2 ряда по 3 образца
export function TypographyScale({
    displayFont,
    bodyFont,
    className,
}: TypographyScaleProps) {
    if (!displayFont && !bodyFont) return null;

    // Figma: Typography Scale [280:217] — 1072×351
    // Единый контейнер с border, radius=20, 4 строки (Display Large, Display Small, Body Large, Body Small)
    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <SectionLabel>Type scale</SectionLabel>
            <div className='flex flex-col overflow-hidden rounded-[12px] border border-outline-variant bg-surface-container-lowest'>
                {displayFont && (
                    <>
                        {/* Row 1: Display Large */}
                        <div className='flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
                            <span className='shrink-0 text-label-md text-on-surface-variant'>
                                Display Large
                            </span>
                            <span className='font-display text-display-sm text-on-surface'>
                                {displayFont} — Aa Bb Cc
                            </span>
                        </div>
                        {/* Row 2: Display Small */}
                        <div className='flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
                            <span className='shrink-0 text-label-md text-on-surface-variant'>
                                Display Small
                            </span>
                            <span className='font-display text-headline-sm text-on-surface'>
                                {displayFont} — The quick brown fox
                            </span>
                        </div>
                    </>
                )}
                {bodyFont && (
                    <>
                        {/* Row 3: Body Large */}
                        <div className='flex flex-col gap-3 border-b border-outline-variant px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
                            <span className='shrink-0 text-label-md text-on-surface-variant'>
                                Body Large
                            </span>
                            <span className='font-body text-body-lg text-on-surface'>
                                {bodyFont} — The quick brown fox jumps over the lazy dog
                            </span>
                        </div>
                        {/* Row 4: Body Small */}
                        <div className='flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
                            <span className='shrink-0 text-label-md text-on-surface-variant'>
                                Body Small
                            </span>
                            <span className='font-body text-body-sm text-on-surface-variant'>
                                {bodyFont} — Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
