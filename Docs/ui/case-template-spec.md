Case Template — Form: Финальная спецификация
Обновлено: 2026-08-04
Связанные документы: design-system-ux42.md, case-template-spec.md, figma-master-components-spec.md
Page ID: 51:6

══════════════════════════════════════════════════════════

1. Общие параметры

Фрейм:              Case Template — Form (ID: 178:338)
Размер:              1440 × 9354
Layout:              Vertical Auto Layout, gap 24px
Padding:             32 / 0 / 80 / 0 (top/right/bottom/left)
Counter-axis:        CENTER (центрирование контейнера)
Тип:                 CMS-подобная форма для создания/редактирования кейса портфолио

Form Container:      ID: 178:339, 850 × auto
Layout контейнера:   Vertical Auto Layout, gap 24px
Центрирование:       По горизонтали в 1440px фрейме (counterAxisAlignItems=CENTER)

══════════════════════════════════════════════════════════

2. Структура верхнего уровня

Case Template — Form (1440 × 9354) [178:338]
└── Form Container (850 × auto) [178:339] VERTICAL gap=24
    ├── Header Bar [178:340]              — Breadcrumb/Header Bar (instance), 850×52
    ├── URL Slug Container [177:1003]     — URL Slug Field (instance), 850×136, r=14, pad=24
    ├── Section Title                     — «Case Study Builder» (text, 20px, title/large)
    ├── Section 01 — Intro & Meta         — 850×1333, r=14
    ├── Section 02 — Problem & Audience   — 850×805, r=14
    ├── Section 03 — User Research        — 850×1481, r=14
    ├── Section 04 — Design System        — 850×1765, r=14
    ├── Section 05 — Design Process       — 850×509, r=14
    ├── Section 06 — Testing & Iteration  — 850×1103, r=14
    ├── Section 07 — Final Showcase       — 850×909, r=14
    ├── Section 08 — Reflection & Next Steps — 850×805, r=14
    └── Save Case Study [178:437]         — Save Button (instance), 224×52

══════════════════════════════════════════════════════════

3. Header Bar (ID: 178:340)

Компонент: Breadcrumb/Header Bar (instance)
Размер: 850 × 52
Layout: Horizontal, space-between

Левая часть — Breadcrumb Navigation (instance):
  • «Portfolio» → «/» → «Cases» → «/» → «New Case» (текущая)

Правая часть — Save Button (instance, State=Default):
  • Текст: «Save Case Study»
  • Размер: ~196 × 52, padding 14/32, radius по компоненту

══════════════════════════════════════════════════════════

4. URL Slug Container (ID: 177:1003)

Контейнер: 850 × 136, padding 24px all, radius 14 (lg)
Layout: Vertical Auto Layout
Fill: Surface Container (variable-bound)
Содержимое: URL Slug Field (instance, ID: 178:349, State=Default)
Размер поля: 802 × 88

Элементы:
  • Label: «URL Slug» + «*» (обязательное)
  • Slug Container: префикс «ux42.studio/[username]/» + input «my-project-name»
  • Hint: «Auto-generated from title, editable»

══════════════════════════════════════════════════════════

5. Паттерн секции (Accordion)

Все 8 секций — детачнутые аккордеоны с единой структурой:
Ширина: 850px
Layout: Vertical Auto Layout
Radius: 14 (lg)
Fill: Surface Container (variable-bound)

Section Header (850 × 72, Horizontal, space-between, pad=0/24/0/24):
  • Left Content (Horizontal, gap 14):
    — Badge/Number (instance): кружок 28×28, текст 11px Inter Semi Bold
       Стиль: material-theme/label/small
    — Titles Column (Vertical):
       • Section Title: 16px Inter Medium, style material-theme/title/medium
       • Section Subtitle: 11px Inter Semi Bold, style material-theme/label/small
  • Right Content:
    — chevron-up (раскрыто) или chevron-down (свёрнуто), 24×24

Section Body (850 × auto, Vertical, gap=20, pad=0/24/24/24):
  • Divider (802 × 1)
  • Content Slot (802 × auto, Vertical, gap 16) — поля формы

Описания секций (Section Subtitle):
  01: «Basic project info and hero image»
  02: «Define the problem and target audience»
  03: «Research methods, metrics, and persona»
  04: «Moodboard, colors, and typography»
  05: «Architecture decisions and wireframes»
  06: «Testing process and before/after comparisons»
  07: «Final designs, results, and tools»
  08: «Reflections, next steps, and testimonials»

══════════════════════════════════════════════════════════

СЕКЦИЯ 01: Intro & Meta (ID: 178:447)
Описание: «Basic project info and hero image»
Высота: 1333px (раскрыта)

Поля (порядок сверху вниз):

 1. Project Title * (Form/Input)
    Hint: «Main title of your case study»

 2. Teaser / Subtitle (Form/Input)

 3. Row: Category + Devices (Horizontal, gap 16):
    — Category * (Form/Select)
    — Devices (Form/Input)

 4. Client / Context (Form/Input)

 5. Row: Year + Duration (Horizontal, gap 16):
    — Year (Form/Input)
    — Duration (Form/Input)

 6. Row: My Role + Constraints (Horizontal, gap 16):
    — My Role * (Form/Input)
    — Constraints (Form/Input)

 7. Tags (Form/Input)
    Hint: «Comma-separated»

 8. Hero Image URL (Form/Input)
    Hint: «Aspect ratio 16:9, min 1200px wide»

 9. Image Upload Zone (instance)
    Label: «Drag & drop image or click to browse»
    Hint: «PNG, JPG up to 10MB»

10. Hi-Fi Figma Prototype (Form/Input)

11. Protopie / Web Prototype (Form/Input)

────────────────────────────────────────

СЕКЦИЯ 02: Problem & Audience (ID: 178:462)
Описание: «Define the problem and target audience»
Высота: 805px

Поля:

 1. Gallery Description * (Form/Textarea)
    Placeholder: «1–2 sentences for portfolio gallery preview»

 2. Problem Statement * (Form/Textarea)
    Placeholder: «Describe the specific user pain point»

 3. Project Goal * (Form/Textarea)
    Placeholder: «Measurable goal — what changes and by how much»

 4. Target Users * (Form/Textarea)
    Placeholder: «Age, context, key behavior patterns»

────────────────────────────────────────

СЕКЦИЯ 03: User Research (ID: 178:477)
Описание: «Research methods, metrics, and persona»
Высота: 1481px

Блоки:

 1. Research Methodology * (Form/Textarea)
    Placeholder: «Methods, participants count, key findings»

 2. Key Metrics (Row, Horizontal, 3 столбца ~257px each):
    Каждый столбец (Vertical):
    — Metric Value (Form/Input)
    — Description (Form/Input)

 3. Persona Card (instance, ID: 176:372)
    Label: «Persona's card preview»

 4. Persona Avatar:
    — Label: «Browse image of the Persona» + «*»
    — Image Upload Zone (instance)

 5. Persona Name & Age * (Form/Input)

 6. Persona Bio * (Form/Input)

 7. Pain Points * (Form/Input)

 8. User Story (Form/Textarea)
    Placeholder: «As a [user], I want to [action], so that [outcome]»

────────────────────────────────────────

СЕКЦИЯ 04: Design System (ID: 445:797)
Описание: «Moodboard, colors, and typography»
Высота: 1765px

Блоки:

 1. Visual Direction * (Form/Textarea)
    Placeholder: «Describe the visual language, aesthetic, and design principles...»

 2. Moodboard (Frame, 802×652, VERTICAL gap=16, pad=20):
    — «Moodboard Images preview» (label text)
    — Moodboard Controls (Horizontal, gap 16):
       • CMS / Moodboard Toolbar (instance, 526×48) — управление сеткой
       • Divider (1×24)
       • «Ratio» (label) + 3× Grid Ratio Toggle (instance)
    — CMS / Moodboard Grid (instance, 760×274) — превью сетки
    — «Moodboard Images» (label text)
    — Image Upload Zone (instance, 760×176)

 3. Color Palette:
    — «Color Palette» (label text)
    — Scheme Labels: «Dark Scheme» + Radio buttons (instance, 48×48)
    — Light Scheme (Frame, 802×258, VERTICAL gap=16, pad=20):
       • Row 1 (Horizontal, gap 16): Primary Color * + Secondary Color * + Background Color * (3× Form/Input)
       • Row 2 (Horizontal, gap 16): on Primary Color * + on Secondary Color * + on Background Color * (3× Form/Input)
       • + Add image (Add Button instance)
    — Dark Scheme (Frame, 802×258, VERTICAL gap=16, pad=20):
       • Row 1 (Horizontal, gap 16): Primary Color Dark * + Secondary Color Dark * + Background Color Dark * (3× Form/Input)
       • Row 2 (Horizontal, gap 16): on Primary Color Dark * + on Secondary Color Dark * + on Background Color Dark * (3× Form/Input)
       • + Add image (Add Button instance)

 4. Typography:
    — «Typography» (label text)
    — Row (Horizontal, gap 16):
       • Display / Heading Font * (Form/Input)
       • Body / Text Font * (Form/Input)

────────────────────────────────────────

СЕКЦИЯ 05: Design Process (ID: 178:492)
Описание: «Architecture decisions and wireframes»
Высота: 509px

Поля:

 1. Design Approach * (Form/Textarea)
    Placeholder: «Architecture decisions, Mobile First principles, key patterns»

 2. «Wireframe Images» (label text)

 3. Image Upload Zone (instance)
    Label: «Drag & drop image or click to browse»
    Hint: «PNG, JPG up to 10MB»

────────────────────────────────────────

СЕКЦИЯ 06: Testing & Iteration (ID: 178:507)
Описание: «Testing process and before/after comparisons»
Высота: 1103px

Блоки:

 1. Testing Process & Findings * (Form/Textarea)
    Placeholder: «Participants count, method, results»

 2. Solution Case (Vertical frame):
    — «Before / After Comparisons» (label text)
    — Feature / Screen Name (Form/Input)
    — Before/After images (Horizontal frame):
       • Before (frame) — image upload placeholder
       • After (frame) — image upload placeholder
    — Before — Problem (Form/Textarea): «What was wrong with the original design»
    — After — Solution (Form/Textarea): «How the design was improved»

 3. + Add comparison (Add Button instance)

────────────────────────────────────────

СЕКЦИЯ 07: Final Showcase (ID: 178:522)
Описание: «Final designs, results, and tools»
Высота: 909px

Блоки:

 1. Final Design Description * (Form/Textarea)
    Placeholder: «Design system, components, key screens»

 2. «Final Design Gallery» (label text)

 3. Image Upload Zone (instance)

 4. + Add image (Add Button instance)

 5. Result (Form/Input)
    Placeholder: «Completion rate increased from 26% to 71%»

 6. + Add result (Add Button instance)

 7. Tool / Technology (Form/Input)
    Placeholder: «Figma, Protopie, React...»

 8. + Add tool (Add Button instance)

────────────────────────────────────────

СЕКЦИЯ 08: Reflection & Next Steps (ID: 178:537)
Описание: «Reflections, next steps, and testimonials»
Высота: 805px

Блоки:

 1. Key Takeaway * (Form/Textarea)
    Placeholder: «Honest reflection: what surprised you, what you'd do differently»

 2. Next Step (Form/Input)

 3. + Add step (Add Button instance)

 4. Client/Team Testimonial (Vertical frame):
    — «Client / Team Testimonial» (label text)
    — Field Label * (Form/Textarea): «Enter detailed description...»
       Hint: «Helper text»
    — Row: Name + Role (Horizontal, gap 16):
       • Author Name (Form/Input)
       • Role & Company (Form/Input)

══════════════════════════════════════════════════════════

6. Save Case Study (ID: 178:437)

Компонент: Save Button (instance, State=Default)
Размер: 224 × 52
Текст: «Save Case Study»
Padding: 14 / 32
Radius: по компоненту (14 lg)
Расположение: внизу Form Container, полная ширина не занимает (counter-axis MIN)

══════════════════════════════════════════════════════════

7. Реестр компонентов

Компонент              | Master ID | Использование              | Кол-во
───────────────────────┼───────────┼────────────────────────────┼──────
Form/Input             | 160:332   | Однострочные поля          | ×41
Form/Textarea          | 160:357   | Многострочные поля         | ×14
Moodboard Cell         | —         | Ячейки мудборда            | ×9
Badge/Number           | 161:366   | Номер секции (в header)    | ×8
chevron-down           | —         | Аккордеон toggle           | ×8
Image Upload Zone      | 176:353   | Загрузка изображений       | ×7
Add Button             | 169:388   | Кнопка «+ Add»            | ×7
Grid Column Toggle     | —         | Переключение колонок       | ×3
Grid Gap Toggle        | —         | Переключение gap           | ×3
Grid Ratio Toggle      | —         | Переключение соотношения   | ×3
Save Button            | 169:400   | Кнопка сохранения          | ×2
Breadcrumb/Header Bar  | 176:329   | Навигация + Save           | ×1
URL Slug Field         | 169:372   | Поле URL                   | ×1
Form/Select            | 160:367   | Выпадающий список          | ×1
Persona Card           | 176:372   | Превью персоны             | ×1
CMS / Moodboard Toolbar| —        | Панель управления сеткой   | ×1
CMS / Moodboard Grid   | —        | Сетка мудборда             | ×1
Radio buttons          | —         | Переключатель схемы        | ×1
chevron-up             | —         | Аккордеон toggle (раскр.)  | ×1
Breadcrumb Navigation  | 161:392   | Хлебные крошки (внутри)    | ×1

Всего инстансов: ~120

══════════════════════════════════════════════════════════

8. Маппинг токенов цвета

Элемент                         | Переменная (material-theme)
────────────────────────────────┼────────────────────────────
Фон секций, URL Slug Container  | Surface Container
Текст заголовков, labels         | On Surface
Текст placeholder / hint        | On Surface Variant
Иконки chevron, upload           | On Surface Variant
Badge/Number fill               | Primary
Badge/Number text               | On Primary
Save Button fill                | Primary
Save Button text                | On Primary
Divider                         | Outline Variant
Add Button border               | Outline
Form/Input border               | Outline
Hero Upload dashed border       | Outline

══════════════════════════════════════════════════════════

9. Маппинг: Case Template → Portfolio Case

Поле в форме                    | Компонент на Portfolio Case
────────────────────────────────┼────────────────────────────
Project Title                   | Hero → H1
Teaser / Subtitle               | Hero → Subtitle
Category                        | Hero → Category Tag
Client / Context                | Metadata Grid → Client
Year + Duration                 | Metadata Grid → Timeline
My Role                         | Metadata Grid → My Role
Devices                         | Metadata Grid → Devices
Hero Image URL / Upload         | Hero → Container (image fill)
Hi-Fi Figma Prototype           | Section 05 → Link Button
Gallery Description             | Карточка в галерее на главной
Problem Statement               | Section 01 → Description
Project Goal                    | Section 01 → Card «Goal»
Target Users                    | Section 01 → Card «Target users»
Research Methodology            | Section 02 → Description
Key Metrics (×3)                | Section 02 → Card/Metric (×3)
Persona + fields                | Section 02 → Persona Card
Visual Direction                | Section 03 → Description
Moodboard images                | Section 03 → Moodboard Grid
Color Palette (light/dark)      | Section 03 → Color tokens
Typography                      | Section 03 → Typography
Design Approach                 | Section 04 → Description
Wireframe Upload                | Section 04 → Wireframes Grid
Testing Process                 | Section 05 → Description
Before/After blocks             | Section 05 → Before/After comparison
Final Design Description        | Section 06 → Description
Final Design Gallery            | Section 06 → Showcase Images
Result Items                    | Section 06 → Results cards
Tool Items                      | Section 06 → Tag/Badge row
Key Takeaway                    | Section 07 → Description
Next Steps                      | Section 07 → Steps List
Testimonial                     | Зарезервировано (не используется)

══════════════════════════════════════════════════════════

10. Справочник текстовых стилей

Стиль                           | Размер  | Шрифт           | Применение
────────────────────────────────┼─────────┼─────────────────┼────────────────────
material-theme/title/large      | 20px    | Inter Medium    | Section Title «Case Study Builder»
material-theme/title/medium     | 16px    | Inter Medium    | Section Header titles
material-theme/label/small      | 11px    | Inter Semi Bold | Badge numbers, Section Subtitles
material-theme/label/medium     | 13px    | Inter Medium    | Form labels, button text
material-theme/body/medium      | 13px    | Inter Regular   | Placeholder text, hints
material-theme/body/small       | 11px    | Inter Regular   | Helper text, hints
material-theme/label/large      | 15px    | Inter Medium    | Breadcrumb items, URL prefix

Покрытие: 268/277 текстов стилизовано (97%)

══════════════════════════════════════════════════════════

11. Итоги аудита (2026-08-04)

Метрика                    | Значение
───────────────────────────┼──────────────
Текстов со стилями         | 268/277 (97%)
Fills с переменными        | 495/684 (72%)
Default-имена фреймов      | 0
Trailing/leading пробелы   | 0
Количество секций          | 8
Полей формы                | 56 (41 Input + 14 Textarea + 1 Select)
Инстансов компонентов      | ~120

Исправления (выполнены):
  • 7 Section Subtitle → заменены placeholder на описательные тексты
  • Badge/Number master component → привязан стиль material-theme/label/small
  • 4 текста с trailing/leading пробелами → очищены
  • 3 fills без переменных → привязаны к On Surface, Primary, On Surface Variant
  • 2 default-имени фреймов → переименованы (Row: Primary + Secondary, Row: Display + Body Font)

Известные допущения:
  • «Drop form fields here» (Slot Hint) — скрытые placeholder-тексты, by design
  • 9 unstyled текстов (3%) — внутренние placeholder/hint тексты инстансов

══════════════════════════════════════════════════════════

12. Node ID Quick Reference

Элемент                         | Node ID
────────────────────────────────┼─────────
Case Template — Form            | 178:338
Form Container                  | 178:339
Header Bar                      | 178:340
URL Slug Container              | 177:1003
URL Slug Field                  | 178:349
Section 01 — Intro & Meta       | 178:447
Section 02 — Problem & Audience | 178:462
Section 03 — User Research      | 178:477
Section 04 — Design System      | 445:797
Section 05 — Design Process     | 178:492
Section 06 — Testing & Iteration| 178:507
Section 07 — Final Showcase     | 178:522
Section 08 — Reflection & Next  | 178:537
Save Button (bottom)            | 178:437
Persona Card                    | 176:372
CMS / Moodboard Grid            | 446:2075
CMS / Moodboard Toolbar         | 458:586

══════════════════════════════════════════════════════════
Конец спецификации