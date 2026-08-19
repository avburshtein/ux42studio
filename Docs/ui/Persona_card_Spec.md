# Master Component Specs — Header, Card/Metric, Persona Card
# Date: 2026-08-19
# File: U5OjywCHbtzQgBsi7PU25r

========================================================
## 1. HEADER
========================================================

Component set ID: 245:1632
Section: Navigation
Variant property: Property 1 → Default | Breadcrumb
Instance swap property: logo#245:2 → default component 87:1949 (logo / Variant=Default)

### 1.1 Root frame (both variants identical)

- Width: 1200px (FIXED)
- Height: HUG (auto)
- Layout: HORIZONTAL (flex-row)
- Gap: 0
- Padding: 16px 64px (top/bottom 16, left/right 64)
- Main axis: SPACE_BETWEEN (justify-content: space-between)
- Cross axis: CENTER (align-items: center)
- Clips content: false

Three zones: left (navigation), center (logo), right (theme toggle + CTA).

### 1.2 Background Fill

Paint Style: "hero block gradient" (StyleID: S:c7142e1202a796fdd999961b61e30d4e8f59e1c3)
Content: Linear Gradient with two stops:
  Stop 0 (pos 0%): Schemes/Background (VariableID:14:1624) — Light #F7FAF5 — opacity 1.0
  Stop 1 (pos 100%): State Layers/Background/Opacity-08 (VariableID:14:1786) — Light #F7FAF5 — opacity 0.08
  Direction: gradientTransform [[0.5,0.5,0],[-0.25,0.25,0.5]] ≈ 315deg (left-center → top-right)

CSS equivalent:
  background: linear-gradient(315deg, var(--md-sys-color-background) 0%, color-mix(in srgb, var(--md-sys-color-background) 8%, transparent) 100%);

Note: The gradient makes the background semi-transparent for backdrop-filter (glass effect).

### 1.3 Effects

Effect Style: "Effects/Blur/Glass Heavy" (StyleID: S:fc595e524c1d02bc50b1b4b3432ac804849856cf)

Effect 1 — Glass (Backdrop Blur):
  Type: GLASS
  Blur radius: 40px
  Refraction: 0.8, Depth: 20, Light angle: -45°, Light intensity: 0.8, Dispersion: 0.5
  CSS: backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);

Effect 2 — Drop Shadow:
  Color: rgba(0, 0, 0, 0.10)
  Offset: 8px 8px, Blur: 20px, Spread: 0px
  CSS: box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.10);

### 1.4 Variant: Default — Left zone

Frame "Frame 52" → HORIZONTAL, gap: 24px, align: CENTER
  └ Frame "Nav links" → HORIZONTAL, gap: 24px, HUG/HUG
      └ Nav Link instances (component set: "Nav Link" 96:299)
          States: Default, Hovered, Active
          Layout: HORIZONTAL, padding: 10px 0px, clipping: true
          Text "Work": Inter Regular 16/24
          Text "About": Inter Regular 16/24
          Text fill: Schemes/On Surface Variant (VariableID:14:1629) — Light #44474B / Dark #C5C6CC
          CSS: color: var(--md-sys-color-on-surface-variant);

### 1.5 Variant: Default — Center (Logo)

Instance swap prop: logo#245:2
Component set: "logo" (87:1948), variants: Default, Alternate
Default variant size: 89×64px, padding: 10px all sides, HUG/HUG

### 1.6 Variant: Default — Right zone

Frame "Frame 51" → HORIZONTAL, gap: 24px, primary: MAX (flex-end), counter: CENTER

Element 1 — Theme Switcher:
  Switcher / Toggle instance (component set 87:1745)
  Variant: Type=Mode Button, Value=Light
  Size: 48×48px, padding: 4px 12px
  Border: 1px INSIDE, color: Schemes/Surface Container Highest (VariableID:14:1655) — Light #E4E2E3
  Corner radius: 48px (full circle)
  Icon: sun, 24×24px
  CSS: border: 1px solid var(--md-sys-color-surface-container-highest); border-radius: 48px;

Element 2 — CTA Button:
  Button / Ghost instance (component set 34:24)
  Variant: State=Enabled, Size=Large, Arrow=False
  Text: "Hire me" (property Label#34:0)
  Font: Inter Medium 16/24 (text style: material-theme/button/default)
  Text fill: Schemes/Surface Tint (VariableID:14:1608) — Light #056C4D / Dark #83D7B1
  Padding: 12px 16px, corner radius: 8px
  CSS: font: 500 16px/24px 'Inter'; color: var(--md-sys-color-surface-tint);

### 1.7 Variant: Breadcrumb — Left zone

Frame "Frame 52" → HORIZONTAL, gap: 24px, HUG/HUG, counter: CENTER

Element 1 — Back Button:
  Button / Ghost instance, variant: State=Enabled, Size=Large, Arrow=Left
  Label: "Back", arrow-left icon (component 44:167, 24×24)
  Gap icon↔label: 8px, padding: 12px 16px, corner radius: 8px
  Font: Inter Medium 16/24
  Text fill: Schemes/On Surface Variant (VariableID:14:1629) — Light #44474B
  CSS: color: var(--md-sys-color-on-surface-variant);

Element 2 — Breadcrumb Navigation:
  Component: "Breadcrumb Navigation" (161:392)
  Layout: HORIZONTAL, gap: 8px, HUG/HUG
  All text: Inter Regular 16/24 (text style: material-theme/body/medium)

  Link texts ("Portfolio", "Cases"):
    Fill: Schemes/Primary (VariableID:14:1607) — Light #00543B / Dark #83D7B1
    CSS: color: var(--md-sys-color-primary);

  Separator "/" texts:
    Fill: Schemes/Outline (VariableID:14:1630) — Light #75777C / Dark #8F9196
    CSS: color: var(--md-sys-color-outline);

  Current text ("New Case"):
    Fill: Schemes/On Surface (VariableID:14:1627) — Light #1B1B1D / Dark #E4E2E3
    CSS: color: var(--md-sys-color-on-surface);

### 1.8 Breadcrumb center & right

Identical to Default variant (logo + toggle + CTA).

### 1.9 Styles → Tokens summary

  Fill style "hero block gradient" → linear-gradient(315deg, var(--md-sys-color-background)...)
  Effect style "Effects/Blur/Glass Heavy" → backdrop-filter: blur(40px) + box-shadow
  Text style "material-theme/button/default" → font: 500 16px/24px 'Inter'
  Text style "material-theme/body/medium" → font: 400 16px/24px 'Inter'
  Variable Schemes/On Surface Variant → var(--md-sys-color-on-surface-variant)
  Variable Schemes/Surface Tint → var(--md-sys-color-surface-tint)
  Variable Schemes/Primary → var(--md-sys-color-primary)
  Variable Schemes/Outline → var(--md-sys-color-outline)
  Variable Schemes/On Surface → var(--md-sys-color-on-surface)
  Variable Schemes/Surface Container Highest → var(--md-sys-color-surface-container-highest)

### 1.10 Child components (dependencies)

  Nav Link (96:299) — States: Default, Hovered, Active
  logo (87:1948) — Variant: Default, Alternate
  Switcher / Toggle (87:1745) — Type × Value multi-variant
  Button / Ghost (34:24) — State × Size × Arrow multi-variant
  Breadcrumb Navigation (161:392) — single component
  arrow-left icon (44:167) — used inside Button/Ghost Arrow=Left


========================================================
## 2. CARD/METRIC
========================================================

Component set ID: 169:405
Section: Cards
Variant property: State → Default (single variant)

### 2.1 Component Properties

  Value#169:35 (TEXT) default="85%" → "Metric Value" node characters
  Description#169:36 (TEXT) default="Task completion rate" → "Description" node characters
  State (VARIANT) default="Default"

### 2.2 Variant: State=Default

ID: 161:368 | Size: 280×126px (HUG height)

Layout:
  Direction: VERTICAL (flex-column)
  Gap: 8px — Variable: spacing/8 (VariableID:154:7)
  Padding: 20px all sides — Variable: spacing/20 (VariableID:154:12)
  Main axis: MIN, Cross axis sizing: FIXED
  SizingH: FIXED, SizingV: HUG

Background fill:
  Variable: Schemes/Surface Container Lowest (VariableID:14:1651)
  Light: #FFFFFF / Dark: #0E0E0F
  CSS: background-color: var(--md-sys-color-surface-container-lowest);

Corner radius:
  12px — Variable: radius/base (VariableID:154:30)
  CSS: border-radius: var(--radius-base, 12px);

Effects:
  Effect Style: "Effects/Shadow/Portfolio Card Default"
  DROP_SHADOW: rgba(0,0,0,0.06), offset 0/2, blur 12, spread 0
  CSS: box-shadow: var(--shadow-card, 0px 2px 12px 0px rgba(0, 0, 0, 0.06));

Stroke: none

### 2.3 Text: Metric Value

  Node: 161:369
  Component property: Value#169:35 → characters
  SizingH: FILL (stretch), SizingV: HUG, TextAutoResize: HEIGHT
  Text Style: material-theme/headline/large (Poppins Medium 48/56, ls: 0)
  Text fill: Schemes/Primary (VariableID:14:1607) — Light #00543B / Dark #83D7B1
  CSS: font: 500 48px/56px 'Poppins'; color: var(--md-sys-color-primary);

  Note: headline/large (48/56) is not registered in globals.css @theme.
  Recommend adding: --text-headline-lg: 48px; --text-headline-lg--line-height: 56px;

### 2.4 Text: Description

  Node: 161:370
  Component property: Description#169:36 → characters
  SizingH: FILL (stretch), SizingV: HUG, TextAutoResize: HEIGHT
  Text Style: material-theme/body/small (Inter Regular 14/22, ls: 0.4px)
  Text fill: Schemes/On Surface Variant (VariableID:14:1629) — Light #44474B / Dark #C5C6CC
  CSS: font: 400 14px/22px 'Inter'; letter-spacing: 0.4px; color: var(--md-sys-color-on-surface-variant);

  Note: letter-spacing 0.4px not registered in @theme. Recommend: --text-body-sm--letter-spacing: 0.4px;

### 2.5 Variable Collections

  material-theme (14:1606) — fills + text colors (6 modes)
  spacing (154:2) — gap 8px, padding 20px (1 mode)
  radius (154:25) — border-radius 12px (1 mode)

### 2.6 CSS component

  .card-metric {
    display: flex; flex-direction: column;
    gap: 8px; padding: 20px;
    background-color: var(--md-sys-color-surface-container-lowest);
    border-radius: var(--radius-base, 12px);
    box-shadow: var(--shadow-card);
  }
  .card-metric__value {
    font: 500 48px/56px 'Poppins', sans-serif;
    color: var(--md-sys-color-primary);
  }
  .card-metric__description {
    font: 400 14px/22px 'Inter', sans-serif;
    letter-spacing: 0.4px;
    color: var(--md-sys-color-on-surface-variant);
  }

### 2.7 Dependencies

  None — self-contained (2 text nodes only).


========================================================
## 3. PERSONA CARD
========================================================

Component ID: 176:372 (standalone COMPONENT, not a component set)
Section: Cards
No variants.

### 3.1 Component Properties

  Name#176:4 (TEXT) default="Full Name" → "Name" node [176:375]
  Role#176:5 (TEXT) default="Job Title / Role" → "Role" node [176:376]
  Description#176:6 (TEXT) default="Brief description of the persona, their goals, pain points and context." → quote text [195:1190]

### 3.2 Root frame

  Layout: VERTICAL, gap: 20px
  Padding: 32px all — Variable: spacing/32 (VariableID:154:15)
  Sizing: HUG / HUG
  Fill: Schemes/Surface Container Lowest (VariableID:14:1651) — Light #FFFFFF / Dark #0E0E0F
  Corner radius: 14px — Variable: radius/lg (VariableID:154:31)
  Effects: Effect Style "Effects/Shadow/Portfolio Card Default" — same as Card/Metric
  Stroke: none
  CSS: background-color: var(--md-sys-color-surface-container-lowest); border-radius: var(--radius-lg, 14px); box-shadow: var(--shadow-card);

### 3.3 Section 1 — Label "USER PERSONA"

Frame "Paragraph" [195:1185] → VERTICAL, SizingH: FIXED, SizingV: HUG

Text "User persona" [195:1186]:
  Text Style: material-theme/label/small (Inter Semi Bold 11/16, ls: 0.5px)
  Text case: UPPER (displays "USER PERSONA")
  Text fill: Schemes/Primary Container (VariableID:14:1610) — Light #0B6E4F / Dark #0B6E4F
  Static text — no component property, always "User persona".
  CSS: font: 600 11px/16px 'Inter'; letter-spacing: 0.5px; text-transform: uppercase; color: var(--md-sys-color-primary-container);

### 3.4 Section 2 — Avatar + Info row

Frame "Frame 53" [195:1204] → HORIZONTAL, gap: 20px, SizingH: FILL, SizingV: HUG

Avatar [176:373]:
  Size: 64×64px (FIXED)
  Corner radius: 32px (full circle)
  Clips content: true
  Fill: Schemes/Surface Container High (VariableID:14:1654) — Light #EAE7E8 / Dark #2A2A2B
  Empty circle placeholder for user image.
  CSS: width: 64px; height: 64px; border-radius: 50%; background-color: var(--md-sys-color-surface-container-high); overflow: hidden;

Info [176:374]:
  Layout: VERTICAL, gap: 8px — Variable: spacing/8 (VariableID:154:7)
  SizingH: FILL, LayoutGrow: 1, clips: true

  Name [176:375]:
    Property: Name#176:4 → characters
    Text Style: material-theme/title/large (Poppins Medium 20/28, ls: 0)
    Fill: Schemes/On Surface (VariableID:14:1627) — Light #1B1B1D / Dark #E4E2E3
    CSS: font: 500 20px/28px 'Poppins'; color: var(--md-sys-color-on-surface);

  Role [176:376]:
    Property: Role#176:5 → characters
    Text Style: material-theme/body/medium (Inter Regular 16/24, ls: 0.25px)
    Fill: Schemes/On Surface Variant (VariableID:14:1629) — Light #44474B / Dark #C5C6CC
    CSS: font: 400 16px/24px 'Inter'; letter-spacing: 0.25px; color: var(--md-sys-color-on-surface-variant);

### 3.5 Section 3 — Quote

Container:margin [195:1187]:
  VERTICAL, paddingTop: 20px — Variable: spacing/20 (VariableID:154:12)
  Creates extra top spacing. Total gap from avatar row = root gap 20px + paddingTop 20px = 40px.

Container [195:1188]:
  VERTICAL, paddingLeft: 16px
  Left border (quote bar):
    Stroke: left-only 2px
    Color: Schemes/Primary Container (VariableID:14:1610) @ 30% opacity
    CSS: border-left: 2px solid color-mix(in srgb, var(--md-sys-color-primary-container) 30%, transparent);

Paragraph [195:1189]:
  Wrapper frame, no visual properties.

Quote text [195:1190]:
  Property: Description#176:6 → characters
  Text Style: material-theme/body/medium (Inter Regular 16/24, ls: 0.25px)
  Fill: Schemes/On Surface Variant (VariableID:14:1629) — Light #44474B / Dark #C5C6CC
  SizingH: FILL, TextAutoResize: HEIGHT
  CSS: font: 400 16px/24px 'Inter'; letter-spacing: 0.25px; color: var(--md-sys-color-on-surface-variant);

### 3.6 Styles → Tokens summary

  Fill: Schemes/Surface Container Lowest → var(--md-sys-color-surface-container-lowest)
  Shadow: Effects/Shadow/Portfolio Card Default → var(--shadow-card)
  Radius: radius/lg → var(--radius-lg, 14px)
  Padding: spacing/32 → 32px
  Label fill: Schemes/Primary Container → var(--md-sys-color-primary-container)
  Label text: material-theme/label/small → font: 600 11px/16px 'Inter' + uppercase
  Avatar fill: Schemes/Surface Container High → var(--md-sys-color-surface-container-high)
  Name text: material-theme/title/large → font: 500 20px/28px 'Poppins'
  Name fill: Schemes/On Surface → var(--md-sys-color-on-surface)
  Role text: material-theme/body/medium → font: 400 16px/24px 'Inter'
  Role fill: Schemes/On Surface Variant → var(--md-sys-color-on-surface-variant)
  Quote bar: Schemes/Primary Container @ 30% → border-left with color-mix
  Quote fill: Schemes/On Surface Variant → var(--md-sys-color-on-surface-variant)

### 3.7 Variable Collections

  material-theme (14:1606) — color fills (6 modes)
  spacing (154:2) — padding 32px, gap 8px, margin 20px (1 mode)
  radius (154:25) — border-radius 14px (1 mode)

### 3.8 CSS component

  .persona-card {
    display: flex; flex-direction: column; gap: 20px; padding: 32px;
    background-color: var(--md-sys-color-surface-container-lowest);
    border-radius: var(--radius-lg, 14px);
    box-shadow: var(--shadow-card);
  }
  .persona-card__label {
    font: 600 11px/16px 'Inter', sans-serif;
    letter-spacing: 0.5px; text-transform: uppercase;
    color: var(--md-sys-color-primary-container);
  }
  .persona-card__profile { display: flex; gap: 20px; align-items: flex-start; }
  .persona-card__avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background-color: var(--md-sys-color-surface-container-high);
    overflow: hidden; flex-shrink: 0;
  }
  .persona-card__info { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; overflow: hidden; }
  .persona-card__name { font: 500 20px/28px 'Poppins', sans-serif; color: var(--md-sys-color-on-surface); }
  .persona-card__role { font: 400 16px/24px 'Inter', sans-serif; letter-spacing: 0.25px; color: var(--md-sys-color-on-surface-variant); }
  .persona-card__quote-wrapper { margin-top: 20px; }
  .persona-card__quote { padding-left: 16px; border-left: 2px solid color-mix(in srgb, var(--md-sys-color-primary-container) 30%, transparent); }
  .persona-card__quote-text { font: 400 16px/24px 'Inter', sans-serif; letter-spacing: 0.25px; color: var(--md-sys-color-on-surface-variant); }

### 3.9 Dependencies

  None — self-contained (4 text nodes + 1 avatar placeholder frame).