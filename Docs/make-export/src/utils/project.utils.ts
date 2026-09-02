/**
 * Утилиты для работы с проектами портфолио
 * @file project.utils.ts
 * @created 2026-03-01
 */

import type {
  PortfolioProject,
  ProjectCategory,
  ProjectStatus,
  ProjectGalleryItem,
  ProjectFilters,
  ProjectSortOptions,
  CreateProjectInput,
  UpdateProjectInput,
} from '../types/project.types';

import {
  DEFAULT_PROJECT_VALUES,
  isProjectPublished,
  isProjectFeatured,
} from '../types/project.types';

// ==================== GENERATION ====================

/**
 * Генерирует slug из заголовка
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/--+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}

/**
 * Генерирует SEO заголовок из названия проекта
 */
export function generateSEOTitle(title: string, category?: string): string {
  const parts = [title];
  if (category) {
    parts.push(category);
  }
  parts.push('Case Study', 'Portfolio');
  return parts.join(' | ');
}

/**
 * Генерирует SEO описание из краткого описания
 */
export function generateSEODescription(
  description: string,
  client?: string
): string {
  const maxLength = 160;
  let result = description;
  
  if (client) {
    result = `${client} case study: ${description}`;
  }
  
  if (result.length > maxLength) {
    result = result.substring(0, maxLength - 3) + '...';
  }
  
  return result;
}

/**
 * Извлекает ключевые слова из текста
 */
export function extractKeywords(
  text: string,
  maxKeywords: number = 10
): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));
  
  const frequency = new Map<string, number>();
  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  const sorted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
  
  return sorted.slice(0, maxKeywords);
}

// ==================== FORMATTING ====================

/**
 * Форматирует дату в читаемый вид
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Не указано';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Форматирует относительную дату
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дней назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`;
  
  return `${Math.floor(diffDays / 365)} лет назад`;
}

/**
 * Форматирует статус для отображения
 */
export function formatStatus(status: ProjectStatus): string {
  const statusMap: Record<ProjectStatus, string> = {
    draft: 'Черновик',
    in_review: 'На проверке',
    published: 'Опубликован',
    archived: 'Архивирован',
  };
  
  return statusMap[status];
}

/**
 * Получает цвет badge для статуса
 */
export function getStatusColor(status: ProjectStatus): string {
  const colorMap: Record<ProjectStatus, string> = {
    draft: 'gray',
    in_review: 'yellow',
    published: 'green',
    archived: 'red',
  };
  
  return colorMap[status];
}

/**
 * Форматирует категорию для URL
 */
export function formatCategoryForUrl(category: ProjectCategory): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

// ==================== FILTERING ====================

/**
 * Фильтрует проекты по критериям
 */
export function filterProjects(
  projects: PortfolioProject[],
  filters: ProjectFilters
): PortfolioProject[] {
  return projects.filter((project) => {
    // Фильтр по категории
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    
    // Фильтр по статусу
    if (filters.status && project.status !== filters.status) {
      return false;
    }
    
    // Фильтр по публикации
    if (filters.isPublished !== undefined && project.isPublished !== filters.isPublished) {
      return false;
    }
    
    // Фильтр по избранным
    if (filters.isFeatured !== undefined && project.isFeatured !== filters.isFeatured) {
      return false;
    }
    
    // Поиск по тексту
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableFields = [
        project.title,
        project.description,
        project.overview,
        project.client,
        ...project.tags,
        ...project.technologies,
      ].map((field) => field.toLowerCase());
      
      const found = searchableFields.some((field) =>
        field.includes(searchLower)
      );
      
      if (!found) return false;
    }
    
    return true;
  });
}

/**
 * Сортирует проекты
 */
export function sortProjects(
  projects: PortfolioProject[],
  sort: ProjectSortOptions
): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    
    if (aValue === bValue) return 0;
    
    let comparison = 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    }
    
    return sort.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Получает только опубликованные проекты
 */
export function getPublishedProjects(
  projects: PortfolioProject[]
): PortfolioProject[] {
  return projects.filter(isProjectPublished);
}

/**
 * Получает только избранные проекты
 */
export function getFeaturedProjects(
  projects: PortfolioProject[]
): PortfolioProject[] {
  return projects.filter(isProjectFeatured);
}

/**
 * Получает проекты по категории
 */
export function getProjectsByCategory(
  projects: PortfolioProject[],
  category: ProjectCategory
): PortfolioProject[] {
  return projects.filter((project) => project.category === category);
}

// ==================== TRANSFORMATION ====================

/**
 * Преобразует полный проект в краткую версию для галереи
 */
export function toGalleryItem(project: PortfolioProject): ProjectGalleryItem {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    description: project.description,
    thumbnailImage: project.thumbnailImage,
    tags: project.tags,
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
    order: project.order,
  };
}

/**
 * Преобразует массив проектов в краткие версии
 */
export function toGalleryItems(
  projects: PortfolioProject[]
): ProjectGalleryItem[] {
  return projects.map(toGalleryItem);
}

/**
 * Создает объект для создания проекта с дефолтными значениями
 */
export function createProjectTemplate(): Partial<CreateProjectInput> {
  return {
    ...DEFAULT_PROJECT_VALUES,
    year: new Date().getFullYear().toString(),
    slug: '',
    title: '',
    description: '',
    overview: '',
    thumbnailImage: '',
    heroImage: '',
    client: '',
    duration: '',
    challenge: '',
    solution: '',
  };
}

// ==================== STATISTICS ====================

/**
 * Получает статистику проектов
 */
export function getProjectStats(projects: PortfolioProject[]) {
  return {
    total: projects.length,
    published: projects.filter((p) => p.isPublished).length,
    featured: projects.filter((p) => p.isFeatured).length,
    draft: projects.filter((p) => p.status === 'draft').length,
    byCategory: getProjectCountByCategory(projects),
  };
}

/**
 * Получает количество проектов по категориям
 */
export function getProjectCountByCategory(
  projects: PortfolioProject[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  
  projects.forEach((project) => {
    counts[project.category] = (counts[project.category] || 0) + 1;
  });
  
  return counts;
}

/**
 * Получает самые популярные теги
 */
export function getPopularTags(
  projects: PortfolioProject[],
  limit: number = 10
): Array<{ tag: string; count: number }> {
  const tagCounts = new Map<string, number>();
  
  projects.forEach((project) => {
    project.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Получает самые популярные технологии
 */
export function getPopularTechnologies(
  projects: PortfolioProject[],
  limit: number = 10
): Array<{ tech: string; count: number }> {
  const techCounts = new Map<string, number>();
  
  projects.forEach((project) => {
    project.technologies.forEach((tech) => {
      techCounts.set(tech, (techCounts.get(tech) || 0) + 1);
    });
  });
  
  return Array.from(techCounts.entries())
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ==================== NAVIGATION ====================

/**
 * Получает соседние проекты (предыдущий и следующий)
 */
export function getAdjacentProjects(
  projects: PortfolioProject[],
  currentId: number
): { prev: PortfolioProject | null; next: PortfolioProject | null } {
  const currentIndex = projects.findIndex((p) => p.id === currentId);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? projects[currentIndex - 1] : null,
    next: currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null,
  };
}

/**
 * Получает похожие проекты (по категории и тегам)
 */
export function getSimilarProjects(
  projects: PortfolioProject[],
  currentProject: PortfolioProject,
  limit: number = 3
): PortfolioProject[] {
  const scored = projects
    .filter((p) => p.id !== currentProject.id && isProjectPublished(p))
    .map((project) => {
      let score = 0;
      
      // Совпадение категории
      if (project.category === currentProject.category) {
        score += 10;
      }
      
      // Совпадение тегов
      const commonTags = project.tags.filter((tag) =>
        currentProject.tags.includes(tag)
      );
      score += commonTags.length * 2;
      
      // Совпадение технологий
      const commonTechs = project.technologies.filter((tech) =>
        currentProject.technologies.includes(tech)
      );
      score += commonTechs.length;
      
      return { project, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return scored.map((item) => item.project);
}

// ==================== URL GENERATION ====================

/**
 * Генерирует URL проекта
 */
export function getProjectUrl(project: PortfolioProject | ProjectGalleryItem): string {
  return `/portfolio/${project.slug}`;
}

/**
 * Генерирует URL категории
 */
export function getCategoryUrl(category: ProjectCategory): string {
  return `/portfolio/category/${formatCategoryForUrl(category)}`;
}

/**
 * Генерирует URL для редактирования (админка)
 */
export function getEditProjectUrl(projectId: number): string {
  return `/admin/projects/${projectId}/edit`;
}

// ==================== VALIDATION HELPERS ====================

/**
 * Проверяет, можно ли опубликовать проект
 */
export function canPublish(project: Partial<PortfolioProject>): boolean {
  const requiredFields: Array<keyof PortfolioProject> = [
    'title',
    'slug',
    'category',
    'description',
    'overview',
    'thumbnailImage',
    'heroImage',
    'client',
    'year',
    'duration',
    'challenge',
    'solution',
  ];
  
  return requiredFields.every((field) => {
    const value = project[field];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Получает список недостающих полей для публикации
 */
export function getMissingFieldsForPublish(
  project: Partial<PortfolioProject>
): string[] {
  const requiredFields: Array<keyof PortfolioProject> = [
    'title',
    'slug',
    'category',
    'description',
    'overview',
    'thumbnailImage',
    'heroImage',
    'client',
    'year',
    'duration',
    'challenge',
    'solution',
  ];
  
  const fieldNames: Record<string, string> = {
    title: 'Название',
    slug: 'Slug',
    category: 'Категория',
    description: 'Краткое описание',
    overview: 'Полное описание',
    thumbnailImage: 'Изображение для карточки',
    heroImage: 'Hero изображение',
    client: 'Клиент',
    year: 'Год',
    duration: 'Продолжительность',
    challenge: 'Задача',
    solution: 'Решение',
  };
  
  return requiredFields
    .filter((field) => {
      const value = project[field];
      return value === undefined || value === null || value === '';
    })
    .map((field) => fieldNames[field] || field);
}

// ==================== EXPORT HELPERS ====================

/**
 * Экспортирует проект в JSON
 */
export function exportProjectToJSON(project: PortfolioProject): string {
  return JSON.stringify(project, null, 2);
}

/**
 * Экспортирует проекты в CSV
 */
export function exportProjectsToCSV(projects: PortfolioProject[]): string {
  const headers = [
    'ID',
    'Title',
    'Category',
    'Client',
    'Year',
    'Status',
    'Published',
    'Featured',
  ];
  
  const rows = projects.map((p) => [
    p.id,
    p.title,
    p.category,
    p.client,
    p.year,
    p.status,
    p.isPublished ? 'Yes' : 'No',
    p.isFeatured ? 'Yes' : 'No',
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');
  
  return csvContent;
}
