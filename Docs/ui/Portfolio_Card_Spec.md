# Master Component Spec: Portfolio Card
# Date: 2026-08-22
# Component set ID: 87:1429
# Section: Cards

========================================================
## 1. OVERVIEW
========================================================

Component set: Portfolio Card [87:1429]
Section: Cards (on Design System page 6:2)
2 variants: Default + Hover
No explicit variable modes pinned

### 1.1 Variant Properties

  State (VARIANT): Default | Hover
  tag#160:0 (SLOT): tag area — accepts Tag/Badge or text

### 1.2 Variant Matrix

  State=Default  [87:1430]  334×368
  State=Hover    [87:1445]  341×369


========================================================
## 2. CARD FRAME (component root)
========================================================

### 2.1 Common (both states)

  Layout: VERTICAL
  Main axis align: MAX (flex-end — pushes content to bottom)
  Cross axis align: MIN (flex-start)
  Padding: 0 on all sides
  Gap: 0
  Corner radius: 24px (all corners — 3xl token)
  Clips content: true
  Background: Schemes/Surface Container Low
    (VariableID:14:1652)
    Light: rgba(246,243,244,1)
  Sizing: FIXED width and height

### 2.2 State=Default — specific

  Size: 334 × 368 px
  (used at 341×368 on page via instance resize)
  Effect style: Effects/Shadow/Card Default
    Shadow 1: x:10 y:10 blur:8 spread:-2
              rgba(177,211,196,0.30)
    Shadow 2: x:16 y:9 blur:12 spread:-1
              rgba(242,242,242,0.86)
    Shadow 3: x:4 y:4 blur:2 spread:0
              rgba(0,0,0,0.05)

### 2.3 State=Hover — specific

  Size: 341 × 369 px
  Effect style: Effects/Shadow/Card Hover
    Shadow 1: x:12 y:12 blur:10 spread:-2
              rgba(177,211,196,0.30)
    Shadow 2: x:20 y:12 blur:16 spread:-1
              rgba(242,242,242,0.86)
    Shadow 3: x:6 y:6 blur:3 spread:0
              rgba(0,0,0,0.05)

  CSS transition on hover:
    box-shadow: transition 0.2s ease;

### 2.4 Shadow CSS

  Default:
    box-shadow:
      10px 10px 8px -2px rgba(177,211,196,0.30),
      16px 9px 12px -1px rgba(242,242,242,0.86),
      4px 4px 2px 0 rgba(0,0,0,0.05);

  Hover:
    box-shadow:
      12px 12px 10px -2px rgba(177,211,196,0.30),
      20px 12px 16px -1px rgba(242,242,242,0.86),
      6px 6px 3px 0 rgba(0,0,0,0.05);


========================================================
## 3. CHILD 1: Image Container
========================================================

### 3.1 State=Default — Image Container [87:1431]

  Size: 334 × 256 px (stretches to card width)
  Layout: VERTICAL, gap=10
  Clips content: true
  Corner radius: 0 (parent card clips with 24px)
  Fill: IMAGE (FILL mode — covers entire area)

  Inner Container [87:1432] — 334×256
    Padding top: ~139px (pushes overlay to bottom)
    Contains: Hover overlay content (HIDDEN in Default)

  Hidden Overlay [87:1433] — visible: false
    Contains: h6 title + Tag/Badge row
    → In Default state, the image overlay is hidden.
    → Only the image itself is visible.

### 3.2 State=Hover — Image Container [87:1446]

  Size: 341 × 263 px
  Layout: VERTICAL, gap=10
  Clips content: true
  Fill: IMAGE (CROP mode)

  Gradient Overlay [87:1447] — 371×271
    Layout: VERTICAL
    Main axis: MAX (flex-end — content at bottom)
    Cross axis: MIN (flex-start)
    Fill: GRADIENT_LINEAR (bottom-to-top)
      Stop 0.0: rgba(0,0,0,0) — transparent
      Stop 0.5: rgba(11,110,79,0.50) — Primary seed @50%
      Stop 1.0: rgba(11,110,79,0.90) — Primary seed @90%
    Direction: bottom → top (transform [[0,1,0],[-0.5,0,0.75]])

    Content [87:1448] — VERTICAL gap=12, pad=24/0/24/24
      ├── h6 title [87:1450]
      │   "Online Store Interface" (default text)
      │   24px Poppins Medium (title/typography-card-h3)
      │   Line height: 28.8px (120%)
      │   Color: white — Schemes/On Primary
      │
      └── Tag container [87:1451] — HORIZONTAL gap=8
          3× Tag/Badge (Ghost variant)
          Examples: "Shopify", "Product Design", "UI"

  CSS gradient:
    background: linear-gradient(
      to top,
      rgba(11,110,79,0.90) 0%,
      rgba(11,110,79,0.50) 50%,
      transparent 100%
    );


========================================================
## 4. CHILD 2: White Container (text area)
========================================================

### 4.1 State=Default — white container [87:1440]

  Size: 259 × 140 px
  Layout: VERTICAL, gap=8
  Padding: 24/0/24/24 (top 24, right 0, bottom 24, left 24)
  Background: none (transparent)
  No border, no radius (parent card has 24px on bottom corners)

  Children:
    ├── H4 [87:1441] — HORIZONTAL gap=10
    │   └── Title text [87:1442]
    │       "Modern E-commerce Platform" (default)
    │       22px Poppins Medium (title/typography-h4)
    │       Line height: 30px
    │       Letter spacing: -0.22px
    │       Text auto-resize: HEIGHT (wraps within H4 width)
    │       Color: Schemes/On Surface Variant (#44474B)
    │
    └── tag (SLOT) [87:1443] — HORIZONTAL gap=10
        └── Default content: Text node
            "Web Design"
            16px Inter Regular
            Line height: 24px
            Color: Schemes/Primary Container (#0B6E4F)

### 4.2 State=Hover — white container [87:1455]

  Size: 341 × 110 px (wider, shorter)
  Layout: VERTICAL, gap=8.16
  Padding: 24/0/24/24

  Children:
    ├── H4 [87:1456] — HORIZONTAL gap=10
    │   └── Title text [87:1457]
    │       22→20px Poppins Medium (title/typography-card-h4)
    │       Line height: 26px (was 30px)
    │       Letter spacing: 0px (was -0.22px)
    │       Color: Schemes/On Surface Variant (#44474B)
    │
    └── tag (SLOT) [87:1458] — same as Default


========================================================
## 5. HOVER STATE BEHAVIOR — Summary
========================================================

On hover the card transforms:

  Property              Default         Hover
  ──────────────────    ──────────      ──────────
  Card size              334×368         341×369
  Shadow style           Card Default    Card Hover (stronger)
  Image fill mode        FILL            CROP
  Image height           256px           263px
  Gradient overlay       hidden          visible (green gradient)
  Overlay title (h6)     hidden          visible (white, 24px)
  Overlay tags           hidden          visible (Ghost badges)
  Title font size        22px            20px
  Title line-height      30px            26px
  Title letter-spacing   -0.22px         0px
  Title text style       typography-h4   typography-card-h4
  White container width  259px           341px
  White container height 140px           110px

  CSS implementation:
    The card grows slightly on hover (334→341 width, 368→369 height).
    ⚠️ This size change could cause layout shifts in a grid.
    Recommendation: use transform: scale(1.02) instead of
    actual size change, or keep fixed size and adjust inner spacing.

    The gradient overlay slides up from bottom (opacity transition).
    The white container text shrinks slightly.

    &:hover {
      .image-overlay {
        opacity: 1;
        /* or: transform: translateY(0); with transition */
      }
      .title {
        font-size: 20px;
        line-height: 26px;
      }
      box-shadow: /* hover shadow values */;
    }


========================================================
## 6. TAG SLOT
========================================================

Property: tag#160:0 (SLOT type)
Preferred values: Tag/Badge component or text

Default content: Text node "Web Design"
  16px Inter Regular, line-height 24px
  Color: Schemes/Primary Container (#0B6E4F)

In practice, this slot receives either:
  • Plain text (category label like "Web Design", "App Design")
  • Tag/Badge instances (for skills/tools display)

The tag slot appears in BOTH states (Default white container
and Hover white container). Content overrides apply to both.


========================================================
## 7. OVERLAY TAGS (inside image, Hover state)
========================================================

3× Tag/Badge instances (Ghost variant) in horizontal row.
Gap: 8px
These are NOT connected to the tag slot — they are
separate instances inside the image overlay.

Default labels: "Shopify", "Product Design", "UI"
In real usage: should display project tools/technologies.

⚠️ These tags are hardcoded in the master component.
They are NOT exposed as a component property.
Instance overrides must be done per-instance.


========================================================
## 8. DESIGN TOKEN MAPPING
========================================================

  Token                    Figma Variable                    CSS Custom Property
  ──────────────────────   ──────────────────────────────    ──────────────────────────────
  Card BG                  Schemes/Surface Container Low     --md-sys-color-surface-container-low
  Title color              Schemes/On Surface Variant        --md-sys-color-on-surface-variant
  Tag color                Schemes/Primary Container         --md-sys-color-primary-container
  Overlay title color      Schemes/On Primary                --md-sys-color-on-primary
  Gradient start           hardcoded #0B6E4F @50-90%         --md-sys-color-primary (seed)
  Shadow (Default)         Effects/Shadow/Card Default       (see §2.4)
  Shadow (Hover)           Effects/Shadow/Card Hover         (see §2.4)
  Card radius              24px                              --md-sys-shape-corner-extra-large
  Title font (Default)     Poppins Medium 22/30              --title-typography-h4
  Title font (Hover)       Poppins Medium 20/26              --title-typography-card-h4
  Overlay title font       Poppins Medium 24/28.8            --title-typography-card-h3
  Tag font                 Inter Regular 16/24               (body/medium equivalent)


========================================================
## 9. ACCESSIBILITY
========================================================

  Role: <a> (link) — entire card is clickable
  Touch target: 334×368 ✓ (exceeds 44px minimum)
  
  Title contrast:
    #44474B on Surface Container Low → ~9:1 ✓ WCAG AAA
  
  Tag contrast:
    #0B6E4F on Surface Container Low → ~5.5:1 ✓ WCAG AA
  
  Overlay text:
    White on green gradient → depends on image.
    The gradient ensures minimum ~4.5:1 contrast
    at the bottom where text appears.

  Focus state: ⚠️ NOT DEFINED
    Recommend: 2px outline (Schemes/Primary) + outline-offset: 2px
    CSS: &:focus-visible { outline: 2px solid var(--primary); }

  Image alt text: should describe the portfolio project screenshot


========================================================
## 10. USAGE IN FILE (6 instances)
========================================================

  All on "main" page (0:1), inside Portfolio Grid:

  1. "Modern E-commerce Platform" — Web Design
  2. "Mobile Banking App" — App Design
  3. "Mobile App" — App Design
  4. "Mobile App" — App Design
  5. "Modern E-commerce Platform" — Web Design
  6. "Online Store Interface" — Web Design

  All instances use State=Default.
  Hover state triggers on mouse interaction.


========================================================
## 11. REACT COMPONENT TEMPLATE
========================================================

interface PortfolioCardProps {
  title: string;
  tag: string;             // category label
  imageUrl: string;        // project screenshot
  href: string;            // link to case study
  overlayTitle?: string;   // h6 in hover overlay
  overlayTags?: string[];  // ghost badges in overlay
  className?: string;
}

<a href={href} className={cn(styles.card, className)}>
  <div className={styles.imageContainer}>
    <img src={imageUrl} alt={title} className={styles.image} />
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <h3 className={styles.overlayTitle}>{overlayTitle}</h3>
        <div className={styles.overlayTags}>
          {overlayTags?.map(tag => (
            <TagBadge key={tag} label={tag} variant="ghost" />
          ))}
        </div>
      </div>
    </div>
  </div>
  <div className={styles.textArea}>
    <h4 className={styles.title}>{title}</h4>
    <span className={styles.tag}>{tag}</span>
  </div>
</a>

// Key CSS:
.card {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 24px;
  overflow: hidden;
  background: var(--md-sys-color-surface-container-low);
  box-shadow: /* default shadows */;
  transition: box-shadow 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

.imageContainer {
  position: relative;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 256px;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(11,110,79,0.90),
    rgba(11,110,79,0.50) 50%,
    transparent
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlayTitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 28.8px;
  color: var(--md-sys-color-on-primary);
  margin: 0 0 12px;
}

.overlayTags {
  display: flex;
  gap: 8px;
}

.textArea {
  padding: 24px 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: -0.22px;
  color: var(--md-sys-color-on-surface-variant);
  transition: font-size 0.2s ease;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--md-sys-color-primary-container);
}

.card:hover {
  box-shadow: /* hover shadows */;
}

.card:hover .overlay {
  opacity: 1;
}

.card:hover .title {
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0;
}