# ⚡ Типизация проекта - Быстрая справка

## 📦 Основные интерфейсы

```typescript
// Полный проект (30 полей)
interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;       // 50-250 символов
  overview: string;          // 100-1000 символов
  thumbnailImage: string;
  heroImage: string;
  images: string[];
  tags: string[];            // 1-10 тегов
  technologies: string[];    // 1-15 технологий
  client: string;
  year: string;
  duration: string;
  challenge: string;         // 100-1000 символов
  solution: string;          // 100-1000 символов
  results: string[];         // 2-10 результатов
  testimonial?: {
    quote: string;           // 50-500 символов
    author: string;
    position: string;
    avatar?: string;
  };
  liveUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  caseStudyUrl?: string;
  status: ProjectStatus;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: {
    metaTitle?: string;      // До 60 символов
    metaDescription: string; // 50-160 символов
    keywords: string[];      // До 10 слов
    ogImage?: string;
    canonicalUrl?: string;
  };
}
```

## 🏷️ Enums

```typescript
enum ProjectCategory {
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

enum ProjectStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
```

## ⚡ Быстрые примеры

### Создание проекта

```typescript
import { generateSlug } from './utils/project.utils';
import { ProjectCategory, ProjectStatus } from './types/project.types';

const project = {
  title: 'My Project',
  slug: generateSlug('My Project'), // "my-project"
  category: ProjectCategory.WEB_DESIGN,
  status: ProjectStatus.DRAFT,
  isPublished: false,
  isFeatured: false,
  order: 0,
  // ... остальные поля
};
```

### Валидация

```typescript
import { validateProject, formatZodErrors } from './schemas/project.schema';

const result = validateProject(data);
if (!result.success) {
  const errors = formatZodErrors(result.error);
  console.error(errors);
}
```

### Фильтрация

```typescript
import { filterProjects } from './utils/project.utils';

const published = filterProjects(projects, {
  isPublished: true,
  category: ProjectCategory.WEB_DESIGN,
  search: 'react',
});
```

### Статистика

```typescript
import { getProjectStats, getPopularTags } from './utils/project.utils';

const stats = getProjectStats(projects);
const tags = getPopularTags(projects, 10);
```

## 📏 Ограничения полей

| Поле | Min | Max |
|------|-----|-----|
| title | 3 | 100 |
| description | 50 | 250 |
| overview | 100 | 1000 |
| challenge | 100 | 1000 |
| solution | 100 | 1000 |
| tags | 1 | 10 |
| technologies | 1 | 15 |
| results | 2 | 10 |
| images | 0 | 10 |
| metaDescription | 50 | 160 |

## 🛠️ Полезные функции

```typescript
// Генерация
generateSlug(title)                    // "my-project"
generateSEOTitle(title, category)      // "My Project | Web Design | Case Study"
generateSEODescription(desc, client)   // "Client case study: description..."

// Фильтрация
filterProjects(projects, filters)
getPublishedProjects(projects)
getFeaturedProjects(projects)
getProjectsByCategory(projects, category)

// Статистика
getProjectStats(projects)
getPopularTags(projects, limit)
getPopularTechnologies(projects, limit)

// Навигация
getSimilarProjects(projects, current, limit)
getAdjacentProjects(projects, currentId)

// URL
getProjectUrl(project)                 // "/portfolio/my-project"
getCategoryUrl(category)               // "/portfolio/category/web-design"

// Валидация
canPublish(project)                    // true/false
getMissingFieldsForPublish(project)    // ["title", "description"]

// Экспорт
exportProjectToJSON(project)
exportProjectsToCSV(projects)
```

## 📚 Файлы

| Файл | Что внутри |
|------|-----------|
| `/ADMIN_PROJECT_TYPES.md` | 📖 Полная документация |
| `/PROJECT_TYPES_README.md` | 🚀 Руководство по использованию |
| `/src/types/project.types.ts` | 💾 Интерфейсы и enums |
| `/src/schemas/project.schema.ts` | ✅ Zod валидация |
| `/src/utils/project.utils.ts` | 🛠️ Утилиты |

## 🔗 Импорты

```typescript
// Типы
import type {
  PortfolioProject,
  ProjectCategory,
  ProjectStatus,
  CreateProjectInput,
  UpdateProjectInput,
} from './types/project.types';

// Схемы (требует zod)
import {
  projectSchema,
  validateProject,
  generateSlug,
} from './schemas/project.schema';

// Утилиты
import {
  filterProjects,
  sortProjects,
  getProjectStats,
  getSimilarProjects,
} from './utils/project.utils';
```

---

**Полная документация:** `/ADMIN_PROJECT_TYPES.md`
