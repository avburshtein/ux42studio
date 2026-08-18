import { cn } from '@/lib/utils';

interface ColorRole {
    name1: string;
    name2: string;
    lightColor1: string;
    lightColor2: string;
    darkColor1: string;
    darkColor2: string;
    lightContrastRatio?: number | null;
    darkContrastRatio?: number | null;
}

interface DesignSystemColorsProps {
    roles: ColorRole[];
    className?: string;
}

// Цветовые токены из БД (colorRoles)
// Figma: Color tokens [280:210] — swatches с контрастом
export function DesignSystemColors({
    roles,
    className,
}: DesignSystemColorsProps) {
    if (roles.length === 0) return null;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {roles.map((role) => (
                    <div
                        key={role.name2 + role.lightColor1}
                        className='flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-card'
                    >
                        <div className='flex flex-col gap-0.5'>
                            <span className='text-label-md font-medium text-on-surface'>
                                {role.name1}
                            </span>
                            <span className='text-label-sm text-on-surface-variant'>
                                {role.name2}
                            </span>
                        </div>

                        {/* Light scheme swatches */}
                        <div className='flex flex-col gap-1.5'>
                            <span className='text-label-sm uppercase text-outline'>
                                Light
                            </span>
                            <div className='flex gap-2'>
                                <div
                                    className='flex h-20 flex-1 items-end overflow-hidden rounded-base p-2'
                                    style={{
                                        backgroundColor: role.lightColor1,
                                    }}
                                >
                                    <span
                                        className='text-label-sm font-semibold'
                                        style={{
                                            color: role.lightColor2,
                                        }}
                                    >
                                        {role.lightColor1.toUpperCase()}
                                    </span>
                                </div>
                                <div
                                    className='flex h-20 flex-1 items-end overflow-hidden rounded-base p-2'
                                    style={{
                                        backgroundColor: role.lightColor2,
                                    }}
                                >
                                    <span
                                        className='text-label-sm font-semibold'
                                        style={{
                                            color: role.lightColor1,
                                        }}
                                    >
                                        {role.lightColor2.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            {role.lightContrastRatio && (
                                <div className='flex items-center gap-2'>
                                    <span className='inline-flex h-6 items-center rounded-full bg-surface-variant px-2 text-label-sm font-medium text-on-surface-variant'>
                                        {role.lightContrastRatio.toFixed(1)}:1
                                    </span>
                                    <span className='text-body-sm text-on-surface-variant'>
                                        {role.lightContrastRatio >= 7
                                            ? 'AAA'
                                            : role.lightContrastRatio >= 4.5
                                              ? 'AA'
                                              : 'Fail'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Dark scheme swatches (Figma: Dark Scheme фрейм) */}
                        <div className='flex flex-col gap-1.5'>
                            <span className='text-label-sm uppercase text-outline'>
                                Dark
                            </span>
                            <div className='flex gap-2'>
                                <div
                                    className='flex h-14 flex-1 items-end overflow-hidden rounded-base p-2'
                                    style={{
                                        backgroundColor: role.darkColor1,
                                    }}
                                >
                                    <span
                                        className='text-label-sm font-semibold'
                                        style={{
                                            color: role.darkColor2,
                                        }}
                                    >
                                        {role.darkColor1.toUpperCase()}
                                    </span>
                                </div>
                                <div
                                    className='flex h-14 flex-1 items-end overflow-hidden rounded-base p-2'
                                    style={{
                                        backgroundColor: role.darkColor2,
                                    }}
                                >
                                    <span
                                        className='text-label-sm font-semibold'
                                        style={{
                                            color: role.darkColor1,
                                        }}
                                    >
                                        {role.darkColor2.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            {role.darkContrastRatio && (
                                <div className='flex items-center gap-2'>
                                    <span className='inline-flex h-6 items-center rounded-full bg-surface-variant px-2 text-label-sm font-medium text-on-surface-variant'>
                                        {role.darkContrastRatio.toFixed(1)}:1
                                    </span>
                                    <span className='text-body-sm text-on-surface-variant'>
                                        {role.darkContrastRatio >= 7
                                            ? 'AAA'
                                            : role.darkContrastRatio >= 4.5
                                              ? 'AA'
                                              : 'Fail'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
