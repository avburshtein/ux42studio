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
  [id] { scroll-margin-top: 80px } — 72px шапка + воздух (решения (3), (18)).
- Канвас страницы (body) = surface-container-lowest — тот же цвет, что у
  блоков (свет #ffffff / тьма #0e0e0f), решение (12). Футер остаётся на
  --background (#f7faf5 / #101412).

---

## 2. Header — sticky glass

Реализация: SiteHeader.tsx (варианты default и breadcrumb — один паттерн).

  Position:   sticky top-0 z-40 (контент скроллится под шапкой)
  Высота:     72px (py-2*2 + строка контента h-14=56; решение (18) — стандарт
              индустрии 56–72px, было 96px) / 64px mobile (<768: py-2 + h-12)
  Контент:    .section-container — выровнен по колонкам секций
  Зоны:       nav Work/About (gap 24) | имя дизайнера (центр) | ThemeToggle + CTA (gap 24)

Mobile (<768) — решение (13):
  nav и CTA скрыты; имя дизайнера (h-12) слева; справа ThemeToggle + бургер
  (круг 48, Menu/X 24, hover color-only как ThemeToggle). Бургер открывает
  панель fixed inset-x-0 top-16: Work / About / Hire me (primary, w-full,
  тач-цели 48px) + backdrop fixed top-16 h-[calc(100dvh-64px)] bg-black/40.
  top-16 — потому что backdrop-filter шапки создаёт containing block для
  fixed-потомков (filter-effects-2); шапка sticky прижата к top:0, поэтому
  top-16 корректен при любой трактовке CB. Панель и backdrop — внутри <header>
  (z-10/z-0), рендерятся только в открытом состоянии.
  Breadcrumb-вариант <768: бэк-кнопка + название кейса вместо wordmark
  (wordmark и CTA скрыты), ThemeToggle остаётся.

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

  height: 100dvh — хиро вытянут до самого верха страницы, под sticky-шапку
  (решение (17)): −mt-16/−mt-[72px] = высота шапки (64/72px, §2 (18)) — белый фон
  и bokeh-элементы видны сквозь её стекло.
  Контент на прежнем месте: pt = высота шапки + прежний py
  (112 / 168 / 192), pb 48/96/120 — контент-бокс не сдвинут, центр
  вертикального центрирования (items-center) совпадает с прежним;
  нижний край хиро по-прежнему на 100dvh.
  dvh — корректно на мобильных с динамическим адресным баром.

Контент (.section-container, flex-col gap-64):
  H1: Poppins Medium 68/76, tracking −0.25px, on-surface-variant;
      accent-часть — градиентная заливка текста primary (bg-clip-text);
      строчный поток с явными пробелами (абсолютное left:566 из Figma не переносится).
  Subtitle: Inter Regular 18/28 (text-body-lg), max-w 734px, on-surface.
  Кнопки (gap-16): primary solid + secondary outline — состояния в §10.

Mobile:
  H1 — text-[40px]/[48px] → lg: 68/76 (Poppins Medium, tracking −0.25
  наследуется; 40px вместо 37.5 display-sm — читаемость на 375px);
  subtitle — text-body-lg без уменьшения (body, не заголовок);
  кнопки — flex-col items-center gap-4 → sm: flex-row; hug на всех ширинах
  (авто-ширина по контенту, решение (14) — w-full не используется);
  min-h: 100dvh — хиро до потолка под шапкой (решение (17)).

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

Mobile (решения (13)–(16)):
  Карусель <sm: strip с односторонним bleed — слева карточки выровнены по
  полю контейнера, справа bleed до самого края экрана без правого поля
  (-mr-4 + pr-4): карточка шире — w-[calc(100%-16px)] (327px @ 375),
  за ней gap-4 и краешек следующей (16px) вплотную к краю экрана.
  snap-x snap-mandatory, snap-start, gap-4, shrink-0, скроллбар скрыт;
  без стрелок/точек. Тень карточки (вылет ~20px вниз) не срезается
  скроллером: pb-7 внутри + −mb-5 снаружи (ритм прежний), sm:mb-0 — сброс.
  ≥sm — grid-cols-2 (gap-4), ≥lg — grid-cols-3 (gap-6).
  Фильтры <md: нативный <details> (серверный disclosure, без JS):
    summary — pill h-14 (secondary-стиль): Filter 20 + «Filters» +
    ChevronDown 16 (group-open:rotate-180), hover — зелёная заливка 5%;
    панель — mt-4 rounded-3xl p-6 border outline/40, чипы §10
    (justify-start, aria radio-модель сохранена);
  ≥md — прежний ряд чипов (§10) — планшетам (640–1023) disclosure не показывается.

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

  H2: display-sm, on-surface.
  Body: строки text-body-md on-surface, gap-4.
  Кнопки (gap-16, wrap): Email — primary solid с иконкой Mail 24;
  WhatsApp — outline pill h-14 (secondary-семейство), target=_blank.
  Все кнопки hug (авто-ширина по контенту) на всех брейкпоинтах —
  решение (14).

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
    мягкая тень 0/4/8/15% → hover: opacity-90 + тень 0/8/16/20% (27).
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
  (13) 2026-08-29 — Адаптив главной (mobile-first):
       Hero: H1 40/48 → lg:68/76 (40px — deliberate-отклонение от display-sm
       37.5 ради читаемости на 375px); кнопки стопкой до sm;
       min-h −64px (мобильная шапка) → md:−96px → md:−[72px] в (18).
       Gallery: <sm карусель (snap-x, bleed −mx-4, basis-85%, snap-center,
       скроллбар скрыт) → sm:grid-2 → lg:grid-3; фильтры <md — нативный
       <details>-disclosure (pill + панель чипов, без JS) → md: ряд чипов
       (уточнено в (14)).
       About/CTA: H2 32/40 → lg:display-sm; кнопки CTA стопкой до sm.
       Header: 96 → 64 (<768: py-2, wordmark h-12); nav+CTA скрыты, бургер
       (круг 48, Menu/X) → панель fixed top-16 + backdrop (учёт containing
       block от backdrop-filter — см. §2); case-вариант: бэк-кнопка +
       название кейса вместо wordmark. ThemeToggle/Hire me не изменены.
       Брейкпоинты по смыслу блоков: sm 640 (кнопки/карусель), md 768
       (шапка, фильтры), lg 1024 (заголовки, колонки) — между опорными
       375/1440.
  (14) 2026-08-29 — Финализация адаптива по фидбэку:
       Кнопки — hug (авто-ширина по контенту) на всех брейкпоинтах: убраны
       w-full и sm:w-auto (hero primary/secondary, CTA email/whatsapp, Hire me
       в мобильном меню); вертикальная стопка на узких сохранена
       (flex-col → sm:flex-row). Фильтр-disclosure перенесён с <lg на <md —
       планшетам (640–1024) вернули ряд чипов. Из CTA удалён внутренний
       лейбл «Reach» (проп label + рендер); разделитель NavLabel «Reach»
       над секцией сохранён.
  (15) 2026-08-29 — Второй виток по фидбэку (скриншот десктопа):
       Причина распирания «Get in touch» на десктопе — w-full у secondary,
       оставшийся после (14); снят, primary больше не сжимается флексом
       (2-строчный перенос текста исчез). Страховка: whitespace-nowrap на
       всех пилюлях (hero primary/secondary, CTA email/whatsapp). CTA-контейнер
       получил items-center (кнопки не тянутся в колонке). Back to Gallery —
       self-start + nowrap (футерная колонка растягивала кнопку и переносила
       текст на мобильных). Карусель v2: односторонний bleed (слева по
       контейнеру, справа -mr-4 + pr-4), карточка w-[calc(100%-32px)]
       (327px @ 375, peek соседа ~16px), snap-center; Image sizes =
       «(min-width: 640px) 341px, calc(100vw - 48px)» — точно по геометрии.
  (16) 2026-08-31 — Карусель v3 по фидбэку (мобильный скриншот). Зелёная
       пометка — левое поле контейнера ок (не тронуто). Оранжевая — карточку
       шире, «паддинг справа» убрать совсем, сосед виден хоть немного:
       причина — ошибка расчёта basis, 100% резолвился от контент-бокса
       скроллера уже С УЧЁТОМ bleed −mr-4 (pr-4 в % не входит) → фактически
       карточка была 311px @ 375, а не 327. Новый basis = calc(100%−16px):
       карточка 327px, справа только gap-4 и 16px соседа вплотную к краю
       экрана (белой полосы перед ним больше нет). Красная — тень карточки
       срезалась скроллером (overflow-x-auto + pb-2=8px при вылете тени
       ~20px вниз): pb-7 (28px) внутри + компенсация −mb-5 снаружи — тень
       видна, вертикальный ритм (8+64) сохранён; на ≥sm сброс sm:mb-0.
       Image sizes «calc(100vw − 48px)» совпал с новой шириной — без правок.
  (17) 2026-08-31 — Хиро «до потолка» (фидбэк: bokeh-элементы должны быть
       видны и под стеклянной шапкой). −mt-16/−mt-24 (= высота sticky-шапки
       64/96, §2) + min-h 100dvh: фон и FloatingElements заходят под стекло.
       Контент не сдвинут: верхний паддинг увеличен ровно на высоту шапки
       (pt 112/192/216 = шапка + прежние py 48/96/120) — контент-бокс и
       центр items-center совпадают с прежними на всех брейкпоинтах, нижний
       край хиро остался на 100dvh (пропорции первого экрана те же).
       Шапка z-40 поверх (hero z-auto); overflow-hidden hero обрезает bokeh
       по новой верхней границе y=0.

  (18) 2026-09-02 — Высота шапки 96 → 72px desktop (фидбэк: «толстовата»;
       стандарт индустрии 56–72px). py-4→py-2 + контент md:h-16→h-14
       (wordmark/имя; ThemeToggle h-12 и CTA h-14 уже вписываются).
       Mobile 64px не тронут. Зависимости синхронизированы: hero-офсеты
       −mt-24→−mt-[72px], pt 192→168 (md:pt-42) / 216→192 (lg:pt-48);
       scroll-margin-top 104→80px. Контент-бокс хиро не сдвинут.
  (19) 2026-09-02 — Главная страница пересобрана в визуальном языке
       страницы дизайнера (root = (public)/page.tsx): AuthBar + SiteHeader
       (новые опциональные пропсы navItems/wordmarkText/wordmarkHref;
       profileSlug стал опциональным) → HeroSection (копирайт студии,
       CTA View our work #work / Get in touch #contact) → Work (NavLabel,
       H2 32→display-sm, чипы-фильтры категорий 1:1 с галереей дизайнера,
       grid 1/2/3 из PortfolioCard; tag = имя дизайнера, overlayTags =
       категории; проекты без coverFile не рендерятся) → Studio (#studio:
       Stats 10+/MSc/NGO display 52px + Pro Bono Banner bg-primary
       rounded-24, кнопка Start a project) → CtaSection (email) →
       SiteFooter (profileSlug/profileName опциональны: на главной без
       Back to Gallery и имени, только бренд + headline). Старый каталог
       (ProjectCard/PageTitle) удалён вместе с задачей.
  (20) 2026-09-02 — Главная: CTA «Hire me» заменён бургер-меню (menuMode):
       правая slide-over панель для посетителя по исходнику главного сайта —
       заголовок Menu + nav (Work/About + Contact) + Sign In / Sign Up
       (/login) + legal (Privacy/Terms/Cookies). Панель рендерится через
       createPortal(document.body): backdrop-filter шапки создаёт containing
       block — внутри <header> fixed-панель обрезалась бы до 72px. Старое
       мобильное dropdown-меню в menuMode отключено (панель универсальна).
       Заодно убран «блуждающий n» — текстовый узел-остаток склейки файла
       страницы (фидбэк со скриншота).

  (21) 2026-09-04 — Главная пересобрана по исходнику главного сайта
       (HomeDesktop): взяты секции Hero (2), Approach (4, паттерн Layout2
       «Human insight meets intelligent tools») и CTA (10). Блоки Work/Studio
       и карточки каталога сняты до отдельного решения (фидбэк: «карточки
       пока не берём»). Новый компонент ApproachSection (portfolio/):
       тэглайн Approach (label-md uppercase) + градиентный H2
       (from-primary → #2C5A07, 32→52px) + текст + primary-пилюля
       Start a project (#contact); справа/сверху (mobile order-1) —
       градиентная панель rounded-24 с FloatingElements вместо фото (ассетов
       в public нет). Адаптив — по странице дизайнера: mobile — визуал
       сверху, текст снизу; lg — 2 колонки (текст слева). Hero: primary-CTA
       теперь «Our approach» → #approach (якоря #work/#studio удалены).
       Nav: Approach/Contact. page.tsx больше не обращается к БД
       (revalidate/db-импорты сняты), страница статическая.
  (22) 2026-09-04 — Каталог возвращён по фидбэку («верни галерею»):
       Work (фильтры + PortfolioCard) и Studio (Stats + Pro Bono) полностью
       восстановлены из коммита b0e8dca~1 (решение (19)). Approach остался
       между Hero и Work. Итоговый состав: Header → Hero (View our work
       → #work) → Approach → Work (#work) → Studio (#studio) → CTA → Footer.
       Страница снова серверная (db, revalidate = 300).


  (23) 2026-09-04 — Approach перенесён после Work (порядок: Hero → Work →
       Approach → Studio). Фон Approach сменён на bg-surface-container-lowest
       (= Work), сверху добавлен NavLabel-разделитель «Approach» — 1:1 с
       блоком Work (label 11px uppercase outline-variant + линия
       rgba(140,213,179,0.16)).

  (24) 2026-09-05 — Масштаб страницы выровнен с исходником Make (фидбэк:
       «сайт мелковат — паддинги по бокам больше, чем в макете, шрифты
       выглядят мельче»). Причина найдена в контейнере: .section-container
       был max-w 1200 + pads 16/32/64 (контент 1072px), в Make — Container
       max-w-[1280px] + px 24/48/64 (контент 1152px). Глобально
       (globals.css): --max-width-container-content 1200 → 1280px, pads
       section-container 16/32 → 24/48 (desktop 64 без изменений). Оси
       контента выровнялись на всех страницах (шапка, футер, главная,
       /u/[slug], кейсы). Шрифты не менялись — nav/body-md 16/24 = Make
       Inter 16/24, «мельче» было оптикой более узкого контента. H1 Hero
       поднят до 1:1 с Make: 42 → 62 → 72px (было 40 → 68), leading 1.2,
       tracking −0.42/−0.62/−0.72 (HeroSection.tsx).

  (25) 2026-09-05 — Иконки соцсетей (футер + шапка профиля) вместо
       глобусов. Причина: в админке «Add Link» создаёт ссылки с платформой
       'custom' по умолчанию → рендерился fallback Globe; в ProfileHeader
       карта была только из 4 платформ (fallback ExternalLink). Общий
       компонент SocialIcon (src/components/SocialIcon.tsx): резолв
       платформа (trim/lowercase + алиасы x→twitter, vkontakte→vk…) →
       домен URL (instagram.com, t.me, x.com, vk.com, behance.net, …,
       subdomain-safe) → Globe для неизвестных. Набор: GitHub, LinkedIn,
       Instagram, X, YouTube, Telegram, Dribbble, Behance, Medium, VK,
       WhatsApp (Simple Icons, fill: currentColor). Цвет иконок —
       зелёный text-primary (hover opacity-70), фидбэк: «иконки должны
       быть зеленые». SiteFooter/ProfileHeader переключены на общий
       компонент (дубли SVG удалены).

  (26) 2026-09-05 — Фикс сохранения соцссылок в админке (фидбэк: добавляю
       ссылки → Save Profile → на сайте глобусы, в админке «No social
       links added yet»). Две причины. (1) SocialLinksEditor монтировался
       сразу после setProfileId — ДО завершения getMyProfile — и useState
       фиксировал пустой initialLinks навсегда: данные из БД игнорировались,
       при каждом возврате в админку список выглядел пустым. (2) У правок
       полей (platform/title/url) не было серверного экшена — они жили
       только в локальном state, в БД оставались пустые строки
       (custom/' '/' ') → на /u/[slug] рендерились глобусы (пустой url не
       резолвится по домену). Фиксы: редактор монтируется только после
       загрузки профиля (profileLoaded + «Loading...», try/finally);
       новый экшен updateSocialLink (platform/title/url по id); поля
       сохраняются сразу — Select по change, Inputs по onBlur; ошибки
       экшенов показываются в UI (раньше падали молча в консоль);
       getMyProfile защищён от undefined socialLinks. Пустые тестовые
       строки в локальной D1 почищены.

  (27) 2026-09-05 — Тени кнопок стали «парящими» (FullStory-style, фидбэк:
       «хочу такие же мягкие тени у кнопок, как на fullstory.com»).
       Значения сняты с CSS самого fullstory.com (круглая кнопка
       border-radius:50% и submenu): вместо материальной тени со смещением
       вбок 2/2/4/10% → 4/4/12/20% теперь rest 0 4px 8px rgba(0,0,0,0.15)
       → hover 0 8px 16px rgba(0,0,0,0.20) (offset X=0 — тень стелется
       под кнопкой, hover поднимает её вдвое). Применено ко всем кнопкам
       с тенью: CtaButton primary/secondary, CTA в Approach, выбранный
       чип фильтров, summary-кнопка мобильных фильтров. Спеки
       Primary/Secondary_Button актуализированы (Figma-история не тронута).

  (28) 2026-09-05 — Страница дизайнера: снят лимит фильтров галереи
       (фидбэк: «отображается только 4 кнопки фильтра, новая категория
       пропадает»). Было: categoryFilters.slice(0, 3) → All + 3 категории
       = 4 чипа, остальные категории не показывались. Теперь передаются
       все категории проектов дизайнера; на десктопе чипы переносятся
       по flex-wrap, на мобильных — disclosure-список без ограничений.
       Лимит 6 карточек галереи (projects.slice(0, 6)) и 3 тега на
       карточке не тронуты.

  (29) 2026-09-09 — Футер на страницах дизайнера: убраны Terms и Cookies
       (фидбэк: «достаточно Privacy Policy»). Terms/Cookies показываются
       только там, где profileSlug не передан (главная); на страницах
       дизайнера и кейсов (SiteFooter с profileSlug) — только Privacy
       Policy.

  (30) 2026-09-09 — Ревизия legal-ссылок (фидбэк: «почисти везде, где
       применимо к страницам дизайнера и кейсам, в мобильном хедере тоже»).
       Проверено: на страницах дизайнера и кейсов Terms/Cookies больше
       нигде нет — футер (см. (29)), мобильный бургер дизайнера (только
       nav + Hire me), хедер кейса (меню нет). Единственное место
       с Terms/Cookies в шапке — бургер-панель menuMode на главной;
       решено её НЕ трогать (как и футер главной). ФАКТ/БЭКЛОГ: страниц
       /privacy, /terms, /cookies в проекте не существует — все legal-
       ссылки сейчас ведут на 404; создать страницы (или заглушки)
       отдельным решением.

  (31) 2026-09-09 — Релиз-гейт B1/B6 (аудит по чек-листу GLM). Факты:
       страница профиля УЖЕ передаёт в SiteHeader navItems с хэшами
       (#work/#about/#contact) — дефолтная ветка с полными URL не
       использовалась, но приведена к хэшам для единообразия. Реальный
       баг был в #about: якоря не существовало → NavLabel получил
       опциональный id, About → id='about' (работа/контакт уже имели
       якоря: PortfolioGallerySection id='work', CtaSection id='contact',
       потому «Hire me»/CTA hero/FAB работали). scroll-mt-24 НЕ добавлен:
       offset даёт глобальный [id] { scroll-margin-top } 80/72px
       (решение (18), у GLM расходится). B6: Escape закрывает оба меню
       (SiteHeader, useEffect на keydown). Сервисы: generateMetadata
       fallback описания → EN «Portfolio of {name}» (description + OG);
       убран неиспользуемый импорт AuthBar. WhatsApp-кнопка на профиле
       не рендерится (whatsappUrl очищен в админке) → CtaSection хранит
       опциональную поддержку, Meta-процессор в PP не требуется.

  (32) 2026-09-09 — Мобильная карточка галереи не растягивается от
       длинного заголовка (фидбэк: «карточки растягиваются на ширину
       заголовка»). Причина: в мобильной карусели обёртка карточки
       (flex-элемент с видимым overflow) не сжималась ниже min-content
       nowrap-заголовка (truncate не работал — не было min-w-0 в цепочке).
       Фикс: min-w-0 на обёртке элемента карусели — truncate обрезает
       заголовок с «…», карточка = 100%−16px ширины стрипа, высота
       не меняется (перенос не нужен). Заголовок карточки на мобильных
       уменьшен 22/30 → 18px/26 (tracking −0.18), с sm — снова 22/30
       (−0.22), когда карточки становятся колонками сетки.

  (33) 2026-09-09 — Карусель: верхний запас под hover/pressed scale
       (фидбэк: «при нажатии карточка увеличивается и обрезается сверху»).
       Скроллер (overflow-x:auto) обрезает и по вертикали; :hover на тачах
       «залипает», scale(1.02) поднимает верхний край карточки на ~4px —
       он срезался. По образцу нижнего решения (pb-7 + −mb-5): pt-3 внутри
       скроллера + −mt-3 снаружи (вертикальный ритм прежний), сброс
       sm:pt-0/sm:mt-0 в grid-режиме. Отдельный компонент карусели НЕ
       выделялся: инлайн-карусель в PortfolioGallerySection — единственная
       (на главной мобильная галерея — обычная сетка); вынос в компонент —
       при втором использовании.

  (34) 2026-09-09 — Карусель вынесена в компонент portfolio/Carousel.tsx
       и подключена к ГЛАВНОЙ (Work): на мобильном вместо сетки — тот же
       стрип, карточки главной и страницы дизайнера идентичны.
       Геометрия стрипа (фидбэк: «по сетке карточки шире и консистентнее;
       убрать правый паддинг, чтобы сосед был виден; левый паддинг —
       стандартный»):
       − карточка = ширине карточки сетки: 327 @375 (было 311 — % basis
         считался от content box с pr-4 внутри);
       − full-bleed до краёв экрана: −mx-6 + w calc(100% + 48px) (w-full
         не расширяется отрицательными margin);
       − px-6 внутри: первая карточка на стандартном паддинге 24 (жёлтый
         на макете), правого паддинга нет;
       − соседняя карточка видна до самого края экрана: peek 8px @375
         (24 + 327 + 16 + 8 = 375);
       − scroll-px-6: последняя карточка при снапе встаёт ровно на 24
         (max scroll 343n−327 = snap-цели 343(n−1) при любом n);
       − верх/низ: запасы из (33)/(15)/(16) — pt-3+−mt-3 и pb-7+−mb-5.
       ≥sm — сетка 2/3; в grid-режиме gap унифицирован: sm:gap-6 (у
       дизайнера было gap-4 на sm) — как на главной. Обёртки карточек
       (flex min-w-0 [&>*]:w-full) убраны: карточка — прямой ребёнок
       карусели, min-w-0 перенесён в [&>*] компонента (решение (32)).

  (35) 2026-09-09 — Фикс стрипа карусели (фидбэк: «карточка на всю ширину
       экрана, слева паддинга нет, сосед не виден»): в className стрипа
       был потерян px-6 — комментарий его обещал, а класса не было.
       Следствие: у full-bleed стрипа (−mx-6 + w calc(100% + 48px))
       content box = весь экран → basis-full = ширина экрана, первая
       карточка на x=0, сосед за краем. Старый код не ломался, т.к. стрип
       не был full-bleed влево (паддинг давал section-container) — при
       переходе на двусторонний full-bleed свой px-6 обязателен.
       Урок: класс-список проверять по факту, не по комментарию.

  (36) 2026-09-11 — Страница /privacy — Privacy Policy EN+ES (релиз-гейт D3:
       футер уже линкует /privacy (29), роута не было → 404). Роут
       src/app/(public)/privacy/page.tsx (статический, без БД — prerender),
       контент src/lib/privacyContent.ts (типизированные секции EN/ES,
       источник Docs/ui/PP.md), рендерер src/components/legal/
       PrivacyPolicy.tsx. §6/§7 актуализированы и в PP.md, и на странице
       (WhatsApp удалён из админки, (31) → Meta из процессоров выпала):
       единственный процессор — Cloudflare, Inc. (хостинг, CDN, object
       storage, анонимная аналитика, email routing privacy@ux42.studio);
       §7 — EU–US Data Privacy Framework (Cloudflare сертифицирован) или
       SCC. Email унифицирован на privacy@ux42.studio (§1 EN имел
       «av.butshtein@…» — вероятная опечатка; §8/ES уже использовали
       privacy@; EN/ES адреса ответственного в §1 остаются разными — так
       в источнике). Лид-ины списка §8 полужирные (макет). Layout:
       sticky-панель h-14 (bg-background + shadow-card, section-container):
       Back (←, href=/) + breadcrumb Main / Privacy Policy + ThemeToggle;
       SiteHeader не используется (якорная навигация главной). Статья:
       колонка max-w-5xl (1024px) по центру section-container — уже
       контента футера, как в макете; H1 headline-lg, секции headline-sm
       (font-display), текст body-md on-surface-variant, «Last updated»
       body-sm; таблицы: шапка title-sm на bg-surface-container, ячейки
       body-sm, первая колонка font-medium on-surface, мобильный
       overflow-x (min-w-[560px]); разделитель EN/ES — пунктир + пилюля с
       точкой primary. SiteFooter: profileName/profileHeadline,
       socialLinks=[] — иконки соцсетей из макета отложены (источник
       ссылок студии не определён, не хардкодить). ОТКРЫТО: (а) адресат
       форварда privacy@ux42.studio — если Gmail, добавить Google LLC в
       §6 EN+ES; (б) Terms/Cookies в футере главной → 404 (30),
       страница /terms не решена.

  (37) 2026-09-11 — §6: добавлен процессор Google LLC (решение пользователя).
       Почта privacy@ux42.studio = Cloudflare Email Routing (MX домена на
       Cloudflare) с форвардом на обычный личный @gmail.com: Cloudflare —
       только транзит и письма не хранит; хранение входящих и исходящих
       ответов — Gmail. Письмо = ПДн посетителя → хранителя ящика называем
       в §6 (GDPR, раскрытие обработчиков). §6 EN+ES обновлены в PP.md и
       privacyContent.ts: «…**Cloudflare, Inc.** (…) and **Google LLC**
       (Gmail — storage of the forwarded correspondence / almacenamiento de
       la correspondencia reenviada), acting as Data Processors /
       Encargados del Tratamiento» (мн. число). Если перейдём на Google
       Workspace (MX сразу на Google) — Cloudflare из почты выпадет,
       §6 править снова. Открытым остаётся: Terms/Cookies в футере главной
       → 404 (спека (30)).

  (38) 2026-09-11 — Страница /terms — «Legal Notice & Terms of Use» EN+ES
       (источник Docs/ui/Terms of Use.md → контент src/lib/termsContent.ts).
       Патчи из чата: T1 — реальная дата 2026-09-11 синхронно в PP.md,
       Terms of Use.md и константах LAST_UPDATED обоих контентов (было
       «July 28, 2026»); T2 — переименование документа (ES: «Aviso Legal
       y Condiciones de Uso») и блок идентификации LSSI Art. 10 в §2 EN+ES
       (Domain/Owner/Location/Contact). Контакт — hello@ux42.studio: это
       уже видимый контакт сайта (page.tsx mailto +
       mainPageContent.emailAddress), алиас в Cloudflare Email Routing
       добавляет Денис — ЗАВИСИМОСТЬ ДЕПЛОЯ: без алиаса письма на hello@
       не дойдут; T3 — §8 EN без «dynamically» (выровнен по ES); T4 —
       «restricted administrative panels» оставлено как есть. Рендерер
       вынесен из legal/PrivacyPolicy.tsx в generic legal/LegalArticle.tsx
       (props: title/lastUpdated/sections/esSections/esLabel) + оболочка
       legal/LegalPageShell.tsx (sticky-панель Back+breadcrumb+ThemeToggle
       и футер — общие для /privacy и /terms); PrivacyPolicy.tsx удалён,
       /privacy переключён на LegalArticle.

  (39) 2026-09-11 — Legal-контур (решение из чата): Cookie Policy НЕ
       публикуется — черновик описывает несуществующий сайт (GA-куки,
       consent-менеджер, ссылка Cookie Settings); /cookies не строим,
       документ вернётся в Backlog v2 при появлении реальных cookies.
       Вместо неё — микрораздел «Cookies and local storage» в PP §3 EN+ES
       (после таблицы; новое поле outro в PrivacySection): strictly
       necessary storage — auth-token (сессия зарегистрированных),
       localStorage для темы (проверено в коде: ThemeProvider пишет
       localStorage 'theme'), security cookies Cloudflare; аналитика
       cookieless. SiteHeader menuMode: «Terms of Service» → «Terms of
       Use», строка «Cookie Settings» удалена (меню главной: Privacy
       Policy + Terms of Use). SiteFooter: Terms of Use теперь на ВСЕХ
       страницах (было только на главной), ссылка Cookies удалена.
       Патч PP: «Contact Form» → «Email correspondence» в §3/§4/§5 EN+ES —
       формы на сайте НЕТ (CtaSection: только mailto + опциональный
       WhatsApp), обращения идут письмом на hello@.

  (40) 2026-09-11 — Таблицы legal-страниц (<768) рендерятся стопкой:
       dl-список (dt = первая колонка полужирным, dd = значения с
       подписями-заголовками колонок), ≥md — таблица как в макете
       (overflow-x, min-w 560). Мотивация чата — WCAG 1.4.10 (data tables
       формально исключены из reflow, но горизонтальный скролл legal-
       таблиц на телефоне — плохой UX). Оба представления в DOM: скрытый
       display:none не попадает в a11y-дерево — дубля для скринридеров нет.

  (41) 2026-09-11 — PP §5, P7-патч (текст предоставлен ревьюером дословно):
       строка Web Analytics Metrics — вместо «14 months / автоочистка» →
       «Aggregated, non-identifying data only; retention per provider
       (Cloudflare) defaults»: мы не управляем retention на стороне
       Cloudflare, обещать конкретные сроки нельзя. Вторая правка той же
       таблицы (рекомендация ревьюера, «проверить у Дениса» из первого
       ревью): Server logs — вместо «30 to 90 days» → «Transient technical
       logs, kept only as long as needed for security and diagnostics; not
       used for profiling» (Workers по умолчанию логи не хранит — честно
       при любой конфигурации). Зеркально ES. В микрораздел cookies §3
       добавлено «No consent banner is used because no tracking cookies are
       set» (ES: «No se utiliza banner de consentimiento porque no se
       establecen cookies de seguimiento») — по чек-листу ревьюера в языке
       ожидается ровно 1 упоминание banner. Дата не сдвинулась: правки в
       тот же день (правило «правка = новая дата» даёт ту же 11.09).
       Мини-верификация пройдена: Google Analytics/_ga/consent_status — 0,
       Contact Form — 0, Cloudflare Web Analytics — есть (§3/§4),
       Data Privacy Framework — есть (§7). Пункт чек-листа «EMAIL
       PROVIDER» уже закрыт (спека (37): Google LLC добавлен в §6).

  (42) 2026-09-11 — Блок C (SEO). C1: favicon src/app/icon.svg (64×64,
       rx 14, фон #0B6E4F, «42» Poppins→Arial 600 #FBFFFA; HEX в
       статических ассетах разрешён — CSS-переменные в SVG не
       пробрасываются; дублей favicon.ico в src/app нет). C3: robots.ts
       (allow /, disallow /admin /super-admin /login /register /api,
       sitemap-ссылка) + sitemap.ts: статика / /privacy /terms + динамика
       — публичные профили (isPublic) и published-проекты публичных
       профилей из D1 через getCloudflareContext/getDb; force-dynamic —
       prerender на билде заморозил бы динамическую часть (биндингов нет);
       try/catch — без БД отдаётся только статика; lastModified из
       projects.updatedAt (unixepoch × 1000). C4: noindex/nofollow в
       robots-metadata трёх layouts приватных зон — (auth) покрывает
       /login и /register, admin, super-admin; все серверные, metadata
       экспортируется легально; robots.txt + meta = два рубежа. C5:
       not-found.tsx — display-sm «404», одна строка объяснения, пилюля
       primary на главную, section-container, h1-семантика. C6:
       generateMetadata кейс-страницы /u/[slug]/[projectSlug] — title
       «{title} — {fullName}», description из projects.teaser, OG
       наследуется. C7: под CTA-кнопками CtaSection строка «By reaching
       out you agree to our Privacy Policy» (text-body-sm, ссылка
       /privacy). C2 (Open Graph + metadataBase) ОТЛОЖЕН по ТЗ: ждём
       public/og/og-cover.png (экспорт из Figma); у /u/[slug] per-profile
       OG из БД уже существовал (ogFile/faviconFile) — при C2 добавим
       metadataBase, siteName и twitter-карточку туда же.

  (43) 2026-09-11 — C2 закрыт: OG-обложка сгенерирована агентом (референс
       пользователя не дошёл — собран ДРАФТ по признакам из чата: домен
       внизу слева, стык имени с «4», цветные точки палитры; исходник
       public/og/og-cover.svg → PNG через sharp, 1200×630, 38KB).
       Поправить по референсу = отредактировать SVG + перегнать
       sharp-скрипт. Нюанс шрифта: next/font Poppins в SVG-рендер не
       пробрасывается — сработал системный fallback (Arial); при
       финализации по референсу перевести текст в кривые. Metadata:
       корень — metadataBase https://ux42.studio; /u/[slug] OG —
       per-profile ogFile приоритетен, иначе /og/og-cover.png (alt
       «{name} — UX/UI Designer»), siteName 'UX42.studio', url /u/{slug};
       twitter card summary_large_image. Бонус C1: из корневого layout
       удалена битая ссылка <link rel=icon href=/favicon.svg> — файла
       favicon.svg в public/ не было (404 в консоли у всех); иконку
       отдаёт file-convention src/app/icon.svg.
