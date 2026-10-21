'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    /** Куда идти, если возвращаться некуда (истории нет / пришли извне) */
    fallbackHref: string;
    /** Текст кнопки (если не передан children) */
    label?: string;
    children?: ReactNode;
    className?: string;
    iconSize?: number;
}

/**
 * Кнопка «Back» — настоящий шаг назад по истории, а не жёсткая ссылка.
 *
 * Логика: history.back() только когда предыдущая страница — нашего же сайта:
 *  - referrer с того же origin (на сайт пришли полной загрузкой с нашей страницы),
 *  - либо пустой referrer при истории > 1 (SPA-навигация внутри сайта).
 * Иначе (переход с внешнего сайта / прямая ссылка) — фолбэк fallbackHref:
 * посетитель остаётся на сайте, а не улетает обратно на источник трафика.
 */
export default function BackButton({
    fallbackHref,
    label = 'Back',
    children,
    className,
    iconSize = 18,
}: BackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        const ref = document.referrer;
        const sameOrigin = ref.startsWith(window.location.origin);
        const internalSpa = ref === '' && window.history.length > 1;
        if (sameOrigin || internalSpa) {
            router.back();
        } else {
            router.push(fallbackHref);
        }
    };

    return (
        <button
            type='button'
            onClick={handleClick}
            className={cn('cursor-pointer', className)}
        >
            <ArrowLeft size={iconSize} aria-hidden='true' />
            {children ?? label}
        </button>
    );
}
