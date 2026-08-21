# Master Component Spec: Tag / Badge
# Date: 2026-08-19
# Component set ID: 43:8
# Section: Tags & Badges

========================================================
## 1. OVERVIEW
========================================================

Component set: Tag / Badge [43:8]
Section: Tags & Badges (on Design System page 6:2)
3 variants (3 visual styles)
No explicit variable modes pinned

⚠️ COMPONENT SET HAS ERRORS
Variant naming is inconsistent:
  • "Variant=Filled" — 1 property
  • "Variant=Tag, Property 2=Badge, Property 3=Outlined" — 3 properties
  • "Variant=Ghost" — 1 property
The second variant has extra properties (Property 2, Property 3)
that don't exist on the other variants. This causes Figma
to report the component set has errors.
Recommended fix: rename to "Variant=Outlined" to match the pattern.

### 1.1 Variant Properties

  Variant (VARIANT): Filled | Outlined* | Ghost
  Label#43:0 (TEXT): default "Tag"

  * Outlined variant's actual name in Figma:
    "Variant=Tag, Property 2=Badge, Property 3=Outlined"

### 1.2 Variant Matrix

  Variant=Filled      [43:2]  52×36  (pill, filled green)
  Variant=Outlined     [43:4]  48×32  (pill, white + border)
  Variant=Ghost        [43:6]  48×28  (pill, frosted glass)


========================================================
## 2. COMMON PROPERTIES (all variants)
========================================================

  Direction: HORIZONTAL (flex-row)
  Main axis align: CENTER (justify-content: center)
  Cross axis align: CENTER (align-items: center)
  Gap: 0px (single child — Label text only)
  Clips content: false
  Opacity: 1.0
  Stroke align: INSIDE (when stroke present)

  All variants contain exactly 1 child: Label (TEXT)
  All variants use pill-shape corner radius

  CSS base:
    display: inline-flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;


========================================================
## 3. LABEL (TEXT) — common across all variants
========================================================

  Content: bound to Label#43:0 property
  Default text: "Tag"
  Font: Inter Medium (500)
  Size: 13px
  Line height: 20px (≈154%)
  Letter spacing: 0.5px
  Text decoration: NONE
  Text case: ORIGINAL (no transform)
  Text align: LEFT
  Auto resize: WIDTH_AND_HEIGHT (adapts to content)
  Text style: material-theme/label/medium

  CSS base:
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.5px;
    white-space: nowrap;


========================================================
## 4. VARIANT-SPECIFIC STYLES
========================================================

### 4.1 Variant=Filled [43:2]

  Size: 52×36 (HUG content + padding)
  Padding: 8px 14px (top/bottom 8, left/right 14)
  Corner radius: 12px

  Background fill:
    #056C4D — bound to Schemes/Surface Tint
    (VariableID:14:1608)
    Light mode: rgba(5, 108, 77, 1)

  Shadow:
    DROP_SHADOW x:1 y:1 blur:4 spread:0
    Color: rgba(0, 0, 0, 0.10) — black @10%
    No effect style bound

  Label fill:
    #FFFFFF — bound to Extended Colors/Primary Button Text
    (VariableID:267:124)

  CSS:
    padding: 8px 14px;
    border-radius: 12px;
    background-color: var(--md-sys-color-surface-tint);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
    color: var(--md-ext-color-primary-button-text);

  Use case: primary/accent tags — tool badges in portfolio
  case hero section ("Figma", "React", "Node.js", etc.)

### 4.2 Variant=Outlined [43:4]

  Size: 48×32 (HUG content + padding)
  Padding: 6px 12px (top/bottom 6, left/right 12)
  Corner radius: 10px

  Background fill:
    #FFFFFF — bound to Schemes/Surface Container Lowest
    (VariableID:14:1651)

  Stroke:
    1px INSIDE
    rgba(30, 106, 79, 0.16) — bound to State Layers/Primary/Opacity-16
    (VariableID:14:1867)

  No shadow

  Label fill:
    #44474B — bound to Schemes/On Surface Variant
    (VariableID:14:1629)

  CSS:
    padding: 6px 12px;
    border-radius: 10px;
    background-color: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-state-primary-opacity-16);
    color: var(--md-sys-color-on-surface-variant);

  Use case: secondary tags — skill/competence tags on main
  page ("UX Research", "Wireframing", "Prototyping", etc.)
  and tool tags ("Figma", "FigJam", "Maze", "Cursor")

### 4.3 Variant=Ghost [43:6]

  Size: 48×28 (HUG content + padding)
  Padding: 4px 12px (top/bottom 4, left/right 12)
  Corner radius: 12px

  Background fill:
    rgba(255, 255, 255, 0.16) — bound to State Layers/On Secondary/Opacity-16
    (VariableID:14:1873)

  Effect:
    BACKGROUND_BLUR radius: 4px (frosted glass)
    No effect style bound

  No stroke, no shadow

  Label fill:
    #FFFFFF — bound to Schemes/On Primary
    (VariableID:14:1609)

  CSS:
    padding: 4px 12px;
    border-radius: 12px;
    background: var(--md-sys-state-on-secondary-opacity-16);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    color: var(--md-sys-color-on-primary);

  Use case: overlay tags on dark/image backgrounds —
  used on Design System page in examples


========================================================
## 5. SIZE COMPARISON TABLE
========================================================

  Variant     Height  Pad-TB  Pad-LR  Radius  Stroke
  ─────────   ──────  ──────  ──────  ──────  ──────
  Filled      36px    8px     14px    12px    none
  Outlined    32px    6px     12px    10px    1px
  Ghost       28px    4px     12px    12px    none

  Note: Height depends on padding + 20px line height.
  Filled is the largest, Ghost is the smallest.


========================================================
## 6. DESIGN TOKEN MAPPING
========================================================

  Token                        Figma Variable                       CSS Custom Property
  ──────────────────────────   ────────────────────────────────────  ──────────────────────────────────────
  Filled BG                    Schemes/Surface Tint                 --md-sys-color-surface-tint
  Filled text                  Extended Colors/Primary Button Text  --md-ext-color-primary-button-text
  Filled shadow                hardcoded black @10%                 box-shadow: 1px 1px 4px rgba(0,0,0,.1)
  Outlined BG                  Schemes/Surface Container Lowest     --md-sys-color-surface-container-lowest
  Outlined stroke              State Layers/Primary/Opacity-16      --md-sys-state-primary-opacity-16
  Outlined text                Schemes/On Surface Variant           --md-sys-color-on-surface-variant
  Ghost BG                     State Layers/On Secondary/Opacity-16 --md-sys-state-on-secondary-opacity-16
  Ghost backdrop blur          hardcoded 4px                        backdrop-filter: blur(4px)
  Ghost text                   Schemes/On Primary                   --md-sys-color-on-primary
  Font family                  Inter                                --md-sys-typescale-label-medium-font
  Font weight                  500 (Medium)                         --md-sys-typescale-label-medium-weight
  Font size                    13px                                 --md-sys-typescale-label-medium-size
  Line height                  20px                                 --md-sys-typescale-label-medium-line-height
  Letter spacing               0.5px                                --md-sys-typescale-label-medium-tracking


========================================================
## 7. ACCESSIBILITY
========================================================

  Minimum touch target: NOT met on Ghost (28px < 44px)
    Recommendation: add transparent hit area to 44px height
    CSS: min-height: 44px; or use padding to reach 44px
  
  Filled contrast:
    White text on #056C4D → ratio ~5.5:1 ✓ (WCAG AA)
  
  Outlined contrast:
    #44474B text on white → ratio ~9.5:1 ✓ (WCAG AAA)
  
  Ghost contrast:
    White text on semi-transparent BG — depends on
    underlying surface. Verify per usage context.

  Interactive states: ⚠️ NOT DEFINED
    No Hovered / Focused / Disabled states exist.
    If tags are clickable (filter/navigation), add:
    • Hovered: opacity 0.8 or background shift
    • Focused: 2px outline (Schemes/Primary)
    • Disabled: opacity 0.38
    Currently used as static labels only.


========================================================
## 8. USAGE IN FILE (32 instances total)
========================================================

  Page "main" (0:1):
    • 15 × Outlined variant in "Tags" container
      Skills: UX Research, Wireframing, Prototyping,
      Figma Handoff, Web Design, Mobile Apps, Landing Pages,
      Psychology-led UX
      Tools: Figma, FigJam, Maze, Protopie, Webflow,
      Adobe Firefly, Cursor

  Page "Portfolio case" (4:263):
    • 10 × Filled variant in "Tools Row" containers
      Examples: Figma, React, Node.js, PostgreSQL, Stripe

  Page "Design System" (6:2):
    • 5 × Ghost variant in example containers
      Examples: Shopify, Product Design

  Other pages: 2 additional instances


========================================================
## 9. REACT COMPONENT TEMPLATE
========================================================

type TagVariant = 'filled' | 'outlined' | 'ghost';

interface TagBadgeProps {
  label: string;
  variant?: TagVariant;  // default: 'outlined'
  className?: string;
}

<span
  className={cn(
    styles.tag,
    styles[variant],
    className
  )}
>
  {label}
</span>

// CSS Modules:
.tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.filled {
  padding: 8px 14px;
  border-radius: 12px;
  background-color: var(--md-sys-color-surface-tint);
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
  color: var(--md-ext-color-primary-button-text);
}

.outlined {
  padding: 6px 12px;
  border-radius: 10px;
  background-color: var(--md-sys-color-surface-container-lowest);
  border: 1px solid var(--md-sys-state-primary-opacity-16);
  color: var(--md-sys-color-on-surface-variant);
}

.ghost {
  padding: 4px 12px;
  border-radius: 12px;
  background: var(--md-sys-state-on-secondary-opacity-16);
  backdrop-filter: blur(4px);
  color: var(--md-sys-color-on-primary);
}