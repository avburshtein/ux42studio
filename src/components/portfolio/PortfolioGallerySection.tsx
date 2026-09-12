'use client';

import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CtaButton } from './CtaButton';
import { Carousel } from './Carousel';
import type { ButtonVariant } from '@/lib/mainPageContent';

export interface GalleryItem {
  /** Основная категория карточки — по ней работает фильтр */
  category: string;
  node: React.ReactNode;
}

interface PortfolioGalleryProps {
  title: string;
  subtitle?: string;
  filters?: string[];
  /** Карточки с категорией — включает фильтрацию (клиентскую) */
  items?: GalleryItem[];
  /** Альтернатива items: статичная сетка без фильтрации */
  children?: React.ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  viewAllVariant?: ButtonVariant;
}

// Классы чипа фильтра — общие для мобильного disclosure и десктопного ряда
const chipClass = (selected: boolean) =>
  selected
    ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-[box-shadow,opacity] duration-150 ease-out cursor-pointer hover:opacity-90 hover:shadow-[0_8px_16px_rgba(0,0,0,0.20)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-colors duration-150 ease-out cursor-pointer hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_10%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

/**
 * Portfolio Gallery Section — Main_page_Spec §6 (эталон: U5OjywCHbtzQgBsi7PU25r, узел 124:575)
 * Блок во всю ширину (bg + py 48/96) → .section-container (max-w 1280 + px 24/48/64).
 * Содержимое: Section Header (centered, gap 32) → Filters (gap 12) → Grid 3×, gap 24.
 */
export function PortfolioGallerySection({
  title, subtitle, filters, items, children, viewAllHref, viewAllLabel, viewAllVariant,
}: PortfolioGalleryProps) {
  // Фильтрация клиентская: 'All' + категории из filters.
  const [active, setActive] = useState('All');
  const allFilters = filters && filters.length > 0 ? ['All', ...filters] : null;
  const effectiveFilter =
    allFilters && allFilters.includes(active) ? active : 'All';

  const visibleItems = items
    ? effectiveFilter === 'All'
      ? items
      : items.filter((it) => it.category === effectiveFilter)
    : null;

  const renderChip = (f: string) => (
    <button
      key={f}
      type="button"
      role="radio"
      aria-checked={f === effectiveFilter}
      onClick={() => setActive(f)}
      className={cn(chipClass(f === effectiveFilter))}
    >
      {f}
    </button>
  );

  return (
    <section id='work' className="scroll-mt-20 bg-surface-container-lowest py-12 md:py-24">
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

        {allFilters && (
          <>
            {/* Mobile (<md): одна кнопка-фильтр со значком — раскрывает список чипов.
                Решение 2026-08-29 (13) — disclosure без JS для раскрытия. */}
            <details className="group md:hidden">
              <summary className="flex h-14 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-full border border-primary-container bg-surface-container-lowest px-8 text-button font-medium text-on-background shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] [&::-webkit-details-marker]:hidden">
                <Filter size={20} aria-hidden="true" />
                Filters
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-150 group-open:rotate-180"
                />
              </summary>
              <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-outline/40 bg-surface-container-lowest p-6 shadow-[4px_4px_12px_0_rgba(0,0,0,0.08)]">
                {allFilters.map((f) => renderChip(f))}
              </div>
            </details>

            {/* Desktop (≥md): ряд чипов как в эталоне */}
            <div className="hidden flex-wrap justify-center gap-3 md:flex">
              {allFilters.map((f) => renderChip(f))}
            </div>
          </>
        )}

        {/* <sm — карусель-стрип (компонент Carousel, решения (15)–(16), (33), (34)),
            ≥sm — сетка 2/3 (решение (13)) */}
        <Carousel>
          {visibleItems ? visibleItems.map((it) => it.node) : children}
        </Carousel>

        {viewAllHref && viewAllLabel && (
          <CtaButton href={viewAllHref} variant={viewAllVariant ?? 'primary'}>
            {viewAllLabel}
          </CtaButton>
        )}
      </div>
    </section>
  );
}
