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
            className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-button font-medium text-on-primary shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)]"
          >
            <Mail size={24} />
            {emailLabel}
          </Link>

          {whatsappHref && whatsappLabel && (
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center rounded-full border border-primary-container bg-surface-container-lowest px-8 text-button font-medium text-on-background shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity,background-color] duration-150 ease-out hover:bg-[rgba(11,110,79,0.05)] hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)] hover:opacity-90"
            >
              {whatsappLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
