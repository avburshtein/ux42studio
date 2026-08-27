# Main Page — Final Specification
Updated: 2026-08-22
Figma File: U5OjywCHbtzQgBsi7PU25r
Page ID: 0:1

══════════════════════════════════════════════════════════

## 1. General Parameters

Root Frame:          Main Page (ID: 124:575)
Dimensions:          1200 × 5415 px
Layout:              No Auto Layout (children positioned manually)
Content width:       1200 px (Page Desktop instance fills root)

Page Instance:       Page Desktop (ID: 124:576) — Instance of Layout component
Layout:              Vertical Auto Layout, gap = 32
Slot System:         Header → Slot for section → Footer

Design System:       Material Design 3 (Material You)
Variable Collection: material-theme (6 modes: Light, Light HC, Light MC, Dark, Dark HC, Dark MC)
4px Grid:            0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 120, 160
Radius Scale:        0(none), 4(xs), 8(sm), 10(md), 12(base), 14(lg), 16(xl), 20(2xl), 24(3xl), 28(4xl), 48(5xl), 9999(full)

Typography:
  • Headings: Poppins Medium
  • Body/Labels: Inter Regular / Medium / Semi Bold
  • All text styles prefixed material-theme/
  • Text with styles: 82/82 (100%)

Variable Bindings:   252/297 nodes (85%)
Component Instances: 69

Accessibility:
  • WCAG 2.2 AA compliant
  • EAA 2025 compliant
  • All interactive elements ≥ 44 × 44 px touch target
  • All semantic color pairs pass AA contrast (min 4.5:1)

══════════════════════════════════════════════════════════

## 2. Top-Level Structure

Main Page [124:575] FRAME 1200×5415 NO-LAYOUT
└── Page Desktop [124:576] INSTANCE VERTICAL gap=32
    ├── Header [I124:576;87:3878] — 1200×96
    ├── Slot for section [I124:576;87:3879] — VERTICAL gap=32
    │   ├── Hero [I124:576;87:3879;124:757] — 1200×767
    │   ├── Portfolio Gallery [I124:576;87:3879;124:758] — 1200×1450
    │   ├── About [I124:576;87:3879;124:759] — 1200×912
    │   ├── Skills [I124:576;87:3879;234:1488] — 1200×842
    │   ├── CTA [I124:576;87:3879;124:760] — 1200×708
    │   └── FAB [I124:576;87:3879;311:2594] — 64×64, ABSOLUTE
    └── Footer Portfolio [I124:576;87:3880] — 1200×263

══════════════════════════════════════════════════════════

## 3. Header

Instance ID:         I124:576;87:3878
Component:           Header
Dimensions:          1200 × 96 px
Layout:              Horizontal Auto Layout
Alignment:           SPACE_BETWEEN, cross CENTER
Padding:             16/64/16/64 (→ spacing/16, spacing/64)
Background:          Schemes/Background + State Layers/Background/Opacity-08

Children:
  Nav Container [387×44] HORIZONTAL gap=24
  logo [89×64] INSTANCE
  Theme Toggles [195×48] HORIZONTAL gap=24

Nav Container:
  • Nav Link "Work" — 16px Inter Regular (material-theme/body/medium)
  • Nav Link "About" — 16px Inter Regular (material-theme/body/medium)
  • Min touch target: 44×44 px (container minHeight=44)

Theme Toggles:
  • Switcher/Toggle — sun/moon icon, theme switch
  • Button/Ghost "Hire me" — 123×48, 16px Inter Medium (material-theme/button/default), radius=8

══════════════════════════════════════════════════════════

## 4. Hero Section

Instance ID:         I124:576;87:3879;124:757
Dimensions:          1200 × 767 px
Layout:              Vertical Auto Layout
Padding:             120/0/120/0 (→ spacing-120)
Background:          Schemes/Background + State Layers/Background/Opacity-08

Content Slot [1072×393] — VERTICAL gap=64:
  ├── Text container [1072×273] — VERTICAL gap=32
  │   ├── Heading [1072×157] — VERTICAL
  │   │   ├── "I design for the moment " — 68px Poppins Medium
  │   │   │   Color: Schemes/On Surface Variant
  │   │   └── Heading Accent [1072×81] — FRAME
  │   │       ├── "when everything" — 68px Poppins Medium
  │   │       │   Fill: GRADIENT_LINEAR
  │   │       │   (Extended Colors/Button Gradient Start → End)
  │   │       └── " just clicks" — 68px Poppins Medium
  │   │           Color: Schemes/On Surface Variant
  │   └── Subtitle — 18px Inter Regular (material-theme/body/large)
  │       "A psychology degree and 10 years learning how great
  │        environments shape human decisions. Now I apply that same
  │        thinking to digital products — interfaces that feel simple,
  │        elegant, and obvious in hindsight"
  │       maxWidth=734
  └── CTA Buttons [424×56] — HORIZONTAL gap=16
      ├── Button/Primary "View case studies" — 235×56, radius=48
      └── Button/Secondary "Get in touch" — 173×56, radius=48

Decorative Layer:
  • floating elements — 20 bokeh circles, absolute positioning
  • Random sizes 32–92 px, various opacity
  • Fills: Schemes/Primary Container, Schemes/Secondary Fixed Dim

══════════════════════════════════════════════════════════

## 5. Section Pattern

All content sections follow the same outer structure:

  Section [INSTANCE] 1200×auto
  ├── Padding: 120/0/120/0 (→ spacing-120)
  ├── Content Slot: 1072 px wide, centered
  ├── Background: Schemes/Surface Container Lowest (white sections)
  │             OR Schemes/Background (dark sections: Hero, CTA)
  ├── Stroke: 1px INSIDE, State Layers/On Surface/Opacity-08 (white only)
  └── Layout: VERTICAL

Content width: 1200 − 2×64 = 1072 px

══════════════════════════════════════════════════════════

## 6. Portfolio Gallery Section

Instance ID:         I124:576;87:3879;124:758
Dimensions:          1200 × 1450 px
Background:          Schemes/Surface Container Lowest
Stroke:              1px INSIDE, State Layers/On Surface/Opacity-08

Structure:
  Content Slot [1072×1210] — VERTICAL gap=64, counterAlign=CENTER
  ├── Section Header [1072×158] — VERTICAL gap=32
  │   ├── Label/Section Tag "Work" — 16px Inter Semi Bold, UPPERCASE
  │   ├── "Portfolio" — 52px Poppins Medium (material-theme/display/small)
  │   └── "Explore my work in web design, UX Research and digital products"
  │       — 18px Inter Regular (material-theme/body/large)
  ├── Filters [486×44] — HORIZONTAL gap=12
  │   ├── Filter Button "All" (active)
  │   ├── Filter Button "Web Design"
  │   ├── Filter Button "App Design"
  │   └── Filter Button "UX Research"
  ├── Portfolio Grid [1072×760] — GRID layout
  │   ├── Columns: 3, Gap: 24×24
  │   ├── Card size: 341 × 368 px
  │   └── Cards: 6 × Portfolio Card instances
  └── Button/Primary "View All Projects" — 224×56, radius=48

══════════════════════════════════════════════════════════

## 7. About Section

Instance ID:         I124:576;87:3879;124:759
Dimensions:          1200 × 912 px
Background:          Schemes/Surface Container Lowest
Stroke:              1px INSIDE

Structure:
  Content Slot [1072×672] — VERTICAL gap=64
  ├── Label/Section Tag "About" — UPPERCASE
  └── Container [1072×584] — HORIZONTAL gap=40
      ├── My Process [516×584] — VERTICAL gap=32, pad=28
      │   (empty frame — content moved to Skills section)
      └── Skills & Tools [516×584] — VERTICAL gap=64
          └── About Header [516×584] — VERTICAL gap=32
              ├── "People-centered design begins with real curiosity"
              │   — 52px Poppins Medium (material-theme/display/small)
              ├── "My path to design wasn't straight. I studied psychology,
              │    then spent 10 years at a company obsessed with making
              │    spaces work for people. That's where I learned to notice
              │    things — why people stop, where they get confused, what
              │    makes something feel easy."
              │   — 18px Inter Regular (material-theme/body/large)
              ├── "Now I bring that same attention to digital products. I
              │    design websites, mobile apps and interfaces that just
              │    make sense — without making people think too hard."
              │   — 18px Inter Regular (material-theme/body/large)
              └── "I also work directly in code — which means I can take
                   a design from Figma all the way to implementation using
                   AI-assisted tools. No handoff gaps, no lost details."
                  — 18px Inter Regular (material-theme/body/large)

Note: My Process frame still exists but is empty; the process
steps have moved to the Skills section (§8).

══════════════════════════════════════════════════════════

## 8. Skills Section (formerly "Expertise")

Instance ID:         I124:576;87:3879;234:1488
Dimensions:          1200 × 842 px
Background:          Schemes/Surface Container Lowest
Stroke:              1px INSIDE
Content Slot:        VERTICAL gap=40, padding=64/0/64/0

Structure:
  Content Slot [1072×602] — VERTICAL gap=40
  ├── Label/Section Tag "Skills" — UPPERCASE
  └── Container [1072×410] — HORIZONTAL gap=40
      ├── Left Column [502×410] — VERTICAL gap=32
      │   ├── Areas of expertise [462×216] — VERTICAL gap=32
      │   │   ├── "Areas of expertise" — 14px Inter Medium (title/small)
      │   │   └── Tags — WRAP layout, 10× Tag/Badge (Outlined):
      │   │       UX Research, Wireframing, Prototyping, Figma Handoff,
      │   │       Web Design, Mobile Apps, Landing Pages, Psychology-led UX,
      │   │       Design Engineering, Design-to-code workflow
      │   └── Tools [502×128] — VERTICAL gap=32
      │       ├── "Tools" — 14px Inter Medium
      │       └── Tags — WRAP layout, 9× Tag/Badge (Outlined):
      │           Figma, FigJam, Maze, Protopie, Webflow,
      │           Adobe Firefly, Cursor, VS Code, Github
      └── Right Column [530×410]
          └── My Process [502×410] — VERTICAL gap=32
              ├── "My process" — 14px Inter Medium
              └── Steps Grid [502×358] — VERTICAL
                  ├── 01 Research & Insight
                  ├── 02 Wireframe & Structure
                  ├── 03 Prototype & Test
                  └── 04 Handoff & Support
                  Each step:
                    Badge/Number — 11px Inter Semi Bold (label/small)
                    Title — 16px Inter Semi Bold (label/large)
                    Description — 14px Inter Regular (body/small)

Note: Google Cert Badge and Pro Bono Banner removed from this section.

══════════════════════════════════════════════════════════

## 9. CTA Section

Instance ID:         I124:576;87:3879;124:760
Dimensions:          1200 × 708 px
Background:          Schemes/Background + State Layers/Background/Opacity-08
Content Slot:        VERTICAL gap=24

Structure:
  Content Slot [1072×468] — VERTICAL gap=24, counterAlign=CENTER
  ├── Label/Section Tag "Reach" — UPPERCASE
  ├── "Get in touch" — 52px Poppins Medium (display/small)
  ├── "We answer emails fast. We're also on WhatsApp if you
  │    prefer to talk directly." — 16px Inter Regular (body/medium)
  ├── "Pro bono spots available for NGOs and social-impact projects."
  │   — 16px Inter Regular (body/medium)
  └── CTA Buttons [368×56] — HORIZONTAL gap=16
      ├── Button/Primary "Send an email" — 208×56, radius=48, icon: mail
      └── Button/Ghost "WhatsApp" — 144×48, radius=8

Decorative Layer:
  • floating elements — 20 bokeh circles (same pattern as Hero)

══════════════════════════════════════════════════════════

## 10. FAB (Floating Action Button)

Instance ID:         I124:576;87:3879;311:2594
Component:           FAB
Dimensions:          64 × 64 px
Positioning:         ABSOLUTE (within Slot for section)
Background:          Schemes/Secondary Fixed Dim
Radius:              32/32/0/32 (asymmetric — flat bottom-right corner)
Icon:                circle-help, 24×24

══════════════════════════════════════════════════════════

## 11. Footer

Instance ID:         I124:576;87:3880
Component:           Footer Portfolio
Dimensions:          1200 × 263 px
Background:          Schemes/Background + State Layers/Background/Opacity-08

Top Container [1200×202] — HORIZONTAL, SPACE_BETWEEN, pad=64:

Left Column [257×74] VERTICAL gap=6:
  • Link Button "UX42.studio" — instance of Link Button component
  • "Aleksandra Burshtein · UX/UI Designer" — 13px Inter Medium

Center Column [112×44] HORIZONTAL gap=20:
  • 3× Social Icons (Dribbble, LinkedIn, Behance), minH=44 each

Right Column [252×44] HORIZONTAL gap=16:
  • Nav Link "Privacy Policy" — 16px Inter Regular
  • Nav Link "Terms" — 16px Inter Regular
  • Link "Cookies" — 16px Inter Regular

Bottom Strip [1200×61]:
  • "© 2026 UX42.studio. All rights reserved." — 13px Inter Medium
  • "🔧" link — 13px

══════════════════════════════════════════════════════════

## 12. Component Registry

Component                Count   Notes
────────────────────────────────────────────────────
Tag / Badge              19      Skills, tools (10+9 Outlined)
Layout                    7      Section wrappers
Portfolio Card            6      Grid items
lucide icons              6      Various icon instances
Nav Link                  4      Header + Footer
Filter Button             4      Portfolio section
Label / Section Tag       4      Work, About, Skills, Reach
Tags & Badges             4      Container instances
Social Icons              4      Footer + misc
Button / Primary          3      Hero, Portfolio, CTA
Button / Ghost            2      Hire me, WhatsApp
Switcher / Toggle         1      Theme switch
Button / Secondary        1      Hero "Get in touch"
logo                      1      UX42 logo
FAB                       1      Floating help button
Link Button               1      Footer "UX42.studio"
────────────────────────────────────────────────────
Total instances:         69

══════════════════════════════════════════════════════════

## 13. Color Token Mapping

Surface Tokens (fills):
  • Schemes/Background — Header, Hero, CTA, Footer
  • State Layers/Background/Opacity-08 — layered on Background sections
  • Schemes/Surface Container Lowest — Portfolio, About, Skills
  • Schemes/Secondary Fixed Dim — FAB background
  • State Layers/On Surface/Opacity-08 — section border strokes

Text Tokens (fills):
  • Schemes/On Surface Variant — heading text, body, labels, tags
  • Schemes/On Surface — headings, titles
  • Schemes/On Background — Hero, CTA text
  • Schemes/Primary Container — accent elements
  • Schemes/Primary — links, highlights
  • Extended Colors/Button Gradient Start/End — Hero "when everything"
  • Extended Colors/Primary Button Text — filled button/tag text

══════════════════════════════════════════════════════════

## 14. Spacing Token Mapping

Token                    Usage
────────────────────────────────────────────────────
spacing-120              Section vertical padding (top/bottom)
spacing/64               Header padding, Footer padding, Skills inner pad
spacing/32               Slot gap, Section Header gap, Text container gap
spacing/24               Header nav gap, Grid gap, CTA gap
spacing/16               Header vertical padding, CTA Buttons gap, Footer links
spacing/12               Filter Buttons gap
spacing/8                Button inner icon gap, Card inner gap
spacing/6                Footer left column gap

══════════════════════════════════════════════════════════

## 15. Text Style Reference

Style                             Font                Size  Usage
───────────────────────────────────────────────────────────────
material-theme/display/large      Poppins Medium      68px  Hero heading
material-theme/display/small      Poppins Medium      52px  Section headings
title/typography-h4               Poppins Medium      22px  Card titles
material-theme/body/large         Inter Regular       18px  Subtitles, bio
material-theme/body/medium        Inter Regular       16px  Nav, CTA body
material-theme/body/small         Inter Regular       14px  Process descriptions
material-theme/button/default     Inter Medium        16px  Ghost button labels
material-theme/label/large        Inter Semi Bold     16px  Section tags, step titles
material-theme/label/medium       Inter Medium        13px  Filters, badges, credits
material-theme/label/small        Inter Semi Bold     11px  Badge numbers
material-theme/title/small        Inter Medium        14px  Subsection headings
material-theme/title/medium       Inter Medium        16px  Link Button label

══════════════════════════════════════════════════════════

## 16. Change Log

### 2026-08-22 — Content & structure update

Hero:
  • Heading: "Design rooted in psychology & people."
    → "I design for the moment when everything just clicks"
  • Accent: "psychology" (Tertiary) → "when everything" (gradient)
  • Subtitle: rewritten
  • CTA: added Button/Secondary "Get in touch"
  • Primary CTA: "View work" → "View case studies"

Portfolio Gallery:
  • Subtitle: "our best work" → "my work in web design, UX Research"

About:
  • Bio completely rewritten (now 3 paragraphs)
  • New paragraph about code + AI-assisted tools
  • My Process content moved to Skills section

Skills (was "Expertise"):
  • Section tag: "About" → "Skills"
  • My Process moved here from About
  • +2 tags: Design Engineering, Design-to-code workflow
  • +2 tools: VS Code, Github
  • Google Cert Badge and Pro Bono Banner removed

Footer:
  • Copyright moved to bottom strip with 🔧 link
  • Link Button "UX42.studio" in left column

Stats: 82/82 text styles (100%), 252/297 bindings (85%), 69 instances

### 2026-08-04 — Initial spec + audit (12 findings resolved)

══════════════════════════════════════════════════════════

## 17. Node ID Quick Reference

Main Page root:          124:575
Page Desktop instance:   124:576
Header:                  I124:576;87:3878
Slot for section:        I124:576;87:3879
Hero:                    I124:576;87:3879;124:757
Portfolio Gallery:        I124:576;87:3879;124:758
About:                   I124:576;87:3879;124:759
Skills:                  I124:576;87:3879;234:1488
CTA:                     I124:576;87:3879;124:760
FAB:                     I124:576;87:3879;311:2594
Footer Portfolio:        I124:576;87:3880

══════════════════════════════════════════════════════════

## ADDENDUM: Changes 2026-08-22 (v2)

══════════════════════════════════════════════════════════

### A1. NEW: BlockLabel Navigation Components

4 new "BlockLabel next" instances added between sections in the Slot.
They replace the Label/Section Tag instances that were inside each section.

Component:           BlockLabel next (from Navigation component set)
Dimensions:          992 × 17 px
Layout:              HORIZONTAL

Structure:
  BlockLabel next [992×17] HORIZONTAL
  ├── Text [55×17] — FRAME
  │   └── Label — 11px Inter Semi Bold, UPPERCASE
  │       Letter spacing: 1.54px
  │       Color: Schemes/Surface Tint (rgba(131,215,177,1) in Dark)
  └── Line [937×1] — FRAME (thin separator line)

Instances in Slot for section (in order):
  1. "Work"   [I124:576;87:3879;631:1285] — AUTO, before Portfolio Gallery
  2. "About"  [I124:576;87:3879;631:1300] — AUTO, before About section
  3. "Skills" [I124:576;87:3879;631:1302] — AUTO, before Expertise section
  4. "Reach"  [I124:576;87:3879;631:1308] — ABSOLUTE, near CTA

CSS equivalent:
  display: flex;
  align-items: center;
  gap: 0;
  width: 992px; /* or container-relative */

  .label {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 1.54px;
    text-transform: uppercase;
    color: var(--md-sys-color-surface-tint);
  }

  .line {
    flex: 1;
    height: 1px;
    background: /* separator color from line strokes */;
  }

──────────────────────────────────────────────────

### A2. Label/Section Tags REMOVED from sections

All 4 Label/Section Tag instances removed from inside sections:
  ✗ "Work" — was in Portfolio Gallery > Section Header
  ✗ "About" — was in About > Content Slot
  ✗ "Skills" — was in Skills > Content Slot
  ✗ "Reach" — was in CTA > Content Slot

Navigation labels now live OUTSIDE sections as BlockLabel components
in the parent Slot for section.

Impact on CSS:
  • Remove <span class="section-tag"> from inside each <section>
  • Add BlockLabel as a standalone element between <section> blocks
  • Or implement as scroll-spy anchor labels in the page layout

──────────────────────────────────────────────────

### A3. Updated Top-Level Structure

Main Page [124:575] FRAME 1200×5230 NO-LAYOUT
└── Page Desktop [124:576] INSTANCE VERTICAL gap=32
    ├── Header [I124:576;87:3878] — 1200×96
    ├── Slot for section [I124:576;87:3879] — VERTICAL gap=32
    │   ├── Hero — 1200×767
    │   ├── BlockLabel "Work" — 992×17         ← NEW
    │   ├── Portfolio Gallery — 1200×1346       (was 1450)
    │   ├── BlockLabel "About" — 992×17        ← NEW
    │   ├── About — 1200×776                   (was 912)
    │   ├── BlockLabel "Skills" — 992×17       ← NEW
    │   ├── Expertise — 1200×602               (was 842)
    │   ├── CTA — 1200×660                     (was 708)
    │   ├── FAB — 64×64, ABSOLUTE
    │   └── BlockLabel "Reach" — 992×17, ABS   ← NEW
    └── Footer Portfolio — 1200×263

──────────────────────────────────────────────────

### A4. Section Padding Changes

About and Skills/Expertise sections:
  • Vertical padding: 120px → 96px (top and bottom)
  • CSS: padding-top/bottom from spacing-120 → 96px
  • Hero and CTA unchanged (still 120px)

Skills/Expertise content slot:
  • Inner padding removed: was 64/0/64/0, now 0/0/0/0
  • Content fills entire slot height

──────────────────────────────────────────────────

### A5. Portfolio Gallery Section Header

Label/Section Tag "Work" removed from header.
Section Header [1072×102] now contains only 2 children (was 3):

  Before:                          After:
  ├── Label/Section Tag "Work"     (removed)
  ├── "Portfolio" 52px             ├── "Portfolio" 52px
  └── Subtitle 18px               └── Subtitle 18px

Height: 158px → 102px
Section total: 1450px → 1346px

──────────────────────────────────────────────────

### A6. About Section Simplified

Label/Section Tag "About" removed.
Content Slot now has 1 child (was 2: Tag + Container).

Height: 912px → 776px
Padding: 120px → 96px top/bottom

──────────────────────────────────────────────────

### A7. Skills/Expertise Section Simplified

Node name: "Expertise" (was displayed as "Skills" via Section Tag)
Label/Section Tag "Skills" removed.
Content Slot now has 1 child (Container only).
Content Slot inner padding: was 64/0/64/0, now 0/0/0/0.

Height: 842px → 602px
Padding: 120px → 96px top/bottom

──────────────────────────────────────────────────

### A8. CTA Section Restructured

Label/Section Tag "Reach" removed.
Content Slot gap: 24px → 32px
Body texts wrapped in "Frame 1" [484×80] VERTICAL container.

New structure:
  Content Slot [1072×420] — VERTICAL gap=32
  ├── CTA Heading [318×60]
  │   └── "Get in touch" — 52px Poppins Medium
  ├── Frame 1 [484×80] — VERTICAL
  │   ├── "We answer emails fast..." — 16px Inter Regular
  │   └── "Pro bono spots available..." — 16px Inter Regular
  └── CTA Buttons [368×56] — HORIZONTAL gap=16

Height: 708px → 660px

──────────────────────────────────────────────────

### A9. Summary of Size Changes

Section              Before    After     Delta
──────────────────   ────────  ────────  ──────
Root frame           5415px    5230px    −185
Portfolio Gallery    1450px    1346px    −104
About                912px     776px     −136
Skills/Expertise     842px     602px     −240
CTA                  708px     660px      −48
Hero                 767px     767px       0
Footer               263px     263px       0

New BlockLabels: 4 × 17px + slot gaps = +200px approx
Net change: −185px

Component instances: 69 (same count — 4 Section Tags removed, 4 BlockLabels added)

### 2026-08-27 — Layout Spec review decisions

Resolved during review of the re-derived "Layout Spec — UX42.studio Portfolio (Figma → код)";
do not reintroduce these as discrepancies:

1. Hero & CTA background = Schemes/Surface Container Lowest (white).
   Mentions of Schemes/Background for Hero/CTA in §4, §9, §13 are superseded.
2. Section inside strokes (1px On Surface/Opacity-08, §5 pattern) intentionally
   not implemented.
3. BlockLabel labels: color outline-variant (#c5c6cc), letter-spacing 0.5px —
   overrides the green 1.54px variant described in Addendum A1.
4. Portfolio grid uses fluid `1fr` columns (~341px cell at 1072 content width);
   card fills its cell. Fixed 334px is the component intrinsic size only,
   never the on-page size.
5. Card image is TOP-aligned, height 256px (the "bottom:170px" reading was an
   artifact and is ignored).
6. TagBadge keeps material-theme/label/medium (Inter Medium 13px) as its
   DEFAULT size — the "16px" was wrong for case-page badges.
   Refined by Make-export ground truth (Docs/make-export/src/imports/
   "Html→Body"/index.tsx): Portfolio-page SKILLS & Tools tags ARE
   Inter Medium 16px / lh 24, white bg + rgba(0,84,59,0.16) border,
   px≈12.5/py≈6.5, r=10 → TagBadge size="lg".
7. Only sanctioned hardcode: nav divider rgba(140,213,179,0.16) until a token
   exists in globals.css.
8. Hero heading renders as inline flow (no flex wrap); anchor ids
   `portfolio` / `about` / `contact` exist on sections and are used by header
   nav (`#about`) and CTAs/FAB (`#contact`).

### 2026-08-27 (2) — New design reference U5OjywCHbtzQgBsi7PU25r + container architecture

Reference: Figma design file **Portfolio UX42** (`U5OjywCHbtzQgBsi7PU25r`),
node **124:575 "Main Page"** (1200×4785) — read via REST API (file is a regular
design file, not Make; MCP-server still cached an expired token, direct API works).
Important: Main Page is assembled in the DARK scheme; Layout/DS components
(`101:292`) and mobile components show the light scheme. Both map to existing
M3 semantic tokens (dark tokens in globals.css already match: bg #101412,
sections #0e0e0f, cards #1b1b1d, accent #83d7b1).

**Architecture (per Den's proposal, confirmed by file structure
Section → container → Content Slot):**

- Section block = full screen width, carries bg + vertical padding.
- Inner `.section-container` (globals.css): max-w 1200 centered,
  horizontal padding by device type:
  - mobile `<768px`: 16px (Figma `Section Mobile` 286:436 pad 48/16)
  - tablet `≥768px`: 32px (no tablet component in Figma — assigned by us)
  - desktop `≥1024px`: 64px (Figma container pad 0/64 → content 1072)
- Section vertical padding: mobile 48 → md 96 → lg 120 (hero, CTA) / 96 others.
- Page-level shadowed 1200 column removed (was `max-w-container-content` +
  shadow); blocks are now full-bleed.

**Header / Footer ownership change (user request):**

- Header keeps glass texture, size, behavior; center slot replaces the
  UX42.studio logo with the designer name/login (`displayName` prop,
  Poppins title-lg, primary color). All other header content unchanged.
- UX42.studio wordmark moved to SiteFooter brand column (links to `/`).
- Both header variants (default + breadcrumb) and both pages updated;
  case page keeps its 1200 column wrapper (no visual change: 1200 − 2×64
  gives the same 1072 content width).

**New elements found in 124:575 — pending product decisions (NOT yet built):**

a. Hero **Stats row** (gap 48): `10+ / MSc / NGO` — value Poppins 26/34
   accent, label Inter 14/22 ls 0.4, muted (#8f9196 dark).
b. **Pro Bono Banner** after Skills: full-width card r24 bg surface-container-low,
   pad 28, text Inter 16/24 ls 0.25 + Secondary button "Get in touch".
c. CTA second button **WhatsApp** as Button/Ghost (accent text + icon).
d. Primary buttons use **gradient** `#00543b → #336210` (dark scheme variant).
e. Filter chips: 13px Medium ls 0.5, selected = accent bg + inverted text
   (#003826 on #83d7b1); unselected `#131314/8` dark ≈ `surface/8`.
f. **FAB** in reference: bg #ffb3b1 (secondary), icon #410007, 64×64 —
   differs from our green FAB.
g. BlockLabel dividers carry a "next case →" Ghost button on the right.
h. Footer row: UX42.studio accent Link Button + name·title 13px, socials
   gap 20, legal links Inter 16/24 ls 0.25, divider white/10 (dark),
   copyright 13 Medium ls 0.5.
i. About left column in 124:575 contains decorative floating placeholder art
   (rounded blobs with micro-copy), not a plain gray rectangle.

**2026-08-27 (3) — Header: sticky + glass (Make recipe) + section container:**

По запросу («нравится текстура/размер/поведение хедера в Make») header
переведён на паттерн **Navbar из Figma Make** (`HomeDesktop.tsx`, узел
`Navbar / 3 /`), сохраняя наш состав зон (Work/About · имя дизайнера ·
тема + Hire me):

1. **Заморозка**: `sticky top-0 z-40` (у Make — absolute на топе страницы,
   для скролла взят sticky) — контент секций прокручивается под шапкой.
2. **Стекло** (`.header-glass`, точные значения Make): свет
   `rgba(255,255,255,0.5)`, тьма `rgba(10,10,10,0.8)`, `backdrop-blur 12px`
   (Make: backdrop-blur-md), тень прежняя `8/8/20/10%` (в тьме — светлая
   `rgba(255,255,255,0.05)`). Прежний градиент 315° + blur 40px заменён:
   он был фактически непрозрачным и стекло не читалось.
3. **Контейнер**: контент шапки обёрнут в `.section-container`
   (max-w 1200 + pads 16/32/64) — левая/центральная/правая зоны
   выровнены по колонкам секций (в Make: Navbar → Container max-w 1280
   mx-auto; у нас сетка 1200).
4. **Высота** неизменна: 96px (py-16 + контент h-64).
5. Якоря: `[id] { scroll-margin-top: 104px }` — переходы
   #portfolio/#about/#contact не прячут заголовки под sticky-шапкой.
6. Оба варианта компонента (SiteHeader и SiteHeaderBreadcrumb) переведены
   на один паттерн. FAB (z-50) выше шапки — конфликта слоёв нет.

**2026-08-27 (4) — Плотность шапки + хиро на высоту экрана:**

По фидбэку («в мейке шапка менее прозрачная, у нас сильно прозрачная;
хиро растяни на высоту экрана»):

1. **Шапка**. У Make literal-значение фона Navbar — `rgba(255,255,255,0.5)`,
   но там шапка absolute и всегда лежит на белом хиро, поэтому визуально
   она выглядит плотной белой плашкой. Наш sticky-вариант с 50% белого
   просвечивает скроллящимся контентом — впечатление «слишком прозрачная».
   Фон уплотнён: свет `rgba(255,255,255,0.9)`, тьма `rgba(10,10,10,0.9)`;
   blur 12px и обе тени — прежние. Стекло сохранено (лёгкое правило
   границы при скролле), но плашка читается как в Make.
2. **Hero**. Секция получила `min-h-[calc(100dvh_-_96px)]` (96px — высота
   sticky-шапки) + `flex items-center`: хиро занимает первый экран целиком,
   контент центрируется по вертикали. Паддинги py-12/24/30 (48/96/120)
   остаются как гарантированные отступы на малых экранах, где контент
   выше вьюпорта. FloatingElements остались абсолютными внутри секции.

**2026-08-27 (5) — Шапка: рецепт агента Make (градиент вместо плашки):**

Принесён вердикт ИИ-агента Figma Make. Его пункты про `header-glass`/
`section-container` «не определены» относятся к его Make-проекту (Make
генерирует инлайн Tailwind, классов там нет by design) — у нас оба класса
есть в globals.css. Существенное — новый рецепт фона. Сверка трёх версий:

| Версия | Фон | Blur |
|---|---|---|
| Спека (Figma literal) | градиент −45°: #f7faf5 100% → 0.08 | 40px |
| Архив make-export (Navbar) | rgba(255,255,255,0.5) равномерно; тьма 0.8 | 12px |
| **Вердикт агента Make (принято)** | градиент −45°: rgba(247,250,245,0.88) → 0.10; тьма rgba(10,10,10,0.88) → 0.10 | 4px |

Принят вердикт: слева плотная зона (0.88 — навигация читается), вправо
хедер тает (0.10 — контент просвечивает). Это объясняет фидбэк «в мейке
менее прозрачный»: градиент против нашей равномерной плашки 0.9.

1. `.header-glass` (globals.css) переписан на градиент 0.88→0.10 (−45°) +
   blur(4px); тени: свет 8/8/20/8%, тьма 8/8/20/25% (по вердикту).
   Тёмная тема — через `[data-theme='dark']` (у нас data-атрибут, не `.dark`).
2. `section-container` уже определён (16/32/64) — пункт вердикта закрыт
   ранее, изменений не требует.
3. Условия backdrop-filter проверены: хедер sticky без overflow:hidden;
   transform/filter/will-change на обёртках (layout, ThemeProvider,
   страница профиля) отсутствуют — stacking context не изолирован.
4. Комментарий в SiteHeader.tsx синхронизирован.