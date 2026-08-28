> ⚠️ АКТУАЛИЗАЦИЯ 2026-08-28 — чипы фильтров в реализации (Main_page_Spec.md,
> «Кнопочная система», решения (9)–(10)): selected = bg-surface-tint + тень,
> hover opacity-90 + рост тени; unselected = bg-surface/8, hover заливка
> rgba(11,110,79,0.1) (transition-colors). Форма pill px-24 py-12.
> Ниже — исходная спека по Figma (историческая справка).


# Master Component Spec: Filter Button
# Date: 2026-08-22
# Component set ID: 36:18
# Section: Buttons / Filters

========================================================
## 1. OVERVIEW
========================================================

Component set: Filter Button [36:18]
Section: Buttons (on Design System page 6:2)
6 variants: 2 Selected states × 3 interaction states
Used as: category/tag filter toggle (e.g. "All", "Web Design",
"App Design", "Branding")

### 1.1 Component Properties

  Selected (VARIANT): False | True
  State (VARIANT): Enabled | Hovered | Pressed
  Label#36:0 (TEXT): default "Category"

### 1.2 Variant Matrix

  Selected=False, State=Enabled  [36:2]   110×44   HUG/HUG
  Selected=False, State=Hovered  [36:6]   110×46.2 HUG/FIXED
  Selected=False, State=Pressed  [41:2]   110×41.8 HUG/FIXED
  Selected=True,  State=Enabled  [36:10]  110×44   HUG/HUG
  Selected=True,  State=Hovered  [36:12]  115.5×46.2 FIXED/FIXED
  Selected=True,  State=Pressed  [36:16]  110×41.8 HUG/FIXED


========================================================
## 2. BUTTON FRAME (component root — all variants)
========================================================

### 2.1 Common Layout

  Layout: HORIZONTAL
  Main axis align: CENTER
  Cross axis align: CENTER
  Padding: 12px top / 24px right / 12px bottom / 24px left
  Gap: 0
  Corner radius: 48px all corners (full-pill)
  Clips content: false
  Strokes: none (no border on any variant)
  Children: single TEXT node "Label"

  The button HUGs its content — width is driven by text length.
  Height is nominally 44px but shifts ±2px on Hover/Press
  to create a physical "bounce" effect.

### 2.2 Size Transitions (Physical Bounce)

  ⚠️ IMPORTANT: The button physically changes size across states.
  This is NOT a standard CSS hover — the component grows and shrinks.

  State        Width    Height   Delta from Enabled
  ─────────    ─────    ──────   ──────────────────
  Enabled      HUG      44px    baseline
  Hovered      HUG      46.2px  +2.2px taller (lifts up)
  Pressed      HUG      41.8px  -2.2px shorter (pushes down)

  Selected=True, Hovered is also wider: 115.5px (FIXED)
  vs 110px for all others.

  CSS implementation:
    Use transform: scaleY() or padding transitions to simulate
    the size change. OR keep fixed size and use translateY
    for the visual lift/press effect:

    .filter-btn {
      height: 44px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .filter-btn:hover {
      transform: translateY(-1px);
      /* or: transform: scale(1.0, 1.05); */
    }
    .filter-btn:active {
      transform: translateY(1px);
      /* or: transform: scale(1.0, 0.95); */
    }


========================================================
## 3. FILLS — Selected=False (Unselected)
========================================================

### 3.1 State=Enabled (unselected, resting)

  Fill: State Layers/Surface/Opacity-08
    (VariableID for State Layers/Surface/Opacity-08)
    Resolved: rgba(252, 248, 250, 0.08)
    ≈ nearly transparent, very faint warm tint
  Effects: none
  Opacity: 1

  Visual: ghost/text-only button with subtle frosted background.
  The 8% opacity surface fill provides minimal presence.

  CSS:
    background: rgba(252, 248, 250, 0.08);
    /* or: var(--md-sys-state-surface-opacity-08) */
    box-shadow: none;

### 3.2 State=Hovered (unselected)

  Fill: State Layers/On Primary Container/Opacity-08
    Resolved: rgba(152, 237, 198, 0.08)
    ≈ very faint green tint (primary hint)
  Effect style: Effects/Shadow/Button Hover Black
    DROP_SHADOW: x:4 y:4 blur:12 spread:0
                 rgba(0, 0, 0, 0.20)
  Opacity: 1

  Visual: gains a subtle green tint + dark shadow.
  The shadow is the main hover indicator.

  CSS:
    background: rgba(152, 237, 198, 0.08);
    box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.20);

### 3.3 State=Pressed (unselected)

  Fill: State Layers/On Primary Container/Opacity-08
    Resolved: rgba(152, 237, 198, 0.08)
    (same as Hovered)
  Effect style: Effects/Shadow/Button Hover Black
    DROP_SHADOW: x:4 y:4 blur:12 spread:0
                 rgba(0, 0, 0, 0.20)
    (same shadow as Hovered)
  Opacity: 1

  Visual: same fill/shadow as Hovered, but height shrinks
  to 41.8px (press-down effect).

  CSS:
    background: rgba(152, 237, 198, 0.08);
    box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.20);
    /* + transform: translateY(1px) for press feel */


========================================================
## 4. FILLS — Selected=True (Active)
========================================================

### 4.1 State=Enabled (selected, resting)

  Fill: Schemes/Surface Tint
    Resolved: rgba(5, 108, 77, 1) → #056C4D
    Solid dark green (primary brand)
  Effect style: Effects/Shadow/Button Default
    DROP_SHADOW: x:2 y:2 blur:4 spread:0
                 rgba(0, 0, 0, 0.10)
  Opacity: 1

  Visual: solid green pill with subtle shadow.

  CSS:
    background: var(--md-sys-color-surface-tint);
    /* fallback: #056C4D */
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.10);

### 4.2 State=Hovered (selected)

  Fill: Schemes/Surface Tint
    Resolved: rgba(5, 108, 77, 1) → #056C4D
    (same fill as Enabled)
  Effect style: Effects/Shadow/Button Hover Green
    DROP_SHADOW: x:4 y:4 blur:12 spread:0
                 rgba(11, 110, 79, 0.20) → green-tinted shadow
  Opacity: 1

  Visual: same green fill, but shadow grows and turns green.
  The green shadow creates a "glow" effect on hover.

  CSS:
    background: var(--md-sys-color-surface-tint);
    box-shadow: 4px 4px 12px 0 rgba(11, 110, 79, 0.20);

### 4.3 State=Pressed (selected)

  Fill: Schemes/Surface Tint
    Resolved: rgba(5, 108, 77, 1) → #056C4D
  Effect style: Effects/Shadow/Button Default
    DROP_SHADOW: x:2 y:2 blur:4 spread:0
                 rgba(0, 0, 0, 0.10)
    (returns to default shadow on press)
  Opacity: 1

  Visual: green fill, shadow returns to small default.
  Button shrinks down (41.8px).

  CSS:
    background: var(--md-sys-color-surface-tint);
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.10);


========================================================
## 5. TEXT — "Label" node
========================================================

### 5.1 Common Text Properties (all 6 variants)

  Content: "Category" (default, overridable via Label property)
  Font: Inter Medium (weight 500)
  Size: 13px
  Line height: 20px (fixed, PIXELS)
  Letter spacing: 0.5px
  Text style: material-theme/label/medium
  Auto resize: WIDTH_AND_HEIGHT (text determines own bounds)
  Alignment: center/center (via parent auto-layout)

### 5.2 Text Color by Variant

  Variant                        Variable                  Resolved Color
  ─────────────────────────      ─────────────────────     ──────────────
  Selected=False, Enabled        Schemes/On Background     rgba(24,29,26,1)
                                                           #181D1A — dark
  Selected=False, Hovered        Schemes/On Surface Var.   rgba(68,71,75,1)
                                                           #44474B — gray
  Selected=False, Pressed        Schemes/On Surface Var.   rgba(68,71,75,1)
                                                           #44474B — gray
  Selected=True, Enabled         Schemes/On Primary        rgba(255,255,255,1)
                                                           #FFFFFF — white
  Selected=True, Hovered         Schemes/On Primary        rgba(255,255,255,1)
                                                           #FFFFFF — white
  Selected=True, Pressed         Schemes/On Primary        rgba(255,255,255,1)
                                                           #FFFFFF — white

  Summary:
    Unselected → dark text (On Background when resting,
                 On Surface Variant on hover/press)
    Selected → white text (On Primary) on green background


========================================================
## 6. EFFECT STYLES — Full Reference
========================================================

### 6.1 Effects/Shadow/Button Default
  (Style ID: S:c22c1e19d389023f7d57bb3705f341da99557eb2)
  1 layer:
    DROP_SHADOW x:2 y:2 blur:4 spread:0
    rgba(0,0,0,0.10)

  Used on: Selected=True/Enabled, Selected=True/Pressed

  CSS: box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);

### 6.2 Effects/Shadow/Button Hover Black
  (Style ID: S:5279ecc71fc0e80378c001056a396c69b3a67b9a)
  1 layer:
    DROP_SHADOW x:4 y:4 blur:12 spread:0
    rgba(0,0,0,0.20)

  Used on: Selected=False/Hovered, Selected=False/Pressed

  CSS: box-shadow: 4px 4px 12px 0 rgba(0,0,0,0.20);

### 6.3 Effects/Shadow/Button Hover Green
  (Style ID: S:f605439a01c5dbf95fa18a690916bb400fa3bd26)
  1 layer:
    DROP_SHADOW x:4 y:4 blur:12 spread:0
    rgba(11,110,79,0.20) — green tint

  Used on: Selected=True/Hovered

  CSS: box-shadow: 4px 4px 12px 0 rgba(11,110,79,0.20);


========================================================
## 7. STATE TRANSITION SUMMARY
========================================================

             Selected=False                 Selected=True
             ──────────────                 ─────────────
  Enabled    ghost (8% surface fill)        solid green (#056C4D)
             no shadow                      subtle shadow (2/2/4)
             dark text (On Background)      white text (On Primary)
             44px tall                      44px tall

  Hovered    ghost (8% green tint fill)     solid green (#056C4D)
             black shadow (4/4/12)          GREEN shadow (4/4/12)
             gray text (On Surface Var.)    white text (On Primary)
             46.2px tall (+2.2px lift)      46.2px tall (+2.2px lift)

  Pressed    ghost (8% green tint fill)     solid green (#056C4D)
             black shadow (4/4/12)          subtle shadow (2/2/4)
             gray text (On Surface Var.)    white text (On Primary)
             41.8px tall (-2.2px press)     41.8px tall (-2.2px press)

  Key observations:
    • Unselected=ghost, Selected=filled (toggle pattern)
    • Shadow color follows context: black for unselected,
      green for selected hover (brand consistency)
    • Height bounce: +2.2px hover, -2.2px press (physical)
    • Text color darkens on unselected hover/press
      (On Background → On Surface Variant)


========================================================
## 8. DESIGN TOKEN MAPPING
========================================================

  Token                       Figma Variable                         CSS Custom Property
  ─────────────────────       ──────────────────────────────         ──────────────────────────
  Unselected BG (enabled)     State Layers/Surface/Opacity-08       --md-sys-state-surface-opacity-08
  Unselected BG (hover/press) State Layers/On Primary Cont./08      --md-sys-state-on-primary-container-opacity-08
  Selected BG (all)           Schemes/Surface Tint                  --md-sys-color-surface-tint
  Text (unselected, enabled)  Schemes/On Background                 --md-sys-color-on-background
  Text (unselected, hover)    Schemes/On Surface Variant            --md-sys-color-on-surface-variant
  Text (selected, all)        Schemes/On Primary                    --md-sys-color-on-primary
  Shadow (default)            Effects/Shadow/Button Default          (see §6.1)
  Shadow (hover black)        Effects/Shadow/Button Hover Black      (see §6.2)
  Shadow (hover green)        Effects/Shadow/Button Hover Green      (see §6.3)
  Text style                  material-theme/label/medium            font: 500 13px/20px 'Inter'
  Corner radius               48px (hardcoded)                       border-radius: 48px (pill)
  Padding                     12/24 (hardcoded)                      padding: 12px 24px


========================================================
## 9. ACCESSIBILITY
========================================================

  Role: <button> (toggle button)
  ARIA: aria-pressed={selected} for toggle state
  Touch target: 110×44 ✓ (exceeds 44px minimum)
  Keyboard: Enter/Space to toggle selected state

  Contrast — Selected=False (unselected):
    Text #181D1A on near-transparent surface
    → depends on page background, but text is dark enough
    → typically >10:1 on light backgrounds ✓ WCAG AAA

  Contrast — Selected=True (selected):
    White (#FFFFFF) on green (#056C4D)
    → ~5.2:1 ✓ WCAG AA (large text equivalent at 13px bold-ish)
    ⚠️ At 13px, this is "normal text" per WCAG.
    4.5:1 required for AA → 5.2:1 passes AA.
    7:1 required for AAA → does NOT pass AAA.

  Focus state: ⚠️ NOT EXPLICITLY DEFINED
    No focus ring variant exists.
    Recommend adding a focus-visible variant with:
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;

  Screen reader:
    Announce as: "{Label}, toggle button, {pressed/not pressed}"
    Example: "Web Design, toggle button, pressed"


========================================================
## 10. USAGE NOTES
========================================================

  • Currently 0 direct instances found in the file.
    The filter buttons on the portfolio page may be
    built differently (check for manual recreations).

  • Button group layout: when used as a filter bar,
    wrap in a HORIZONTAL auto-layout container with 8-12px gap.

  • "All" button: typically the first in the row,
    starts as Selected=True.

  • Toggle behavior: only one button should be Selected=True
    at a time (radio-group pattern), OR allow multi-select
    for tag filtering.

  • If implementing radio-group:
    role="group" on container
    role="radio" + aria-checked on each button
    (instead of toggle button pattern)


========================================================
## 11. REACT COMPONENT TEMPLATE
========================================================

interface FilterButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  selected = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        styles.filterButton,
        selected && styles.selected,
        className
      )}
    >
      {label}
    </button>
  );
};

// Usage in filter bar:
<div role="radiogroup" aria-label="Filter by category"
     className={styles.filterBar}>
  <FilterButton label="All" selected={activeFilter === 'all'}
    onClick={() => setFilter('all')} />
  <FilterButton label="Web Design" selected={activeFilter === 'web'}
    onClick={() => setFilter('web')} />
  <FilterButton label="App Design" selected={activeFilter === 'app'}
    onClick={() => setFilter('app')} />
</div>

// CSS Module:
.filterBar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filterButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 48px;
  cursor: pointer;
  transition: all 0.15s ease;

  /* Text */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.5px;

  /* Unselected resting state */
  background: var(--md-sys-state-surface-opacity-08,
               rgba(252, 248, 250, 0.08));
  color: var(--md-sys-color-on-background, #181D1A);
  box-shadow: none;
}

.filterButton:hover {
  background: var(--md-sys-state-on-primary-container-opacity-08,
               rgba(152, 237, 198, 0.08));
  color: var(--md-sys-color-on-surface-variant, #44474B);
  box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.20);
  transform: translateY(-1px);
}

.filterButton:active {
  background: var(--md-sys-state-on-primary-container-opacity-08,
               rgba(152, 237, 198, 0.08));
  color: var(--md-sys-color-on-surface-variant, #44474B);
  box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.20);
  transform: translateY(1px);
}

.filterButton:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

/* Selected state */
.selected {
  background: var(--md-sys-color-surface-tint, #056C4D);
  color: var(--md-sys-color-on-primary, #FFFFFF);
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.10);
}

.selected:hover {
  background: var(--md-sys-color-surface-tint, #056C4D);
  color: var(--md-sys-color-on-primary, #FFFFFF);
  box-shadow: 4px 4px 12px 0 rgba(11, 110, 79, 0.20);
  transform: translateY(-1px);
}

.selected:active {
  background: var(--md-sys-color-surface-tint, #056C4D);
  color: var(--md-sys-color-on-primary, #FFFFFF);
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.10);
  transform: translateY(1px);
}