# Setup

## Required setup
- Import global styles and theme configuration once at the application entry point (`src/app/layout.tsx` or `src/app/globals.css`).
- Use the package's theme/token mechanism (`--md-sys-color-*` CSS variables); do not duplicate token values in local CSS.
- Wrap interactive components with Radix UI primitives when accessibility behaviour is needed (`@radix-ui/react-dialog`, `@radix-ui/react-select`, etc.).
- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) and `cva` from `class-variance-authority` for component variants.

## Rules
- Do not add a second design system or UI library.
- Do not override M3/UX42 component internals with arbitrary CSS unless no supported API exists.
- If a required component is unavailable, use the closest supported component and explain the limitation in code comments.
- All new components live in `src/components/ui/` and are built from Radix UI primitives + CVA + `cn()`.
