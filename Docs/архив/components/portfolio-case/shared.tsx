import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function BlockLabel({
  number,
  name,
}: {
  number: string;
  name: string;
}) {
  return (
    <div className="flex w-full items-center gap-4">
      <span
        aria-hidden
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--md-sys-color-primary)] text-label-sm text-[var(--md-sys-color-on-primary)]"
      >
        {number}
      </span>
      <div
        aria-hidden
        className="h-px flex-1 bg-[var(--md-sys-color-outline-variant)]"
      />
      <span className="shrink-0 text-label-md text-[var(--md-sys-color-on-surface-variant)]">
        {name}
      </span>
    </div>
  );
}

export function CaseSection({
  id,
  number,
  name,
  heading,
  description,
  children,
}: {
  id: string;
  number: string;
  name: string;
  heading: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex w-full flex-col gap-8"
    >
      <BlockLabel number={number} name={name} />
      <div className="flex flex-col gap-6">
        <div>
          <h2
            id={`${id}-heading`}
            className="text-headline-md text-[var(--md-sys-color-on-surface)]"
          >
            {heading}
          </h2>
          <p className="mt-3 text-body-md text-[var(--md-sys-color-on-surface-variant)]">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function MetadataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-[var(--radius-base)] bg-[var(--md-sys-color-surface-container-low)] p-5 md:w-[250px] md:shrink-0">
      <p className="text-label-overline text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <p className="text-title-md text-[var(--md-sys-color-on-surface)]">
        {value}
      </p>
    </article>
  );
}

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-2 text-button text-[var(--md-sys-color-primary)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
    >
      {children}
      <ArrowUpRight size={18} aria-hidden />
    </a>
  );
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-[58px] min-w-[166px] items-center justify-center rounded-[var(--radius-full)] bg-[var(--md-sys-color-primary)] px-8 text-button text-[var(--md-ext-primary-button-text)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
    >
      {children}
    </a>
  );
}

export function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-end bg-[var(--md-sys-color-surface-container-high)] p-4 text-label-sm text-[var(--md-sys-color-on-surface-variant)] ${className}`}
    >
      <span>{label}</span>
    </div>
  );
}
