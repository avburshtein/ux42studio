import Link from 'next/link';

interface PortfolioGalleryProps {
  label?: string;
  title: string;
  subtitle?: string;
  filters?: string[];
  children: React.ReactNode;  // сетка карточек
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * Portfolio Gallery Section — Main_page_Spec §6
 * Instance ID: I124:576;87:3879;124:758
 * 1200×1450, Surface Container Lowest, border top
 */
export function PortfolioGallerySection({
  label = 'Work', title, subtitle, filters, children, viewAllHref, viewAllLabel,
}: PortfolioGalleryProps) {
  return (
    <section className="bg-surface-container-lowest px-8 py-24 lg:px-16">
      <div className="flex flex-col items-center gap-16">
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
                  : 'inline-flex items-center justify-center rounded-full border-none px-6 py-3 text-label-md font-medium text-on-background bg-[rgba(252,248,250,0.08)] transition-all duration-150 ease-out cursor-pointer hover:bg-[rgba(152,237,198,0.08)] hover:text-on-surface-variant hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] hover:-translate-y-px active:bg-[rgba(152,237,198,0.08)] active:text-on-surface-variant active:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
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
