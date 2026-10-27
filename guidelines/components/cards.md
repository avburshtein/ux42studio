# Cards

## Purpose
Cards group related content and actions in a bounded container with elevation.

## When to use
- Display content with a title, description, and optional actions.
- Use in grids for portfolio items, case studies, metrics.
- Use for content that can be tapped/clicked as a unit.

## Variants
| Variant | Radius | Shadow | Usage |
|---------|--------|--------|-------|
| Default | `rounded-xl` (16px) | `shadow-card-base` | Content containers |
| Elevated | `rounded-2xl` (20px) | `shadow-card-accent` | Featured items, CTAs |

## Tokens
- Background: `--md-sys-color-surface-container-lowest` (light) / `--md-sys-color-surface-container-lowest` (dark)
- Border: `--md-sys-color-outline-variant`
- Shadow: card shadow tokens from `globals.css`

## Rules
- Use `gap-4` or `gap-6` for internal spacing.
- Images inside cards: `object-cover`, rounded corners matching card radius.
- Hover: subtle scale or shadow increase (max 1.02x).
- Support both light and dark themes.
- Do not set fixed height; let content determine height (prevents clipping).

## Do
```tsx
<Card className="rounded-xl p-6 border border-[var(--md-sys-color-outline-variant)]">
  <CardTitle>Case Title</CardTitle>
  <CardDescription>Case description</CardDescription>
</Card>
```

## Don’t
- Do not hardcode `bg-white` or `dark:bg-black`; use surface tokens.
- Do not clip content with fixed heights.
- Do not use cards for simple text grouping without visual boundary need.

## Code mapping
- Component: `Card` (`src/components/ui/Card.tsx`)
- Import: `@/components/ui/Card`
