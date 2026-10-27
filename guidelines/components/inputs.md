# Inputs (TextField)

## Purpose
Text inputs allow users to enter and edit data.

## When to use
- Single-line text input.
- Use `textarea` for multi-line content.
- Pair with `Field`, `Label`, and helper/error text for accessible forms.

## Variants
| Variant | Usage |
|---------|-------|
| `default` | Standard text input |
| `disabled` | Non-editable state |
| `error` | Invalid input with error message |

## States
- Default, Hover, Focus-visible (border-primary, outline-2), Disabled, Error (border-error), Loading (optional spinner).

## Tokens
- Border: `--md-sys-color-outline`
- Background: `--md-sys-color-surface`
- Text: `--md-sys-color-on-surface`
- Placeholder: `--md-sys-color-on-surface-variant`
- Focus ring: `--md-sys-color-primary`
- Error border: `--md-sys-color-error`

## Rules
- Always pair with `<Label>` for accessibility.
- Reserve space for helper/error text below the field (prevents CLS).
- Use `text-body-md` typography.
- Height: `h-10`, padding: `px-3 py-2`, radius: `rounded-md`.
- Show validation errors inline, not in alerts, unless form-level.

## Do
```tsx
<Field>
  <Label>Email address</Label>
  <Input type="email" placeholder="name@example.com" />
</Field>
```

## Don’t
- Do not use an input when a select/checkbox/radio is more appropriate.
- Do not remove the error text space (causes layout shift).
- Do not hardcode border colors; use `--md-sys-color-outline` and `--md-sys-color-error`.

## Code mapping
- Component: `Input` (`src/components/ui/Input.tsx`)
- Props: standard `React.InputHTMLAttributes<HTMLInputElement>`
- Import: `@/components/ui/Input`
