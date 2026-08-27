# 📋 Типизация проекта для админки

**Дата**: 01.03.2026

Этот документ содержит полную типизацию сущности "Проект" (Portfolio Project) для системы управления контентом (CMS) / админ-панели.

---

## 🎯 Анализ текущих данных

### Найденные компоненты:
- `/src/app/components/PortfolioGallery.tsx` - галерея проектов (краткая информация)
- `/src/app/components/ProjectDetail.tsx` - детальная страница проекта (полная информация)

### Выявленные поля:

**В галерее (PortfolioGallery):**
- id, title, category, image, tags[], description, projectSlug, liveUrl

**На детальной странице (ProjectDetail):**
- title, category, client, year, duration, heroImage, overview, challenge, solution, results[], technologies[], images[], testimonial{}

---

## 📦 TypeScript Интерфейсы

### 1. Основной интерфейс проекта

```typescript
/**
 * Полная сущность проекта портфолио
 */
export interface PortfolioProject {
  // === ИДЕНТИФИКАЦИЯ ===
  /**
   * Уникальный идентификатор проекта
   * @example 1
   */
  id: number;

  /**
   * Уникальный slug для URL
   * @example "modern-ecommerce-platform"
   * @pattern ^[a-z0-9]+(?:-[a-z0-9]+)*$
   */
  slug: string;

  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  /**
   * Название проекта
   * @minLength 3
   * @maxLength 100
   * @example "Modern E-commerce Platform"
   */
  title: string;

  /**
   * Категория проекта
   */
  category: ProjectCategory;

  /**
   * Краткое описание (для карточки в галерее)
   * @minLength 50
   * @maxLength 250
   */
  description: string;

  /**
   * Подробное описание проекта
   * @minLength 100
   * @maxLength 1000
   */
  overview: string;

  // === ИЗОБРАЖЕНИЯ ===
  /**
   * Главное изображение для карточки (превью)
   * @format url
   * @example "https://images.unsplash.com/photo-xxx"
   */
  thumbnailImage: string;

  /**
   * Hero изображение для детальной страницы
   * @format url
   */
  heroImage: string;

  /**
   * Галерея дополнительных изображений
   * @minItems 0
   * @maxItems 10
   */
  images: string[];

  // === ТЕГИ И МЕТАДАННЫЕ ===
  /**
   * Теги/технологии проекта
   * @minItems 1
   * @maxItems 10
   * @example ["UI/UX", "E-commerce", "Responsive"]
   */
  tags: string[];

  /**
   * Используемые технологии
   * @minItems 1
   * @maxItems 15
   * @example ["React", "Node.js", "PostgreSQL"]
   */
  technologies: string[];

  // === ИНФОРМАЦИЯ О КЛИЕНТЕ ===
  /**
   * Название клиента/компании
   * @maxLength 100
   * @example "TechStore Inc."
   */
  client: string;

  /**
   * Год выполнения проекта
   * @minimum 2000
   * @maximum 2100
   * @example "2024"
   */
  year: string;

  /**
   * Продолжительность работы
   * @example "3 months"
   */
  duration: string;

  // === ДЕТАЛИ ПРОЕКТА ===
  /**
   * Описание задачи/проблемы клиента
   * @minLength 100
   * @maxLength 1000
   */
  challenge: string;

  /**
   * Описание решения
   * @minLength 100
   * @maxLength 1000
   */
  solution: string;

  /**
   * Достигнутые результаты
   * @minItems 2
   * @maxItems 10
   * @example ["250% increase in conversion rate", "40% reduction in page load time"]
   */
  results: string[];

  // === ОТЗЫВ ===
  /**
   * Отзыв клиента (опционально)
   */
  testimonial?: ProjectTestimonial;

  // === ССЫЛКИ ===
  /**
   * Ссылка на живой сайт/демо
   * @format url
   */
  liveUrl?: string;

  /**
   * Ссылка на GitHub репозиторий
   * @format url
   */
  githubUrl?: string;

  /**
   * Ссылка на Figma дизайн
   * @format url
   */
  figmaUrl?: string;

  /**
   * Ссылка на case study PDF
   * @format url
   */
  caseStudyUrl?: string;

  // === СТАТУС И ПУБЛИКАЦИЯ ===
  /**
   * Статус проекта
   * @default "draft"
   */
  status: ProjectStatus;

  /**
   * Отображать ли проект в портфолио
   * @default false
   */
  isPublished: boolean;

  /**
   * Избранный проект (показывать на главной)
   * @default false
   */
  isFeatured: boolean;

  /**
   * Порядок сортировки (меньше = выше)
   * @minimum 0
   * @default 0
   */
  order: number;

  /**
   * Дата публикации
   */
  publishedAt?: Date;

  // === ВРЕМЕННЫЕ МЕТКИ ===
  /**
   * Дата создания записи
   */
  createdAt: Date;

  /**
   * Дата последнего обновления
   */
  updatedAt: Date;

  // === SEO ===
  /**
   * SEO метаданные
   */
  seo: ProjectSEO;
}
```

---

### 2. Вспомогательные интерфейсы

```typescript
/**
 * Отзыв клиента о проекте
 */
export interface ProjectTestimonial {
  /**
   * Текст отзыва
   * @minLength 50
   * @maxLength 500
   */
  quote: string;

  /**
   * Имя автора отзыва
   * @minLength 2
   * @maxLength 100
   * @example "Sarah Johnson"
   */
  author: string;

  /**
   * Должность автора
   * @minLength 2
   * @maxLength 100
   * @example "CEO, TechStore Inc."
   */
  position: string;

  /**
   * Фото автора (опционально)
   * @format url
   */
  avatar?: string;
}

/**
 * SEO метаданные проекта
 */
export interface ProjectSEO {
  /**
   * SEO title (если отличается от основного title)
   * @maxLength 60
   */
  metaTitle?: string;

  /**
   * Meta description
   * @minLength 50
   * @maxLength 160
   */
  metaDescription: string;

  /**
   * Ключевые слова
   * @maxItems 10
   */
  keywords: string[];

  /**
   * Open Graph изображение
   * @format url
   */
  ogImage?: string;

  /**
   * Canonical URL
   * @format url
   */
  canonicalUrl?: string;
}
```

---

### 3. Enums

```typescript
/**
 * Категории проектов
 */
export enum ProjectCategory {
  WEB_DESIGN = "Web Design",
  APP_DESIGN = "App Design",
  BRANDING = "Branding",
  GRAPHIC_DESIGN = "Graphic Design",
  PACKAGING = "Packaging",
  UI_UX = "UI/UX Design",
  MOBILE = "Mobile Development",
  ECOMMERCE = "E-commerce",
  MARKETING = "Marketing",
}

/**
 * Статусы проекта
 */
export enum ProjectStatus {
  DRAFT = "draft",           // Черновик
  IN_REVIEW = "in_review",   // На проверке
  PUBLISHED = "published",   // Опубликован
  ARCHIVED = "archived",     // Архивирован
}
```

---

## 🗂️ Список полей для админки

### Таблица с полной информацией:

| # | Поле | Тип | Обязательное | Значение по умолчанию | Валидация | Описание |
|---|------|-----|--------------|----------------------|-----------|----------|
| 1 | `id` | `number` | ✅ Да (авто) | Auto-increment | - | ID записи |
| 2 | `slug` | `string` | ✅ Да | - | Pattern: ^[a-z0-9-]+$ | URL-friendly идентификатор |
| 3 | `title` | `string` | ✅ Да | - | 3-100 символов | Название проекта |
| 4 | `category` | `enum` | ✅ Да | - | ProjectCategory | Категория из списка |
| 5 | `description` | `text` | ✅ Да | - | 50-250 символов | Краткое описание |
| 6 | `overview` | `text` | ✅ Да | - | 100-1000 символов | Полное описание |
| 7 | `thumbnailImage` | `string (url)` | ✅ Да | - | Valid URL | Превью изображение |
| 8 | `heroImage` | `string (url)` | ✅ Да | - | Valid URL | Hero изображение |
| 9 | `images` | `array<string>` | ❌ Нет | `[]` | 0-10 URL | Галерея изображений |
| 10 | `tags` | `array<string>` | ✅ Да | `[]` | 1-10 тегов | Теги проекта |
| 11 | `technologies` | `array<string>` | ✅ Да | `[]` | 1-15 технологий | Используемые технологии |
| 12 | `client` | `string` | ✅ Да | - | До 100 символов | Название клиента |
| 13 | `year` | `string` | ✅ Да | Current year | 2000-2100 | Год выполнения |
| 14 | `duration` | `string` | ✅ Да | - | - | Продолжительность |
| 15 | `challenge` | `text` | ✅ Да | - | 100-1000 символов | Описание задачи |
| 16 | `solution` | `text` | ✅ Да | - | 100-1000 символов | Описание решения |
| 17 | `results` | `array<string>` | ✅ Да | `[]` | 2-10 результатов | Достигнутые результаты |
| 18 | `testimonial` | `object` | ❌ Нет | `null` | ProjectTestimonial | Отзыв клиента |
| 19 | `liveUrl` | `string (url)` | ❌ Нет | `null` | Valid URL | Ссылка на сайт |
| 20 | `githubUrl` | `string (url)` | ❌ Нет | `null` | Valid URL | Ссылка на GitHub |
| 21 | `figmaUrl` | `string (url)` | ❌ Нет | `null` | Valid URL | Ссылка на Figma |
| 22 | `caseStudyUrl` | `string (url)` | ❌ Нет | `null` | Valid URL | Ссылка на PDF |
| 23 | `status` | `enum` | ✅ Да | `"draft"` | ProjectStatus | Статус проекта |
| 24 | `isPublished` | `boolean` | ✅ Да | `false` | - | Опубликован? |
| 25 | `isFeatured` | `boolean` | ✅ Да | `false` | - | Избранный? |
| 26 | `order` | `number` | ✅ Да | `0` | >= 0 | Порядок сортировки |
| 27 | `publishedAt` | `Date` | ❌ Нет | `null` | Valid date | Дата публикации |
| 28 | `createdAt` | `Date` | ✅ Да (авто) | `new Date()` | - | Дата создания |
| 29 | `updatedAt` | `Date` | ✅ Да (авто) | `new Date()` | - | Дата обновления |
| 30 | `seo` | `object` | ✅ Да | - | ProjectSEO | SEO метаданные |

---

## 🎨 Группировка полей для UI админки

### Вкладка 1: Основная информация

```typescript
{
  title: string;           // Input text
  slug: string;            // Input text (auto-generate from title)
  category: enum;          // Select dropdown
  description: text;       // Textarea (250 chars)
  overview: text;          // Textarea (1000 chars)
  status: enum;            // Select dropdown
  isPublished: boolean;    // Checkbox
  isFeatured: boolean;     // Checkbox
  order: number;           // Number input
}
```

**UI компоненты:**
- Title: `<Input />` с счетчиком символов
- Slug: `<Input />` с автогенерацией + кнопка "Edit"
- Category: `<Select />` с вариантами из enum
- Description: `<Textarea />` с счетчиком (50-250)
- Overview: `<Textarea />` с rich text editor
- Status: `<Select />` с цветными badge
- Published: `<Toggle />`
- Featured: `<Toggle />` с иконкой звезды
- Order: `<NumberInput />` с стрелками

---

### Вкладка 2: Медиа

```typescript
{
  thumbnailImage: string;   // Image upload
  heroImage: string;        // Image upload
  images: array<string>;    // Multiple image upload
}
```

**UI компоненты:**
- Thumbnail: `<ImageUpload />` с превью (рекомендуемый размер: 1080x810)
- Hero: `<ImageUpload />` с превью (рекомендуемый размер: 1920x640)
- Gallery: `<MultipleImageUpload />` с drag & drop, сортировкой

---

### Вкладка 3: Детали проекта

```typescript
{
  client: string;          // Input text
  year: string;            // Select or input
  duration: string;        // Input text
  challenge: text;         // Textarea
  solution: text;          // Textarea
  results: array<string>;  // Dynamic list
}
```

**UI компоненты:**
- Client: `<Input />`
- Year: `<Select />` или `<Input type="number" />`
- Duration: `<Input />` с подсказками ("3 months", "6 weeks")
- Challenge: `<Textarea />` с rich text
- Solution: `<Textarea />` с rich text
- Results: `<DynamicList />` с кнопками Add/Remove

---

### Вкладка 4: Технологии и теги

```typescript
{
  tags: array<string>;          // Tag input
  technologies: array<string>;  // Tag input
}
```

**UI компоненты:**
- Tags: `<TagInput />` с автодополнением из существующих
- Technologies: `<TagInput />` с автодополнением популярных технологий

---

### Вкладка 5: Ссылки

```typescript
{
  liveUrl: string;        // Input URL
  githubUrl: string;      // Input URL
  figmaUrl: string;       // Input URL
  caseStudyUrl: string;   // Input URL or file upload
}
```

**UI компоненты:**
- Все: `<Input type="url" />` с валидацией и иконкой проверки
- Case Study: дополнительно кнопка для загрузки PDF файла

---

### Вкладка 6: Отзыв

```typescript
{
  testimonial: {
    quote: string;       // Textarea
    author: string;      // Input
    position: string;    // Input
    avatar: string;      // Image upload
  }
}
```

**UI компоненты:**
- Quote: `<Textarea />` с rich text (курсив)
- Author: `<Input />`
- Position: `<Input />`
- Avatar: `<ImageUpload />` круглое превью

---

### Вкладка 7: SEO

```typescript
{
  seo: {
    metaTitle: string;        // Input
    metaDescription: string;  // Textarea
    keywords: array<string>;  // Tag input
    ogImage: string;          // Image upload
    canonicalUrl: string;     // Input URL
  }
}
```

**UI компоненты:**
- Meta Title: `<Input />` с счетчиком (0-60)
- Meta Description: `<Textarea />` с счетчиком (50-160)
- Keywords: `<TagInput />`
- OG Image: `<ImageUpload />` (1200x630)
- Canonical: `<Input type="url" />`

---

## 🔨 Пример использования в коде

### Создание нового проекта:

```typescript
const newProject: PortfolioProject = {
  id: 0, // Auto-generated
  slug: 'my-awesome-project',
  title: 'My Awesome Project',
  category: ProjectCategory.WEB_DESIGN,
  description: 'A brief description of the project for the gallery card...',
  overview: 'Detailed overview of the project, its goals, and scope...',
  
  thumbnailImage: 'https://example.com/thumbnail.jpg',
  heroImage: 'https://example.com/hero.jpg',
  images: [
    'https://example.com/screen1.jpg',
    'https://example.com/screen2.jpg'
  ],
  
  tags: ['UI/UX', 'Responsive', 'Modern'],
  technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  
  client: 'Acme Corporation',
  year: '2025',
  duration: '2 months',
  
  challenge: 'The client needed a modern website that...',
  solution: 'We implemented a custom solution using...',
  results: [
    '150% increase in user engagement',
    '40% faster page load times'
  ],
  
  testimonial: {
    quote: 'The team exceeded our expectations!',
    author: 'John Doe',
    position: 'CEO, Acme Corp',
    avatar: 'https://example.com/john.jpg'
  },
  
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/user/repo',
  figmaUrl: 'https://figma.com/file/xxx',
  caseStudyUrl: 'https://example.com/case-study.pdf',
  
  status: ProjectStatus.PUBLISHED,
  isPublished: true,
  isFeatured: true,
  order: 1,
  publishedAt: new Date('2025-03-01'),
  
  createdAt: new Date(),
  updatedAt: new Date(),
  
  seo: {
    metaTitle: 'My Awesome Project - Case Study',
    metaDescription: 'Learn how we helped Acme Corp increase engagement by 150%...',
    keywords: ['web design', 'react', 'case study'],
    ogImage: 'https://example.com/og-image.jpg',
    canonicalUrl: 'https://yoursite.com/portfolio/my-awesome-project'
  }
};
```

---

## 📊 SQL Schema (для Supabase/PostgreSQL)

```sql
-- Таблица проектов
CREATE TABLE portfolio_projects (
  -- Идентификация
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  
  -- Основная информация
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 50 AND char_length(description) <= 250),
  overview TEXT NOT NULL CHECK (char_length(overview) >= 100),
  
  -- Изображения
  thumbnail_image VARCHAR(500) NOT NULL,
  hero_image VARCHAR(500) NOT NULL,
  images TEXT[], -- Массив URL изображений
  
  -- Метаданные
  tags TEXT[] NOT NULL,
  technologies TEXT[] NOT NULL,
  
  -- Информация о клиенте
  client VARCHAR(100) NOT NULL,
  year VARCHAR(4) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  
  -- Детали проекта
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT[] NOT NULL,
  
  -- Отзыв (JSONB)
  testimonial JSONB,
  
  -- Ссылки
  live_url VARCHAR(500),
  github_url VARCHAR(500),
  figma_url VARCHAR(500),
  case_study_url VARCHAR(500),
  
  -- Статус
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Временные метки
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- SEO (JSONB)
  seo JSONB NOT NULL
);

-- Индексы
CREATE INDEX idx_portfolio_category ON portfolio_projects(category);
CREATE INDEX idx_portfolio_status ON portfolio_projects(status);
CREATE INDEX idx_portfolio_published ON portfolio_projects(is_published);
CREATE INDEX idx_portfolio_featured ON portfolio_projects(is_featured);
CREATE INDEX idx_portfolio_order ON portfolio_projects(order_index);

-- Триггер для автообновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_projects_updated_at
BEFORE UPDATE ON portfolio_projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 Валидация полей (Zod Schema)

```typescript
import { z } from 'zod';

// Testimonial schema
const testimonialSchema = z.object({
  quote: z.string().min(50).max(500),
  author: z.string().min(2).max(100),
  position: z.string().min(2).max(100),
  avatar: z.string().url().optional(),
});

// SEO schema
const seoSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().min(50).max(160),
  keywords: z.array(z.string()).max(10),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
});

// Main project schema
export const projectSchema = z.object({
  id: z.number().int().positive().optional(), // Auto-generated
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  
  title: z.string().min(3).max(100),
  category: z.nativeEnum(ProjectCategory),
  description: z.string().min(50).max(250),
  overview: z.string().min(100).max(1000),
  
  thumbnailImage: z.string().url(),
  heroImage: z.string().url(),
  images: z.array(z.string().url()).min(0).max(10),
  
  tags: z.array(z.string()).min(1).max(10),
  technologies: z.array(z.string()).min(1).max(15),
  
  client: z.string().max(100),
  year: z.string().regex(/^\d{4}$/),
  duration: z.string(),
  
  challenge: z.string().min(100).max(1000),
  solution: z.string().min(100).max(1000),
  results: z.array(z.string()).min(2).max(10),
  
  testimonial: testimonialSchema.optional(),
  
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  figmaUrl: z.string().url().optional(),
  caseStudyUrl: z.string().url().optional(),
  
  status: z.nativeEnum(ProjectStatus),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  order: z.number().int().min(0),
  publishedAt: z.date().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
  
  seo: seoSchema,
});

// Type inference
export type PortfolioProjectInput = z.infer<typeof projectSchema>;
```

---

## 📋 Готовые файлы для использования

Создам TypeScript файлы с интерфейсами:

- `/src/types/project.types.ts` - все интерфейсы и enum
- `/src/schemas/project.schema.ts` - Zod схемы для валидации
- `/src/utils/project.utils.ts` - вспомогательные функции

Эти файлы можно использовать как в админке, так и на фронтенде.

---

## 🎉 Резюме

### Всего полей: **30**

**Обязательных:** 22  
**Опциональных:** 8

**Типы полей:**
- String/Text: 15
- Array: 6
- Boolean: 3
- Number: 2
- Date: 3
- Object: 2
- Enum: 2

**Группировка для UI:**
- 7 вкладок в админке
- Логическая группировка по функциональности
- Понятные названия и подсказки
- Валидация на уровне формы и базы данных

Этот интерфейс покрывает все существующие поля в проекте + добавляет необходимые для полноценной CMS системы! 🚀
