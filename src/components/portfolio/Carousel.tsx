import { cn } from '@/lib/utils';

interface CarouselProps {
  /** Слайды. <sm — прямые дети = карточки стрипа; ≥sm — ячейки сетки 2/3 */
  children: React.ReactNode;
  className?: string;
}

/**
 * Carousel — мобильный стрип со scroll-snap, ≥sm — сетка 2/3 (решение (13)).
 * Главную тоже переводим на карусель (решение (34)) — карточки обеих
 * страниц идентичны на мобильном.
 *
 * Геометрия стрипа (<sm, паддинг контейнера 24):
 *  - full-bleed до краёв экрана: −mx-6 + w calc(100% + 48px) (w-full не
 *    расширяется отрицательными margin — нужна явная ширина);
 *  - px-6 внутри: первая карточка на стандартном паддинге контейнера (24),
 *    карточка = basis-full = 100% content box = 327 @375 — ровно ширина
 *    карточки сетки (раньше была 311: % брался от content box c pr-4);
 *  - gap-4 → соседняя карточка начинается на 367 и видна до самого края
 *    экрана (peek 8px @375: 24 + 327 + 16 + 8 = 375), правого паддинга нет;
 *  - scroll-px-6: snap-цель = паддинг 24; max scroll (343n − 327) совпадает
 *    с целью последней карточки при любом n — стрип всегда «доезжает» ровно.
 *  Вертикальная обрезка скроллера (overflow-x:auto → overflow-y:auto):
 *  верх — hover/pressed scale(1.02): pt-3 + −mt-3 (решение (33));
 *  низ — тень карточки ~20px: pb-7 + −mb-5 (решения (15), (16)).
 *  Требование к детям: корневой элемент карточки с w-full (PortfolioCard ✓)
 *  и truncate-безопасность — [&>*]:min-w-0 держит цепочку сжатия (решение (32)).
 */
export function Carousel({ children, className }: CarouselProps) {
  return (
    <div
      className={cn(
        '-mx-6 -mb-5 -mt-3 flex w-[calc(100%_+_48px)] snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-7 pt-3',
        'scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        '[&>*]:min-w-0 [&>*]:shrink-0 [&>*]:basis-full [&>*]:snap-start',
        'sm:mx-0 sm:mb-0 sm:mt-0 sm:grid sm:w-full sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-x-visible sm:px-0 sm:pb-0 sm:pt-0 sm:[&>*]:basis-auto',
        'lg:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}