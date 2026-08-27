import Link from 'next/link';

interface PortfolioGalleryProps {
  title: string;
  subtitle?: string;
  filters?: string[];
  children: React.ReactNode;  // сетка карточек
  viewAllHref?: string;
  viewAllLabel?: string;
}

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
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f, i) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={i === 0}
                className={i === 0
                  ? 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-primary bg-surface-tint shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-all duration-150 ease-out cursor-pointer hover:shadow-[4px_4px_12px_0_rgba(11,110,79,0.20)] hover:-translate-y-px active:shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-surface/8 transition-all duration-150 ease-out cursor-pointer hover:bg-on-primary-container/8 hover:text-on-surface-variant hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] hover:-translate-y-px active:bg-on-primary-container/8 active:text-on-surface-variant active:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                }
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
