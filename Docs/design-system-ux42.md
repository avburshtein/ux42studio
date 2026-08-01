# UX42 Design System Specification

> **Назначение:** Единый источник правды (SSOT) по токенам, цветам, типографике, эффектам и компонентам для экосистемы **UX42.studio**.
> **Источник данных:** Figma-файл (file key: U5OjywCHbtzQgBsi7PU25r), коллекция переменных "material-theme", UX42-theme.json (Material Theme Builder export).
> **Дата генерации:** 2026-07-22

---

## 1. Общие сведения о теме

- **Система:** Material Design 3 (Material You)
- **Seed Color:** `#0B6E4F` (Forest Green)
- **Коллекция переменных:** "material-theme" — 321 переменная, 6 режимов
- **Шрифты:** Poppins (заголовки), Inter (тело/лейблы)
- **Режимы цветовых схем:**
  - light — Светлая тема (по умолчанию)
  - light-medium-contrast — Повышенный контраст (светлая)
  - light-high-contrast — Максимальный контраст (светлая)
  - dark — Тёмная тема
  - dark-medium-contrast — Повышенный контраст (тёмная)
  - dark-high-contrast — Максимальный контраст (тёмная)

### Core Colors (Seed-значения)

| Роль | HEX | Описание |
|------|-----|----------|
| Primary | `#0B6E4F` | Бренд, ключевые действия, активные состояния |
| Secondary | `#FF6467` | Акценты, выделения, вторичные действия |
| Tertiary | `#FBFFFA` | Поддерживающие нейтралы, тонкие фоны |
| Error | `#D17D00` | Предупреждения, ошибки, деструктивные действия |
| Neutral | `#6A7282` | Текст, поверхности, бордеры |
| Neutral Variant | `#99A1AF` | Тонкий текст, разделители, аутлайны |

### Extended / Custom Colors

| Название | Seed | Light color | Light container |
|----------|------|-------------|-----------------|
| Lime / Accent | `#CCFF00` | `#546524` | `#D7EB9B` |
| Lavender Light | `#A29FFE` | `#5A5891` | `#E2DFFF` |
| Lavender Purple | `#C084FC` | `#6E528A` | `#F0DBFF` |

---

## 2. Цветовая схема — Light

| Токен | HEX |
|-------|-----|
| primary | `#1E6A4F` |
| on-primary | `#FFFFFF` |
| primary-container | `#0B6E4F` |
| on-primary-container | `#98EDC6` |
| secondary | `#B12A33` |
| on-secondary | `#FFFFFF` |
| secondary-container | `#FF6467` |
| on-secondary-container | `#680010` |
| tertiary | `#5B5F5C` |
| on-tertiary | `#FFFFFF` |
| tertiary-container | `#FBFFFA` |
| on-tertiary-container | `#717672` |
| error | `#8A5100` |
| on-error | `#FFFFFF` |
| error-container | `#D17D00` |
| on-error-container | `#402300` |
| surface | `#FCF8FA` |
| on-surface | `#1B1B1D` |
| surface-variant | `#E1E2E8` |
| on-surface-variant | `#44474B` |
| surface-dim | `#DCD9DA` |
| surface-bright | `#FCF8FA` |
| surface-container-lowest | `#FFFFFF` |
| surface-container-low | `#F6F3F4` |
| surface-container | `#F0EDEE` |
| surface-container-high | `#EAE7E8` |
| surface-container-highest | `#E4E2E3` |
| outline | `#75777C` |
| outline-variant | `#C5C6CC` |
| background | `#F7FAF5` |
| on-background | `#181D1A` |
| inverse-surface | `#303031` |
| inverse-on-surface | `#F3F0F1` |
| inverse-primary | `#83D7B1` |
| surface-tint | `#056C4D` |
| shadow | `#000000` |
| scrim | `#000000` |

---

## 3. Цветовая схема — Dark

| Токен | HEX |
|-------|-----|
| primary | `#8CD5B3` |
| on-primary | `#003826` |
| primary-container | `#0B6E4F` |
| on-primary-container | `#98EDC6` |
| secondary | `#FFB3B1` |
| on-secondary | `#680011` |
| secondary-container | `#FF6467` |
| on-secondary-container | `#680010` |
| tertiary | `#FFFFFF` |
| on-tertiary | `#2D312E` |
| tertiary-container | `#DFE4DF` |
| on-tertiary-container | `#616562` |
| error | `#FFB86E` |
| on-error | `#492900` |
| error-container | `#D17D00` |
| on-error-container | `#402300` |
| surface | `#131314` |
| on-surface | `#E4E2E3` |
| surface-variant | `#44474B` |
| on-surface-variant | `#C5C6CC` |
| surface-dim | `#131314` |
| surface-bright | `#39393A` |
| surface-container-lowest | `#0E0E0F` |
| surface-container-low | `#1B1B1D` |
| surface-container | `#1F1F21` |
| surface-container-high | `#2A2A2B` |
| surface-container-highest | `#353536` |
| outline | `#8F9196` |
| outline-variant | `#44474B` |
| background | `#101412` |
| on-background | `#E0E3DF` |
| inverse-surface | `#E4E2E3` |
| inverse-on-surface | `#303031` |
| inverse-primary | `#056C4D` |
| surface-tint | `#83D7B1` |
| shadow | `#000000` |
| scrim | `#000000` |

---

## 4. Fixed Colors (не меняются между light/dark)

| Токен | HEX |
|-------|-----|
| primary-fixed | `#9FF4CC` |
| primary-fixed-dim | `#83D7B1` |
| on-primary-fixed | `#002115` |
| on-primary-fixed-variant | `#005139` |
| secondary-fixed | `#FFDAD8` |
| secondary-fixed-dim | `#FFB3B1` |
| on-secondary-fixed | `#410007` |
| on-secondary-fixed-variant | `#8F0E1F` |
| tertiary-fixed | `#DFE4DF` |
| tertiary-fixed-dim | `#C3C8C3` |
| on-tertiary-fixed | `#181D1A` |
| on-tertiary-fixed-variant | `#434845` |

---

## 5. Тональные палитры (Tonal Palettes)

### Primary
| Step | HEX |
|------|-----|
| 0 | `#000000` |
| 10 | `#002115` |
| 20 | `#003826` |
| 30 | `#005139` |
| 40 | `#056C4D` |
| 50 | `#2F8565` |
| 60 | `#4CA07D` |
| 70 | `#67BB97` |
| 80 | `#83D7B1` |
| 90 | `#9FF4CC` |
| 95 | `#BDFFDE` |
| 99 | `#F4FFF7` |
| 100 | `#FFFFFF` |

### Secondary
| Step | HEX |
|------|-----|
| 0 | `#000000` |
| 10 | `#410007` |
| 20 | `#680011` |
| 30 | `#8F0E1F` |
| 40 | `#B12A33` |
| 50 | `#D34449` |
| 60 | `#F55D60` |
| 70 | `#FF8887` |
| 80 | `#FFB3B1` |
| 90 | `#FFDAD8` |
| 95 | `#FFEDEB` |
| 100 | `#FFFFFF` |

### Tertiary
| Step | HEX |
|------|-----|
| 0 | `#000000` |
| 10 | `#181D1A` |
| 20 | `#2D312E` |
| 30 | `#434845` |
| 40 | `#5B5F5C` |
| 50 | `#737874` |
| 60 | `#8D928E` |
| 70 | `#A8ACA8` |
| 80 | `#C3C8C3` |
| 90 | `#DFE4DF` |
| 95 | `#EEF2ED` |
| 100 | `#FFFFFF` |

### Neutral
| Step | HEX |
|------|-----|
| 0 | `#000000` |
| 10 | `#1C1B1C` |
| 20 | `#313031` |
| 30 | `#474647` |
| 40 | `#5F5E5F` |
| 50 | `#787777` |
| 60 | `#929091` |
| 70 | `#ADABAB` |
| 80 | `#C8C6C6` |
| 90 | `#E5E2E2` |
| 95 | `#F3F0F0` |
| 100 | `#FFFFFF` |

### Neutral Variant
| Step | HEX |
|------|-----|
| 0 | `#000000` |
| 10 | `#1B1B1D` |
| 20 | `#303032` |
| 30 | `#474648` |
| 40 | `#5F5E5F` |
| 50 | `#777778` |
| 60 | `#919092` |
| 70 | `#ACABAC` |
| 80 | `#C8C6C7` |
| 90 | `#E4E2E3` |
| 95 | `#F3F0F1` |
| 100 | `#FFFFFF` |

---

## 6. Типографика (Typography Scale)

Все текстовые стили в Figma имеют обязательный префикс `material-theme/`.
Пример: `material-theme/display/large`, `material-theme/body/medium`.

### Display (Poppins Medium — Герои и лендинг-заголовки)

| Стиль | Размер | Line Height | Letter Spacing |
|-------|--------|-------------|----------------|
| display/large | 68px | 76px | -0.25px |
| display/medium | 64px | 72px | 0px |
| display/small | 52px | 60px | 0px |

### Headline (Poppins Medium — Заголовки секций)

| Стиль | Размер | Line Height | Letter Spacing |
|-------|--------|-------------|----------------|
| headline/large | 48px | 56px | 0px |
| headline/medium | 34px | 42px | 0px |
| headline/small | 26px | 34px | 0px |

### Title (Смешанный — Подзаголовки, карточки)

| Стиль | Шрифт | Размер | Line Height | Letter Spacing |
|-------|-------|--------|-------------|----------------|
| title/large | Poppins Medium | 20px | 28px | 0px |
| title/medium | Inter Medium | 16px | 24px | 0.15px |
| title/small | Inter Medium | 14px | 20px | 0.1px |

### Body (Inter Regular — Параграфы, описания)

| Стиль | Размер | Line Height | Letter Spacing |
|-------|--------|-------------|----------------|
| body/large | 18px | 28px | 0.5px |
| body/medium | 16px | 24px | 0.25px |
| body/small | 14px | 22px | 0.4px |

### Label (Inter Semi Bold / Medium — Теги, бейджи, подписи)

| Стиль | Шрифт | Размер | Line Height | Letter Spacing |
|-------|-------|--------|-------------|----------------|
| label/large | Inter Semi Bold | 16px | 24px | 0.1px |
| label/medium | Inter Medium | 13px | 20px | 0.5px |
| label/small | Inter Semi Bold | 11px | 16px | 0.5px |
| label/overline | Inter Semi Bold | 10px | 16px | 0.5px |

### Button

| Стиль | Шрифт | Размер | Line Height | Letter Spacing |
|-------|-------|--------|-------------|----------------|
| button/default | Inter Medium | 16px | 24px | 0px |

---

## 7. Градиентные стили (Gradient Paint Styles)

| Название | Тип | Цвета | Применение |
|----------|-----|-------|------------|
| Brand/Primary Gradient | LINEAR | `#0B6E4F` → `#2C5A07` | Брендовые элементы, фоны иконок |
| Gradient/Icon Background | LINEAR | `#0B6E4F` → `#2C5A07` | Заливки фонов иконок |
| Gradient/Accent Purple | LINEAR | `#A29FFE` → transparent | Лавандовое свечение, декоративные оверлеи |
| Gradient/Accent Violet | LINEAR | `#C084FC` → transparent | Фиолетовый акцент, фоновая атмосфера |
| Gradient/Accent Green | LINEAR | `#0B6E4F` → transparent | Градиент на тексте (hero), зелёное свечение |

---

## 8. Стили эффектов (Effect Styles)

### Blur-эффекты
| Название | Тип |
|----------|-----|
| Effects/Blur/Glass Heavy | Background Blur (тяжёлый glass) |
| Effects/Blur/Glass Medium | Background Blur (средний glass) |
| Effects/Blur/Glass Light | Background Blur (лёгкий glass) |
| Effects/Float/Hero | Layer Blur (парящие элементы hero) |
| Effects/Float/CTA | Layer Blur (парящие элементы CTA) |
| Effects/Float/Glass Card | Layer Blur (glassmorphism-карточки) |

### Тени — Light Theme
| Название | Параметры |
|----------|-----------|
| Shadow/Button Default | x:2 y:2 blur:4 rgba(0,0,0,0.10) |
| Shadow/Button Hover Green | x:4 y:4 blur:12 rgba(11,110,79,0.20) |
| Shadow/Button Hover Black | x:4 y:4 blur:12 rgba(0,0,0,0.20) |
| Shadow/Small Element | x:2 y:2 blur:8 rgba(0,0,0,0.15) |
| Shadow/Badge Cert | x:2 y:2 blur:12 rgba(0,0,0,0.10) |
| Shadow/Card Default | 3 слоя: x:10 y:10 blur:8 sp:-2 rgba(177,211,196,0.30) + x:16 y:9 blur:12 sp:-1 rgba(242,242,242,0.86) + x:4 y:4 blur:2 rgba(0,0,0,0.05) |
| Shadow/Card Hover Light | 3 слоя: x:12 y:12 blur:10 sp:-2 rgba(177,211,196,0.40) + x:20 y:12 blur:16 sp:-1 rgba(242,242,242,0.90) + x:6 y:6 blur:3 rgba(0,0,0,0.08) |
| Shadow/Section Light | x:8 y:8 blur:20 rgba(0,0,0,0.10) |
| Shadow/Navbar Line | x:0 y:1 blur:0 rgba(0,0,0,0.06) |
| Shadow/Modal | x:0 y:20 blur:60 rgba(0,0,0,0.30) |
| Card default green | 2 слоя: x:0 y:16 blur:56 rgba(212,241,230,0.25) + x:0 y:2 blur:8 rgba(0,0,0,0.06) |

### Тени — Dark Theme
| Название | Параметры |
|----------|-----------|
| Shadow/Card Dark | 2 слоя: x:0 y:20 blur:40 rgba(0,0,0,0.40) + x:0 y:10 blur:20 rgba(0,0,0,0.30) |
| Shadow/Card Hover Dark | 2 слоя: x:0 y:30 blur:60 rgba(0,0,0,0.50) + x:0 y:15 blur:30 rgba(0,0,0,0.40) |
| Shadow/Section Dark | x:8 y:8 blur:20 rgba(255,255,255,0.05) |

---

## 5b. Spacing Tokens (коллекция "spacing")

Тип: FLOAT | Scoping: GAP, WIDTH_HEIGHT | Режим: Default

| Токен | Значение | Применение |
|-------|----------|------------|
| spacing/0 | 0px | Без отступа |
| spacing/2 | 2px | Микро (иконки внутри) |
| spacing/4 | 4px | Минимальный (между иконкой и текстом) |
| spacing/6 | 6px | Мини (внутри badge) |
| spacing/8 | 8px | Малый (padding кнопок, gap тегов) |
| spacing/10 | 10px | Промежуточный |
| spacing/12 | 12px | Фильтр-кнопки gap, padding маленький |
| spacing/14 | 14px | Padding аккордеонов, иконка gap |
| spacing/16 | 16px | Стандартный (CTA gap, card padding, tight sections) |
| spacing/20 | 20px | Контейнерный (padding form fields) |
| spacing/24 | 24px | Средний (card grid gap, section header gap) |
| spacing/28 | 28px | Padding карточек |
| spacing/32 | 32px | Свободный (paragraph margin, CTA кнопки) |
| spacing/40 | 40px | Макро (padding форм) |
| spacing/48 | 48px | Секционный (padding doc frame, stat gap) |
| spacing/56 | 56px | Крупный (между блоками) |
| spacing/64 | 64px | Hero padding-x, stat padding-top |
| spacing/80 | 80px | Section vertical padding |
| spacing/96 | 96px | Большая секция |
| spacing/112 | 112px | Hero padding-top |
| spacing/120 | 120px | CTA padding-y |
| spacing/160 | 160px | Максимальный |

---

## 5c. Border Radius Tokens (коллекция "radius")

Тип: FLOAT | Scoping: CORNER_RADIUS | Режим: Default

| Токен | Значение | Применение |
|-------|----------|------------|
| radius/none | 0px | Без скругления |
| radius/xs | 4px | Мелкие элементы |
| radius/sm | 8px | Чипы, мелкие теги |
| radius/md | 10px | Кнопка Save, фильтры |
| radius/base | 12px | Теги навыков, инпуты (form) |
| radius/lg | 14px | Кнопка сохранения кейса |
| radius/xl | 16px | Google Cert Badge, URL Slug |
| radius/2xl | 20px | Аккордеоны секций, карточки формы |
| radius/3xl | 24px | Карточки портфолио, about, контейнеры |
| radius/4xl | 28px | Extra-large карточки |
| radius/5xl | 48px | CTA-кнопки, pill-формы |
| radius/full | 9999px | Полностью круглые (аватары, pill) |

---

## 5d. Sizing Tokens (коллекция "sizing")

Тип: FLOAT | Scoping: WIDTH_HEIGHT | Режим: Default

### Иконки
| Токен | Значение |
|-------|----------|
| sizing/icon/xs | 16px |
| sizing/icon/sm | 18px |
| sizing/icon/md | 20px |
| sizing/icon/lg | 24px |
| sizing/icon/xl | 32px |

### Кнопки (высота)
| Токен | Значение |
|-------|----------|
| sizing/button/sm | 36px |
| sizing/button/md | 44px |
| sizing/button/lg | 48px |
| sizing/button/xl | 56px |

### Инпуты (высота)
| Токен | Значение |
|-------|----------|
| sizing/input/sm | 40px |
| sizing/input/md | 48px |
| sizing/input/lg | 56px |

### Контейнеры (ширина)
| Токен | Значение | Применение |
|-------|----------|------------|
| sizing/container/content | 1200px | Основной контент |
| sizing/container/form | 850px | Ширина формы (case-template) |
| sizing/container/narrow | 768px | Узкий контент (заголовки секций) |
| sizing/container/page | 1440px | Viewport страницы |

### Layout
| Токен | Значение |
|-------|----------|
| sizing/navbar/height | 87px |
| sizing/section/padding-y | 80px |
| sizing/section/padding-x-hero | 64px |

---

## 5e. Opacity Tokens (коллекция "opacity")

Тип: FLOAT | Scoping: OPACITY | Режим: Default

| Токен | Значение | Применение |
|-------|----------|------------|
| opacity/0 | 0% | Полностью прозрачный |
| opacity/5 | 5% | Едва заметный |
| opacity/6 | 6% | Navbar line shadow |
| opacity/8 | 8% | M3 Hover state layer |
| opacity/10 | 10% | M3 Focus state layer |
| opacity/12 | 12% | Disabled background |
| opacity/16 | 16% | M3 Pressed state layer |
| opacity/20 | 20% | Hover shadow кнопок |
| opacity/25 | 25% | Card green shadow |
| opacity/30 | 30% | Modal shadow, card shadow |
| opacity/38 | 38% | Disabled text/elements |
| opacity/50 | 50% | Полупрозрачный |
| opacity/60 | 60% | Средняя прозрачность |
| opacity/72 | 72% | Navbar frosted glass |
| opacity/80 | 80% | Высокая |
| opacity/90 | 90% | Почти непрозрачный |
| opacity/100 | 100% | Полностью непрозрачный |
---

## 9. State Layers (Интерактивные состояния)

Система использует полупрозрачные оверлеи поверх базового цвета элемента:

| Состояние | Opacity | Применение |
|-----------|---------|------------|
| Hover | 8% (0.08) | Наведение на интерактивный элемент |
| Focus | 10% (0.10) | Фокус клавиатуры / выделение |
| Pressed | 16% (0.16) | Нажатие / активное состояние |

Цвет оверлея — всегда соответствующий `on-*` токен элемента (например, `on-primary` для кнопки primary).

---

## 10. Компоненты (Component Inventory)

Все мастер-компоненты расположены на странице "Design System" (page id: 6:2).
Компоненты используют привязки к переменным M3 для поддержки 6 режимов.

### Кнопки (Buttons)
| Компонент | Описание |
|-----------|----------|
| Button/Primary | Основная CTA, зелёная заливка, белый текст, тень при hover |
| Button/Secondary | Outlined-кнопка, бордер + текст |
| Button/Ghost | Текстовая кнопка без заливки и бордера |
| Link Button | Инлайн-ссылка с стрелкой |
| Icon Button | Круглая кнопка с иконкой |
| Filter Button | Переключатель-фильтр (active/inactive) |
| FAB | Floating Action Button, фиксирован внизу справа |
| Arrows | Стрелки навигации (влево/вправо) |
| Back Button | Кнопка "Назад" |

### Навигация (Navigation)
| Компонент | Описание |
|-----------|----------|
| Nav Link | Пункт горизонтального меню |
| Header | Полная навигационная панель: лого + nav links + CTA |
| Switcher/Toggle | Переключатель темы / опций |

### Теги и бейджи (Tags & Badges)
| Компонент | Описание |
|-----------|----------|
| Tag/Badge | Pill-тег с вариантами: Filled, Outlined |
| Label/Section Tag | UPPERCASE-лейбл секции |
| Availability Pill | Индикатор "Available for hire" |
| Google Cert Badge | Бейдж сертификации с иконкой |
| Services Checklist | Пункт списка с чекмаркой |

### Карточки (Cards)
| Компонент | Описание |
|-----------|----------|
| Service Card | Карточка услуги с иконкой + описание |
| Accent Card | Карточка с градиентным фоном |
| Portfolio Card | Карточка проекта с изображением + overlay |
| Rating | Компонент звёздного рейтинга |
| Card-opinion-person | Отзыв с аватаром |
| Card-opinion | Текстовый отзыв |
| Pricing Card Basic | Базовый тарифный план |
| Pricing Card Standard | Стандартный тарифный план |
| Pricing Card Premium | Премиум тарифный план |

### Инпуты и формы (Inputs & Forms)
| Компонент | Описание |
|-----------|----------|
| Input | Текстовое поле с лейблом + placeholder |
| Input Subscription | Email-подписка с кнопкой |
| Dialog Content | Содержимое модального диалога |

### Иконки и медиа (Icons & Media)
| Компонент | Описание |
|-----------|----------|
| ServiceCard Icons | Набор иконок для сервисных карточек |
| Logo | Логотип бренда |
| Slider | Карусель / слайдер изображений |
| Social Media Icons | Иконки соцсетей |
| Icons Set | Общая библиотека иконок |

### Layout (Макет)
| Компонент | Описание |
|-----------|----------|
| Section | Обёртка секции: container + content slot |
| Page Desktop | Контейнер страницы: Header + Slot + Footer |
| Footer Desktop | Полноширинный футер с ссылками + соцсети |

### Overlays
| Компонент | Описание |
|-----------|----------|
| Portfolio Modal | Полноэкранный оверлей деталей проекта |

---

## 11. Система Layout и архитектура

### Slot-based структура страницы

```
Page Desktop
├── Header (компонент, фиксированный top)
├── Slot for section (фрейм — принимает инстансы Section)
│   ├── Section (instance)
│   │   └── Container (1200px, centered)
│   │       └── Content Slot (контент секции)
│   ├── Section (instance)
│   └── ...
└── Footer Desktop (компонент, фиксированный bottom)
```

### Размеры и отступы

| Параметр | Значение |
|----------|----------|
| Viewport (Desktop) | 1440px |
| Content max-width | 1200px |
| Section vertical padding | 80px |
| Card grid | HORIZONTAL + WRAP |
| Grid gap | 24px (both axes) |
| Spacing tight | 16px |
| Spacing medium | 24px |
| Spacing loose | 32px |
| Spacing sections | 48px |

### Важные правила реализации

- Нельзя добавлять дочерние элементы в инстансы компонентов — только в мастер
- Переменные привязываются через `figma.variables.setBoundVariableForPaint()`
- Текстовые стили применяются через `node.textStyleId = style.id`
- `layoutSizingHorizontal = "FILL"` — только ПОСЛЕ добавления в авто-лейаут родителя
- `layoutWrap = "WRAP"` — только на HORIZONTAL layout

---

## 12. Variable Collections Reference

### Сводка по коллекциям

| Коллекция | Тип | Кол-во | Режимы | Scoping |
|-----------|-----|--------|--------|---------|
| material-theme | COLOR | 322 | Light, Dark, + Med/High Contrast | ALL_FILLS, STROKE_COLOR |
| spacing | FLOAT | 22 | Default | GAP, WIDTH_HEIGHT |
| radius | FLOAT | 12 | Default | CORNER_RADIUS |
| sizing | FLOAT | 19 | Default | WIDTH_HEIGHT |
| opacity | FLOAT | 17 | Default | OPACITY |

Всего: 5 коллекций, 392 переменных

### Конвенция именования

```
material-theme:
  sys/{scheme}/{token-name}         → Семантические цвета (55 на схему)
  surfaces/{scheme}/surface1-5      → Elevation tints
  state-layers/{scheme}/{token}/opacity-{value} → Интерактивные состояния
  extended/{color-name}/{scheme}/*  → Кастомные цвета

spacing:
  spacing/{value}                   → 0, 2, 4...160

radius:
  radius/{semantic-size}            → none, xs, sm...full

sizing:
  sizing/{category}/{size}          → icon/xs, button/md, container/content

opacity:
  opacity/{percent}                 → 0, 5, 6, 8...100
```

---

## 13. Быстрый справочник для AI-контекста

```
PROJECT: UX42 Portfolio & Services Website
DESIGN SYSTEM: Material Design 3 (Material You)
SEED: #0B6E4F (Forest Green)
MODES: light, dark (+ medium/high contrast variants each)

BRAND COLORS:
  Primary: #0B6E4F (green)     Secondary: #FF6467 (coral)
  Tertiary: #FBFFFA (white)    Error: #D17D00 (amber)
  Accent Lime: #CCFF00         Lavender: #A29FFE
  Purple: #C084FC

FONTS:
  Headings: Poppins Medium (display 68/64/52, headline 48/34/26)
  Body: Inter Regular (18/16/14)
  Labels: Inter Semi Bold / Medium (16/13/11/10)
  Buttons: Inter Medium 16px
  ALL STYLES PREFIXED: "material-theme/"

KEY LIGHT TOKENS:
  Background: #FCF8FA   Text: #1B1B1D   Primary: #1E6A4F
  Container: #0B6E4F    Surface-low: #F6F3F4   Outline: #75777C

KEY DARK TOKENS:
  Background: #131314   Text: #E4E2E3   Primary: #8CD5B3
  Container: #0B6E4F    Surface-low: #1B1B1D   Outline: #8F9196

GRADIENTS:
  Brand: #0B6E4F -> #2C5A07 (linear)
  Accent Green: #0B6E4F -> transparent
  Accent Purple: #A29FFE -> transparent
  Accent Violet: #C084FC -> transparent

SHADOWS (Light):
  Button: x2 y2 blur4 black/10%
  Card: 3-layer (green tint + white + subtle black)
  Modal: x0 y20 blur60 black/30%

LAYOUT:
  Page: 1440px viewport, 1200px content max-width
  Sections: 80px vertical padding
  Grid: horizontal wrap, 24px gap
  Spacing scale: 16 / 24 / 32 / 48px

TOKEN COLLECTIONS:
  material-theme: 322 COLOR vars (6 modes: light/dark × 3 contrasts)
  spacing: 22 FLOAT vars (0-160px, scoped: GAP/WIDTH_HEIGHT)
  radius: 12 FLOAT vars (0-9999px, scoped: CORNER_RADIUS)
  sizing: 19 FLOAT vars (icons/buttons/inputs/containers, scoped: WIDTH_HEIGHT)
  opacity: 17 FLOAT vars (0-100%, scoped: OPACITY)

COMPONENTS: Button (Primary/Secondary/Ghost), Link Button, Icon Button,
  Filter Button, FAB, Header, Nav Link, Footer Desktop, Section,
  Page Desktop, Tag/Badge, Portfolio Card, Service Card, Accent Card,
  Pricing Cards (3 tiers), Input, Dialog, Portfolio Modal, Slider,
  Rating, Testimonial Cards, Google Cert Badge, Switcher/Toggle
```