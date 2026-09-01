'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/Switch';

// ---------------------------------------------------------------------------
// Типы
// ---------------------------------------------------------------------------

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

interface SwatchData {
    name: string;
    fill: string;
    onFill: string;
    onName: string;
    contrast: number;
}

// ---------------------------------------------------------------------------
// Утилиты
// ---------------------------------------------------------------------------

function contrastLevel(ratio: number): string {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'AA+';
}

// ---------------------------------------------------------------------------
// Вспомогательные компоненты
// ---------------------------------------------------------------------------

function ContrastBadge({
    ratio,
    level,
    textColor,
}: {
    ratio: number;
    level: string;
    textColor: string;
}) {
    return (
        <span
            className='text-[10px] font-medium leading-4'
            style={{ color: textColor, opacity: 0.7 }}
        >
            {ratio.toFixed(1)}:1 {level}
        </span>
    );
}

function SwatchBlock({
    name,
    fill,
    textColor,
    height,
    radius = 0,
    border = false,
}: {
    name: string;
    fill: string;
    textColor: string;
    height: number;
    radius?: string | number;
    border?: boolean;
}) {
    const borderRadius =
        typeof radius === 'number' ? `${radius}px` : radius;
    return (
        <div
            className={cn(
                'flex w-full items-end overflow-hidden',
                border && 'border border-outline-variant',
            )}
            style={{
                backgroundColor: fill,
                height: `${height}px`,
                borderRadius,
                padding: '8px',
            }}
        >
            <span
                className='text-[10px] font-semibold uppercase leading-4 tracking-[0.5px]'
                style={{ color: textColor }}
            >
                {name}
            </span>
        </div>
    );
}

/** Колонка-пара: верхний свотч 112px + нижний On-свотч 34px */
function ColorPairColumn({
    main,
    on,
}: {
    main: SwatchData;
    on: SwatchData;
}) {
    return (
        <div className='flex flex-col gap-0.5'>
            {/* Верхний (основной) свотч — скругления только сверху */}
            <div
                className='flex w-full items-end justify-between overflow-hidden border border-outline-variant'
                style={{
                    backgroundColor: main.fill,
                    height: '112px',
                    borderRadius: '10px 10px 0 0',
                    padding: '8px',
                }}
            >
                <span
                    className='text-[10px] font-semibold uppercase leading-4 tracking-[0.5px]'
                    style={{ color: main.onFill }}
                >
                    {main.name}
                </span>
                <ContrastBadge
                    ratio={main.contrast}
                    level={contrastLevel(main.contrast)}
                    textColor={main.onFill}
                />
            </div>

            {/* Нижний On-свотч — скругления только снизу */}
            <SwatchBlock
                name={on.name}
                fill={on.fill}
                textColor={on.onFill}
                height={34}
                radius='0 0 10px 10px'
                border
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Основной компонент
// ---------------------------------------------------------------------------

export function DesignSystemColors({
    roles,
    className,
}: DesignSystemColorsProps) {
    const [darkMode, setDarkMode] = useState(false);

    if (roles.length === 0) return null;

    const isDark = darkMode;

    // Только админские роли → Semantic swatches
    const semanticTokens: SwatchData[] = roles.map((role) => ({
        name: role.name1,
        fill: isDark ? role.darkColor1 : role.lightColor1,
        onFill: isDark ? role.darkColor2 : role.lightColor2,
        onName: role.name2,
        contrast: (isDark ? role.darkContrastRatio : role.lightContrastRatio) ?? 0,
    }));

    // Кол-во колонок в гриде: 1 роль → 1, 2 → 2, 3+ → 4
    const gridCols =
        roles.length === 1
            ? 'grid-cols-1'
            : roles.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

    return (
        <div className={cn('flex w-full flex-col gap-6', className)}>
            {/* Заголовок «COLOR TOKENS» (раздел 3) */}
            <p className='text-[11px] font-semibold uppercase leading-4 tracking-[0.5px] text-outline'>
                Color Tokens
            </p>

            {/* Карточка (раздел 4) */}
            <div
                className='flex w-full flex-col gap-3 rounded-[12px] border px-5'
                style={{
                    borderColor: 'rgba(113,118,114,0.1)',
                    backgroundColor: isDark ? '#0E0E0F' : '#FFFFFF',
                    paddingTop: '20px',
                    paddingBottom: '24px',
                }}
            >
                {/* Toggle Dark/Light Scheme (раздел 5) */}
                <div className='flex items-center gap-8'>
                    <span
                        className='text-base font-medium leading-6'
                        style={{ color: isDark ? '#E4E2E3' : '#1B1B1D' }}
                    >
                        {isDark ? 'Light Scheme' : 'Dark Scheme'}
                    </span>
                    <Switch
                        checked={isDark}
                        onCheckedChange={setDarkMode}
                    />
                </div>

                {/* Spacer 8px */}
                <div className='h-2' />

                {/* Semantic Tokens — только из админки */}
                <div className={cn('grid gap-1', gridCols)}>
                    {semanticTokens.map((token, i) => (
                        <ColorPairColumn
                            key={i}
                            main={token}
                            on={{
                                name: token.onName,
                                fill: token.onFill,
                                onFill: token.fill,
                                onName: '',
                                contrast: 0,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
