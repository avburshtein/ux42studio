# 🎨 Руководство по использованию дизайн-системы в Figma

## 📋 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Создание Color Styles](#создание-color-styles)
3. [Настройка типографики](#настройка-типографики)
4. [Компоненты и стили](#компоненты-и-стили)
5. [Auto Layout параметры](#auto-layout-параметры)
6. [Экспорт и синхронизация](#экспорт-и-синхронизация)
7. [Чек-лист](#чек-лист)

---

## Быстрый старт

### ⚡ Не хотите создавать всё вручную?

👉 **[FIGMA_AUTOMATION.md](./FIGMA_AUTOMATION.md)** - автоматический импорт за 5 минут!

Доступные методы:
- 🔥 Импорт Design Tokens (2 минуты)
- 🎨 Импорт с сайта через html.to.design (5 минут)
- 📦 Использование готовых шаблонов (3 минуты)

---

### Ручное создание (если нужен полный контроль):

### Шаг 1: Создайте новый Figma файл
1. Создайте файл с названием **"Design System - [Название проекта]"**
2. Создайте следующие страницы:
   - 🎨 **Foundation** (Цвета, типографика, spacing)
   - 🧩 **Components** (UI компоненты)
   - 📱 **Screens** (Готовые экраны)
   - 📚 **Documentation** (Документация и примеры)

### Шаг 2: Откройте документацию
Используйте эти файлы как референс:
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - полная дизайн-система
- **[DESIGN_CHEATSHEET.md](./DESIGN_CHEATSHEET.md)** - быстрая шпаргалка
- **[UI_KIT.md](./UI_KIT.md)** - UI компоненты

---

## Создание Color Styles

### 1. Создайте структуру стилей

#### В Figma:
`Right click > Styles > + Create new Color Style`

Структура:
```
Design System/
├── Primary/
│   ├── Green/Primary (#0b6e4f)
│   ├── Green/Secondary (#2c5a07)
│   └── Green/Light (rgba(11, 110, 79, 0.2))
├── Text/
│   ├── Light/Primary (#070309)
│   ├── Light/Secondary (rgba(18, 21, 14, 0.71))
│   ├── Light/Muted (rgba(18, 21, 14, 0.5))
│   ├── Dark/Primary (#ffffff)
│   ├── Dark/Secondary (rgba(255, 255, 255, 0.7))
│   └── Dark/Muted (rgba(255, 255, 255, 0.5))
├── Background/
│   ├── Light/Main (#ffffff)
│   ├── Light/Card (rgba(255, 255, 255, 0.88))
│   ├── Dark/Main (oklch(0.145 0 0) → #252525)
│   └── Dark/Card (rgba(20, 20, 20, 0.95))
├── Surface/
│   ├── Input/Light (#f3f3f5)
│   └── Input/Dark (#1a1a1a)
└── Semantic/
    ├── Destructive (#d4183d)
    ├── Success (#0b6e4f)
    └── Warning (#f59e0b)
```

### 2. Цветовые таблицы для копирования

#### Основные цвета бренда
| Название | HEX | RGB | Применение |
|----------|-----|-----|------------|
| Primary Green | `#0b6e4f` | `11, 110, 79` | Кнопки, ссылки, акценты |
| Secondary Green | `#2c5a07` | `44, 90, 7` | Градиенты, hover состояния |
| Green Light | `rgba(11, 110, 79, 0.2)` | `11, 110, 79, 20%` | Фоны, подсветка |
| Green Accent | `rgba(177, 211, 196, 0.3)` | `177, 211, 196, 30%` | Акценты, тени |

#### Light Mode
| Название | Значение | Применение |
|----------|----------|------------|
| Background | `#ffffff` | Основной фон |
| Text Primary | `#070309` | Заголовки, основной текст |
| Text Secondary | `rgba(18, 21, 14, 0.71)` | Описания, labels |
| Text Muted | `rgba(18, 21, 14, 0.5)` | Подсказки, плейсхолдеры |
| Card BG | `rgba(255, 255, 255, 0.88)` | Карточки с blur |
| Input BG | `#f3f3f5` | Поля ввода |
| Border | `rgba(0, 0, 0, 0.1)` | Границы элементов |

#### Dark Mode
| Название | Значение | Применение |
|----------|----------|------------|
| Background | `#252525` | Основной фон |
| Text Primary | `#ffffff` | Заголовки, основной текст |
| Text Secondary | `rgba(255, 255, 255, 0.7)` | Описания, labels |
| Text Muted | `rgba(255, 255, 255, 0.5)` | Подсказки, плейсхолдеры |
| Card BG | `rgba(20, 20, 20, 0.95)` | Карточки с blur |
| Border | `rgba(255, 255, 255, 0.15)` | Границы элементов |

### 3. Создание Variables (Figma Variables)

Если используете Figma Variables (рекомендуется для темной/светлой темы):

1. Откройте **Variables** панель
2. Создайте **Collection**: "Design System"
3. Добавьте **Modes**: "Light" и "Dark"
4. Создайте переменные:

```
Colors/Primary/Green = #0b6e4f (в обоих режимах)
Colors/Text/Primary:
  - Light: #070309
  - Dark: #ffffff
Colors/Background/Main:
  - Light: #ffffff
  - Dark: #252525
```

---

## Настройка типографики

### 1. Импорт шрифтов

#### Основные шрифты проекта:
- **Poppins** (Google Fonts)
  - Medium (500) - для заголовков
  - Regular (400) - для текста
- **Inter** (Google Fonts)
  - Medium (500) - для кнопок, акцентов
  - Regular (400) - для основного текста

#### Как установить:
1. Скачайте с Google Fonts:
   - https://fonts.google.com/specimen/Poppins
   - https://fonts.google.com/specimen/Inter
2. Установите на компьютер
3. Перезапустите Figma

### 2. Создайте Text Styles

`Right click > Styles > + Create new Text Style`

#### Структура стилей:

```
Typography/
├── Headings/
│   ├── H1/Desktop (Poppins Medium, 52px, -0.52px, 1.2)
│   ├── H1/Tablet (Poppins Medium, 42px, -0.42px, 1.2)
│   ├── H1/Mobile (Poppins Medium, 32px, -0.32px, 1.2)
│   ├── H2/Desktop (Poppins Medium, 42px, -0.42px, 1.2)
│   ├── H2/Tablet (Poppins Medium, 36px, -0.36px, 1.2)
│   ├── H2/Mobile (Poppins Medium, 28px, -0.28px, 1.2)
│   ├── H3 (Poppins Medium, 30px, -0.36px, 1.3)
│   └── H4 (Poppins Medium, 22px, -0.22px, 1.4)
├── Body/
│   ├── Large (Inter Regular, 18px, 1.5)
│   ├── Medium (Inter Regular, 16px, 1.5)
│   └── Small (Inter Regular, 14px, 1.5)
├── UI/
│   ├── Button/Large (Inter Medium, 18px, 1.5)
│   ├── Button/Medium (Inter Medium, 16px, 1.5)
│   └── Button/Small (Inter Medium, 14px, 1.5)
└── Special/
    ├── Price (Poppins Medium, 48px, -0.72px, 1.2)
    └── Caption (Inter Regular, 12px, 1.4)
```

### 3. Таблица типографики для копирования

| Стиль | Шрифт | Размер | Letter Spacing | Line Height | Применение |
|-------|-------|--------|----------------|-------------|------------|
| **H1/Desktop** | Poppins Medium | 52px | -0.52px | 1.2 | Главные заголовки |
| **H1/Tablet** | Poppins Medium | 42px | -0.42px | 1.2 | Главные заголовки (планшеты) |
| **H1/Mobile** | Poppins Medium | 32px | -0.32px | 1.2 | Главные заголовки (мобайл) |
| **H2** | Poppins Medium | 42px | -0.42px | 1.2 | Вторичные заголовки |
| **H3** | Poppins Medium | 30px | -0.36px | 1.3 | Подзаголовки |
| **H4** | Poppins Medium | 22px | -0.22px | 1.4 | Мелкие заголовки |
| **Body Large** | Inter Regular | 18px | 0 | 1.5 | Крупный текст |
| **Body** | Inter Regular | 16px | 0 | 1.5 | Основной текст |
| **Body Small** | Inter Regular | 14px | 0 | 1.5 | Мелкий текст |
| **Button Large** | Inter Medium | 18px | 0 | 1.5 | Крупные кнопки |
| **Button** | Inter Medium | 16px | 0 | 1.5 | Кнопки |
| **Price** | Poppins Medium | 48px | -0.72px | 1.2 | Цены, числа |
| **Caption** | Inter Regular | 12px | 0 | 1.4 | Подписи, метки |

---

## Компоненты и стили

### 1. Border Radius (Corner Radius)

Создайте в Figma переменные или запомните значения:

| Элемент | Значение | Применение |
|---------|----------|------------|
| **Cards** | `24px` | Все карточки |
| **Buttons** | `48px` | Кнопки (полное скругление) |
| **Inputs** | `48px` | Поля ввода (полное скругление) |
| **Modals** | `24px` | Модальные окна |
| **Badges** | `12px` | Небольшие метки |
| **Images** | `16px` | Изображения в карточках |

### 2. Spacing System (Auto Layout)

Используйте кратные значения **4px** или **8px**:

#### Основные значения:
```
4px   - Минимальный отступ (между иконкой и текстом)
8px   - Мелкие отступы (внутри badge)
12px  - Средние отступы (между элементами в card)
16px  - Стандартные отступы (padding кнопок по вертикали)
20px  - Увеличенные отступы
24px  - Крупные отступы (между секциями в card)
32px  - Очень крупные отступы (padding кнопок/inputs по горизонтали)
48px  - Мега отступы (padding модальных окон)
64px  - Отступы между секциями
80px  - Крупные секции
112px - Отступы для hero секций
```

#### Быстрая шпаргалка для Auto Layout:

**Кнопки:**
- Horizontal padding: `32px`
- Vertical padding: `16px`
- Gap (между иконкой и текстом): `8px`

**Карточки:**
- Padding: `24px` - `32px`
- Gap между элементами: `12px` - `16px`

**Input поля:**
- Horizontal padding: `32px`
- Vertical padding: `16px`

**Модальные окна:**
- Padding: `48px` (desktop), `24px` (mobile)
- Gap между секциями: `24px` - `32px`

### 3. Shadows (Effect Styles)

Создайте Effect Styles в Figma:

#### Light Mode Shadows

**Cards (Default):**
```
Drop Shadow #1:
  X: 4, Y: 4, Blur: 2, Spread: 0
  Color: rgba(0, 0, 0, 0.05)

Drop Shadow #2:
  X: 16, Y: 9, Blur: 12, Spread: -1
  Color: rgba(242, 242, 242, 0.86)

Drop Shadow #3:
  X: 10, Y: 10, Blur: 8, Spread: -2
  Color: rgba(177, 211, 196, 0.3)
```

**Cards (Hover):**
```
Drop Shadow #1:
  X: 6, Y: 6, Blur: 3, Spread: 0
  Color: rgba(0, 0, 0, 0.08)

Drop Shadow #2:
  X: 20, Y: 12, Blur: 16, Spread: -1
  Color: rgba(242, 242, 242, 0.9)

Drop Shadow #3:
  X: 12, Y: 12, Blur: 10, Spread: -2
  Color: rgba(177, 211, 196, 0.4)
```

**Buttons (Default):**
```
Drop Shadow:
  X: 2, Y: 2, Blur: 4, Spread: 0
  Color: rgba(0, 0, 0, 0.1)
```

**Buttons (Hover):**
```
Drop Shadow:
  X: 4, Y: 4, Blur: 12, Spread: 0
  Color: rgba(11, 110, 79, 0.2)
```

#### Dark Mode Shadows

**Cards:**
```
Drop Shadow #1:
  X: 0, Y: 20, Blur: 40, Spread: 0
  Color: rgba(0, 0, 0, 0.4)

Drop Shadow #2:
  X: 0, Y: 10, Blur: 20, Spread: 0
  Color: rgba(0, 0, 0, 0.3)
```

**Cards (Hover):**
```
Drop Shadow #1:
  X: 0, Y: 30, Blur: 60, Spread: 0
  Color: rgba(0, 0, 0, 0.5)

Drop Shadow #2:
  X: 0, Y: 15, Blur: 30, Spread: 0
  Color: rgba(0, 0, 0, 0.4)
```

### 4. Создание компонентов

#### Button Component

**Структура:**
```
Button (Component)
├── Properties:
│   ├── Variant: Primary, Secondary, Ghost
│   ├── Size: Large, Medium, Small
│   ├── State: Default, Hover, Active, Disabled
│   └── Has Icon: Boolean
└── Auto Layout:
    ├── Horizontal padding: 32px (Large), 24px (Medium), 16px (Small)
    ├── Vertical padding: 16px (Large), 12px (Medium), 8px (Small)
    ├── Gap: 8px
    └── Corner radius: 48px
```

**Стили:**
- **Primary**: Градиент `#0b6e4f → #2c5a07`
- **Secondary**: Белый фон, зелёная граница
- **Ghost**: Прозрачный фон, зелёный текст

#### Card Component

**Структура:**
```
Card (Component)
├── Properties:
│   ├── Theme: Light, Dark
│   └── Has Image: Boolean
└── Auto Layout:
    ├── Padding: 24px
    ├── Gap: 16px
    ├── Corner radius: 24px
    └── Fill: White (Light) / rgba(30,30,30,0.9) (Dark)
```

**Эффекты:**
- Shadow: Card/Light или Card/Dark
- Background Blur: 40px (если полупрозрачный)

#### Input Component

**Структура:**
```
Input (Component)
├── Properties:
│   ├── State: Default, Focus, Error, Disabled
│   └── Has Icon: Boolean
└── Auto Layout:
    ├── Horizontal padding: 32px
    ├── Vertical padding: 16px
    ├── Gap: 12px
    ├── Corner radius: 48px
    └── Fill: #f3f3f5 (Light) / #1a1a1a (Dark)
```

#### Badge Component

**Структура:**
```
Badge (Component)
├── Properties:
│   ├── Variant: Success, Error, Warning, Info
│   └── Size: Small, Medium
└── Auto Layout:
    ├── Horizontal padding: 12px (Medium), 8px (Small)
    ├── Vertical padding: 6px (Medium), 4px (Small)
    ├── Gap: 4px
    └── Corner radius: 12px
```

---

## Auto Layout параметры

### Базовая структура страницы

```
Page Frame (Desktop: 1440px)
└── Container (Max-width: 1280px, Center)
    └── Auto Layout Vertical
        ├── Gap: 64px - 112px (между секциями)
        └── Padding: 80px (Top/Bottom), 48px (Left/Right)
```

### Responsive Breakpoints

Создайте Frame Presets:

| Название | Ширина | Padding (L/R) |
|----------|--------|---------------|
| **Desktop** | 1440px | 48px |
| **Laptop** | 1024px | 32px |
| **Tablet** | 768px | 24px |
| **Mobile** | 375px | 16px |

### Grid системы

#### Desktop (1440px):
- Columns: 12
- Margin: 48px
- Gutter: 24px

#### Tablet (768px):
- Columns: 8
- Margin: 24px
- Gutter: 16px

#### Mobile (375px):
- Columns: 4
- Margin: 16px
- Gutter: 12px

---

## Экспорт и синхронизация

### 1. Экспорт в код (Figma Dev Mode)

1. Включите **Dev Mode** (правый верхний угол)
2. Выберите элемент → **Inspect**
3. Справа выберите **CSS** или **Tailwind**
4. Скопируйте код

### 2. Плагины для экспорта

Рекомендуемые плагины:
- **Figma to Code (HTML, Tailwind, React)** - экспорт в Tailwind CSS
- **Anima** - экспорт в React компоненты
- **Style Dictionary** - экспорт Design Tokens

### 3. Синхронизация с кодом

#### Метод 1: JSON Design Tokens

Создайте файл `design-tokens.json`:

```json
{
  "color": {
    "primary": {
      "green": {
        "value": "#0b6e4f"
      },
      "secondary": {
        "value": "#2c5a07"
      }
    },
    "text": {
      "light": {
        "primary": {
          "value": "#070309"
        }
      }
    }
  },
  "borderRadius": {
    "card": {
      "value": "24px"
    },
    "button": {
      "value": "48px"
    }
  }
}
```

#### Метод 2: CSS Variables

Экспортируйте как CSS переменные и сравните с `/src/styles/theme.css`

---

## Чек-лист создания дизайн-системы в Figma

### 🎨 Цвета
- [ ] Создана структура Color Styles
- [ ] Добавлены основные цвета бренда (#0b6e4f, #2c5a07)
- [ ] Настроены цвета Light Mode (8+ стилей)
- [ ] Настроены цвета Dark Mode (8+ стилей)
- [ ] Созданы Figma Variables с режимами Light/Dark
- [ ] Добавлены семантические цвета (destructive, success, warning)

### 📝 Типографика
- [ ] Установлены шрифты Poppins и Inter
- [ ] Создана структура Text Styles
- [ ] Настроены заголовки H1-H4 (Desktop/Tablet/Mobile)
- [ ] Настроены Body текста (Large, Medium, Small)
- [ ] Настроены UI стили (Button, Caption)
- [ ] Добавлены специальные стили (Price)

### 📐 Layout и Spacing
- [ ] Определены breakpoints (Desktop, Tablet, Mobile)
- [ ] Настроены Grid системы (12/8/4 колонки)
- [ ] Созданы spacing переменные (4px, 8px, 12px... 112px)
- [ ] Настроены Auto Layout параметры для компонентов

### 🔲 Компоненты
- [ ] Button (3 варианта × 3 размера)
- [ ] Card (Light/Dark варианты)
- [ ] Input (4 состояния)
- [ ] Badge (4 варианта × 2 размера)
- [ ] Modal
- [ ] Navigation
- [ ] Footer

### ✨ Эффекты
- [ ] Shadows для Light Mode (Cards, Buttons, Modals)
- [ ] Shadows для Dark Mode
- [ ] Background Blur эффекты (40px)
- [ ] Gradient fills для кнопок

### 🎭 Анимации (опционально)
- [ ] Документированы transition-duration значения
- [ ] Определены hover/focus состояния
- [ ] Созданы прототипы с Smart Animate

### 📦 Организация
- [ ] Структура страниц (Foundation, Components, Screens, Documentation)
- [ ] Cover страница с описанием проекта
- [ ] Примеры использования каждого компонента
- [ ] Аннотации и комментарии

---

## 💡 Полезные советы

### 1. Используйте Component Properties

Вместо создания 10 вариантов одной кнопки, используйте:
- **Variant** (Primary/Secondary/Ghost)
- **Size** (Large/Medium/Small)
- **State** (Default/Hover/Active)
- **Boolean** (Has Icon: Yes/No)

### 2. Создавайте Reusable Styles

Не копируйте значения вручную - используйте:
- Color Styles
- Text Styles
- Effect Styles
- Grid Styles

### 3. Документируйте всё

На странице Documentation создайте:
- Инструкции по использованию
- Do's and Don'ts примеры
- Accessibility guidelines
- Code snippets для разработчиков

### 4. Версионируйте изменения

Используйте Figma Version History:
- Создавайте именованные версии при значительных изменениях
- Описывайте, что изменилось
- Делайте скриншоты до/после

### 5. Тестируйте на реальных данных

- Используйте плагин **Content Reel** для заполнения реальными данными
- Тестируйте длинные/короткие названия
- Проверяйте overflow поведение

---

## 📚 Связанные документы

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Полная дизайн-система
- [DESIGN_CHEATSHEET.md](./DESIGN_CHEATSHEET.md) - Быстрая шпаргалка
- [UI_KIT.md](./UI_KIT.md) - Руководство по UI Kit компонентам
- [UI_KIT_CHEATSHEET.md](./UI_KIT_CHEATSHEET.md) - Шпаргалка UI Kit
- [FIGMA_CHEATSHEET.md](./FIGMA_CHEATSHEET.md) - ⚡ Быстрая шпаргалка для Figma

---

## ❓ Частые вопросы

### Как конвертировать oklch() цвета в HEX?

Используйте онлайн конвертер:
- https://oklch.com/
- https://colorjs.io/apps/convert/

Примеры:
- `oklch(0.145 0 0)` → `#252525` (очень тёмный серый)
- `oklch(0.985 0 0)` → `#fbfbfb` (почти белый)
- `oklch(0.269 0 0)` → `#444444` (тёмно-серый)

### Как применить градиент к кнопке?

1. Выберите объект
2. Fill → Gradient (Linear)
3. Установите угол: **107.88°**
4. Первая точка (0%): `#0b6e4f`
5. Вторая точка (100%): `#2c5a07`

### Как сделать Background Blur в Figma?

1. Выберите объект
2. Fill → установите прозрачность (например, 88%)
3. Effects → Background Blur → 40px

### Как экспортировать в Tailwind CSS?

1. Установите плагин **Figma to Tailwind**
2. Выберите элемент
3. Plugins → Figma to Tailwind → Copy
4. Вставьте в код

---

**Дата создания**: 01.03.2026  
**Версия**: 1.0  
**Автор**: AI Assistant  

✅ Готово к использованию! Успехов в создании дизайнов! 🚀