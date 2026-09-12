import { FloatingElements } from '../FloatingElements';
import { CtaButton } from './CtaButton';
import type { ButtonVariant } from '@/lib/mainPageContent';

interface HeroSectionProps {
  headlinePart1: string;
  headlineAccent: string;
  headlinePart2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  primaryCtaVariant?: ButtonVariant;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaVariant?: ButtonVariant;
  /** Аватар дизайнера (из профиля) — круглая аватарка над заголовком */
  avatarUrl?: string;
  /** Cover дизайнера (из профиля) — фон Hero с оверлеем для читаемости */
  coverUrl?: string;
  displayName?: string;
  /** Декоративные Floating Elements (bokeh) — отключаются из админки */
  floatingElements?: boolean;
  /** Цвет/форма плавающих элементов (из админки) */
  floatingColor?: string | null;
  floatingShape?: 'default' | 'circle' | 'square' | 'triangle';
}

/**
 * Hero Section — Main_page_Spec §3
 * Высота: 100dvh — хиро вытянут до самого верха страницы (решение (17)):
 * −mt-16/−mt-[72px] = высота sticky-шапки (64/72px, §2 решение (18)), белый фон и
 * FloatingElements заходят под её стекло. Контент на прежнем месте:
 * верхний паддинг увеличен ровно на высоту шапки
 * (64+48=112 → pt-28; 72+96=168 → md:pt-42; 72+120=192 → lg:pt-48) —
 * контент-бокс и вертикальный центр не сдвинулись, нижний край хиро
 * по-прежнему на 100dvh (пропорции первого экрана сохранены).
 * dvh — корректно на мобильных с динамическим адресным баром.
 * Background + bokeh, нижний паддинг 48/96/120.
 */
export function HeroSection({
  headlinePart1, headlineAccent, headlinePart2,
  subtitle, primaryCtaLabel, primaryCtaHref,
  primaryCtaVariant = 'primary',
  secondaryCtaLabel, secondaryCtaHref,
  secondaryCtaVariant = 'secondary',
  avatarUrl, coverUrl, displayName,
  floatingElements = true,
  floatingColor, floatingShape,
}: HeroSectionProps) {
  return (
    <section className="relative -mt-16 flex min-h-[100dvh] items-center overflow-hidden bg-surface-container-lowest pb-12 pt-28 md:-mt-[72px] md:pb-24 md:pt-42 lg:pb-30 lg:pt-48">
      {/* Cover — фон Hero (из профиля); оверлей сохраняет читаемость текста */}
      {coverUrl && (
        <div className="absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-surface-container-lowest/70" />
        </div>
      )}
      {floatingElements && (
        <FloatingElements
          count={20}
          minBlur={0}
          maxBlur={20}
          color={floatingColor}
          shape={floatingShape}
        />
      )}

      <div className="section-container relative z-10 flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          {avatarUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt={displayName ?? 'Designer avatar'}
              className="h-20 w-20 rounded-full border border-outline-variant object-cover shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)]"
            />
          )}
          {/* Масштаб 1:1 с Make (решение (24)): 42/62/72px, leading 1.2,
              tracking −0.42/−0.62/−0.72. Переносы — строчным потоком.
              В Figma строки абсолютные (left:566) — в код это не переносим. */}
          <h1 className="font-display text-[42px] font-medium leading-[1.2] tracking-[-0.42px] text-on-surface-variant md:text-[62px] md:tracking-[-0.62px] lg:text-[72px] lg:tracking-[-0.72px]">
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
          <CtaButton href={primaryCtaHref} variant={primaryCtaVariant}>
            {primaryCtaLabel}
          </CtaButton>

          {secondaryCtaLabel && secondaryCtaHref && (
            <CtaButton href={secondaryCtaHref} variant={secondaryCtaVariant}>
              {secondaryCtaLabel}
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
