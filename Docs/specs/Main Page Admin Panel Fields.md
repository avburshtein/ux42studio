MAIN PAGE — Admin Panel Fields Specification
══════════════════════════════════════════════════════════
Документ описывает все поля, которые нужно вывести в админке для заполнения контента Main Page.
Маппинг: CMS field → секция на странице.

══════════════════════════════════════════════════════════

SECTION 01: HERO
──────────────────────────────────────────
Секция-заставка с заголовком, описанием и CTA-кнопками.

Поля:

 1. Heading Line 1 (text, required)
    CMS field: hero_heading_line1
    Текущее значение: «I design for the moment»
    Тип: однострочный текст, 68px heading
    Маппинг → Hero > Heading > строка 1

 2. Heading Line 2 — Accent (text, required)
    CMS field: hero_heading_accent
    Текущее значение: «when everything just clicks»
    Тип: однострочный текст, 68px heading (акцентный стиль / gradient)
    Маппинг → Hero > Heading Accent

 3. Description (textarea, required)
    CMS field: hero_description
    Текущее значение: «A psychology degree and 10 years learning how great environments shape human decisions...»
    Тип: многострочный текст, 18px body
    Маппинг → Hero > Description

 4. CTA Button Primary — Label (text)
    CMS field: hero_cta_primary_label
    Текущее значение: «View case studies»
    Маппинг → Hero > Button Primary > Label

 5. CTA Button Primary — Link (url)
    CMS field: hero_cta_primary_url
    Маппинг → Hero > Button Primary > onClick navigate

 6. CTA Button Secondary — Label (text)
    CMS field: hero_cta_secondary_label
    Текущее значение: «Get in touch»
    Маппинг → Hero > Button Secondary > Label

 7. CTA Button Secondary — Link (url)
    CMS field: hero_cta_secondary_url
    Маппинг → Hero > Button Secondary > onClick navigate

══════════════════════════════════════════════════════════

SECTION 02: PORTFOLIO GALLERY
──────────────────────────────────────────
Секция с заголовком, фильтрами и сеткой карточек портфолио.

Поля секции:

 1. Section Title (text, required)
    CMS field: portfolio_title
    Текущее значение: «Portfolio»
    Маппинг → Section Header > H2

 2. Section Subtitle (text)
    CMS field: portfolio_subtitle
    Текущее значение: «Explore my work in web design, UX Research and digital products»
    Маппинг → Section Header > Description

 3. CTA Button Label (text)
    CMS field: portfolio_cta_label
    Текущее значение: «View All Projects»
    Маппинг → Button Primary > Label

 4. CTA Button Link (url)
    CMS field: portfolio_cta_url
    Маппинг → Button Primary > onClick navigate

────────────────────────────────

Фильтры (Filter Categories):

 CMS field: portfolio_filters (array of strings)
 Текущие значения: [«All», «Web Design», «App Design», «UX Research»]
 Компонент: Filter Button — автоматически создаётся из массива
 Логика: фильтрация карточек по полю category

────────────────────────────────

Сортировка (Sort Options):

 CMS field: portfolio_sort_mode (enum)
 Варианты:
   • «default»     — стандартная сортировка (ручной порядок)
   • «date_desc»   — по дате (новые сверху)
   • «date_asc»    — по дате (старые сверху)
   • «alpha_asc»   — по алфавиту A→Z
   • «alpha_desc»  — по алфавиту Z→A
   • «category»    — по категории/теме
   • «gradient»    — 🎨 «Моя сортировка» — по доминирующему цвету обложки

 Логика gradient-сортировки:
   Каждая карточка имеет поле dominant_color (hex).
   Алгоритм: цвета переводятся в HSL, сортируются по Hue (0→360°),
   при равном Hue — по Saturation, затем по Lightness.
   Результат: карточки выстраиваются радугой / плавным градиентом.
   CMS: dominant_color определяется автоматически из cover_image
   или задаётся вручную (color picker).

────────────────────────────────

Карточка портфолио (Portfolio Card) — Repeating item:

 CMS field: portfolio_cases (array of objects)
 Каждый объект:

  1. Project Title (text, required)
     CMS field: case.title
     Текущие примеры: «Modern E-commerce Platform», «Mobile Banking App», «Online Store Interface»
     Маппинг → Card > H4

  2. Category / Tag (text, required)
     CMS field: case.category
     Текущие примеры: «Web Design», «App Design»
     Маппинг → Card > Tag/Badge
     Связь: используется для фильтрации

  3. Cover Image (image, required)
     CMS field: case.cover_image
     Размер: 341×256px (3:2 ratio)
     Маппинг → Card > Container (image fill)

  4. Dominant Color (color, auto/manual)
     CMS field: case.dominant_color
     Формат: HEX (#RRGGBB)
     Использование: gradient-сортировка
     По умолчанию: автовычисление из cover_image

  5. Link to Case Page (url, required)
     CMS field: case.slug
     Маппинг → Card > onClick navigate → /portfolio/{slug}

  6. Sort Order — Manual (number)
     CMS field: case.sort_order
     Использование: порядок при sort_mode=«default»

  7. Published Date (date)
     CMS field: case.published_at
     Использование: сортировка по дате

══════════════════════════════════════════════════════════

SECTION 03: ABOUT
──────────────────────────────────────────
Секция о дизайнере с заголовком, описанием и блоком «My Process».

Поля:

 1. About Heading (text, required)
    CMS field: about_heading
    Текущее значение: «People-centered design begins with real curiosity»
    Маппинг → About > H2

 2. About Paragraph 1 (textarea, required)
    CMS field: about_paragraph_1
    Текущее значение: «My path to design wasn't straight. I studied psychology, then spent 10 years at a company obsessed with making spaces work for people...»
    Маппинг → About > Description paragraph 1

 3. About Paragraph 2 (textarea)
    CMS field: about_paragraph_2
    Текущее значение: «Now I bring that same attention to digital products. I design websites, mobile apps and interfaces that just make sense...»
    Маппинг → About > Description paragraph 2

 4. About Paragraph 3 (textarea)
    CMS field: about_paragraph_3
    Текущее значение: «I also work directly in code — which means I can take a design from Figma all the way to implementation...»
    Маппинг → About > Description paragraph 3

 5. Process Image (image)
    CMS field: about_process_image
    Текущий вид: Design Thinking hexagons (Empathize → Define → Ideate → Prototype → Test)
    Размер: ~516×495px
    Маппинг → About > My Process > image fill

══════════════════════════════════════════════════════════

SECTION 04: EXPERTISE
──────────────────────────────────────────
Секция с навыками, инструментами и процессом.

Поля:

 ─── Areas of Expertise (Skills) ───

 1. Section Label (text)
    CMS field: expertise_skills_label
    Текущее значение: «Areas of expertise»
    Маппинг → Expertise > Areas of expertise > label

 2. Skills Tags (array of strings, required)
    CMS field: expertise_skills
    Текущие значения: [«UX Research», «Wireframing», «Prototyping», «Figma Handoff», «Web Design», «Mobile Apps», «Landing Pages», «Psychology-led UX», «Design Engineering», «Design-to-code workflow»]
    Компонент: Tag/Badge (Variant=Text) — автогенерация из массива
    Маппинг → Tags row

 ─── Tools ───

 3. Tools Label (text)
    CMS field: expertise_tools_label
    Текущее значение: «Tools»

 4. Tools Tags (array of strings, required)
    CMS field: expertise_tools
    Текущие значения: [«Figma», «FigJam», «Maze», «Protopie», «Webflow», «Adobe Firefly», «Cursor», «VS Code», «Github»]
    Компонент: Tag/Badge (Variant=Text)
    Маппинг → Tools > Tags row

 ─── My Process ───

 5. Process Label (text)
    CMS field: expertise_process_label
    Текущее значение: «My process»

 6. Process Steps (array of strings)
    CMS field: expertise_process_steps
    Текущие значения: [«Empathize», «Define», «Ideate», «Prototype», «Test»]
    Маппинг → My Process > hexagon labels

 ─── Pro Bono Banner ───

 7. Pro Bono Text (textarea)
    CMS field: expertise_probono_text
    Текущее значение: «Open to pro bono projects for NGOs — a great way to create real impact together while building meaningful portfolio cases.»
    Маппинг → Pro Bono Banner > description

 8. Pro Bono CTA Label (text)
    CMS field: expertise_probono_cta_label
    Текущее значение: «Get in touch»
    Маппинг → Pro Bono Banner > button label

 9. Pro Bono CTA Link (url)
    CMS field: expertise_probono_cta_url
    Маппинг → Pro Bono Banner > button onClick

══════════════════════════════════════════════════════════

SECTION 05: CTA (Get in Touch)
──────────────────────────────────────────
Секция с призывом к действию и кнопками связи.

Поля:

 1. CTA Heading (text, required)
    CMS field: cta_heading
    Текущее значение: «Get in touch»
    Маппинг → CTA > H2

 2. CTA Description 1 (text)
    CMS field: cta_description_1
    Текущее значение: «We answer emails fast. We're also on WhatsApp if you prefer to talk directly.»
    Маппинг → CTA > Description line 1

 3. CTA Description 2 (text)
    CMS field: cta_description_2
    Текущее значение: «Pro bono spots available for NGOs and social-impact projects.»
    Маппинг → CTA > Description line 2

 4. Email Button Label (text)
    CMS field: cta_email_label
    Текущее значение: «Send an email»
    Маппинг → Button Primary > Label

 5. Email Address (email)
    CMS field: cta_email_address
    Маппинг → Button Primary > mailto link

 6. WhatsApp Button Label (text)
    CMS field: cta_whatsapp_label
    Текущее значение: «WhatsApp»
    Маппинг → Button Ghost > Label

 7. WhatsApp Link (url)
    CMS field: cta_whatsapp_url
    Маппинг → Button Ghost > onClick open

══════════════════════════════════════════════════════════

GLOBAL / HEADER / FOOTER (сквозные элементы)
──────────────────────────────────────────

 ─── Header ───

 1. Logo (component instance)
    CMS field: site_logo
    Маппинг → Header > logo instance

 2. Nav Links (array of {label, url})
    CMS field: nav_links
    Текущие: [{«Projects», «/portfolio»}, {«About», «/about»}, {«Services», «/services»}, {«Contact», «/contact»}]
    Маппинг → Header > Nav Link instances

 3. Theme Default (enum: Light/Dark)
    CMS field: theme_default
    Маппинг → Switcher/Toggle > Mode Button

 ─── Footer Desktop ───

 4. Services Links (array of {label, url})
    CMS field: footer_services_links
    Текущие: [«Start & Go», «Business Growth», «Startup MVP», «Contact us», «Our work»]

 5. Company Links (array of {label, url})
    CMS field: footer_company_links
    Текущие: [«About us», «Portfolio», «Pricing», «Case studies»]

 6. Social Media Links (array of {platform, url})
    CMS field: footer_social_links
    Текущие: [«Instagram», «LinkedIn»]
    Компонент: Social Icons

 7. Legal Links (array of {label, url})
    CMS field: footer_legal_links
    Текущие: [«Privacy Policy», «Terms of Service», «Cookies Settings»]

 8. Copyright Text (text)
    CMS field: footer_copyright
    Текущее значение: «© 2025 Alicante Boutique Digital Agency.»

══════════════════════════════════════════════════════════

SUMMARY: Общее количество полей
──────────────────────────────────────────

 Hero:                7 полей
 Portfolio Gallery:   4 поля секции + 7 полей × карточка + фильтры + сортировка
 About:               5 полей
 Expertise:           9 полей
 CTA:                 7 полей
 Header:              3 поля
 Footer:              5 полей

 Итого уникальных CMS fields: ~40+ (без учёта repeating items)

══════════════════════════════════════════════════════════

GRADIENT SORT — Алгоритм «Моя сортировка»
──────────────────────────────────────────

Концепция: Карточки портфолио выстраиваются по цвету обложки,
создавая визуальный градиент / радугу в сетке.

Реализация:

 1. Каждая карточка хранит dominant_color (HEX)
 2. При загрузке cover_image автоматически вычисляется dominant color
    (color quantization / k-means на пикселях обложки)
 3. Пользователь может переопределить цвет вручную (color picker)
 4. При sort_mode=«gradient»:
    a. Все dominant_color переводятся в HSL
    b. Сортировка: по H (hue) ASC → при равном H по S (saturation) DESC → по L (lightness) ASC
    c. Результат: плавный переход от красных → оранжевых → жёлтых → зелёных → синих → фиолетовых
 5. Для нейтральных цветов (S < 10%): группируются отдельно в конце,
    сортируются по L (от тёмных к светлым)

UI в админке:
 • Dropdown «Sort by» с вариантами: Default / Date / Alphabetical / Category / Color Gradient
 • При выборе «Color Gradient» — показывать preview палитры текущих карточек
 • Color picker для ручной корректировки dominant_color каждой карточки