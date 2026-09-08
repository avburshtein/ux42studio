import Link from 'next/link';
import type { ButtonVariant } from '@/lib/mainPageContent';

// Варианты кнопок для секций главной — по семействам спек проекта
// (Primary_button_Spec / Secondary_Button_Spec / Ghost_Button_Spec /
// Link_Button_Spec + актуализации Main_page_Spec «Кнопочная система»).
// Все варианты — пилюли h-14 px-8, как Hero CTA.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // solid-семейство: bg-primary, мягкая тень 0/4/8/15% (FullStory-style,
  // решение (27)) → hover: opacity-90 + тень 0/8/16/20%
  primary:
    'bg-primary text-on-primary shadow-[0_4px_8px_rgba(0,0,0,0.15)] hover:opacity-90 hover:shadow-[0_8px_16px_rgba(0,0,0,0.20)] transition-[box-shadow,opacity] duration-150 ease-out',
  // outline-семейство (secondary): border-primary-container, hover заливка 5%
  secondary:
    'border border-primary-container bg-surface-container-lowest text-on-background shadow-[0_4px_8px_rgba(0,0,0,0.15)] hover:bg-[rgba(11,110,79,0.05)] hover:opacity-90 hover:shadow-[0_8px_16px_rgba(0,0,0,0.20)] transition-[box-shadow,opacity,background-color] duration-150 ease-out',
  // ghost-семейство: без заливки и бордера, hover opacity-70
  ghost:
    'text-on-background hover:opacity-70 transition-opacity duration-150 ease-out',
  // link-семейство: текст primary, подчёркивание в hover
  link: 'text-primary underline-offset-4 hover:underline transition-opacity duration-150 ease-out',
};

interface CtaButtonProps {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}

export function CtaButton({
  href,
  variant = 'primary',
  className = '',
  children,
  external,
}: CtaButtonProps) {
  const cls = `inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-button font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${VARIANT_CLASS[variant]} ${className}`;

  if (external) {
    return (
      <Link href={href} target='_blank' rel='noopener noreferrer' className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}