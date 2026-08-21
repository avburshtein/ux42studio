# Master Component Spec: Link Button
# Date: 2026-08-19
# Component set ID: 604:597
# Section: Navigation / Buttons

========================================================
## 1. OVERVIEW
========================================================

Component set: Link Button [604:597]
Section: Navigation (on Design System page 6:2)
4 variants (4 States × 1 Size)
No explicit variable modes pinned

### 1.1 Variant Properties

  State (VARIANT): Enabled | Hovered | Focused | Disabled
  Label#604:0 (TEXT): default "View prototype in Figma"

### 1.2 Variant Matrix

  State=Enabled    [410:535]  217×44
  State=Hovered    [604:588]  217×44
  State=Focused    [604:591]  217×44
  State=Disabled   [604:594]  217×44


========================================================
## 2. LAYOUT (all variants)
========================================================

  Direction: HORIZONTAL (flex-row)
  Main axis align: MIN (justify-content: flex-start)
  Cross axis align: CENTER (align-items: center)
  Gap: 8px (between label and icon)
  Padding: 10px 0px 10px 0px (top/bottom 10, left/right 0)
  Corner radius: 0px (except Focused — see §4)
  Clips content: false
  Background fill: none (transparent)
  Border/stroke: none
  Shadow: none (except Focused — see §4)
  Width: HUG (fits content)
  Height: 44px (10 + 24 line-height + 10)

  CSS equivalent:
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;


========================================================
## 3. CHILDREN (2 layers, all variants)
========================================================

### 3.1 Label (TEXT)

  Content: bound to Label#604:0 property
  Default text: "View prototype in Figma"
  Font: Inter Medium (500)
  Size: 16px
  Line height: 24px (150%)
  Letter spacing: 0.15px
  Text decoration: UNDERLINE
  Text align: LEFT
  Auto resize: WIDTH_AND_HEIGHT
  Text style: material-theme/title/medium
    (Style ID: S:b6799fe189874fe5270f6a3643e697f3d8855b28,)
  
  Fill color: #00543B — bound to variable Schemes/Primary
    (Variable ID: VariableID:14:1607)
    Light mode resolved: rgba(0, 84, 59, 1) → #00543B
    Collection: material-theme (6 modes)
  
  CSS equivalent:
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    text-decoration: underline;
    text-underline-offset: 2px;
    color: var(--md-sys-color-primary);

### 3.2 Icon (INSTANCE of chevron-right)

  Master component: chevron-right [44:623]
  Size: 20×20px
  Inner structure: Vector node
    Stroke weight: 2px
    Stroke cap: ROUND
    Stroke join: ROUND
    Stroke color: #00543B — bound to Schemes/Primary
      (Variable ID: VariableID:14:1607)
    Fill: none
  
  CSS equivalent (using Lucide React or SVG):
    <ChevronRight size={20} strokeWidth={2} />
    
    Or inline SVG:
    width: 20px; height: 20px;
    stroke: var(--md-sys-color-primary);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;


========================================================
## 4. STATE STYLES
========================================================

### 4.1 State=Enabled (default)

  Opacity: 1.0
  Corner radius: 0px
  Effects: none
  
  CSS:
    opacity: 1;

### 4.2 State=Hovered

  Opacity: 0.8
  Corner radius: 0px
  Effects: none
  All other properties: same as Enabled
  
  CSS:
    &:hover {
      opacity: 0.8;
    }

### 4.3 State=Focused

  Opacity: 1.0
  Corner radius: 4px
  Effects: DROP_SHADOW simulating focus ring
    x: 0, y: 0
    blur: 0px
    spread: 2px
    color: #00543B (rgba(0,84,59,1)) — Schemes/Primary
  
  Note: Figma has no native CSS outline, so focus ring is
  implemented as a zero-blur DROP_SHADOW with spread.
  In CSS, use outline instead.
  
  CSS:
    &:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;
      border-radius: 4px;
    }

### 4.4 State=Disabled

  Opacity: 0.38 (M3 standard disabled opacity)
  Corner radius: 0px
  Effects: none
  All other properties: same as Enabled
  Pointer events: none
  
  CSS:
    &:disabled, &[aria-disabled="true"] {
      opacity: 0.38;
      pointer-events: none;
      cursor: default;
    }


========================================================
## 5. ACCESSIBILITY
========================================================

  Role: <a> (link) or <button> depending on usage
  Touch target: 44px height ✓ (WCAG 2.5.8 minimum)
  Underline: always visible ✓ (link distinguishable)
  Color contrast (Light mode):
    #00543B on white → ratio ~7.5:1 ✓ (WCAG AAA)
  Focus indicator: 2px outline ✓ (WCAG 2.4.7)
  Disabled state: opacity 0.38 + pointer-events: none


========================================================
## 6. USAGE IN FILE
========================================================

Instances found:
  • [412:854] Page "Portfolio case" (4:263)
    Parent: "Section 03 — Design Process"
    Label override: "View Lo-Fi prototype in Figma"
    State: Enabled

  • [412:858] Page "Portfolio case" (4:263)
    Parent: "Section 06 — Final Design"
    Label override: "View Hi-Fi prototype in Figma"
    State: Enabled


========================================================
## 7. REACT COMPONENT TEMPLATE
========================================================

interface LinkButtonProps {
  label?: string;
  href: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// States are handled via CSS pseudo-classes,
// not separate component variants.
// Only disabled needs a prop.

<a
  href={href}
  className={cn(styles.linkButton, className)}
  aria-disabled={disabled || undefined}
  tabIndex={disabled ? -1 : undefined}
  onClick={disabled ? undefined : onClick}
>
  <span className={styles.label}>{label}</span>
  <ChevronRight size={20} strokeWidth={2} />
</a>


========================================================
## 8. DESIGN TOKEN MAPPING
========================================================

  Token                    Figma Variable         CSS Custom Property
  ─────────────────────    ────────────────────    ──────────────────────
  Text color               Schemes/Primary        --md-sys-color-primary
  Icon stroke              Schemes/Primary        --md-sys-color-primary
  Focus ring color         Schemes/Primary        --md-sys-color-primary
  Disabled opacity         0.38 (M3 standard)     --md-sys-state-disabled-opacity
  Hover opacity            0.8                    (custom)
  Focus border-radius      4px                    --md-sys-shape-corner-extra-small
  Font family              Inter                  --md-sys-typescale-title-medium-font
  Font weight              500 (Medium)           --md-sys-typescale-title-medium-weight
  Font size                16px                   --md-sys-typescale-title-medium-size
  Line height              24px                   --md-sys-typescale-title-medium-line-height
  Letter spacing           0.15px                 --md-sys-typescale-title-medium-tracking