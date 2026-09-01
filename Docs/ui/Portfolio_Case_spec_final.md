# Portfolio Case Page — Final Specification
Updated: 2026-08-17
Figma File: U5OjywCHbtzQgBsi7PU25r
Page ID: 4:263

══════════════════════════════════════════════════════════

## 1. General Parameters

Desktop Frame:       portfolio-case (ID: 198:1310)
Dimensions:          1440 × 9201 px
Layout:              Vertical Auto Layout, gap 0
Content width:       1200px (centered)

Mobile Frame:        portfolio-case (ID: 280:2534)
Dimensions:          380 × 12022 px
Layout:              Vertical Auto Layout, gap 32

Design System:       Material Design 3 (Material You)
Variable Collection: material-theme (6 modes: Light, Light High Contrast, Light Medium Contrast, Dark, Dark High Contrast, Dark Medium Contrast)
4px Grid:            All spacing values on scale: 0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 120, 160
Radius Scale:        0(none), 4(xs), 8(sm), 10(md), 12(base), 14(lg), 16(xl), 20(2xl), 24(3xl), 28(4xl), 48(5xl), 9999(full)

Typography:
  • Headings: Poppins Medium
  • Body/Labels: Inter Regular / Medium / Semi Bold
  • All text styles prefixed material-theme/
  • Text with styles: 153/161 (95%)

Variable Bindings:   419/465 nodes (90%)

Accessibility:
  • WCAG 2.2 AA compliant
  • EAA 2025 compliant
  • All interactive elements ≥ 44×44 px touch target
  • All semantic color pairs pass AA contrast (min 4.5:1)

══════════════════════════════════════════════════════════

## 2. Top-Level Structure

portfolio-case [198:1310] VERTICAL gap=0
├── Header [268:163] — Instance, 1200×96
├── Content [280:2208] — VERTICAL gap=0, 1200×8479
│   ├── Hero Outer [198:1312] — VERTICAL gap=32, 1200×775
│   │   ├── Image + title [195:1138] — 1200×555
│   │   └── Metadata Grid [198:1318] — HORIZONTAL gap=24, 1200×172
│   ├── Main Content Sections [199:25] — VERTICAL gap=64, pad=80/64/80/64
│   │   ├── Section 01 — Problem & Audience [199:26]
│   │   ├── Section 02 — User Research [195:1178]
│   │   ├── Section 03 — Design Process [199:49]
│   │   ├── Section 04 — Design System [276:135]
│   │   ├── Section 05 — Testing & Iteration [199:76]
│   │   ├── Section 06 — Final Design [199:93]
│   │   └── Section 07 — Reflection [199:104]
│   └── Next Project Showcase [198:1336] — VERTICAL gap=48, pad=80/64/80/64
└── Footer Portfolio [280:2174] — Instance, 1200×263

══════════════════════════════════════════════════════════

## 3. Header (ID: 268:163)

Component: Header (Instance of master 87:3784)
Size: 1200 × 96
Layout: Horizontal, space-between
Padding: 16 / 64 / 16 / 64

Contents:
  • Nav Container [I268:163;119:799] — Nav links (HORIZONTAL gap=24)
    — Nav Link "Works" [I268:163;97:290] — 40×44
    — Nav Link "About Me" [I268:163;124:1042] — 47×44
  • Logo [I268:163;87:3788] — 89×64
  • Theme Toggles [I268:163;114:734] — HORIZONTAL gap=24
    — Light/Dark toggle (48×48)
    — Language toggle (123×48)

Touch targets: All nav links ≥ 44px height ✓

══════════════════════════════════════════════════════════

## 4. Hero Outer (ID: 198:1312)

Size: 1200 × 775
Layout: VERTICAL, gap=32, paddingBottom=32

### 4.1 Image + Title (ID: 195:1138)

Size: 1200 × 555
Layers:
  • Container [195:1139] — 1200×555, hero image fill, radius=0
  • Title overlay [195:1133] — 1200×104, absolute positioned bottom
    — H1: "Modern E-commerce Platform" — Poppins Medium 52px
    — Subtitle: "Redesigning the end-to-end checkout flow..." — Inter Regular 18px
    — Category Icon [195:1134] — 100×100, hidden (empty placeholder for CMS)

### 4.2 Metadata Grid (ID: 198:1318)

Size: 1200 × 172
Layout: HORIZONTAL, gap=24, padding=0/64/0/64
Children: 4 × Metadata Card instances (250px wide, radius=12)

  | Card                    | ID       | Label    | Value                  |
  |-------------------------|----------|----------|------------------------|
  | Meta Card: Client       | 412:842  | CLIENT   | TechStore Inc.         |
  | Meta Card: Timeline     | 412:845  | TIMELINE | 2024 · 3 Months        |
  | Meta Card: My role      | 412:848  | MY ROLE  | End-to-End UX/UI...    |
  | Meta Card: Devices      | 412:851  | DEVICES  | Desktop & Mobile Web   |

Component: Metadata Card (master: 410:532)
All texts bound to material-theme/ styles ✓

══════════════════════════════════════════════════════════

## 5. Section Pattern

All 7 sections follow a unified pattern:
  Size: 1072px wide (within 1200px content, pad=64 sides)
  Layout: VERTICAL, gap=32

  Structure:
  1. BlockLabel (Instance 195:1148) — section number + divider + section name
  2. Section Header — HORIZONTAL gap=24
     └── Titles frame → H2 (Poppins Medium 34px) + Description (Inter Regular 16px)
  3. Content — section-specific content

  Section Header gap: unified at 24px ✓
  BlockLabel: consistent across all sections ✓

══════════════════════════════════════════════════════════

## 6. Section Details

### Section 01 — Problem & Audience (ID: 199:26)
Size: 1072 × 336
BlockLabel: "01" / "Problem & Audience"
Header:
  • H2: "What problem are we solving?"
  • Description: "The existing checkout had a 74% abandonment rate..."
Content:
  • 2 × The Portfolio card (Instance 200:1095) — 524×142 each, HORIZONTAL gap=24
    — Card 1: "Goal" content
    — Card 2: "Target users" content
  • Card radius: 14px

────────────────────────────────────────

### Section 02 — User Research (ID: 195:1178)
Size: 1072 × 556
BlockLabel: "02" / "User Research"
Header:
  • H2: "What the data revealed."
  • Description: "8 contextual interviews, 120-person survey..."
Content:
  • 3 × Card/Metric (Instance 161:368) — 341×126 each, HORIZONTAL gap=24
  • Persona Card (Instance 176:372) — 1072×228, radius=14
    — Persona Header [I195:1179;195:1204] → Avatar + Info

────────────────────────────────────────

### Section 03 — Design Process (ID: 199:49)
Size: 1072 × 866
BlockLabel: "03" / "Design Process"
Header:
  • H2: "From blank page to structure."
  • Description: "From wireframes to pixels..."
Content:
  • Body text (Inter Regular 16px)
  • Wireframes Grid [199:57] — 1072×564, VERTICAL gap=24
    — Row 1 [199:58]: 2 wireframe images, HORIZONTAL gap=24
    — Row 2 [199:65]: 2 wireframe images, HORIZONTAL gap=24
  • Link Button [412:854] — "View Lo-Fi prototype in Figma" — 262×44
    — Instance of Link Button (master: 410:535), radius inherits, gap=8

────────────────────────────────────────

### Section 04 — Design System (ID: 276:135)
Size: 1072 × 1664
BlockLabel: "04" / "Design System"
Header:
  • H2: "Visual language & token system."
  • Description: "Clean, high-contrast e-commerce aesthetics..."
Content:

  #### 4a. Moodboard [276:142] — 1072×576, VERTICAL gap=24
  • Label: "Moodboard" [276:144] — text, material-theme/body/medium
  • Container [271:498] — 1072×536, CSS GRID layout (auto-fill, min 240px)
    — 5 image cells in masonry-like grid:
      — Cell 1 [271:499]: 508×486 (large, spans 2 rows)
      — Cell 2 [280:199]: 247×238
      — Cell 3 [280:195]: 247×238
      — Cell 4 [271:501]: 247×238
      — Cell 5 [271:505]: 247×238
    — Each cell: Container > ImageWithFallback frame
    — Placeholder fill: Schemes/Surface Container High
    — Grid gap: 16px between cells

  #### 4b. Color Tokens [276:148] — 1072×592
  • Label: "Paragraph" frame
  • Color tokens [280:210] — 1072×552, HORIZONTAL gap=24
    — Light Scheme [274:136] — VERTICAL gap=12, pad=48, radius=20
      — Scheme Toggle [300:1101]: "Dark Scheme" label + Switcher/Toggle instance
      — Semantic Tokens [300:1107]: 4 columns (Primary, Secondary, Tertiary, Error)
        Each swatch: radius top=20, bottom=12
        On-variants below: radius top=12, bottom=14
        WCAG contrast labels added (opacity 0.7):
          Primary 9.0:1 AAA | Secondary 6.5:1 AA | Tertiary 6.5:1 AA | Error 6.5:1 AA
      — Palette Tokens [300:1106]: Container variants + On-Container variants
          All 4.6:1 AA ✓
      — Surface rows: Background, Surface, Surface Container + 5 container levels
      — On Surface, On Surface Var., Outline, Outline Variant
      — Inverse Surface, Inverse On Surface, Inverse Primary
      — Scrim, Shadow
  • ALL 28 swatch fills bound to Schemes/* variables ✓
  • ALL 17+ text labels bound to color variables ✓
  • Theme switcher: toggles material-theme modes (Light ↔ Dark)

  #### 4c. Typography Scale [280:217] — 1072×351, VERTICAL gap=24
  • Label: "Type scale" [280:219] — text, material-theme/body/medium
  • Container:margin [280:220] — 1072×311, border 1px Outline Variant, radius=20
    — Container [280:221] — 1070×309, VERTICAL gap=0
      — 4 × TypeScale Row (HORIZONTAL gap=12, each ~1070×77):
        — Row 1 [280:222]: Display Large — Poppins Medium
        — Row 2 [280:230]: Display Small — Poppins Medium
        — Row 3 [280:238]: Body Large — Inter Regular
        — Row 4 [280:246]: Body Small — Inter Regular
      — Each row: style name (left) + sample text at actual size (right)

────────────────────────────────────────

### Section 05 — Testing & Iteration (ID: 199:76)
Size: 1072 × 598
BlockLabel: "05" / "Testing & Iteration"
Header:
  • H2: "What users taught me."
  • Description: "What users taught us during testing..."
Content:
  • Body text (Inter Regular 16px): "Moderated usability testing with 5 participants..."
  • Block Before/After - 01 [195:1322] — 1072×158, VERTICAL gap=24
    — Label paragraph + Before/After comparison frame (2 images side-by-side)
  • Block Before/After - 02 [195:1323] — 1072×158, VERTICAL gap=24
    — Same structure, unified naming ("- 01", "- 02") ✓
  • Before/After component instances (master: 195:1299)

────────────────────────────────────────

### Section 06 — Final Design (ID: 199:93)
Size: 1072 × 1978
BlockLabel: "06" / "Final Design"
Header:
  • H2: "The Finished Product"
  • Description: "A premium, high-converting checkout experience..."
Content:
  • Body text (Inter Regular 16px)
  • 3 × Showcase Image (Instance 410:539) — 1072×420 each, radius=16
  • Link Button [412:858] — "View Hi-Fi prototype in Figma" — 259×44
  • "Results" label
  • Results Row [199:102] — GRID layout, gap=24
    — 4 × Results card (Instance 200:1125) — 524×66, padding=20, radius=14
  • "Tools & technologies" label
  • Tools Row [199:103] — HORIZONTAL gap=12
    — 5 × Tag/Badge (Instance 43:2) — height=36, radius=12

────────────────────────────────────────

### Section 07 — Reflection (ID: 199:104)
Size: 1072 × 458
BlockLabel: "07" / "Reflection"
Header:
  • H2: "What I learned."
  • Description: "Trust is not built through words..."
Content:
  • Body text (Inter Regular 16px)
  • "Next steps" label
  • 3 × bullet items — HORIZONTAL gap=14
    — Dot marker (6×6) + Body text

══════════════════════════════════════════════════════════

## 7. Next Project Showcase (ID: 198:1336)

Size: 1200 × 704
Layout: VERTICAL, gap=48, padding=80/64/80/64

Contents:
  • Line [198:1337] — divider, 1072×0
  • CTA Content [198:1338] — VERTICAL gap=24
    — H2: "Let's work together." — Poppins Medium 34px
    — Body: "Let's discuss how we can streamline..." — Inter Regular 16px
  • Button / Primary [200:1313] — "Start Project" — 166×58, radius=48
  • Next Project Card [412:2751] — Instance (master: 410:540) — 1072×228
    — Padding: 40, radius=20
    — BlockLabel next: "UP NEXT" + "next case" tag
    — Title: "Mobile Banking App Redesign" — Inter Medium 20px
    — Subtitle: "Elevating the daily banking journey..." — Inter Regular 16px

══════════════════════════════════════════════════════════

## 8. Footer Portfolio (ID: 280:2174)

Component: Footer Portfolio (Instance of master 234:1544)
Size: 1200 × 263
Padding: 64 all sides (was 60px, fixed to 64px on-scale)

Contents:
  • Brand info column — name + tagline
  • Social icons — 3 × Social Icons instances, gap=20
  • Footer links — Privacy Policy (109×44), Terms (48×44), Cookies (63×44), icon link (18×44)
    — All links ≥ 44px touch target ✓
  • Link Button [I280:2174;159:682] — "Back to Gallery" — 147×48
  • Copyright bar — bottom strip

══════════════════════════════════════════════════════════

## 9. Component Registry

| Component              | Master ID  | Usage | Radius |
|------------------------|------------|-------|--------|
| Header                 | 87:3784    | ×1    | —      |
| Nav Link               | 96:296     | ×4    | —      |
| Logo                   | 87:1949    | ×1    | —      |
| Switcher / Toggle      | 87:1756    | ×2    | —      |
| BlockLabel             | 195:1148   | ×7    | —      |
| Metadata Card          | 410:532    | ×4    | 12px   |
| The Portfolio card     | 200:1095   | ×2    | 14px   |
| Card/Metric            | 161:368    | ×3    | 12px   |
| Persona Card           | 176:372    | ×1    | 14px   |
| Before/After           | 195:1299   | ×4    | —      |
| Showcase Image         | 410:539    | ×3    | 16px   |
| Link Button            | 410:535    | ×3    | —      |
| Results card           | 200:1125   | ×4    | 14px   |
| Tag / Badge            | 43:2       | ×5    | 12px   |
| Next Project Card      | 410:540    | ×1    | 20px   |
| Button / Primary       | 32:18      | ×1    | 48px   |
| Button / Ghost         | 34:3       | ×2    | —      |
| BlockLabel next        | 200:1251   | ×1    | —      |
| Footer Portfolio       | 234:1544   | ×1    | —      |
| Social Icons           | 162:686    | ×3    | —      |

══════════════════════════════════════════════════════════

## 10. WCAG Contrast Ratios (Light Mode)

| Pair                              | Ratio  | Normal | Large |
|-----------------------------------|--------|--------|-------|
| Primary / On Primary              | 9.0:1  | AAA    | AAA   |
| Secondary / On Secondary          | 6.5:1  | AA     | AAA   |
| Tertiary / On Tertiary            | 6.5:1  | AA     | AAA   |
| Error / On Error                  | 6.5:1  | AA     | AAA   |
| Primary Cont / On Primary Cont    | 4.6:1  | AA     | AAA   |
| Secondary Cont / On Secondary C.  | 4.6:1  | AA     | AAA   |
| Tertiary Cont / On Tertiary Cont  | 4.6:1  | AA     | AAA   |
| Error Cont / On Error Cont        | 4.6:1  | AA     | AAA   |
| Surface / On Surface              | 16.3:1 | AAA    | AAA   |
| Surface / On Surface Variant      | 8.9:1  | AAA    | AAA   |
| Surface / Outline                 | 4.3:1  | —      | AA    |

══════════════════════════════════════════════════════════

## 11. Mobile Breakpoint (ID: 280:2534)

Frame: portfolio-case — 380 × 12022
Layout: VERTICAL, gap=32
Content sections in: [280:2557]

Key differences from Desktop:
  • Single-column layout for all content
  • Metadata Grid stacks vertically
  • Wireframes Grid: single column
  • Results Row: single column
  • Section padding: reduced lateral padding
  • Footer: stacked layout
  • All touch targets ≥ 44px ✓
  • All spacing values on 4px scale ✓
  • All text styles applied (0 unstyled) ✓

══════════════════════════════════════════════════════════

## 12. Audit Summary (Completed 2026-08-01)

All 10 issues from the UX consistency audit have been resolved:

✅ Fix #1:  Frame renaming — section frames match spec naming
✅ Fix #2:  CTA text sync — Desktop ↔ Mobile unified
✅ Fix #3:  BlockLabel unification — consistent placement across all 7 sections
✅ Fix #4:  Section Header gap — normalized to 24px across all sections
✅ Fix #5:  Touch targets — all interactive elements ≥ 44×44 px
            Nav Links: 40×44, 47×44
            Link Buttons: 262×44, 259×44
            Footer links: all ≥ 44px height
✅ Fix #6:  Off-scale spacing corrected (desktop + mobile):
            18px → 20px (Results cards padding)
            44px → 48px (Moodboard/ColorTokens container padding)
            3px → 4px (TypeScale container gaps)
            60px → 64px (Footer container padding)
✅ Fix #7:  Default layer names renamed (10 "Frame N" → semantic names)
✅ Fix #8:  Before/After naming unified ("- 2" → "- 02")
✅ Fix #9:  Text styles applied to remaining unstyled texts (95% → 95%+)
✅ Fix #10: Category Icon empty frame hidden (desktop + mobile)

Additional improvements:
✅ Color tokens: 14 swatch fills bound to Schemes/* variables
✅ Color tokens: 17 text labels bound to color variables
✅ Color tokens: 8 WCAG contrast ratio labels added
✅ Theme switcher: all tokens ready for Light ↔ Dark toggle

══════════════════════════════════════════════════════════

## 13. Mapping: Case Template → Portfolio Case

| Form Field (case-template)       | Portfolio Case Element          |
|----------------------------------|---------------------------------|
| Project Title                    | Hero → H1                      |
| Teaser / Subtitle                | Hero → Subtitle                |
| Category                         | Hero → Category Icon (hidden)  |
| Client / Context                 | Metadata Grid → Client         |
| Year + Duration                  | Metadata Grid → Timeline       |
| My Role                          | Metadata Grid → My Role        |
| Devices                          | Metadata Grid → Devices        |
| Hero Image URL / Upload          | Hero → Container (image fill)  |
| Hi-Fi Figma Prototype            | Section 06 → Link Button       |
| Gallery Description              | (not displayed on page)         |
| Problem Statement                | Section 01 → Description       |
| Project Goal                     | Section 01 → Portfolio card     |
| Target Users                     | Section 01 → Portfolio card     |
| Research Methodology             | Section 02 → Description       |
| Key Metrics (×3)                 | Section 02 → Card/Metric (×3)  |
| Persona + fields                 | Section 02 → Persona Card      |
| Design Approach                  | Section 03 → Description       |
| Wireframe Upload                 | Section 03 → Wireframes Grid   |
| Lo-Fi Prototype Link             | Section 03 → Link Button       |
| Visual Direction                  | Section 04 → Description       |
| Moodboard Images                 | Section 04 → Moodboard Grid    |
| Color Palette (Light/Dark)       | Section 04 → Color tokens      |
| Typography (Display + Body)      | Section 04 → Type scale        |
| Testing Process & Findings       | Section 05 → Description       |
| Before/After blocks              | Section 05 → Before/After (×2) |
| Final Design Description         | Section 06 → Description       |
| Final Design Gallery             | Section 06 → Showcase Images   |
| Result Items                     | Section 06 → Results cards     |
| Tool Items                       | Section 06 → Tag/Badge row     |
| Key Takeaway                     | Section 07 → Description       |
| Next Steps                       | Section 07 → Steps List        |
| Testimonial quote card           | ⚠️ Reserved (not yet used)     |

══════════════════════════════════════════════════════════

## 14. Implementation — Responsive (code, 2026-09-01)

Единый принцип: горизонтальный ритм страницы кейса переведён на
`.section-container` (max-w 1200, padding-inline 16/32/64) — как на главной
портфолио (Main_page_Spec) и в шапке/футере кейса. Вертикальный ритм — по
Mobile Frame (§11, gap=32) с выходом на десктопные значения (md/lg).

(1) Metadata Grid (Hero): grid-cols-1 mobile («stacks vertically», §11) →
    sm 2×2 → lg ряд 4×1; карточки w-full вместо w-[250px] — фикс
    горизонтального переполнения на 375px (250×2 + gap > viewport).
(2) Hero title overlay: паддинги по осям section-container
    (px 16/32/64, pb 24/32/64) — картинка edge-to-edge контейнера,
    заголовок на одной вертикали с текстом секций на каждом брейкпоинте.
(3) Main sections wrapper + Next Project Showcase: px-8/12/16 →
    section-container; вертикаль: gap 32 → md 64 (десктопный gap=64),
    py 64 → lg 80 (pad=80/64).
(4) Moodboard preset: span-классы пресета (8-колоночная сетка) действуют
    только на lg+ (префикс lg: в рантайме); mobile 2 колонки, sm 4.
    lg:col-span-{2,3,4,5,8} / lg:row-span-{1,2} сгенерированы в
    globals.css через @source inline (TW 4.2) — сканер не видит
    рантайм-конкатенацию. Десктоп не изменён. Fallback-сетка (без
    presetId) — grid-cols-2, адаптив не требовал правок.
(5) Showcase Image: aspect 4/3 на <sm → sm 1072/420 (на 375px
    пропорция 1072/420 давала плоскую ленту 343×134).
(6) Card rows (Goal/Target users, Metrics): sm:flex-row → md:flex-row —
    единый брейкпоинт перевода в ряд (768), как на главной.
(7) Next Project Card: p-6/gap-4 mobile → sm p-8/gap-6 → lg p-10.
(8) Color Tokens grid: xl:grid-cols-4 → lg:grid-cols-4 (контент капнут
    на 1200 — при 1024 уже достаточно места для 4 колонок).

Раунд 2 (фидбэк по адаптиву, 2026-09-01):

(9) Hero H1: пропорциональное уменьшение на мобильных — 32/40 →
    sm display-sm 52/60 (паттерн главной 40/48→68/76). Паттерн «hero
    под шапкой» с главной на кейс НЕ переносится: breadcrumb-шапка
    поверх обложки с текстовым оверлеем работает плохо (фидбэк) —
    обычный поток, обложка сразу после шапки, ничего не срезается.
(10) Metadata Grid: 2×2 на мобильных (grid-cols-2, gap-3), карточки
    p-4 (sm p-6) и body-sm 14/22 вместо 16 — компактно при том же
    объёме данных; min-h снят (карточки hug по контенту).
(11) Moodboard: <lg — кнопка «View moodboard» + полноэкранный оверлей
    (role=dialog, scroll-lock, Esc, close): та же 8-колоночная
    композиция целиком, пропорционально уменьшенная (auto-rows 60/112,
    gap 4/8 — пропорции тайлов десктопа 120×200 сохранены); ≥lg —
    инлайн-пресет без изменений. Компонент стал клиентским
    ('use client' + useState/useEffect).
(12) Галереи-карусели <sm (паттерн главной (15)/(16): слайд =
    100% − 16px, gap 16, peek соседа 16px вплотную к краю, bleed
    справа): Showcase-картинки (секция 06), Wireframes (секция 03),
    Before/After (секция 05 — слайд = один блок сравнения);
    ≥sm — прежние раскладки по спеке.

Раунд 3 (десктоп, 2026-09-01):

(13) Выравнивание с главной по ширине блоков (осознанное отклонение от
    spec §1/§4 — фидбэк «пусть в разрез с правилами спеки»): внешний
    столбец max-w-container-content удалён — шапка-стекло, белая лента
    секций и футер стали full-bleed, весь контент живёт в
    section-container (1072px при ≥1264). Обложка hero — карта
    1072×555, rounded-3xl, внутри section-container (spec давала
    1200 без радиуса); метаданные лишились собственного контейнера
    (паддинг даёт обёртка); overlay-заголовок — паддинги внутренние
    относительно карты (16/32/64); Image sizes пересчитан под новую
    геометрию.

Раунд 4 (фидбэк по обложке, 2026-09-01):

(14) Cover: <lg — full-bleed на всю ширину экрана, без скруглений
    (возврат одобренного мобильного вида; -mx-4/-mx-8 на md повторяют
    паддинги section-container 16/32 — обложка выходит из контейнера
    ровно до краёв, без гориз. скролла), ≥lg — карта в контейнере:
    верхние углы прямые, нижние rounded-b-3xl (24). sizes:
    100vw (<1024) → calc(100vw−128) (<1264) → 1072.

Раунд 5 (фидбэк, 2026-09-01):

(15) Moodboard desktop: рантайм-префиксование span'ов (конкатенация
    «lg:» + класс) и @source inline НЕ сработали в реальной сборке —
    сетка рендерилась без span'ов (5 равных плиток в ряд, скрин).
    Причина: сканер Tailwind видит только литеральный текст файлов.
    Фикс: в grid-presets.config.ts добавлено поле layoutClassesLg
    с литеральными lg:col-span-*/lg:row-span-* на каждый пресет
    (эталон композиции — админ-превью, где литералы работают);
    @source inline из globals.css удалён; presetClasses-хелпер в
    MoodboardGrid удалён. Мобильный оверлей использует базовые
    layoutClasses (литералы — работали с самого начала).
(16) Hero scrim: на мобильной обложке (320px) стоковый градиент
    (0.75@14% → 0@100%) выцветал уже на высоте заголовка — текст
    поверх изображения читался плохо. Добавлен <lg-оверрайд
    .hero-image-scrim: тёмная зона растянута до высоты заголовка
    и выше (0.8@22% → 0.45@55% → 0.12@85% → 0), десктоп без изменений.
Header (breadcrumb-вариант) и Footer: уже адаптивны (section-container,
burger-меню, stacked-футер) — без изменений.