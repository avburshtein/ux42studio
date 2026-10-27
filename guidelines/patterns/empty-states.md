# Empty States

## Purpose
Empty states inform the user when there is no content to display.

## When to use
- Empty collections, lists, search results.
- First-time use with no data.
- Error states where content cannot be loaded.

## Rules
- Show an icon (from `lucide-react`) + heading + description.
- Provide a clear action (button or link) to populate or fix the state.
- Use `text-on-surface-variant` for secondary text.
- Do not use “Lorem ipsum” or generic placeholder text.

## Do
```tsx
<EmptyState>
  <FolderOpen className="h-12 w-12 text-on-surface-variant" />
  <h3 className="text-title-md text-on-surface">No projects yet</h3>
  <p className="text-body-sm text-on-surface-variant">
    Create your first project to get started.
  </p>
  <Button variant="default">Create project</Button>
</EmptyState>
```

## Don’t
- Do not show an empty state without an action when one is available.
- Do not use hardcoded colors or dummy text.
