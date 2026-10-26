'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface AdaptiveHeroCoverProps {
    coverUrl?: string;
    alt: string;
    sizes: string;
    /** Оверлей (плашки категорий + заголовок + teaser) — рендерится
     *  на сервере в Hero и передаётся children'ом */
    children: ReactNode;
}

/**
 * Обложка hero с адаптивным скримом (фидбэк 2026-10-26: на светлых
 * обложках белый заголовок терял контраст — статичный градиент
 * rgba(27,27,29,.75→0) слишком слаб в средней зоне, где лежит высокий
 * display-заголовок).
 *
 * Принцип: текст оверлея ВСЕГДА белый (консистентность с плашками категорий
 * и teaser white/80 — менять цвет текста не стали бы: сломало бы токены и
 * тёмную тему). Подстраивается scrim:
 *
 * 1. Яркость меряется НЕ процентами кадра, а по реальному rect оверлея
 *    (overlayRef — children обёрнуты в реальный бокс): p85 гистограммы по
 *    двум полосам — верхняя (заголовок) и нижняя (teaser). Перцентиль, а не
 *    среднее — пёстрые светлые обложки с белыми пятнами дают высокий p85.
 * 2. Альфа — из формулы контраста a ≥ 1 − порог/L (L_eff = L·(1−a)):
 *    низ порог 0.13 (≥4.5:1 для body), верх порог 0.21 (≥3.9:1 для крупного
 *    заголовка). Тёмная обложка → скрим слабее (минимумы), светлая → почти
 *    сплошное затемнение overlay-зоны.
 * 3. Градиент якорится к верхней границе overlay (стоп T = 1 − ry): на
 *    мобиле overlay занимает почти всю обложку → весь кадр затемнён
 *    (заголовок уезжает вверх и был нечитаем), на десктопе выше overlay
 *    картинка остаётся чистой.
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
    const overlayRef = useRef<HTMLDivElement>(null);
    const [scrimStyle, setScrimStyle] = useState<CSSProperties | undefined>();

    useEffect(() => {
        if (!coverUrl) return;
        const container = containerRef.current;
        const overlay = overlayRef.current;
        if (!container || !overlay) return;

        let raf = 0;
        let resizeTimer: number | undefined;

        // Яркость региона: p85 (85-й перцентиль через гистограмму 256 бинов).
        // Перцентиль, а не среднее — пёстрые обложки с белыми пятнами дают
        // высокий p85 и получают более плотный скрим (фидбэк: «пестрит белым»).
        const regionLum = (
            ctx: CanvasRenderingContext2D,
            x: number,
            y: number,
            w: number,
            h: number,
        ): number | null => {
            if (w <= 0 || h <= 0) return null;
            try {
                const data = ctx.getImageData(x, y, w, h).data;
                const hist = new Uint32Array(256);
                for (let i = 0; i < data.length; i += 4) {
                    hist[
                        (0.2126 * data[i] +
                            0.7152 * data[i + 1] +
                            0.0722 * data[i + 2]) |
                            0
                    ]++;
                }
                const target = Math.ceil((data.length / 4) * 0.85);
                let acc = 0;
                for (let v = 0; v < 256; v++) {
                    acc += hist[v];
                    if (acc >= target) return v / 255;
                }
                return 1;
            } catch {
                // Cross-origin канвас → SecurityError: остаёмся на статичном скриме
                return null;
            }
        };

        // L полосы → альфа из формулы контраста: под чёрным скримом
        // L_eff = L·(1−a); нужен L_eff ≤ порог → a ≥ 1 − порог/L.
        // Низ (teaser, body) — порог 0.13 (≥4.5:1), верх (заголовок, large)
        // — 0.21 (≥3.9:1). Минимумы оставляют тёмным обложкам «воздух».
        const alphaFor = (
            l: number,
            threshold: number,
            min: number,
            max: number,
        ) => Math.min(max, Math.max(min, 1 - threshold / Math.max(l, 0.3)));

        const applyScrim = () => {
            const img = container.querySelector('img');
            if (!img || !img.complete || !img.naturalWidth) return;
            const cw = container.clientWidth;
            const ch = container.clientHeight;
            if (!cw || !ch) return;
            const cRect = container.getBoundingClientRect();
            const oRect = overlay.getBoundingClientRect();
            if (oRect.height <= 0) return;
            try {
                const W = 200;
                const H = Math.max(1, Math.round((ch / cw) * W));
                const canvas = document.createElement('canvas');
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext('2d', {
                    willReadFrequently: true,
                });
                if (!ctx) return;
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
                // Rect overlay в координатах канваса — градиент якорится
                // к РЕАЛЬНОМУ блоку текста, а не к низу контейнера процентами:
                // на мобиле заголовок занимает почти всю обложку и процентные
                // стопы оставляли верхние строки без скрима (фидбэк 2026-10-26).
                const x0 = Math.max(
                    0,
                    Math.round(((oRect.left - cRect.left) / cRect.width) * W),
                );
                const x1 = Math.min(
                    W,
                    Math.round(((oRect.right - cRect.left) / cRect.width) * W),
                );
                const yTop = Math.max(
                    0,
                    Math.round(((oRect.top - cRect.top) / cRect.height) * H),
                );
                const yBot = Math.min(
                    H,
                    Math.round(
                        ((oRect.bottom - cRect.top) / cRect.height) * H,
                    ),
                );
                const bandH = yBot - yTop;
                if (bandH < 8) return;
                // Верхняя полоса overlay — заголовок, нижняя — teaser
                const topBand = yTop + Math.round(bandH * 0.25);
                const botBand = yBot - Math.round(bandH * 0.25);
                const lt = regionLum(ctx, x0, yTop, x1 - x0, topBand - yTop);
                const lb = regionLum(ctx, x0, botBand, x1 - x0, yBot - botBand);
                if (lt == null || lb == null) return;
                const a0 = alphaFor(lb, 0.13, 0.55, 0.96);
                const a1 = alphaFor(lt, 0.21, 0.45, 0.9);
                // T — верхняя граница overlay в % от низа контейнера
                const T = Math.round(
                    (1 - (oRect.top - cRect.top) / cRect.height) * 100,
                );
                const fade = Math.min(100, T + 14);
                setScrimStyle({
                    backgroundImage:
                        T >= 100
                            ? // Overlay доходит до верха: без прозрачного хвоста
                              `linear-gradient(0deg, rgba(27,27,29,${a0.toFixed(2)}) 0%, rgba(27,27,29,${a1.toFixed(2)}) 100%)`
                            : `linear-gradient(0deg, rgba(27,27,29,${a0.toFixed(2)}) 0%, rgba(27,27,29,${a1.toFixed(2)}) ${T}%, rgba(27,27,29,0) ${fade}%)`,
                });
            } catch {
                return;
            }
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
                градиент, якорящийся к overlay-боксу (см. комментарий выше) */}
            <div
                className='hero-image-scrim absolute inset-0'
                aria-hidden='true'
                style={scrimStyle}
            />

            {/* Дети в реальном боксе с ref — по нему замеряется rect оверлея
                (заголовок+teaser) для якорного градиента. Без этого бокса
                замерять нечего: children — просто узел без своего rect */}
            <div ref={overlayRef}>{children}</div>
        </div>
    );
}
