# Anti-patterns

## Never do
- Do not use absolute positioning for standard page layout; use flexbox or CSS grid.
- Do not hardcode colors, spacing, radii, or font sizes.
- Do not use a dropdown when there are two or fewer options; use radio buttons or a segmented control.
- Do not use a floating action button together with a bottom navigation bar.
- Do not create custom buttons, inputs, cards, or dialogs when UX42/M3 components exist.
- Do not generate placeholder text such as “Lorem ipsum” in final UI.
- Do not use inline styles (`style={{ ... }}`).
- Do not add a second UI library or design system.
- Do not duplicate token values in local CSS.

## Prefer instead
- Use flexbox or grid for responsive layout.
- Use UX42/M3 tokens and semantic color roles.
- Use a select only for 3+ options.
- Use clear empty, loading, error, and success states.
- Use one filled primary button per screen or section.
- Use verb-first labels: “Save changes”, “Create project”, “Delete file”.

## Component-specific prohibitions
- **Button:** Do not place two filled buttons side by side with equal visual weight.
- **Input:** Do not remove the reserved space for helper text / error messages (prevents CLS).
- **Dialog:** Do not trap focus incorrectly; always provide a visible close button and `Escape` handling.
