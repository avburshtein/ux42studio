import Link from 'next/link';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioGalleryProps {
  title: string;
  subtitle?: string;
  filters?: string[];
  children: React.ReactNode;  // сетка карточек
  viewAllHref?: string;
  viewAllLabel?: string;
}

// Классы чипа фильтра — общие для мобильного disclosure и десктопного ряда
const chipClass = (selected: boolean) =>
  selected
    ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out cursor-pointer hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-colors duration-150 ease-out cursor-pointer hover:bg-[rgba(11,110,79,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/**
 * Portfolio Gallery Section — Main_page_Spec §6 (эталон: U5OjywCHbtzQgBsi7PU25r, узел 124:575)
 * Блок во всю ширину (bg + py 48/96) → .section-container (max-w 1200 + px 16/32/64).
 * Содержимое: Section Header (centered, gap 32) → Filters (gap 12) → Grid 3×, gap 24.
 */
export function PortfolioGallerySection({
  title, subtitle, filters, children, viewAllHref, viewAllLabel,
}: PortfolioGalleryProps) {
  return (
    <section id='portfolio' className="bg-surface-container-lowest py-12 md:py-24">
      <div className="section-container flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-8 text-center">
          <h2 className="font-display text-display-sm font-medium leading-tight text-on-surface">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body-lg font-normal text-on-surface-variant">
              {subtitle}
            </p>
          )}
        </div>

        {filters && filters.length > 0 && (
          <>
            {/* Mobile (<md): одна кнопка-фильтр со значком — раскрывает список чипов.
                <details> — серверный disclosure без JS (решение 2026-08-29 (13)). */}
            <details className="group md:hidden">
              <summary className="flex h-14 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-primary-container bg-surface-container-lowest px-8 text-button font-medium text-on-background shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] [&::-webkit-details-marker]:hidden">
                <Filter size={20} aria-hidden="true" />
                Filters
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-open:rotate-180"
                />
              </summary>
              <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-outline/40 bg-surface-container-lowest p-6 shadow-[4px_4px_12px_0_rgba(0,0,0,0.08)]">
                {filters.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    role="radio"
                    aria-checked={i === 0}
                    className={cn(chipClass(i === 0), 'w-full justify-start')}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </details>

            {/* Desktop (≥md): ряд чипов как в эталоне */}
            <div className="hidden flex-wrap justify-center gap-3 md:flex">
              {filters.map((f, i) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={i === 0}
                  className={chipClass(i === 0)}
                >
                  {f}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Mobile (<sm): карусель — flex-стрип со scroll-snap. Слева карточка
            выровнена по контейнеру (паддинг 16 — фидбэк: «отличный»), справа
            bleed до самого края экрана без правого поля: карточка =
            100% − 16px (327px @ 375), за ней gap-4 и 16px соседа вплотную
            к краю (решения (15), (16)). Тень карточки (вылет ~20px вниз) не
            срезается скроллером: pb-7 внутри + компенсация −mb-5 снаружи
            (вертикальный ритм прежний), sm:mb-0 — сброс в grid-режиме.
            ≥sm — сетка 2/3 (решение (13)) */}
        <div className="-mr-4 -mb-5 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-7 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:basis-[calc(100%-16px)] [&>*]:snap-start sm:mb-0 sm:mr-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-x-visible sm:pr-0 sm:pb-0 sm:[&>*]:basis-auto lg:grid-cols-3 lg:gap-6">
          {children}
        </div>

        {viewAllHref && viewAllLabel && (
          <Link
            href={viewAllHref}
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-button font-medium text-on-primary hover:opacity-90 transition-opacity"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
