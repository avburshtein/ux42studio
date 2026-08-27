# 📂 Структура проекта

```
design-studio-website/
│
├── 📄 Точки входа
│   ├── index.html                    # HTML template с SEO
│   ├── src/main.tsx                  # React entry point
│   └── src/app/App.tsx               # Главный компонент
│
├── 🎨 Исходный код приложения
│   └── src/
│       ├── app/
│       │   ├── App.tsx               # Роутинг и структура
│       │   │
│       │   ├── components/           # Компоненты
│       │   │   ├── AuthModal.tsx
│       │   │   ├── ContactModal.tsx
│       │   │   ├── FloatingElements.tsx
│       │   │   ├── FloatingMesh.tsx
│       │   │   ├── MobileMenu.tsx
│       │   │   ├── ModalContainer.tsx
│       │   │   ├── PortfolioGallery.tsx
│       │   │   ├── ProjectDetail.tsx
│       │   │   ├── ServicesModal.tsx
│       │   │   ├── ThemeToggle.tsx
│       │   │   ├── DarkModeStyler.tsx
│       │   │   │
│       │   │   ├── figma/
│       │   │   │   └── ImageWithFallback.tsx
│       │   │   │
│       │   │   └── ui/               # UI библиотека (Radix)
│       │   │       ├── button.tsx
│       │   │       ├── dialog.tsx
│       │   │       ├── input.tsx
│       │   │       └── ... (40+ компонентов)
│       │   │
│       │   ├── contexts/             # React контексты
│       │   │   ├── ThemeContext.tsx  # Темная/светлая тема
│       │   │   └── ModalContext.tsx  # Управление модалками
│       │   │
│       │   ├── pages/                # Страницы
│       │   │   ├── Portfolio.tsx
│       │   │   ├── PrivacyPolicy.tsx
│       │   │   ├── TermsOfService.tsx
│       │   │   └── CookiesSettings.tsx
│       │   │
│       │   └── utils/                # Утилиты
│       │       └── darkModeStyles.ts
│       │
│       ├── imports/                  # Из Figma
│       │   ├── HomeDesktop.tsx       # Главная страница
│       │   ├── Frame4.tsx
│       │   └── svg-*.ts              # SVG файлы
│       │
│       └── styles/                   # Стили
│           ├── index.css             # Главный CSS
│           ├── theme.css             # CSS переменные
│           ├── tailwind.css          # Tailwind base
│           ├── fonts.css             # Шрифты
│           └── dark-text-override.css
│
├── 🌐 Публичные файлы
│   └── public/
│       ├── robots.txt                # Для поисковиков
│       ├── sitemap.xml               # Карта сайта
│       └── _redirects                # Netlify redirects
│
├── ⚙️ Конфигурация
│   ├── package.json                  # Зависимости и скрипты
│   ├── vite.config.ts                # Vite конфигурация
│   ├── postcss.config.mjs            # PostCSS
│   ├── .gitignore                    # Git исключения
│   └── .env.example                  # Пример переменных окружения
│
├── 🚀 Деплой конфигурации
│   ├── vercel.json                   # Vercel
│   ├── netlify.toml                  # Netlify
│   └── .github/
│       └── workflows/
│           └── deploy.yml            # GitHub Pages
│
└── 📚 Документация
    ├── START_HERE.md                 ⭐ НАЧНИТЕ ЗДЕСЬ
    ├── QUICKSTART.md                 🚀 Быстрый старт
    ├── CHEATSHEET.md                 ⚡ Шпаргалка
    ├── DEPLOY.md                     📖 Полная инструкция
    ├── CHECKLIST.md                  ✅ Чеклист
    ├── README.md                     📘 О проекте
    ├── DOCUMENTATION_INDEX.md        🗺️ Навигация
    ├── DEPLOYMENT_CHANGES.md         📦 Что добавлено
    ├── READY_TO_DEPLOY.md            🎯 Готовность
    ├── PROJECT_STRUCTURE.md          📂 Этот файл
    ├── deploy-commands.sh            🔧 Bash команды
    └── ATTRIBUTIONS.md               📜 Лицензии
```

---

## 📊 Статистика проекта

### Основные файлы:
- **React компоненты:** ~60 файлов
- **Страницы:** 4 основные (Home, Portfolio, Privacy, Terms)
- **Контексты:** 2 (Theme, Modal)
- **UI компоненты:** 40+ (Radix UI)

### Функциональность:
- ✅ Роутинг (React Router)
- ✅ Темная/светлая тема
- ✅ Модальные окна
- ✅ Адаптивный дизайн
- ✅ Анимации (Motion)
- ✅ Формы (React Hook Form)
- ✅ SEO оптимизация

### Технологии:
- React 18
- TypeScript (частично)
- Vite 6
- Tailwind CSS v4
- Motion (Framer Motion)
- Radix UI
- Material UI
- React Router 7

---

## 🎯 Ключевые файлы для изменения

### Контент:
- `src/imports/HomeDesktop.tsx` - главная страница
- `src/app/pages/Portfolio.tsx` - портфолио
- `src/app/pages/*.tsx` - другие страницы

### Стили и тема:
- `src/styles/theme.css` - CSS переменные
- `src/styles/index.css` - глобальные стили
- `src/app/contexts/ThemeContext.tsx` - логика темной темы

### Навигация:
- `src/app/App.tsx` - роуты и структура
- `src/imports/HomeDesktop.tsx` - навигационное меню

### SEO:
- `index.html` - мета-теги
- `public/sitemap.xml` - карта сайта
- `public/robots.txt` - для ботов

---

## 📦 Сборка и вывод

После `npm run build` создается папка `dist/`:

```
dist/
├── index.html              # Минифицированный HTML
├── assets/
│   ├── index-[hash].js     # Главный JS bundle
│   ├── vendor-[hash].js    # Vendor библиотеки
│   ├── index-[hash].css    # Стили
│   └── [images/fonts]      # Ассеты
└── ...
```

Эту папку можно задеплоить на любой статический хостинг.

---

## 🔍 Поиск файлов

### Где находится навигация?
- Десктоп: `src/imports/HomeDesktop.tsx`
- Мобильное: `src/app/components/MobileMenu.tsx`

### Где находится переключатель темы?
- `src/app/components/ThemeToggle.tsx`

### Где находятся формы?
- Регистрация: `src/app/components/AuthModal.tsx`
- Контакты: `src/app/components/ContactModal.tsx`

### Где находится анимация точек?
- `src/app/components/FloatingElements.tsx`
- `src/app/components/FloatingMesh.tsx`

---

## 💡 Советы по навигации

### Для редактирования контента:
1. Главная страница → `src/imports/HomeDesktop.tsx`
2. Другие страницы → `src/app/pages/`

### Для изменения стилей:
1. Цвета и темы → `src/styles/theme.css`
2. Глобальные стили → `src/styles/index.css`

### Для добавления страниц:
1. Создайте файл в `src/app/pages/`
2. Добавьте роут в `src/app/App.tsx`
3. Добавьте в навигацию `src/imports/HomeDesktop.tsx`
4. Обновите `public/sitemap.xml`

---

## 🎨 Кастомизация

### Изменить основной цвет:
Отредактируйте `src/styles/theme.css`:
```css
--color-primary: #0b6e4f; /* Ваш цвет */
```

### Изменить шрифт:
1. Добавьте импорт в `src/styles/fonts.css`
2. Обновите font-family в `src/styles/theme.css`

### Добавить анимацию:
Используйте Motion:
```tsx
import { motion } from 'motion/react'
```

---

## 📈 Следующие шаги

1. ✅ Изучите структуру проекта
2. 🎨 Кастомизируйте под свои нужды
3. 🚀 Задеплойте (см. [QUICKSTART.md](./QUICKSTART.md))
4. 🔗 Настройте домен
5. 📊 Добавьте аналитику

---

**Вернуться к началу:** [START_HERE.md](./START_HERE.md)
