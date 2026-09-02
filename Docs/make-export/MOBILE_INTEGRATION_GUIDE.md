# 🎯 Инструкция по мобильной адаптации - Быстрый старт

## ✅ Что уже сделано

1. ✅ Установлен и настроен `slick-carousel`
2. ✅ Добавлены CSS стили для слайдера (с темной темой)
3. ✅ Создан `MobileHeader` компонент с иконками
4. ✅ Создан `PortfolioGalleryMobile` с слайдером и дропдауном
5. ✅ Создан универсальный `CardSlider` компонент

## 📦 Созданные компоненты

```
/src/app/components/
├── MobileHeader.tsx             ✅ Хедер с иконками
├── PortfolioGalleryMobile.tsx   ✅ Portfolio слайдер
└── CardSlider.tsx               ✅ Универсальный слайдер для карточек

/src/styles/
└── slick-custom.css             ✅ Кастомные стили слайдера
```

---

## 🔧 Что нужно сделать вручную

### 1. Обновить HomeDesktop.tsx

Файл слишком большой (3500+ строк), поэтому нужно вручную добавить условный рендеринг:

```tsx
// В начале файла импортировать:
import { MobileHeader } from '../app/components/MobileHeader';
import { PortfolioGalleryMobile } from '../app/components/PortfolioGalleryMobile';
import { CardSlider } from '../app/components/CardSlider';

// В компоненте HomeDesktop добавить:
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### 2. Заменить хедер на мобильном

Найти в HomeDesktop.tsx блок с кнопкой Menu и ThemeToggle, обернуть в условие:

```tsx
{/* Desktop Header */}
<div className="hidden md:flex ...">
  {/* Existing header code */}
</div>

{/* Mobile Header */}
{isMobile && <MobileHeader onMenuClick={openMobileMenu} />}
```

### 3. Заменить Portfolio на мобильном

Найти `<PortfolioGallery />` и заменить на:

```tsx
{isMobile ? (
  <PortfolioGalleryMobile />
) : (
  <PortfolioGallery />
)}
```

### 4. Обернуть "Three Ways to Grow" карточки в слайдер

Найти секцию с 3 карточками и обернуть:

```tsx
{/* Desktop - Grid */}
<div className="hidden md:grid md:grid-cols-3 gap-[24px]">
  {/* 3 карточки */}
</div>

{/* Mobile - Slider */}
<div className="md:hidden px-[30px]">
  <CardSlider>
    {/* Каждая карточка как отдельный элемент */}
    <div>{/* Card 1 */}</div>
    <div>{/* Card 2 */}</div>
    <div>{/* Card 3 */}</div>
  </CardSlider>
</div>
```

### 5. Изменить "Human Insight" блок

Заменить изображение и структуру:

```tsx
import himisImage from 'figma:asset/bdd723f560f0dc8f6859abda9365996c4a094470.png';

{/* Mobile */}
<div className="md:hidden flex flex-col gap-[24px]">
  {/* Image first */}
  <div className="w-full">
    <img src={himisImage} alt="Human Insight" className="w-full rounded-[24px]" />
  </div>
  
  {/* Text below */}
  <div className="flex flex-col gap-[16px]">
    <h2>Human insight meets intelligent tools</h2>
    <p>Text content...</p>
  </div>
</div>

{/* Desktop */}
<div className="hidden md:flex ...">
  {/* Original layout */}
</div>
```

### 6. Изменить Benefits блок с слайдером

```tsx
import benefitsImage from 'figma:asset/64c61cf1e9ebeea6608ae949a112ca65a91fea67.png';

{/* Mobile */}
<div className="md:hidden flex flex-col gap-[24px]">
  {/* Image first */}
  <div className="w-full">
    <img src={benefitsImage} alt="Benefits" className="w-full rounded-[24px]" />
  </div>
  
  {/* Text slider below */}
  <CardSlider>
    <div>{/* Benefit 1: Speed */}</div>
    <div>{/* Benefit 2: Quality */}</div>
    <div>{/* Benefit 3: etc */}</div>
  </CardSlider>
</div>
```

### 7. Pricing карточки в слайдер

```tsx
{/* Desktop - Grid */}
<div className="hidden md:grid md:grid-cols-3 gap-[24px]">
  {/* 3 pricing cards */}
</div>

{/* Mobile - Slider */}
<div className="md:hidden px-[30px]">
  <CardSlider>
    <div>{/* Pricing Card 1 */}</div>
    <div>{/* Pricing Card 2 */}</div>
    <div>{/* Pricing Card 3 */}</div>
  </CardSlider>
</div>
```

### 8. Скрыть Team и Testimonials

Найти секции и добавить `className="hidden md:block"`:

```tsx
{/* Team Section */}
<div className="hidden md:block ...">
  {/* Team content */}
</div>

{/* Testimonials Section */}
<div className="hidden md:block ...">
  {/* Testimonials content */}
</div>
```

### 9. Адаптировать формы

```tsx
{/* Contact Form */}
<form className="flex flex-col gap-[16px] w-full">
  <input 
    className="w-full md:w-auto px-[32px] py-[16px] rounded-[48px] ..." 
  />
  <button 
    className="w-full md:w-auto px-[32px] py-[16px] ..." 
  >
    Submit
  </button>
</form>
```

### 10. Адаптировать Footer

```tsx
{/* Desktop - Grid */}
<div className="hidden md:grid md:grid-cols-4 gap-[32px]">
  {/* Footer columns */}
</div>

{/* Mobile - Stack */}
<div className="md:hidden flex flex-col gap-[24px]">
  {/* Footer items stacked */}
</div>
```

---

## 🎨 Полезные Tailwind классы

```css
/* Скрыть на мобильном, показать на desktop */
className="hidden md:block"
className="hidden md:flex"

/* Показать только на мобильном */
className="md:hidden"

/* Адаптивные размеры */
className="text-[14px] md:text-[16px] lg:text-[18px]"
className="px-[16px] md:px-[32px] lg:px-[48px]"

/* Адаптивная сетка */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

/* Адаптивный flex */
className="flex flex-col md:flex-row"
```

---

## 🚀 Запуск и тестирование

```bash
# 1. Запустить dev сервер
npm run dev

# 2. Открыть в браузере
http://localhost:5173

# 3. Включить DevTools (F12)

# 4. Toggle Device Toolbar (Ctrl+Shift+M)

# 5. Выбрать устройство:
- iPhone 12 Pro (390x844)
- iPhone SE (375x667)
- iPad (768x1024)

# 6. Проверить:
- Хедер с иконками ✓
- Слайдеры работают ✓
- Формы на всю ширину ✓
- Футер адаптивный ✓
- Темная тема работает ✓
```

---

## 📱 Breakpoints

```css
/* Mobile First подход */
/* Mobile:  до 768px (по умолчанию) */
/* Tablet:  md: (768px+) */
/* Desktop: lg: (1024px+) */

/* Примеры: */
className="px-[16px] md:px-[32px] lg:px-[64px]"
className="text-[14px] md:text-[16px]"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🎯 Checklist адаптации

### Хедер
- [ ] Кнопка Menu → иконка гамбургера
- [ ] Кнопка темы → иконка Sun/Moon
- [ ] Sticky позиционирование

### Portfolio
- [ ] Фильтр → dropdown select
- [ ] Карточки → слайдер с стрелками
- [ ] Dots навигация внизу

### Three Ways to Grow
- [ ] Карточки → слайдер
- [ ] Стрелки работают
- [ ] Dots внизу

### Human Insight
- [ ] Картинка сверху
- [ ] Текст снизу
- [ ] Изображение заменено на himit.png

### Benefits
- [ ] Картинка сверху (4.png)
- [ ] Текст → слайдер снизу
- [ ] Стрелки работают

### Pricing
- [ ] Карточки → слайдер
- [ ] Стрелки и dots

### Скрытые секции
- [ ] Team section скрыт на мобильном
- [ ] Testimonials скрыт на мобильном

### Формы
- [ ] Contact form адаптивный
- [ ] Newsletter адаптивный
- [ ] Input на всю ширину

### Footer
- [ ] Колонки → стек
- [ ] Social links адаптивны
- [ ] Copyright по центру

### Темная тема
- [ ] Хедер работает в dark mode
- [ ] Слайдеры стили для dark mode
- [ ] Все секции адаптированы

---

## 💡 Советы

1. **Используйте Chrome DevTools** для проверки на разных устройствах

2. **Тестируйте touch events** - свайпы должны работать на слайдерах

3. **Проверяйте обе темы** - светлую и темную

4. **Оптимизируйте изображения** - используйте WebP формат

5. **Добавьте loading states** для слайдеров

---

## 🆘 Если что-то не работает

### Слайдер не отображается:
```tsx
// Проверьте импорт CSS:
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/slick-custom.css';
```

### Стрелки не видны:
```tsx
// Проверьте что у контейнера есть position: relative
className="relative"
```

### Dots не отображаются:
```tsx
// Убедитесь что dots: true в settings
const settings = {
  dots: true,
  ...
};
```

### Темная тема не работает для слайдера:
```css
/* Проверьте что slick-custom.css импортирован */
/* И что у parent элемента есть класс .dark */
```

---

## 📚 Документация

- **React Slick**: https://react-slick.neostack.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons/

---

**Статус**: 🎯 Готово к интеграции  
**Следующий шаг**: Интегрировать компоненты в HomeDesktop.tsx

**Нужна помощь с конкретной секцией?** Дайте знать! 🚀
