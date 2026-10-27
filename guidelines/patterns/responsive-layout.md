# Responsive Layout

## Breakpoints
- `sm` — 640px (mobile landscape)
- `md` — 768px (tablet)
- `lg` — 1024px (laptop)
- `xl` — 1280px (desktop)

## Container widths
- `--max-width-container-page`: 1440px
- `--max-width-container-content`: 1280px
- `--max-width-container-form`: 850px
- `--max-width-container-narrow`: 768px

## Rules
- Mobile-first: base styles for mobile, add `md:`, `lg:`, `xl:` overrides.
- Page content max-width: `max-w-[1440px]` with `.section-container` centering.
- Forms max-width: `max-w-[850px]`.
- Grid columns: 1 (mobile) → 2 (tablet) → 3 (desktop).
- Spacing: 4px-基准 (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96).

## Header
- Desktop: 72px height (`py-2` + `h-14` content).
- Mobile: 64px height (`py-2` + `h-12` content).
- Sticky top, `z-40`.

## Footer
- `py-12` (light) / `py-16` (dark).
- Content in `.section-container`.
