# 🎨 UI Kit - Руководство по использованию

Набор переиспользуемых компонентов на базе дизайн-системы проекта.

---

## 📦 Установка

UI Kit уже включён в проект. Импортируйте компоненты:

```tsx
import { Button, Card, Input, Textarea, Badge } from '@/app/components/ui-kit';
```

---

## 🧩 Компоненты

### 🔘 Button

Кнопки с различными вариантами отображения.

#### Варианты

```tsx
import { Button } from '@/app/components/ui-kit';

// Primary button (с градиентом)
<Button variant="primary" size="lg">
  Get Started
</Button>

// Secondary button (outline)
<Button variant="secondary" size="md">
  Learn More
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Link button
<Button variant="link">
  Read more
</Button>

// Icon button
<Button variant="primary" size="icon">
  <Icon />
</Button>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | `'primary'` | Вариант отображения |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | Размер кнопки |
| `hover` | `'scale' \| 'none'` | `'scale'` | Hover эффект |
| `gradient` | `boolean` | `true` | Градиент для primary |
| `disabled` | `boolean` | `false` | Отключение кнопки |

#### Примеры

```tsx
// Большая CTA кнопка
<Button variant="primary" size="lg" gradient>
  Start Free Trial
</Button>

// Вторичная кнопка без hover
<Button variant="secondary" size="md" hover="none">
  Cancel
</Button>

// Кнопка с иконкой
<Button variant="primary" size="md">
  <ArrowRight className="w-4 h-4" />
  Continue
</Button>
```

---

### 🃏 Card

Карточки контента с различными стилями теней и padding.

#### Варианты

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui-kit';

// Базовая карточка
<Card shadow="md" padding="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Карточка с hover эффектом
<Card shadow="lg" padding="lg" hover="both">
  Content
</Card>

// Компактная карточка
<Card shadow="sm" padding="sm">
  Compact content
</Card>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Размер тени |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Внутренние отступы |
| `hover` | `'none' \| 'scale' \| 'shadow' \| 'both'` | `'none'` | Hover эффект |

#### Примеры

```tsx
// Карточка портфолио
<Card shadow="lg" padding="md" hover="both">
  <img src="image.jpg" alt="Project" />
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Project description</CardDescription>
  </CardHeader>
</Card>

// Карточка без padding (для изображений)
<Card shadow="md" padding="none">
  <img src="image.jpg" alt="Full width image" className="rounded-[24px]" />
</Card>
```

---

### 📝 Input

Текстовые поля ввода.

#### Варианты

```tsx
import { Input } from '@/app/components/ui-kit';

// Стандартный input
<Input 
  variant="default" 
  size="md" 
  placeholder="Enter your email"
/>

// Filled input
<Input 
  variant="filled" 
  size="lg" 
  placeholder="Your name"
/>

// Outline input
<Input 
  variant="outline" 
  size="sm" 
  placeholder="Search..."
/>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'default' \| 'filled' \| 'outline'` | `'default'` | Вариант отображения |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер поля |
| `type` | `string` | `'text'` | Тип input |

#### Примеры

```tsx
// Email input
<Input 
  type="email" 
  placeholder="you@example.com"
  required
/>

// Password input
<Input 
  type="password" 
  placeholder="Enter password"
  variant="filled"
/>

// Controlled input
const [value, setValue] = useState('');
<Input 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Type something..."
/>
```

---

### 📝 Textarea

Многострочные текстовые поля.

#### Варианты

```tsx
import { Textarea } from '@/app/components/ui-kit';

// Стандартная textarea
<Textarea 
  variant="default" 
  size="md" 
  rows={6}
  placeholder="Enter your message..."
/>

// Filled textarea
<Textarea 
  variant="filled" 
  size="lg" 
  rows={8}
  placeholder="Tell us more..."
/>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'default' \| 'filled' \| 'outline'` | `'default'` | Вариант отображения |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер поля |
| `rows` | `number` | - | Количество строк |

#### Примеры

```tsx
// Contact form textarea
<Textarea 
  placeholder="Tell us about your project..."
  rows={6}
  variant="default"
  required
/>

// Large textarea
<Textarea 
  size="lg"
  rows={10}
  placeholder="Write a detailed description..."
/>
```

---

### 🏷️ Badge

Теги и метки.

#### Варианты

```tsx
import { Badge } from '@/app/components/ui-kit';

// Primary badge с градиентом
<Badge variant="primary" size="md">
  Featured
</Badge>

// Secondary badge (outline)
<Badge variant="secondary" size="sm">
  New
</Badge>

// Ghost badge
<Badge variant="ghost" size="md">
  Popular
</Badge>

// Outline badge
<Badge variant="outline" size="lg">
  Coming Soon
</Badge>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Вариант отображения |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Размер метки |
| `gradient` | `boolean` | `true` | Градиент для primary |

#### Примеры

```tsx
// Технологии проекта
<div className="flex flex-wrap gap-[8px]">
  <Badge variant="primary" size="sm">React</Badge>
  <Badge variant="primary" size="sm">TypeScript</Badge>
  <Badge variant="primary" size="sm">Tailwind</Badge>
</div>

// Статусы
<Badge variant="secondary" size="md">In Progress</Badge>
<Badge variant="ghost" size="md">Completed</Badge>
```

---

### 📦 Container

Контейнер с максимальной шириной и отступами.

#### Варианты

```tsx
import { Container } from '@/app/components/ui-kit';

// Стандартный контейнер (1400px)
<Container>
  Content here
</Container>

// Узкий контейнер
<Container maxWidth="sm">
  Narrow content
</Container>

// Широкий контейнер
<Container maxWidth="full">
  Full width content
</Container>
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'` | Максимальная ширина |

#### Размеры

- `sm`: 600px
- `md`: 900px
- `lg`: 1200px
- `xl`: 1400px (default)
- `full`: 100%

#### Примеры

```tsx
// Секция с контейнером
<section className="py-[64px] md:py-[96px]">
  <Container maxWidth="lg">
    <Heading level="h2">Section Title</Heading>
    <Text>Section content</Text>
  </Container>
</section>

// Модальное окно
<Container maxWidth="sm">
  <Card>
    <CardHeader>
      <CardTitle>Modal Title</CardTitle>
    </CardHeader>
  </Card>
</Container>
```

---

### 🔤 Typography

Заголовки и текст с предустановленными стилями.

#### Heading

```tsx
import { Heading } from '@/app/components/ui-kit';

// H1 с Poppins (Hero)
<Heading level="h1" font="poppins">
  Create Amazing Experiences
</Heading>

// H2 с Inter
<Heading level="h2" font="inter">
  Section Title
</Heading>

// H3 как H2 (семантика)
<Heading as="h2" level="h3">
  Subtitle
</Heading>
```

#### Text

```tsx
import { Text } from '@/app/components/ui-kit';

// Основной текст
<Text size="base" color="primary">
  Regular text content
</Text>

// Вторичный текст
<Text size="lg" color="secondary">
  Supporting text
</Text>

// Приглушённый текст
<Text size="sm" color="muted">
  Helper text or metadata
</Text>

// Span вместо p
<Text as="span" size="base">
  Inline text
</Text>
```

#### Props (Heading)

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `level` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'` | Размер заголовка |
| `font` | `'inter' \| 'poppins'` | `'inter'` | Шрифт |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | - | HTML тег (для семантики) |

#### Props (Text)

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `size` | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl'` | `'base'` | Размер текста |
| `color` | `'primary' \| 'secondary' \| 'muted'` | `'primary'` | Цвет текста |
| `as` | `'p' \| 'span' \| 'div'` | `'p'` | HTML тег |

---

### ⬛ Spacer

Отступы между элементами.

```tsx
import { Spacer } from '@/app/components/ui-kit';

// Вертикальный отступ
<Spacer size="md" axis="vertical" />

// Горизонтальный отступ
<Spacer size="lg" axis="horizontal" />

// Отступ во все стороны
<Spacer size="xl" axis="both" />
```

#### Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'md'` | Размер отступа |
| `axis` | `'horizontal' \| 'vertical' \| 'both'` | `'vertical'` | Направление |

#### Размеры

- `xs`: 8px
- `sm`: 16px
- `md`: 24px
- `lg`: 32px
- `xl`: 48px
- `2xl`: 64px
- `3xl`: 96px

---

## 💡 Практические примеры

### Hero секция

```tsx
import { Container, Heading, Text, Button, Spacer } from '@/app/components/ui-kit';

<section className="min-h-screen flex items-center justify-center">
  <Container maxWidth="lg">
    <div className="text-center">
      <Heading level="h1" font="poppins">
        Create Amazing Digital Experiences
      </Heading>
      <Spacer size="lg" />
      <Text size="lg" color="secondary">
        Modern design solutions for your business
      </Text>
      <Spacer size="2xl" />
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </div>
  </Container>
</section>
```

### Форма контакта

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Textarea, Button, Spacer } from '@/app/components/ui-kit';

<Card shadow="md" padding="lg">
  <CardHeader>
    <CardTitle>Contact Us</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <Input 
        type="text" 
        placeholder="Your Name"
        required
      />
      <Spacer size="md" />
      <Input 
        type="email" 
        placeholder="Your Email"
        required
      />
      <Spacer size="md" />
      <Textarea 
        rows={6}
        placeholder="Your Message"
        required
      />
    </form>
  </CardContent>
  <CardFooter>
    <Button variant="primary" size="lg" type="submit">
      Send Message
    </Button>
  </CardFooter>
</Card>
```

### Сетка карточек

```tsx
import { Container, Card, CardHeader, CardTitle, CardDescription, Badge } from '@/app/components/ui-kit';

<Container>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px]">
    {projects.map(project => (
      <Card key={project.id} shadow="lg" padding="md" hover="both">
        <img src={project.image} alt={project.title} className="rounded-[24px] mb-[16px]" />
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-[8px] mt-[16px]">
          {project.tags.map(tag => (
            <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
          ))}
        </div>
      </Card>
    ))}
  </div>
</Container>
```

---

## 🎨 Кастомизация

### Расширение стилей

Все компоненты принимают `className` для дополнительной кастомизации:

```tsx
<Button 
  variant="primary" 
  className="w-full md:w-auto"
>
  Full width on mobile
</Button>

<Card 
  shadow="md" 
  className="border-2 border-green-500"
>
  Card with custom border
</Card>
```

### Переопределение стилей

Можно создавать собственные варианты на базе существующих:

```tsx
import { buttonVariants } from '@/app/components/ui-kit';

const customButtonClass = buttonVariants({ 
  variant: 'primary', 
  size: 'lg' 
}) + ' custom-class';

<button className={customButtonClass}>
  Custom Button
</button>
```

---

## 🔧 TypeScript

Все компоненты полностью типизированы:

```tsx
import type { ButtonProps, CardProps, InputProps } from '@/app/components/ui-kit';

// Создание обёртки с типами
interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ loading, children, ...props }) => {
  return (
    <Button {...props} disabled={loading}>
      {loading ? 'Loading...' : children}
    </Button>
  );
};
```

---

## ♿ Accessibility

Все компоненты следуют лучшим практикам доступности:

- ✅ Семантические HTML теги
- ✅ ARIA атрибуты где необходимо
- ✅ Keyboard навигация
- ✅ Focus состояния
- ✅ Достаточный контраст цветов

---

## 📚 Связанные документы

- [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md) - Полная дизайн-система
- [DESIGN_CHEATSHEET.md](../../../DESIGN_CHEATSHEET.md) - Быстрая шпаргалка
- [START_HERE.md](../../../START_HERE.md) - Главная точка входа

---

**Версия**: 1.0  
**Обновлено**: 2026-02-28  
**Статус**: ✅ Production Ready
