'use client';

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LightboxAsset {
    url?: string;
    caption?: string | null;
    alt?: string;
}

interface LightboxProps {
    assets: LightboxAsset[];
    openIndex: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

// Полноэкранный просмотр фото галереи кейса — общий для всех вариантов
// галереи (ShowcaseGallery / MasonryGallery / StackGallery, решение
// (50)/(51) в Main_page_Spec.md): object-contain, caption, стрелки
// ←/→ (кнопки + клавиатура, по кругу), Esc/cross — закрыть, свайп
// на тач, счётчик «n / N» (aria-live), блокировка скролла страницы.
// Паттерн оверлея — как в MoodboardGrid (dialog/aria-modal); z-[70] —
// поверх шапки (z-40) и её оверлеев (z-50).
export function Lightbox({
    assets,
    openIndex,
    onClose,
    onNavigate,
}: LightboxProps) {
    const touchStartX = useRef<number | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const total = assets.length;
    const isOpen = openIndex !== null;

    const step = useCallback(
        (delta: 1 | -1) => {
            if (openIndex === null) return;
            onNavigate((openIndex + delta + total) % total);
        },
        [openIndex, total, onNavigate],
    );

    // Открыт: блокируем скролл страницы, Esc/стрелки, фокус на close
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') step(1);
            if (e.key === 'ArrowLeft') step(-1);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onClose, step]);

    if (!isOpen) return null;

    const current = assets[openIndex];
    const currentNumber = openIndex + 1;

    return (
        <div
            role='dialog'
            aria-modal='true'
            aria-label='Photo viewer'
            className='fixed inset-0 z-[70] flex flex-col bg-[rgba(20,22,20,0.94)] backdrop-blur-sm'
        >
            <div className='flex items-center justify-between p-4 sm:p-6'>
                <span
                    aria-live='polite'
                    className='text-label-lg font-medium uppercase tracking-[0.5px] text-white/80'
                >
                    {currentNumber} / {total}
                </span>
                <button
                    ref={closeRef}
                    type='button'
                    onClick={onClose}
                    aria-label='Close photo viewer'
                    className='inline-flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white'
                >
                    <X size={24} aria-hidden='true' />
                </button>
            </div>

            {/* Фото + свайп; фон не кликабельный — закрытие Esc/cross.
                Нижний отступ рамки: кадр не примыкает к краю экрана — иначе
                читается как «часть фото скрыта» (гештальт, фидбэк (53)).
                Внутренняя рамка обязательна: fill-изображение позиционируется
                от padding-box родителя и паддингом не сдвигается */}
            <div
                className='relative min-h-0 flex-1'
                onTouchStart={(e) => {
                    touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    if (touchStartX.current === null) return;
                    const dx =
                        e.changedTouches[0].clientX - touchStartX.current;
                    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
                    touchStartX.current = null;
                }}
            >
                <div className='absolute inset-x-0 top-0 bottom-8 sm:bottom-12'>
                    {current.url && (
                        <Image
                            src={current.url}
                            alt={current.alt ?? current.caption ?? ''}
                            fill
                            sizes='100vw'
                            className='object-contain'
                            priority
                        />
                    )}
                    {total > 1 && (
                        <>
                            <button
                                type='button'
                                onClick={() => step(-1)}
                                aria-label='Previous photo'
                                className='absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:left-6'
                            >
                                <ChevronLeft size={24} aria-hidden='true' />
                            </button>
                            <button
                                type='button'
                                onClick={() => step(1)}
                                aria-label='Next photo'
                                className='absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-6'
                            >
                                <ChevronRight size={24} aria-hidden='true' />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {(current.caption || current.alt) && (
                <p className='mx-auto max-w-[720px] px-4 pb-4 pt-3 text-center text-body-sm text-white/70 sm:px-6 sm:pb-6'>
                    {current.caption ?? current.alt}
                </p>
            )}
        </div>
    );
}
