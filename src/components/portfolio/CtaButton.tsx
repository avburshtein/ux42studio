import Link from 'next/link';
import type { ButtonVariant } from '@/lib/mainPageContent';

// Варианты кнопок для секций главной — по семействам спек проекта
// (Primary_button_Spec / Secondary_Button_Spec / Ghost_Button_Spec /
// Link_Button_Spec + актуализации Main_page_Spec «Кнопочная система»).
// Все варианты — пилюли h-14 px-8, как Hero CTA.
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  // solid-семейство: bg-primary, тень 2/2/4/10% → hover opacity-90 + тень 4/4/12/20%
  primary:
    'bg-primary text-on-primary shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] transition-[box-shadow,opacity] duration-150 ease-out',
  // outline-семейство (secondary): border-primary-container, hover заливка 5%
  secondary:
    'border border-primary-container bg-surface-container-lowest text-on-background shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] hover:bg-[rgba(11,110,79,0.05)] hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] transition-[box-shadow,opacity,background-color] duration-150 ease-out',
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