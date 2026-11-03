'use client';

import { cn } from '@/lib/utils';

/**
 * Единая рамка раздела админки.
 *
 * Раньше блоки оформлялись по-разному: редактор контента главной страницы
 * — своей рамкой с заголовком внутри, а формы профиля и настроек —
 * Card с отступом 24px. Из-за этого «зазор» между рамкой и заголовком
 * отличался от раздела к разделу (фидбэк 2026-11-03: «у первой секции
 * самый большой, у остальных меньше»).
 *
 * Теперь отступ, начертание заголовка и рамка — одни и те же везде.
 */
export function AdminSection({
    title,
    description,
    actions,
    children,
    className,
}: {
    /** Заголовок раздела. Если не задан — блок без «шапки». */
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Справа от заголовка: чекбокс, кнопка и т.п. */
    actions?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}) {
    const hasHeader = Boolean(title || description || actions);
    return (
        <section
            className={cn(
                'rounded-xl border border-outline-variant bg-surface p-3 shadow-sm',
                className,
            )}
        >
            {hasHeader && (
                <div className='mb-3 flex flex-wrap items-start justify-between gap-2'>
                    <div className='min-w-0'>
                        {title && (
                            <h2 className='text-title-sm font-semibold text-on-surface'>
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && <div className='shrink-0'>{actions}</div>}
                </div>
            )}
            {children}
        </section>
    );
}

export default AdminSection;
