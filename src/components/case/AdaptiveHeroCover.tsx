'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface AdaptiveHeroCoverProps {
    coverUrl?: string;
    alt: string;
    sizes: string;
    /** Оверлей (плашки категорий + заголовок) — рендерится
     *  на сервере в Hero и передаётся children'ом. Teaser — под обложкой */
    children: ReactNode;
}

/**
 * Обложка hero с адаптивным скримом (фидбэк 2026-10-26: на светлых
 * обложках белый заголовок терял контраст — статичный градиент
 * rgba(27,27,29,.75→0) слишком слаб в средней зоне, где лежит высокий
 * display-заголовок).
 *
 * Принцип: текст оверлея ВСЕГДА белый (консистентность с плашками категорий;
 * teaser больше не на обложке — вынесен под неё в Hero, на мобиле скрыт,
 * фидбэк 2026-10-26). Подстраивается scrim: после загрузки обложки замеряем
 * среднюю относительную яркость кадра и строим инлайн-градиент с плавным
 * длинным хвостом: тёмная обложка → скрим слабее (картинка и так контрастна),
 * светлая → сильнее и выше. При L≈0.45 градиент совпадает со статичным из
 * globals.css — переход незаметен. (v2 — p85 по полосам, альфа из формулы
 * контраста, якорь к rect оверлея — откатил: скрим выходил слишком плотным
 * и с резким переходом.)
 *
 * Замер только на клиенте: Workers Free = 10ms CPU/query — декодировать
 * обложку 2560px на сервере нельзя. Канвас 200px шириной + getImageData —
 * дешевле кадра анимации. До замера работает статичный скрим из CSS.
 */
export function AdaptiveHeroCover({
    coverUrl,
    alt,
    sizes,
    children,
}: AdaptiveHeroCoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrimStyle, setScrimStyle] = useState<CSSProperties | undefined>();

    useEffect(() => {
        if (!coverUrl) return;
        const container = containerRef.current;
        if (!container) return;

        let raf = 0;
        let resizeTimer: number | undefined;

        // Средняя относительная яркость кадра (0=чёрный, 1=белый).
        // Возврат к средней и плавному градиенту v1: band-версия с p85 и
        // якорем к rect оверлея давала слишком плотный скрим с резким
        // переходом (фидбэк 2026-10-26).
        const measureLum = (): number | null => {
            const img = container.querySelector('img');
            if (!img || !img.complete || !img.naturalWidth) return null;
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            if (!cw || !ch) return null;
            try {
                const W = 200;
                const H = Math.max(1, Math.round((ch / cw) * W));
                const canvas = document.createElement('canvas');
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext('2d', {
                    willReadFrequently: true,
                });
                if (!ctx) return null;
                // Тот же object-fit: cover (center), что у <Image fill>
                const scale = Math.max(
                    W / img.naturalWidth,
                    H / img.naturalHeight,
                );
                ctx.drawImage(
                    img,
                    (W - img.naturalWidth * scale) / 2,
                    (H - img.naturalHeight * scale) / 2,
                    img.naturalWidth * scale,
                    img.naturalHeight * scale,
                );
                // Cross-origin канвас бросит SecurityError — ловим и
                // остаёмся на статичном скриме.
                const data = ctx.getImageData(0, 0, W, H).data;
                let sum = 0;
                const n = data.length / 4;
                for (let i = 0; i < data.length; i += 4) {
                    sum +=
                        (0.2126 * data[i] +
                            0.7152 * data[i + 1] +
                            0.0722 * data[i + 2]) /
                        255;
                }
                return n ? sum / n : null;
            } catch {
                return null;
            }
        };

        // L → градиент. Плавный длинный хвост без резких переходов.
        // boost 0..1 на участке L 0.45..0.75:
        //   тёмная (L≈0.2): низ 0.55, середина 0.08 — скрим почти прозрачный;
        //   средняя (L≈0.45): низ 0.75, середина 0.16 — как статичный CSS;
        //   светлая (L≈0.75+): низ 0.95, середина 0.70, верх 0.15,
        //   нижний стоп поднят до 38% — зона под высоким заголовком.
        // Контроль контраста белого заголовка: низ ≥ 12:1, зона заголовка
        // ≥ 3:1 (WCAG AA large).
        const applyScrim = () => {
            const l = measureLum();
            if (l == null) return;
            const boost = Math.min(1, Math.max(0, (l - 0.45) / 0.3));
            const bottom = 0.55 + 0.4 * boost;
            const mid = 0.08 + 0.62 * boost;
            const top = 0.15 * boost;
            const stop = Math.round(18 + 20 * boost);
            setScrimStyle({
                backgroundImage: `linear-gradient(0deg, rgba(27,27,29,${bottom.toFixed(2)}) ${stop}%, rgba(24,29,26,${mid.toFixed(2)}) 55%, rgba(27,27,29,${top.toFixed(2)}) 100%)`,
            });
        };

        const schedule = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(applyScrim);
        };

        const img = container.querySelector('img');
        if (img) {
            if (img.complete) schedule();
            img.addEventListener('load', schedule);
        }
        // Пересчёт на ресайз: пропорции зоны текста меняются (моб/десктоп)
        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(schedule, 250);
        };
        window.addEventListener('resize', onResize);
        return () => {
            img?.removeEventListener('load', schedule);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(raf);
            window.clearTimeout(resizeTimer);
        };
    }, [coverUrl]);

    return (
        // <lg — full-bleed на всю ширину экрана (-mx-4/-mx-8 повторяют
        // паддинги section-container 16/32), ≥lg — карта 1072 в контейнере:
        // верхние углы прямые, нижние скруглены (24)
        <div
            ref={containerRef}
            className='relative -mx-4 flex min-h-[400px] w-[calc(100%+32px)] flex-col justify-end overflow-hidden bg-background sm:min-h-[480px] md:-mx-8 md:w-[calc(100%+64px)] lg:mx-0 lg:min-h-[555px] lg:w-auto lg:rounded-b-3xl'
        >
            {coverUrl ? (
                <Image
                    src={coverUrl}
                    alt={alt}
                    fill
                    sizes={sizes}
                    className='object-cover'
                    priority
                />
            ) : (
                <div className='hero-block-gradient absolute inset-0' />
            )}

            {/* Scrim: статичный из globals.css до замера, затем инлайн
                градиент под яркость обложки (см. комментарий выше) */}
            <div
                className='hero-image-scrim absolute inset-0'
                aria-hidden='true'
                style={scrimStyle}
            />

            {children}
        </div>
    );
}
