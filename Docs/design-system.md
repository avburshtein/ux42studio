# UX42 Studio — Design System (единый источник правды по UI)

> **Статус:** канонический документ. Составлен 2026-09-26 по фактическому коду
> (`src/app/globals.css`, `src/components/**`, `src/app/**`).
> **Заменяет:** `Docs/ui-rules.md` (свод правил перенесён в §4, §5, §7).
> **Дополняет (не заменяет):** `Docs/ui/design-system-ux42.md` — это **Figma-спека**
> (тональные палитры, градиенты, effect-стили, коллекции). Здесь — реализация в коде.
> **Решения «решение (N)»** ссылаются на `Docs/ui/Main_page_Spec.md`.

---

## 0. Как пользоваться документом

1. **Новая страница/секция** → §1 (принципы) → §2 (токены) → §4 (лейаут и паттерны страниц) → §3 (компоненты) → §5 (доступность).
2. **Готовый компонент** → §3: назначение, варианты, состояния, do/don't, a11y, пример.
3. **Проверка результата** → §5 (доступность) и §9 (расхождения «код vs документ»).
4. **Источник правды — код.** `src/app/globals.css` — единственное место со значениями токенов. Нужно изменить значение → меняем токен, а не хардкод.

**Стек:** Next.js (App Router) · React · TypeScript · Tailwind CSS v4 (`@theme` в `globals.css`) · Radix UI (доступные примитивы) · `lucide-react` (иконки) · `class-variance-authority` (варианты) · `cn()` = `clsx` + `tailwind-merge` (`src/lib/utils.ts`). Сторонних UI-китов нет.

---

## 1. Принципы (что здесь считается «хорошим UI»)

**1. Смысловые токены, а не цвета.**
Цвет выбирается по роли (`bg-surface-container-low`, `text-on-surface-variant`), а не по hex. Кастомный seed-цвет перекрашивает `--md-sys-color-*` целиком (§2.1.3), поэтому «сырые» цвета ломают тему.

**2. Контент решает, контейнер — дизайнер.**
Блоки с редактируемым текстом не имеют фиксированной высоты: длинный заголовок/teaser вырос бы за край и обрезался. Реальный случай — обложка кейса: оверлей переведён из `absolute bottom-0` в `min-height + justify-end` (решение (68)). Обрезка контента = баг, а не стилистика.

**3. Две темы — одна разметка.**
Любой экран обязан читаться в light и dark. Тема переключается атрибутом `data-theme` на `<html>` (класса `.dark` в проекте нет), режимы шапки `default | transparent | solid`, фона `default | seed-tint | solid`. Исключение одно — **печать/PDF всегда светлая** (§2.8).

**4. Смысловая иерархия вместо декора.**
Размер/вес текста задают роль (`text-headline-md` = H2 секции, `text-body-sm` = подпись, `text-label-sm` = тег); порядок чтения совпадает с визуальным. Декоративные слои (`bokeh`, скримы) — `aria-hidden` + `pointer-events: none`.

**5. Доступность — часть вёрстки, не финальный проход.**
Контрастные пары проверены и зафиксированы в токенах (§2.1.1, §5.1), фокус виден на каждом интерактивном элементе, зоны клика ≥ 44px, у полей форм зарезервировано место под ошибку.

---

## 2. Токены

Все значения — из `src/app/globals.css`. Блок `@theme` (стр. 11+) маппит `--md-sys-color-*` → утилиты Tailwind (`bg-primary`, `text-on-surface`, `border-outline-variant`…), `:root` задаёт значения палитры, `[data-theme="dark"]` — тёмную тему.

### 2.1 Цвета

#### 2.1.1 Семантическая палитра (Material 3)

Полный список токенов и **фактические значения в обеих темах** — таблица ниже. Колонка «Утилита» — то, что вы пишете в разметке.

| Токен | Утилита Tailwind | Light | Dark |
|---|---|---|---|
| `--md-sys-color-primary` | `bg-primary` / `text-primary` | `#00543b` | `#83d7b1` |
| `--md-sys-color-on-primary` | `text-on-primary` | `#ffffff` | `#003826` |
| `--md-sys-color-primary-container` | `bg-primary-container` | `#0b6e4f` | `#0b6e4f` |
| `--md-sys-color-on-primary-container` | `text-on-primary-container` | `#d9f9e7` | `#d9f9e7` |
| `--md-sys-color-surface-tint` | `bg-surface-tint` | `#056c4d` | `#83d7b1` |
| `--md-sys-color-on-surface-tint` | `text-on-surface-tint` | `#ffffff` | `#003826` |
| `--md-sys-color-secondary` | `bg-secondary` | `#b12a33` | `#ffb3b1` |
| `--md-sys-color-on-secondary` | `text-on-secondary` | `#ffffff` | `#680011` |
| `--md-sys-color-secondary-container` | `bg-secondary-container` | `#ff6467` | `#ff6467` |
| `--md-sys-color-on-secondary-container` | `text-on-secondary-container` | `#44000a` | `#44000a` |
| `--md-sys-color-tertiary` | `bg-tertiary` | `#5b5f5c` | `#ffffff` |
| `--md-sys-color-on-tertiary` | `text-on-tertiary` | `#ffffff` | `#2d312e` |
| `--md-sys-color-tertiary-container` | `bg-tertiary-container` | `#fbfffa` | `#dfe4df` |
| `--md-sys-color-on-tertiary-container` | `text-on-tertiary-container` | `#717672` | `#616562` |
| `--md-sys-color-error` | `bg-error` / `text-error` | `#8a5100` | `#ffb86e` |
| `--md-sys-color-on-error` | `text-on-error` | `#ffffff` | `#492900` |
| `--md-sys-color-error-container` | `bg-error-container` | `#d17d00` | `#d17d00` |
| `--md-sys-color-on-error-container` | `text-on-error-container` | `#402300` | `#402300` |
| `--md-sys-color-background` | `bg-background` | `#f7faf5` | `#101412` |
| `--md-sys-color-on-background` | `text-on-background` | `#181d1a` | `#e0e3df` |
| `--md-sys-color-surface` | `bg-surface` | `#fcf8fa` | `#131314` |
| `--md-sys-color-on-surface` | `text-on-surface` | `#1b1b1d` | `#e4e2e3` |
| `--md-sys-color-surface-variant` | `bg-surface-variant` | `#e1e2e8` | `#44474b` |
| `--md-sys-color-on-surface-variant` | `text-on-surface-variant` | `#44474b` | `#c5c6cc` |
| `--md-sys-color-outline` | `border-outline` | `#75777c` | `#8f9196` |
| `--md-sys-color-outline-variant` | `border-outline-variant` | `#c5c6cc` | `#44474b` |
| `--md-sys-color-outline-faint` | `border-outline-faint` | `rgba(0,0,0,.1)` | `rgba(255,255,255,.15)` |
| `--md-sys-color-scrim` | — (только в градиентах) | `#000000` | `#000000` |
| `--md-sys-color-surface-container-lowest` | `bg-surface-container-lowest` | `#ffffff` | `#0e0e0f` |
| `--md-sys-color-surface-container-low` | `bg-surface-container-low` | `#f6f3f4` | `#1b1b1d` |
| `--md-sys-color-surface-container` | `bg-surface-container` | `#f0edee` | `#1f1f21` |
| `--md-sys-color-surface-container-high` | `bg-surface-container-high` | `#f6f1f2` | `#2a2a2b` |
| `--md-sys-color-surface-container-highest` | `bg-surface-container-highest` | `#e4e2e3` | `#353536` |
| `--md-sys-color-surface-input` | `bg-surface-input` | = `lowest` | = `lowest` |
| `--md-sys-color-secondary-fixed-dim` | `bg-secondary-fixed-dim` | `#f2f0f4` | `#3a3a3c` |
| `--md-sys-color-on-secondary-fixed` | `text-on-secondary-fixed` | `#333338` | `#e5e2e6` |

**Как читать роли поверхностей снизу вверх** (M3-шкала): `lowest` (канвас страницы, `body`) → `low` (шапка-стекло, карточки-плашки) → `container` (секции, benefit-карточки) → `high` → `highest` (оверлеи, hover-подложки). Поверх ставится текст: `on-surface` (основной) или `on-surface-variant` (вторичный).

**Правило «поверх-подложки»:** подбирайте пару «поверхность + on-цвет» по соседней ступени, а не «по вкусу». Проверенные пары: `lowest`+`on-surface`, `low`+`on-surface`, `container`+`on-surface`, `primary`+`on-primary`, `primary-container`+`on-primary-container`, `error`+`on-error`, `error-container`+`on-error-container`.

**Три уровня контура — не путать:**

| Токен | Где | Правило |
|---|---|---|
| `border-outline-variant` | границы отдельных элементов (свотчи цветов, поля, карточки) | видимый, сплошной |
| `border-outline-faint` | контур **карточки-контейнера** (Color Tokens, Type scale) | едва заметный, полупрозрачный; значения взяты из Figma-токенов `border.light` / `border.dark` |
| хардкод цвета в `style` | запрещён | если нужен «свой» оттенок границы — это новый токен в `globals.css`, а не литерал в компоненте |

> **Важно про тёмную тему.** Тёмная палитра объявлена дважды: `[data-theme="dark"]` (явный выбор) и `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` (системный фолбэк). Значения совпадают намеренно — так тема применяется до первого клика пользователя. Токен `Background` в тёмной теме **не** используется как канвас страницы: `body` красится `surface-container-lowest`, а `background` остаётся под футером и фолбэком обложки (решение (12)).

#### 2.1.2 Расширенные акценты (`--md-ext-*`)

Акценты — украшение, а не действие. На интерактивные элементы не выносят.

| Токен | Утилита | Light | Dark | Где применяется |
|---|---|---|---|---|
| `--md-ext-lime-accent` | `bg-lime-accent` | `#546524` | `#bbcf81` | декор, bokeh, плашки |
| `--md-ext-on-lime-accent` | `text-on-lime-accent` | `#ffffff` | `#283500` | текст на lime |
| `--md-ext-lavender-light` | `bg-lavender-light` | `#5a5891` | `#c3c0ff` | градиентные заголовки |
| `--md-ext-lavender-purple` | `bg-lavender-purple` | `#6e528a` | `#dbb9f9` | градиентные заголовки |
| `--md-ext-green-accent` | `bg-green-accent` | `#336210` | `#98d46f` | мягкие заливки, hover |

Новый акцент добавляется **парой** `accent` + `on-accent` в обе темы; одиночный акцент без `on-` запрещён.

**Fixed-роли (`secondary-fixed-dim`).** Это отдельное семейство «стеклянных» поверхностей: светлое приглушённое стекло в светлой теме и тёмное — в тёмной, всегда с тёмным/светлым текстом соответственно. Применяется к плавающей кнопке-ссылке на контакт (`FAB`) и будет переиспользована модальными окнами виртуального помощника. Пара `surface-tint`/`on-surface-tint` — отдельная: тинт в тёмной теме светлеет, поэтому текст на нём должен быть тёмным.

| Пара | Светлая | Тёмная | Контраст |
|---|---|---|---|
| `secondary-fixed-dim` / `on-secondary-fixed` | `#f2f0f4` / `#333338` | `#3a3a3c` / `#e5e2e6` | 11.10:1 / 8.84:1 |
| `surface-tint` / `on-surface-tint` | `#056c4d` / `#ffffff` | `#83d7b1` / `#003826` | 6.44:1 / 7.73:1 |
| `error` / `on-error` | `#8a5100` / `#ffffff` | `#ffb86e` / `#492900` | 6.12:1 / 10.91:1 |
| `error-container` / `on-error-container` | `#d17d00` / `#402300` | `#d17d00` / `#402300` | 4.56:1 |

**Семейство Error — источник истины: экспорт M3 из Figma**, `material-theme/Light.tokens.json` и `Dark.tokens.json` (раздел `Schemes`). Значения взяты как есть, все 16 токенов сверены автоматически.

> **Error намеренно не красный, а янтарный/коричневый** — так он уведён от `secondary`, который в этом проекте красный. Отличие по цвету большое: dE=75 в светлой теме и dE=67 в тёмной. Это осознанное решение владельца дизайна, а не побочный эффект палитры: ошибочно «приводить» Error к красному нельзя.
>
> Отдельно: `error-container` **одинаков в обеих темах** (`#d17d00`) — так M3 посчитал для этого сида. Это нормально, а не недосмотр.

> **Устаревший источник:** `design-tokens (1).json` (папка «Projects light / Studio», вне репозитория) содержит другой, более старый набор, где `semantic.destructive` = `#d4183d` (красный) и `border.light/dark` со значениями 10%/15%. **Он не соответствует экспорту M3** — не берите Error оттуда. Актуальные значения только в `material-theme/*.tokens.json`.
>
> **Что совпадает** со старым набором: `border.light` `rgba(0,0,0,.1)` / `border.dark` `rgba(255,255,255,.15)` — именно они легли в токен `outline-faint`. Остальное (радиусы, типографика, spacing) — нет.

#### 2.1.3 Seed-тема (генерация палитры)

`src/lib/theme.ts` — официальный движок M3 `@material/material-color-utilities` (HCT, `SchemeTonalSpot`). Палитра дизайнера (`profiles.themeSettings`) **перекрашивает те же `--md-sys-color-*`**, поэтому любой хардкод цвета ломается при смене темы.

| Экспорт | Назначение |
|---|---|
| `generateThemeCss(seed?)` | CSS-строка переопределений: `:root {…}` + `[data-theme=dark] {…}`. Валидирует `#RGB`/`#RRGGBB`; невалидный seed → `''` (остаются дефолты `globals.css`) |
| `PRESET_SEEDS` | Фирменные сиды: Terminator Green `#0b6e4f`, Lavender `#5a5891`, Acid `#ccff00`, Sunset `#b12a33`, Ocean `#005a9e` |
| `isValidSeed(value)` | Валидация для инпута выбора цвета |
| `mixWithBlack(hex, t)` | Затемнение solid-цветов для тёмной темы (хедер/фон) |
| `contrastOn(hex)` | Контрастный текст (`#1b1b1f` / `#ffffff`) на произвольном фоне |

**Правила:**
- seed всегда `#hex`; для ч/б темы seed с `chroma < 8` переключает схему на `SchemeMonochrome` + `bwOverrides`.
- Сгенерированные токены приходят инлайном в `<style>` на странице дизайнера (`src/app/(public)/u/[slug]/page.tsx`) — не пишите локальные копии палитры.
- Seed меняет `primary`/`secondary`/`tertiary`/поверхности, но **не** `outline`, `scrim` и не шрифты/радиусы/отступы.
- **Каждый токен, добавленный в `globals.css`, обязан появиться и в `generateThemeCss`** — иначе на странице дизайнера он останется дефолтным, пока его пара перекрашивается сидом. Открытый список таких «непокрытых» токенов: `outline-faint`, `secondary-fixed-dim`, `on-secondary-fixed` — они нейтральные, поэтому дефолт на любом сиде корректен; `on-surface-tint` был покрыт 29.09.2026 (белый по светлому тинту давал 1.18:1). Проверка: `grep` имени токена в `src/lib/theme.ts` должен давать совпадение либо осознанную заметку.

#### 2.1.4 Режимы фона страницы — `ThemeBackgroundMode`

Тип: `src/lib/mainPageContent.ts` (`'default' | 'seed-tint' | 'solid'`). Применяется в `u/[slug]/page.tsx` (режимы шапки — там же).

| Режим | Поведение | Когда |
|---|---|---|
| `default` | Фон = `surface-container-lowest`, футер = `background` | По умолчанию; единственный режим, проверенный в обеих темах |
| `seed-tint` | Фон = `surface-tint` (цвет сида); текст/ссылки — светлые | «Плашка» одного тона, когда дизайнер хочет заливку цветом |
| `solid` | Произвольный HEX из настроек; в тёмной теме — затемняется через `mixWithBlack` | Индивидуальный фирменный фон, ответственность на авторе |

#### 2.1.5 Режимы шапки — `ThemeHeaderMode`

`SiteHeader` (`src/components/case/SiteHeader.tsx`), проп `variant: 'default' | 'transparent' | 'solid'`.

| Режим | Реализация | Когда |
|---|---|---|
| `default` | `header-glass` + `backdrop-blur-md` + `backdrop-saturate-[1.8]`; фон `rgba(247,250,245,.7)` (dark `rgba(10,10,10,.7)`), тень `8px 8px 20px rgba(0,0,0,.08)` | 90% страниц: главная, страница дизайнера, кейс |
| `transparent` | Только блюр, без заливки | Над полноширинной фотографией/видео, где шапка должна растворяться |
| `solid` | Фон приходит инлайном (`style` + переопределение `--md-sys-color-*`), текст — через `contrastOn()` | Заливка фирменным цветом из настроек темы |

> **Почему блюр — утилитами, а не в `.header-glass`:** LightningCSS в пайплайне Tailwind v4 схлопывает пару `backdrop-filter`/`-webkit-backdrop-filter` в одно `-webkit-` — Firefox перестаёт понимать правило, «блюра нет» при формально валидном CSS. Tailwind-утилиты эмитят обе формы через `var(--tw-backdrop-*)`. **Не возвращать `backdrop-filter` в `.header-glass`.**

### 2.2 Типографика

Два семейства (`next/font` в `src/app/layout.tsx`): **Poppins** → `--font-display` (утилита `font-display`, заголовки, цифры метрик), **Inter** → `--font-body` (утилита `font-body`, весь текст и UI). Базовый размер страницы = `body-md`.

Полная шкала (`@theme`, `--text-*`), значения — из `globals.css`:

| Токен | Размер / line-height | Weight | Letter-spacing | Роль в проекте |
|---|---|---|---|---|
| `--text-display-sm` | 52 / 60 | 500 | — | Крупные акцентные заголовки секций (главная) |
| `--text-headline-lg` | 48 / 56 | 500 | — | Заголовок модалки/страницы; `Title variant='headline-lg'` |
| `--text-headline-md` | 34 / 42 | 500 | — | H2 секции кейса (`SectionHeader`), `CaseSection` |
| `--text-headline-sm` | 26 / 34 | 500 | — | Значение метрики, подзаголовок блока |
| `--text-title-lg` | 20 / 28 | 500 | — | Заголовок карточки (`CardTitle`, `DialogTitle`), `MetadataCard` |
| `--text-title-md` | 16 / 24 | 500 | 0.15px | Заголовок блока/группы полей |
| `--text-title-sm` | 14 / 20 | 500 | — | Заголовок списка, подпись блока |
| `--text-body-lg` | 18 / 28 | 400 | — | Лид-абзац, описание секции, цитата отзыва |
| `--text-body-md` | 16 / 24 | 400 | 0.25px | **Базовый текст**, поля ввода, кнопки-ссылки |
| `--text-body-sm` | 14 / 22 | 400 | 0.4px | Вторичный текст, подписи, caption фото |
| `--text-label-lg` | 16 / 24 | 600 | — | Крупные кнопки-пилюли (h-14) |
| `--text-label-md` | 13 / 20 | 500 | 0.5px | Подписи полей (`Label`), overline-лейблы секций |
| `--text-label-sm` | 11 / 16 | 600 | 0.5px | Теги, бейджи, микро-подписи |
| `--text-label-overline` | 10 / 16 | 600 | — | Надзаголовки, «eyebrow»-строки |
| `--text-button` | 16 / 24 | 500 | — | Текст кнопок |

**Правила:**
- **Иерархия ролей:** `display/headline` — H1/H2, `title` — заголовки карточек и блоков, `body` — текст, `label` — подписи/кнопки/теги. Не понижайте роль ради уменьшения размера — берите следующий токен.
- **Микро-надписи (11px и меньше) требуют повышенной контрастности.** `text-outline` на белом не проходит 4.5:1 → для мелких подписей используйте `text-on-surface-variant` (пример — комментарий a11y в `BlockLabel.tsx`).
- **Заголовки не обрезаются и не сжимаются:** контейнер с редактируемым заголовком — `min-height`, а не фиксированная высота (§1, принцип 2).
- Мобильные заголовки уменьшаются ступенью токена, а не `text-[28px]`: `text-headline-md lg:text-headline-md` → на малых экранах `text-headline-sm`, на десктопе возвращается `md:`-вариант.
- Tracking для uppercase-надписей — `0.0455em` (`label-md`) и `0.14em` для номеров блоков (`BlockLabel`); для обычного текста tracking не меняется.

### 2.3 Радиусы, тени, отступы

**Радиусы** (`@theme`, `--radius-*`) — единственная шкала скруглений:

| Токен | Значение | Где |
|---|---|---|
| `--radius-none` | 0 | полосы-разделители, срезанные углы обложки |
| `--radius-xs` | 4px | мелкие пилюли, чекбокс |
| `--radius-sm` | 8px | пункты меню, `DropdownMenu`, select-иконки |
| `--radius-md` | 10px | кнопки `ui/Button`, поля `Input`/`Textarea`/`Select`, `Tabs` |
| `--radius-base` | 12px | карточки кейса (`MetricCard`, `ResultsCard`), теги `TagBadge` |
| `--radius-lg` | 14px | карточки `ui/Card`, `ShowcaseGallery` (`rounded-xl` = 16px в галереях кейса) |
| `--radius-xl` | 16px | крупные карточки, фото в галереях |
| `--radius-2xl` | 20px | секционные карточки админки, benefit-карточки |
| `--radius-3xl` | 24px | обложка кейса (нижние углы), крупные панели |
| `--radius-4xl` | 28px | модальные окна, drawers |
| `--radius-5xl` | 48px | hero-кнопки главной (совместно с `rounded-full`) |
| `--radius-full` | 9999px | все CTA-пилюли, теги, аватары |

Утилиты: `rounded-xs|sm|md|base|lg|xl|2xl|3xl|4xl|5xl|full`. **Значения вида `rounded-[14px]` в разметке — анти-паттерн**, берите токен.

**Отступы.** Базовая сетка — 4px (`p-1` = 4px). Каноничные шаги: `1` = 4, `2` = 8, `3` = 12, `4` = 16, `5` = 20, `6` = 24, `8` = 32, `10` = 40, `12` = 48, `14` = 56, `16` = 64, `20` = 80, `24` = 96.

Типовые интервалы, как они стоят в коде главной:
- между блоками внутри секции — `gap-16` (64px, Figma-«64»);
- между подписью и заголовком/кнопкой внутри блока — `gap-8`/`gap-10`;
- внутри карточки и между полями — `gap-3`/`gap-4`;
- между лейблом и полем — `mb-1`;
- вертикальные паддинги секций — `py-12 lg:py-16` (48/64px);
- колонки → строка на десктопе — `flex-col gap-10 lg:flex-row lg:gap-10` (см. `AboutSection`, `SkillsSection`), `gap-12 md:gap-16 lg:gap-20` (`ApproachSection`) — то есть 40–80px, в зависимости от плотности секции.

**Тени** — только три источника:

| Токен/класс | Значение (light) | Назначение |
|---|---|---|
| `--shadow-card` | `0 2px 12px rgba(0,0,0,0.06)` | Базовая тень карточки: `ui/Card`, admin-карточки, legal-шапка |
| `.portfolio-card` (CSS-класс) | `4px 4px 2px rgba(0,0,0,.05)`, `16px 9px 12px -1px rgba(242,242,242,.86)`, `10px 10px 8px -2px rgba(177,211,196,.3)`; hover — усиленные | Карточка работы на главной; `transition: all 500ms ease`; в тёмной теме — чёрные тени, без зелёного подтона |
| `.team-card` (CSS-класс) | `0 2px 6px rgba(24,29,26,.05)` + `0 14px 28px -8px rgba(177,211,196,.4)` | Карточки основателей студии; объём держит **тень**, не заливка и не бордер |
| `.platform-benefit-card` (CSS-класс) | тень `.portfolio-card`, `transform: none` в hover | Карточки выгод платформы: не ссылки — без масштабирования |
| `--shadow-card-accent` / `-glow` / `-base` | `rgba(177,211,196,.30)` / `rgba(242,242,242,.86)` / `rgba(0,0,0,.05)`; в dark — все чёрные | Собирательные части теней, если нужна кастомная тень карточки |

**Правило:** не выдумывайте `shadow-[…]` в разметке. Либо токен `--shadow-card`, либо один из CSS-классов выше, либо (для крупных CTA-теней главной) существующая пара из `CtaButton`.

### 2.4 Motion

Формальной шкалы motion в `@theme` нет — **источник истины здесь фактические значения в коде**, и этот документ закрепляет их как шкалу.

| Токен (рекомендуемый класс) | Длительность | Где применяется |
|---|---|---|
| `duration-150` | 150 мс | **Базовая** — все hover/transition-цвета: кнопки, ссылки шапки, теги, ThemeToggle, outline-кнопки |
| `duration-200` | 200 мс | Radix-оверлеи (Dialog) |
| `duration-300` | 300 мс | Появление/скрытие панелей, раскрытие секций |
| `duration-500` | 500 мс | Крупные hover-эффекты карточек (`scale(1.02)`, смена теней), реплики Figma Make |
| `duration-700` | 700 мс | Редкие декоративные переходы |

**Easing:** в проекте — только `ease-out` (все 27 вхождений) и `ease` внутри CSS-класса `.portfolio-card` (`transition: all 500ms ease`). Новые кривые не вводим: по умолчанию `duration-150 ease-out`.

**Что анимируется:** цвет, прозрачность, тень, `transform`. Ширину/высоту/inset не анимируем (layout-thrash). Масштабирование карточек — только через классы `.portfolio-card`/`.team-card` (там уже зашиты `transform: scale(1.02)` и hover-тень).

**`prefers-reduced-motion: reduce`** обрабатывается в двух слоях:

1. **Глобально, в `globals.css`** — канонический сброс: `animation-duration: 0.01ms`, `animation-iteration-count: 1`, `transition-duration: 0.01ms`, `scroll-behavior: auto` для `*`, `::before`, `::after`. Отключаются scale-ховер карточек (`transform: scale(1.02)` в `.portfolio-card`), их `transition: all 500ms`, появление Radix-оверлеев (`animate-in/out`), анимации спиннеров и пульсация скелетонов.
2. **Скриптом** в `FloatingElements` — `window.matchMedia('(prefers-reduced-motion: reduce)')` не создаёт декоративные элементы вообще.

Почему `0.01ms`, а не `0s`: событие `animationend` должно продолжать срабатывать, иначе Radix (`Dialog`, `DropdownMenu`) зависнет в состоянии «начал открываться, но не завершился». Почему `!important`: правило обязано перебивать **любую** анимацию проекта, включая инлайновые `style` и сторонние компоненты, — иначе его можно было бы перебить обычным utility-классом. Это единственное оправданное исключение из правила «без `!important`» (§7).

**Побочные эффекты, которые нужно знать:** спиннеры загрузки (`animate-spin`) и скелетоны (`animate-pulse`) замирают, но остаются видимыми — состояние «идёт загрузка» не теряется. Hover-смены цвета (`transition-colors`) становятся мгновенными: состояние видно, просто без перехода. Если понадобится, чтобы индикаторы загрузки продолжали двигаться, добавьте исключение для `.animate-spin` после этого блока.

### 2.5 Z-index

Слои по возрастанию (значения — фактические из кода):

| Слой | Значение | Что живёт на этом уровне |
|---|---|---|
| Base | `z-0` | Затемняющий backdrop мобильного меню (`SiteHeader`, кнопка-подложка) |
| Контент поверх фото | `z-10` | Панель мобильного меню, текстовый блок обложки, `table-cell` |
| Плавающий | `z-20` | `Carousel`, слои кадрирования фото |
| Стеклянная шапка | `z-30`–`z-40` | `SiteHeader`/legal-шапка — `sticky top-0 z-40`; полоса `AuthBar` — `z-40` |
| Попапы и FAB | `z-50` | Radix-порталы (`Dialog`, `DropdownMenu`, `Select`), `FAB` (64×64, `bottom-8 right-8`) |
| Оверлей поверх оверлея | `z-[70]`, `z-[100]` | `Lightbox`/`ImageCropperDialog` (70), `ToastViewport` (100) |

**Правило:** берите значения из таблицы. Допустимы ровно два «произвольных» значения — `z-[70]` (просмотрщики фото: `Lightbox`, `ImageCropperDialog`) и `z-[100]` (`ToastViewport`); они закреплены здесь осознанно. Любые другие `z-[…]` — анти-паттерн. Radix-примитивы держат `z-50` — не опускайте их ниже `z-40`, иначе шапка перекроет модалку.

### 2.6 Контейнеры, ширины, высоты

| Токен | Утилита | Значение | Где |
|---|---|---|---|
| `--max-width-container-content` | `max-w-container-content` | 1280px | основной контент, класс `.section-container` |
| `--max-width-container-form` | `max-w-container-form` | 850px | `FormBox` — формы логина/регистрации |
| `--max-width-container-narrow` | `max-w-container-narrow` | 768px | узкие текстовые колонки (legal, TL;DR) |
| `--max-width-container-page` / `--max-width-page` | `max-w-container-page`, `max-w-page` | 1440px | внешние ограничения страницы (legal, каталог) |

**`.section-container`** — обязательная обёртка контента (1:1 со спекой): `width: 100%`, `max-width: 1280px`, `margin-inline: auto`, `padding-inline: 24px` (<768px) / `48px` (≥768px) / `64px` (≥1024px). Применяется в шапке, футере, обложке кейса, секциях, лайтбоксе.

**Full-bleed (разрешённое исключение).** Блок, которому нужна ширина во весь экран, компенсирует паддинги контейнера, а не ломает сетку: `-mx-4 w-[calc(100%+32px)] sm:… md:-mx-8 md:w-[calc(100%+64px)] lg:mx-0 lg:w-auto` (пример — обложка кейса, `case/Hero.tsx:45`, решение (24)). Так края фото совпадают по оси с контентом на мобильных и планшете, а на десктопе блок возвращается в контейнер. **Это норма, а не нарушение §7.**

Высоты (зафиксированы в коде): `h-10` = 40px (поле, кнопка `default`, пункты), `h-11` = 44px (кнопка `lg`, ссылки футера, `LinkButton`), `h-12` = 48px (`ThemeToggle`, Back, бургер, мобильные ссылки), `h-14` = 56px (hero-CTA, `CtaButton`), `h-16` = 64px (FAB). **Зона клика ≥ 44×44px** обязательна: если визуальный элемент меньше (иконка 16px), оберните в `h-11`/`h-12` c `inline-flex items-center justify-center`. Исключение, зафиксированное сознательно: поля и кнопки админки — `h-10` (40px), компромисс в пользу плотности форм (`h-11` при переносе на мобильные, см. §9 **L4**).

### 2.7 Служебные CSS-классы `globals.css`

| Класс | Назначение | Правило |
|---|---|---|
| `.header-glass` | Фон + тень стеклянной шапки | Блюр сюда **не** возвращать (§2.1.5) |
| `.hero-image-scrim` | Затемнение под текст на обложке (`<lg` — усиленный вариант) | Текст на фото — только поверх scrim |
| `.hero-block-gradient` | Фолбэк-обложки без изображения | `background-color: var(--md-sys-color-background)` |
| `.bokeh-band` | Декоративная полоса между секциями главной | `position: absolute`, `pointer-events: none`, `top: 48/96/120px` по брейкпоинтам |
| `.portfolio-card`, `.team-card`, `.platform-benefit-card` | Фон/тени/ховер карточек (§2.3) | Не дублировать фон и тени utility-классами: unlayered CSS перекрывает Tailwind |
| `.table-cell-truncate` | Обрезка ячейки админ-таблицы | Только для таблиц |
| `[id] { scroll-margin-top: 80px }` | Якорные переходы (`#work`, `#about`, `#contact`) не прячут заголовок под sticky-шапкой | 80px = высота шапки 72px + 8px (решение (18)). **Не переопределяйте** для новых якорей без причины |
| `.print-short`, `.cover-shell`, `.no-print`, `.print-avoid` | Печать/PDF (§2.8) | Только страница `/short` |

### 2.8 Печать и PDF (обязательный светлый режим)

**Правило из брифа: тёмная тема обязательна везде, кроме печати.** Реализовано одним блоком `@media print` в конце `globals.css`, который переопределяет `:root` полной светлой палитрой M3 (те же HEX, что в `:root`; специфичность `[data-theme='dark']` перебивается более поздним правилом).

Что делает блок:
- `@page { margin: 14mm }`, `body` → белый;
- `.print-short` — корень страницы `/u/[slug]/[projectSlug]/short` (обёртка в `short/page.tsx`);
- скрывает шапку, футер и всё с классом `.no-print` (`.print-short > header`, `> footer`);
- `.cover-shell` → `height: auto !important; min-height: 250px !important` (обложка растёт под контент — ничего не срезается, решение (68));
- `print-color-adjust: exact` для `.cover-shell` и `.hero-image-scrim`, иначе скрим и белые пилюли тегов не печатаются;
- `break-inside: avoid` для `.print-avoid`, `figure`, `figure *`, `button`, `blockquote`; `section > :first-child { break-after: avoid }` — заголовок не остаётся один внизу страницы.

**Правило:** печатные стили живут только здесь и только под `.print-short`; `@media print` в компонентах не добавляем. Перед `window.print()` `PrintTldrButton` переводит `<img>` в `loading=eager` и ждёт загрузки (таймаут 6 с) — иначе в PDF попадают пустые рамки.

---

## 3. Компоненты

Правило системы: **прикладной компонент собирается только из `src/components/ui/*`.** Новый визуальный элемент сначала ищется здесь; если подходящего нет — он добавляется в `ui/` с полным набором состояний (§3.11), а не пишется локально в странице.

### 3.1 `Button` — `src/components/ui/Button.tsx`

Базовая кнопка действий (админка, диалоги, формы). Построена на `class-variance-authority` + Radix-независимая; стили — на raw `var(--md-sys-color-*)` (все компоненты `ui/` используют этот стиль, прикладные — семантические утилиты; смешивание допустимо, но внутри одного файла — один стиль).

**Варианты:** `default` (primary: `bg-primary`/`on-primary`), `destructive` (`bg-error`/`on-error` — пара `error-container`/`on-error-container` давала 2.4:1 в светлой теме, Lighthouse), `outline` (граница `outline`, hover — `surface-variant`), `secondary` (`secondary-container`/`on-secondary-container`), `ghost` (прозрачная, hover — `surface-variant`), `link` (текст `primary`, `underline` в hover).
**Размеры:** `default` `h-10 px-4 py-2`, `sm` `h-9 px-3`, `lg` `h-11 px-8`, `icon` `h-10 w-10`. Скругление `rounded-md` (10px).

```tsx
import { Button } from '@/components/ui/Button';

<Button onClick={onSave} disabled={saving}>
    {saving ? 'Saving…' : 'Save'}
</Button>
<Button variant='destructive' size='sm'>Delete project</Button>
```

**Состояния:** default / `hover:opacity-90` (заливка) или `hover:bg-surface-variant` (ghost, outline) / active — тот же вид, без отдельного акцента (дефолт Tailwind) / focus-visible — `ring-2 ring-primary ring-offset-2` / disabled — `opacity-50` + `pointer-events-none` / loading — текст меняется на «Saving…» (пример: `WizardSaveBar`).

**Do:** `<Button type='button'>` для не-отправляющих действий; иконка + текст, `aria-label` если иконка одна.
**Don't:** не оборачивать кнопку в `<Link>` (или наоборот) — для навигации `LinkButton`/`CtaButton`; не красить `style={{}}`; не использовать `secondary` для деструктивных действий.

**a11y:** `focus-visible`-кольцо обязательно; `disabled` вместо скрытия; кнопка-иконка — `aria-label`. Зона клика: `h-10` (40px) для admin — это осознанный компромисс с плотностью форм; для публичных экранов используйте `h-11`/`h-12`/`CtaButton`.

### 3.2 `CtaButton` — `src/components/portfolio/CtaButton.tsx`

CTA главной и секций (`src/components/portfolio/CtaButton.tsx`). **Все варианты — пилюли `h-14 px-8`** (как hero CTA), `text-button font-medium whitespace-nowrap`, `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`. Варианты заданы в `VARIANT_CLASS` и совпадают с семействами спек:

| Вариант | Реализация |
|---|---|
| `primary` | `bg-primary text-on-primary` + `shadow-[0_4px_8px_rgba(0,0,0,0.15)]`; hover — `opacity-90` + `shadow-[0_8px_16px_rgba(0,0,0,0.20)]` |
| `secondary` | `border border-primary-container bg-surface-container-lowest text-on-background` + та же тень; hover — заливка `color-mix(in srgb, var(--md-sys-color-primary) 5%, transparent)` (работает с любым seed) |
| `ghost` | без заливки и бордера, `text-on-background`, hover `opacity-70` |
| `link` | `text-primary`, hover `underline` (`underline-offset-4`) |

Тип варианта — `ButtonVariant` из `src/lib/mainPageContent.ts`; `external` → `target='_blank' rel='noopener noreferrer'`.

```tsx
<CtaButton href='#contact' variant='primary'>Hire me</CtaButton>
<CtaButton href='https://t.me/…' variant='secondary' external>Write on Telegram</CtaButton>
```

**Do:** для публичного CTA; выбирайте вариант из `ButtonVariant` (`src/lib/mainPageContent.ts`), не пишите новые классы кнопок в страницах.
**Don't:** не ставить на кнопках инлайн-размеры; не использовать в админке (там `Button`).

### 3.3 Поля форм

Все поля: высота `h-10` (40px), радиус `rounded-md`, граница `border-outline`, фон `bg-surface` (в админке — `bg-surface-input` = `surface-container-lowest`), текст `text-body-md`, placeholder `text-on-surface-variant`, focus — `ring-2 ring-primary ring-offset-2`, disabled — `opacity-50` + `cursor-not-allowed`.

| Компонент | Специфика |
|---|---|
| `Input` | базовое текстовое поле; все пропы нативные |
| `Textarea` | `min-h-[80px]`, `resize` по умолчанию браузерный |
| `PasswordInput` | обёртка над `Input` + кнопка «глаз» (40×40, `type='button'`, `aria-pressed`, `aria-label` «Показать/Скрыть пароль», иконки `Eye`/`EyeOff`); клавиатура и `register()` работают сквозь ref |
| `Select` | Radix Select: `SelectTrigger` (h-10, иконка `ChevronDown` 16px) + портал `SelectContent` (`z-50`, `rounded-md`, `shadow-md`) + `SelectItem` с чек-индикатором; ширина поппера — по ширине триггера |
| `Checkbox` | Radix Checkbox 20×20 (`h-5 w-5`), состояние `data-[state=checked]` → заливка `primary` + иконка `Check` 16px |
| `Switch` | Radix Switch 44×24 (`h-[24px] w-[44px]`), thumb 20×20 (`h-5 w-5`), unchecked — `surface-variant`, checked — `primary` |
| `Label` | `text-label-md text-on-surface` + `mb-1`; всегда связывать через `htmlFor`/`id` |

```tsx
<Label htmlFor='title'>Title *</Label>
<Input id='title' {...register('title')} placeholder='Clinical Workflow Automation' />
{errors.title && <p className='mt-1 text-body-sm text-error'>{errors.title.message}</p>}
```

**Состояния:** default / hover (нет отдельного — по границе) / focus-visible кольцо / disabled / error — сообщение `text-body-sm text-error` под полем / loading — на уровне submit-кнопки, не поля.

**a11y:** подпись кликабельна (`htmlFor`), ошибка — рядом с полем, текстом; обязательные поля помечайте звёздочкой в `Label` **и** `required`/`aria-required` в поле; фокус не должен теряться при валидации.

**No-CLS (обязательное правило визарда):** блок подсказки/ошибки резервирует место заранее — `min-h-[1.5rem]` (пример: шаг Review, `review/page.tsx`), чтобы появление ошибки не сдвигало форму. Для полей в списках используйте тот же приём.

### 3.4 Типографика и контейнеры

| Компонент | Назначение | Правила |
|---|---|---|
| `Title` | Заголовок произвольного уровня: `tag` = `h1…h4` / `div`, `variant` = `display-sm` / `headline-{lg,md,sm}` / `title-{lg,md,sm}` | По умолчанию `headline-lg` + `h2`. Всегда указывайте `tag` по семантике страницы |
| `PageTitle` | `Title tag='h1'` с `mb-8` | Ровно один на страницу |
| `Card` + `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter` | Базовая карточка: `rounded-xl` (16px), `border-outline-variant`, `bg-surface`, `shadow-sm`; header/content/footer — `p-6` | В публичных галереях кейса используются специализированные компоненты (§3.9), а не `Card` |
| `FormBox` | `<main class='max-w-container-form'>` — 850px | Обёртка форм логина/регистрации |
| `Badge` | Пилюля-метка: `default`/`secondary`/`destructive`/`outline`/`surface`, `text-label-sm`, `rounded-full` | `destructive` = пара `error`/`on-error` (Lighthouse-исправление) |
| `TagBadge` (`case/`) | Тег кейса, спека 43:8 — 3 варианта и 2 размера. `filled`: `rounded-base bg-surface-tint px-3.5 py-2 text-white` + `shadow-[1px_1px_4px_rgba(0,0,0,0.1)]`; `outlined` (дефолт): `rounded-[10px] border border-primary/16 bg-surface-container-lowest px-3 py-1.5 text-on-surface-variant`; `ghost`: `bg-on-secondary/16 px-3 py-1 text-on-primary backdrop-blur-sm`. Размеры: `md` = `text-label-md`, `lg` = 16/24 (теги Skills/Tools на главной) | Только для тегов проекта. `text-white` в `filled` — печатный/тёмный риск (§9) |
| `SectionHeader` (`case/`) | Заголовок секции кейса: `<h2 class='font-display text-headline-md text-on-surface'>` + описание `text-body-md text-on-surface-variant`, контейнер `flex flex-col gap-6` | H2 всегда `h2`; на главной используйте `SectionLabel` + `Title` |
| `MetricCard` (`case/`) | `flex flex-1 flex-col gap-2 rounded-base bg-surface-container-lowest p-5 shadow-card`; значение `font-display text-headline-sm text-primary`, подпись `text-body-sm text-on-surface-variant` | `headline-sm`, а не `headline-lg` — LG не помещался в карточку на мобильных (фидбэк 2026-09-18) |
| `BlockLabel` (`case/`) | «01 —— Problem & Audience»: номер 11px `text-primary`, линия, подпись | Один номер на секцию кейса |
| `Avatar` | Аватар: `h-10 w-10 rounded-full`, fallback — `bg-surface-variant text-label-md` | Для персон, отзывов, основателей |
| `LinkButton` (`case/`) | Текстовая ссылка со шевроном (спека 604:597): `h-11 items-center gap-2`, `text-title-md tracking-[0.15px] text-primary`, `hover:opacity-80`, disabled — `opacity-[0.38]` + `pointer-events-none` + `aria-disabled` + `tabIndex={-1}`; внешние ссылки (`href` начинается с `http`) → `target='_blank' rel='noopener noreferrer'` | 4 состояния спеки: Enabled/Hovered/Focused/Disabled |

```tsx
<Card>
    <CardHeader>
        <CardTitle>Case study</CardTitle>
        <CardDescription>Last updated 18 Sep 2026</CardDescription>
    </CardHeader>
    <CardContent>…</CardContent>
</Card>
```

### 3.5 Оверлеи и навигация в UI

Все три построены на Radix — не переписывайте их «с нуля», они дают фокус-ловушку, Esc и `aria-*` бесплатно.

| Компонент | Специфика |
|---|---|
| `Dialog` | Портал + `DialogOverlay` (`bg-black/80`, `z-50`, `fade-in/out`); контент `max-w-lg`, `rounded-xl`, `p-6`, `shadow-lg`, `duration-200`, центрирование через `translate`; кнопка закрытия `X` 16px + `sr-only 'Close'`; `DialogTitle` (обязателен) и `DialogDescription` |
| `DropdownMenu` | Портал, `z-50`, `min-w-[8rem]`, `p-1`, `rounded-md`, `shadow-md`, `sideOffset=4`; `Item`/`CheckboxItem`/`RadioItem`/`Label`/`Separator`/`Shortcut`; `inset` — выравнивание под контент |
| `Tabs` | `TabsList` (`h-10`, `bg-surface-variant`, `p-1`, `rounded-md`), `TabsTrigger` (`text-label-md`, active — `bg-surface shadow-sm`), `TabsContent` (`mt-2`) |
| `Lightbox` (`case/`) | Просмотрщик фото кейса: `fixed inset-0 z-[70]`, подпись `text-body-sm text-white/70`, стрелки/свайп, `Esc` закрывает, блокирует скролл body |
| `ImageCropperDialog` (`components/`) | Кадрирование загружаемого фото, `z-[70]` |

**a11y:** у модалок всегда `DialogTitle`; `aria-describedby={undefined}` в `DialogContent` — описание необязательно (Radix-требование снято осознанно). Закрытие — `Esc` + кнопка `X` + клик по overlay. Фокус после закрытия возвращается триггеру (поведение Radix).

### 3.6 Обратная связь

| Компонент | Назначение | Правила |
|---|---|---|
| `Toast` (Radix Toast) | Всплывающее уведомление. `ToastViewport` — `z-[100]`, bottom-right на десктопе, top на мобиле, `md:max-w-[420px]`; `default` — `bg-surface`/`on-surface`, `destructive` — `bg-error`/`on-error` | Только для **результата** действия («Скопировано», «Сохранено»). Для ошибок формы — текст у поля. Всегда `ToastTitle` + `ToastDescription`; закрытие — крестик (появляется в hover/focus) |
| `Skeleton` | Заглушка `animate-pulse bg-surface-variant rounded-md` | Только для реально загружаемых данных; не «мигает» на SSR-страницах |
| `WizardSaveBar` (`admin/`) | Футер шага визарда: `Save` (`outline`) + `Save & Next →` (`default`); флаг «Saved ✓» `text-body-sm text-primary role='status'` на 2.5 с | Шаблон любой панели сохранения; loading — текст «Saving…» + `disabled` |

```tsx
<ToastProvider>
    <Toast variant='destructive'>
        <ToastTitle>Save failed</ToastTitle>
        <ToastDescription>Check the required fields and try again.</ToastDescription>
    </Toast>
    <ToastViewport />
</ToastProvider>
```

### 3.7 Публичная оболочка: `SiteHeader`, `SiteFooter`, `ThemeToggle`, `AuthBar`, `FAB`

#### `SiteHeader` — `src/components/case/SiteHeader.tsx`

Единственная шапка проекта, `'use client'`. **Высота: 72px desktop** (`py-2` × 2 + контент `h-14`) / **64px mobile** (`<768px`: `py-2` + `h-12`).

Пропсы: `profileSlug?`, `displayName?`, `wordmarkText?`, `wordmarkHref?`, `navItems?: {label, href}[]`, `menuMode?`, `ctaLabel?` (= `'Hire me'`), `ctaHref?` (= `'#contact'`), `variant?`, `style?`, `className?`.

| Часть | Реализация | Правило |
|---|---|---|
| Контейнер | `sticky top-0 z-40 w-full py-2` + `.header-glass` (или `bg-transparent` при `variant='transparent'`) + `backdrop-blur-md backdrop-saturate-[1.8]` | Поведение `.header-glass` не дублировать utility-классами фона |
| Контент | `.section-container relative flex items-center justify-between` | Единый контейнер с футером и секциями |
| Левая зона | `<nav class='hidden items-center gap-6 md:flex'>` с **якорными** ссылками: `Work → #work`, `About → #studio` (главная) / `#about` (страница дизайнера); `invisible` + `aria-hidden` при `menuMode` | Навигация ведёт **внутрь текущей страницы**, не на отдельные маршруты; свои ссылки — через `navItems` |
| Центр | `WordmarkLink`: `h-12 md:h-14`, `font-display text-title-lg font-medium text-primary`, `shrink-0`, `aria-label`; без label — `LogoLink` с текстом «UX42.studio» | Имя дизайнера/wordmark **не переносится** и не сжимается (`shrink-0`) |
| Правая зона | `ThemeToggle` + CTA `hidden md:inline-flex` + бургер `md:hidden` (`h-12 w-12 rounded-full`, `Menu`/`X` 24px, `aria-expanded`, `aria-label`) | Бургер — единственный способ открыть меню на мобильных |
| CTA шапки | Локальный `CtaButton`: `h-14 px-8 rounded-full border border-transparent text-button text-primary`; hover/focus — `border-primary-container` + `opacity-90` | `border-transparent` держит место: layout не прыгает при появлении рамки |
| Мобильное меню | Backdrop-кнопка `fixed inset-x-0 top-16 z-0 h-[calc(100dvh-64px)]` (закрытие по клику) + панель `fixed inset-x-0 top-16 z-10 border-b border-outline/30 bg-surface-container-lowest shadow-[0_16px_32px_0_rgba(0,0,0,0.12)] md:hidden`; внутри `.section-container flex flex-col items-stretch gap-1 py-6`, разделитель `my-3 h-px bg-outline/30`, CTA-ссылка `h-14 rounded-full bg-primary` | Размеры заданы явно: `backdrop-filter` на `<header>` создаёт containing block для `fixed`-потомков (решение (13)) |
| `menuMode` (главная) | Правая панель рендерится **порталом в `document.body`** (`createPortal`): nav + «Sign In / Sign Up» + Privacy Policy / Terms of Use | Панель обязана быть вне `<header>`, иначе обрежется по высоте шапки |
| Клавиатура | `Escape` закрывает оба меню (`useEffect` + `keydown`) | Обязательное поведение для overlay |

#### `SiteHeaderBreadcrumb` — тот же файл, для глубоких страниц (кейс)

Слева: Back-ссылка на `/u/{profileSlug}` (`h-12 rounded-sm px-4 py-3 text-button hover:bg-surface-variant`, `ArrowLeft` 24px) + `<nav aria-label='Breadcrumb' class='hidden md:flex gap-2'>` с цепочкой **Portfolio / Cases / `{currentTitle}`**; в центре — имя дизайнера (`hidden md:inline-flex`), справа — `ThemeToggle` + CTA. Используется на `/u/[slug]/[projectSlug]` (спека (31)). На мобильных хлебные крошки скрыты, остаётся Back.

#### `SiteFooter` — `src/components/case/SiteFooter.tsx`

`<footer class='flex w-full flex-col gap-8 bg-background py-12 lg:py-16'>`; содержимое в `.section-container flex flex-col gap-8`; основной ряд `flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between`.

| Зона | Содержимое и классы |
|---|---|
| Бренд | `Link href='/'` с текстом «UX42.studio» (`font-display text-title-lg font-medium text-primary`, `aria-label='UX42.studio'`) + имя дизайнера (`text-title-lg text-on-surface`) + его заголовок (`text-label-md text-on-surface-variant`) |
| Соцсети | `SocialIcon` в ссылках `h-11 w-11 rounded-full text-primary hover:opacity-70`, `target='_blank' rel='noopener noreferrer'`, `aria-label={title || platform}` (фолбэк обязателен — axe `link-name`) |
| Ссылки | `inline-flex h-11 text-body-md text-on-surface-variant hover:opacity-70`: «For designers» → `/platform` (только при `showPlatformLink`), «Privacy Policy» → `/privacy`, «Terms of Use» → `/terms`. Cookie Policy **нет** — страницы `/cookies` не существует, cookie описан в PP §3 (решение (39)/(69)) |
| Back to Gallery | Только при `profileSlug`: `h-12 rounded-full border border-outline-variant px-6 text-label-lg text-primary`, hover — `color-mix(in srgb, var(--md-sys-color-primary) 5%, transparent)` (outline-семейство) |
| Copyright | `border-t border-outline-variant pt-6` + `text-label-md text-on-surface-variant`: «© {currentYear} UX42.studio. All rights reserved.» — EN, `new Date().getFullYear()` |

#### `ThemeToggle` — `src/components/case/ThemeToggle.tsx`

Figma Switcher/Toggle 48×48: `h-12 w-12 shrink-0 rounded-full px-3 py-1 text-on-surface-variant transition-colors duration-150 ease-out hover:text-primary`, иконки `Moon`/`Sun` **24px** (`aria-hidden`). **Ховер меняет только цвет иконки — без заливки и бордера** (решение (11) от 2026-08-27). `aria-label` = «Switch to dark theme» / «Switch to light theme»; `mounted`-guard нужен, чтобы SSR и клиент не расходились. Переключение — `useTheme()` → `ThemeProvider` ставит `data-theme` на `<html>` и пишет localStorage `ux42-theme`; до гидрации тему задаёт inline-скрипт в `layout.tsx` (анти-FOUC). **Правило: не добавляйте второго переключателя темы.**

#### `AuthBar` — `src/components/AuthBar.tsx` (server component)

Полоса авторизации над публичной страницей (`bg-surface-variant/60 border-b border-outline-variant`, контент `mx-auto max-w-container-content px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-end gap-3`).

| Состояние | Поведение |
|---|---|
| Нет куки `auth-token` | Круглая ссылка `/login` (`w-8 h-8 rounded-full opacity-10 hover:opacity-70`, `LogIn` 16px, `title='Войти'`) — почти скрытая; **проблема a11y** (см. §9, **C3**: opacity 0.1 и зона клика 32px) |
| Невалидный JWT / нет `JWT_SECRET` | `null` или тот же вход, `fixed top-4 right-4 z-50`, `opacity-20` |
| Авторизован | Ссылки `text-label-sm text-on-surface-variant hover:text-on-surface`: «Суперадминка» (только `role === 'admin'`), «Админка» → `/admin`, «Мой профиль» → `/u/{slug}`; для владельца проекта — «Редактировать проект» → `/admin/projects/{id}/edit/general` (`text-primary font-medium`, но `hover:text-primary-variant` — токена нет, §9 **C2**) |

Тексты полосы — RU (внутренний инструмент), публичный UI — EN.

#### `FAB` — `src/components/FAB.tsx`

Единственная плавающая кнопка сайта; **функциональная ссылка «Contact us»** на `#contact` (`CtaSection`), а не чат-ассистент. Пропы: `href='#contact'`, `ariaLabel='Contact us'`.

`fixed bottom-8 right-8 z-50 inline-flex h-16 w-16 items-center justify-center rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none shadow-lg transition-opacity hover:opacity-90` + `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`, иконка `Mail` **24px** (`aria-hidden`), `aria-label` + `title`.

**Форма — «капля»:** три угла скруглены (`rounded-tl-full rounded-tr-full rounded-bl-full`), правый нижний — прямой (`rounded-br-none`). Это осознанная геометрия спеки, не забытый `rounded-full`.

> **Расхождение:** цвета заданы несуществующими токенами `bg-secondary-fixed-dim` / `text-on-secondary-fixed` → фон и иконка не получают цвета. Исправление — §9, пункт **C1**.

### 3.8 Компоненты кейса — `src/components/case/*`

Страница кейса (`/u/[slug]/[projectSlug]`) — эталон «витрины» проекта и главный потребитель правил ниже.

| Компонент | Назначение и ключевые правила |
|---|---|
| `Hero` | Обложка (Figma 198:1312, 1200×775): фото + `.hero-image-scrim` + оверлей заголовка `z-10` + сетка метаданных (4 карточки, зазор 24px, поля 64px — это размеры Figma, в Tailwind это `gap-6`/`p-16` внутри hero). Фолбэк без фото — `.hero-block-gradient`; нижние углы `lg:rounded-b-3xl` |
| `MetadataCard` | Карточка метаданных CLIENT / TIMELINE / MY ROLE / DEVICES: `text-label-md text-on-surface-variant` (лейбл) + `text-body-md text-on-surface` (значение) |
| `CaseSection` | Обёртка секции: `BlockLabel` + `SectionHeader` + контент, вертикальный `gap-8` (32px) |
| `PortfolioCard` | Универсальная карточка кейса: заголовок `headline/small` + текст; используется в списках работ/связанных проектов |
| `ResultsCard` | Результат (мастер 200:1125, 524×66, padding 20px, radius 14px → `p-5 rounded-lg`): check-иконка + текст. Компактная горизонтальная карточка результата |
| `PersonaCard` | Персона (176:372), вертикальная: label «USER PERSONA» → `Avatar` + имя/роль → цитата |
| `TestimonialCard` | Отзыв клиента (**Figma 176:378**): белая карточка `rounded-lg` (14px) + `shadow-card` + `p-8`; кавычка «“» — `font-display text-[100px] leading-[76px] text-primary`, `aria-hidden` (декоратив); цитата `text-body-lg text-on-surface`; имя `text-label-lg text-primary` (16/24 600); роль/компания `text-body-md text-on-surface-variant`; аватар 40×40 `rounded-full`, опционален | Секция «Client reviews» кейса (`project_reviews`). Ровно эти токены дают значения макета: `#ffffff`, r=14, тень `0 2px 12px rgba(0,0,0,.06)`, `#00543b`, `#44474b` |
| `NextStepsList` | Список «Next steps»: маркер-точка 6×6 + текст, горизонтальный зазор 14px (`gap-3.5`) |
| `BeforeAfterComparison` | Блок «Before/After» (195:1299): label + 2 изображения рядом, зазор 24px (`gap-6`) |
| `GalleryGrid` | Сетка wireframes 2×2, зазор 24px (`gap-6`, Figma 199:57) или moodboard-пресет: CSS Grid `auto-fill min 240px gap-16`, первая ячейка крупная (`span 2` строк) |
| `ShowcaseGallery` | Финальные дизайны (решение (50), 2026-09-14) — **основная галерея кейса**. Вместо «киноплёнки»: композиция из первых трёх фото — длинное 1072×420 (`r-16`) + ряд «квадрат + плоское» (мастер 410:539); mobile — длинное 4/3 + пара 1/1. Любые пропорции входа → `object-cover` в фиксированные слоты. Если фото > 3 — на третьем слоте постоянный оверлей «+N photos» (информационный: клик открывает третье фото). Caption под слотом `text-body-sm`, одна строка с «…» |
| `MasonryGallery` | Pinterest-вариант (решение (51)) — для иллюстраторов/фотографов: натуральные пропорции, 2 колонки mobile / 3 на `lg`, без кропа; `next/image` с `width/height` из БД, fallback-квадрат |
| `JustifiedGallery` | «Гармоничная сетка» (решение (52)) — равновысокие ряды без кропа, край в край. Чистый CSS: `flex-wrap`, `flex-basis = ar × --target-h`, `flex-grow = ar`; целевая высота 130px mobile → 240px desktop. У кадров `ar < 1.15` кап ширины 2.2 × target-h (защита от «одинокого портрета») |
| `MoodboardGrid` | Пресет-галерея (271:498) с оверлеем и закрытием по `Esc` |
| `Lightbox` | Просмотрщик фото: `fixed inset-0 z-[70] bg-[rgba(20,22,20,0.94)] backdrop-blur-sm`, подпись `text-body-sm text-white/70`, стрелки/свайп, `Esc` закрывает, блокирует скролл body. Роль `dialog` + `aria-modal` (паттерн `MoodboardGrid`) |
| `NextProjectShowcase` | Блок «следующий проект» (198:1336, 1200×704): разделитель → H2 + текст → кнопка «Start Project» → карточка 1072×228 (`pad-40`, `r-20`) |
| `CaseShortView` | Компактный вид кейса для `/short` (печатная/короткая версия) |
| `PrintTldrButton` | Кнопка печати PDF: перед `window.print()` переводит все `img` в `loading=eager` и ждёт `complete/error` с таймаутом 6 с |
| `DesignSystemColors`, `TypographyScale` | Демонстрация палитры и шкалы шрифтов (сетка 280:214/280:217, `r-20`) — для проверки, что seed-тема применилась |
| `TagBadge`, `BlockLabel`, `SectionHeader`, `MetricCard`, `LinkButton` | См. §3.4 |

**Правила галерей кейса:** выбор варианта (showcase / masonry / justified) задаёт дизайнер при загрузке; все три открывают общий `Lightbox`; пропорции **никогда** не растягиваются (`object-cover` в фикс. слот или натуральный размер в masonry/justified); на печати (`/short`) галереи скрываются или печатаются первым слотом.

### 3.9 Компоненты главной и платформы — `src/components/portfolio/*`

| Компонент | Назначение и правила |
|---|---|
| `HeroSection` | Первый экран главной: заголовок `display-sm`/`font-display`, подзаголовок `body-lg`, CTA (`CtaButton`), декоративный `FloatingElements` |
| `SectionLabel` | Overline-подпись секции (11px uppercase `text-on-surface-variant` + линия) |
| `AboutSection` | «Студия»: текст + `team-card`-карточки основателей |
| `ApproachSection` | «Подход»: шаги/этапы |
| `SkillsSection` | Навыки тегами `TagBadge size='lg'` |
| `PortfolioGallerySection` | Сетка работ `portfolio-card` |
| `PlatformBenefitsSection` | Выгоды платформы `platform-benefit-card` |
| `ProBonoBanner` | Баннер pro bono (контрастная плашка) |
| `CtaSection` | Секция контакта (`id='contact'`) — цель `FAB` и якорей `#contact` |
| `Carousel` | **Единственная** мобильная карусель карточек работ: `<sm` — full-bleed стрип со scroll-snap, `≥sm` — сетка 2/3. Классы: `-mx-6 -mb-5 -mt-3 w-[calc(100%+48px)] px-6 pb-7 pt-3 gap-4` + `scroll-px-6` (snap-цель = паддинг 24px, стрип всегда «доезжает» ровно); карточка `basis-full` = 327px @375 — ровно ширина сетки, сосед виден до края экрана (peek 8px). Требования к детям: корень с `w-full` (`PortfolioCard` ✓) и `[&>*]:min-w-0` против truncate | **Используется и главной, и страницей дизайнера** — геометрия живёт только здесь. Правка одной страницы «под себя» запрещена |
| `FloatingElements` | Декоративный слой (bokeh и т.п.), **учитывает `prefers-reduced-motion`** |
| `CtaButton`, `SectionLabel` | См. §3.2, §3.4 |

### 3.10 Админ-компоненты — `src/components/admin/*`

Визуальный язык тот же, но **плотнее**: `h-10` вместо `h-14`, `text-body-sm/label-md`, без декоративных теней. Админка — рабочий инструмент, а не витрина.

| Компонент | Назначение и правила |
|---|---|
| `WizardSidebar` | Навигация по 8 шагам визарда: `general → problem → research → design → gallery → showcase → results → review`. Активный шаг определяется по `usePathname()`; ссылка на превью `Eye` |
| `WizardSaveBar` | Панель сохранения шага: `Save` (`outline`) + «Save & Next →» (`default`); «Saved ✓» — `role='status'`, гаснет через 2.5 с |
| `AdminGridEditor` + `GridSlot` | Сортировка/замена фото слота: `useDraggable`/`useDroppable` (`@dnd-kit/core`) + `useDropzone` (`react-dropzone`), иконки `Upload`/`GripVertical`/`RefreshCw` |
| `CaseSortManager` | Порядок кейсов (drag & drop) |
| `SectionsVisibilityEditor` | Вкл/выкл секций кейса (`Switch`) |
| `MainPageContentEditor` | Редактор контента главной, включая seed-цвет и режимы фона/шапки (§2.1.3–2.1.5) |
| `MoodboardGridSection` | Секция moodboard-галереи |
| `TldrShareButtons` | Шаринг TL;DR (копирование/ссылка) |
| `DeleteAccountSection` | «Удаление профиля» (настройки): контейнер страницы оборачивает в `Card class='border-error'`, компонент рисует только содержимое. Триггер — `outline` с `border-error text-error hover:bg-error/10` (как Danger Zone в GitHub), финальное действие — сплошной `variant='destructive'`. Отбивка действий — `border-t border-outline-variant` + `pt-6` |
| `AccountNameForm` | Имя и фамилия владельца (`admin/`), раздел «Аккаунт» настроек. Одно поле + панель сохранения по образцу `WizardSaveBar`; подсказка отсылает к «Брендинг и SEO» на `/admin/profile` |
| `Field` (`ui/`) | Поле формы: `Label` + контрол + `min-h-[1.5rem]` под подсказку/ошибку (No-CLS, §3.3). Приоритет у ошибки, иначе показывается `hint` |

**a11y админки:** каждая форма — `Label` + `Input` в паре, ошибки текстом рядом с полем; подтверждение деструктивных действий обязательно; загрузка файлов — с прогрессом и текстовым состоянием, не только спиннером.

### 3.11 Auth- и legal-компоненты

| Компонент | Правила |
|---|---|
| `LoginForm`, `RegisterForm`, `ChangePasswordForm` (`src/components/auth/`) | Собираются из `ui/*` (`FormBox`, `Label`, `Input`, `PasswordInput`, `Button`). **Только RU** — auth не локализован. Ошибка — `text-body-sm text-error` + `role='alert'`; `loading` — `disabled` + «Вход…» |
| `LegalPageShell` (`src/components/legal/`) | Оболочка `/privacy` и `/terms`: своя тонкая шапка `sticky top-0 z-30 bg-background shadow-card` (высота `h-14`) с Back (`ArrowLeft` 18px) + `aria-label='Breadcrumb'` (Main / «Privacy Policy» / «Terms of Use») + `ThemeToggle`, затем `SiteFooter`. `SiteHeader` **не используется** — у него якорная навигация главной (решения (36)/(38)) |
| `LegalArticle` | Статья legal: `max-w-container-narrow`, `title-md`/`body-md`, разделители `border-outline-variant`, якоря заголовков для оглавления |

**Правило футера legal:** соцсети скрыты (источник ссылок студии не определён — не хардкодить), пункты Terms/Cookies скрыты при отсутствии `profileName` — как на страницах дизайнера (решение (29)).

---

## 4. Лейауты, сетки, брейкпоинты

### 4.1 Брейкпоинты

Стандартные брейкпоинты Tailwind v4 (новые не вводим):

| Префикс | Мин. ширина | Что меняется |
|---|---|---|
| базовый | 0 | 1 колонка, вертикальные стеки, мобильное меню, нижняя навигация |
| `sm:` | 640px | горизонтальные группы, 2 колонки в узких сетках |
| `md:` | 768px | **перелом шапки** (показывается nav, исчезает бургер), 2 колонки, 2–3 карточки в ряд |
| `lg:` | 1024px | 3–4 колонки, 4 карточки метрик, `.section-container` `px-64` |
| `xl:` | 1280px | максимальная ширина контента достигнута — `max-w-container-content` |
| `2xl:` | 1536px | визуально не используется, чтобы контент не «расплывался» |

**Правила:**
- Mobile-first: базовые стили — для мобильных, расширения — через `md:`/`lg:`.
- Не используйте «междубрейкпоинтов» состояния вида `max-md:` без необходимости — они ломают масштабирование между 640 и 768.
- Значимые переломы (`header`, `section-container` pads, `.bokeh-band` top) совпадают с `md` и `lg` — не вводите свои.

### 4.2 Паттерны страниц

| Паттерн | Маршруты | Структура |
|---|---|---|
| Главная студии | `/` | `SiteHeader menuMode` → `AuthBar` (если авторизован) → секции (`HeroSection` → About → Approach → Skills → `PortfolioGallerySection` → `ProBonoBanner` → `PlatformBenefitsSection` → `CtaSection id='contact'`) → `SiteFooter` + `FAB` |
| Страница дизайнера | `/u/[slug]` | `SiteHeader profileSlug` → блоки визарда (TL;DR, кейсы, отзывы, контакты) → `SiteFooter profileSlug` + `FAB`; seed-палитра инлайном через `generateThemeCss` |
| Кейс | `/u/[slug]/[projectSlug]` | `SiteHeaderBreadcrumb` → `Hero` → секции кейса → `NextProjectShowcase` → `SiteFooter` |
| Короткая/печатная версия | `/u/[slug]/[projectSlug]/short` | `CaseShortView` + `PrintTldrButton`, корень `.print-short`; шапка/футер скрыты в печати |
| Платформа | `/platform` | Отдельный вход для дизайнеров: `SiteHeader` с `navItems` (Back to studio / Example), выгоды + CTA |
| Auth | `/login`, `/register`, смена пароля | `(auth)/layout.tsx`: только `FormBox` + минимум chrome, **RU**, тёмная тема доступна |
| Legal | `/privacy`, `/terms` | `LegalPageShell` + `LegalArticle`; EN/ES, узкая колонка |
| Админка | `/admin/*` | `WizardSidebar` + контент + `WizardSaveBar`; плотная сетка, `Card`-ы, таблицы |
| Настройки | `/admin/settings` | Личное и безопасность: сайдбар `Аккаунт` (email только для чтения + `AccountNameForm`) / `Безопасность` (`ChangePasswordForm`) / `Удаление профиля` (`DeleteAccountSection` в `Card` с `border-error`). `/admin/profile/password` — редирект сюда (на старую ссылку приходят письма) |
| Super-admin | `/super-admin/*` | Своя навигация (`Overview`/`Users`) в `layout.tsx`, требует `role === 'admin'` |

**Правила:**
- Страница = `<main>` с единственным `h1` (`PageTitle`) и последовательными `<section>` с `aria-labelledby`/`BlockLabel`.
- Пустая секция из-за скрытых данных не резервирует место (`hidden`), а не остаётся пустым блоком.
- На каждой странице выше есть `SiteHeader` (или его вариант) **и** `SiteFooter` — кроме `/short` в печати и auth-страниц.

### 4.3 Сетки

| Сетка | Фактические классы |
|---|---|
| Контент | `.section-container` + flex/grid; между блоками `gap-16` (64px), внутри — `gap-3`/`gap-4`; между лейблом и полем — `mb-1` |
| Сетка кейсов (главная) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24` (ячейка ≈341px = (1072−48)/3) |
| Метаданные в hero кейса | `grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-6` |
| Wireframes | `grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[238px]` (Figma 199:57) |
| Moodboard | `sm:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]` + `gap-4`, первая ячейка крупная (`span 2` строк) |
| Мобильные галереи кейса | горизонтальный snap-скролл: `flex snap-x snap-mandatory gap-4 overflow-x-auto` + `basis-[calc(100%-16px)]`; на `sm` становится сеткой |
| Admin | 1 колонка на мобильных, 2–3 на планшете/десктопе; формы `max-w-container-form` |

### 4.4 Правила вёрстки

- **Без фиксированных высот для текста** — `min-h` или `min-h` в контейнере; редактируемый заголовок не должен обрезаться.
- Изображения: `next/image`, всегда с `alt` (пустой `alt` для декоративных), фиксированные пропорции слота через `aspect-*`/`object-cover`, либо натуральные размеры (masonry/justified).
- Полноширинные блоки выравниваются по оси с контентом через `-mx-4`/`-mx-8` (см. §2.6).
- Sticky-элемент — только шапка (`z-30`–`z-40`); контент под ней не должен перекрываться (`scroll-margin` для якорей).

---

## 5. Доступность (WCAG 2.1 AA)

### 5.1 Обязательные требования

| Требование | Как выполнено в проекте | Правило |
|---|---|---|
| Контраст текста 4.5:1 (крупный 3:1) | Пары `primary`/`on-primary`, `on-surface`/`surface` из M3-палитры; ошибки — `error`/`on-error`, **не** `error-container`/`on-error-container` (2.4:1, Lighthouse) | Пара `X-container`/`on-X-container` — только для крупных плашек, не для текста под кнопкой |
| Фокус виден | `focus-visible:outline-2 outline-offset-2 outline-primary` (ссылки-кнопки, CTA) или `ring-2 ring-primary ring-offset-2` (поля, Radix) | Никогда не `outline-none` без равноценной замены |
| Не полагаться на цвет | Состояния через иконку/текст/подчёркивание, не только цвет | Активный таб — фон + `shadow-sm`; чекбокс — иконка `Check` |
| Зона клика ≥ 44×44 | `h-11`/`h-12`/`h-14`/`h-16` для интерактивных; `ThemeToggle` 48×48, иконка 24px внутри `h-12` | Мелкие иконки оборачивать в контейнер 44px |
| Имя у иконочных элементов | `aria-label` на кнопке-иконке и ссылке на соцсеть (`SocialIcon` — фолбэк на `platform`), `alt` у изображений | Декоративные иконки — `aria-hidden` |
| Клавиатура | `Esc` закрывает overlay (меню, модалки, лайтбокс); Radix-ловушка фокуса; `Tab`-порядок = визуальный порядок | Не прячьте интерактивные элементы от клавиатуры |
| Статусы и ошибки | «Saved ✓» — `role='status'`; ошибка формы — `role='alert'` | Динамический текст не только цветом |
| Reduced motion | `FloatingElements` отключает декоративный слой; остальные переходы `duration-150` | Не добавлять бесконечных анимаций |
| Печать | Только светлая тема, `break-inside: avoid`, `print-color-adjust: exact` для обложки | Печать — исключение из правила тёмной темы |

**Правило:** новый компонент в `ui/` сначала проверяется по этой таблице, затем по правилам своей зоны (§3.11 auth/legal) — иначе он не готов.

### 5.2 Проверка

- Тёмная тема проверяется на каждой странице, включая печатную (светлую) и режимы `seed-tint`/`solid`.
- Целевые значения: Lighthouse a11y ≥ 95, axe — ноль critical.
- Ручная проверка перед релизом: клавиатура (Tab/Shift+Tab/Esc), 200% zoom, `prefers-reduced-motion: reduce`, печать в PDF.

---

## 6. Текст, локализация, legal

### 6.1 Языки (зафиксировано, новых языков не добавляем)

| Часть | Язык |
|---|---|
| Публичный UI (главная, кейсы, платформа) | **EN** |
| Legal (`/privacy`, `/terms`) | **EN + ES**, переключатель в UI |
| Auth (`/login`, `/register`, смена пароля) | **RU** |
| Админка, `AuthBar`, super-admin | **RU** |
| Комментарии в коде | RU допустим, идентификаторы — EN |

**Правило:** i18n-слой «на будущее» не добавляем. Новый текст в публичной части — сразу EN; в legal — продублировать в ES; в auth/admin — RU. Смешивать языки на одном экране нельзя (кроме legal, где переключатель явный).

### 6.2 Тон и микрокопирайт

- Студия говорит от первого лица во множественном числе («we design»), без канцелярита и без «революционных» обещаний.
- Заголовки — про результат клиента, не про процесс: «Fewer clicks per report», а не «Our innovative approach».
- Кнопки — глагол + объект: «Save & Next», «Start project», «Contact us». Не «OK», не «Submit».
- Ошибки — что произошло и что делать: «Check the required fields and try again», а не «Error 400».
- Плейсхолдер — пример формата («Clinical Workflow Automation»), **не** замена лейблу: у поля всегда есть видимый `Label`.
- Числа и метрики — конкретные; «до +300%» только с источником.
- Пункты меню — до трёх слов; тексты в `Label`/`Badge` — в нижнем регистре, кроме имён собственных и брендов.

### 6.3 Legal-страницы

- Юридический текст не сокращается «для дизайна»: длинные разделы допустимы, узкая колонка `max-w-container-narrow`.
- Privacy Policy: версия/дата, какие данные собираются, cookie (описан в §3 — отдельной Cookie Policy нет, маршрута `/cookies` не существует), контакты для вопросов.
- Terms of Use: условия использования, права на контент, ответственность.
- Ссылки на несуществующие страницы запрещены: перед добавлением ссылки проверьте, что маршрут существует (решение (39)).
- Правка legal требует согласования и не должна ломать мультиязычный переключатель.

---

## 7. Анти-паттерны

Что запрещено и почему — с указанием, что делать вместо.

| # | Анти-паттерн | Почему | Что делать |
|---|---|---|---|
| 1 | Хардкод цвета (`#…`, `rgb(…)`, `white`/`black` в контексте темы) | Ломается в тёмной теме и при seed-палитре дизайнера | Токен `bg-primary`, `text-on-surface-variant` и т.п. |
| 2 | Несуществующий токен (`text-primary-variant`, `bg-secondary-fixed-dim`, `on-secondary-fixed`, …) | Класс молча не работает — элемент остаётся без цвета (реальные случаи: `FAB`, `AuthBar`) | Проверить токен в §2.1.1; если его нет — задать цвет заново |
| 3 | `rounded-[14px]`, `text-[15px]`, `shadow-[…]`, `z-[…]` в разметке | Обходит дизайн-систему, ломает тему и правки | Токен из §2.2–2.5 |
| 4 | `.dark`-класс для темы | В проекте тема — атрибут `data-theme` | `<html data-theme='dark'>` + токены из `globals.css` |
| 5 | `backdrop-filter` в `.header-glass` | LightningCSS вырезает стандартную форму → блюр не работает в Firefox | `backdrop-blur-md backdrop-saturate-[1.8]` утилитами (§2.1.5) |
| 6 | Фиксированная высота текстового блока (`h-…` на заголовке/описании) | Обрезает редактируемый контент | `min-h` или auto |
| 7 | `error-container`/`on-error-container` под текстом кнопки | 2.4:1 в светлой теме | `error`/`on-error` |
| 8 | `outline-none` / `focus:hidden` без замены | Потеря клавиатурной навигации | `focus-visible:outline-2 outline-primary` или `ring-2 ring-primary` |
| 9 | Иконка-кнопка без `aria-label`; картинка без `alt` | axe `link-name` / `image-alt` | `aria-label` / содержательный `alt` |
| 10 | Зона клика < 44×44 без обёртки | Неудобно на тач; WCAG 2.5.8 | `h-11`+ или контейнер `inline-flex h-11 w-11` |
| 11 | Тёмная тема в `@media print` | Тёмный PDF с нечитаемыми фото и текстом | Блок `@media print` в `globals.css` (§2.8) |
| 12 | `!important` в компонентах | Непредсказуемо перебивает систему | Изменить источник/специфичность; `!important` — только в print-блоке |
| 13 | Свой локальный `Button`/`Card`/`Dialog` в странице или в `src/components/` | Расхождение с UI-китом, дубли состояний | `ui/*`; новый примитив — в `ui/` |
| 14 | Второй переключатель темы, вторая шапка или второй футер на странице | Дублирование глобального chrome | `SiteHeader`/`SiteHeaderBreadcrumb`/`LegalPageShell` + `SiteFooter` |
| 15 | Ссылки на несуществующие маршруты (404) | Сломанный UX; в шапке/футере особенно заметно | Проверять маршрут; удалять, а не «оставлять на будущее» |
| 16 | Флаг `i18n` «на будущее», EN-тексты в RU-зоне и наоборот | Смешение языков | Правила §6.1 |
| 17 | Мобильный фиксированный элемент перекрывает футер/контент | Обрезанный контент, нельзя доскроллить | `z-index` по §2.5 + отступ снизу под fixed-элементы |
| 18 | Дублирование `padding-inline` контента руками вместо `.section-container` | Расхождение краёв с Figma-спекой | `.section-container` (§2.6) |
| 19 | `loading=lazy` на фото, которые печатаются | Пустые рамки в PDF | `PrintTldrButton` переводит в eager перед печатью (§2.8) |
| 20 | Новый публичный текст на русском (вне auth/admin) | Нарушение языковой схемы | EN по §6.1 |

---

## 8. Связанные документы

| Документ | Роль | Отношение к этому файлу |
|---|---|---|
| `src/app/globals.css` | Реализация токенов, `@theme`, utility-классов, print-блока | **Источник истины №1.** Документ описывает его; при конфликте — правьте код, потом документ |
| `src/lib/theme.ts` | Генератор seed-палитры | Источник истины для §2.1.3 |
| `src/lib/mainPageContent.ts` | Типы контента главной, `ButtonVariant`, режимы фона/шапки | Источник истины для §2.1.4–2.1.5, §3.2 |
| `Docs/ui/design-system-ux42.md` | **Спецификация для Figma** (Make-подобная): компоненты, размеры, состояния, тексты | Спека, по которой строятся Figma и код. Здесь — правила и код-реализация; при расхождении фиксируется в §9 |
| `Docs/ui/Main_page_Spec.md` | Спецификация главной страницы, пронумерованные решения (1)…(72) | Источник для «решений (N)», упомянутых здесь |
| `Docs/ui-rules.md` | Исторический набор UI-правил (уже не действует) | **Замён указателем на этот документ** (§9, **M6**); правила, которые из него перешли, — §2.3, §3.3, §2.6, §5.1 |
| `Docs/roadmap/*.md` | Планы (в т.ч. `ai-assistant-fab.md` — план настоящего ассистента) | Вне дизайн-системы |
| `Docs/figma-tokens.md` | **Карта «код ↔ Figma»**: роль M3 ↔ токен, что переименовать и что завести в Figma | Нужен при переносе токенов **из кода в Figma** (текущее направление). Дополняет §2 |
| `material-theme/*.tokens.json` | **Экспорт M3 из Figma** — 6 режимов: Light, Light Medium/High Contrast, Dark, Dark Medium/High Contrast. **Источник истины для семейства Error** | Канонический источник значений палитры. Код синхронизируется с `Light`/`Dark`; контрастные режимы пока не заведены — см. §9 **L6** |

**Правило работы с документом:** любое новое правило сначала появляется в коде, потом — здесь, с пометкой источника. Изменение палитры, типографики, радиусов или слоёв — только через `globals.css` + этот документ синхронно.

---

## 9. Расхождения «код vs документ» — план исправлений

Список собран сверкой кода с этим документом и спекой. Каждый пункт — либо правка кода, либо правка документа. Пока пункт открыт, код содержит исключение.

### 9.1 Критично (ломает тему или a11y)

| # | Расхождение | Факт в коде | Исправление | Статус |
|---|---|---|---|---|
| **C1** | `FAB` использовал несуществующие токены `bg-secondary-fixed-dim` / `text-on-secondary-fixed` — фон и иконка оставались дефолтными | Классы молча не применялись | **Не баг, а недостающая реализация:** семейство «стеклянных» поверхностей заведено в палитру (§2.1.2). `FAB` получил `bg-secondary-fixed-dim` + `backdrop-blur-md` + `text-on-secondary-fixed` | ✅ Закрыто |
| **C2** | `hover:text-primary-variant` — токена `primary-variant` в палитре нет | Роль **Primary Variant в M3 не существует** (это имя из Material 2). Подтверждено AI-агентом в Figma: токена нет и в макете, и появляться ему не следует | Токен **не заводим**. Элемент уже `text-primary`, поэтому цвет в hover не переключаем — используем state layer `hover:opacity-80` (M3 state layer). Если всё же нужен отдельный цвет — имя `--color-primary-hover` | ✅ Закрыто |
| **C3** | `AuthBar` для гостя: `w-8 h-8 opacity-10` | Зона клика 32px, контраст ~0.1 | `h-11 w-11` + `text-on-surface-variant` (8.87:1 / 10.90:1), `aria-label`; «спрятанность» сохранена размером, а не прозрачностью | ✅ Закрыто |
| **C4** | `TagBadge variant='filled'`: `text-white` на `bg-surface-tint`; в тёмной теме tint = `#83d7b1`, белый ≈ 1.8:1 | Ниже AA | Заведена пара `on-surface-tint` (6.44:1 / 7.73:1), литерал `text-white` убран; заодно `rounded-[10px]` → `rounded-md` | ✅ Закрыто |

> **Про C1:** владелец подтвердил, что «белая стекляшка с тёмно-серым текстом» — это осознанный вид (текущий вид FAB в Figma), а не ошибка. Поэтому решение — **дописать токены**, а не менять стиль. То же семейство `secondary-fixed-dim` предназначено для модалок виртуального помощника (`Docs/roadmap/ai-assistant-fab.md`).

### 9.2 Желательно (соответствие системе, не блокеры)

| # | Расхождение | Исправление | Файлы |
|---|---|---|---|
| **M1** | ~~Нет глобального `prefers-reduced-motion` (учитывался только `FloatingElements`)~~ | **Закрыто:** глобальный сброс в `globals.css` (§2.4) + скриптовый слой в `FloatingElements` | `src/app/globals.css` |
| **M2** | Произвольные радиусы в разметке: `rounded-[12px]`, `rounded-[24px]`, `rounded-[48px]` | `rounded-[12px]` → `rounded-base` — **сделано** в `DesignSystemColors`/`TypographyScale`. Остались: `rounded-[24px]`, `rounded-[48px]` | `case/DesignSystemColors.tsx`, `app/(public)/page.tsx:323`, `case/SiteHeader.tsx:430` |
| **M3** | `Lightbox` и `ImageCropperDialog` на `z-[70]` — значение не было закреплено | **Закрыто:** `z-[70]` и `z-[100]` разрешены явно (§2.5), код менять не нужно |
| **M4** | `Hero` компенсирует паддинги контейнера через `-mx-4`/`-mx-8` + `w-[calc(100%+…)]` | **Закрыто:** full-bleed зафиксирован как норма в §2.6 |
| **M5** | ~~В UI есть ссылки на M3 fixed-роли (`*-fixed`), которых нет в палитре~~ | **Закрыто:** семейство `secondary-fixed-dim` / `on-secondary-fixed` заведено в палитру (§2.1.2) и используется `FAB` | `globals.css`, `FAB.tsx` |
| **M6** | `Docs/ui-rules.md` дублирует правила отступов/сеток и частично с ними расходится | Заменён указателем на этот документ | `Docs/ui-rules.md` |
| **M7** | Страница дизайнера имела **собственный** стрип карусели (`basis-[calc(100%-16px)]`, правый отступ ~20px), хотя по решению (34) карточки обеих страниц должны быть идентичны на мобильном | **Закрыто:** `PortfolioGallerySection` теперь рендерит общий `portfolio/Carousel` — эталон главной страницы (full-bleed, сосед до края экрана) | `src/components/portfolio/PortfolioGallerySection.tsx` |

### 9.3 Позже (на будущее, не блокирует)

| # | Наблюдение | Предлагаемое решение |
|---|---|---|
| **L1** | Motion-шкалы нет в `@theme` (§2.4 фиксирует фактические значения) | Вынести `--duration-*` / `--ease-*` в `@theme` при следующем походе по анимациям |
| **L2** | Тени собраны из CSS-классов и raw `shadow-[…]`; токен только один (`--shadow-card`) | Ввести `--shadow-card-raised` / `--shadow-header` и перевести `.portfolio-card`, `.team-card` на токены |
| **L3** | Высоты интерактивных элементов заданы утилитами (`h-10`…`h-16`) без токенов | Ввести `--control-height-*`, если значения начнут расходиться |
| **L4** | `h-10` (40px) в админских формах меньше рекомендуемых 44px | Либо принять плотность админки как явное исключение (уже отражено в §2.6), либо поднять до `h-11` |
| **L5** | Печать использует `!important` (`height: auto !important`, `min-height: 250px !important`) | Допустимо для print-слоя; при рефакторинге — убрать за счёт более специфичного селектора |
| **L6** | В `material-theme/` лежат 4 контрастных режима (Light/Dark Medium и High Contrast), которых нет в коде | **Отложено 29.09.2026.** Добавить по `@media (prefers-contrast: more)`, но только вместе с решением по приоритету CSS: seed-CSS приходит `<style>` в `<body>` позже линка с `globals.css`, при равной специфичности побеждает он — значит контраст просто не применится на страницах дизайнеров. Нужен либо `data-contrast` + селектор с двумя атрибутами, либо перенос seed-CSS в `<head>` |

### 9.4 Проверка после синхронизации

1. `grep -rn 'primary-variant\|secondary-fixed' src/` — пусто.
2. Тёмная тема: главная, `/u/[slug]`, кейс, `/short`, `/platform`, `/privacy`, `/terms`, `/login`, `/admin` — контраст текста ≥ 4.5:1.
3. Seed-тема (`/u/[slug]` с нестандартным сидом) — вторичные кнопки, FAB, теги, границы сохраняют контраст.
4. Клавиатура: `Tab` по шапке/меню/модалкам, `Esc` закрывает все overlay.
5. Печать в PDF со `/short` **в тёмной теме** — PDF светлый, фото не пустые, заголовки не отрываются от текста.
6. `prefers-reduced-motion: reduce` — декоративная анимация остановлена.

---

## 10. Быстрый старт

```bash
npm run dev          # Next.js + Tailwind v4 (LightningCSS)
npm run build        # проверка сборки и типов
npm run lint
```

Порядок работы над UI-фичей:

1. Найти или создать компонент в `src/components/ui/` (§3).
2. Взять токены из `globals.css` через семантические утилиты (§2) — никаких HEX.
3. Собрать на `Button` / `CtaButton` / полях из `ui/*`, состояния — по §3.1–3.3 и §5.1.
4. Проверить обе темы, мобильный брейкпоинт, клавиатуру и печать (если страница печатаемая).
5. Обновить этот документ, если введено новое правило или компонент.
