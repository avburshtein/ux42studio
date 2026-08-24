# Master Component Spec: Button / Secondary
# Date: 2026-08-22
# Component set ID: 32:58
# Section: Buttons

========================================================
## 1. OVERVIEW
========================================================

Component set: Button / Secondary [32:58]
Section: Buttons (on Design System page 6:2)
20 variants: 5 States × 2 Sizes × 3 Icon options
(Medium size only available with Icon=False → 15 + 5 = 20)

Role: secondary action button — outlined/ghost style
complementing the primary filled buttons. Used for
"View Case Study", "Learn More", form submit secondary, etc.

### 1.1 Component Properties

  State (VARIANT): Enabled | Hovered | Pressed | Focused | Disabled
  Size  (VARIANT): Large | Medium
  Icon  (VARIANT): False | Right | Left
  Label#32:18 (TEXT): default "Button Label"

### 1.2 Variant Matrix (IDs)

  State      Size    Icon    ID           Size
  ─────      ────    ────    ──────       ────
  Enabled    Large   False   [32:40]      173×56
  Hovered    Large   False   [32:42]      173×56
  Pressed    Large   False   [32:44]      173×56
  Focused    Large   False   [595:2984]   173×56
  Disabled   Large   False   [595:2986]   173×56
  Enabled    Large   Right   [32:46]      173×56
  Hovered    Large   Right   [32:48]      173×56
  Pressed    Large   Right   [32:50]      173×56
  Focused    Large   Right   [595:2988]   173×56
  Disabled   Large   Right   [595:2992]   173×56
  Enabled    Large   Left    [254:1466]   173×56
  Hovered    Large   Left    [254:1470]   173×56
  Pressed    Large   Left    [254:1474]   173×56
  Focused    Large   Left    [595:3000]   173×56
  Disabled   Large   Left    [595:3004]   173×56
  Enabled    Medium  False   [32:52]      173×48
  Hovered    Medium  False   [32:54]      173×48
  Pressed    Medium  False   [32:56]      173×48
  Focused    Medium  False   [595:2996]   173×48
  Disabled   Medium  False   [595:2998]   173×48


========================================================
## 2. BUTTON FRAME — Layout
========================================================

### 2.1 Common (all variants)

  Layout: HORIZONTAL
  Main axis align: CENTER
  Cross axis align: CENTER
  Corner radius: 48px all corners (full-pill)
  Clips content: false
  Width: 173px (FIXED) — resizable per instance
  Strokes: none on any variant

  Children order:
    Icon=False → [ Label ]
    Icon=Right → [ Label, gap=8, arrow-right ]
    Icon=Left  → [ arrow-left, gap=8, Label ]

### 2.2 Size=Large

  Height: 56px (FIXED)
  Padding: 16px top / 32px right / 16px bottom / 32px left
  Gap: 8px (between text and icon when Icon≠False)

### 2.3 Size=Medium

  Height: 48px (FIXED)
  Padding: 12px top / 24px right / 12px bottom / 24px left
  Gap: 0 (no icon variants for Medium)

  ⚠️ Medium size only exists with Icon=False.
  If Medium + Icon is needed, add it as a new variant.


========================================================
## 3. FILL & STROKE — All States
========================================================

### 3.1 Fill (same across ALL 20 variants)

  Variable: Schemes/Surface Container Lowest
  Resolved: rgba(255, 255, 255, 1) → #FFFFFF — pure white

  CSS: background: var(--md-sys-color-surface-container-lowest, #FFFFFF);

### 3.2 Stroke (same across ALL 20 variants)

  Weight: 1px
  Align: INSIDE
  Variable: Schemes/Primary Container
  Resolved: rgba(11, 110, 79, 1) → #0B6E4F — dark green

  CSS: border: 1px solid var(--md-sys-color-primary-container, #0B6E4F);

  ⚠️ The border is Schemes/Primary Container, same as the
  Surface Tint fill in the Primary button. This creates visual
  kinship between Primary (filled green) and Secondary (outlined green).


========================================================
## 4. EFFECTS BY STATE
========================================================

### 4.1 State=Enabled

  Effect style: Effects/Shadow/Button Default
    DROP_SHADOW: x:2 y:2 blur:4 spread:0
                 rgba(0, 0, 0, 0.10)
  Opacity: 1.0

  CSS:
    box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);
    opacity: 1;

### 4.2 State=Hovered

  Effect style: Effects/Shadow/Button Hover Black
    DROP_SHADOW: x:4 y:4 blur:12 spread:0
                 rgba(0, 0, 0, 0.20)
  Opacity: 0.90

  Visual: shadow grows, button becomes slightly transparent.
  The opacity dip creates a subtle "ethereal" hover feel.

  CSS:
    box-shadow: 4px 4px 12px 0 rgba(0,0,0,0.20);
    opacity: 0.90;
    transition: box-shadow 0.15s ease, opacity 0.15s ease;

### 4.3 State=Pressed

  Effect style: Effects/Shadow/Button Default
    DROP_SHADOW: x:2 y:2 blur:4 spread:0
                 rgba(0, 0, 0, 0.10)
    (returns to default shadow)
  Opacity: 0.85

  Visual: shadow shrinks back, opacity drops further.

  CSS:
    box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);
    opacity: 0.85;

### 4.4 State=Focused

  2 effect layers (NO named style):
    Layer 1 — Focus ring:
      DROP_SHADOW x:0 y:0 blur:0 spread:3
      rgba(11, 110, 79, 1) → #0B6E4F (Primary Container)
    Layer 2 — Default shadow:
      DROP_SHADOW x:2 y:2 blur:4 spread:0
      rgba(0, 0, 0, 0.10)
  Opacity: 1.0

  Visual: 3px solid green ring around the button (via spread shadow)
  plus the standard default shadow underneath.

  CSS:
    box-shadow:
      0 0 0 3px rgba(11,110,79,1),
      2px 2px 4px 0 rgba(0,0,0,0.10);
    opacity: 1;

  Alternative CSS (cleaner):
    outline: 3px solid var(--md-sys-color-primary-container, #0B6E4F);
    outline-offset: 0;
    box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);

### 4.5 State=Disabled

  Effect style: Effects/Shadow/Button Default
    DROP_SHADOW: x:2 y:2 blur:4 spread:0
                 rgba(0, 0, 0, 0.10)
  Opacity: 0.38

  Visual: same shadow as Enabled, but heavily faded (38% opacity).
  0.38 is the standard Material Design 3 disabled opacity.

  CSS:
    box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);
    opacity: 0.38;
    pointer-events: none;
    cursor: default;


========================================================
## 5. OPACITY TRANSITION TABLE
========================================================

  State       Opacity   Shadow Style              Effect
  ─────────   ───────   ─────────────────────     ──────
  Enabled     1.00      Button Default (2/2/4)    baseline
  Hovered     0.90      Button Hover Black(4/4/12) shadow grows, fades
  Pressed     0.85      Button Default (2/2/4)    shadow shrinks, fades more
  Focused     1.00      Focus ring + Default      green ring appears
  Disabled    0.38      Button Default (2/2/4)    heavily faded (MD3 standard)

  CSS transition:
    transition: box-shadow 0.15s ease, opacity 0.15s ease;


========================================================
## 6. TEXT — "Label" node
========================================================

### 6.1 Text Properties (identical across all 20 variants)

  Content: "Button Label" (default, overridable via Label prop)
  Font: Inter Medium (weight 500)
  Size: 16px
  Line height: 24px (fixed, PIXELS)
  Letter spacing: 0% (0px)
  Text style: material-theme/button/default
  Auto resize: WIDTH_AND_HEIGHT
  Alignment: centered via parent auto-layout

### 6.2 Text Color (identical across all 20 variants)

  Variable: Schemes/On Background
  Resolved: rgba(24, 29, 26, 1) → #181D1A — near-black

  CSS:
    font: 500 16px/24px 'Inter', sans-serif;
    letter-spacing: 0;
    color: var(--md-sys-color-on-background, #181D1A);

  ⚠️ Text color does NOT change between states.
  Hover/pressed differentiation is handled by opacity only.
  Disabled state uses full component opacity: 0.38.


========================================================
## 7. ICON
========================================================

### 7.1 Icon Properties

  Components: arrow-right [44:175], arrow-left [44:167]
  Source: lucide icons library (local)
  Size: 24×24 px
  Gap from text: 8px

  Visual: stroke-based vector (no fill)
  Stroke color: Schemes/On Surface
    Resolved: rgba(27, 27, 29, 1) — near-black
  Stroke weight: 2px (default lucide)

  CSS:
    width: 24px;
    height: 24px;
    color: var(--md-sys-color-on-surface);
    /* if using SVG with currentColor */

### 7.2 Icon Positioning

  Icon=Right:
    [Label] → 8px gap → [arrow-right →]
    Padding stays 16/32/16/32 (icon fits within)
    Label shifts left: x=22 (vs x=38 without icon)
    Icon at x=127

  Icon=Left:
    [← arrow-left] → 8px gap → [Label]
    Icon at x=22, Label at x=54

### 7.3 Icon in CSS

  .button-icon {
    display: inline-flex;
    align-items: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  /* Icon inherits button opacity for state transitions */


========================================================
## 8. DESIGN TOKEN MAPPING
========================================================

  Token                  Figma Variable                    CSS Custom Property
  ─────────────────      ──────────────────────────        ──────────────────────────
  Background fill        Schemes/Surface Container Lowest  --md-sys-color-surface-container-lowest
  Border                 Schemes/Primary Container         --md-sys-color-primary-container
  Text color             Schemes/On Background             --md-sys-color-on-background
  Icon stroke            Schemes/On Surface                --md-sys-color-on-surface
  Focus ring             hardcoded #0B6E4F                 --md-sys-color-primary-container
  Shadow (default)       Effects/Shadow/Button Default     (see §4.1)
  Shadow (hover)         Effects/Shadow/Button Hover Black (see §4.2)
  Text style             material-theme/button/default     font: 500 16px/24px 'Inter'
  Radius                 48px (hardcoded)                  border-radius: 48px
  Padding (Large)        16/32 (hardcoded)                 padding: 16px 32px
  Padding (Medium)       12/24 (hardcoded)                 padding: 12px 24px
  Icon gap               8px                               gap: 8px
  Disabled opacity       0.38 (MD3 standard)               opacity: 0.38


========================================================
## 9. ACCESSIBILITY
========================================================

  Role: <button> or <a> (depending on action)
  Touch target: Large 173×56 ✓, Medium 173×48 ✓ (>44px)

  Contrast:
    Text #181D1A on white (#FFFFFF) background
    → ~17.4:1 ✓ WCAG AAA

  Border contrast:
    #0B6E4F on white → ~5.5:1 ✓ WCAG AA for non-text

  Focus state: ✓ DEFINED
    3px solid green ring (#0B6E4F) via spread shadow
    Contrast: green on white → ~5.5:1 ✓

  Disabled state:
    opacity 0.38 signals non-interactive
    Must also set aria-disabled="true"
    pointer-events: none

  Icon accessibility:
    If decorative: aria-hidden="true" on icon
    If meaningful: include visually hidden label text


========================================================
## 10. USAGE IN FILE
========================================================

  2 instances found:
    1. Portfolio Case page [4:263] — "View Case Study"
       State=Enabled, Size=Large, Icon=Right
       ID: 295:821

    2. Dialogs page [51:2023]
       State=Enabled, Size=Medium, Icon=False
       ID: 245:1009


========================================================
## 11. REACT COMPONENT TEMPLATE
========================================================

type IconPosition = 'none' | 'left' | 'right';
type ButtonSize = 'large' | 'medium';

interface SecondaryButtonProps {
  label: string;
  icon?: IconPosition;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  icon = 'none',
  size = 'large',
  disabled = false,
  onClick,
  href,
  className,
}) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={!href ? disabled : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        styles.secondary,
        styles[size],
        disabled && styles.disabled,
        className
      )}
    >
      {icon === 'left' && <ArrowLeft className={styles.icon} />}
      <span>{label}</span>
      {icon === 'right' && <ArrowRight className={styles.icon} />}
    </Component>
  );
};

// CSS Module:
.secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 48px;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.15s ease, opacity 0.15s ease;

  /* Fill & stroke */
  background: var(--md-sys-color-surface-container-lowest, #FFF);
  border: 1px solid var(--md-sys-color-primary-container, #0B6E4F);

  /* Text */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--md-sys-color-on-background, #181D1A);

  /* Default shadow */
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);
  opacity: 1;
}

/* Sizes */
.large { padding: 16px 32px; height: 56px; }
.medium { padding: 12px 24px; height: 48px; }

/* States */
.secondary:hover:not(.disabled) {
  box-shadow: 4px 4px 12px 0 rgba(0,0,0,0.20);
  opacity: 0.90;
}

.secondary:active:not(.disabled) {
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.10);
  opacity: 0.85;
}

.secondary:focus-visible {
  box-shadow:
    0 0 0 3px var(--md-sys-color-primary-container, #0B6E4F),
    2px 2px 4px 0 rgba(0,0,0,0.10);
  opacity: 1;
  outline: none;
}

.disabled {
  opacity: 0.38;
  pointer-events: none;
  cursor: default;
}

.icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--md-sys-color-on-surface);
}