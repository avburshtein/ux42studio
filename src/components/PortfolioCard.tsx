import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TagBadge } from './case/TagBadge';

interface PortfolioCardProps {
  title: string;
  tag: string;
  imageUrl: string;
  href: string;
  overlayTags?: string[];
  className?: string;
}

/**
 * Portfolio Card — эталон: make-export (Docs/make-export, PortfolioGallery.tsx).
 * Ховер-поведение (решение 2026-08-27 (9) в Main_page_Spec.md):
 *   карточка scale(1.02) + 500ms + усиление тени — класс .portfolio-card
 *   (фон/тени в globals.css, НЕ дублировать Tailwind-классами);
 *   картинка zoom 1.10 за 700ms под зелёным градиентом;
 *   градиент as Make: from 0.9 / via 0.5 / to-transparent, появление по opacity;
 *   подпись на градиенте убрана (фидбэк) — остаются только теги со slide-up.
 */
export function PortfolioCard({
  title, tag, imageUrl, href, overlayTags, className,
}: PortfolioCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex w-full flex-col overflow-hidden rounded-[24px]',
        'portfolio-card',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative shrink-0 w-full h-[256px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(min-width: 640px) 341px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay on hover — as Make: from 0.9 / via 0.5 / to transparent */}
        <div className="absolute inset-0 flex flex-col justify-end p-6
          bg-gradient-to-t from-[rgba(11,110,79,0.9)] via-[rgba(11,110,79,0.5)] to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        >
          {overlayTags && overlayTags.length > 0 && (
            <div className="flex flex-wrap gap-2 translate-y-[10px] transition-transform duration-500 delay-75 ease-out group-hover:translate-y-0">
              {overlayTags.map((t) => <TagBadge key={t} label={t} variant="ghost" />)}
            </div>
          )}
        </div>
      </div>

      {/* Text area — flex-1: высота ровно 368−256=112px у ВСЕХ карточек
          (фидбэк: разная высота текстовой зоны выглядела неконсистентно).
          truncate на строках — страховка от переполнения при длинных
          заголовках (две строки в 112px не помещаются). */}
      <div className="flex flex-1 flex-col gap-2 px-6 py-6">
        <h4 className="font-display m-0 truncate text-[22px] font-medium leading-[30px] tracking-[-0.22px] text-on-surface-variant">
          {title}
        </h4>
        <span className="truncate text-[16px] leading-[24px] text-primary">
          {tag}
        </span>
      </div>
    </Link>
  );
}
