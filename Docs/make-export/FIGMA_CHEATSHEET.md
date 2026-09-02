# 🎨 Figma → Код: Быстрая памятка

Краткое руководство по переносу дизайн-системы из документации в Figma.

---

## 📋 Чек-лист для Figma

### 1. Цвета (Color Styles)

**Основные:**
```
Primary Green:    #0b6e4f
Secondary Green:  #2c5a07
Green Light:      rgba(11, 110, 79, 0.2)
Green Accent:     rgba(177, 211, 196, 0.3)
```

**Light Mode:**
```
Background:    #ffffff
Text Primary:  #070309
Text Secondary: rgba(18, 21, 14, 0.71)
Card BG:       rgba(255, 255, 255, 0.88)
Input BG:      #f3f3f5
```

**Dark Mode:**
```
Background:    #252525
Text Primary:  #ffffff
Text Secondary: rgba(255, 255, 255, 0.7)
Card BG:       rgba(20, 20, 20, 0.95)
```

### 2. Типографика (Text Styles)

| Название | Шрифт | Размер | Spacing | Line Height |
|----------|-------|--------|---------|-------------|
| H1/Desktop | Poppins Medium | 52px | -0.52px | 1.2 |
| H1/Mobile | Poppins Medium | 32px | -0.32px | 1.2 |
| H2 | Poppins Medium | 42px | -0.42px | 1.2 |
| H3 | Poppins Medium | 30px | -0.36px | 1.3 |
| Body | Inter Regular | 16px | 0 | 1.5 |
| Button | Inter Medium | 16px | 0 | 1.5 |
| Price | Poppins Medium | 48px | -0.72px | 1.2 |

### 3. Border Radius

```
Cards:     24px
Buttons:   48px (full rounded)
Inputs:    48px (full rounded)
Modals:    24px
Badges:    12px
Images:    16px
```

### 4. Spacing (Auto Layout)

```
4px   - Icon ↔ Text
8px   - Badge padding
12px  - Card elements gap
16px  - Button vertical padding
24px  - Card sections gap
32px  - Button/Input horizontal padding
48px  - Modal padding (desktop)
64px  - Between sections
112px - Hero sections
```

### 5. Shadows (Effects)

**Light Mode Cards:**
```
Shadow 1: X:4 Y:4 Blur:2 rgba(0,0,0,0.05)
Shadow 2: X:16 Y:9 Blur:12 rgba(242,242,242,0.86)
Shadow 3: X:10 Y:10 Blur:8 rgba(177,211,196,0.3)
```

**Dark Mode Cards:**
```
Shadow 1: X:0 Y:20 Blur:40 rgba(0,0,0,0.4)
Shadow 2: X:0 Y:10 Blur:20 rgba(0,0,0,0.3)
```

**Buttons:**
```
Default: X:2 Y:2 Blur:4 rgba(0,0,0,0.1)
Hover: X:4 Y:4 Blur:12 rgba(11,110,79,0.2)
```

### 6. Градиент для кнопок

```
Type: Linear
Angle: 107.88°
Stop 1 (0%): #0b6e4f
Stop 2 (100%): #2c5a07
```

### 7. Breakpoints

```
Desktop: 1440px (48px margins, 12 columns)
Laptop:  1024px (32px margins)
Tablet:  768px  (24px margins, 8 columns)
Mobile:  375px  (16px margins, 4 columns)
```

---

## 🚀 Быстрый старт в Figma

**⚡ Автоматический импорт (РЕКОМЕНДУЕТСЯ):**

Откройте → **[FIGMA_AUTOMATION.md](./FIGMA_AUTOMATION.md)** для автоматизации!

**Или вручную:**

1. **Создайте файл** "Design System - [Project]"
2. **Добавьте страницы**: Foundation, Components, Screens
3. **Установите шрифты**: Poppins, Inter (Google Fonts)
4. **Создайте Color Styles** из таблицы выше
5. **Создайте Text Styles** из таблицы выше
6. **Настройте Components**: Button, Card, Input, Badge
7. **Создайте Effect Styles** для теней
8. **Настройте Grid** по breakpoints

---

## 📦 Экспорт в код

**Плагины:**
- Figma to Code (HTML, Tailwind, React)
- Anima
- Style Dictionary

**Dev Mode:**
1. Включите Dev Mode
2. Выберите элемент → Inspect
3. Выберите CSS/Tailwind
4. Скопируйте код

---

## 📚 Полная документация

Откройте **[FIGMA_GUIDE.md](./FIGMA_GUIDE.md)** для:
- Детальных инструкций
- Структуры компонентов
- Design Tokens
- Синхронизации с кодом

---

**✅ Готово! Теперь можно создавать дизайны в Figma!**