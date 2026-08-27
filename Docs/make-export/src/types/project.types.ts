/**
 * Типы для сущности "Проект портфолио"
 * @file project.types.ts
 * @created 2026-03-01
 */

// ==================== ENUMS ====================

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
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

// ==================== INTERFACES ====================

/**
 * Отзыв клиента о проекте
 */
export interface ProjectTestimonial {
  /**
   * Текст отзыва
   */
  quote: string;
  
  /**
   * Имя автора отзыва
   */
  author: string;
  
  /**
   * Должность автора
   */
  position: string;
  
  /**
   * Фото автора (опционально)
   */
  avatar?: string;
}

/**
 * SEO метаданные проекта
 */
export interface ProjectSEO {
  /**
   * SEO title (если отличается от основного title)
   */
  metaTitle?: string;
  
  /**
   * Meta description
   */
  metaDescription: string;
  
  /**
   * Ключевые слова
   */
  keywords: string[];
  
  /**
   * Open Graph изображение
   */
  ogImage?: string;
  
  /**
   * Canonical URL
   */
  canonicalUrl?: string;
}

/**
 * Полная сущность проекта портфолио
 */
export interface PortfolioProject {
  // === ИДЕНТИФИКАЦИЯ ===
  /**
   * Уникальный идентификатор проекта
   */
  id: number;
  
  /**
   * Уникальный slug для URL
   * @pattern ^[a-z0-9]+(?:-[a-z0-9]+)*$
   */
  slug: string;

  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  /**
   * Название проекта
   */
  title: string;
  
  /**
   * Категория проекта
   */
  category: ProjectCategory;
  
  /**
   * Краткое описание (для карточки в галерее)
   */
  description: string;
  
  /**
   * Подробное описание проекта
   */
  overview: string;

  // === ИЗОБРАЖЕНИЯ ===
  /**
   * Главное изображение для карточки (превью)
   */
  thumbnailImage: string;
  
  /**
   * Hero изображение для детальной страницы
   */
  heroImage: string;
  
  /**
   * Галерея дополнительных изображений
   */
  images: string[];

  // === ТЕГИ И МЕТАДАННЫЕ ===
  /**
   * Теги/технологии проекта
   */
  tags: string[];
  
  /**
   * Используемые технологии
   */
  technologies: string[];

  // === ИНФОРМАЦИЯ О КЛИЕНТЕ ===
  /**
   * Название клиента/компании
   */
  client: string;
  
  /**
   * Год выполнения проекта
   */
  year: string;
  
  /**
   * Продолжительность работы
   */
  duration: string;

  // === ДЕТАЛИ ПРОЕКТА ===
  /**
   * Описание задачи/проблемы клиента
   */
  challenge: string;
  
  /**
   * Описание решения
   */
  solution: string;
  
  /**
   * Достигнутые результаты
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
   */
  liveUrl?: string;
  
  /**
   * Ссылка на GitHub репозиторий
   */
  githubUrl?: string;
  
  /**
   * Ссылка на Figma дизайн
   */
  figmaUrl?: string;
  
  /**
   * Ссылка на case study PDF
   */
  caseStudyUrl?: string;

  // === СТАТУС И ПУБЛИКАЦИЯ ===
  /**
   * Статус проекта
   */
  status: ProjectStatus;
  
  /**
   * Отображать ли проект в портфолио
   */
  isPublished: boolean;
  
  /**
   * Избранный проект (показывать на главной)
   */
  isFeatured: boolean;
  
  /**
   * Порядок сортировки (меньше = выше)
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

// ==================== UTILITY TYPES ====================

/**
 * Тип для создания нового проекта (без auto-generated полей)
 */
export type CreateProjectInput = Omit<
  PortfolioProject,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Тип для обновления проекта (все поля опциональны кроме id)
 */
export type UpdateProjectInput = Partial<Omit<PortfolioProject, 'id'>> & {
  id: number;
};

/**
 * Тип для отображения в галерее (краткая информация)
 */
export type ProjectGalleryItem = Pick<
  PortfolioProject,
  | 'id'
  | 'slug'
  | 'title'
  | 'category'
  | 'description'
  | 'thumbnailImage'
  | 'tags'
  | 'isPublished'
  | 'isFeatured'
  | 'order'
>;

/**
 * Фильтры для списка проектов
 */
export interface ProjectFilters {
  category?: ProjectCategory;
  status?: ProjectStatus;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
}

/**
 * Параметры сортировки
 */
export interface ProjectSortOptions {
  field: keyof PortfolioProject;
  direction: 'asc' | 'desc';
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Результат запроса списка проектов
 */
export interface ProjectListResponse {
  projects: PortfolioProject[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== CONSTANTS ====================

/**
 * Все категории проектов в виде массива
 */
export const PROJECT_CATEGORIES = Object.values(ProjectCategory);

/**
 * Все статусы проектов в виде массива
 */
export const PROJECT_STATUSES = Object.values(ProjectStatus);

/**
 * Максимальные длины полей
 */
export const FIELD_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MIN: 50,
  DESCRIPTION_MAX: 250,
  OVERVIEW_MIN: 100,
  OVERVIEW_MAX: 1000,
  CHALLENGE_MIN: 100,
  CHALLENGE_MAX: 1000,
  SOLUTION_MIN: 100,
  SOLUTION_MAX: 1000,
  CLIENT_MAX: 100,
  TESTIMONIAL_QUOTE_MIN: 50,
  TESTIMONIAL_QUOTE_MAX: 500,
  TESTIMONIAL_AUTHOR_MIN: 2,
  TESTIMONIAL_AUTHOR_MAX: 100,
  TESTIMONIAL_POSITION_MIN: 2,
  TESTIMONIAL_POSITION_MAX: 100,
  TAGS_MIN: 1,
  TAGS_MAX: 10,
  TECHNOLOGIES_MIN: 1,
  TECHNOLOGIES_MAX: 15,
  RESULTS_MIN: 2,
  RESULTS_MAX: 10,
  IMAGES_MAX: 10,
  SEO_META_TITLE_MAX: 60,
  SEO_META_DESCRIPTION_MIN: 50,
  SEO_META_DESCRIPTION_MAX: 160,
  SEO_KEYWORDS_MAX: 10,
} as const;

/**
 * Значения по умолчанию для нового проекта
 */
export const DEFAULT_PROJECT_VALUES: Partial<PortfolioProject> = {
  status: ProjectStatus.DRAFT,
  isPublished: false,
  isFeatured: false,
  order: 0,
  images: [],
  tags: [],
  technologies: [],
  results: [],
  seo: {
    metaDescription: '',
    keywords: [],
  },
};

// ==================== TYPE GUARDS ====================

/**
 * Проверяет, является ли значение валидной категорией
 */
export function isProjectCategory(value: unknown): value is ProjectCategory {
  return Object.values(ProjectCategory).includes(value as ProjectCategory);
}

/**
 * Проверяет, является ли значение валидным статусом
 */
export function isProjectStatus(value: unknown): value is ProjectStatus {
  return Object.values(ProjectStatus).includes(value as ProjectStatus);
}

/**
 * Проверяет, опубликован ли проект
 */
export function isProjectPublished(project: PortfolioProject): boolean {
  return project.isPublished && project.status === ProjectStatus.PUBLISHED;
}

/**
 * Проверяет, является ли проект избранным
 */
export function isProjectFeatured(project: PortfolioProject): boolean {
  return project.isFeatured && isProjectPublished(project);
}
