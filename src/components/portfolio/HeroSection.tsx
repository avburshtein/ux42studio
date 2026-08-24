import Link from 'next/link';
import { FloatingElements } from '../FloatingElements';

interface HeroSectionProps {
  headlinePart1: string;
  headlineAccent: string;
  headlinePart2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

/**
 * Hero Section — Main_page_Spec §4
 * 1200×767, vertical padding 120, Background + bokeh
 */
export function HeroSection({
  headlinePart1, headlineAccent, headlinePart2,
  subtitle, primaryCtaLabel, primaryCtaHref,
  secondaryCtaLabel, secondaryCtaHref,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest px-8 py-30 lg:px-16">
      <FloatingElements count={20} minBlur={0} maxBlur={20} />

      <div className="relative z-10 flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <h1 className="flex flex-wrap font-display text-[68px] font-medium leading-[76px] tracking-[-0.25px] text-on-surface-variant">
            <span>{headlinePart1}</span>
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {headlineAccent}
            </span>
            <span>{headlinePart2}</span>
          </h1>

          <p className="max-w-[734px] text-body-lg font-normal text-on-surface">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href={primaryCtaHref}
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-button font-medium text-on-primary hover:opacity-90 transition-opacity"
          >
            {primaryCtaLabel}
          </Link>

          {secondaryCtaLabel && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="inline-flex h-14 items-center justify-center rounded-full border border-primary-container bg-surface-container-lowest px-8 text-button font-medium text-on-background shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] hover:opacity-90 active:shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] active:opacity-85 focus-visible:shadow-[0_0_0_3px_var(--md-sys-color-primary-container),2px_2px_4px_0_rgba(0,0,0,0.10)] focus-visible:opacity-100 focus-visible:outline-none"
            >
              {secondaryCtaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
