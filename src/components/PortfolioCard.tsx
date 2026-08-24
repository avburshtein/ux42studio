import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TagBadge } from './case/TagBadge';

interface PortfolioCardProps {
  title: string;
  tag: string;
  imageUrl: string;
  href: string;
  overlayTitle?: string;
  overlayTags?: string[];
  className?: string;
}

/**
 * Portfolio Card — Portfolio_Card_Spec.md (87:1429)
 * Shadows via CSS custom properties: light=green tint, dark=black.
 * Hover: gradient overlay + title 22→20px + stronger shadow.
 */
export function PortfolioCard({
  title, tag, imageUrl, href, overlayTitle, overlayTags, className,
}: PortfolioCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col justify-end overflow-hidden rounded-[24px]',
        'bg-surface-container-low',
        'w-[334px] h-[368px]',
        'transition-shadow duration-200 ease-out',
        'hover:scale-[1.02] transition-transform duration-300',
        // Default shadow — 3 слоя через переменные
        'shadow-[10px_10px_8px_-2px_var(--shadow-card-accent),16px_9px_12px_-1px_var(--shadow-card-glow),4px_4px_2px_0_var(--shadow-card-base)]',
        // Hover — больше offset + blur
        'hover:shadow-[12px_12px_10px_-2px_var(--shadow-card-accent),20px_12px_16px_-1px_var(--shadow-card-glow),6px_6px_3px_0_var(--shadow-card-base)]',
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative shrink-0 w-full h-[256px] overflow-hidden">
        <Image src={imageUrl} alt={title} fill sizes="334px" className="object-cover" />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-6
          bg-[linear-gradient(to_top,rgba(11,110,79,0.90)_0%,rgba(11,110,79,0.50)_50%,transparent_100%)]
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
        >
          <div className="flex flex-col gap-3">
            {overlayTitle && (
              <h3 className="font-display font-medium text-[24px] leading-[28.8px] m-0 text-on-primary">
                {overlayTitle}
              </h3>
            )}
            {overlayTags && overlayTags.length > 0 && (
              <div className="flex gap-2">
                {overlayTags.map((t) => <TagBadge key={t} label={t} variant="ghost" />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text area */}
      <div className="flex flex-col gap-2 px-6 py-6">
        <h4 className="font-display font-medium text-[22px] leading-[30px] tracking-[-0.22px] m-0
          text-on-surface-variant
          group-hover:text-[20px] group-hover:leading-[26px] group-hover:tracking-normal
          transition-all duration-200 ease-out"
        >
          {title}
        </h4>
        <span className="text-[16px] leading-[24px] text-primary">
          {tag}
        </span>
      </div>
    </Link>
  );
}
