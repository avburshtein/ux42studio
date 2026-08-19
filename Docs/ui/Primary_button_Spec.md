# Master Component Spec: Button / Primary
# Date: 2026-08-19
# Component set ID: 32:39
# Section: Buttons

========================================================
## 1. OVERVIEW
========================================================

Component set: Button / Primary [32:39]
Section: Buttons (on Design System page)
12 variants total (3 States × 2 Sizes × Icon combinations)
Explicit variable mode: Light (14:6) pinned on component set level

### 1.1 Variant Properties

  State (VARIANT): Enabled | Hovered | Pressed
  Size (VARIANT): Large | Medium
  Icon (VARIANT): False | Right | Left
  Label#32:8 (TEXT): default "Button Label"

### 1.2 Variant Matrix

  State=Enabled, Size=Large, Icon=False    [32:18]  166×58
  State=Hovered, Size=Large, Icon=False    [32:20]  166×58
  State=Pressed, Size=Large, Icon=False    [32:22]  166×58
  State=Enabled, Size=Large, Icon=Right    [32:24]  166×56
  State=Hovered, Size=Large, Icon=Right    [32:27]  166×56
  State=Pressed, Size=Large, Icon=Right    [32:30]  166×56
  State=Enabled, Size=Medium, Icon=False   [32:33]  166×48
  State=Hovered, Size=Medium, Icon=False   [32:35]  166×48
  State=Pressed, Size=Medium, Icon=False   [32:37]  166×48
  State=Enabled, Size=Large, Icon=Left     [254:1454] 166×56
  State=Hovered, Size=Large, Icon=Left     [254:1458] 166×56
  State=Pressed, Size=Large, Icon=Left     [254:1462] 166×56

Note: Size=Medium + Icon=Right/Left variants DO NOT EXIST.
In CSS: hide icon or switch to Large when icon is shown.


========================================================
## 2. LAYOUT (all variants)
========================================================

  Direction: HORIZONTAL (flex-row)
  Main axis: CENTER (justify-content: center)
  Cross axis: CENTER (align-items: center)
  Corner radius: 48px (pill shape)
  Clips content: false

### 2.1 Size: Large

  Padding: 16px 32px (top/bottom 16, left/right 32)
  Height: 58px (Icon=False) / 56px (Icon=Right|Left)
  SizingH: FILL on all variants (stretch within parent)

### 2.2 Size: Medium

  Padding: 12px 24px
  Height: 48px
  SizingH: FILL

### 2.3 Icon gap

  Icon=Right or Icon=Left: gap = 8px
  Variable: spacing/8 (VariableID:154:7)
  Icon=False: gap = 0


========================================================
## 3. BACKGROUND FILL
========================================================

Paint Style: "Brand/Primary Gradient"
StyleID: S:d5f7c3c1caa6446fe1ea9630afe995a87dc2abac

Content: Linear Gradient with 2 stops:
  Stop 0 (pos 0): Extended Colors/Button Gradient Start (VariableID:363:396)
  Stop 1 (pos 1): Extended Colors/Button Gradient End (VariableID:363:397)
  Transform: [[0.95, -0.31, 0.15], [0.31, 0.95, 0.02]] ≈ 72deg

### 3.1 Gradient color values by mode

  Button Gradient Start:
    Light:               #00543B (= Schemes/Primary)
    Light High Contrast:  #003323
    Light Medium Contrast:#003F2B
    Dark:                #00543B
    Dark High Contrast:   #00543B
    Dark Medium Contrast: #00543B

  Button Gradient End:
    Light:               #00543B (same as start → solid color in Light)
    Light High Contrast:  #00543B
    Light Medium Contrast:#00543B
    Dark:                #336210 (= Extended Colors/Green Accent)
    Dark High Contrast:   #336210
    Dark Medium Contrast: #336210

### 3.2 CRITICAL: Dark Theme Gradient Behavior

In LIGHT mode: Start = End = #00543B → visually SOLID green.
In DARK mode: Start = #00543B, End = #336210 → true GRADIENT (green → olive-green).

This is an intentional design decision: the button appears as a solid
deep green in light theme, and transitions to a two-tone green gradient
in dark theme for visual interest on dark backgrounds.

CSS recommendation:
  /* Light */
  background: var(--md-sys-color-primary); /* #00543B solid */
  /* or with gradient for consistency: */
  background: linear-gradient(72deg, var(--btn-gradient-start) 0%, var(--btn-gradient-end) 100%);

  /* Dark — gradient becomes visible */
  --btn-gradient-start: #00543B;
  --btn-gradient-end: #336210;
  background: linear-gradient(72deg, var(--btn-gradient-start), var(--btn-gradient-end));

### 3.3 Component Set Mode Pinning

The component set [32:39] has explicitVariableModes = { "VariableCollectionId:14:1606": "14:6" }
This means the Figma canvas always shows the Light mode preview.
The dark theme gradient (#00543B → #336210) is NOT visible on canvas —
it only activates at runtime when the Dark mode is applied.


========================================================
## 4. EFFECTS
========================================================

### 4.1 State=Enabled / State=Pressed

Effect Style: "Effects/Shadow/Button Default"
StyleID: S:c22c1e19d389023f7d57bb3705f341da99557eb2

  Type: DROP_SHADOW
  Color: rgba(0, 0, 0, 0.10)
  Offset: 2px 2px
  Blur: 4px
  Spread: 0px
  showShadowBehindNode: true

  CSS: box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.10);

### 4.2 State=Hovered

Effect Style: "Effects/Shadow/Button Hover Green"
StyleID: S:f605439a01c5dbf95fa18a690916bb400fa3bd26

  Type: DROP_SHADOW
  Color: Shadow/Button Hover Green (VariableID:373:2619) at 20% alpha
    Light: rgba(11, 110, 79, 0.20) = #0B6E4F @ 20%
    Dark: rgba(131, 215, 177, 0.20) = #83D7B1 @ 20%
  Offset: 4px 4px
  Blur: 12px
  Spread: 0px
  showShadowBehindNode: true

  CSS Light: box-shadow: 4px 4px 12px 0px rgba(11, 110, 79, 0.20);
  CSS Dark: box-shadow: 4px 4px 12px 0px rgba(131, 215, 177, 0.20);

  Note: Hover shadow uses a VARIABLE for color — it adapts to theme.
  Light = green glow (#0B6E4F), Dark = mint glow (#83D7B1).
  The variable Shadow/Button Hover Green is in collection material-theme.


========================================================
## 5. TEXT
========================================================

All variants use identical text settings:

  Component property: Label#32:8 → characters
  Default text: "Button Label"
  Text Style: material-theme/button/default
  StyleID: S:e3ce88f8e2e4615dc05d753210ffcdb74749eedd
  Font: Inter Medium
  Size: 16px
  Line height: 24px
  Letter spacing: 0
  Text align: inherited from layout (CENTER)
  SizingH: HUG, SizingV: HUG

  Text fill: Extended Colors/Primary Button Text (VariableID:267:124)
    ALL modes: #FFFFFF (white in every theme)

  CSS: font: 500 16px/24px 'Inter', sans-serif; color: #FFFFFF;

  Note: Text color is always white regardless of theme.
  This is because the button background is always dark enough for
  white text to pass WCAG contrast in both light and dark themes.


========================================================
## 6. ICONS
========================================================

### 6.1 Icon=Right

  Component: arrow-right (44:175), instance 24×24
  Vector rendered via STROKE (not fill):
    Master stroke: Schemes/On Surface (VariableID:14:1627) — default icon color
    In button override: Extended Colors/Primary Button Text (VariableID:267:124) = #FFFFFF
    Stroke weight: 1.6px (overridden from master's 2px)

### 6.2 Icon=Left

  Component: arrow-left (44:167), instance 24×24
  Same stroke treatment as Icon=Right.

### 6.3 Icon color in context

  Icons inside the Primary button are overridden to white (#FFFFFF)
  using the same variable as text: Extended Colors/Primary Button Text.
  This ensures icon and text always match.

  CSS: svg path { stroke: #FFFFFF; stroke-width: 1.6px; fill: none; }
  Or with currentColor: color: #FFFFFF on button, icon inherits.


========================================================
## 7. STATE DIFFERENCES SUMMARY
========================================================

  Property         | Enabled              | Hovered                    | Pressed
  -----------------|----------------------|----------------------------|------------------------
  Fill             | Brand/Primary Grad.  | Brand/Primary Grad. (same) | Brand/Primary Grad. (same)
  Shadow style     | Button Default       | Button Hover Green         | Button Default
  Shadow color     | rgba(0,0,0,0.10)     | rgba(PrimaryContainer,0.20)| rgba(0,0,0,0.10)
  Shadow offset    | 2px 2px              | 4px 4px                    | 2px 2px
  Shadow blur      | 4px                  | 12px                       | 4px
  Text/Icon        | White                | White                      | White
  Background       | identical across states

Note: There is NO fill change between states — only the shadow changes.
Pressed = same as Enabled (subtle intentional choice or possible oversight).
Consider adding a slight darkening or inner shadow for Pressed state in CSS.

  CSS transitions:
  .btn-primary {
    transition: box-shadow 0.2s ease;
  }
  .btn-primary:hover {
    box-shadow: 4px 4px 12px 0px rgba(var(--shadow-btn-hover-rgb), 0.20);
  }


========================================================
## 8. STYLES → TOKENS SUMMARY
========================================================

  Element               | Style/Binding                         | CSS Token
  ----------------------|---------------------------------------|------------------------------------------
  Background fill       | Paint Style "Brand/Primary Gradient"  | linear-gradient(72deg, var(--btn-gradient-start), var(--btn-gradient-end))
  Gradient start        | Var "Extended Colors/Button Gradient Start" | Light: #00543B / Dark: #00543B
  Gradient end          | Var "Extended Colors/Button Gradient End"   | Light: #00543B / Dark: #336210
  Text fill             | Var "Extended Colors/Primary Button Text"   | #FFFFFF (all modes)
  Icon stroke           | Var "Extended Colors/Primary Button Text"   | #FFFFFF (all modes)
  Shadow default        | Effect Style "Effects/Shadow/Button Default"| box-shadow: 2px 2px 4px rgba(0,0,0,0.10)
  Shadow hover          | Effect Style "Effects/Shadow/Button Hover Green" | box-shadow: 4px 4px 12px rgba(hover-color, 0.20)
  Hover shadow color    | Var "Shadow/Button Hover Green"       | Light: #0B6E4F / Dark: #83D7B1
  Corner radius         | 48px (hardcoded, no variable)         | border-radius: 48px
  Icon gap              | Var "spacing/8"                       | gap: 8px
  Text style            | "material-theme/button/default"       | font: 500 16px/24px 'Inter'


========================================================
## 9. VARIABLE COLLECTIONS USED
========================================================

  material-theme (VariableCollectionId:14:1606) — 6 modes:
    Light, Light High Contrast, Light Medium Contrast,
    Dark, Dark High Contrast, Dark Medium Contrast
    Used for: gradient colors, text/icon color, hover shadow color

  spacing (VariableCollectionId:154:2) — 1 mode:
    Used for: icon gap (8px)


========================================================
## 10. KNOWN ISSUES & RECOMMENDATIONS
========================================================

1. CORNER RADIUS NOT BOUND TO VARIABLE
   48px is hardcoded. Recommend binding to a new radius/pill or radius/5xl variable.

2. MISSING MEDIUM + ICON VARIANTS
   Size=Medium exists only with Icon=False.
   No Medium+Right or Medium+Left variants.
   CSS should handle this by either:
   - Switching to Large when icon is present
   - Or supporting Medium+Icon via CSS (same padding 12px 24px + gap 8px)

3. PRESSED STATE = ENABLED STATE
   Both use identical shadow (Button Default). No visual pressed feedback.
   Recommend adding for CSS:
   - transform: translateY(1px) or
   - Slightly darker shadow or
   - Inner shadow

4. COMPONENT SET PINNED TO LIGHT MODE
   explicitVariableModes pins to Light — dark theme gradient
   is invisible on canvas. This is correct behavior (canvas preview
   shows light) but agents/developers must know the dark gradient
   exists: Start=#00543B, End=#336210.

5. SIZING INCONSISTENCY
   Enabled/Large/No-Icon uses SizingV: FIXED (58px)
   All other variants use SizingV: FILL
   This may cause layout issues in some contexts.

6. ICON STROKE WEIGHT OVERRIDE
   Master arrow icons have strokeWeight: 2px
   Inside button, overridden to 1.6px
   Ensure CSS icon size accounts for this thinner stroke.


========================================================
## 11. CSS COMPONENT
========================================================

  :root {
    --btn-primary-gradient-start: #00543B;
    --btn-primary-gradient-end: #00543B;
    --btn-primary-text: #FFFFFF;
    --btn-primary-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.10);
    --btn-primary-shadow-hover: 4px 4px 12px 0px rgba(11, 110, 79, 0.20);
  }

  [data-theme="dark"] {
    --btn-primary-gradient-end: #336210;
    --btn-primary-shadow-hover: 4px 4px 12px 0px rgba(131, 215, 177, 0.20);
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: 500 16px/24px 'Inter', sans-serif;
    color: var(--btn-primary-text);
    background: linear-gradient(72deg, var(--btn-primary-gradient-start), var(--btn-primary-gradient-end));
    border: none;
    border-radius: 48px;
    cursor: pointer;
    transition: box-shadow 0.2s ease;
    box-shadow: var(--btn-primary-shadow);
  }

  /* Size: Large */
  .btn-primary--lg {
    padding: 16px 32px;
    gap: 8px;
  }

  /* Size: Medium */
  .btn-primary--md {
    padding: 12px 24px;
  }

  /* States */
  .btn-primary:hover {
    box-shadow: var(--btn-primary-shadow-hover);
  }

  .btn-primary:active {
    box-shadow: var(--btn-primary-shadow);
    /* Consider adding: transform: translateY(1px); */
  }

  /* Icon */
  .btn-primary svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-width: 1.6px;
    fill: none;
  }


========================================================
## 12. CHILD COMPONENTS (DEPENDENCIES)
========================================================

  arrow-right (44:175) — stroke-based vector icon, 24×24
  arrow-left (44:167) — stroke-based vector icon, 24×24
  Both use Schemes/On Surface stroke in master, overridden to
  Extended Colors/Primary Button Text (#FFFFFF) inside button.