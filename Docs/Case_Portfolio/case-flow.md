# Case draft — Flow (Circadian Productivity Calendar)

> Черновик текстов для кейса «как создавался Flow».
> Публичная часть сайта — EN, поэтому содержимое полей на английском;
> пояснения/структура — на русском. Поля ниже соответствуют шагам визарда
> (`/admin/projects/[id]/edit/*`) и схеме `src/db/schema/projects.ts`.
> Формат вставки: каждый блок = одно поле формы → готовый текст.
>
> Источники (достоверность):
> - подтверждённое — `docs/CURRENT/DEFINE.md` (n=99, май 2026), README,
>   `src/theme/tokens.css`, git shortlog / timeline;
> - гипотеза — proto-расширения аудитории (ADHD как явная сегментация —
>   дизайн-гипотеза, не отдельный кластер в опросе);
> - запланированное — Matter.js physics, Supabase sync, AI suggestWeight,
>   formal a11y audit со скринридерами.
>
> ⚠️ Старый черновик в `make-export/...Flow_.md` содержал цифры 84% / 67%
> и персону «Алексей, 26, ADHD» — **не использовать**. Канон персон и метрик —
> DEFINE.md (Маша / Лора / Алекс; ~56% / 60% / 43%).

---

## Шапка кейса (шаг General, Section 00)

| Поле | Значение |
| --- | --- |
| `title` | How I Designed & Built Flow — a Circadian Productivity Calendar |
| `slug` | building-flow-calendar |
| `teaser` | Flow is a circadian productivity calendar I designed and built solo to replace rigid time-blocking with energy-aware planning. I owned UX research (n=99), product design, the Material 3 token system, and the full responsive frontend. AI tools (Cursor, Figma) accelerated iteration — I reviewed and corrected every output before it shipped. The app is live as a client-side demo; formal external usability validation beyond the survey is the next step. |
| `client` | Flow (own product · Google UX Design Certificate portfolio) |
| `year` | 2026 |
| `duration` | Jan – Oct 2026 |
| `myRole` | Solo Product Designer & Frontend — research (Define), UX/UI, M3 design system & tokens, Day/Week views, voice UX, Recovery Mode; full frontend implementation with AI-assisted coding (Cursor) |
| `devices` | Mobile-first, Desktop |
| `constraints` | Client-side only (localStorage, no backend), Free-tier Vercel hosting, light+dark from one token codebase, EN/RU/ES UI, WCAG 2.1 AA as a design target, Calm UI (no glassmorphism, no red overload, no sharp stress shapes) |
| `tags` | Product Design, UX Research, Design System, Circadian UX, Material Design 3, React, Accessibility, Voice UI |
| `webPrototypeUrl` | https://flow-nine-xi.vercel.app |

> **Overview (первые 30 секунд).** `teaser` выше — готовый overview для шапки.
> Ниже — тот же смысл развёрнут в `problemStatement` (solo + AI),
> потому что отдельного поля Contribution в визарде нет.

---

## Section 01 — Problem & Audience

> Форма: три textarea — `problemStatement`, `projectGoal`, `targetUsers`.

### `problemStatement`
Flow is a circadian productivity calendar I designed and built end-to-end as a solo designer–developer. I owned UX research for the Google UX Design Certificate Define stage (survey n=99, affinity mapping, three personas, HMW questions), the product language (4 circadian blocks, task weights, capacity, Recovery Mode), the Material 3 visual token system (Figma ↔ `tokens.css`), and the full responsive frontend — Day/Week views, TaskSheet, toolbar biomechanics, and voice-command UX. AI tools (Cursor, Figma) accelerated discovery and coding; I reviewed and corrected every output before it shipped — for example, removing glassmorphism when it collided with the physics/performance brief, and enforcing amber (never red) for capacity overload so the UI stays supportive, not alarming. No human co-author on engineering: the live build is mine plus AI-assisted implementation under my design constitution (`.cursorrules`, `CLAUDE.md`).

This started as a personal and research need, not a SaaS pitch. Existing calendars treat people like machines: fixed slots, endless lists, guilt when the plan breaks. A survey of planning habits (n=99, RU/EN/ES) confirmed the gap: people already move unfinished work by hand or let it pile up (~56%); they want tools that account for their state (60% rated 4–5/5); nearly half struggle to estimate a day's capacity (43%). Competitive framing (desk research): the real alternative isn't only another todo app — it's the toxic stack of Google Calendar + a linear list + mental arithmetic about "how much I can still take." Flow targets energy quotas instead of time blocks.

### `projectGoal`
Two goals, deliberately. One — a real product: split the waking day into four circadian blocks derived from the user's wake/rest times; give every task a cognitive weight (Quick 1 / Focused 3 / Deep 6) against a 12-point block capacity; auto-transfer overflow instead of punishing the user; protect wind-down and recovery days. The interface aims for Calm UI — soft M3 tonal rooms, triple accessibility encoding (size + color for weight, shape for priority), light/dark from one token system, EN/RU/ES, and voice as a first-class input. Two — the proof: a live client-side app on Vercel that dogfoods the research findings. What still needs checking with external users beyond the survey: whether the block+weight model reduces guilt in real weeks of use, and whether voice remains the preferred input outside Chromium.

### `targetUsers`
Primary (from research) — knowledge workers and students who plan optimistically and feel guilty by evening: fragmented tools, manual rescheduling, anxiety from long lists. Represented by three research personas grounded in the n=99 survey (Masha, 24 · student; Lora, 32 · employee; Alex, 29 · freelancer). Secondary hypothesis — neurodivergent users who overload on dense lists may benefit from bubble/capacity visuals (not a separate surveyed segment — treated as a design assumption). Working hypothesis for the reader of the case — a hiring manager scanning for research rigor, a clear problem→solution arc, and a live prototype link. Tertiary — anyone evaluating Calm UI / circadian product patterns.

---

## Section 02 — User Research (Discovery)

> Форма: `researchMethodology`, `userStory` (textarea) + `personas` (до 5) + `keyMetrics` (до 3).
> Поля персоны: `nameAndAge`, `role`, `description` (+ опц. `avatarFileId`).
> Поля метрики: `value` (короткая строка), `description`.
> Персоны ниже — **research personas from DEFINE.md**, validated against survey clusters
> (occupation_group, guilt_unified) — not invented marketing avatars.

### `researchMethodology`
I ran a Google UX Design Certificate–aligned Define stage (May 2026) instead of guessing from personal preference alone. (1) Quantitative–qualitative survey (n=99, RU/EN/ES) on planning habits across students, employees, and freelancers/entrepreneurs. Open answers (frustrations n=44, “magic feature” n=23, recovery n=47) were affinity-mapped into six pain clusters: tool fragmentation, notifications that fail, no energy/state awareness, unfinished tasks that pile up, visual overload from dense lists, and non-automatic prioritization. (2) Empathy maps and three personas (Masha / Lora / Alex) tied to those clusters, plus problem statements and eight How-Might-We questions for Ideate. (3) A customer journey (“Alex’s morning”) to locate where Flow can intervene — from waking anxiety at a long list to auto-reschedule when a plan breaks. Desk research framed incumbents (Google Calendar, Notion, Todoist) as time-block machines. Next: moderated usability of the live Day View with 5–7 participants outside the author circle, plus an accessibility pass with screen readers.

Key survey signals used as design constraints (not marketing claims): ~56% manually move or accumulate unfinished tasks; 60% want the tool to account for their state (highest Likert); 43% find day capacity hard to estimate; morning and evening concentration peaks tied at 36% — so blocks must be personal, not “morning-only.”

### `userStory`
When I look at my day and feel the familiar spike of guilt from a list that doesn't care how tired I am, I want to see my tasks as energy I can still spend — grouped into living blocks that match my wake and rest times — so I can do the important work when I have capacity, let overflow move gently, and recover without the plan punishing me.

### `personas` (3) — Research personas (DEFINE.md)

> Grounded in survey clusters; quotes and behaviours map to affinity themes C1–C6.

1. nameAndAge: `Masha, 24` · role: `Student — Group A`
   description: Plans in her head or in messenger; knows mornings are better but rarely uses them. Long lists trigger paralysis; small tasks eat the day; she feels guilty by evening. Needs: know what to do right now without shame for the unfinished. Flow response: Quick/Focused split, auto-transfer, voice input.

2. nameAndAge: `Lora, 32` · role: `Employee — Group A`
   description: Uses a digital calendar plus occasional paper; meetings dictate the grid while deep work slips. Fragmented tools and manual rescheduling drain her; she wants capacity awareness and hands-free capture on the go. Flow response: circadian blocks, 12-pt capacity, Recovery Mode, voice.

3. nameAndAge: `Alex, 29` · role: `Freelancer — Group B`
   description: Builds his own structure; rigid time-blocking turns into guilt when energy drops; tasks snowball until critical. Needs flexible structure that respects recovery evenings and makes real load visible. Flow response: Recovery Mode, flexible blocks, Ideas Bank (planned).

### `keyMetrics` (3)

> Research + implementation facts — not claim that “burnout disappeared for all users.”

1. value: `n=99` · description: Planning-habits survey (RU/EN/ES) that grounded six pain clusters and three personas in DEFINE
2. value: `~56%` · description: Respondents who manually reschedule or let tasks pile up — auto-transfer became a core requirement, not a nice-to-have
3. value: `Live` · description: Client-side app shipped on Vercel (circadian blocks, capacity, Recovery Mode, voice RU/EN/ES) — continuous dogfooding of the research model

---

## Section 03 — Design Process

> Маппинг полей: в схеме БД это `designApproach` (раздел «Section 05: Process»),
> в визарде шага «Design» и на публичной странице — секция **03 Design Process**.
> Форма: одна textarea `designApproach`.

### `designApproach`
Process followed a Design Thinking arc with a research lock at Define. After the n=99 survey and affinity work, Ideate answered the HMW set: especially “start the day without list anxiety,” “account for energy without extra effort,” and “support a hard day instead of punishing unfinished work.” Mobile-first Progressive Enhancement framed the primary canvas as a 2×2 circadian grid (Morning / Afternoon / Evening / Night) — Night is rest-only, never a task slot.

The centre of this case is what changed between early prototype and production — recorded decisions, not accidents: an AI Studio export became a Vite/React app; glassmorphism was removed (May 2026) when blur collided with the physics/performance brief; Google Sans gave way to Inter as the single typeface; Design System 2.0 and then a full M3 token migration made Figma and `tokens.css` the contract; voice moved from a side experiment to a Smart FAB + confirmation dialog with confidence gating; Recovery Mode left a buried settings toggle and gained a visible leaf control in the header; Day View was driven to Figma pixel parity (Oct 2026) — toolbar, navigator, block elevation, amber overload glow. Each divergence is captured in agent constitution files (`.cursorrules`, `CLAUDE.md`) so AI-assisted coding cannot silently reintroduce forbidden patterns (hex hardcoding, red overload, sharp stress shapes, glass blur).

---

## Section 04 — Design System

> Маппинг полей: в схеме БД это `visualDirection`, `displayFont`, `bodyFont`
> (раздел «Section 04: Design System») + `ColorRolePicker` на том же шаге.
> На публичной странице — секция **04 Design System**.
> Форма: textarea `visualDirection` + два input `displayFont` / `bodyFont`
> + выборщик цветовых ролей (seed → палитра).

### `visualDirection`
The concept is Calm UI for mental ecology: four circadian “rooms” with soft pastel containers in light mode and deep recessive chambers in dark mode, while task weights act as gentle light sources (mint / lemon / lavender-rose) — never dopamine-red alarms. Overload is amber only (`--flow-capacity-overload`), because red would punish. Priority is shape, not louder color: circle (low), soft squircle (medium), organic 12-sided “cookie” (high) — a triple accessibility channel with size + color for weight. Glassmorphism is forbidden: backdrop blur was tried and removed for engine/performance honesty. Under the hood it's Material 3 on semantic CSS variables in `tokens.css`, light and dark from one codebase; role over hex is the rule. Hybrid architecture: Standard UI (sheets, settings, dialogs) uses themed MUI; Expressive UI (blocks, bubbles, temporal navigator) uses Tailwind v4 + planned React Aria — no MUI wrappers on the physics canvas. Touch targets follow a Flow calm standard (≥52×52px). Motion uses M3 emphasized curves; Matter.js physics is specified for compact bubbles but degrades to static layout under Recovery Mode or `prefers-reduced-motion`.

### `displayFont`
Inter

### `bodyFont`
Inter

> **Примечание по шрифтовой паре.** Flow использует **один** системный шрифт — Inter
> (SIL OFL 1.1). Display/Body в визарде можно оба указать как Inter; визуальная
> иерархия идёт через M3 type scale (Headline / Title / Body / Label), не через
> второе семейство. Poppins из кейса UX42 сюда не переносить.

### Color Roles (через ColorRolePicker — выбираются в форме, не текст)
Рекомендуемый набор ролей для кейса с их парами **On**. Значения — фактические
из `src/theme/tokens.css` (light `.light` / dark `.dark`). Primary seed семьи —
lavender `#6C538C` (light primary).

| Роль | Light fill | Light On | Dark fill | Dark On |
|---|---|---|---|---|
| `primary` | `#6C538C` | `#FFFFFF` | `#D8BAFB` | `#3C245A` |
| `primary-container` | `#EEDCFF` | `#533B72` | `#533B72` | `#EEDCFF` |
| `secondary` | `#65558F` | `#FFFFFF` | `#D0BCFE` | `#36265D` |
| `secondary-container` | `#E9DDFF` | `#4D3D75` | `#4D3D75` | `#E9DDFF` |
| `tertiary` | `#006A60` | `#FFFFFF` | `#82D5C8` | `#003732` |
| `tertiary-container` | `#CCE7E2` | `#005048` | `#005048` | `#9EF2E4` |
| `error` | `#904A42` | `#FFFFFF` | `#FFB4AA` | `#561E18` |
| `error-container` | `#FFDAD5` | `#73342C` | `#73342C` | `#FFDAD5` |
| `surface` | `#F6F6F6` | `#1D1A20` | `#151218` | `#E7E0E8` |
| `surface-variant` | `#E8E0EB` | `#4A454E` | `#4A454E` | `#CCC4CF` |
| `surface-container` | `#F3ECF4` | `#1D1A20` | `#211E24` | `#E7E0E8` |
| `background` | `#FFF7FF` | `#1D1A20` | `#151218` | `#E7E0E8` |

**Flow-extended (не стандартные M3 roles — для moodboard / captions):**

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--flow-block-morning-container` | `#FFECE2` | deep espresso room | Morning room |
| `--flow-block-afternoon-container` | `#D1E4FF` | deep midnight blue | Afternoon room |
| `--flow-block-evening-container` | `#EADDFF` | velvet purple | Evening room |
| `--flow-block-night-container` | `#C5C4F0` | near-black rest | Night rest zone |
| `--flow-weight-quick-color` | `#A8F2C8` | `#90D5AE` | Quick (1 pt) |
| `--flow-weight-focused-color` | `#FFDEA3` | `#ECC06C` | Focused (3 pts) |
| `--flow-weight-deep-color` | `#EADDFF` | `#B388FF` | Deep (6 pts) |
| `--flow-capacity-overload` | `#FCD34D` | `#FCD34D` | Overload — amber only |

> **Что читает hiring-менеджер:** одна M3-тема + Flow extensions рендерятся в
> light/dark из одного `tokens.css`. Циркадные контейнеры — «комнаты» дня;
> веса задач — мягкие источники света. Overload никогда не красный. On-пары
> рассчитаны под целевой контраст WCAG 2.1 AA; полный аудит AA по всем экранам
> отдельно не заявляется.

---

## Section 05 — Testing & Iteration

> **Маппинг полей:** `description` ← `project.testingProcess`; карточки
> Before/After ← `comparisons` (шаг **showcase**, картинки 4:3 + подписи).
> Секция показывается **только если есть ≥1 comparison**.

### `testingProcess` (description секции — см. примечание про поле в case-ux42)
Testing ran on three levels. Research first: the n=99 survey and DEFINE affinity work set non-negotiable product rules (capacity, auto-transfer, recovery, calm visuals). Then continuous dogfooding on the live Vercel build plus a written voice/localization test plan — TTS→STT loop fixed; confidence fallback and update-command patterns iterated when confirmation dialogs fired too often. Product iterations visible in git are the before/after below: glassmorphism out; Recovery Mode surfaced; Day View brought to Figma parity; overload language shifted to amber care. Accessibility: designed with WCAG 2.1 AA as a target — semantic contrast pairs, ≥52px targets, `prefers-reduced-motion` kills physics — not a claim of a full WCAG audit. Formal moderated usability with external participants (5–7) remains the planned next research gate.

### `comparisons` (Before/After — шаг showcase, нужны скриншоты 4:3 «до/после»)
Рекомендуемый набор (центральный блок кейса — решения с последствиями):

1. featureName: `Glass → Calm tokens` · beforeText: `Translucent glassmorphism layers looked trendy but fought performance and the Calm UI brief.` · afterText: `Glass removed (May 2026). Opaque M3 tonal rooms + semantic tokens in tokens.css — light and dark from one contract.` *(скрины: early glass UI / current Day View)*
2. featureName: `Recovery visibility` · beforeText: `Recovery lived as a buried settings concept — easy to miss on a hard day.` · afterText: `Leaf ↔ Refresh control in the header; tri-state override so the user can exit recovery without fighting the clock.` *(скрины: settings-only / header leaf)*
3. featureName: `Overload language` · beforeText: `Capacity overflow risked reading as failure (harsh alert semantics).` · afterText: `Dual amber boundary + supportive transfer snackbar — overflow redirects, never punishes. Red is forbidden.` *(скрины: overloaded block amber glow + transfer notice)*

> Дополнительно (если есть слоты): long-press bubble sheet → single tap TaskSheet;
> voice mic alone → Smart FAB + confidence confirmation; list-only day → 2×2
> circadian grid with weight bubbles.

---

## Section 06 — Final Design

> **Маппинг полей:** `description` ← `finalDescription` (шаг showcase);
> `results` (ResultsCard) и `tools` (TagBadge) — шаг **results**; финальная
> галерея — ассеты `final_gallery` (шаг gallery).

### `finalDescription`
One product shaped by research and proved in a live client-side build — that's the honest scope. A user sets wake and rest once, lands in a four-block day that matches their biology, adds tasks by voice or TaskSheet, and sees load as points and shapes instead of an accusing checklist. Overflow moves; wind-down and recovery days protect the evening; light and dark share one token spine.

**Built and verified:** circadian blocks from wake/rest; Quick/Focused/Deep weights with 12-pt capacity and auto-transfer; Recovery Mode + Wind Down; Day/Week/Month/Year views; voice commands RU/EN/ES (Web Speech API); fade-in alarm; M3 light/dark tokens; Figma-parity Day View shell (Oct 2026); live demo on Vercel.

**Still to validate / ship:** Matter.js bubble physics (spec ready; spring prototype / not fully installed); left-handed biomechanics end-to-end; Ideas Bank & Smart Day Planner beyond toolbar stubs; recurrence instance generation; real auth/sync (Supabase); AI weight suggestion via proxy; moderated external usability + screen-reader study.

Under the hood: React 19 + Vite + hybrid MUI / Tailwind v4, all state in `App.tsx`, persistence in `localStorage` — privacy by architecture for the current phase.

### `results` (шаг results → ResultsCard, 2-col)

> Research + implementation checks — not product-market outcomes.

- `Define research shipped: n=99 survey → 6 clusters, 3 personas, 8 HMW`
- `Live Vercel demo: circadian capacity model + Recovery Mode + voice RU/EN/ES`
- `M3 token SSOT (tokens.css) — light/dark, no glassmorphism, amber overload only`
- `Figma-parity Day View shell (toolbar, navigator, blocks) — Oct 2026`

### `tools` (шаг results → TagBadge)
Figma · Material Design 3 · NotebookLM · Cursor · React 19 · Vite · Tailwind CSS v4 · MUI · TypeScript · Web Speech API · Vercel

### Финальная галерея (ассеты `final_gallery`, шаг gallery — нужны скриншоты)
Рекомендуемый набор: Day View 2×2 (desktop + mobile) · dark/light одной сетки · overloaded amber block · Recovery banner + leaf toggle · TaskSheet add flow · Voice FAB listening · Week heatmap · Settings wake/rest · triple-encoding bubbles (Quick/Focused/Deep × shapes).

---

## Section 07 — Reflection & Next Steps

> **Маппинг полей:** `keyTakeaway` (textarea) и `nextSteps` (массив `content`)
> редактируются в шаге **`review/`**.

### `keyTakeaway`
The strongest lesson is that mental-health-adjacent interfaces fail when they borrow productivity's visual aggression. Flow only became coherent when research numbers forced product rules: capacity limits, auto-transfer, recovery, and a ban on red/glass/sharp shapes — not because a trend deck said so, but because ~56% already drown in manual rescheduling and 60% ask for state-aware tools. Pairing survey rigor with a live build kept the case honest: what is verified is that the model can be shipped and dogfooded; what is still unknown is whether weeks of real use cut evening guilt for people who are not the author. Two things I'd keep: treat design tokens as the Figma↔code contract (role over hex), and write agent constitutions so AI coding cannot reintroduce forbidden patterns. One thing I'd change: I would schedule moderated usability earlier — the survey answered “what hurts,” but only external sessions can answer “does this grid heal it.”

### `nextSteps` (шаг review → NextStepsList, поле `content`)
- `Run moderated usability of Day View + voice with 5–7 participants outside the author circle — validate capacity comprehension and guilt reduction.`
- `Finish expressive-layer a11y: React Aria integration, screen-reader pass, left-handed biomechanics end-to-end.`
- `Ship Matter.js compact bubbles with forced static fallback under Recovery / prefers-reduced-motion.`
- `Add Supabase sync + AI weight suggestion via a server proxy — keep API keys off the client.`

---

## TL;DR (`/short`)

> **Как это работает в платформе:** `/short` **не заполняется вручную** — он
> авто-генерируется из метаданных кейса. Здесь — чего ожидать в авто-сводке.

**Что попадёт в авто-сводку (из полей кейса):**
- Заголовок: `How I Designed & Built Flow — a Circadian Productivity Calendar`
- Тизер (overview: research → role → live + next validation) + роль + срок (`2026 · Jan – Oct`)
- 3 ключевые метрики: `n=99` · `~56%` · `Live`
- Теги: Product Design, UX Research, Design System, Circadian UX, Material Design 3, React, Accessibility, Voice UI
- Ссылка на полный кейс + PDF

**На что обратить внимание, чтобы TL;DR вышел сильным:**
- `teaser` и `myRole` — research rigor + live demo, без неподтверждённых «burnout cured».
- Метрики — survey + shipped facts, не 84%/67% из устаревшего черновика.
- Live URL обязателен: hiring-менеджер должен открыть прототип в один тап.

---

## Приложение: чек-лист скриншотов (пункт B)

> Рабочий чек-лист (не контент кейса). Соотношения как в `case-ux42-platform.md`.

| Слот / куда | Соотношение | Пиксели (реком.) | Где загружать |
|---|---|---|---|
| Hero-обложка (Section 00) | `16:9` | 1920×1080 | Шаг **General** (`coverFileId`) |
| Wireframe (Section 03) | paper / lo-fi 2×2 grid | — | Только если есть реальные lo-fi; иначе секция text-driven |
| Moodboard (Section 04) | свободная сетка | по ячейкам | Шаг **Gallery** → тип `moodboard` |
| Before/After (Section 05) | `4:3` каждая | 1600×1200 | Шаг **Showcase** → `comparisons` |
| Final gallery (Section 06) | загрузка `4:3` | 1920×1080+ | Шаг **Gallery** → тип `final_gallery` |
| OG-обложка | — авто | — | Не грузить руками |

**Что снимать (под этот кейс):**
- **Hero — 1 кадр (16:9):** Day View 2×2 с пастельными блоками — самый «продуктовый» кадр circadian UI.
- **Section 04 Moodboard:** morning peach + afternoon blue + evening lavender · mint/lemon/rose weights · Inter type · amber overload swatch · cookie shape silhouette.
- **Section 05 Before/After — 3 пары (4:3):**
  - (1) Glass UI → Calm M3 tokens
  - (2) Buried recovery → header leaf toggle
  - (3) Harsh/full list anxiety → capacity + amber overload + transfer snackbar
- **Section 06 Final — 6–8 кадров:** Day mobile · Day desktop · dark theme · TaskSheet · Voice FAB · Week heatmap · Settings wake/rest · bubble shapes strip.

**Приоритет (если времени мало):** 🔴 Hero + Section 06 (mobile/desktop + dark) · 🟠 3 Before/After · 🟡 Moodboard.

---

## Чек-лист обновления живого кейса

> Пройти визард проекта `building-flow-calendar` (или актуальный slug) и вставить
> тексты из этого файла. D1/админку агент не меняет — только копипаст.

| Шаг визарда | Поле | Обновить? | Заметка |
| --- | --- | --- | --- |
| General | все поля шапки | Да | Live URL = flow-nine-xi.vercel.app |
| Problem | `problemStatement` / `projectGoal` / `targetUsers` | Да | Вклад + DEFINE numbers |
| Research | methodology + personas + metrics | Да | Только n=99 / ~56% / 60% / 43% |
| Design | `designApproach` | Да | Решения до/после, не «идеальный процесс» |
| Design System | `visualDirection` + fonts + colors | Да | Inter/Inter; lavender primary |
| Showcase | `finalDescription` + `comparisons` | Да | Built vs Still to validate |
| Results | `results` (4) + `tools` | Да | Research + implementation framing |
| Review | `keyTakeaway` + `nextSteps` | Да | Honest unknown = external UT |
| — | `testingProcess` | Отложено | Поле в UI UX42 может быть не подключено; текст готов выше |

После сохранения: открыть публичный кейс + `/short`, перепроверить TL;DR и PDF.

---

## Статус документа

✅ Секции 01–07 + TL;DR — собраны по шаблону `case-ux42-platform.md`.
✅ Метрики и персоны сверены с `Flow-calendar/docs/CURRENT/DEFINE.md` (не со старым make-export черновиком).
✅ Live/stack сверены с README + git timeline (Jan–Oct 2026; M3 May; Figma parity Oct).
✅ Разделены подтверждённое / гипотезы / next validation.
⚠️ Открытые нюансы для ручной правки автором:
- Если были формальные UT на 5 человеках — добавить в Section 05 с датой/протоколом; сейчас заложено как next step.
- Скриншоты Before/After ещё не приложены — нужны кадры из Figma/history.
- Repo host `denzakh/flow` — только URL; в текстах кейса вклад Denis не указывается (solo + AI).
