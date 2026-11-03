import React from 'react';
import { Label } from './Label';

type FieldProps = {
    /** Связывает подпись с контролом (`htmlFor` = `id` поля). */
    id: string;
    label: string;
    error?: string;
    /** Подсказка, показывается когда нет ошибки. */
    hint?: string;
    children: React.ReactNode;
    className?: string;
};

/**
 * Поле формы: подпись, контрол и место под подсказку/ошибку.
 *
 * Место под текст зарезервировано `min-h-[1.5rem]` — появление ошибки
 * не должно сдвигать форму (DS §3.3, No-CLS). Ошибка показывается вместо
 * подсказки, приоритет у ошибки.
 *
 * Цвет текста зависит от типа сообщения: ошибка — error (красный),
 * подсказка — обычный приглушённый текст. Раньше подсказки тоже красились
 * в красный, хотя ничего не нарушено (фидбэк 2026-11-03).
 */
export default function Field({
    id,
    label,
    error,
    hint,
    children,
    className,
}: FieldProps) {
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {children}
            <p
                className={`mt-1 min-h-[1.5rem] text-body-sm ${
                    error ? 'text-error' : 'text-on-surface-variant'
                }`}
            >
                {error ?? hint ?? ''}
            </p>
        </div>
    );
}
