import { Mail } from 'lucide-react';
import { FloatingElements } from '../FloatingElements';
import { CtaButton } from './CtaButton';
import type { ButtonVariant } from '@/lib/mainPageContent';

interface CtaSectionProps {
  title: string;
  bodyLines: string[];
  emailHref: string;
  emailLabel: string;
  emailVariant?: ButtonVariant;
  whatsappHref?: string;
  whatsappLabel?: string;
  whatsappVariant?: ButtonVariant;
  /** Декоративные Floating Elements (bokeh) — отключаются из админки */
  floatingElements?: boolean;
}

export function CtaSection({
  title, bodyLines,
  emailHref, emailLabel, emailVariant = 'primary',
  whatsappHref, whatsappLabel, whatsappVariant = 'secondary',
  floatingElements = true,
}: CtaSectionProps) {
  return (
    <section id='contact' className="relative scroll-mt-20 overflow-hidden bg-surface-container-lowest py-12 md:py-24 lg:py-30">
      {floatingElements && <FloatingElements count={20} minBlur={0} maxBlur={20} />}

      <div className="section-container relative z-10 flex flex-col items-center gap-8 text-center">
        <h2 className="font-display text-[32px] font-medium leading-[40px] text-on-surface lg:text-display-sm lg:leading-tight">
          {title}
        </h2>

        <div className="flex flex-col gap-1">
          {bodyLines.map((line, i) => (
            <p key={i} className="text-body-md font-normal text-on-surface">
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <CtaButton href={emailHref} variant={emailVariant}>
            <Mail size={24} />
            {emailLabel}
          </CtaButton>

          {whatsappHref && whatsappLabel && (
            <CtaButton href={whatsappHref} variant={whatsappVariant} external>
              {whatsappLabel}
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}
