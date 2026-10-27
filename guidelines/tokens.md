# Tokens

## Source of truth
Use UX42 Design System tokens from `src/app/globals.css` and Figma variables. The canonical file is `src/app/globals.css` (`@theme` block).

## Color
- Use semantic roles: `primary`, `on-primary`, `primary-container`, `on-primary-container`, `surface`, `on-surface`, `surface-variant`, `on-surface-variant`, `background`, `on-background`, `outline`, `outline-variant`, `outline-faint`, `error`, `on-error`, `error-container`, `on-error-container`, `secondary`, `on-secondary`, `secondary-container`, `on-secondary-container`.
- Never hardcode hex values in components.
- Use `error` color only for destructive actions, validation errors, and critical system states (amber `#8A5100`, not red).
- `secondary` (Coral Red) is reserved for accents; do not use it for errors.

## Typography
- Fonts: `Poppins` (display/headings, `--font-display`), `Inter` (body/UI, `--font-body`).
- Use type roles: `text-display-*`, `text-headline-*`, `text-title-*`, `text-body-*`, `text-label-*`.
- Do not create custom font sizes for standard UI text.
- Use `text-body-md` as the default reading text unless another role is explicitly appropriate.
- Line-height and tracking are bound to the size, not to the font weight.

## Shape and elevation
- Radii: `--radius-none` (0), `--radius-xs` (4), `--radius-sm` (8), `--radius-md` (10), `--radius-base` (12), `--radius-lg` (14), `--radius-xl` (16), `--radius-2xl` (20), `--radius-3xl` (24), `--radius-4xl` (28), `--radius-5xl` (48), `--radius-full` (9999).
- Buttons and inputs: `rounded-md` (10px).
- Cards: `rounded-xl` (16px) or `rounded-2xl` (20px).
- Modals/dialogs: `rounded-4xl` (28px).
- Use elevation (shadows) only to communicate hierarchy, overlays, menus, dialogs, and floating elements.

## Surface containers
- `surface-container-lowest` — white / near-black base canvas.
- `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest` — layered elevations for cards, sheets, overlays.
