# Case draft — UX42.studio Platform (кейс о самой платформе)

> Черновик текстов для кейса «как создавался UX42.studio».
> Публичная часть сайта — EN, поэтому содержимое полей на английском;
> пояснения/структура — на русском. Поля ниже соответствуют шагам визарда
> (`/admin/projects/[id]/edit/*`) и схеме `src/db/schema/projects.ts`.
> Формат вставки: каждый блок = одно поле формы → готовый текст.
> Статус: секции 01–07 + TL;DR переписаны по ревью Perplexity (достоверность:
> подтверждённое / гипотеза / запланированное; вклад сверен с README + git).
> ⚠️ Имена полей персоны/метрик взяты из фактических zod-форм
> (`problem/page.tsx`, `research/page.tsx`), а не из спек `03-admin-wizard.md`
> (там `bio/painPoints` — устарело; в схеме `role` + `description`).

---

## Шапка кейса (шаг General, Section 00)

| Поле | Значение |
| --- | --- |
| `title` | How I Designed & Built UX42.studio — a Portfolio Platform for Designers |
| `slug` | building-ux42-studio |
| `teaser` | UX42 is a portfolio platform I designed and helped build to turn scattered project materials into structured case studies. I led UX/UI design, the visual token system, and responsive frontend implementation with a backend developer. The product grew from my own portfolio workflow; it is live and used for this case study — validation with external designers is the next step. |
| `client` | UX42.studio (own product) |
| `year` | 2026 |
| `duration` | Aug – Oct 2026 |
| `myRole` | Product Designer & Frontend — UX/UI, design system & tokens, public pages, case + TL;DR/PDF, admin UI (with backend collaboration) |
| `devices` | Desktop, Mobile |
| `constraints` | Cloudflare edge runtime (Workers/D1/R2), Free-tier budget, light+dark from one codebase, EN/ES legal (RGPD/LSSI), WCAG 2.1 AA as a design target |
| `tags` | Product Design, Design System, Next.js, Cloudflare, Accessibility, SEO, Portfolio Platform |
| `webPrototypeUrl` | https://ux42.studio |

> **Overview (первые 30 секунд).** `teaser` выше — готовый overview для шапки.
> Ниже — тот же смысл развёрнут в `problemStatement` (вклад / Collaboration),
> потому что отдельного поля Contribution в визарде нет.

---

## Section 01 — Problem & Audience

> Форма: три textarea — `problemStatement`, `projectGoal`, `targetUsers`.

### `problemStatement`
UX42 is a portfolio platform I designed and helped build to turn scattered project materials into structured case studies. My contribution: I led UX/UI design, built the visual token system (Figma ↔ code), and implemented the responsive frontend for public pages, the case template, TL;DR/PDF, and the admin UI. Collaboration: a backend developer owned authentication, Server Actions, the D1 schema, R2 uploads, and Cloudflare/Next configuration. AI tools (NotebookLM, Figma Make, Cursor) accelerated discovery and prototyping; I reviewed and corrected every output before it shipped — for example, tightening Make-generated inputs from 48px pills to 10px radius so production matched the token contract.

This started as a personal need, not a market idea. I needed a portfolio site for myself and hit the real wall: hours packaging projects I had already done — structure, images, metadata, layout. Behance felt slow and shallow; no template fit. So I built a guided case-study structure informed by the Google UX Design Certificate case-study framework, together with AI — fill it in, get a finished case faster. With the backend developer, my personal site became a multi-tenant platform where content, theming and media handling are solved at the system level. Competitive framing (desk research, not interviews): the real alternative isn't only another SaaS — it's the manual stack (Figma + Notion + a website builder) designers piece together by hand today.

### `projectGoal`
Two goals, deliberately. One — a real product: turn scattered materials (Figma links, notes, screenshots, metrics) into a structured, credible case without a blank canvas or hand-cropping every image. The platform aims for a result that is quick to scan (TL;DR + one-tap PDF), consistent across light/dark and every device (one token system), designed with WCAG 2.1 AA as a target (Lighthouse Accessibility 100/100 in documented production checks), and SEO-ready (OG, sitemap, metadata from the database). Two — the proof: the case you're reading runs on the platform it describes. Dogfooding as the first and hardest user. What still needs checking with other designers: whether the guided flow actually saves them time and whether the interface is clear without the author's explanation.

### `targetUsers`
Primary (today) — me, the first user: I have the projects but not the patience to package them, so I need a guided flow that starts from what I already have, not a blank page. Planned — UX/UI designers job-hunting or freelancing: strong Figma work, but turning mockups into a convincing narrative is heavy, and adapting one case to Behance, PDF and a site multiplies the effort. Working hypothesis for the reader of the output — a hiring manager who often decides quickly from a TL;DR and a one-tap PDF (exact scan time not yet measured). Tertiary — studio clients landing on the homepage, then reaching out via the contact form.

---

## Section 02 — User Research (Discovery)

> Форма: `researchMethodology`, `userStory` (textarea) + `personas` (до 5) + `keyMetrics` (до 3).
> Поля персоны: `nameAndAge`, `role`, `description` (+ опц. `avatarFileId`).
> Поля метрики: `value` (короткая строка), `description`.
> Персоны ниже — **Initial audience hypotheses / Proto-personas**, не валидированные интервью.

### `researchMethodology`
Honest note first: there were no formal user interviews at this stage — this is hypothesis-generation research, and real-user validation is the planned next step. I ran a fast, AI-accelerated discovery instead of guessing. (1) Dogfooding as the primary signal: I am the first user, so every friction I hit — the blank canvas, hand-cropping images, writing metadata by hand — is real data for me, not yet evidence for a broader market. (2) AI-accelerated competitive analysis: I used NotebookLM to synthesize a fast landscape in hours. I mapped five competitive fields, not one list: the manual stack (Figma + Notion + a website builder — the true incumbent), Behance/Dribbble, UXfolio (the direct UX-specific competitor), Framer (visual builder), and UX42's position between them. Insight (desk research): the market is polar — total freedom with blank-canvas pain (Framer) vs. rigid frames (Behance). UX42 targets "guided freedom" — the platform absorbs the technical routine and structure, leaving the designer the narrative and the visual. (3) A framework baseline: the case-study template structure is informed by the Google UX Design Certificate case-study framework, giving a credible skeleton to fill. Next: a screening survey, 5–7 depth interviews, and usability testing of the guided workflow.

### `userStory`
When I finish a working project and want to update my portfolio, I want to start telling its story and easily keep adding to it — turning scattered materials (Figma links, notes, screenshots, metrics) into a professional case with a clear narrative — without extra complexity or rebuilds, so I can spend my time demonstrating my value to recruiters or clients instead of fighting pixels in Figma and Photoshop, chasing an impossible ideal.

### `personas` (3) — Initial audience hypotheses / Proto-personas

> Based on personal experience and desk research; not yet validated through user interviews.

1. nameAndAge: `Alex, 30s` · role: `Proto-persona — early adopter / dogfooder (UX/UI designer)`
   description: Hypothesis grounded in my own use. Has the projects but not the patience to package them — hits blank-canvas paralysis and manual media prep on her own site. Every friction she meets becomes a feature candidate (guided wizard, in-browser cropping, auto SEO). Currently the only validated user of the full workflow.

2. nameAndAge: `Middle UX/UI designer, 27` · role: `Proto-persona — planned platform user`
   description: Hypothesis from desk research and competitive framing. Actively job-hunting or freelancing, 2–4 yrs experience. Strong Figma projects but may postpone the portfolio because turning mockups into a convincing narrative is cognitively heavy, and adapting one case to Behance, PDF and a site multiplies the work. Assumed need: a guided flow from existing materials and a predictable result in both themes — still to be validated in interviews.

3. nameAndAge: `Hiring manager, 34` · role: `Proto-persona — reader of the output (not a platform user)`
   description: Working hypothesis about how hiring managers scan portfolios: they often decide quickly from the TL;DR, key signals and readability; a weak first impression closes the tab. May open cases on a phone and value a one-tap PDF. Exact scan counts and timings are not sourced — treated as a design assumption for scannable output, not a research finding.

### `keyMetrics` (3)

> Продуктово-проверяемые факты реализации — не claim, что «дизайнерам стало проще» в целом.

1. value: `Live` · description: This case study runs on the platform it describes — dogfooding as the first production proof
2. value: `Wizard` · description: Guided 8-step case creation shipped (structure, media crop, SEO metadata) — completion value for other designers still to validate
3. value: `100/100` · description: Lighthouse Accessibility on documented production checks (desktop/mobile; themes per README) — WCAG 2.1 AA remains the design target, not a full audit claim

---

## Section 03 — Design Process

> Маппинг полей: в схеме БД это `designApproach` (раздел «Section 05: Process»),
> в визарде шага «Design» и на публичной странице — секция **03 Design Process**.
> Форма: одна textarea `designApproach`.

### `designApproach`
Honest note: for my own site I skipped the classic wireframe stage. The studio concept got a Relume sitemap and low-fi wireframes, but when plans shifted to a personal portfolio, my 'wireframe' was Figma Make — used as a clickable prototype, it quietly became the source for code: a Make export integrates more cleanly than a static mock. Every file starts token-first — a Material 3 theme built in the M3 builder, imported via plugin, light and dark from the first screen.

The centre of this case is what changed between prototype and production — recorded decisions, not accidents: pill inputs at 48px shipped as 10px; translucent rgba text became opaque on-surface-variant, so contrast computes honestly; the orange error moved to a deliberate amber — coral stays in the secondary palette, the soul of the site, and error shouldn't collide with it; the hero went from full-bleed to a contained 1280px layout with a scrim; a long single form became an 8-step wizard. Each divergence is captured in a token map that keeps Figma and code in sync, and in component docs handed to the backend developer for integration.

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
> чтобы не конфликтовать с red secondary. On-пары рассчитаны под целевой
> контраст WCAG 2.1 AA; полный аудит AA по всем страницам отдельно не заявляется.

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
Testing ran on three levels, and the harshest critic was me — the first user. Automated gates came first: `tsc --noEmit` and `eslint` at 0 errors, `next build --webpack` green, and a 45-check smoke suite covering pages, SEO/robots/sitemap, security headers and DB health. Then a pre-deploy audit (26.09) surfaced 7 real defects, all fixed and re-verified — including a FAB that promised an assistant it didn't have, a moodboard editor that silently dropped drag-n-drop reorders on save, and `lang='ru'` on fully English content (WCAG 3.1.1). The before/after below shows the decisions that most changed the product. Accessibility: designed with WCAG 2.1 AA as a target; Lighthouse Accessibility 100/100 in documented production checks; built-in practices include semantic contrast pairs, visible focus indicators, and `prefers-reduced-motion` — not a claim of a full WCAG audit. Infrastructure note (not user research): Cloudflare analytics for a sample week show request volume and ~72% edge handling — useful for runtime cost, not proof of unique human visitors.

### `comparisons` (Before/After — шаг showcase, нужны скриншоты 4:3 «до/после»)
Рекомендуемый набор (центральный блок кейса — решения с последствиями):

1. featureName: `Contact FAB` · beforeText: `aria-label="Help" with a question-mark icon — promised a virtual assistant, but only scrolled to #contact.` · afterText: `Mail icon + aria-label="Contact us" — the button now does what it says.` *(скрины: FAB до/после)*
2. featureName: `Moodboard reorder` · beforeText: `onImagesChange was declared but never called — drag-n-drop reorders lived in local state and were lost on save.` · afterText: `onImagesChange now fires on drag-end and upload; order persists to the DB.` *(скрины: редактор мудборда до/после)*
3. featureName: `Auth privacy notice` · beforeText: `Login/register collected email with no notice of purpose or retention (RGPD Art. 13).` · afterText: `A notice under each form states the legal basis, retention, controller contact and links to /privacy.` *(скрины: форма входа до/после)*

> Дополнительно для сильного интервью-блока (если есть слоты): пары из приложения —
> endless form → 8-step wizard; full-bleed hero → 1280px contained; Figma Make → production.

---

## Section 06 — Final Design

> **Маппинг полей:** `description` ← `finalDescription` (шаг showcase);
> `results` (ResultsCard) и `tools` (TagBadge) — шаг **results**; финальная
> галерея — ассеты `final_gallery` (шаг gallery), лейаут editorial/masonry/justified.

### `finalDescription`
One product, proved by itself for its first user — that's the honest scope. A designer lands, fills a guided 8-step wizard with what she already has, and walks away with something that feels handmade: scannable, in her own theme, designed for accessibility, ready to share as a link or a PDF. That's the feeling the platform is built to deliver — turning scattered project materials into a case that reads like custom work, without asking the designer to ship frontend code.

**Built and verified:** guided case-creation wizard; light/dark themes on semantic tokens; this case and my portfolio running on the platform; automated implementation checks (Lighthouse Accessibility 100/100 in documented runs, 45-check smoke suite, EN+ES legal pages, Cloudflare Free Tier runtime).

**Still to validate with external designers:** whether the wizard helps others finish a case; whether personalization is enough; whether the UI is clear without the author's explanations; whether it saves time versus their current Figma + Notion + builder stack.

Under the hood it's one system: a studio landing, a `/platform` promo, a designer's portfolio at `/u/[slug]`, and this very case at `/u/[slug]/[projectSlug]` — all rendered from the same multi-tenant data and one design-token system. A TL;DR and one-tap PDF at `/short`, Open Graph and sitemap generated from D1, gallery layouts switched from the admin.

### `results` (шаг results → ResultsCard, 2-col)

> Implementation checks — not product-market outcomes.

- `Guided 8-step wizard + themes/tokens shipped; this case runs on the platform`
- `Lighthouse Accessibility 100/100 in documented production checks (WCAG 2.1 AA = target)`
- `45-check smoke suite green — pages, SEO, security headers, DB health`
- `EN + ES legal pages + $0/mo Cloudflare Free Tier runtime (implementation, not user proof)`

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
The strongest lesson is that starting from myself was not a shortcut — it was the discipline. Building the tool I actually needed forced every feature to earn its place: the wizard, the in-browser cropping, the auto-SEO all exist because I hit each pain as the first user, not because a framework said so. The real risk of dogfooding is tunnel vision, and pairing with a back-end developer countered it — the moment we framed my site as a multi-tenant platform, personal-need decisions became product decisions. Dogfooding also surfaced a blind spot I couldn't see alone: what's obvious to the creator isn't obvious to users, and the Help section exists precisely because of that. Two things I'd keep: treat design tokens as the contract between Figma and code (role over hex), and keep a smoke suite as a safety net so accessibility and SEO can't silently regress. One thing I'd change: I skipped formal user research to move fast, and while AI-accelerated analysis gave a strong start, real insight only arrived while building — what is verified today is that the product works for me; what is still unknown is whether other designers get the same value. The next step is to validate the guided workflow with them before assuming it fits.

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
- Тизер (overview: продукт → роль → live + next validation) + роль (`Product Designer & Frontend…`) + срок (`2026 · Aug – Oct`)
- 3 ключевые метрики: `Live` (dogfooding) · `Wizard` (guided creation shipped) · `100/100` (Lighthouse a11y checks)
- Теги: Product Design, Design System, Next.js, Cloudflare, Accessibility, SEO, Portfolio Platform
- Ссылка на полный кейс + PDF

**На что обратить внимание, чтобы TL;DR вышел сильным:**
- `teaser` и `myRole` — читаются первыми; overview без стека и без неподтверждённых product-метрик.
- Метрики — проверяемые факты реализации/dogfooding, не «стало проще всем дизайнерам».
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
- **Section 05 Before/After — 3 обязательные пары + 1 запасная (4:3, 1600×1200)** ← центральный блок решений:
  - (1) **A case behind a modal → a case with its own URL** — скрины ГОТОВЫ (модалка «Mobile Banking App» dark + hero кейса dark). Модалка = нет URL/ссылки/OG/SEO + лишний шаг; после = своя страница `/u/…` с метаданными. Нюанс: на скрине «до» контент placeholder («Mobile Banking App») — в подписи не заострять.
  - (2) **One endless form → an 8-step wizard** — скрины ГОТОВЫ (старая простыня «New Case Study» + новый визард с сайдбаром). В afterText вплетены: media URL-поля → кроппер в R2, unpublish вместо archive-only, section-pattern в редакторе сайта. На скрине «до» видны ручные URL-поля (hero image, wireframes) — это и есть «до» киллер-фичи кроппера.
  - (3) **Figma Make → Production** (`featureName`: «From prototype to production») — сюжет секции 03, визуализируем здесь: слева скрин из Make, справа shipped-страница.
  - (4, запасная) OG прозрачный PNG → flatten `#F7FAF5`.
  - Каждая пара = один `comparison` (`featureName` + `beforeText`/`afterText`); широкие скрины кропить под 4:3 заранее в Figma — иначе кроп съест контекст.
  - Инсайт «Help-раздел появился, потому что всё понятно только создателю» → в Reflection (секция 07), не в comparison.
- **Section 06 Final — 5–8 кадров:** главная (desktop) · `/platform` · `/u/[slug]` (desktop + mobile) · этот кейс (desktop + mobile) · dark-тема · админ-визард · TL;DR + PDF · тема в другом seed (доказательство token system).

**Приоритет (если времени мало):** 🔴 Hero + Section 06 (галерея десктоп/мобайл + dark) · 🟠 2–3 пары Before/After, включая «Figma Make → Production» · 🟡 Moodboard.

> Dark-тему снимай отдельными кадрами — платформа рендерит свет/тьма из одного
> кода, для кейса это самостоятельный доказательный кадр.

---

## Чек-лист обновления живого кейса

> Пройти визард проекта `building-ux42-studio` (или актуальный slug) и вставить
> тексты из этого файла. D1/админку агент не меняет — только копипаст.

| Шаг визарда | Поле | Обновить? | Заметка |
| --- | --- | --- | --- |
| General | `teaser` | Да | Новый 30-секундный overview |
| General | `myRole` | Да | Честная роль + collaboration |
| General | `constraints` | Да | WCAG как target |
| Problem | `problemStatement` | Да | Вклад + Google UX framework + без Module N |
| Problem | `projectGoal` | Да | Цель vs проверка; soft scan language |
| Problem | `targetUsers` | Да | Hiring manager = hypothesis |
| Research | `researchMethodology` | Да | Без requests=users; framework wording |
| Research | personas (3) | Да | Proto-personas + disclaimer в descriptions |
| Research | `keyMetrics` (3) | Да | Live / Wizard / 100/100 |
| Design | `designApproach` | Да | Центр на решениях до/после |
| Design System | `visualDirection` | По желанию | Только уточнение AA = target в конце note |
| Showcase | `finalDescription` | Да | Built & verified vs Still to validate |
| Showcase | `comparisons` | По скринам | Тексты можно оставить; усилить wizard/Make пары |
| Results | `results` (4) | Да | Implementation checks framing |
| Review | `keyTakeaway` | Да | Verified for me / unknown for others |
| Review | `nextSteps` | Нет | Уже согласованы с research next step |
| — | `testingProcess` | Отложено | Поле в UI не подключено; текст готов выше |

После сохранения: открыть публичный кейс + `/short`, перепроверить TL;DR и PDF.

---

## Статус документа

✅ Секции 01–07 + TL;DR — переписаны по ревью Perplexity; вклад сверен с
README (Alex: UI/DS/публичные страницы/админ UI; Denis: backend) и git shortlog.
✅ Разделены подтверждённое / гипотезы / next validation; analytics не как user proof.
✅ Чек-лист вставки в живой кейс — в разделе выше.
⚠️ Открытые технические нюансы (не контент):
- Секция 05 «Testing & Iteration» показывается только при наличии `comparisons`
  (шаг showcase). Поле `testingProcess` есть в схеме и в action, но форма
  showcase его **не передаёт** — описание секции 05 из UI сейчас не
  редактируется. Для кейса Before/After опираемся на `comparisons` (картинки).
- `baCards` (текстовые Before/After из шага results) на публичной странице не
  рендерятся — это резервный механизм.
