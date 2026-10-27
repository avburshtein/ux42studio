# Product guidelines — UX42.studio Design System

## Product
Build clean, accessible, responsive web interfaces using the UX42 Design System (Material Design 3 foundation, seed color Forest Green `#0B6E4F`).

## Read first
1. `setup.md` — required imports, providers, and configuration
2. `tokens.md` — color, typography, spacing, radius, and elevation rules
3. `components/` — component usage rules
4. `patterns/` — page and interaction patterns
5. `anti-patterns.md` — patterns that must not be generated

## Core principles
- Use UX42 Design System components and tokens instead of custom styling.
- Prefer responsive layouts with flexbox or CSS grid.
- Use semantic HTML and accessible labels for all interactive elements.
- Keep one primary action per screen or section.
- Do not invent components when a UX42 or M3 component exists.
- All colors, spacing, radii come from CSS variables (`--md-sys-color-*`, `--radius-*`) — no hardcoded values.

## Definition of done
- Layout works on mobile and desktop.
- Interactive elements have visible hover, focus-visible, active, and disabled states.
- Text meets WCAG 2.2 AA contrast requirements.
- No hardcoded colors, font sizes, spacing, or radii.
- All component variants documented in `components/`.
