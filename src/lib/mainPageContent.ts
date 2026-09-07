// Main Page Content — редактируемые поля главной страницы дизайнера (/u/[slug]).
// Спека: Docs/specs/Main Page Admin Panel Fields.md (Sections 01–05).
// Хранение: JSON-колонка profiles.main_page_content. Отсутствующие/нулевые
// значения дополняются дефолтами через normalizeMainPageContent().

export type HeroContent = {
  /** hero_heading_line1 */
  headingLine1: string;
  /** hero_heading_accent (градиентный акцент) */
  headingAccent: string;
  /** продолжение заголовка после акцента */
  headingLine2: string;
  /** hero_description */
  description: string;
  /** hero_cta_primary_label / hero_cta_primary_url */
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  /** hero_cta_secondary_label / hero_cta_secondary_url */
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
};

export type PortfolioContent = {
  /** portfolio_title */
  title: string;
  /** portfolio_subtitle */
  subtitle: string;
  /** portfolio_cta_label / portfolio_cta_url («View All Projects») */
  ctaLabel: string;
  ctaUrl: string;
};

export type AboutContent = {
  /** about_heading */
  heading: string;
  /** about_paragraph_1..3 */
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  /** about_process_image — fileId из R2 (files.id) */
  processImageFileId: string | null;
};

export type ExpertiseContent = {
  /** expertise_skills_label */
  skillsLabel: string;
  /** expertise_skills */
  skills: string[];
  /** expertise_tools_label */
  toolsLabel: string;
  /** expertise_tools */
  tools: string[];
  /** expertise_process_label */
  processLabel: string;
  /** expertise_process_steps */
  processSteps: string[];
  /** expertise_probono_text / _cta_label / _cta_url */
  proBonoText: string;
  proBonoCtaLabel: string;
  proBonoCtaUrl: string;
};

export type CtaContent = {
  /** cta_heading */
  heading: string;
  /** cta_description_1 / cta_description_2 */
  description1: string;
  description2: string;
  /** cta_email_label / cta_email_address */
  emailLabel: string;
  emailAddress: string;
  /** cta_whatsapp_label / cta_whatsapp_url */
  whatsappLabel: string;
  whatsappUrl: string;
};

export type MainPageContent = {
  hero: HeroContent;
  portfolio: PortfolioContent;
  about: AboutContent;
  expertise: ExpertiseContent;
  cta: CtaContent;
};

export const DEFAULT_MAIN_PAGE_CONTENT: MainPageContent = {
  hero: {
    headingLine1: 'I design for the moment',
    headingAccent: 'when everything',
    headingLine2: 'just clicks',
    description:
      'A psychology degree and 10 years learning how great environments shape human decisions.',
    ctaPrimaryLabel: 'View case studies',
    ctaPrimaryUrl: '#portfolio',
    ctaSecondaryLabel: 'Get in touch',
    ctaSecondaryUrl: '#contact',
  },
  portfolio: {
    title: 'Portfolio',
    subtitle: 'Explore my work in web design, UX Research and digital products',
    ctaLabel: 'View All Projects',
    ctaUrl: '',
  },
  about: {
    heading: 'People-centered design begins with real curiosity',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    processImageFileId: null,
  },
  expertise: {
    skillsLabel: 'Areas of expertise',
    skills: [
      'UX Research',
      'Wireframing',
      'Prototyping',
      'Figma Handoff',
      'Web Design',
      'Mobile Apps',
      'Landing Pages',
      'Psychology-led UX',
      'Design Engineering',
      'Design-to-code workflow',
    ],
    toolsLabel: 'Tools',
    tools: [
      'Figma',
      'FigJam',
      'Maze',
      'Protopie',
      'Webflow',
      'Adobe Firefly',
      'Cursor',
      'VS Code',
      'Github',
    ],
    processLabel: 'My process',
    processSteps: ['Empathize', 'Define', 'Ideate', 'Prototype', 'Test'],
    proBonoText:
      'Open to pro bono projects for NGOs — a great way to create real impact together while building meaningful portfolio cases.',
    proBonoCtaLabel: 'Get in touch',
    proBonoCtaUrl: '#contact',
  },
  cta: {
    heading: 'Get in touch',
    description1: 'We answer emails fast.',
    description2: 'Pro bono spots available.',
    emailLabel: 'Send an email',
    emailAddress: 'hello@ux42.studio',
    whatsappLabel: 'WhatsApp',
    whatsappUrl: '',
  },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const str = (v: unknown, fallback: string): string =>
  typeof v === 'string' ? v : fallback;

const strArr = (v: unknown, fallback: string[]): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : fallback;

const strOrNull = (v: unknown, fallback: string | null): string | null =>
  typeof v === 'string' && v.length > 0 ? v : fallback;

/** Дополняет неполный/битый JSON из БД дефолтами (null-safe). */
export function normalizeMainPageContent(
  raw: unknown,
  bioParagraphs: string[] = [],
): MainPageContent {
  const d = DEFAULT_MAIN_PAGE_CONTENT;
  const src = (raw ?? {}) as DeepPartial<MainPageContent>;

  const paragraphs = [
    str(src.about?.paragraph1, ''),
    str(src.about?.paragraph2, ''),
    str(src.about?.paragraph3, ''),
  ];
  // Fallback: если абзацы About не заданы — используем bio (текущее поведение).
  const hasParagraphs = paragraphs.some((p) => p.length > 0);

  return {
    hero: {
      headingLine1: str(src.hero?.headingLine1, d.hero.headingLine1),
      headingAccent: str(src.hero?.headingAccent, d.hero.headingAccent),
      headingLine2: str(src.hero?.headingLine2, d.hero.headingLine2),
      description: str(src.hero?.description, d.hero.description),
      ctaPrimaryLabel: str(src.hero?.ctaPrimaryLabel, d.hero.ctaPrimaryLabel),
      ctaPrimaryUrl: str(src.hero?.ctaPrimaryUrl, d.hero.ctaPrimaryUrl),
      ctaSecondaryLabel: str(src.hero?.ctaSecondaryLabel, d.hero.ctaSecondaryLabel),
      ctaSecondaryUrl: str(src.hero?.ctaSecondaryUrl, d.hero.ctaSecondaryUrl),
    },
    portfolio: {
      title: str(src.portfolio?.title, d.portfolio.title),
      subtitle: str(src.portfolio?.subtitle, d.portfolio.subtitle),
      ctaLabel: str(src.portfolio?.ctaLabel, d.portfolio.ctaLabel),
      ctaUrl: str(src.portfolio?.ctaUrl, d.portfolio.ctaUrl),
    },
    about: {
      heading: str(src.about?.heading, d.about.heading),
      paragraph1: hasParagraphs ? paragraphs[0] : (bioParagraphs[0] ?? ''),
      paragraph2: hasParagraphs ? paragraphs[1] : (bioParagraphs[1] ?? ''),
      paragraph3: hasParagraphs ? paragraphs[2] : (bioParagraphs[2] ?? ''),
      processImageFileId: strOrNull(
        src.about?.processImageFileId,
        d.about.processImageFileId,
      ),
    },
    expertise: {
      skillsLabel: str(src.expertise?.skillsLabel, d.expertise.skillsLabel),
      skills: strArr(src.expertise?.skills, d.expertise.skills),
      toolsLabel: str(src.expertise?.toolsLabel, d.expertise.toolsLabel),
      tools: strArr(src.expertise?.tools, d.expertise.tools),
      processLabel: str(src.expertise?.processLabel, d.expertise.processLabel),
      processSteps: strArr(src.expertise?.processSteps, d.expertise.processSteps),
      proBonoText: str(src.expertise?.proBonoText, d.expertise.proBonoText),
      proBonoCtaLabel: str(src.expertise?.proBonoCtaLabel, d.expertise.proBonoCtaLabel),
      proBonoCtaUrl: str(src.expertise?.proBonoCtaUrl, d.expertise.proBonoCtaUrl),
    },
    cta: {
      heading: str(src.cta?.heading, d.cta.heading),
      description1: str(src.cta?.description1, d.cta.description1),
      description2: str(src.cta?.description2, d.cta.description2),
      emailLabel: str(src.cta?.emailLabel, d.cta.emailLabel),
      emailAddress: str(src.cta?.emailAddress, d.cta.emailAddress),
      whatsappLabel: str(src.cta?.whatsappLabel, d.cta.whatsappLabel),
      whatsappUrl: str(src.cta?.whatsappUrl, d.cta.whatsappUrl),
    },
  };
}