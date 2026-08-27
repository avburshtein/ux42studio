import { Mail } from 'lucide-react';
import { FloatingElements } from '../FloatingElements';
import Link from 'next/link';

interface CtaSectionProps {
  label?: string;
  title: string;
  bodyLines: string[];
  emailHref: string;
  emailLabel: string;
  whatsappHref?: string;
  whatsappLabel?: string;
}

export function CtaSection({
  label = 'Reach', title, bodyLines,
  emailHref, emailLabel, whatsappHref, whatsappLabel,
}: CtaSectionProps) {
  return (
    <section id='contact' className="relative overflow-hidden bg-surface-container-lowest py-12 md:py-24 lg:py-30">
      <FloatingElements count={20} minBlur={0} maxBlur={20} />

      <div className="section-container relative z-10 flex flex-col items-center gap-8 text-center">
        {label && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.0455em] text-outline-variant">
            {label}
          </span>
        )}

        <h2 className="font-display text-display-sm font-medium leading-tight text-on-surface">
          {title}
        </h2>

        <div className="flex flex-col gap-1">
          {bodyLines.map((line, i) => (
            <p key={i} className="text-body-md font-normal text-on-surface">
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={emailHref}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-button font-medium text-on-primary hover:opacity-90 transition-opacity"
          >
            <Mail size={24} />
            {emailLabel}
          </Link>

          {whatsappHref && whatsappLabel && (
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-base px-4 text-button font-medium text-surface-tint hover:bg-surface-variant transition-colors"
            >
              {whatsappLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
