# 🎨 Дизайн-система проекта

## 📋 Содержание

1. [Обзор](#обзор)
2. [Цветовая палитра](#цветовая-палитра)
3. [Типографика](#типографика)
4. [Spacing & Layout](#spacing--layout)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Анимации и переходы](#анимации-и-переходы)
8. [Компоненты](#компоненты)
9. [Темная тема](#темная-тема)
10. [Адаптивность](#адаптивность)

---

## Обзор

Дизайн-система построена на базе **Tailwind CSS v4** с кастомными токенами дизайна, обеспечивающими единообразный и современный интерфейс. Система поддерживает светлую и темную темы с плавными переходами.

### Ключевые принципы:
- ✨ **Минимализм** - чистый и современный дизайн
- 🎯 **Согласованность** - единые паттерны во всех компонентах
- 🌓 **Dual-mode** - полноценная поддержка светлой и темной тем
- 📱 **Responsive** - адаптивность под все устройства
- ♿ **Accessibility** - доступность для всех пользователей

---

## Цветовая палитра

### Основные цвета бренда

#### Зелёные оттенки (Primary)
```css
--primary-green: #0b6e4f       /* Основной зелёный */
--secondary-green: #2c5a07     /* Тёмно-зелёный */
--green-light: rgba(11, 110, 79, 0.2)   /* Светлый оттенок */
--green-accent: rgba(177, 211, 196, 0.3) /* Акцент */
```

#### Применение:
- Кнопки с градиентом: `linear-gradient(107.879deg, #0b6e4f 3.76%, #2c5a07 98.53%)`
- Hover эффекты
- Акценты и активные состояния
- Индикаторы прогресса

### Системные цвета

#### Light Mode
```css
--background: #ffffff
--foreground: oklch(0.145 0 0)          /* Почти чёрный */
--card: #ffffff
--card-bg: rgba(255, 255, 255, 0.88)   /* Полупрозрачные карточки */

--text-primary: #070309                 /* Основной текст */
--text-secondary: rgba(18, 21, 14, 0.71) /* Вторичный текст */
--text-muted: rgba(18, 21, 14, 0.5)     /* Приглушённый текст */

--border: rgba(0, 0, 0, 0.1)           /* Границы */
--input-background: #f3f3f5             /* Фон инпутов */
```

#### Dark Mode
```css
--background: oklch(0.145 0 0)          /* Очень тёмный */
--foreground: oklch(0.985 0 0)          /* Почти белый */
--card: oklch(0.145 0 0)
--card-bg: rgba(20, 20, 20, 0.95)      /* Полупрозрачные карточки */

--text-primary: #ffffff                 /* Основной текст */
--text-secondary: rgba(255, 255, 255, 0.7) /* Вторичный текст */
--text-muted: rgba(255, 255, 255, 0.5)  /* Приглушённый текст */

--border: oklch(0.269 0 0)             /* Границы */
```

### Вспомогательные цвета

#### Семантические
```css
--destructive: #d4183d                  /* Ошибки, удаление */
--accent: #e9ebef (light) / oklch(0.269 0 0) (dark)
--muted: #ececf0 (light) / oklch(0.269 0 0) (dark)
```

#### Графики и визуализация
```css
--chart-1: oklch(0.646 0.222 41.116)
--chart-2: oklch(0.6 0.118 184.704)
--chart-3: oklch(0.398 0.07 227.392)
--chart-4: oklch(0.828 0.189 84.429)
--chart-5: oklch(0.769 0.188 70.08)
```

---

## Типографика

### Шрифтовая система

#### Основной шрифт
```css
font-family: 'Inter', sans-serif
```
- **Regular (400)** - для основного текста
- **Medium (500)** - для заголовков, кнопок, лейблов

#### Декоративный шрифт
```css
font-family: 'Poppins', sans-serif
```
- Используется для крупных заголовков
- Добавляет визуальную иерархию

### Размеры текста

#### Заголовки
```css
h1: 2xl (var(--text-2xl))    /* ~32px-40px */
h2: xl (var(--text-xl))       /* ~24px-32px */
h3: lg (var(--text-lg))       /* ~20px-24px */
h4: base (var(--text-base))   /* 16px */
```

#### Основной текст
```css
base: 16px                     /* Основной размер */
sm: 14px                       /* Мелкий текст */
xs: 12px                       /* Метаданные */
```

#### Крупные размеры
```css
3xl: 48px-56px                /* Hero заголовки */
4xl: 56px-64px                /* Крупнейшие заголовки */
```

### Межстрочный интервал (Line Height)
```css
line-height: 1.5              /* Стандарт для всех элементов */
```

### Примеры использования

#### Hero заголовок
```tsx
<h1 className="font-['Poppins:Medium',sans-serif] text-[48px] md:text-[56px] lg:text-[64px]">
  Create Amazing Digital Experiences
</h1>
```

#### Подзаголовок
```tsx
<p className="font-['Inter:Regular',sans-serif] text-[18px] md:text-[20px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
  Modern design solutions for your business
</p>
```

#### Мелкий текст
```tsx
<p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.5)]">
  © 2026 All rights reserved
</p>
```

---

## Spacing & Layout

### Система отступов

#### Стандартные значения
```css
/* Минимальные */
gap-[8px]         /* Между близкими элементами */
gap-[12px]        /* Небольшие группы */
gap-[16px]        /* Стандартный gap */

/* Средние */
gap-[24px]        /* Между секциями компонента */
gap-[32px]        /* Между группами элементов */
gap-[48px]        /* Большие блоки */

/* Крупные */
gap-[64px]        /* Между секциями страницы */
gap-[96px]        /* Между крупными разделами */
gap-[120px]       /* Hero и основной контент */
```

### Padding

#### Input поля
```css
px-[32px] py-[16px]    /* Стандартные инпуты */
```

#### Кнопки
```css
/* Основные */
px-[32px] py-[16px]    /* Крупные CTA кнопки */
px-[24px] py-[12px]    /* Средние кнопки */
px-[20px] py-[10px]    /* Маленькие кнопки */

/* Иконки */
px-[16px] py-[8px]     /* Кнопки с иконками */
```

#### Карточки
```css
p-[24px]               /* Компактные карточки */
p-[32px]               /* Стандартные карточки */
p-[48px]               /* Крупные карточки на десктопе */
```

### Container & Max-width

```css
max-w-[1400px]         /* Основной контейнер */
max-w-[900px]          /* Модальные окна */
max-w-[600px]          /* Узкие модалки (контакты) */
max-w-[480px]          /* Формы регистрации */
```

---

## Border Radius

### Система скругления

#### Основные значения
```css
rounded-[6px]          /* Минимальное (изображения в модалках) */
rounded-[8px]          /* Маленькие элементы */
rounded-[24px]         /* Карточки, модальные окна */
rounded-[48px]         /* Кнопки, инпуты, теги */
rounded-full           /* Круглые элементы (аватары, dots) */
```

#### Применение

**Карточки**: `rounded-[24px]`
```tsx
<div className="bg-white dark:bg-gray-900 rounded-[24px] p-[32px] shadow-lg">
  {/* Content */}
</div>
```

**Кнопки**: `rounded-[48px]`
```tsx
<button className="px-[32px] py-[16px] rounded-[48px] bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07]">
  Click me
</button>
```

**Input поля**: `rounded-[48px]` или `rounded-[24px]`
```tsx
<input className="px-[32px] py-[16px] rounded-[48px] bg-gray-50" />
<textarea className="px-[32px] py-[16px] rounded-[24px] bg-gray-50" />
```

### CSS Variables
```css
--radius: 0.625rem             /* 10px базовый */
--radius-sm: calc(var(--radius) - 4px)    /* 6px */
--radius-md: calc(var(--radius) - 2px)    /* 8px */
--radius-lg: var(--radius)                /* 10px */
--radius-xl: calc(var(--radius) + 4px)    /* 14px */
```

---

## Shadows

### Иерархия теней

#### Минимальные (Subtle)
```css
shadow-[2px_2px_4px_0px_rgba(0,0,0,0.05)]
```
- Кнопки в состоянии покоя
- Легкие акценты

#### Стандартные (Default)
```css
shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
shadow-[4px_4px_2px_0px_rgba(0,0,0,0.05)]
```
- Кнопки
- Небольшие карточки

#### Средние (Medium)
```css
shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)]
```
- Карточки контента
- Модальные окна

#### Крупные (Large) - многослойные
```css
shadow-[
  4px_4px_2px_0px_rgba(0,0,0,0.05),
  16px_9px_12px_-1px_rgba(242,242,242,0.86),
  10px_10px_8px_-2px_rgba(177,211,196,0.3)
]
```
- Галерея портфолио
- Важные интерактивные элементы

#### Hover тени
```css
hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
hover:shadow-[
  6px_6px_3px_0px_rgba(0,0,0,0.08),
  20px_12px_16px_-1px_rgba(242,242,242,0.9),
  12px_12px_10px_-2px_rgba(177,211,196,0.4)
]
```
- Применяется при наведении на карточки
- Усиливает ощущение интерактивности

#### Тёмная тема
```css
dark:shadow-[
  4px_4px_2px_0px_rgba(255,255,255,0.05),
  16px_9px_12px_-1px_rgba(20,20,20,0.86),
  10px_10px_8px_-2px_rgba(11,110,79,0.2)
]
```

---

## Анимации и переходы

### Стандартные переходы

#### Универсальный
```css
transition-all duration-300
```
- Применяется к большинству интерактивных элементов

#### Длительные
```css
transition-all duration-500
```
- Сложные анимации
- Галереи изображений

#### Цвета
```css
transition-colors duration-300
```
- Переключение тем
- Изменение цвета текста/фона

### Transform эффекты

#### Hover Scale
```css
hover:scale-105        /* Лёгкое увеличение */
hover:scale-[1.02]     /* Минимальное увеличение (карточки) */
active:scale-95        /* Нажатие */
```

#### Примеры
```tsx
// Кнопка
<button className="transition-all duration-300 hover:scale-105 active:scale-95">

// Карточка
<div className="transition-all duration-500 hover:scale-[1.02]">
```

### Keyframe анимации

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
```

#### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}
```

#### Применение
```tsx
// Появление модального окна
<div className="animate-scaleIn">

// Fade overlay
<div className="animate-fadeIn">
```

---

## Компоненты

### Кнопки

#### Primary Button (Gradient)
```tsx
<button className="
  relative
  px-[32px] py-[16px]
  rounded-[48px]
  font-['Inter:Medium',sans-serif]
  text-[16px]
  text-white
  shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
  transition-all duration-300
  hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
  hover:scale-105
  active:scale-95
"
style={{
  backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
}}>
  Button Text
</button>
```

#### Secondary Button (Outline)
```tsx
<button className="
  px-[20px] py-[10px]
  rounded-[48px]
  border-2 border-[rgba(11,110,79,0.9)]
  bg-white dark:bg-[rgba(40,40,40,0.95)]
  text-[rgba(11,110,79,0.9)] dark:text-white
  font-['Inter:Medium',sans-serif]
  text-[14px]
  transition-all duration-300
  hover:bg-[rgba(11,110,79,0.05)]
  hover:scale-105
  active:scale-95
">
  Button Text
</button>
```

#### Icon Button
```tsx
<button className="
  px-[16px] py-[8px]
  rounded-[48px]
  border-2 border-gray-300
  transition-all duration-300
  hover:scale-105
  active:scale-95
">
  <Icon />
</button>
```

### Карточки

#### Стандартная карточка
```tsx
<div className="
  bg-white dark:bg-[rgba(30,30,30,0.9)]
  rounded-[24px]
  p-[32px]
  shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)]
  transition-colors duration-300
">
  {/* Content */}
</div>
```

#### Карточка портфолио (с hover)
```tsx
<div className="
  group relative
  bg-white dark:bg-[rgba(30,30,30,0.9)]
  rounded-[24px]
  overflow-hidden
  shadow-[4px_4px_2px_0px_rgba(0,0,0,0.05),16px_9px_12px_-1px_rgba(242,242,242,0.86),10px_10px_8px_-2px_rgba(177,211,196,0.3)]
  cursor-pointer
  transition-all duration-500
  hover:scale-[1.02]
  hover:shadow-[6px_6px_3px_0px_rgba(0,0,0,0.08),20px_12px_16px_-1px_rgba(242,242,242,0.9),12px_12px_10px_-2px_rgba(177,211,196,0.4)]
">
  {/* Content */}
</div>
```

### Input поля

#### Text Input
```tsx
<input
  type="text"
  className="
    w-full
    px-[32px] py-[16px]
    rounded-[48px]
    bg-gray-50 dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-white
    font-['Inter:Regular',sans-serif]
    text-[16px]
    transition-colors duration-300
  "
  placeholder="Enter text..."
/>
```

#### Textarea
```tsx
<textarea
  className="
    w-full
    px-[32px] py-[16px]
    rounded-[24px]
    bg-gray-50 dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-white
    resize-none
  "
  rows={6}
  placeholder="Enter message..."
/>
```

### Модальные окна

#### Базовая структура
```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent className="
    sm:max-w-[900px]
    bg-white dark:bg-gray-900
    border-gray-200 dark:border-gray-800
    rounded-[24px]
    p-0
    overflow-hidden
    max-h-[90vh]
    overflow-y-auto
  ">
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Теги / Chips

```tsx
<div className="
  px-[20px] py-[10px]
  rounded-[24px]
  text-white
  text-[14px] md:text-[16px]
  font-['Inter:Medium',sans-serif]
  shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
"
style={{
  backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
}}>
  Tag Name
</div>
```

### Фильтры / Табы

```tsx
<button className={`
  px-[24px] py-[12px]
  rounded-[48px]
  font-['Inter:Medium',sans-serif]
  text-[14px] md:text-[16px]
  transition-all duration-300
  hover:scale-105
  active:scale-95
  ${isActive
    ? 'text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] [background-image:linear-gradient(107.879deg,rgba(11,110,79,0.9)_3.7608%,rgba(44,90,7,0.9)_98.529%)]'
    : 'bg-white dark:bg-[rgba(40,40,40,0.95)] text-[rgba(18,21,14,0.71)] dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
  }
`}>
  Filter Name
</button>
```

---

## Темная тема

### Активация темной темы

Тема контролируется через ThemeContext:
```tsx
const { theme, toggleTheme } = useTheme();
```

Класс `.dark` добавляется к корневому элементу:
```html
<html class="dark">
```

### Цветовые переходы

```css
transition-colors duration-300
```
Применяется ко всем элементам, поддерживающим темную тему.

### Паттерны использования

#### Фон
```tsx
className="bg-white dark:bg-gray-900"
className="bg-gray-50 dark:bg-gray-800"
className="bg-white dark:bg-[rgba(30,30,30,0.9)]"
```

#### Текст
```tsx
className="text-gray-900 dark:text-white"
className="text-[rgba(18,21,14,0.71)] dark:text-gray-400"
className="text-[rgba(18,21,14,0.5)] dark:text-gray-500"
```

#### Границы
```tsx
className="border-gray-200 dark:border-gray-700"
className="border-gray-300 dark:border-gray-600"
```

#### Тени
```tsx
className="shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_2px_0px_rgba(255,255,255,0.05)]"
```

### CSS Variables (автоматическая смена)

Все переменные из `:root` автоматически переопределяются в `.dark`:
```css
:root {
  --background: #ffffff;
}

.dark {
  --background: oklch(0.145 0 0);
}
```

---

## Адаптивность

### Breakpoints

```css
/* Mobile First */
default         /* 0px - mobile */
sm:             /* 640px */
md:             /* 768px */
lg:             /* 1024px */
xl:             /* 1280px */
2xl:            /* 1536px */
```

### Типографика (responsive)

```tsx
// Hero заголовок
<h1 className="text-[48px] md:text-[56px] lg:text-[64px]">

// Подзаголовок
<p className="text-[18px] md:text-[20px] lg:text-[24px]">

// Основной текст
<p className="text-[14px] md:text-[16px]">
```

### Spacing (responsive)

```tsx
// Gap
<div className="gap-[16px] md:gap-[24px] lg:gap-[32px]">

// Padding
<div className="p-[24px] md:p-[32px] lg:p-[48px]">

// Margin
<div className="mb-[32px] md:mb-[48px] lg:mb-[64px]">
```

### Layout (responsive)

```tsx
// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Flex direction
<div className="flex flex-col lg:flex-row">

// Hidden/Visible
<div className="hidden md:flex">
<div className="flex md:hidden">
```

### Container

```tsx
<div className="w-full max-w-[1400px] mx-auto px-[20px] md:px-[40px] lg:px-[80px]">
```

---

## Практические примеры

### Hero секция
```tsx
<section className="
  min-h-screen
  flex items-center justify-center
  px-[20px] md:px-[40px]
  py-[80px] md:py-[120px]
">
  <div className="max-w-[1400px] mx-auto text-center">
    <h1 className="
      font-['Poppins:Medium',sans-serif]
      text-[48px] md:text-[56px] lg:text-[64px]
      text-[#070309] dark:text-white
      mb-[24px]
    ">
      Hero Title
    </h1>
    <p className="
      font-['Inter:Regular',sans-serif]
      text-[18px] md:text-[20px]
      text-[rgba(18,21,14,0.71)] dark:text-gray-400
      mb-[48px]
      max-w-[800px] mx-auto
    ">
      Subtitle text here
    </p>
    <button className="
      px-[32px] py-[16px]
      rounded-[48px]
      text-white
      font-['Inter:Medium',sans-serif]
      text-[16px] md:text-[18px]
      shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
      transition-all duration-300
      hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
      hover:scale-105
      active:scale-95
    "
    style={{
      backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
    }}>
      Get Started
    </button>
  </div>
</section>
```

### Карточки в сетке
```tsx
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-[24px] md:gap-[32px]
  px-[20px] md:px-[40px]
  py-[64px] md:py-[96px]
">
  {items.map(item => (
    <div key={item.id} className="
      bg-white dark:bg-[rgba(30,30,30,0.9)]
      rounded-[24px]
      p-[24px] md:p-[32px]
      shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)]
      transition-all duration-300
      hover:scale-[1.02]
      hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
    ">
      <h3 className="
        font-['Inter:Medium',sans-serif]
        text-[20px] md:text-[24px]
        text-gray-900 dark:text-white
        mb-[16px]
      ">
        {item.title}
      </h3>
      <p className="
        font-['Inter:Regular',sans-serif]
        text-[14px] md:text-[16px]
        text-[rgba(18,21,14,0.71)] dark:text-gray-400
      ">
        {item.description}
      </p>
    </div>
  ))}
</div>
```

---

## Чек-лист использования дизайн-системы

### При создании нового компонента:

- [ ] Используйте правильные border-radius: `24px` для карточек, `48px` для кнопок
- [ ] Примените `transition-all duration-300` для интерактивных элементов
- [ ] Добавьте hover эффекты: `hover:scale-105` и `hover:shadow-[...]`
- [ ] Обеспечьте поддержку темной темы: `dark:...` классы
- [ ] Проверьте адаптивность: `md:...` и `lg:...` брейкпоинты
- [ ] Используйте правильный spacing: `gap-[16px]`, `gap-[24px]`, `gap-[32px]`
- [ ] Примените правильную типографику: `Inter` для текста, `Poppins` для заголовков
- [ ] Убедитесь в семантических цветах: брендовый градиент для CTA
- [ ] Добавьте правильные тени в соответствии с иерархией
- [ ] Протестируйте на мобильных устройствах

---

## Файлы дизайн-системы

### Основные
- `/src/styles/theme.css` - CSS переменные и базовые стили
- `/src/styles/tailwind.css` - Tailwind конфигурация
- `/src/styles/index.css` - Главный файл стилей
- `/src/styles/dark-text-override.css` - Переопределения для темной темы

### Компоненты
- `/src/app/components/` - Все React компоненты
- `/src/app/contexts/ThemeContext.tsx` - Контекст темной темы

---

## Дополнительные ресурсы

### Инструменты
- [Tailwind CSS v4](https://tailwindcss.com) - CSS фреймворк
- [OKLCH Color Picker](https://oklch.com) - Выбор OKLCH цветов
- [Radix UI](https://www.radix-ui.com) - Примитивы UI

### Документация
- [README.md](../README.md) - Общая информация
- [DEPLOY.md](../DEPLOY.md) - Инструкции по деплою
- [IMAGES_MIGRATION.md](../IMAGES_MIGRATION.md) - Работа с изображениями

---

**Версия**: 1.0  
**Обновлено**: 2026-02-28  
**Статус**: ✅ Production Ready

---

## Лицензия

Эта дизайн-система разработана для внутреннего использования в проекте и может быть адаптирована под ваши нужды.
