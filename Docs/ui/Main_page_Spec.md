# Main Page — Layout Specification (актуализированная)
Updated: 2026-08-28 — тело переписано по фактическому состоянию кода
Figma-эталон: Portfolio UX42 (U5OjywCHbtzQgBsi7PU25r), узел 124:575 «Main Page»
Make-эталон (хедер/карточки/кнопки): Docs/make-export/ (архив «UX42 Den (Copy)»)

СТАТУС: тело спеки = текущий код, это источник правды. История решений — §13
(сжатый архив). Пер-компонентные спеки Docs/ui/*_Spec.md описывают Figma-
происхождение; где реализация осознанно отклоняется, в начале файла стоит
баннер-указатель на действующий раздел этого документа.

---

## 1. Архитектура страницы (контейнерная модель)

Паттерн Figma: Section (full-bleed) → container → Content Slot.
Предложение Дениса, подтверждено структурой эталона 124:575.

- Блок-секция тянется на всю ширину экрана, несёт фон + вертикальный паддинг:
  py 48px (mobile) / 96px (desktop); hero и CTA — 120px (desktop).
- Контент — внутри .section-container (globals.css):
  max-width 1200px, margin-inline auto;
  padding-inline: 16px mobile (<768) / 32px tablet (>=768) / 64px desktop (>=1024).
  Планшетный паддинг в Figma отсутствует — 32 назначено, зафиксировано решением (2).
- Старая теневая колонка (max-w-container-content + box-shadow) со страницы
  убрана; кейс-страницы пока на прежней колонке — визуальной разницы нет
  (1200 − 2×64 = 1072 = тот же контент).
- Якоря секций: #portfolio / #about / #contact; глобально
  [id] { scroll-margin-top: 104px } — 96px шапка + воздух (решение (3)).
- Канвас страницы (body) = surface-container-lowest — тот же цвет, что у
  блоков (свет #ffffff / тьма #0e0e0f), решение (12). Футер остаётся на
  --background (#f7faf5 / #101412).

---

## 2. Header — sticky glass

Реализация: SiteHeader.tsx (варианты default и breadcrumb — один паттерн).

  Position:   sticky top-0 z-40 (контент скроллится под шапкой)
  Высота:     96px (py-16 + строка контента h-64)
  Контент:    .section-container — выровнен по колонкам секций
  Зоны:       nav Work/About (gap 24) | имя дизайнера (центр) | ThemeToggle + CTA (gap 24)

Стекло:
  фон/тень → класс .header-glass (globals.css):
    light rgba(247,250,245,0.70); dark rgba(10,10,10,0.70) ([data-theme='dark']);
    тень 8/8/20/8% (light), 8/8/20/25% (dark).
  blur → ТОЛЬКО utility-классами на <header>:
    backdrop-blur-md (=12px) + backdrop-saturate-[1.8].
    ВНИМАНИЕ: backdrop-filter в .header-glass не возвращать — LightningCSS
    (Tailwind v4, таргеты Safari<18) схлопывает пару «стандартное+префиксное»
    до одного -webkit- → блюр молча умирает в Firefox. Утилиты эмитят ОБЕ
    формы свойства (решение (7)).
  Шкала альфы: 0.88 деликатная / 0.70 текущая / 0.50 «как в Make» (решение (8)).

Содержимое:
  NavLink «Work» → /u/[slug]; «About» → /u/[slug]#about.
  Inter Regular 16/24 (text-body-md), on-surface-variant; hover color-only → on-surface.
  Центр: имя (логин) дизайнера — displayName, Poppins Medium title-lg, text-primary,
  link на /u/[slug]. Логотипа UX42 в шапке нет — перенесён в футер (§9).
  ThemeToggle: круг 48×48, иконка 24 (Sun/Moon), on-surface-variant;
  hover color-only → text-primary (150ms). Без заливок и рамок (решение (11)).
  CTA «Hire me» → #contact: пилюля h-14 px-8, text-primary, фон/бордер прозрачны;
  hover: появляется border-primary-container + opacity-90 (border-transparent
  держит место — layout не сдвигается), 150ms (решение (10)).

---

## 3. Hero

Реализация: HeroSection.tsx. Фон surface-container-lowest (белый, решение (1)),
FloatingElements (20 шт, blur 0–20).

  min-height: calc(100dvh − 96px) — первый экран целиком (решение (4));
  dvh — корректно на мобильных с динамическим адресным баром.
  flex items-center — вертикальное центрирование контента.
  py 48/96/120 — гарантированные отступы на малых экранах.

Контент (.section-container, flex-col gap-64):
  H1: Poppins Medium 68/76, tracking −0.25px, on-surface-variant;
      accent-часть — градиентная заливка текста primary (bg-clip-text);
      строчный поток с явными пробелами (абсолютное left:566 из Figma не переносится).
  Subtitle: Inter Regular 18/28 (text-body-lg), max-w 734px, on-surface.
  Кнопки (gap-16): primary solid + secondary outline — состояния в §10.

---

## 4. Разделители секций (NavLabel)

Реализация: локальный компонент NavLabel в page.tsx. Ставится между секциями
Work / About / Skills / Reach (перед первой — обёртка pt-6).

  Контейнер: .section-container, flex items-center gap-16px, py-0
  Label:     Inter SemiBold 11px, uppercase, leading-4,
             tracking 0.0455em (~0.5px), text-outline-variant (#c5c6cc)
  Divider:   flex-1, h-1px, bg rgba(140,213,179,0.16) — единственный
             санкционированный хардкод (до появления токена в globals.css)

---

## 5. Portfolio Gallery

Реализация: PortfolioGallerySection.tsx. id="portfolio".
Секция: bg-surface-container-lowest, py 48/96.
Контейнер: flex-col items-center gap-64.

  Header (центр, gap-32): H2 «Portfolio» — Poppins Medium display-sm (52/65);
  subtitle — text-body-lg, on-surface-variant.
  Filters (gap-12, flex-wrap): чипы pill px-24 py-12, text-label-md —
  состояния в §10.
  Grid: grid-cols 1 / 2 (sm) / 3 (lg), gap-24. Ячейка ≈341px = (1072−48)/3.
  Карточка: PortfolioCard — см. Portfolio_Card_Spec.md (переписан 2026-08-28).

---

## 6. About

Реализация: AboutSection.tsx. id="about". bg белый, py 48/96.
Колонки: 516px + gap-40 + 516px = 1072 ✓ (lg; на мобиле — стопка).

  Left:  placeholder rounded-3xl bg-surface-container-low p-7,
         растягивается по высоте правой колонки.
  Right: H2 display-sm on-surface; параграфы text-body-lg
         on-surface-variant, gap-16.

Backlog: декоративные блобы вместо плоского placeholder — §12/i.

---

## 7. Skills

Реализация: SkillsSection.tsx. bg белый, py 48/96.
Колонки: 502 + 40 + 530 = 1072 ✓ (lg).

  Заголовки колонок: title-sm, on-surface-variant
  («Areas of expertise», «Tools», «My process»).
  Теги: TagBadge variant="outlined" size="lg" — Inter Medium 16/24,
  bg white (surface-container-lowest), border primary/16,
  px-12 py-6, radius 10, on-surface-variant (эталон make-export;
  дефолт 13px — только case-страницы, см. Tag_Badge_Spec.md).
  Process: бейдж 32×32 круг, border-2 primary, bg-surface, номер 11px
  semibold tracking 0.5; title label-lg semibold on-surface;
  description body-sm on-surface-variant; шаги gap-24.

---

## 8. CTA «Get in touch»

Реализация: CtaSection.tsx. id="contact". bg белый, py 48/96/120,
FloatingElements (20).
Контент: центр, flex-col gap-32.

  Label «Reach»: 11px Inter SemiBold uppercase tracking 0.0455em,
  text-outline-variant.
  H2: display-sm, on-surface.
  Body: строки text-body-md on-surface, gap-4.
  Кнопки (gap-16, wrap): Email — primary solid с иконкой Mail 24;
  WhatsApp — outline pill h-14 (secondary-семейство), target=_blank.

---

## 9. Footer

Реализация: SiteFooter.tsx. bg-background (#f7faf5), py 48/64,
.section-container, flex-col gap-32.

  Row 1 (justify-between, items-start):
    Бренд: логотип «UX42.studio» → / (Poppins title-lg text-primary;
    перенесён из шапки, решение (2)); имя дизайнера (title-lg on-surface);
    headline (label-md on-surface-variant).
    Соц-иконки: круги 44, ghost → hover opacity-70.
    Legal: Privacy / Terms / Cookies (h-44, text-body-md), ghost → opacity-70.
    Back to Gallery: outline pill h-12 px-6 rounded-full, border-outline-variant,
    label-lg text-primary → hover заливка rgba(11,110,79,0.05) + opacity-90.
  Row 2: border-t outline-variant, pt-24 —
    «© YYYY UX42.studio. All rights reserved.» (label-md).

---

## 10. Кнопочная система — единый паттерн состояний

Осознанное отклонение от Figma-спек кнопок (Primary/Secondary/Ghost/Filter/Link)
— решения (9)–(11). Референс — primary: hover opacity-90, transition 150ms
ease-out; active-состояний нет; focus-visible только где был (чипы, карточка).
Тёмная тема: отдельных dark-заливок нет — opacity и тени работают в обеих темах.

  SOLID (primary hero, email CTA, view-all, выбранный чип):
    bg-primary (чип — bg-surface-tint #056c4d), text-on-primary,
    тень 2/2/4/10% → hover: opacity-90 + тень 4/4/12/20%.
    transition [box-shadow, opacity].
  OUTLINE (hero secondary, WhatsApp, Back to Gallery):
    border-primary-container (Back to Gallery — outline-variant), белая заливка,
    та же тень → hover: заливка rgba(11,110,79,0.05) + opacity-90 + рост тени.
    transition [box-shadow, opacity, background-color].
  PILL-GHOST-BORDER (Hire me):
    прозрачные фон и бордер → hover: border-primary-container + opacity-90.
    transition [border-color, opacity]. border-transparent держит место.
  GHOST (legal-ссылки, соц-иконки):
    hover opacity-70 (90 на прозрачных фонах не виден).
  COLOR-ONLY (nav-ссылки, ThemeToggle):
    hover меняет только цвет: nav on-surface-variant → on-surface;
    toggle on-surface-variant → primary.

Чипы фильтров: selected = SOLID-семейство; unselected = bg-surface/8,
hover заливка rgba(11,110,79,0.1) (transition-colors, без opacity).

---

## 11. FAB

Реализация: FAB.tsx — зелёный (розовый #ffb3b1 из эталона не переносился,
§12/f), 64×64, rounded-full, z-50 (выше шапки z-40), ведёт на #contact.

---

## 12. Backlog — находки эталона 124:575, не перенесённые в код

  a. Hero Stats row (gap 48): «10+ / MSc / NGO» — значение Poppins 26/34
     accent, подпись Inter 14/22 ls 0.4, muted.
  b. Pro Bono Banner после Skills: full-width card r24, bg
     surface-container-low, pad 28, Inter 16/24 ls 0.25 + Secondary.
  c. CTA WhatsApp — РЕАЛИЗОВАНО (outline pill, §8).
  d. Градиентные primary-кнопки #00543b → #336210 — в коде solid.
  e. Чипы фильтров 13px Medium ls 0.5, selected = инверсия
     (#003826 на #83d7b1) — в коде label-md (14px) + solid tint.
  f. Розовый FAB (#ffb3b1, иконка #410007) — в коде зелёный.
  g. «next case →» Ghost-кнопка в BlockLabel-разделителях.
  h. Footer по эталону: socials gap 20, legal Inter 16/24 ls 0.25,
     divider white/10 (dark), copyright 13 Medium ls 0.5.
  i. About: декоративные блобы с микро-копией вместо плоского placeholder.

---

## 13. История решений — архив 2026-08-27 (сжато)

Полные формулировки — в предыдущих ревизиях файла (git-история, бэкап).

  (1)  Первая сверка: фон Hero/CTA = белый; страйки секций не реализованы;
       BlockLabel #c5c6cc / 0.5px; карточка резиновая (334 — intrinsic);
       картинка top-aligned h-256; хардкод divider; hero-заголовок inline-flow;
       якоря #portfolio/#about/#contact.
  (2)  Новый эталон 124:575 + контейнерная архитектура .section-container
       (16/32/64); header: displayName в центр, лого → футер; backlog a–i (§12).
  (3)  Header sticky + стекло по рецепту Make (blur-md) + .section-container
       внутри; scroll-margin-top 104px.
  (4)  Плотность шапки (0.9/0.9 — позже пересмотрено); Hero = 100dvh − 96px.
  (5)  Стекло по вердикту агента Make: градиент 0.88→0.10, blur 4px, тёмная
       тень 25%.
  (6)  Диагноз Дениса: оба края 0.88 (равномерная плашка), blur 12px +
       saturate 180%.
  (7)  Блюра не было вовсе: LightningCSS (таргеты Safari<18) вырезал
       стандартный backdrop-filter из literal-правила, оставив только
       -webkit- (мёртво в Firefox). Fix: blur/saturate — utility-классами
       на <header>; .header-glass = только фон/тень.
  (8)  Альфа 0.88 → 0.70 (обе темы).
  (9)  Карточки по make-export (белый корпус, scale 1.02/500ms, zoom 110/700ms,
       градиент from .9 / via .5, overlay-заголовок убран) + кнопки: единый
       opacity-паттерн (solid/outline 90, ghost 70), WhatsApp и
       Back to Gallery — pill.
  (10) Тени уравнены (primary = secondary: 2/2/4/10 → 4/4/12/20); secondary
       hover = заливка 5%; чипы unselected = заливка 10%; Hire me — pill h-14
       + border-on-hover; карточки: flex-1 у текстовой зоны + truncate.
  (11) ThemeToggle: сначала border-паттерн Hire me, финал — color-only hover
       (hover:text-primary), без заливок и рамок.
  (12) 2026-08-28: канвас страницы (body) → surface-container-lowest — тот же
       цвет, что у блоков (свет #ffffff / тьма #0e0e0f). Фидбэк: стык стеклянной
       шапки с белым хиро читался грязновато; футер остался на --background
       (#f7faf5/#101412). Тёплый розоватый оттенок при скролле дают также
       лавандово-лаймовые блобы Hero (#a29ffe/#c084fc/#ccff00) под стеклом —
       отдельное решение, не входящее в (12).
