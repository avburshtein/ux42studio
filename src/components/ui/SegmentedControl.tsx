'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedControlOption<T extends string> {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onValueChange: (value: T) => void;
    className?: string;
    /** Доступное имя группы (например, «Статус проекта»). */
    label?: string;
}

/**
 * Сегментированный переключатель (M3 segmented button): группа кнопок,
 * где выбранный сегмент подсвечен. Используется там, где нужно показать
 * и сразу сменить одно из нескольких взаимоисключающих состояний
 * (например, статус проекта) — вместо набора отдельных кнопок.
 *
 * Стиль взят из Tabs (тот же контейнер surface-variant + светлый активный
 * сегмент с тенью), чтобы两组 переключателей в админке выглядели
 * одинаково. Радио-семантика (role=radiogroup / role=radio) — состояние
 * одно из N, а не набор независимых флагов.
 */
export function SegmentedControl<T extends string>({
    options,
    value,
    onValueChange,
    className,
    label,
}: SegmentedControlProps<T>) {
    return (
        <div
            role='radiogroup'
            aria-label={label}
            className={cn(
                'inline-flex h-9 items-center rounded-md bg-[var(--md-sys-color-surface-variant)] p-1',
                className,
            )}
        >
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type='button'
                        role='radio'
                        aria-checked={active}
                        disabled={opt.disabled}
                        onClick={() => onValueChange(opt.value)}
                        className={cn(
                            'inline-flex h-7 items-center justify-center whitespace-nowrap rounded-sm px-2.5 text-label-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-background)] disabled:pointer-events-none disabled:opacity-50',
                            active
                                ? 'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] shadow-sm'
                                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]',
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

export default SegmentedControl;
