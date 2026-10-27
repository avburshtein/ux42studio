# @ux42/design-system

UX42.studio Design System — Material Design 3 (M3) foundation with custom seed color Forest Green (`#0B6E4F`).

## Installation

```bash
npm install @ux42/design-system
# или для приватного реестра Figma (Organization/Enterprise):
npm install @ux42/design-system --registry <your-private-registry>
```

## Usage

```tsx
import { Button, cn } from '@ux42/design-system';
import '@ux42/design-system/css';

export function MyComponent() {
  return <Button variant="default">Save changes</Button>;
}
```

## Tokens

All tokens are CSS custom properties (`--md-sys-color-*`, `--radius-*`) defined in `globals.css`.
Import the CSS file once at your application entry point.

## License

Private — UX42.studio internal use only.