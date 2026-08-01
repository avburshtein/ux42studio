Спецификация страницы: Portfolio Case
Файл: Portfolio_Case_spec.md
Обновлено: 2026-07-24
Связанные документы: design-system-ux42.md, case-template-spec.md, figma-master-components-spec.md
Page ID в Figma: 4:263

══════════════════════════════════════════════════════════

1. Общие параметры Layout

Фрейм:                portfolio-case (ID: 198:1310)
Viewport Desktop:      1440px
Viewport Tablet:       768px
Viewport Mobile:       375px
Content max-width:     1200px (padding 120px с каждой стороны)
Высота фрейма:         ~6731px (Auto Layout, hug content)
Layout фрейма:         Vertical Auto Layout
Фон:                   Schemes/Background (токен material-theme)
Vertical padding:      80px Desktop / 48px Mobile
Spacing scale:         16 / 24 / 32 / 48 / 80px
Grid Desktop:          12 колонок, gap 24px
Grid Tablet:           8 колонок, gap 16px
Grid Mobile:           4 колонки, gap 16px

══════════════════════════════════════════════════════════

2. Структура страницы (верхний уровень)

portfolio-case (1440 × ~6731) [Vertical Auto Layout]
├── Breadcrumb Row        (1200 × 100)   — навигация
├── Hero Outer            (1200 × 775)   — герой-секция
├── Main Content Sections (1200 × 5196)  — 6 контентных секций
└── Next Project Showcase (1200 × 660)   — CTA + следующий проект

══════════════════════════════════════════════════════════

3. Breadcrumb Row (ID: 198:1311)

Размер:    1200 × 100
Padding:   24 / 64 / 12 / 64
Layout:    Vertical Auto Layout

Элементы:
• Кнопка «← Назад в портфолио» — Link / Secondary Button, иконка arrow-left, цвет Schemes/Primary
• Breadcrumbs: Главная / Портфолио / [Название кейса]
  — Ссылки: material-theme/body/medium, цвет Schemes/Primary
  — Разделитель «/»: цвет Schemes/Outline
  — Текущая страница: цвет Schemes/On Surface (не ссылка)

⚠️ В текущей Figma Breadcrumb Row пустой — зарезервирован. Заполнить компонентом Breadcrumb Navigation по спеке figma-master-components-spec.md раздел 5.10.

══════════════════════════════════════════════════════════

4. Hero Outer (ID: 198:1312)

Размер:    1200 × 775
Layout:    Vertical Auto Layout, gap 32px

────────────────────────────────────────

4.1 Image + Title (ID: 195:1138)

Наложение текста поверх изображения (абсолютное позиционирование Title внутри Container).

Container (ID: 195:1139):
— Размер: 1200 × 555
— Тип: фоновое hero-изображение (fill из поля Hero Image URL case-template)
— Radius: 0 (без скругления в текущей реализации)

Title (ID: 195:1133) — наложен поверх Container:
— Layout: Vertical Auto Layout, gap 16px
— Элементы сверху вниз:
  • Category Icon (ID: 195:1134) — иконка категории, 100 × 100
  • H1 — название проекта, стиль material-theme/headline/large (Poppins Medium 48px), цвет Schemes/On Primary (белый поверх изображения)
  • Subtitle — тизер/тэглайн, стиль material-theme/body/large (Inter Regular 18px), цвет Schemes/On Primary с opacity 80%

────────────────────────────────────────

4.2 Metadata Grid (ID: 198:1318)

Размер:    1200 × 188
Layout:    Horizontal Auto Layout, gap 24px

4 мета-карточки, каждая 250px wide, Vertical Auto Layout, gap 8px, padding 24px:

Карточка      | Label (overline)  | Value
Client        | «CLIENT»          | Название клиента
Timeline      | «TIMELINE»        | 2024 · 3 Months
My Role       | «MY ROLE»         | Роль дизайнера
Devices       | «DEVICES»         | Desktop & Mobile Web

Label: Inter Medium 13px, letterSpacing 0.5px, цвет Schemes/On Surface Variant
Value: material-theme/body/medium (Inter Regular 16px), цвет Schemes/On Surface
Фон карточки: Schemes/Surface Container Low
Stroke: 1px Schemes/Outline Variant
Radius: 12px | radius/base

Desktop: 4 карточки в ряд
Mobile: 2 × 2 сетка

══════════════════════════════════════════════════════════

5. Main Content Sections (ID: 199:25)

Layout:    Vertical Auto Layout, gap 64px
Padding:   80 / 64 / 80 / 64

Все секции используют единый паттерн:
  BlockLabel    — номер + название секции + разделитель
  Section Header — заголовок H2 + подзаголовок
  [Контент]     — уникальный для каждой секции

Компонент BlockLabel:
— Layout: Horizontal Auto Layout, gap 10px
— Элементы:
  • Номер секции (кружок): material-theme/label/overline, цвет Schemes/Primary
  • Линия-разделитель: fill Schemes/Outline Variant
  • Название секции: material-theme/label/large, цвет Schemes/On Surface Variant

────────────────────────────────────────

Section 01 — Problem & Audience (ID: 199:26)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:    «01» / «Problem & Audience»
H2:            «What problem are we solving?», material-theme/headline/medium (Poppins 34px)
Description:   Текст проблемы, material-theme/body/large
Content Row:   Horizontal, gap 24px

Content Row (2 карточки «The Portfolio card»):
— Карточка «Goal» — цель проекта, pad 24px, gap 12px
— Карточка «Target users» — описание ЦА, pad 24px, gap 12px

Маппинг из case-template:
• Business Problem → Description
• Goal → Portfolio card «Goal»
• Target Audience → Portfolio card «Target users»

────────────────────────────────────────

Section 02 — User Research (ID: 195:1178)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:    «02» / «User Research»
H2:            «What the data revealed.»
Description:   Методология исследования
Metrics Row:   3× Card/Metric (ID: 169:405), Horizontal, gap 24px
Persona Card:  ID: 176:372, 1072 × 228

Metrics Row — 3 карточки Card/Metric:
• «74%» / «Checkout abandonment»
• «120» / «Survey participants»
• «4.2s» / «Avg. task time»

Метрика Value: material-theme/headline/large (Poppins 48px), цвет Schemes/Primary
Метрика Description: material-theme/body/small, цвет Schemes/On Surface Variant

Persona Card (ID: 176:372):
— Label «User persona»
— Avatar + Info: имя и возраст
— User Story quote (курсив)

Mobile: Metrics Row → 1 колонка (stack vertical)

Маппинг из case-template:
• Research Methodology → Description
• Key Metrics (×3) → Card/Metric instances
• Persona → Persona Card

────────────────────────────────────────

Section 03 — Design Process (ID: 199:49)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:      «03» / «Design Process»
H2:              «From blank page to structure.»
Subtitle:        «From wireframes to pixels...»
Description:     Описание подхода
Wireframes Grid: 2×2, gap 24px
Link Button:     «View Lo-Fi prototype in Figma» + chevron-right

Wireframes Grid:
— Row 1: Wireframe 1 (524 × 265) + Wireframe 2 (524 × 265)
— Row 2: Wireframe 3 (524 × 265) + Wireframe 4 (524 × 265)
— Radius каждого: 12px | radius/base
— Фон placeholder: Schemes/Surface Container

Mobile: Wireframes → горизонтальный скролл (overflow-x: auto, snap-точки)

Маппинг из case-template:
• Design Approach → Description
• Wireframe Images → Wireframes Grid
• Lo-Fi Prototype Link → Link Button

────────────────────────────────────────

Section 04 — Testing & Iteration (ID: 199:76)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:          «04» / «Testing & Iteration»
H2:                  «What users taught me.»
Description:         Описание тестирования
Before/After Block 01: Label + пара Before/After (ID: 176:365)
Before/After Block 02: Label + пара Before/After

Структура Before/After Block:
— Label: название фичи, material-theme/label/large, цвет Schemes/On Surface
— Before/After пара: Horizontal, gap 24px
  • Before: фрейм 524 × auto, label «Before»
  • After: фрейм 524 × auto, label «After»

Примеры:
— Block 01: «Order summary visibility»
— Block 02: «Form validation»

Mobile: Before/After → stack vertical (Before сверху, After снизу)

Маппинг из case-template:
• Testing Results → Description
• Before/After Comparisons → Before/After blocks

────────────────────────────────────────

Section 05 — Final Design (ID: 199:93)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:      «05» / «Final Design»
H2:              «The Finished Product»
Subtitle:        Краткое описание
Description:     Полное описание финального дизайна
Showcase Images: 3× фрейм 1072 × 420
Link Button:     «View Hi-Fi prototype in Figma» + chevron-right
Label:           «Results»
Results Row:     4× Results card, GRID, gap 24px
Label:           «Tools & technologies»
Tools Row:       5× Tag/Badge (Variant=Filled), Horizontal, gap 12px

Showcase Images:
— Размер: 1072 × 420 каждый
— Radius: 16px | radius/xl
— Фон placeholder: Schemes/Surface Container High

Results Row (4 карточки Results card):
— Layout: Horizontal, padding 18px, radius 14px
— Размер: 524 × 62
— Маркер Dot + текст результата
— Примеры:
  • «250% increase in conversion rate»
  • «40% reduction in page load time»
  • «95% positive user feedback»
  • «3x mobile traffic growth»

Tools Row (Tag/Badge):
— Variant: Filled
— Примеры: Figma, React, Node.js, PostgreSQL, Stripe

Mobile: Showcase → горизонтальный скролл; Results → 2 колонки; Tools → wrap

Маппинг из case-template:
• Final Design Description → Description
• Showcase Images → Showcase Image frames
• Hi-Fi Prototype Link → Link Button
• Measurable Results → Results cards
• Tools & Technologies → Tag/Badge row

────────────────────────────────────────

Section 06 — Reflection (ID: 199:104)

Layout: Vertical Auto Layout, gap 32px

BlockLabel:    «06» / «Reflection»
H2:            «What I learned.»
Subtitle:      Ключевая мысль
Description:   Главный вывод
Label:         «Next steps»
Steps List:    3× строка с Dot + текст

Steps List:
— Dot (компонент-маркер): круг 6 × 6, fill Schemes/Primary
— Текст шага: material-theme/body/medium, цвет Schemes/On Surface
— Gap между Dot и текстом: 14px
— Gap между строками: внутри Vertical Auto Layout

Примеры:
• «Accessibility audit with screen reader users (WCAG 2.1 AA)»
• «A/B test 2-step vs 1-page scroll on mobile»
• «Localisation design for 3 additional markets»

⚠️ Testimonial Block на текущей странице не используется. Поле Client Testimonial из case-template зарезервировано для будущей версии.

Маппинг из case-template:
• Key Takeaway → Description
• Next Steps → Steps List (Dot + текст)

══════════════════════════════════════════════════════════

6. Next Project Showcase (ID: 198:1336)

Размер:    1200 × 660
Layout:    Vertical Auto Layout, gap 48px
Padding:   80 / 64 / 80 / 64

Элементы:
1. Line — горизонтальный разделитель, высота 1px, fill Schemes/Outline Variant, ширина 1072px
2. CTA Content (ID: 198:1338) — Vertical, gap 24px:
   — H2: «Want to see similar results for your product?», material-theme/headline/medium
   — Subtitle: material-theme/body/large, цвет Schemes/On Surface Variant
3. Button / Primary (ID: 32:39) — «Start a project», State=Enabled, Size=Large
4. Next Project Card (ID: 198:1342) — Vertical, gap 24px, padding 40px, radius 20px, фон Schemes/Surface Container Low:
   — BlockLabel next: «UP NEXT» / «next case» + chevron-right
   — H3: название следующего кейса, material-theme/title/large
   — Subtitle: краткое описание, material-theme/body/medium, цвет Schemes/On Surface Variant

══════════════════════════════════════════════════════════

7. Полный маппинг данных: case-template → Portfolio Case

Секция case-template     | Поле                    | Компонент на Portfolio Case
─────────────────────────┼─────────────────────────┼─────────────────────────────
01 Intro & Meta          | Case Title              | Hero → H1
                         | Tagline / Teaser        | Hero → Subtitle
                         | Client Name             | Metadata Grid → Client
                         | Year + Duration         | Metadata Grid → Timeline
                         | My Role                 | Metadata Grid → My Role
                         | Devices                 | Metadata Grid → Devices
                         | Category                | Hero → Tag/Badge
                         | Hero Image URL          | Hero → Container (image fill)
                         | Lo-Fi Prototype Link    | Section 03 → Link Button
                         | Hi-Fi Prototype Link    | Section 05 → Link Button
02 Problem & Audience    | Business Problem        | Section 01 → Description
                         | Goal                    | Section 01 → Portfolio card «Goal»
                         | Target Audience         | Section 01 → Portfolio card «Target users»
03 User Research         | Research Methodology    | Section 02 → Description
                         | Key Metrics (×3)        | Section 02 → Card/Metric (×3)
                         | Persona                 | Section 02 → Persona Card
04 Design Process        | Design Approach         | Section 03 → Description
                         | Wireframe Images        | Section 03 → Wireframes Grid
05 Testing & Iteration   | Testing Results         | Section 04 → Description
                         | Before/After            | Section 04 → Before/After blocks
06 Final Showcase        | Final Design Desc.      | Section 05 → Description
                         | Showcase Images         | Section 05 → Showcase Image frames
                         | Measurable Results      | Section 05 → Results cards
                         | Tools & Technologies    | Section 05 → Tag/Badge row
07 Reflection            | Key Takeaway            | Section 06 → Description
                         | Next Steps              | Section 06 → Steps List
                         | Client Testimonial      | ⚠️ Зарезервировано, не используется

══════════════════════════════════════════════════════════

8. Компоненты из дизайн-системы

Компонент             | ID в Figma  | Использование             | Кол-во
──────────────────────┼─────────────┼───────────────────────────┼───────
BlockLabel            | —           | Номер + название секции   | ×6 + ×1 (Next)
Card/Metric           | 169:405     | Метрики в Section 02      | ×3
Persona Card          | 176:372     | Персона в Section 02      | ×1
Before/After          | 176:365     | Сравнение в Section 04    | ×4
Tag/Badge (Filled)    | —           | Технологии в Section 05   | ×5
Results Card          | —           | Результаты в Section 05   | ×4
Portfolio Card        | —           | Цель/ЦА в Section 01      | ×2
Link Button           | —           | Ссылки на прототипы       | ×2
Button/Primary        | 32:39       | CTA кнопка                | ×1
Dot                   | —           | Маркер Next Steps         | ×3
chevron-right         | —           | Иконка в ссылках          | ×3
Breadcrumb Navigation | —           | Верхняя навигация         | ×1

══════════════════════════════════════════════════════════

9. Адаптивность

Брейкпоинт       | Поведение
─────────────────┼─────────────────────────────────────────────────
Desktop 1440px   | Все блоки в полной сетке; Metadata 4 в ряд;
                 | Metrics 3 в ряд; Wireframes 2×2
Tablet 768px     | Metadata 2×2; Metrics 3 в ряд (уже);
                 | Wireframes → горизонтальный скролл
Mobile 375px     | Все → 1 колонка; Metadata 2×2; Metrics stack;
                 | Wireframes и Showcase → скролл с snap;
                 | Before/After → stack vertical

══════════════════════════════════════════════════════════

10. Темизация

Режим  | Background             | Text                     | Surface Low
───────┼────────────────────────┼──────────────────────────┼──────────────────────
Light  | Schemes/Background     | Schemes/On Surface       | Schemes/Surface
       | (#FCF8FA)              | (#1B1B1D)                | Container Low (#F6F3F4)
Dark   | Schemes/Background     | Schemes/On Surface       | Schemes/Surface
       | (#131314)              | (#E4E2E3)                | Container Low (#1B1B1D)

Все цвета через токены material-theme. HEX-хардкод запрещён.

══════════════════════════════════════════════════════════

11. Заметки для ИИ-агента

1. Breadcrumb Row сейчас пустой в Figma — первый шаг при сборке страницы.
2. Hero использует абсолютное позиционирование Title поверх Container с изображением — не Auto Layout для этого наложения.
3. Все секции строятся по паттерну: BlockLabel → Header → Content. Не нарушать порядок.
4. Section 05 самая объёмная — 3 showcase-изображения + Results + Tools. Собирать последней среди секций.
5. Testimonial Block не включать — зарезервирован, данные из case-template для него игнорировать.
6. Dot-компонент для Next Steps — круг 6×6, fill Schemes/Primary. Если нет в библиотеке — создать как мастер-компонент.
7. Все иконки (arrow-left, chevron-right) — только инстансы из библиотеки иконок, не векторы.
8. Перед сборкой проверить наличие всех компонентов из таблицы раздела 8 в библиотеке.
9. Meta card labels: Inter Medium 13px, letterSpacing 0.5px (не overline стиль).
10. Results cards: Horizontal layout, padding 18px, radius 14px.