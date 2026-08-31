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
 * Высота: 100dvh − 64px (mobile, шапка 64px) / − 96px (≥768) — хиро заполняет
 * первый экран целиком (решение 2026-08-27 (4)); контент центрируется по
 * вертикали, py остаются минимальными отступами на малых экранах.
 * Background + bokeh, вертикальный паддинг 48/96/120.
 */
export function HeroSection({
  headlinePart1, headlineAccent, headlinePart2,
  subtitle, primaryCtaLabel, primaryCtaHref,
  secondaryCtaLabel, secondaryCtaHref,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[calc(100dvh_-_64px)] items-center overflow-hidden bg-surface-container-lowest py-12 md:min-h-[calc(100dvh_-_96px)] md:py-24 lg:py-30">
      <FloatingElements count={20} minBlur={0} maxBlur={20} />

      <div className="section-container relative z-10 flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          {/* Заголовок в строчном потоке (без flex): пробелы между частями не схлопываются,
              переносы работают как у обычного текста. В Figma строки абсолютные (left:566) —
              в код это не переносим. */}
          <h1 className="font-display text-[40px] font-medium leading-[48px] tracking-[-0.25px] text-on-surface-variant lg:text-[68px] lg:leading-[76px]">
            {headlinePart1.trim()}
            {' '}
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              {headlineAccent.trim()}
            </span>
            {' '}
            {headlinePart2.trim()}
          </h1>

          <p className="max-w-[734px] text-body-lg font-normal text-on-surface">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <Link
            href={primaryCtaHref}
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-button font-medium whitespace-nowrap text-on-primary shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)]"
          >
            {primaryCtaLabel}
          </Link>

          {secondaryCtaLabel && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="inline-flex h-14 items-center justify-center rounded-full border border-primary-container bg-surface-container-lowest px-8 text-button font-medium whitespace-nowrap text-on-background shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity,background-color] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] hover:opacity-90"
            >
              {secondaryCtaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
