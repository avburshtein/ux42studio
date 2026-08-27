# ⚡ UI Kit - Быстрая шпаргалка

Краткий справочник по использованию UI Kit компонентов.

---

## 📦 Импорт

```tsx
import { 
  Button, 
  Card, 
  Input, 
  Textarea, 
  Badge,
  Container,
  Heading,
  Text,
  Spacer
} from '@/app/components/ui-kit';
```

---

## 🔘 Button

```tsx
// Primary (gradient)
<Button variant="primary" size="lg">Click me</Button>

// Secondary (outline)
<Button variant="secondary" size="md">Cancel</Button>

// Ghost
<Button variant="ghost" size="sm">Close</Button>

// Link
<Button variant="link">Learn more</Button>

// Без градиента
<Button variant="primary" gradient={false}>No gradient</Button>

// Без hover
<Button variant="primary" hover="none">No hover</Button>
```

**Props:** `variant`, `size`, `hover`, `gradient`, `disabled`

---

## 🃏 Card

```tsx
// Стандартная
<Card shadow="md" padding="md">
  Content
</Card>

// С hover
<Card shadow="lg" padding="lg" hover="both">
  Hoverable card
</Card>

// Без padding
<Card shadow="sm" padding="none">
  <img src="..." className="rounded-[24px]" />
</Card>

// Полная структура
<Card shadow="md" padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:** `shadow`, `padding`, `hover`

---

## 📝 Input

```tsx
// Default
<Input placeholder="Enter text" />

// Filled
<Input variant="filled" size="lg" />

// Outline
<Input variant="outline" size="sm" />

// Email
<Input type="email" placeholder="you@example.com" />

// Controlled
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>
```

**Props:** `variant`, `size`, `type`

---

## 📝 Textarea

```tsx
// Default
<Textarea rows={6} placeholder="Enter message" />

// Filled
<Textarea variant="filled" rows={8} />

// Controlled
<Textarea 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={6}
/>
```

**Props:** `variant`, `size`, `rows`

---

## 🏷️ Badge

```tsx
// Primary (gradient)
<Badge variant="primary" size="md">Featured</Badge>

// Secondary (outline)
<Badge variant="secondary" size="sm">New</Badge>

// Ghost
<Badge variant="ghost" size="md">Popular</Badge>

// Без градиента
<Badge variant="primary" gradient={false}>No gradient</Badge>

// Список тегов
<div className="flex flex-wrap gap-[8px]">
  <Badge size="sm">React</Badge>
  <Badge size="sm">TypeScript</Badge>
  <Badge size="sm">Tailwind</Badge>
</div>
```

**Props:** `variant`, `size`, `gradient`

---

## 📦 Container

```tsx
// Default (1400px)
<Container>Content</Container>

// Small (600px)
<Container maxWidth="sm">Narrow</Container>

// Large (1200px)
<Container maxWidth="lg">Wide</Container>

// Full width
<Container maxWidth="full">Full width</Container>
```

**Props:** `maxWidth`

---

## 🔤 Heading & Text

```tsx
// Heading
<Heading level="h1" font="poppins">
  Hero Title
</Heading>

<Heading level="h2" font="inter">
  Section Title
</Heading>

// Semantic
<Heading as="h2" level="h3">
  h3 style, h2 tag
</Heading>

// Text
<Text size="base" color="primary">
  Regular text
</Text>

<Text size="lg" color="secondary">
  Secondary text
</Text>

<Text size="sm" color="muted">
  Muted text
</Text>

// As span
<Text as="span" size="base">
  Inline text
</Text>
```

**Heading props:** `level`, `font`, `as`  
**Text props:** `size`, `color`, `as`

---

## ⬛ Spacer

```tsx
// Вертикальный отступ
<Spacer size="md" />

// Горизонтальный отступ
<Spacer size="lg" axis="horizontal" />

// Отступы со всех сторон
<Spacer size="xl" axis="both" />
```

**Размеры:** `xs` (8px), `sm` (16px), `md` (24px), `lg` (32px), `xl` (48px), `2xl` (64px), `3xl` (96px)  
**Props:** `size`, `axis`

---

## 💡 Быстрые примеры

### Hero

```tsx
<Container maxWidth="lg">
  <Heading level="h1" font="poppins">Title</Heading>
  <Spacer size="lg" />
  <Text size="lg" color="secondary">Subtitle</Text>
  <Spacer size="2xl" />
  <Button variant="primary" size="lg">CTA</Button>
</Container>
```

### Форма

```tsx
<Card shadow="md" padding="lg">
  <Input placeholder="Name" />
  <Spacer size="md" />
  <Input type="email" placeholder="Email" />
  <Spacer size="md" />
  <Textarea rows={6} placeholder="Message" />
  <Spacer size="lg" />
  <Button variant="primary" size="lg">Send</Button>
</Card>
```

### Сетка карточек

```tsx
<Container>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
    {items.map(item => (
      <Card key={item.id} shadow="lg" hover="both" padding="md">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.desc}</CardDescription>
        </CardHeader>
      </Card>
    ))}
  </div>
</Container>
```

---

## 🎨 Варианты

### Button
- **variant:** `primary`, `secondary`, `ghost`, `link`
- **size:** `sm`, `md`, `lg`, `icon`
- **hover:** `scale`, `none`

### Card
- **shadow:** `none`, `sm`, `md`, `lg`
- **padding:** `none`, `sm`, `md`, `lg`
- **hover:** `none`, `scale`, `shadow`, `both`

### Input / Textarea
- **variant:** `default`, `filled`, `outline`
- **size:** `sm`, `md`, `lg`

### Badge
- **variant:** `primary`, `secondary`, `outline`, `ghost`
- **size:** `sm`, `md`, `lg`

### Container
- **maxWidth:** `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1400px), `full`

### Heading
- **level:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **font:** `inter`, `poppins`

### Text
- **size:** `xs`, `sm`, `base`, `lg`, `xl`
- **color:** `primary`, `secondary`, `muted`

---

## 🔧 Кастомизация

```tsx
// Дополнительные классы
<Button className="w-full md:w-auto">
  Full width on mobile
</Button>

// Собственные стили
<Card className="border-2 border-green-500">
  Custom border
</Card>

// Override inline styles
<Button style={{ minWidth: '200px' }}>
  Custom width
</Button>
```

---

## 📚 Полная документация

👉 **[UI_KIT.md](./UI_KIT.md)** - подробное руководство с примерами

---

**Последнее обновление**: 2026-02-28
