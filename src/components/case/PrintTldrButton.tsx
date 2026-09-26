'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer } from 'lucide-react';

/**
 * Ждёт загрузку всех изображений страницы перед печатью.
 * Next Image грузит картинки ниже фолда лениво (loading=lazy) —
 * без этого в PDF попадают пустые серые боксы (баг 2026-09-18).
 * Переключаем все img в eager (это триггерит загрузку отложенных)
 * и ждём complete/error с таймаутом 6 с на случай медленной сети.
 */
async function waitForImages(): Promise<void> {
    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
        if (!img.complete) img.loading = 'eager';
    });
    await Promise.race([
        Promise.all(
            imgs.map(
                (img) =>
                    new Promise<void>((res) => {
                        if (img.complete) return res();
                        img.addEventListener('load', () => res(), {
                            once: true,
                        });
                        img.addEventListener('error', () => res(), {
                            once: true,
                        });
                    }),
            ),
        ),
        new Promise((res) => setTimeout(res, 6000)),
    ]);
    // Один кадр на layout после подгрузки картинок
    await new Promise((res) => requestAnimationFrame(() => res(null)));
}

/**
 * Кнопка «Скачать PDF» на странице TL;DR (/short).
 * Открывает системный диалог печати — там «Сохранить как PDF».
 * Print-стили для страницы живут в globals.css (@media print,
 * обёртка .print-short). Решение 2026-09-18 (65).
 *
 * ?print=1 — автозапуск диалога после загрузки (используется
 * кнопкой «Скачать PDF» на Review-шаге визарда).
 */
export function PrintTldrButton() {
    const searchParams = useSearchParams();
    const [hint, setHint] = useState(false);
    const autoPrintedRef = useRef(false);

    useEffect(() => {
        if (searchParams.get('print') === '1' && !autoPrintedRef.current) {
            autoPrintedRef.current = true;
            const t = setTimeout(async () => {
                await waitForImages();
                window.print();
            }, 600);
            return () => clearTimeout(t);
        }
    }, [searchParams]);

    const openPrintDialog = async () => {
        setHint(true);
        setTimeout(() => setHint(false), 2500);
        await waitForImages();
        window.print();
    };

    return (
        <>
            {hint && (
                <div
                    role='status'
                    className='print:hidden fixed bottom-20 right-6 z-50 max-w-56 rounded-lg bg-on-surface px-4 py-2 text-body-sm text-surface shadow-lg'
                >
                    В диалоге печати выберите «Сохранить как PDF»
                </div>
            )}
            <button
                type='button'
                onClick={openPrintDialog}
                aria-label='Скачать PDF — открыть диалог печати'
                title='В диалоге печати выберите «Сохранить как PDF»'
                className='print:hidden fixed bottom-6 right-6 z-50 inline-flex h-12 items-center gap-2 rounded-5xl bg-primary px-5 text-label-lg font-medium text-on-primary shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            >
                <Printer className='h-5 w-5' aria-hidden='true' />
                Скачать PDF
            </button>
        </>
    );
}
