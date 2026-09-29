import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  text: string;
  authorName: string;
  authorRole?: string | null;
  avatarUrl?: string | null;
  className?: string;
}

// Testimonial Block — Figma 176:378 (Portfolio UX42, узел 176:378), 850×208.
// Белая карточка r=14 с тенью 0 2px 12px rgba(0,0,0,.06) — это ровно
// токены `bg-surface-container-lowest` + `rounded-lg` + `shadow-card`.
// Кавычка «“» — декоративная (aria-hidden), Poppins 500, 100/76,
// зелёная (#1e6a4f в макете → токен `primary`, адаптируется к теме).
// Имя автора — 16/24 semibold primary; роль/компания — 16/400 on-surface-variant.
export function TestimonialCard({
  text,
  authorName,
  authorRole,
  avatarUrl,
  className,
}: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-8 shadow-card',
        className,
      )}
    >
      <span
        aria-hidden
        className='font-display text-[100px] leading-[76px] text-primary'
      >
        “
      </span>
      <blockquote className='text-body-lg text-on-surface'>
        «{text}»
      </blockquote>
      <figcaption className='flex items-center gap-3'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={40}
            height={40}
            className='h-10 w-10 shrink-0 rounded-full object-cover'
          />
        ) : null}
        <div className='flex flex-col'>
          <span className='text-label-lg text-primary'>{authorName}</span>
          {authorRole && (
            <span className='text-body-md text-on-surface-variant'>
              {authorRole}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
