"use client";

import { useState } from "react";

type Swatch = {
  label: string;
  bgClass: string;
  textClass: string;
  ratio?: string;
  radiusClass?: string;
};

const semanticSwatches: Swatch[] = [
  {
    label: "Primary",
    bgClass: "bg-[var(--md-sys-color-primary)]",
    textClass: "text-[var(--md-sys-color-on-primary)]",
    ratio: "9.0:1 AAA",
    radiusClass: "rounded-t-[var(--radius-2xl)] rounded-b-[var(--radius-base)]",
  },
  {
    label: "Secondary",
    bgClass: "bg-[var(--md-sys-color-secondary)]",
    textClass: "text-[var(--md-sys-color-on-secondary)]",
    ratio: "6.5:1 AA",
    radiusClass: "rounded-t-[var(--radius-2xl)] rounded-b-[var(--radius-base)]",
  },
  {
    label: "Tertiary",
    bgClass: "bg-[var(--md-sys-color-tertiary)]",
    textClass: "text-[var(--md-sys-color-on-tertiary)]",
    ratio: "6.5:1 AA",
    radiusClass: "rounded-t-[var(--radius-2xl)] rounded-b-[var(--radius-base)]",
  },
  {
    label: "Error",
    bgClass: "bg-[var(--md-sys-color-error)]",
    textClass: "text-[var(--md-sys-color-on-error)]",
    ratio: "6.5:1 AA",
    radiusClass: "rounded-t-[var(--radius-2xl)] rounded-b-[var(--radius-base)]",
  },
];

const containerSwatches: Swatch[] = [
  {
    label: "Primary Cont.",
    bgClass: "bg-[var(--md-sys-color-primary-container)]",
    textClass: "text-[var(--md-sys-color-on-primary-container)]",
    ratio: "4.6:1 AA",
  },
  {
    label: "Secondary Cont.",
    bgClass: "bg-[var(--md-sys-color-secondary-container)]",
    textClass: "text-[var(--md-sys-color-on-secondary-container)]",
    ratio: "4.6:1 AA",
  },
  {
    label: "Tertiary Cont.",
    bgClass: "bg-[var(--md-sys-color-tertiary-container)]",
    textClass: "text-[var(--md-sys-color-on-tertiary-container)]",
    ratio: "4.6:1 AA",
  },
  {
    label: "Error Cont.",
    bgClass: "bg-[var(--md-sys-color-error-container)]",
    textClass: "text-[var(--md-sys-color-on-error-container)]",
    ratio: "4.6:1 AA",
  },
];

const surfaceRows: { label: string; bgClass: string; textClass: string }[] = [
  {
    label: "Background",
    bgClass: "bg-[var(--md-sys-color-background)]",
    textClass: "text-[var(--md-sys-color-on-background)]",
  },
  {
    label: "Surface",
    bgClass: "bg-[var(--md-sys-color-surface)]",
    textClass: "text-[var(--md-sys-color-on-surface)]",
  },
  {
    label: "Surface Cont.",
    bgClass: "bg-[var(--md-sys-color-surface-container)]",
    textClass: "text-[var(--md-sys-color-on-surface)]",
  },
  {
    label: "Surface Low",
    bgClass: "bg-[var(--md-sys-color-surface-container-low)]",
    textClass: "text-[var(--md-sys-color-on-surface)]",
  },
  {
    label: "Surface High",
    bgClass: "bg-[var(--md-sys-color-surface-container-high)]",
    textClass: "text-[var(--md-sys-color-on-surface)]",
  },
  {
    label: "Outline",
    bgClass: "bg-[var(--md-sys-color-outline)]",
    textClass: "text-[var(--md-sys-color-surface)]",
  },
];

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div
      className={`flex min-h-20 flex-col justify-between p-3 ${swatch.bgClass} ${swatch.textClass} ${swatch.radiusClass ?? "rounded-[var(--radius-base)]"}`}
    >
      <span className="text-label-sm">{swatch.label}</span>
      {swatch.ratio ? (
        <span className="text-label-overline opacity-70">{swatch.ratio}</span>
      ) : null}
    </div>
  );
}

export function ColorTokensPanel() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  function toggleScheme() {
    const next = scheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    setScheme(next);
  }

  return (
    <div
      className="flex flex-col gap-6 rounded-[var(--radius-2xl)] bg-[var(--md-sys-color-surface-container-low)] p-6 md:p-12"
      data-scheme={scheme}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-title-md text-[var(--md-sys-color-on-surface)]">
          {scheme === "light" ? "Light Scheme" : "Dark Scheme"}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={scheme === "dark"}
          aria-label="Toggle color scheme preview"
          onClick={toggleScheme}
          className="relative inline-flex h-8 w-14 items-center rounded-full bg-[var(--md-sys-color-surface-container-highest)] p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          <span
            className={`size-6 rounded-full bg-[var(--md-sys-color-primary)] transition-transform ${
              scheme === "dark" ? "translate-x-6" : "translate-x-0"
            }`}
          />
          <span className="sr-only">
            Switch to {scheme === "light" ? "dark" : "light"} scheme
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {semanticSwatches.map((swatch) => (
          <SwatchCard key={swatch.label} swatch={swatch} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {containerSwatches.map((swatch) => (
          <SwatchCard key={swatch.label} swatch={swatch} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {surfaceRows.map((row) => (
          <div
            key={row.label}
            className={`flex min-h-12 items-center justify-between rounded-[var(--radius-sm)] px-3 ${row.bgClass} ${row.textClass} border border-[var(--md-sys-color-outline-variant)]`}
          >
            <span className="text-label-sm">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
