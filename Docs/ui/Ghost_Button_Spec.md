> ⚠️ АКТУАЛИЗАЦИЯ 2026-08-28 — ghost-семейство в реализации: hover opacity-70
> (90 на прозрачных фонах не виден); nav-ссылки и ThemeToggle — color-only
> hover (см. Main_page_Spec.md «Кнопочная система», решения (9)–(11)).
> Ниже — исходная спека по Figma (историческая справка).


# Master Component Spec: Button / Ghost
# Date: 2026-08-19
# Component set ID: 34:24
# Section: Buttons

========================================================
## 1. OVERVIEW
========================================================

Component set: Button / Ghost [34:24]
Section: Buttons (on Design System page)
12 variants total (3 States × 2 Sizes × Arrow combinations)
Explicit variable mode: Light (14:6) pinned on component set level

### 1.1 Variant Properties

  State (VARIANT): Enabled | Hovered | Pressed
  Size (VARIANT): Large | Small
  Arrow (VARIANT): False | Right | Left
  Label#34:0 (TEXT): default "Button Label"

### 1.2 Variant Matrix

  State=Enabled, Size=Large, Arrow=False    [34:3]    145×48
  State=Hovered, Size=Large, Arrow=False    [34:5]    145×48
  State=Pressed, Size=Large, Arrow=False    [34:7]    145×48
  State=Enabled, Size=Large, Arrow=Right    [34:9]    145×48
  State=Hovered, Size=Large, Arrow=Right    [34:12]   145×48
  State=Pressed, Size=Large, Arrow=Right    [34:15]   145×48
  State=Enabled, Size=Small, Arrow=False    [34:18]   145×48
  State=Hovered, Size=Small, Arrow=False    [34:20]   145×48
  State=Pressed, Size=Small, Arrow=False    [34:22]   145×48
  State=Enabled, Size=Large, Arrow=Left     [254:1478] 145×48
  State=Hovered, Size=Large, Arrow=Left     [254:1482] 145×48
  State=Pressed, Size=Large, Arrow=Left     [254:1486] 145×48

Note: Size=Small + Arrow=Right/Left variants DO NOT EXIST.
Only Arrow=False is available for Small size.


========================================================
## 2. LAYOUT (all variants)
========================================================

  Direction: HORIZONTAL (flex-row)
  Main axis: CENTER (justify-content: center)
  Cross axis: CENTER (align-items: center)
  Corner radius: 8px (HARDCODED — not bound to radius variable)
  Clips content: false

### 2.1 Padding (identical for Large and Small)

  Padding: 12px 16px (top/bottom 12, left/right 16)
  NOT bound to spacing variables (hardcoded)

### 2.2 Arrow gap

  Arrow=Right or Arrow=Left: gap = 8px
  Variable: spacing/8 (VariableID:154:7)
  Arrow=False: gap = 0

### 2.3 Size Differences

  IMPORTANT: In the current Figma component, Large and Small share
  IDENTICAL padding (12px 16px) and height (48px).
  There is NO actual size difference in the component definition.
  The Size property exists but both values render identically.

  Recommendation for CSS:
    Large: padding 12px 16px (as defined)
    Small: reduce to padding 8px 12px or similar for actual differentiation


========================================================
## 3. BACKGROUND FILL
========================================================

  fills: [] (EMPTY — no background)

  This is a ghost/transparent button. It has NO background fill
  in any state. The button is purely text + optional icon on a
  transparent background.

  CSS: background: transparent; (or background: none;)


========================================================
## 4. STROKES
========================================================

  strokes: [] (EMPTY — no border)

  Unlike an outlined button, Ghost has no stroke/border.

  CSS: border: none;


========================================================
## 5. EFFECTS
========================================================

  effects: [] (EMPTY — no shadow in any state)

  Unlike Button/Primary, the Ghost button has NO shadow effects
  in Figma. See Section 8 for the recommended hover effect.


========================================================
## 6. STATE BEHAVIOR — OPACITY
========================================================

The Ghost button communicates state changes exclusively through
OPACITY on the variant frame (the entire button, including text
and icon):

  State=Enabled:  opacity = 1.0  (100%)
  State=Hovered:  opacity = 0.8  (80%)
  State=Pressed:  opacity = 0.6  (60%)

This pattern is consistent across ALL 12 variants —
every Size × Arrow combination follows the same opacity values.

  CSS:
  .btn-ghost { opacity: 1; transition: opacity 0.2s ease; }
  .btn-ghost:hover { opacity: 0.8; }
  .btn-ghost:active { opacity: 0.6; }


========================================================
## 7. TEXT
========================================================

All variants use identical text settings:

  Component property: Label#34:0 → characters
  Default text: "Button Label"
  Text Style: material-theme/button/default
  StyleID: S:e3ce88f8e2e4615dc05d753210ffcdb74749eedd
  Font: Inter Medium
  Size: 16px
  Line height: 24px
  Letter spacing: 0
  Text align: inherited from layout (CENTER)
  SizingH: HUG, SizingV: HUG

  Text fill: Schemes/On Surface Variant (VariableID:14:1629)

### 7.1 Text Color by Mode

  Light:               #44474B   rgb(68, 71, 75)
  Light High Contrast:  #000000   rgb(0, 0, 0)
  Light Medium Contrast:#34363B   rgb(52, 54, 59)
  Dark:                #C5C6CC   rgb(197, 198, 204)
  Dark High Contrast:   #FFFFFF   rgb(255, 255, 255)
  Dark Medium Contrast: #DBDCE2   rgb(219, 220, 226)

  CSS:
  color: var(--md-sys-color-on-surface-variant);
  /* Light: #44474B, Dark: #C5C6CC */

  IMPORTANT: Text color is On Surface VARIANT (muted), NOT On Surface.
  This is intentional for a ghost/secondary button — it is visually
  quieter than a primary button.


========================================================
## 8. RECOMMENDED HOVER EFFECT (from Button/Primary pattern)
========================================================

In the current Figma component, hover is handled ONLY by opacity
reduction (100% → 80%). This is a minimal approach.

For consistency with Button/Primary's hover pattern, the following
CSS hover enhancement is recommended:

### 8.1 Background tint on hover

  Add a subtle background fill on hover using the Surface Tint /
  Primary Container color at low opacity (≈5%):

  .btn-ghost:hover {
    background: rgba(var(--md-sys-color-primary-container-rgb), 0.05);
  }

  Primary Container values by mode:
    Light:               #0B6E4F
    Light High Contrast:  #00543B
    Light Medium Contrast:#0B6E4F
    Dark:                #0B6E4F
    Dark High Contrast:   #7FD3AE
    Dark Medium Contrast: #4CA07D

### 8.2 Shadow on hover (matching Primary pattern)

  Button/Primary uses "Effects/Shadow/Button Hover Green" on hover:
    4px 4px 12px rgba(Shadow/Button Hover Green, 0.20)
    Light: rgba(11, 110, 79, 0.20)
    Dark: rgba(131, 215, 177, 0.20)

  For Ghost button, use the SAME shadow but at REDUCED intensity
  (≈50% of Primary's values) to maintain visual hierarchy:

  .btn-ghost:hover {
    box-shadow: 2px 2px 8px 0px rgba(var(--shadow-btn-hover-rgb), 0.10);
    /* Half the offset, 2/3 blur, half the alpha vs Primary */
  }

  OR a simpler approach — just the background tint without shadow,
  which keeps ghost subordinate to primary:

  .btn-ghost:hover {
    background: rgba(var(--md-sys-color-primary-container-rgb), 0.05);
    opacity: 1; /* Override the 0.8 opacity — tint replaces fade */
  }

### 8.3 Full recommended CSS with hover enhancement

  .btn-ghost {
    opacity: 1;
    background: transparent;
    transition: all 0.2s ease;
  }
  .btn-ghost:hover {
    opacity: 0.95; /* Slight fade + tint, not full 0.8 */
    background: rgba(var(--md-sys-color-primary-container-rgb), 0.05);
    box-shadow: 2px 2px 8px 0px rgba(var(--shadow-btn-hover-rgb), 0.10);
  }
  .btn-ghost:active {
    opacity: 0.6;
    background: transparent;
    box-shadow: none;
  }


========================================================
## 9. ICONS
========================================================

### 9.1 Arrow=Right

  Component: arrow-right (44:175), instance 24×24
  Vector rendered via STROKE (not fill):
    Stroke color: Schemes/On Surface Variant (VariableID:14:1629)
    Stroke weight: 1.6px
    Fill: none (empty array)

### 9.2 Arrow=Left

  Component: arrow-left (44:167), instance 24×24
  Same stroke treatment as Arrow=Right.

### 9.3 Icon color matches text

  Icons inside the Ghost button use the SAME variable as text:
  Schemes/On Surface Variant (VariableID:14:1629).

  This differs from Button/Primary where icons override to
  Extended Colors/Primary Button Text (#FFFFFF).
  Ghost button icons are muted gray, matching the text.

  CSS: svg path { stroke: var(--md-sys-color-on-surface-variant); stroke-width: 1.6px; fill: none; }
  Or with currentColor: color: var(--md-sys-color-on-surface-variant); icon inherits.


========================================================
## 10. COMPARISON WITH BUTTON/PRIMARY
========================================================

  Property         | Button/Primary            | Button/Ghost
  -----------------|---------------------------|---------------------------
  Background       | Brand/Primary Gradient    | transparent (none)
  Border           | none                      | none
  Text color       | #FFFFFF (all modes)       | On Surface Variant (adaptive)
  Icon color       | #FFFFFF override           | On Surface Variant (same as text)
  Shadow default   | Button Default 2/2/4      | none
  Shadow hover     | Button Hover Green 4/4/12 | none (opacity only)
  State: Enabled   | full appearance           | opacity 1.0
  State: Hovered   | shadow change             | opacity 0.8
  State: Pressed   | shadow = default          | opacity 0.6
  Corner radius    | 48px (pill)               | 8px (rounded rect)
  Padding Large    | 16px 32px                 | 12px 16px
  Padding Med/Sm   | 12px 24px (Medium)        | 12px 16px (Small, same!)
  Sizes            | Large, Medium             | Large, Small
  Arrow/Icon prop  | Icon (False/Right/Left)   | Arrow (False/Right/Left)
  Missing variants | Medium + Icon=R/L         | Small + Arrow=R/L
  Mode pinning     | Light (14:6)              | Light (14:6)

  KEY DIFFERENCE: Primary is a filled CTA, Ghost is a transparent
  secondary action. Visual hierarchy is maintained by color contrast
  and background treatment, not by size or shape.


========================================================
## 11. STYLES → TOKENS SUMMARY
========================================================

  Element               | Style/Binding                          | CSS Token
  ----------------------|----------------------------------------|------------------------------------------
  Background            | none (transparent)                     | background: transparent
  Text fill             | Var "Schemes/On Surface Variant"       | color: var(--md-sys-color-on-surface-variant)
  Icon stroke           | Var "Schemes/On Surface Variant"       | stroke: var(--md-sys-color-on-surface-variant)
  Corner radius         | 8px (hardcoded, no variable)           | border-radius: 8px
  Icon gap              | Var "spacing/8"                        | gap: 8px
  Text style            | "material-theme/button/default"        | font: 500 16px/24px 'Inter'
  State: Enabled        | opacity: 1.0                           | opacity: 1
  State: Hovered        | opacity: 0.8                           | opacity: 0.8
  State: Pressed        | opacity: 0.6                           | opacity: 0.6


========================================================
## 12. VARIABLE COLLECTIONS USED
========================================================

  material-theme (VariableCollectionId:14:1606) — 6 modes:
    Light, Light High Contrast, Light Medium Contrast,
    Dark, Dark High Contrast, Dark Medium Contrast
    Used for: text/icon color (On Surface Variant)

  spacing (VariableCollectionId:154:2) — 1 mode:
    Used for: icon gap (8px)


========================================================
## 13. KNOWN ISSUES & RECOMMENDATIONS
========================================================

1. CORNER RADIUS NOT BOUND TO VARIABLE
   8px is hardcoded. Recommend binding to radius/base (154:30 = 12px)
   or creating radius/sm (8px) if that's the intent.

2. PADDING NOT BOUND TO VARIABLES
   12px and 16px are hardcoded. Recommend:
     paddingTop/Bottom → spacing/12 (VariableID:154:9)
     paddingLeft/Right → spacing/16 (VariableID:154:10)

3. MISSING SMALL + ARROW VARIANTS
   Size=Small exists only with Arrow=False.
   No Small+Right or Small+Left variants.
   Same pattern as Primary's missing Medium+Icon variants.

4. LARGE vs SMALL SIZE IDENTICAL
   Both sizes share the same padding (12px 16px) and height (48px).
   There is no visual distinction between Large and Small.
   Recommend differentiating:
     Large: padding 12px 16px (current)
     Small: padding 8px 12px, fontSize 14px

5. HOVER EFFECT IS OPACITY ONLY
   Unlike Primary which changes shadow, Ghost only reduces opacity.
   This is a valid minimal approach, but consider adding a subtle
   background tint (≈5% Primary Container) on hover for better
   affordance. See Section 8 for the full recommendation.

6. NO PRESSED FEEDBACK BEYOND OPACITY
   Pressed reduces to 60% opacity, which may not be noticeable
   enough for users. Consider adding transform: scale(0.98) or
   translateY(1px) on :active.

7. COMPONENT SET PINNED TO LIGHT MODE
   Same as Primary: explicitVariableModes pins to Light.
   Dark theme colors are invisible on canvas but active at runtime.
   In Dark mode, On Surface Variant changes from #44474B to #C5C6CC.

8. SIZING V INCONSISTENCY
   Hovered variants use SizingV: FIXED while Enabled and Pressed
   use SizingV: FILL. This may cause subtle layout shifts on hover
   in certain parent layouts.


========================================================
## 14. CSS COMPONENT
========================================================

  :root {
    --btn-ghost-text: var(--md-sys-color-on-surface-variant); /* #44474B */
    --btn-ghost-hover-bg: rgba(11, 110, 79, 0.05); /* Primary Container @ 5% */
    --btn-ghost-hover-shadow: 2px 2px 8px 0px rgba(11, 110, 79, 0.10);
  }

  [data-theme="dark"] {
    /* --btn-ghost-text auto-adapts via On Surface Variant: #C5C6CC */
    --btn-ghost-hover-bg: rgba(11, 110, 79, 0.08);
    --btn-ghost-hover-shadow: 2px 2px 8px 0px rgba(131, 215, 177, 0.10);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: 500 16px/24px 'Inter', sans-serif;
    color: var(--btn-ghost-text);
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    opacity: 1;
    transition: all 0.2s ease;
  }

  /* Size: Large */
  .btn-ghost--lg {
    padding: 12px 16px;
    gap: 8px;
  }

  /* Size: Small */
  .btn-ghost--sm {
    padding: 12px 16px; /* Currently identical — see known issues */
  }

  /* States — Figma-faithful (opacity only) */
  .btn-ghost:hover {
    opacity: 0.8;
  }
  .btn-ghost:active {
    opacity: 0.6;
  }

  /* States — Enhanced (recommended, matching Primary hover pattern) */
  .btn-ghost:hover {
    opacity: 0.95;
    background: var(--btn-ghost-hover-bg);
    box-shadow: var(--btn-ghost-hover-shadow);
  }
  .btn-ghost:active {
    opacity: 0.6;
    background: transparent;
    box-shadow: none;
  }

  /* Icon */
  .btn-ghost svg {
    width: 24px;
    height: 24px;
    stroke: currentColor;
    stroke-width: 1.6px;
    fill: none;
  }


========================================================
## 15. CHILD COMPONENTS (DEPENDENCIES)
========================================================

  arrow-right (44:175) — stroke-based vector icon, 24×24
  arrow-left (44:167) — stroke-based vector icon, 24×24
  Both use Schemes/On Surface Variant stroke (same as button text).