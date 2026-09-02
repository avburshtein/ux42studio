# 🖼️ Миграция изображений с figma:asset на локальные файлы

## Что изменилось

### До миграции
```typescript
import image from 'figma:asset/hash.png'
```

### После миграции
```typescript
const image = '/images/placeholder.svg'
```

---

## Выполненные изменения

### 1. Созданы локальные SVG файлы
Создана папка `/public/images/` с следующими файлами:

- ✅ `avatar.svg` - Аватары пользователей (80×80px)
- ✅ `placeholder.svg` - Универсальный placeholder (400×400px)
- ✅ `design-work.svg` - Дизайн-работы с градиентом (600×400px)
- ✅ `team-member.svg` - Карточка члена команды (80×80px)
- ✅ `collaboration.svg` - Концепция сотрудничества (600×400px)
- ✅ `digital-interaction.svg` - Цифровое взаимодействие (600×400px)

### 2. Обновлен файл HomeDesktop.tsx
Все 22 импорта `figma:asset` заменены на константы с путями к локальным файлам.

#### Маппинг изображений:
```typescript
// Avatar images (используются 3+ раза)
const imgAvatarImage = '/images/avatar.svg'
const imgPlaceholderImage1 = '/images/avatar.svg'

// Design work images
const image_4c901234375348347e513e77696f77a4b0773522 = '/images/design-work.svg'
const imgCollaborationImage = '/images/design-work.svg'

// Generic placeholders (используются по умолчанию)
const image_fbbdfdfb11b47d37bc18923eeeadba1db42c5cfc = '/images/placeholder.svg'
// ... и остальные
```

---

## Преимущества миграции

### ✅ Независимость от Figma
- Не требуется специальная виртуальная схема импорта
- Работает на любом хостинге без дополнительной настройки
- Совместимость со всеми сборщиками (Vite, Webpack, etc.)

### ✅ Оптимизация
- SVG файлы имеют минимальный размер (1-3 KB)
- Векторная графика масштабируется без потери качества
- Быстрая загрузка страниц

### ✅ Гибкость
- Легко заменить любое изображение
- Поддержка всех форматов: SVG, PNG, JPG, WebP
- Простое добавление новых изображений

### ✅ Деплой
- Работает на Vercel, Netlify, GitHub Pages
- Не требуется специальная конфигурация
- Публичная папка автоматически копируется при сборке

---

## Как заменить placeholder на реальные изображения

### Шаг 1: Добавьте изображения
Поместите ваши изображения в `/public/images/`:
```
/public/images/
  ├── hero-image.jpg
  ├── team-photo-1.jpg
  ├── team-photo-2.jpg
  ├── portfolio-1.jpg
  └── ...
```

### Шаг 2: Обновите константы
Откройте `/src/imports/HomeDesktop.tsx` и замените пути:

```typescript
// Было:
const image_4c901234375348347e513e77696f77a4b0773522 = '/images/design-work.svg'

// Стало:
const image_4c901234375348347e513e77696f77a4b0773522 = '/images/hero-image.jpg'
```

### Шаг 3: Проверьте результат
```bash
npm run dev
```
Откройте браузер и убедитесь, что изображения отображаются корректно.

---

## Рекомендации по изображениям

### Форматы
- **SVG**: для иконок, логотипов, иллюстраций
- **WebP**: для фотографий (лучшее сжатие, поддержка современных браузеров)
- **JPG**: для фотографий (универсальная поддержка)
- **PNG**: когда нужна прозрачность

### Размеры
- **Аватары**: 80×80px или 160×160px (2x для Retina)
- **Hero изображения**: 1200×600px
- **Портфолио**: 800×600px или 1200×900px
- **Thumbnails**: 400×400px

### Оптимизация
Используйте инструменты для сжатия изображений:
- [TinyPNG](https://tinypng.com/) - для PNG/JPG
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - для SVG
- [Squoosh](https://squoosh.app/) - универсальный оптимизатор

---

## Структура проекта

```
project/
├── public/
│   └── images/               # ← Все изображения здесь
│       ├── avatar.svg
│       ├── placeholder.svg
│       ├── design-work.svg
│       ├── team-member.svg
│       ├── collaboration.svg
│       ├── digital-interaction.svg
│       └── README.md         # Документация изображений
│
└── src/
    └── imports/
        └── HomeDesktop.tsx   # ← Используют изображения из /public/images/
```

---

## Проверка после миграции

### ✅ Чек-лист:
- [ ] Все изображения отображаются на локальном сервере
- [ ] Нет ошибок в консоли браузера
- [ ] Изображения загружаются быстро
- [ ] SVG адаптируются к размерам экрана
- [ ] Проверена работа на мобильных устройствах
- [ ] Проверена работа в темной теме

### Тестирование
```bash
# Локальная разработка
npm run dev

# Production сборка
npm run build
npm run preview
```

---

## Rollback (откат)

Если нужно вернуть `figma:asset` импорты:

1. Откройте `/src/imports/HomeDesktop.tsx`
2. Замените константы обратно на импорты:
```typescript
// Вернуть:
import imgAvatarImage from "figma:asset/42c3b8f7d4592fee9476338f0903cfacd86ee529.png";
```

---

## Дополнительная информация

- 📁 **Документация изображений**: `/public/images/README.md`
- 🎨 **Цветовая схема**: `#0b6e4f` (основной), `#2c5a07` (акцент)
- 📐 **Дизайн система**: Все изображения следуют единому стилю

---

**Дата миграции**: 2026-02-28  
**Статус**: ✅ Завершено  
**Затронуто файлов**: 1 (`HomeDesktop.tsx`)  
**Создано изображений**: 6 SVG файлов  
**Заменено импортов**: 22 figma:asset → локальные пути
