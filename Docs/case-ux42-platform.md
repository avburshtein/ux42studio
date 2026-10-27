# Case draft — UX42.studio Platform (кейс о самой платформе)

> Черновик текстов для кейса «как создавался UX42.studio».
> Публичная часть сайта — EN, поэтому содержимое полей на английском;
> пояснения/структура — на русском. Поля ниже соответствуют шагам визарда
> (`/admin/projects/[id]/edit/*`) и схеме `src/db/schema/projects.ts`.
> Формат вставки: каждый блок = одно поле формы → готовый текст.
> Статус: секции 01–07 + TL;DR написаны (честный нарратив: dogfooding +
> AI-ускоренное исследование, ИИ — инструмент Discovery, НЕ фича продукта).
> ⚠️ Имена полей персоны/метрик взяты из фактических zod-форм
> (`problem/page.tsx`, `research/page.tsx`), а не из спек `03-admin-wizard.md`
> (там `bio/painPoints` — устарело; в схеме `role` + `description`).

---

## Шапка кейса (шаг General, Section 00)

| Поле | Значение |
| --- | --- |
| `title` | How I Designed & Built UX42.studio — a Portfolio Platform for Designers |
| `slug` | building-ux42-studio |
| `teaser` | A multi-tenant portfolio platform where designers assemble full case studies through a structured wizard — designed and built to be scannable by hiring managers, accessible, and consistent by default. |
| `client` | UX42.studio (own product) |
| `year` | 2026 |
| `duration` | Aug – Oct 2026 |
| `myRole` | Product Designer & Frontend — design system, public pages, case page + TL;DR/PDF, admin UI |
| `devices` | Desktop, Mobile |
| `constraints` | Cloudflare edge runtime (Workers/D1/R2), Free-tier budget, light+dark from one codebase, EN/ES legal (RGPD/LSSI), WCAG 2.1 AA |
| `tags` | Product Design, Design System, Next.js, Cloudflare, Accessibility, SEO, Portfolio Platform |
| `webPrototypeUrl` | https://ux42.studio |

---

## Section 01 — Problem & Audience

> Форма: три textarea — `problemStatement`, `projectGoal`, `targetUsers`.

### `problemStatement`
This started as a personal need, not a market idea. I needed a portfolio site for myself — somewhere to show my work — and hit the real wall. I dislike "creative" work where it isn't really needed. Hours polishing slides, hand-tuning pixels, deciding structure from a blank canvas. I'd already put the time into the projects; packaging them was exhausting. Behance made publishing slow and shallow, and no template ever fit. So I built a case-study structure myself — from Module 4 of the Google UX Design Certificate, together with AI — fill it in, get a finished case fast. With a back-end developer, my personal site became a multi-tenant platform (Next.js + Cloudflare) where content, M3 theming and media handling are solved at the system level. The real competitor isn't another SaaS — it's the manual stack (Figma + Notion + a website builder) designers piece together by hand today.

### `projectGoal`
Two goals, deliberately. One — a real product: turn scattered materials (Figma links, notes, screenshots, metrics) into a structured, credible case without a blank canvas or hand-cropping every image. The platform guarantees the result: scannable in 30 seconds (TL;DR + one-tap PDF); consistent across light/dark and every device (one M3 system on semantic tokens); accessible (WCAG 2.1 AA, Lighthouse 100); SEO-ready (OG, sitemap, metadata from the database). Two — the proof: the case you're reading runs on the platform it describes. Dogfooding as the first and hardest user.

### `targetUsers`
Primary (today) — me, the first user: I have the projects but not the patience to package them, so I need a guided flow that starts from what I already have, not a blank page. Planned — UX/UI designers job-hunting or freelancing: strong Figma work, but turning mockups into a convincing narrative is heavy, and adapting one case to Behance, PDF and a site multiplies the effort. The output also has to serve its reader — a hiring manager who decides "interview / skip" in 30–60 seconds from the TL;DR and a one-tap PDF. Tertiary — studio clients landing on the homepage, then reaching out via the contact form.

---

## Section 02 — User Research (Discovery)

> Форма: `researchMethodology`, `userStory` (textarea) + `personas` (до 5) + `keyMetrics` (до 3).
> Поля персоны: `nameAndAge`, `role`, `description` (+ опц. `avatarFileId`).
> Поля метрики: `value` (короткая строка), `description`.

### `researchMethodology`
Honest note first: there were no formal user interviews at this stage — this is hypothesis-generation research, and real-user validation is the planned next step. I ran a fast, AI-accelerated discovery instead of guessing. (1) Dogfooding as the primary signal: I am the first user, so every friction I hit — the blank canvas, hand-cropping images, writing metadata by hand — is real data. (2) AI-accelerated competitive analysis: rather than drown in manual collection, I used NotebookLM to synthesize a fast landscape in hours. I mapped five competitive fields, not one list: the manual stack (Figma + Notion + a website builder — the true incumbent), Behance/Dribbble, UXfolio (the direct UX-specific competitor), Framer (visual builder), and UX42's position between them. Insight: the market is polar — total freedom with blank-canvas pain (Framer) vs. rigid frames (Behance). UX42 targets "guided freedom" — the platform absorbs the technical routine and structure, leaving the designer the narrative and the visual. (3) A framework baseline: the case-study template structure comes from Module 4 of the Google UX Design Certificate (Building Wireframes / Creating UX Case Studies), giving a credible skeleton to fill. (4) Grounded project facts: Docs/status-report-2026-08-13.md and Docs/ANALYTICS.md (24,047 requests over 7 days, 72% served at the edge) confirmed real users reach content. Next: a screening survey, 5–7 depth interviews, and usability testing of the guided workflow.

### `userStory`
When I finish a working project and want to update my portfolio, I want to start telling its story and easily keep adding to it — turning scattered materials (Figma links, notes, screenshots, metrics) into a professional case with a clear narrative — without extra complexity or rebuilds, so I can spend my time demonstrating my value to recruiters or clients instead of fighting pixels in Figma and Photoshop, chasing an impossible ideal.

### `personas` (3)

1. nameAndAge: `Alex, 30s` · role: `Early adopter / dogfooder (UX/UI designer)`
   description: The first and hardest user. Has the projects but not the patience to package them — hits blank-canvas paralysis and manual media prep on her own site. Every friction she meets becomes a feature (guided wizard, in-browser cropping, auto SEO). Validates the workflow daily by simply using it.

2. nameAndAge: `Middle UX/UI designer, 27` · role: `Target platform user`
   description: Actively job-hunting or freelancing, 2–4 yrs experience. Strong Figma projects but postpones the portfolio because turning mockups into a convincing narrative is cognitively heavy, and adapting one case to Behance, PDF and a site multiplies the work. Wants a guided flow that starts from existing materials, not a blank canvas, and a predictable, accessible result in both themes — with no frontend engineer.

3. nameAndAge: `Hiring manager, 34` · role: `Reader of the output (not a platform user)`
   description: Scans 20+ portfolios per sitting. Decides "interview / skip" in the first 30–60s from the TL;DR, key metrics and readability; a weak first impression closes the tab. Opens cases on a phone and wants a one-tap PDF. The platform is judged by how well its output serves this reader.

### `keyMetrics` (3)

1. value: `100/100` · description: Lighthouse Accessibility on production — desktop and mobile, light and dark (11.09 audit; 09.10 prod run, per README)
2. value: `45` · description: smoke-test checks green — pages, audience split, legal, SEO/robots/sitemap, security headers, DB health (`npm run smoke`)
3. value: `$0` · description: running cost — Cloudflare Free Tier for D1, R2 and Workers with no egress fees; only the domain is paid

---

## Section 03 — Design Process

> Маппинг полей: в схеме БД это `designApproach` (раздел «Section 05: Process»),
> в визарде шага «Design» и на публичной странице — секция **03 Design Process**.
> Форма: одна textarea `designApproach`.

### `designApproach`
Honest note: for my own site I skipped the classic wireframe stage. The studio concept got a Relume sitemap and low-fi wireframes, but when plans shifted to a personal portfolio, my 'wireframe' was Figma Make — used as a clickable prototype, it quietly became the source for code: a Make export integrates more cleanly than a static mock. Every file starts token-first — a Material 3 theme built in the M3 builder, imported via plugin, light and dark from the first screen. The interesting part is what changed between prototype and production: pill inputs at 48px shipped as 10px; translucent rgba text became opaque on-surface-variant, so contrast computes honestly; the orange error moved to a deliberate amber — coral stays in the secondary palette, the soul of the site, and error shouldn't collide with it; the hero went from full-bleed to a contained 1280px layout with a scrim. Each divergence is a recorded decision, not an accident — captured in a token map that keeps Figma and code in sync.

---

## Section 04 — Design System

> Маппинг полей: в схеме БД это `visualDirection`, `displayFont`, `bodyFont`
> (раздел «Section 04: Design System») + `ColorRolePicker` на том же шаге.
> На публичной странице — секция **04 Design System**.
> Форма: textarea `visualDirection` + два input `displayFont` / `bodyFont`
> + выборщик цветовых ролей (seed → палитра).

### `visualDirection`
The concept is glassmorphism with a natural twist: blocks sit on a soft matte, faintly green-white surface — the green cast real glass takes at its cut edge. The palette pairs deep forest/taiga green with a bright sunset — flamingo and coral — a natural, high-contrast match. That coral barely shows in the interface; it survives mainly in the secondary color as the site's quiet soul. Because coral sits close to the red secondary, Error was moved to amber to stay legible. The result should feel dynamic and modern, never ultra-trendy: it rests on familiar patterns, so a user of any age, anywhere, can instantly find the CTA, grasp the gallery, and reach out. Under the hood it's Material 3 on semantic CSS variables generated from a single seed `#0B6E4F`, rendered in light and dark from one codebase. Role over hex is the rule — `#0B6E4F` is `primary-container`, not `primary` (`#00543B`) — so contrast is designed, not assumed: white on surface-tint `#056c4d` = 6.44:1 (AA), the dark pair `#003826` on `#83d7b1` = 7.73:1, and Error is deliberately amber `#8a5100`. Colors route through Tailwind v4's `@theme` (`bg-primary`, `text-on-surface-variant`, `border-outline-variant`); the scale adds a full radius set and 16 type tokens in Poppins (display) / Inter (body).

### `displayFont`
Poppins

### `bodyFont`
Inter

> **Примечание по шрифтовой паре.** В визарде поля `displayFont` / `bodyFont`
> хранят **только семейство шрифта** (Poppins / Inter). Размеры и веса НЕ задаёт
> пользователь — их проставляет платформа из type-шкалы M3 (`globals.css`:
> `display-sm` 52/60 … `label-overline` 10/16). Для кейса достаточно имён шрифтов.
> На текущем рендере тип-спеки Display Large/Display Small показывают 60px для обоих,
> а Body Large/Small — 17px для обоих (размер не дифференциируется по токену) —
> это дефект отображения компонента, правится в коде отдельно, на контент кейса
> не влияет.

### Color Roles (через ColorRolePicker — выбираются в форме, не текст)
Рекомендуемый набор ролей для кейса с их парами **On** (цвет текста/иконок поверх заливки). Для каждой роли — значение в **светлой** и **тёмной** теме (default и `[data-theme="dark"]`). Точные hex подставит билдер палитры из seed; здесь фактические значения из `globals.css`.

| Роль | Light fill | Light On | Dark fill | Dark On |
|---|---|---|---|---|
| `primary` | `#00543B` | `#FFFFFF` | `#83D7B1` | `#003826` |
| `primary-container` | `#0B6E4F` | `#D9F9E7` | `#0B6E4F` | `#D9F9E7` |
| `secondary` | `#B12A33` | `#FFFFFF` | `#FFB3B1` | `#680011` |
| `secondary-container` | `#FF6467` | `#44000A` | `#FF6467` | `#44000A` |
| `tertiary-container` | `#FBFFFA` | `#717672` | `#DFE4DF` | `#616562` |
| `error` | `#8A5100` | `#FFFFFF` | `#FFB86E` | `#492900` |
| `error-container` | `#D17D00` | `#402300` | `#D17D00` | `#402300` |
| `surface` | `#FCF8FA` | `#1B1B1D` | `#131314` | `#E4E2E3` |
| `surface-variant` | `#E1E2E8` | `#44474B` | `#44474B` | `#C5C6CC` |
| `surface-container` | `#F0EDEE` | `#1B1B1D` (общий) | `#1F1F21` | `#E4E2E3` (общий) |
| `background` | `#F7FAF5` | `#181D1A` | `#101412` | `#E0E3DF` |
| `surface-tint` | `#056C4D` | `#FFFFFF` | `#83D7B1` | `#003826` |

> **Что читает hiring-менеджер:** одна тема генерируется из seed `#0B6E4F`, а
> рендерится в двух модах из одного кода. `primary`/`error`/`surface` полностью
> инвертируются (светлый тёмный ↔ тёмный светлый), а `primary-container` и
> `*-container` остаются едиными «якорями» бренда. `secondary` (#B12A33) —
> «коралловая душа» сайта; `error` намеренно янтарный (#8A5100), а не красный,
> чтобы не конфликтовать с red secondary. Все On-пары рассчитаны под AA-контраст.

---

## Section 05 — Testing & Iteration

> **Маппинг полей:** `description` ← `project.testingProcess`; карточки
> Before/After ← `comparisons` (шаг **showcase**, картинки 4:3 + подписи).
> Секция показывается **только если есть ≥1 comparison**
> (`showTesting = comparisons.length > 0`, page.tsx:234).
>
> ⚠️ **`testingProcess` не редактируется из UI.** Action `updateProjectShowcase`
> его принимает (projects.ts:667), но форма `showcase/page.tsx` его **не передаёт**
> (шлёт только `finalDescription` + `comparisons`), а getter не читает в `reset`.
> Чтобы заработало описание секции 05 — добавить `testingProcess` в форму showcase
> (одна строка в `submitData` + textarea). Пока поле не подключено, секция 05
> опирается на Before/After-карточки; текст ниже — готовый, вставится после фикса.
>
> ⚠️ **`baCards` (текстовые Before/After из шага results) не рендерятся** на
> публичной странице. Для кейса используем `comparisons` (шаг showcase).

### `testingProcess` (description секции — см. примечание про поле)
Testing ran on three levels, and the harshest critic was me — the first user. Automated gates came first: `tsc --noEmit` and `eslint` at 0 errors, `next build --webpack` green, and a 45-check smoke suite covering pages, SEO/robots/sitemap, security headers and DB health. Then a pre-deploy audit (26.09) surfaced 7 real defects, all fixed and re-verified — including a FAB that promised an assistant it didn't have, a moodboard editor that silently dropped drag-n-drop reorders on save, and `lang='ru'` on fully English content (WCAG 3.1.1). The before/after below shows the three that most changed the product. Accessibility was built into the layout, not bolted on at the end: Lighthouse Accessibility holds 100/100 on production in both themes.

### `comparisons` (Before/After — шаг showcase, нужны скриншоты 4:3 «до/после»)
Рекомендуемый набор (3 самые сильные для hiring-менеджера):

1. featureName: `Contact FAB` · beforeText: `aria-label="Help" with a question-mark icon — promised a virtual assistant, but only scrolled to #contact.` · afterText: `Mail icon + aria-label="Contact us" — the button now does what it says.` *(скрины: FAB до/после)*
2. featureName: `Moodboard reorder` · beforeText: `onImagesChange was declared but never called — drag-n-drop reorders lived in local state and were lost on save.` · afterText: `onImagesChange now fires on drag-end and upload; order persists to the DB.` *(скрины: редактор мудборда до/после)*
3. featureName: `Auth privacy notice` · beforeText: `Login/register collected email with no notice of purpose or retention (RGPD Art. 13).` · afterText: `A notice under each form states the legal basis, retention, controller contact and links to /privacy.` *(скрины: форма входа до/после)*

---

## Section 06 — Final Design

> **Маппинг полей:** `description` ← `finalDescription` (шаг showcase);
> `results` (ResultsCard) и `tools` (TagBadge) — шаг **results**; финальная
> галерея — ассеты `final_gallery` (шаг gallery), лейаут editorial/masonry/justified.

### `finalDescription`
One product, proved by itself — that's the whole idea. A designer lands, fills a guided 8-step wizard with what she already has, and walks away with something that feels handmade: scannable, in her own theme, accessible, ready to share as a link or a PDF. That's the feeling the platform is built to deliver — turning scattered project materials into a case that reads like custom work, without touching a line of code.

Under the hood it's one system: a studio landing, a `/platform` promo, a designer's portfolio at `/u/[slug]`, and this very case at `/u/[slug]/[projectSlug]` — all rendered from the same multi-tenant data and one M3 design system. A TL;DR and one-tap PDF at `/short`, Open Graph and sitemap generated from D1, gallery layouts (editorial / masonry / justified) switched from the admin. It runs entirely on the Cloudflare Free Tier — D1, R2 and Workers, no egress fees — so the whole platform costs $0 to run.

### `results` (шаг results → ResultsCard, 2-col)
- `Lighthouse Accessibility 100/100 on production, both themes`
- `45-check smoke suite green on every build`
- `$0/mo on the Cloudflare Free Tier — no egress fees`
- `EN + ES legal pages (RGPD / LSSI-CE) from one content model`

### `tools` (шаг results → TagBadge)
Figma · Relume · Figma Make · NotebookLM · Material Design 3 · Next.js 16 · Cloudflare D1 · Cloudflare R2 · Tailwind CSS v4 · Drizzle ORM · TypeScript

### Финальная галерея (ассеты `final_gallery`, шаг gallery — нужны скриншоты)
Рекомендуемый набор: главная студии (desktop + mobile) · `/platform` · `/u/aleksandra-burshtein` (портфолио дизайнера) · этот кейс (desktop + mobile) · dark/light одной и той же секции · `/short` TL;DR + PDF · админ-визард (8 шагов).

---

## Section 07 — Reflection & Next Steps

> **Маппинг полей:** `keyTakeaway` (textarea) и `nextSteps` (массив `content`,
> тип айтема `next_step`) редактируются в шаге **`review/`** (последний шаг
> визарда). `reviews` (TestimonialCard) — опционально, для этого кейса не нужен.
> На публичной странице секция показывается, если есть `keyTakeaway` или
> хотя бы один `next_step`.

### `keyTakeaway`
The strongest lesson is that starting from myself was not a shortcut — it was the discipline. Building the tool I actually needed forced every feature to earn its place: the wizard, the in-browser cropping, the auto-SEO all exist because I hit each pain as the first user, not because a framework said so. The real risk of dogfooding is tunnel vision, and pairing with a back-end developer countered it — the moment we framed my site as a multi-tenant platform, personal-need decisions became product decisions. Dogfooding also surfaced a blind spot I couldn't see alone: what's obvious to the creator isn't obvious to users, and the Help section exists precisely because of that. Two things I'd keep: treat design tokens as the contract between Figma and code (role over hex), and keep a smoke suite as a safety net so accessibility and SEO can't silently regress. One thing I'd change: I skipped formal user research to move fast, and while AI-accelerated analysis gave a strong start, real insight only arrived while building — the next step is to validate the guided workflow with actual designers before assuming it fits them too.

### `nextSteps` (шаг review → NextStepsList, поле `content`)
- `Validate the guided case-building workflow with 5–7 UX/UI designers (screening survey + usability testing) — the research I skipped to move fast.`
- `Ship the portfolio assistant, variant A: fixed intents answered from D1, no LLM — answers only from published data, each with a source link.`
- `Introduce a nonce-based Content-Security-Policy (extract the theme-init script) and align eslint-config-next to v16.`
- `Add a recruiter view and version comparison so one project adapts to a web case, PDF, and a short hiring version.`

---

## TL;DR (`/short`)

> **Как это работает в платформе:** `/short` **не заполняется вручную** — он
> авто-генерируется из метаданных кейса (тело кейса → сводка; «Решение (63)»).
> Дизайнер на шаге `review/` только копирует ссылку через `TldrShareButtons`.
> Поэтому здесь — не текст для вставки, а **чего ожидать** в авто-сводке и что
> влияет на её качество (заголовок, тизер, роль, метрики, теги).

**Что попадёт в авто-сводку (из полей кейса):**
- Заголовок: `How I Designed & Built UX42.studio`
- Тизер + роль (`Product Designer & Frontend`) + срок (`2026 · Aug – Oct`)
- 3 ключевые метрики: `100/100 Lighthouse Accessibility` · `45 smoke checks green` · `$0/mo Cloudflare Free Tier`
- Теги: Product Design, Design System, Next.js, Cloudflare, Accessibility, SEO, Portfolio Platform
- Ссылка на полный кейс + PDF

**На что обратить внимание, чтобы TL;DR вышел сильным:**
- `teaser` и `myRole` — читаются первыми; сделаны лаконичными под 30-секундный скан.
- Метрики заданы конкретными и проверяемыми (100/100, 45, $0) — именно они цепляют hiring-менеджера.
- PDF-экспорт уже настроен (print-CSS, `/short`), так что TL;DR + one-tap PDF работают из коробки.

---

---

## Приложение: чек-лист скриншотов (пункт B)

> Рабочий чек-лист (не контент кейса). Соотношения и лимиты сняты из кода
> загрузчиков (`cropRatio` / `aspectRatio` / `maxSize`), не «на глаз».
> `maxSize` = 10 МБ (дефолт `ImageUploader.tsx`).

| Слот / куда | Соотношение | Пиксели (реком.) | Где загружать |
|---|---|---|---|
| Hero-обложка (Section 00) | `16:9` | 1920×1080 | Шаг **General** (`coverFileId`) |
| Wireframe (Section 03) | — не используем | — | Секция 03 — text-driven; лейбл ассетов жёстко «Wireframes» (`page.tsx:443`), чужие кадры туда грузить нельзя |
| Moodboard (Section 04) | свободная сетка (WYSIWYG-пресет) | по ячейкам | Шаг **Gallery** → тип `moodboard` |
| Before/After (Section 05) | `4:3` каждая | 1600×1200 | Шаг **Showcase** → `comparisons` |
| Final gallery (Section 06) | загрузка `4:3` | 1920×1080+ | Шаг **Gallery** → тип `final_gallery` |
| OG-обложка | — авто-генерируется (flatten) | — | Не нужна, руками не грузим |

> Editorial-рендер галереи кропит в слоты: первый широкий **1072×420** (десктоп) /
> `4:3` (мобайл), далее сетка 2 колонки (420fr / 628fr) — для editorial снимай
> **широкие кадры (16:9 и шире)**, загрузчик обрежет в 4:3, лейаут впишет.

**Что снимать (под этот кейс платформы):**
- **Hero — 1 кадр (16:9):** главная `/` или `/platform`, hero-блок — самый «продуктовый» кадр, с глубиной (glassmorphism).
- **Section 03 — визуал не нужен (text-driven):** секция живёт на честном тексте `designApproach`: вайрфреймов для личного сайта не было, их роль сыграл Figma Make-прототип. Лейбл сетки ассетов в секции 03 захардкожен «Wireframes» — кадры «Make → финал» туда грузить нельзя. Если захочется визуала именно в 03 — только настоящий Relume-экспорт по студии. Сюжет «Make → Production» уезжает в секцию 05 как comparison-пара.
- **Section 04 Moodboard — сетка:** глубокий зелёный + коралловый закат · шрифтовая пара Poppins/Inter · glassmorphism-настроение · M3-токены / seed `#0B6E4F`.
- **Section 05 Before/After — 3 обязательные пары + 1 запасная (4:3, 1600×1200)** ← ценный блок для hiring-менеджера:
  - (1) **A case behind a modal → a case with its own URL** — скрины ГОТОВЫ (модалка «Mobile Banking App» dark + hero кейса dark). Модалка = нет URL/ссылки/OG/SEO + лишний шаг; после = своя страница `/u/…` с метаданными. Нюанс: на скрине «до» контент placeholder («Mobile Banking App») — в подписи не заострять.
  - (2) **One endless form → an 8-step wizard** — скрины ГОТОВЫ (старая простыня «New Case Study» + новый визард с сайдбаром). В afterText вплетены: media URL-поля → кроппер в R2, unpublish вместо archive-only, section-pattern в редакторе сайта. На скрине «до» видны ручные URL-поля (hero image, wireframes) — это и есть «до» киллер-фичи кроппера.
  - (3) **Figma Make → Production** (`featureName`: «From prototype to production») — сюжет секции 03, визуализируем здесь: слева скрин из Make, справа shipped-страница.
  - (4, запасная) OG прозрачный PNG → flatten `#F7FAF5`.
  - Каждая пара = один `comparison` (`featureName` + `beforeText`/`afterText`); широкие скрины кропить под 4:3 заранее в Figma — иначе кроп съест контекст.
  - Инсайт «Help-раздел появился, потому что всё понятно только создателю» → в Reflection (секция 07), не в comparison.
- **Section 06 Final — 5–8 кадров:** главная (desktop) · `/platform` · `/u/[slug]` (desktop + mobile) · этот кейс (desktop + mobile) · dark-тема · админ-визард · TL;DR + PDF · тема в другом seed (доказательство M3).

**Приоритет (если времени мало):** 🔴 Hero + Section 06 (галерея десктоп/мобайл + dark) · 🟠 2–3 пары Before/After, включая «Figma Make → Production» · 🟡 Moodboard.

> Dark-тему снимай отдельными кадрами — платформа рендерит свет/тьма из одного
> кода, для кейса это самостоятельный доказательный кадр.

---

## Статус документа

✅ Секции 01–07 + TL;DR — написаны на фактах репозитория (поля сверены с
zod-формами визарда и схемой `projects.ts`, значения токенов/метрик — из кода).
⚠️ Открытые технические нюансы, найденные по ходу (не влияют на контент кейса,
но стоит учесть при наполнении):
- Секция 05 «Testing & Iteration» показывается только при наличии `comparisons`
  (шаг showcase). Поле `testingProcess` есть в схеме и в action, но форма
  showcase его **не передаёт** — значит описание секции 05 из UI сейчас не
  редактируется. Для кейса Before/After опираемся на `comparisons` (картинки).
- `baCards` (текстовые Before/After из шага results) на публичной странице не
  рендерятся — это резервный механизм.

