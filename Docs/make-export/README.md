# Design Studio Web Application

Современное веб-приложение для дизайн-студии с полной поддержкой темной темы, адаптивным дизайном и интерактивными элементами.

> **🎉 ПРОЕКТ ПОЛНОСТЬЮ ГОТОВ К ДЕПЛОЮ!**
> 
> Все конфигурации настроены, документация подготовлена.  
> Время до вашего сайта онлайн: **1-5 минут**
> 
> ### Быстрый старт:
> 1. **Спешите?** → [30_SECONDS.md](./30_SECONDS.md) ⚡
> 2. **5 минут?** → [QUICKSTART.md](./QUICKSTART.md) 🚀
> 3. **Нужны детали?** → [DEPLOY.md](./DEPLOY.md) 📖
> 4. **Все ресурсы** → [RESOURCES.md](./RESOURCES.md) 📚
>
> **Или начните с** → [START_HERE.md](./START_HERE.md) 🎯

---

## 🚀 Особенности

- ✨ Полная поддержка светлой и темной темы
- 📱 Адаптивный дизайн для всех размеров экранов
- 🎨 Анимированные элементы и плавные переходы
- 🎯 Интерактивная сетка точек с Parallax эффектом
- 🌊 Floating mesh элементы
- 🗺️ Роутинг с React Router
- 🎭 Модальные окна для форм и сервисов
- 📸 Портфолио с галереей проектов
- 🔒 Страницы Privacy Policy, Terms of Service, Cookies Settings

## 🛠️ Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик проекта
- **Tailwind CSS v4** - стилизация
- **React Router** - навигация
- **Motion (Framer Motion)** - анимации
- **Radix UI** - компоненты UI
- **Material UI** - дополнительные компоненты
- **Lucide React** - иконки

## 📦 Установка

```bash
# Клонируйте репозиторий
git clone <your-repo-url>

# Перейдите в директорию
cd <project-name>

# Установите зависимости
npm install
# или
pnpm install
# или
yarn install
```

## 🏃 Запуск локально

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview
```

Приложение будет доступно по адресу: `http://localhost:5173`

## 🚀 Деплой

### Vercel (Рекомендуется)

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Залогиньтесь:
```bash
vercel login
```

3. Задеплойте проект:
```bash
vercel
```

Или используйте веб-интерфейс:
- Зайдите на [vercel.com](https://vercel.com)
- Импортируйте ваш GitHub репозиторий
- Vercel автоматически определит настройки
- Нажмите Deploy

### Netlify

1. Установите Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Залогиньтесь:
```bash
netlify login
```

3. Задеплойте проект:
```bash
netlify deploy --prod
```

Или используйте веб-интерфейс:
- Зайдите на [netlify.com](https://netlify.com)
- Перетащите папку `dist` после сборки
- Или подключите GitHub репозиторий для автоматического деплоя

### GitHub Pages

1. Добавьте в `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... остальная конфигурация
})
```

2. Установите gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Добавьте в `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Задеплойте:
```bash
npm run deploy
```

## 📁 Структура проекта

```
/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Главный компонент с роутингом
│   │   ├── components/          # React компоненты
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   ├── FloatingElements.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ...
│   │   ├── contexts/            # React контексты
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ModalContext.tsx
│   │   ├── pages/               # Страницы приложения
│   │   │   ├── Portfolio.tsx
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   └── ...
│   │   └── utils/               # Утилиты
│   ├── imports/                 # Импортированные из Figma компоненты
│   │   └── HomeDesktop.tsx
│   └── styles/                  # Глобальные стили
│       ├── index.css
│       ├── theme.css
│       └── ...
├── package.json
├── vite.config.ts
├── vercel.json                  # Конфигурация для Vercel
├── netlify.toml                 # Конфигурация для Netlify
└── README.md
```

## 🎨 Дизайн система

Проект использует единообразную дизайн-систему с чётко определёнными токенами:

### 📚 Полная документация
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Полное руководство по дизайн-системе
- **[DESIGN_CHEATSHEET.md](./DESIGN_CHEATSHEET.md)** - Быстрая шпаргалка
- **[UI_KIT.md](./UI_KIT.md)** - Руководство по UI Kit компонентам
- **[FIGMA_GUIDE.md](./FIGMA_GUIDE.md)** - 🎨 Как использовать дизайн-систему в Figma

### UI Kit компоненты

```tsx
import { Button, Card, Input, Textarea, Badge } from '@/app/components/ui-kit';

// Пример использования
<Card shadow="md" padding="lg">
  <Input placeholder="Enter your name" />
  <Button variant="primary" size="lg">Submit</Button>
</Card>
```

**Доступные компоненты:**
- `Button` - кнопки (primary, secondary, ghost, link)
- `Card` - карточки с различными тенями и padding
- `Input` - текстовые поля
- `Textarea` - многострочные поля
- `Badge` - метки и теги
- `Container` - контейнеры с max-width
- `Heading`, `Text` - типографика
- `Spacer` - отступы

### Основные принципы

#### Цвета
- **Primary**: `#0b6e4f` (зеленый)
- **Secondary**: `#2c5a07` (тёмно-зеленый)
- **Gradient**: `linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)`
- **Background (light)**: `#ffffff`
- **Background (dark)**: `oklch(0.145 0 0)`

#### Border Radius
- Карточки: `rounded-[24px]`
- Кнопки и инпуты: `rounded-[48px]`
- Минимальное: `rounded-[6px]`

#### Spacing
- Input padding: `px-[32px] py-[16px]`
- Button padding: `px-[32px] py-[16px]` (крупные), `px-[24px] py-[12px]` (средние)
- Gap между элементами: `gap-[16px]`, `gap-[24px]`, `gap-[32px]`

#### Типографика
- **Основной шрифт**: Inter (Regular 400, Medium 500)
- **Hero шрифт**: Poppins (Medium 500)
- **Размеры**: 14px, 16px, 18px, 24px, 48px-64px (hero)

#### Анимации
- Standard transition: `transition-all duration-300`
- Hover scale: `hover:scale-105` (кнопки), `hover:scale-[1.02]` (карточки)
- Active: `active:scale-95`

### Темная тема
Полная поддержка через ThemeContext с использованием `dark:` классов Tailwind.

## 🔧 Переменные окружения

Если вы используете внешние API, создайте файл `.env`:

```env
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
```

Используйте в коде:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Создано с помощью Figma Make