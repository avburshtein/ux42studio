# 🎨 Визуальная шпаргалка дизайн-системы

Быстрый справочник по дизайн-системе проекта для разработчиков.

---

## 🎨 Цвета

### Брендовые цвета
```css
#0b6e4f  /* Основной зелёный */
#2c5a07  /* Тёмно-зелёный */
```

### Градиент (для кнопок)
```tsx
style={{
  backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
}}
```

---

## 📐 Border Radius

```tsx
rounded-[6px]   // Минимальное
rounded-[24px]  // Карточки, модалки
rounded-[48px]  // Кнопки, инпуты
rounded-full    // Круглые элементы
```

---

## 📏 Spacing

### Gap
```tsx
gap-[8px]   gap-[16px]   gap-[24px]
gap-[32px]  gap-[48px]   gap-[64px]
```

### Padding для инпутов
```tsx
px-[32px] py-[16px]  // Стандарт
```

### Padding для кнопок
```tsx
px-[32px] py-[16px]  // Большие
px-[24px] py-[12px]  // Средние
px-[20px] py-[10px]  // Маленькие
```

---

## 🔤 Типографика

### Шрифты
```tsx
font-['Inter:Regular',sans-serif]   // Основной текст
font-['Inter:Medium',sans-serif]    // Кнопки, заголовки
font-['Poppins:Medium',sans-serif]  // Hero заголовки
```

### Размеры
```tsx
text-[14px]  // Мелкий
text-[16px]  // Основной
text-[18px]  // Крупный
text-[24px]  // Заголовок
text-[48px]  // Hero
```

### Адаптивность
```tsx
text-[16px] md:text-[18px] lg:text-[20px]
```

---

## 🎭 Компоненты

### 🔘 Кнопка (Primary)
```tsx
<button className="
  px-[32px] py-[16px]
  rounded-[48px]
  text-white
  font-['Inter:Medium',sans-serif]
  text-[16px]
  shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]
  transition-all duration-300
  hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
  hover:scale-105
  active:scale-95
"
style={{
  backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
}}>
  Button
</button>
```

### 🔘 Кнопка (Outline)
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
  Button
</button>
```

### 🃏 Карточка
```tsx
<div className="
  bg-white dark:bg-[rgba(30,30,30,0.9)]
  rounded-[24px]
  p-[32px]
  shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)]
  transition-colors duration-300
">
  Content
</div>
```

### 📝 Input
```tsx
<input className="
  w-full
  px-[32px] py-[16px]
  rounded-[48px]
  bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-white
  text-[16px]
"/>
```

### 📝 Textarea
```tsx
<textarea className="
  w-full
  px-[32px] py-[16px]
  rounded-[24px]
  bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  text-gray-900 dark:text-white
  resize-none
" rows={6} />
```

### 🏷️ Tag
```tsx
<div className="
  px-[20px] py-[10px]
  rounded-[24px]
  text-white
  text-[14px]
  font-['Inter:Medium',sans-serif]
"
style={{
  backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
}}>
  Tag
</div>
```

---

## 🌓 Темная тема

### Паттерны
```tsx
// Фон
bg-white dark:bg-gray-900
bg-gray-50 dark:bg-gray-800

// Текст
text-gray-900 dark:text-white
text-[rgba(18,21,14,0.71)] dark:text-gray-400

// Границы
border-gray-200 dark:border-gray-700

// Переход
transition-colors duration-300
```

---

## 🔄 Анимации

### Стандартные
```tsx
transition-all duration-300
transition-colors duration-300
```

### Hover эффекты
```tsx
hover:scale-105      // Кнопки
hover:scale-[1.02]   // Карточки
active:scale-95      // Нажатие
```

### Тени при hover
```tsx
hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]
```

---

## 📱 Адаптивность

### Breakpoints
```tsx
default   // 0px mobile
sm:       // 640px
md:       // 768px
lg:       // 1024px
xl:       // 1280px
```

### Grid
```tsx
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-[24px] md:gap-[32px]
">
```

### Flex
```tsx
<div className="
  flex
  flex-col
  md:flex-row
  gap-[16px] md:gap-[24px]
">
```

### Текст
```tsx
text-[16px] md:text-[18px] lg:text-[20px]
```

### Padding
```tsx
p-[24px] md:p-[32px] lg:p-[48px]
px-[20px] md:px-[40px] lg:px-[80px]
```

### Hidden/Visible
```tsx
hidden md:flex      // Скрыто на mobile, видно на desktop
flex md:hidden      // Видно на mobile, скрыто на desktop
```

---

## 💡 Быстрые примеры

### Hero Section
```tsx
<section className="min-h-screen flex items-center justify-center px-[20px] md:px-[40px]">
  <div className="max-w-[1400px] mx-auto text-center">
    <h1 className="text-[48px] md:text-[64px] mb-[24px]">Title</h1>
    <p className="text-[18px] md:text-[20px] mb-[48px]">Subtitle</p>
    <button>{/* Primary button */}</button>
  </div>
</section>
```

### Grid Section
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px] px-[20px] md:px-[40px]">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-[24px] p-[32px]">
      {/* Card content */}
    </div>
  ))}
</div>
```

---

## ✅ Чек-лист компонента

При создании нового компонента убедитесь:

- [ ] ✅ Border-radius: `24px` для карточек, `48px` для кнопок
- [ ] ✅ Transitions: `transition-all duration-300`
- [ ] ✅ Hover: `hover:scale-105` + тени
- [ ] ✅ Dark mode: `dark:...` классы
- [ ] ✅ Responsive: `md:...` и `lg:...`
- [ ] ✅ Spacing: правильный gap и padding
- [ ] ✅ Typography: `Inter` для текста, `Poppins` для hero
- [ ] ✅ Colors: брендовый градиент для CTA
- [ ] ✅ Shadows: правильная иерархия
- [ ] ✅ Mobile: протестировано на малых экранах

---

## 📚 Полная документация

👉 **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - подробное описание всей дизайн-системы

---

**Последнее обновление**: 2026-02-28
