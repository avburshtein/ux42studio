# Dialogs

## Purpose
Dialogs focus user attention on a single task or decision, blocking interaction with the background.

## When to use
- Critical confirmations (delete, reset).
- Forms that require immediate attention.
- Media previews or detailed content.

## States
- Default (open), Focus-trap, Closing, Closed.
- Overlay with backdrop blur/scrim.
- Close button (X) in top-right.
- `Escape` key closes.

## Tokens
- Overlay: `bg-black/80` (light) / `bg-black/60` (dark).
- Content background: `--md-sys-color-surface`.
- Border: `--md-sys-color-outline-variant`.
- Radius: `rounded-xl` (16px) for dialogs, `rounded-4xl` (28px) for modals.
- Shadow: dialog shadow tokens.

## Rules
- Use Radix UI `Dialog` primitive for focus management and a11y.
- Always provide a `DialogTitle` and optional `DialogDescription`.
- Use `DialogClose` with accessible label “Close”.
- Footer actions: primary on right, secondary on left (sm:flex-row sm:justify-end).
- Do not nest dialogs.

## Do
```tsx
<Dialog>
  <DialogTrigger asChild><Button>Delete</Button></DialogTrigger>
  <DialogContent>
    <DialogTitle>Delete project?</DialogTitle>
    <DialogDescription>This action cannot be undone.</DialogDescription>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Don’t
- Do not use a dialog for simple tooltips or notifications (use Toast instead).
- Do not trap focus incorrectly.
- Do not hardcode background colors.

## Code mapping
- Component: `Dialog` (`src/components/ui/Dialog.tsx`)
- Import: `@/components/ui/Dialog`
