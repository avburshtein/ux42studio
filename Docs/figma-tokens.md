# Карта токенов: код ↔ Figma (для AI-агента в Figma)

> **Зачем документ.** Перенос идёт **из кода в Figma** (ранее было наоборот).
> Источник истины — `src/app/globals.css`. Этот файл объясняет, какая роль
> M3 какому токену соответствует, чтобы агент в Figma не «слепил» значения,
> которые уже есть в коде под другим именем.
>
> **Главное правило:** роль важнее HEX. `#0b6e4f` — это не «зелёный вообще»,
> это `primary-container`. Если назвать токен `green`, при генерации кода
> получится `bg-primary` с неверной контрастностью.

## 1. Цвета: Figma → код

| Токен в Figma | HEX | Роль в коде (CSS-переменная) | Статус |
|---|---|---|---|
| `color.primary.green` | `#0b6e4f` | `--md-sys-color-primary-container` | ⚠️ **Имя вводит в заблуждение.** Это `primary-container`, а НЕ `primary`. `primary` = `#00543b` |
| `color.primary.green-secondary` | `#2c5a07` | — | В коде не используется (только для градиента) |
| `color.primary.green-light` | `rgba(11,110,79,.2)` | — | В коде не используется |
| `color.primary.green-accent` | `rgba(177,211,196,.3)` | `--shadow-card-accent` | ✅ Совпадает (тени карточек) |
| `color.semantic.destructive` | `#d4183d` | `--md-sys-color-error` = `#c81e00` | ⚠️ Расхождение: в коде `#c81e00` (светлая) / `#fd7654` (тёмная) |
| `color.semantic.success` | `#0b6e4f` | `primary-container` | То же значение, другая роль |
| `color.semantic.warning` | `#f59e0b` | — | Отдельной роли в M3 нет. Ближайшее — `error-container` в тёмной теме (`#d17d00`) |
| `color.border.light` | `rgba(0,0,0,.1)` | `--md-sys-color-outline-faint` | ✅ Сведено Sept 2026 |
| `color.border.dark` | `rgba(255,255,255,.15)` | `--md-sys-color-outline-faint` (тёмная) | ✅ |
| `color.surface.input-light` | `#f3f3f5` | `--md-sys-color-surface-input` = `#ffffff` | ⚠️ Расхождение: код = `surface-container-lowest` (белый) |
| `color.surface.input-dark` | `#1a1a1a` | `surface-input` = `#0e0e0f` | ⚠️ Расхождение |
| `color.background.light.main` | `#ffffff` | `--md-sys-color-surface-container-lowest` | ⚠️ Фон **страницы** в коде = `background` = `#f7faf5`; белый — канвас контента |
| `color.background.dark.main` | `#252525` | Ближе всего `surface-container` `#1f1f21` | ⚠️ Фон страницы в коде = `#101412` |
| `color.text.light.primary` | `#070309` | `--md-sys-color-on-surface` = `#1b1b1d` | ⚠️ Расхождение |
| `color.text.light.secondary` | `rgba(18,21,14,.71)` | `on-surface-variant` = `#44474b` (**непрозрачный**) | ⚠️ В коде вторичный текст непрозрачный — так контраст считается корректно |
| `color.text.dark.*` | `#ffffff` / `.7` / `.5` | `on-surface` `#e4e2e3` / `on-surface-variant` `#c5c6cc` | ⚠️ Аналогично: в коде непрозрачные |

## 2. Токены, которых в Figma нет, а в коде — есть

Их нужно **завести** в Figma при переносе, иначе агент будет изобретать значения:

| Токен в коде | Светлая | Тёмная | Зачем |
|---|---|---|---|
| `--md-sys-color-primary` | `#00543b` | `#83d7b1` | Основной акцент. В Figma сейчас только `#0b6e4f`, а это container |
| `--md-sys-color-surface-tint` | `#056c4d` | `#83d7b1` | Заливка чипов / акцентных плашек |
| `--md-sys-color-on-surface-tint` | `#ffffff` | `#003826` | Текст на тинте. **Обязателен:** в тёмной теме тинт светлеет, белый даёт ~1.8:1 (провал AA) |
| `--md-sys-color-secondary-fixed-dim` | `#f2f0f4` | `#3a3a3c` | «Стеклянный» слой: FAB + будущие модалки ассистника |
| `--md-sys-color-on-secondary-fixed` | `#333338` | `#e5e2e6` | Текст на стекле (11.10:1 / 8.84:1) |
| `--md-sys-color-outline` | `#75777c` | `#8f9196` | Контур полей, границы таблиц |
| `--md-sys-color-outline-variant` | `#c5c6cc` | `#44474b` | Контур карточек, разделители |
| `--md-sys-color-outline-faint` | `rgba(0,0,0,.1)` | `rgba(255,255,255,.15)` | Едва заметный контур контейнера (Color Tokens, Type scale) |
| `--md-sys-color-scrim` | `#000000` | `#000000` | Затемнение под модалками |
| Surface container, 5 ступеней | `#ffffff → #e4e2e3` | `#0e0e0f → #353536` | Шкала высоты поверхностей. В Figma заменена одним «main» |
| `--shadow-card` | `0 2px 12px rgba(0,0,0,.06)` | — | Базовая тень карточки |

## 3. Радиусы: требуется переименование

| Сейчас в Figma | Значение | Что в коде | Рекомендация |
|---|---|---|---|
| `borderRadius.button` | 48px | CTA-пилюли `h-14` — да (`rounded-full`) | → **`button.pill`**. 48px = полная капсуля, а не «кнопка вообще» |
| `borderRadius.input` | 48px | Поля форм — **10px** (`rounded-md`) | ⚠️ **Значение неверное.** Либо `input: 10px`, либо удалить |
| `borderRadius.card` | 24px | `rounded-3xl` (обложка кейса) | ✅ Значение верное, но имя лучше `radius-3xl` |
| `borderRadius.badge` | 12px | `rounded-base` (TagBadge filled) | ✅ |
| `borderRadius.image` | 16px | `rounded-xl` (фото в галереях) | ✅ |
| `borderRadius.minimal` | 6px | **нет** (у нас `xs`=4, `sm`=8) | Либо удалить, либо привести к шкале |

Полная шкала радиусов в коде: `none 0 · xs 4 · sm 8 · md 10 · base 12 · lg 14 · xl 16 · 2xl 20 · 3xl 24 · 4xl 28 · 5xl 48 · full 9999`.

## 4. Типографика: расхождения

| В Figma | В коде | Статус |
|---|---|---|
| `h1-desktop` 52px | `--text-display-sm` 52/60 | ✅ |
| `h2` 42px | ❌ нет (у нас `headline-lg` 48, `headline-md` 34) | ⚠️ Нет токена 42px |
| `h3` 30px | ❌ нет (ближе всего `headline-sm` 26) | ⚠️ |
| `h4` 22px | ❌ нет (ближе `title-lg` 20) | ⚠️ |
| `body-large` 18 / `body` 16 / `body-small` 14 | ✅ 1:1 | ✅ |
| `caption` 12px | ❌ нет (у нас `label-sm` 11) | ⚠️ |
| `price` 48px | `headline-lg` 48/56 | ✅ (подписать как `display-price` или убрать) |
| `letterSpacing.h1…h4` **отрицательные** (−0.52…−0.22) | В коде трекинг **не отрицательный нигде** | ⚠️ При переносе не вводить отрицательный трекинг |
| `lineHeight` 1.2 / 1.3 / 1.4 / 1.5 | У каждого размера свой фиксированный | ⚠️ В коде line-height привязан к размеру, не к начертанию |

Полная шкала в коде — 16 токенов, от `--text-display-sm` (52/60) до `--text-label-overline` (10/16). Ориентир: `Docs/design-system.md` §2.2.

## 5. Пространство и брейкпоинты

- `spacing` (4…112) — ✅ совпадает с сеткой 4px. В коде шаги шире: `4 8 12 16 20 24 32 40 48 56 64 80 96`.
- `breakpoint.desktop` 1440 = `--max-width-page` ✅ · `laptop` 1024 = `lg` ✅ · `tablet` 768 = `md` ✅
- `breakpoint.mobile` **375** — брейкпоинта в коде нет. Мобильный = всё, что `< 768` (базовые стили + `sm:` 640). Не вводите 375 как отдельный брейкпоинт.

## 6. Решения по токенам, которых не было

| Тема | Решение |
|---|---|
| `primary-variant` (C2) | **Роли в M3 не существует** — это имя из Material 2. В Figma токена нет, и появляться ему не должен. Hover для текста, который уже `primary`, делается **state layer** (`opacity 80%`), а не сменой цвета. Если всё же нужен отдельный цвет — называть `--color-primary-hover`, не `primary-variant` |
| `text-white` на `surface-tint` | Заменён на токен `on-surface-tint`. **Нельзя** использовать белый: в тёмной теме тинт светлеет до `#83d7b1` |

## 7. Чек-лист перед применением в Figma

1. `color.primary.green` → переименовать в `primary-container`; **завести** `primary` = `#00543b`.
2. `borderRadius.button` → `button.pill`; `borderRadius.input` исправить на 10px или удалить.
3. Добавить `on-surface-tint` и семейство `fixed-dim` — иначе FAB и чипы в тёмной теме нечитаемы.
4. `semantic.destructive` привести к `#c81e00` (светлая) / `#fd7654` (тёмная).
5. Не вводить отрицательный `letterSpacing` и брейкпоинт 375.
6. Шкалу поверхностей заменить одним «main» на 5 ступеней + `background` отдельно.
7. `background.*.main` привести к фону страницы (`#f7faf5` / `#101412`), а белый/black оставить для канваса контента.
