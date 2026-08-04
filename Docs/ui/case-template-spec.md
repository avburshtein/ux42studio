Страница: Case Template — Финальная спецификация
Обновлено: 2026-07-24
Связанные документы: design-system-ux42.md, Portfolio_Case_spec.md, figma-master-components-spec.md
Page ID в Figma: 51:6

══════════════════════════════════════════════════════════

1. Общие параметры

Фрейм:              Case Template — Form (ID: 178:338)
Размер:              1440 × 7497
Layout:              Vertical Auto Layout, gap 24px
Padding:             32 / 0 / 80 / 0
Тип:                 CMS-подобная форма для создания/редактирования кейса портфолио

Form Container:      850 × 7385 (ID: 178:339)
Layout контейнера:   Vertical Auto Layout, gap 24px
Центрирование:       По горизонтали в 1440px фрейме

══════════════════════════════════════════════════════════

2. Структура верхнего уровня

Case Template — Form (1440 × 7497)
└── Form Container (850 × 7385) [VERTICAL, gap 24]
    ├── Header Bar                        — Breadcrumb/Header Bar (instance)
    ├── URL Slug Container                — URL Slug Field (instance)
    ├── Section Title                     — «Case Study Builder» (текст)
    ├── Section 01 — Intro & Meta         — 13 полей + Image Upload
    ├── Section 02 — Problem & Audience   — 4 textarea
    ├── Section 03 — User Research        — методология + метрики + персона
    ├── Section 04 — Design Process       — textarea + image upload
    ├── Section 05 — Testing & Iteration  — тестирование + before/after
    ├── Section 06 — Final Showcase       — галерея + результаты + инструменты
    ├── Section 07 — Reflection & Next Steps — вывод + шаги + отзыв
    └── Save Case Study                   — Save Button (instance)

══════════════════════════════════════════════════════════

3. Header Bar (ID: 178:340)

Компонент: Breadcrumb/Header Bar (instance)
Размер: 850 × 56
Layout: Horizontal, space-between

Левая часть — Breadcrumb Navigation (instance):
  • «Portfolio» → «/» → «Cases» → «/» → «New Case» (текущая)

Правая часть — Save Button (instance, State=Default):
  • Текст: «Save Case Study»
  • Размер: 196 × 52, padding 14/32, radius по компоненту

══════════════════════════════════════════════════════════

4. URL Slug Container (ID: 177:1003)

Контейнер: 850 × 136, padding 24px, radius 20px
Содержимое: URL Slug Field (instance, ID: 178:349, State=Default)
Размер поля: 802 × 88

Элементы:
  • Label: «URL Slug» + «*» (обязательное)
  • Slug Container: префикс «ux42.studio/[username]/» + input «my-project-name»
  • Hint: «Auto-generated from title, editable»

══════════════════════════════════════════════════════════

5. Паттерн секции (Accordion)

Каждая из 7 секций — детачнутый аккордеон с единой структурой:
Размер: 850px wide
Layout: Vertical Auto Layout

Section Header (850 × 72, Horizontal, space-between):
  • Left Content (Horizontal, gap 14):
    — Badge/Number (кружок с номером: «01», «02»...)
    — Section Title (Semi Bold 15px)
    — Section Subtitle (Regular 11px, серый)
  • Right Content:
    — chevron-up (раскрыто) или chevron-down (свёрнуто)

⚠️ Все Section Subtitle содержат placeholder «Brief description of the section» — заменить на описательные тексты.

Section Body (850 × auto, Vertical, gap 20):
  • Divider (802 × 1)
  • Content Slot (802 × auto, Vertical, gap 16) — поля формы

══════════════════════════════════════════════════════════

СЕКЦИЯ 01: Intro & Meta (ID: 178:447)
Описание: «Мгновенно ввести посетителя в курс дела»
Высота: 1333px (раскрыта)

⚠️ Содержит «Slot Hint» текст «Drop form fields here» — удалить.

Поля (порядок сверху вниз):

 1. Project Title * (Form/Input)
    Placeholder: «Flow — mobile time management app»
    Hint: «Main title of your case study»

 2. Teaser / Subtitle (Form/Input)
    Placeholder: «One sentence that hooks the visitor»

 3. Row: Category + Devices (Horizontal):
    — Category * (Form/Select): «Select category...»
    — Devices (Form/Input): «iOS & Android»

 4. Client / Context (Form/Input)
    Placeholder: «Client Name / Student Project»

 5. Row: Year + Duration (Horizontal):
    — Year (Form/Input): «2026»
    — Duration (Form/Input): «4 weeks»

 6. Row: Role + Constraints (Horizontal):
    — My Role * (Form/Input): «End-to-End UX Designer»
    — Constraints (Form/Input): «Solo designer, 4-week sprint»

 7. Tags (Form/Input)
    Placeholder: «UX Research, Figma, Mobile»
    Hint: «Comma-separated»

 8. Hero Image URL (Form/Input)
    Placeholder: «https://...»
    Hint: «Aspect ratio 16:9, min 1200px wide»

 9. Image Upload Zone (instance)
    Label: «Drag & drop image or click to browse»
    Hint: «PNG, JPG up to 10MB»

10. Hi-Fi Figma Prototype (Form/Input)
    Placeholder: «https://figma.com/proto/...»

11. Protopie / Web Prototype (Form/Input)
    Placeholder: «https://...»

────────────────────────────────────────

СЕКЦИЯ 02: Problem & Audience (ID: 178:462)
Описание: «Проявить эмпатию и доказать, что проблема реальна»
Высота: 805px

⚠️ Содержит «Slot Hint» текст «Drop form fields here» — удалить.

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
Описание: «Решения основаны на данных, не интуиции»
Высота: 1481px

⚠️ Содержит «Slot Hint» текст «Drop form fields here» — удалить.

Блоки:

 1. Research Methodology * (Form/Textarea)
    Placeholder: «Methods, participants count, key findings»

 2. Key Metrics (Row, Horizontal, 3 столбца):
    Каждый столбец (Vertical, ~257px wide):
    — Metric Value (Form/Input): e.g. «85%»
    — Description (Form/Input): e.g. «Task completion rate»

    Значения по умолчанию:
    • Metric 1: «85%» / «Task completion rate»
    • Metric 2: «4.2s» / «Average time on task»
    • Metric 3: «92%» / «User satisfaction score»

 3. Persona Card (instance, ID: 176:372):
    — Preview label: «Persona's card preview»

 4. Persona Avatar:
    — Label: «Browse image of the Persona» + «*»
    — Image Upload Zone (instance)

 5. Persona Name & Age * (Form/Input)
    Placeholder: «Maria, 32»

 6. Persona Bio * (Form/Input)
    Placeholder: «Context, job, behavior»

 7. Pain Points * (Form/Input)
    Placeholder: «Key frustrations and challenges»

 8. User Story (Form/Textarea)
    Placeholder: «As a [user], I want to [action], so that [outcome]»

────────────────────────────────────────

СЕКЦИЯ 04: Design Process (ID: 178:492)
Описание: «Показать кухню дизайна и эволюцию мысли»
Высота: 509px

Поля:

 1. Design Approach * (Form/Textarea)
    Placeholder: «Architecture decisions, Mobile First principles, key patterns»

 2. «Wireframe Images» (label text)

 3. Wireframe Upload (Image Upload Zone instance)
    Label: «Drag & drop image or click to browse»
    Hint: «PNG, JPG up to 10MB»

────────────────────────────────────────

СЕКЦИЯ 05: Testing & Iteration (ID: 178:507)
Описание: «Показать умение итерировать по фидбеку»
Высота: 1103px

Блоки:

 1. Testing Process & Findings * (Form/Textarea)
    Placeholder: «Participants count, method, results»

 2. Solution Case (Vertical frame):
    — «Before / After Comparisons» (label text)
    — Feature / Screen Name (Form/Input): «Login Screen»
    — Before/After images (Horizontal frame):
      • Before (frame) — image upload placeholder
      • After (frame) — image upload placeholder
    — Before — Problem (Form/Textarea): «What was wrong with the original design»
    — After — Solution (Form/Textarea): «How the design was improved»

 3. + Add comparison (Add Button instance)
    Label: «Add Item»

────────────────────────────────────────

СЕКЦИЯ 06: Final Showcase (ID: 178:522)
Описание: «Вау-эффект: красивые мокапы и результаты»
Высота: 909px

Блоки:

 1. Final Design Description * (Form/Textarea)
    Placeholder: «Design system, components, key screens»

 2. «Final Design Gallery» (label text)

 3. Final Design Upload (Image Upload Zone instance)

 4. + Add image (Add Button instance)

 5. Result Item (Form/Input)
    Placeholder: «Completion rate increased from 26% to 71%»

 6. + Add result (Add Button instance)

 7. Tool Item (Form/Input)
    Placeholder: «Figma, Protopie, React...»

 8. + Add tool (Add Button instance)

────────────────────────────────────────

СЕКЦИЯ 07: Reflection & Next Steps (ID: 178:537)
Описание: «Профессиональная зрелость и выводы»
Высота: 733px

Блоки:

 1. Key Takeaway * (Form/Textarea)
    Placeholder: «Honest reflection: what surprised you, what you'd do differently»

 2. Next Step (Form/Input)
    Placeholder: «Plan for further development»

 3. + Add step (Add Button instance)

 4. Client/Team Testimonial quote card (Vertical frame):
    — «Client / Team Testimonial» (label text)
    — Quote Text (Form/Input): «Client feedback about working with you»
    — Row: Name + Role (Horizontal):
      • Author Name (Form/Input): «First & Last Name»
      • Author Role (Form/Input): «CEO at Company»

══════════════════════════════════════════════════════════

6. Save Case Study (ID: 178:437)

Компонент: Save Button (instance, State=Default)
Размер: 196 × 52
Текст: «Save Case Study»
Padding: 14 / 32
Расположение: внизу Form Container

══════════════════════════════════════════════════════════

7. Используемые компоненты

Компонент              | ID        | Использование              | Кол-во
───────────────────────┼───────────┼────────────────────────────┼──────
Breadcrumb/Header Bar  | 176:329   | Навигация + Save           | ×1
Breadcrumb Navigation  | 161:392   | Хлебные крошки (внутри)    | ×1
Save Button            | 169:400   | Кнопка сохранения          | ×2
URL Slug Field         | 169:372   | Поле URL                   | ×1
Form/Input             | 160:332   | Однострочные поля          | ×24
Form/Textarea          | 160:357   | Многострочные поля         | ×9
Form/Select            | 160:367   | Выпадающий список          | ×1
Image Upload Zone      | 176:353   | Загрузка изображений       | ×4
Add Button             | 169:388   | Кнопка «+ Add»             | ×4
Persona Card           | 176:372   | Превью персоны             | ×1
Badge/Number           | 161:366   | Номер секции (в header)    | ×7
chevron-up / down      | —         | Аккордеон toggle           | ×7

══════════════════════════════════════════════════════════

8. Маппинг: Case Template → Portfolio Case

Поле в форме (case-template)       | Компонент на Portfolio Case
───────────────────────────────────┼──────────────────────────────
Project Title                      | Hero → H1
Teaser / Subtitle                  | Hero → Subtitle
Category                           | Hero → Category Icon / Tag
Client / Context                   | Metadata Grid → Client
Year + Duration                    | Metadata Grid → Timeline
My Role                            | Metadata Grid → My Role
Devices                            | Metadata Grid → Devices
Hero Image URL / Upload            | Hero → Container (image fill)
Hi-Fi Figma Prototype              | Section 05 → Link Button
Gallery Description                | (не отображается на Portfolio Case)
Problem Statement                  | Section 01 → Description
Project Goal                       | Section 01 → Portfolio card «Goal»
Target Users                       | Section 01 → Portfolio card «Target users»
Research Methodology               | Section 02 → Description
Key Metrics (×3)                   | Section 02 → Card/Metric (×3)
Persona + fields                   | Section 02 → Persona Card
Design Approach                    | Section 03 → Description
Wireframe Upload                   | Section 03 → Wireframes Grid
Testing Process & Findings         | Section 04 → Description
Before/After blocks                | Section 04 → Before/After comparison
Final Design Description           | Section 05 → Description
Final Design Gallery               | Section 05 → Showcase Images
Result Items                       | Section 05 → Results cards
Tool Items                         | Section 05 → Tag/Badge row
Key Takeaway                       | Section 06 → Description
Next Steps                         | Section 06 → Steps List
Testimonial quote card             | ⚠️ Зарезервировано (не используется)

══════════════════════════════════════════════════════════

9. Известные issues / TODO

1. «Slot Hint» placeholder тексты «Drop form fields here» остались в секциях 01, 02, 03 — удалить.
2. Section Subtitle — все 7 содержат «Brief description of the section» вместо описательных текстов.
3. Testimonial Quote использует Form/Input вместо Form/Textarea — для длинных цитат стоит заменить на Textarea.
4. Section 01 поле «Protopie / Web Prototype» в спеке называлось «Lo-Fi прототип» — фактически это дополнительная ссылка на интерактивный прототип.