'use client';

import { useEffect, useState } from 'react';
import { Images, X } from 'lucide-react';
import { GRID_PRESETS } from '@/lib/grid-presets.config';

interface MoodboardAsset {
    id: string;
    url?: string;
    caption?: string | null;
    alt?: string;
}

interface MoodboardGridProps {
    assets: MoodboardAsset[];
    presetId?: string | null;
}

export function MoodboardGrid({ assets, presetId }: MoodboardGridProps) {
    const [expanded, setExpanded] = useState(false);
    const preset = presetId ? GRID_PRESETS[presetId] : null;

    // Оверлей: блокируем скролл страницы, закрываем по Esc
    useEffect(() => {
        if (!expanded) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpanded(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [expanded]);

    if (assets.length === 0) return null;

    if (!preset) {
        // Fallback: простая сетка 2 колонки
        return (
            <div className='grid grid-cols-2 gap-4'>
                {assets.map((asset) => (
                    <div key={asset.id} className='overflow-hidden rounded-lg'>
                        {asset.url ? (
                            <img
                                src={asset.url}
                                alt={asset.alt ?? asset.caption ?? ''}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full aspect-video bg-[var(--md-sys-color-surface-variant)] flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] text-sm'>
                                Нет фото
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Пресет рассчитан на 8-колоночный грид.
    // ≥lg — инлайн-композиция на странице (десктоп без изменений); span'ы
    // с префиксом lg: собираются конкатенацией в рантайме — классы
    // lg:col-span-{2,3,4,5,8} / lg:row-span-{1,2} сгенерированы в
    // globals.css через @source inline (сканер Tailwind их не видит).
    // <lg — кнопка «View moodboard» + полноэкранный оверлей: та же
    // композиция целиком, пропорционально уменьшенная (фидбэк: мудборд —
    // единый массив настроения, который нужно видеть целиком).
    const presetClasses = (cls: string) =>
        cls
            .split(/\s+/)
            .filter(Boolean)
            .map((c) => `lg:${c}`)
            .join(' ');

    return (
        <>
            {/* ≥lg: инлайн как на десктопе */}
            <div className='hidden auto-rows-[200px] grid-cols-8 gap-4 lg:grid'>
                {preset.layoutClasses.map((className, index) => {
                    const asset = assets[index];
                    return (
                        <div
                            key={asset?.id ?? index}
                            className={`${presetClasses(className)} overflow-hidden rounded-lg bg-[var(--md-sys-color-surface-variant)]`}
                        >
                            {asset?.url ? (
                                <img
                                    src={asset.url}
                                    alt={asset.alt ?? asset.caption ?? ''}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                <div className='flex h-full w-full items-center justify-center text-sm text-[var(--md-sys-color-on-surface-variant)]'>
                                    {index + 1}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* <lg: кнопка раскрытия оверлея */}
            <button
                type='button'
                onClick={() => setExpanded(true)}
                aria-expanded={expanded}
                className='inline-flex h-12 items-center gap-2 self-start rounded-full border border-outline-variant px-6 text-label-lg font-medium text-primary transition-colors duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] lg:hidden'
            >
                <Images size={20} aria-hidden='true' />
                View moodboard
            </button>

            {/* Полноэкранный оверлей: вся 8-колоночная композиция,
                уменьшенная пропорционально экрану (тайл ~37×60 @375 /
                ~70×112 @sm — пропорции десктопных 120×200 сохранены) */}
            {expanded && (
                <div
                    role='dialog'
                    aria-modal='true'
                    aria-label='Moodboard'
                    className='fixed inset-0 z-50 flex flex-col gap-4 bg-[rgba(20,22,20,0.92)] p-4 backdrop-blur-sm sm:p-6'
                >
                    <div className='flex items-center justify-between'>
                        <span className='text-label-lg font-medium uppercase tracking-[0.5px] text-white/80'>
                            Moodboard
                        </span>
                        <button
                            type='button'
                            onClick={() => setExpanded(false)}
                            aria-label='Close moodboard'
                            className='inline-flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white'
                        >
                            <X size={24} aria-hidden='true' />
                        </button>
                    </div>
                    <div className='flex flex-1 items-center justify-center'>
                        <div className='grid w-full auto-rows-[60px] grid-cols-8 gap-1 sm:auto-rows-[112px] sm:gap-2'>
                            {preset.layoutClasses.map((className, index) => {
                                const asset = assets[index];
                                return (
                                    <div
                                        key={asset?.id ?? index}
                                        className={`${className} overflow-hidden rounded-md bg-[var(--md-sys-color-surface-variant)]`}
                                    >
                                        {asset?.url ? (
                                            <img
                                                src={asset.url}
                                                alt={
                                                    asset.alt ??
                                                    asset.caption ??
                                                    ''
                                                }
                                                className='h-full w-full object-cover'
                                            />
                                        ) : (
                                            <div className='flex h-full w-full items-center justify-center text-[10px] text-white/40'>
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
