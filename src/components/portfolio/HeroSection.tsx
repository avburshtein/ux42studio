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
 * Hero Section — Main_page_Spec §3
 * Высота: 100dvh — хиро вытянут до самого верха страницы (решение (17)):
 * −mt-16/−mt-24 = высота sticky-шапки (64/96px, §2), белый фон и
 * FloatingElements заходят под её стекло. Контент на прежнем месте:
 * верхний паддинг увеличен ровно на высоту шапки
 * (64+48=112 → pt-28; 96+96=192 → md:pt-48; 96+120=216 → lg:pt-[216px]) —
 * контент-бокс и вертикальный центр не сдвинулись, нижний край хиро
 * по-прежнему на 100dvh (пропорции первого экрана сохранены).
 * dvh — корректно на мобильных с динамическим адресным баром.
 * Background + bokeh, нижний паддинг 48/96/120.
 */
export function HeroSection({
  headlinePart1, headlineAccent, headlinePart2,
  subtitle, primaryCtaLabel, primaryCtaHref,
  secondaryCtaLabel, secondaryCtaHref,
}: HeroSectionProps) {
  return (
    <section className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden bg-surface-container-lowest pb-12 pt-28 md:-mt-24 md:pb-24 md:pt-48 lg:pb-30 lg:pt-[216px]">
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
