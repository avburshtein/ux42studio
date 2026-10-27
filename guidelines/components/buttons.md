# Buttons

## Purpose
Buttons trigger a user-initiated action or navigation.

## When to use
- Use a filled button for the single primary action on a screen or section.
- Use a tonal (secondary-container) or outlined button for secondary actions.
- Use a text (link) button for low-emphasis actions inside dialogs, cards, or toolbars.
- Use a ghost button for subtle actions that need minimal visual weight.
- Use destructive for irreversible or high-risk actions (deletion, reset).

## Variants
| Variant | Token | Usage |
|---------|-------|-------|
| `default` (filled) | `--md-sys-color-primary` / `--md-sys-color-on-primary` | Primary action |
| `secondary` (tonal) | `--md-sys-color-secondary-container` / `--md-sys-color-on-secondary-container` | Secondary accent action |
| `outline` | `--md-sys-color-outline` / `--md-sys-color-on-surface` | Tertiary / alternative action |
| `ghost` | transparent / `--md-sys-color-on-surface` | Minimal emphasis |
| `link` | `--md-sys-color-primary` | Navigation-like action |
| `destructive` | `--md-sys-color-error` / `--md-sys-color-on-error` | Destructive / deletion |

## Sizes
| Size | Classes | Usage |
|------|---------|-------|
| `sm` | `h-9 rounded-md px-3` | Compact UI, toolbars |
| `default` | `h-10 rounded-md px-4 py-2` | Standard buttons |
| `lg` | `h-11 rounded-md px-8` | Prominent CTAs |
| `icon` | `h-10 w-10` | Icon-only buttons |

## States
- Default, Hover (opacity-90), Focus-visible (ring-2 ring-primary ring-offset-2), Active, Disabled (opacity-50, pointer-events-none).

## Rules
- Use clear, verb-first labels: “Save changes”, “Create project”, “Delete file”.
- Show only one filled primary button per screen or section.
- Disable a button while its action is pending; do not hide it.
- Use destructive styling only for irreversible or high-risk actions.
- Focus ring uses `--md-sys-color-primary` with `ring-offset-2`.

## Do
```tsx
<Button variant="default" onClick={save}>Save changes</Button>
<Button variant="destructive" onClick={deleteFile}>Delete file</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

## Don’t
- Do not use “Submit” when the action is clearer as “Create account”.
- Do not place two filled buttons side by side with equal visual weight.
- Do not use a button for navigation when a link or navigation item is more appropriate.

## Code mapping
- Component: `Button` (`src/components/ui/Button.tsx`)
- Props: `variant`, `size`, `disabled`, `loading` + standard button attributes
- Import: `@/components/ui/Button`
