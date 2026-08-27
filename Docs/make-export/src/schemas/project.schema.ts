/**
 * Zod схемы для валидации проектов портфолио
 * @file project.schema.ts
 * @created 2026-03-01
 * 
 * ВАЖНО: Для использования установите zod:
 * npm install zod
 */

import { z } from 'zod';
import { ProjectCategory, ProjectStatus, FIELD_LIMITS } from '../types/project.types';

// ==================== BASE SCHEMAS ====================

/**
 * Схема для URL с валидацией
 */
const urlSchema = z.string().url({ message: 'Некорректный URL' });

/**
 * Схема для slug
 */
const slugSchema = z
  .string()
  .min(1, 'Slug обязателен')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug может содержать только строчные буквы, цифры и дефисы',
  });

/**
 * Схема для года
 */
const yearSchema = z
  .string()
  .regex(/^\d{4}$/, 'Год должен быть в формате YYYY')
  .refine(
    (year) => {
      const y = parseInt(year);
      return y >= 2000 && y <= 2100;
    },
    { message: 'Год должен быть между 2000 и 2100' }
  );

// ==================== TESTIMONIAL SCHEMA ====================

/**
 * Схема для отзыва клиента
 */
export const testimonialSchema = z.object({
  quote: z
    .string()
    .min(FIELD_LIMITS.TESTIMONIAL_QUOTE_MIN, `Минимум ${FIELD_LIMITS.TESTIMONIAL_QUOTE_MIN} символов`)
    .max(FIELD_LIMITS.TESTIMONIAL_QUOTE_MAX, `Максимум ${FIELD_LIMITS.TESTIMONIAL_QUOTE_MAX} символов`),
  
  author: z
    .string()
    .min(FIELD_LIMITS.TESTIMONIAL_AUTHOR_MIN, `Минимум ${FIELD_LIMITS.TESTIMONIAL_AUTHOR_MIN} символа`)
    .max(FIELD_LIMITS.TESTIMONIAL_AUTHOR_MAX, `Максимум ${FIELD_LIMITS.TESTIMONIAL_AUTHOR_MAX} символов`),
  
  position: z
    .string()
    .min(FIELD_LIMITS.TESTIMONIAL_POSITION_MIN, `Минимум ${FIELD_LIMITS.TESTIMONIAL_POSITION_MIN} символа`)
    .max(FIELD_LIMITS.TESTIMONIAL_POSITION_MAX, `Максимум ${FIELD_LIMITS.TESTIMONIAL_POSITION_MAX} символов`),
  
  avatar: urlSchema.optional(),
});

// ==================== SEO SCHEMA ====================

/**
 * Схема для SEO метаданных
 */
export const seoSchema = z.object({
  metaTitle: z
    .string()
    .max(FIELD_LIMITS.SEO_META_TITLE_MAX, `Максимум ${FIELD_LIMITS.SEO_META_TITLE_MAX} символов`)
    .optional(),
  
  metaDescription: z
    .string()
    .min(FIELD_LIMITS.SEO_META_DESCRIPTION_MIN, `Минимум ${FIELD_LIMITS.SEO_META_DESCRIPTION_MIN} символов`)
    .max(FIELD_LIMITS.SEO_META_DESCRIPTION_MAX, `Максимум ${FIELD_LIMITS.SEO_META_DESCRIPTION_MAX} символов`),
  
  keywords: z
    .array(z.string().min(1, 'Ключевое слово не может быть пустым'))
    .max(FIELD_LIMITS.SEO_KEYWORDS_MAX, `Максимум ${FIELD_LIMITS.SEO_KEYWORDS_MAX} ключевых слов`),
  
  ogImage: urlSchema.optional(),
  
  canonicalUrl: urlSchema.optional(),
});

// ==================== MAIN PROJECT SCHEMA ====================

/**
 * Полная схема проекта портфолио
 */
export const projectSchema = z.object({
  // === ИДЕНТИФИКАЦИЯ ===
  id: z.number().int().positive().optional(),
  
  slug: slugSchema,

  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  title: z
    .string()
    .min(FIELD_LIMITS.TITLE_MIN, `Минимум ${FIELD_LIMITS.TITLE_MIN} символа`)
    .max(FIELD_LIMITS.TITLE_MAX, `Максимум ${FIELD_LIMITS.TITLE_MAX} символов`),
  
  category: z.nativeEnum(ProjectCategory, {
    errorMap: () => ({ message: 'Выберите категорию из списка' }),
  }),
  
  description: z
    .string()
    .min(FIELD_LIMITS.DESCRIPTION_MIN, `Минимум ${FIELD_LIMITS.DESCRIPTION_MIN} символов`)
    .max(FIELD_LIMITS.DESCRIPTION_MAX, `Максимум ${FIELD_LIMITS.DESCRIPTION_MAX} символов`),
  
  overview: z
    .string()
    .min(FIELD_LIMITS.OVERVIEW_MIN, `Минимум ${FIELD_LIMITS.OVERVIEW_MIN} символов`)
    .max(FIELD_LIMITS.OVERVIEW_MAX, `Максимум ${FIELD_LIMITS.OVERVIEW_MAX} символов`),

  // === ИЗОБРАЖЕНИЯ ===
  thumbnailImage: urlSchema,
  
  heroImage: urlSchema,
  
  images: z
    .array(urlSchema)
    .max(FIELD_LIMITS.IMAGES_MAX, `Максимум ${FIELD_LIMITS.IMAGES_MAX} изображений`),

  // === ТЕГИ И МЕТАДАННЫЕ ===
  tags: z
    .array(z.string().min(1, 'Тег не может быть пустым'))
    .min(FIELD_LIMITS.TAGS_MIN, `Минимум ${FIELD_LIMITS.TAGS_MIN} тег`)
    .max(FIELD_LIMITS.TAGS_MAX, `Максимум ${FIELD_LIMITS.TAGS_MAX} тегов`),
  
  technologies: z
    .array(z.string().min(1, 'Технология не может быть пустой'))
    .min(FIELD_LIMITS.TECHNOLOGIES_MIN, `Минимум ${FIELD_LIMITS.TECHNOLOGIES_MIN} технология`)
    .max(FIELD_LIMITS.TECHNOLOGIES_MAX, `Максимум ${FIELD_LIMITS.TECHNOLOGIES_MAX} технологий`),

  // === ИНФОРМАЦИЯ О КЛИЕНТЕ ===
  client: z
    .string()
    .min(1, 'Название клиента обязательно')
    .max(FIELD_LIMITS.CLIENT_MAX, `Максимум ${FIELD_LIMITS.CLIENT_MAX} символов`),
  
  year: yearSchema,
  
  duration: z.string().min(1, 'Укажите продолжительность'),

  // === ДЕТАЛИ ПРОЕКТА ===
  challenge: z
    .string()
    .min(FIELD_LIMITS.CHALLENGE_MIN, `Минимум ${FIELD_LIMITS.CHALLENGE_MIN} символов`)
    .max(FIELD_LIMITS.CHALLENGE_MAX, `Максимум ${FIELD_LIMITS.CHALLENGE_MAX} символов`),
  
  solution: z
    .string()
    .min(FIELD_LIMITS.SOLUTION_MIN, `Минимум ${FIELD_LIMITS.SOLUTION_MIN} символов`)
    .max(FIELD_LIMITS.SOLUTION_MAX, `Максимум ${FIELD_LIMITS.SOLUTION_MAX} символов`),
  
  results: z
    .array(z.string().min(1, 'Результат не может быть пустым'))
    .min(FIELD_LIMITS.RESULTS_MIN, `Минимум ${FIELD_LIMITS.RESULTS_MIN} результата`)
    .max(FIELD_LIMITS.RESULTS_MAX, `Максимум ${FIELD_LIMITS.RESULTS_MAX} результатов`),

  // === ОТЗЫВ ===
  testimonial: testimonialSchema.optional(),

  // === ССЫЛКИ ===
  liveUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  figmaUrl: urlSchema.optional(),
  caseStudyUrl: urlSchema.optional(),

  // === СТАТУС И ПУБЛИКАЦИЯ ===
  status: z.nativeEnum(ProjectStatus, {
    errorMap: () => ({ message: 'Выберите статус из списка' }),
  }),
  
  isPublished: z.boolean(),
  
  isFeatured: z.boolean(),
  
  order: z.number().int().min(0, 'Порядок не может быть отрицательным'),
  
  publishedAt: z.date().optional(),

  // === ВРЕМЕННЫЕ МЕТКИ ===
  createdAt: z.date(),
  
  updatedAt: z.date(),

  // === SEO ===
  seo: seoSchema,
});

// ==================== CREATE/UPDATE SCHEMAS ====================

/**
 * Схема для создания нового проекта
 */
export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Схема для обновления проекта
 */
export const updateProjectSchema = projectSchema
  .omit({
    createdAt: true,
  })
  .partial()
  .required({ id: true });

/**
 * Схема для частичного обновления
 */
export const patchProjectSchema = z
  .object({
    id: z.number().int().positive(),
  })
  .and(projectSchema.partial());

// ==================== FILTER SCHEMAS ====================

/**
 * Схема для фильтров списка проектов
 */
export const projectFiltersSchema = z.object({
  category: z.nativeEnum(ProjectCategory).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
});

/**
 * Схема для сортировки
 */
export const projectSortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
});

/**
 * Схема для пагинации
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
});

// ==================== TYPE INFERENCE ====================

export type ProjectSchemaType = z.infer<typeof projectSchema>;
export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
export type PatchProjectSchemaType = z.infer<typeof patchProjectSchema>;
export type ProjectFiltersSchemaType = z.infer<typeof projectFiltersSchema>;
export type ProjectSortSchemaType = z.infer<typeof projectSortSchema>;
export type PaginationSchemaType = z.infer<typeof paginationSchema>;

// ==================== VALIDATION HELPERS ====================

/**
 * Валидирует проект и возвращает результат
 */
export function validateProject(data: unknown) {
  return projectSchema.safeParse(data);
}

/**
 * Валидирует данные для создания проекта
 */
export function validateCreateProject(data: unknown) {
  return createProjectSchema.safeParse(data);
}

/**
 * Валидирует данные для обновления проекта
 */
export function validateUpdateProject(data: unknown) {
  return updateProjectSchema.safeParse(data);
}

/**
 * Валидирует slug
 */
export function validateSlug(slug: string): boolean {
  return slugSchema.safeParse(slug).success;
}

/**
 * Генерирует slug из заголовка
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/--+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}

// ==================== ERROR FORMATTING ====================

/**
 * Форматирует ошибки Zod в читаемый вид
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

/**
 * Форматирует ошибки для отображения в UI
 */
export function formatValidationError(error: z.ZodError): string[] {
  return error.errors.map((err) => {
    const field = err.path.join('.');
    return `${field}: ${err.message}`;
  });
}

// ==================== EXAMPLE USAGE ====================

/**
 * Пример использования валидации
 * 
 * @example
 * ```typescript
 * const projectData = {
 *   title: "My Project",
 *   slug: "my-project",
 *   category: ProjectCategory.WEB_DESIGN,
 *   // ... остальные поля
 * };
 * 
 * const result = validateCreateProject(projectData);
 * 
 * if (result.success) {
 *   // Данные валидны
 *   const validProject = result.data;
 *   console.log("Valid project:", validProject);
 * } else {
 *   // Есть ошибки
 *   const errors = formatZodErrors(result.error);
 *   console.error("Validation errors:", errors);
 * }
 * ```
 */

// ==================== CUSTOM VALIDATIONS ====================

/**
 * Кастомная валидация: проверяет, что publishedAt установлен если isPublished = true
 */
export const projectWithPublishValidation = projectSchema.refine(
  (data) => {
    if (data.isPublished && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Дата публикации обязательна для опубликованных проектов',
    path: ['publishedAt'],
  }
);

/**
 * Кастомная валидация: проверяет, что статус PUBLISHED только если isPublished = true
 */
export const projectWithStatusValidation = projectSchema.refine(
  (data) => {
    if (data.status === ProjectStatus.PUBLISHED && !data.isPublished) {
      return false;
    }
    return true;
  },
  {
    message: 'Статус PUBLISHED требует isPublished = true',
    path: ['status'],
  }
);

/**
 * Комбинированная валидация со всеми проверками
 */
export const projectFullValidation = projectSchema
  .refine(
    (data) => {
      if (data.isPublished && !data.publishedAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Дата публикации обязательна для опубликованных проектов',
      path: ['publishedAt'],
    }
  )
  .refine(
    (data) => {
      if (data.status === ProjectStatus.PUBLISHED && !data.isPublished) {
        return false;
      }
      return true;
    },
    {
      message: 'Статус PUBLISHED требует isPublished = true',
      path: ['status'],
    }
  );
