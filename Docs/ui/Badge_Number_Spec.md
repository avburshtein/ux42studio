# Master Component Spec: Badge / Number
# Date: 2026-08-22
# Component ID: 161:366
# Section: Badges / Indicators

========================================================
## 1. OVERVIEW
========================================================

Component: Badge/Number [161:366]
Type: COMPONENT (single, not a component set)
Section: Badges (on Design System page 6:2)
No variants — single state only.

Purpose: numbered step indicator / process badge.
Displays a two-digit number (01, 02, ...) inside a
circular green-bordered container. Used in process flows
and timeline sections.

### 1.1 Component Properties

  Number#161:15 (TEXT): default "01"

### 1.2 Visual Description

  32×32 circle with dark green (#00543B) 2px border,
  white fill, green number centered inside.
  Clean, minimal step counter.


========================================================
## 2. BADGE FRAME (component root)
========================================================

  Size: 32 × 32 px (FIXED / FIXED)
  Layout: HORIZONTAL
  Main axis align: CENTER
  Cross axis align: CENTER
  Padding: 0 all sides
  Gap: 0
  Corner radius: 9999px (perfect circle)
  Clips content: false
  Opacity: 1

### 2.1 Fill

  Variable: Schemes/Surface
  Resolved: rgba(252, 248, 250, 1) → #FCF8FA
  ≈ off-white with very subtle warm tint

  CSS: background: var(--md-sys-color-surface, #FCF8FA);

### 2.2 Stroke (Border)

  Weight: 2px
  Align: INSIDE
  Variable: Schemes/Primary
  Resolved: rgba(0, 84, 59, 1) → #00543B — dark green

  CSS: border: 2px solid var(--md-sys-color-primary, #00543B);

  ⚠️ Stroke is INSIDE alignment, so the visible area of the
  circle is 32px total (border consumes 2px inward on each side,
  leaving 28px inner diameter). In CSS with box-sizing: border-box,
  this is the default behavior.

### 2.3 Effects

  None. No shadows or blur on this component.


========================================================
## 3. TEXT — "Number" node [161:367]
========================================================

  Content: "01" (default, overridable via Number property)
  Font: Inter Semi Bold (weight 600)
  Size: 11px
  Line height: 16px (fixed, PIXELS)
  Letter spacing: 0.5px
  Text style: material-theme/label/small
  Auto resize: WIDTH_AND_HEIGHT
  Size: 14×16 px (for "01")

### 3.1 Text Color

  Variable: Schemes/Primary
  Resolved: rgba(0, 84, 59, 1) → #00543B — dark green

  Same variable as the border stroke.
  Creates visual unity: border color = text color.

  CSS:
    font: 600 11px/16px 'Inter', sans-serif;
    letter-spacing: 0.5px;
    color: var(--md-sys-color-primary, #00543B);

### 3.2 Text Content Pattern

  Expected values: "01", "02", "03", ... "08" (or more)
  Always two-digit zero-padded format.
  The component does NOT enforce this — any text can be set.
  The small 11px font limits practical content to 2-3 chars.


========================================================
## 4. DESIGN TOKEN MAPPING
========================================================

  Token              Figma Variable         CSS Custom Property
  ───────────────    ─────────────────      ──────────────────────
  Background         Schemes/Surface        --md-sys-color-surface
  Border color       Schemes/Primary        --md-sys-color-primary
  Text color         Schemes/Primary        --md-sys-color-primary
  Border width       2px (hardcoded)        border-width: 2px
  Radius             9999px                 border-radius: 50% (or 9999px)
  Size               32×32 (hardcoded)      width: 32px; height: 32px
  Text style         label/small            font: 600 11px/16px 'Inter'
  Letter spacing     0.5px                  letter-spacing: 0.5px


========================================================
## 5. ACCESSIBILITY
========================================================

  Role: presentational (decorative step number)
  The number itself is typically redundant with nearby
  heading text ("Step 1: Research & Insight").

  If used standalone as a meaningful indicator:
    aria-label="Step {number}"

  Contrast:
    Text #00543B on #FCF8FA surface
    → ~7.8:1 ✓ WCAG AAA (even at 11px small text)

  Border contrast:
    #00543B on page background
    → ~7.8:1 ✓ WCAG AAA

  Size: 32×32 is below 44px touch target.
    ✓ OK if not interactive (decorative indicator)
    ⚠️ If clickable (step navigation), needs larger tap area:
    min-width: 44px; min-height: 44px;
    (or use padding/margin to extend hit area)


========================================================
## 6. USAGE IN FILE (16 instances)
========================================================

  Main page (0:1) — 4 instances:
    "01" in "Research & Insight"
    "02" in "Wireframe & Structure"
    "03" in "Prototype & Test"
    "04" in "Handoff & Support"
    → Used in the process/workflow section

  Case Template page (51:6) — 8 instances:
    "01" through "08"
    Inside "Left Content" containers
    → Used as step/section numbering in case studies

  Design System page (6:2) — 4 instances:
    All showing "01" (showcase/reference examples)

  Pattern: always paired with a heading and description
  in a horizontal row [Badge] + [Text block].


========================================================
## 7. INTERACTION STATES
========================================================

  ⚠️ NO INTERACTION STATES DEFINED.
  
  The component has no Hovered, Focused, or Disabled variants.
  This is appropriate if the badge is purely decorative.
  
  If step navigation is needed in the future, consider adding:
    State=Active  → filled green background, white text
    State=Current → larger shadow or glow ring
    State=Disabled → opacity 0.38


========================================================
## 8. REACT COMPONENT TEMPLATE
========================================================

interface BadgeNumberProps {
  number: number | string;
  className?: string;
}

const BadgeNumber: React.FC<BadgeNumberProps> = ({
  number,
  className,
}) => {
  const formatted = typeof number === 'number'
    ? String(number).padStart(2, '0')
    : number;

  return (
    <div
      className={cn(styles.badge, className)}
      aria-hidden="true"
    >
      <span className={styles.number}>{formatted}</span>
    </div>
  );
};

// CSS Module:
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--md-sys-color-surface, #FCF8FA);
  border: 2px solid var(--md-sys-color-primary, #00543B);
  box-sizing: border-box;
  flex-shrink: 0;
}

.number {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.5px;
  color: var(--md-sys-color-primary, #00543B);
  text-align: center;
}

// Usage in process section:
<div className={styles.processStep}>
  <BadgeNumber number={1} />
  <div className={styles.stepContent}>
    <h3>Research & Insight</h3>
    <p>Deep dive into user needs...</p>
  </div>
</div>