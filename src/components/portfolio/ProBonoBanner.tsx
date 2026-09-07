import { Mail } from 'lucide-react';
import { CtaButton } from './CtaButton';

interface ProBonoBannerProps {
  text: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaVariant?: 'primary' | 'secondary' | 'ghost' | 'link';
}

/**
 * Pro Bono Banner — эталон: make-export PortfolioPage (~L395):
 * строка-баннер с текстом слева и CTA справа, пилюля на фоне
 * surface-container-low. Вертикальный ритм секций — py-12/24.
 */
export function ProBonoBanner({
  text,
  ctaLabel,
  ctaUrl,
  ctaVariant = 'primary',
}: ProBonoBannerProps) {
  if (!text) return null;

  return (
    <section className='bg-surface-container-lowest py-6 md:py-12'>
      <div className='section-container'>
        <div className='flex flex-col items-start gap-6 rounded-3xl bg-surface-container-low p-7 md:flex-row md:items-center md:justify-between md:p-10'>
          <p className='text-body-lg font-normal text-on-surface-variant'>
            {text}
          </p>
          {ctaUrl && ctaLabel && (
            <CtaButton
              href={ctaUrl}
              variant={ctaVariant}
              className='shrink-0 w-full md:w-auto'
            >
              <Mail size={20} aria-hidden='true' />
              {ctaLabel}
            </CtaButton>
          )}
        </div>
      </div>
    </section>
  );
}