export interface StoredProject {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  devices: string;
  client: string;
  year: string;
  duration: string;
  role: string;
  constraints: string;
  heroImage: string;
  prototypeUrl: string;
  lofiUrl: string;
  overview: string;
  problemStatement: string;
  projectPurpose: string;
  challenge: string;
  targetUsers: string;
  researchMethods: string;
  researchStats: { value: string; label: string }[];
  persona: { name: string; description: string; userStory: string };
  designApproach: string;
  wireframeImage: string;
  testingDetails: string;
  beforeAfter: { label: string; before: string; after: string }[];
  showcaseImages: string[];
  showcaseDescription: string;
  results: string[];
  technologies: string[];
  lessonsLearned: string;
  nextSteps: string[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialPosition: string;
  tags: string[];
  createdAt: string;
  colorTokens: { token: string; value: string; role: string }[];
  typographyScale: { name: string; font: string; size: string; weight: string; sample: string }[];
  moodboardImages: string[];
  moodboardCaption: string;
}

const STORAGE_KEY = 'ux42_projects';

export function getStoredProjects(): StoredProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProject(project: StoredProject): void {
  const projects = getStoredProjects();
  const existingIndex = projects.findIndex(p => p.slug === project.slug);
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.unshift(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(slug: string): void {
  const projects = getStoredProjects().filter(p => p.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjectBySlug(slug: string): StoredProject | null {
  return getStoredProjects().find(p => p.slug === slug) ?? null;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
