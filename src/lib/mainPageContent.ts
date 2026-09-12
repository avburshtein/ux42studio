// Main Page Content — редактируемые поля главной страницы дизайнера (/u/[slug]).
// Спека: Docs/specs/Main Page Admin Panel Fields.md (Sections 01–05).
// Хранение: JSON-колонка profiles.main_page_content. Отсутствующие/нулевые
// значения дополняются дефолтами через normalizeMainPageContent().

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';

export type ProcessStep = {
  title: string;
  description: string;
};

export type HeroContent = {
  /** Показ блока на странице */
  visible: boolean;
  /** Декоративные Floating Elements (bokeh) */
  floatingElements: boolean;
  /** hero_heading_line1 */
  headingLine1: string;
  /** hero_heading_accent (градиентный акцент) */
  headingAccent: string;
  /** продолжение заголовка после акцента */
  headingLine2: string;
  /** hero_description */
  description: string;
  /** hero_cta_primary_label / _url / вариант кнопки */
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaPrimaryVariant: ButtonVariant;
  /** hero_cta_secondary_label / _url / вариант кнопки */
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  ctaSecondaryVariant: ButtonVariant;
};

export type PortfolioContent = {
  visible: boolean;
  /** portfolio_title */
  title: string;
  /** portfolio_subtitle */
  subtitle: string;
  /** portfolio_cta_label / portfolio_cta_url («View All Projects») */
  ctaLabel: string;
  ctaUrl: string;
  ctaVariant: ButtonVariant;
};

export type AboutContent = {
  visible: boolean;
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
  visible: boolean;
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
  /** expertise_process_steps — этапы работы: заголовок + описание */
  processSteps: ProcessStep[];
  /** expertise_probono_text / _cta_label / _cta_url / вариант кнопки / видимость */
  proBonoVisible: boolean;
  proBonoText: string;
  proBonoCtaLabel: string;
  proBonoCtaUrl: string;
  proBonoCtaVariant: ButtonVariant;
};

export type CtaContent = {
  visible: boolean;
  /** Декоративные Floating Elements (bokeh) */
  floatingElements: boolean;
  /** cta_heading */
  heading: string;
  /** cta_description_1 / cta_description_2 */
  description1: string;
  description2: string;
  /** cta_email_label / cta_email_address / вариант кнопки */
  emailLabel: string;
  emailAddress: string;
  emailVariant: ButtonVariant;
  /** cta_whatsapp_label / cta_whatsapp_url / вариант кнопки */
  whatsappLabel: string;
  whatsappUrl: string;
  whatsappVariant: ButtonVariant;
};

/** Настройки цветовой темы: seed-цвет → M3-схема (src/lib/theme.ts). */
export type ThemeSettings = {
  /** false = дефолтная тема globals.css («как есть») */
  useCustomTheme: boolean;
  /** Seed-цвет HEX (#RRGGBB) */
  seedColor: string;
};

/** Стиль плавающих элементов. null/default = как есть. */
export type FloatingStyle = {
  /** HEX или null (палитра по умолчанию) */
  color: string | null;
  /** 'default' = круг/квадрат/треугольник случайно */
  shape: 'default' | 'circle' | 'square' | 'triangle';
};

export type MainPageContent = {
  hero: HeroContent;
  portfolio: PortfolioContent;
  about: AboutContent;
  expertise: ExpertiseContent;
  cta: CtaContent;
  /** Цветовая тема (пункт 4, решение 7) */
  theme: ThemeSettings;
  /** Цвет/форма плавающих элементов */
  floating: FloatingStyle;
};

export const DEFAULT_MAIN_PAGE_CONTENT: MainPageContent = {
  hero: {
    visible: true,
    floatingElements: true,
    headingLine1: 'I design for the moment',
    headingAccent: 'when everything',
    headingLine2: 'just clicks',
    description:
      'A psychology degree and 10 years learning how great environments shape human decisions.',
    ctaPrimaryLabel: 'View case studies',
    ctaPrimaryUrl: '#portfolio',
    ctaPrimaryVariant: 'primary',
    ctaSecondaryLabel: 'Get in touch',
    ctaSecondaryUrl: '#contact',
    ctaSecondaryVariant: 'secondary',
  },
  portfolio: {
    visible: true,
    title: 'Portfolio',
    subtitle: 'Explore my work in web design, UX Research and digital products',
    ctaLabel: 'View All Projects',
    ctaUrl: '',
    ctaVariant: 'primary',
  },
  about: {
    visible: true,
    heading: 'People-centered design begins with real curiosity',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    processImageFileId: null,
  },
  expertise: {
    visible: true,
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
    processSteps: [
      {
        title: 'Research & Insight',
        description:
          'I start by understanding the problem, users, and business context through interviews and competitive analysis.',
      },
      {
        title: 'Wireframe & Structure',
        description:
          'I create low-fidelity wireframes and information architecture to map the user journey.',
      },
      {
        title: 'Prototype & Test',
        description:
          'I build interactive prototypes and test with real users to validate assumptions and refine the experience.',
      },
      {
        title: 'Handoff & Support',
        description:
          'I deliver production-ready designs with detailed specs and support developers through implementation.',
      },
    ],
    proBonoVisible: false,
    proBonoText:
      'Open to pro bono projects for NGOs — a great way to create real impact together while building meaningful portfolio cases.',
    proBonoCtaLabel: 'Get in touch',
    proBonoCtaUrl: '#contact',
    proBonoCtaVariant: 'primary',
  },
  cta: {
    visible: true,
    floatingElements: true,
    heading: 'Get in touch',
    description1: 'We answer emails fast.',
    description2: 'Pro bono spots available.',
    emailLabel: 'Send an email',
    emailAddress: 'hello@ux42.studio',
    emailVariant: 'primary',
    whatsappLabel: 'WhatsApp',
    whatsappUrl: '',
    whatsappVariant: 'secondary',
  },
  theme: {
    useCustomTheme: false,
    seedColor: '#0b6e4f',
  },
  floating: {
    color: null,
    shape: 'default',
  },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const str = (v: unknown, fallback: string): string =>
  typeof v === 'string' ? v : fallback;

const strArr = (v: unknown, fallback: string[]): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : fallback;

const strOrNull = (v: unknown, fallback: string | null): string | null =>
  typeof v === 'string' && v.length > 0 ? v : fallback;

const bool = (v: unknown, fallback = true): boolean =>
  typeof v === 'boolean' ? v : fallback;

const VARIANT_VALUES: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'link'];
const variant = (v: unknown, fallback: ButtonVariant): ButtonVariant =>
  VARIANT_VALUES.includes(v as ButtonVariant) ? (v as ButtonVariant) : fallback;

const steps = (v: unknown, fallback: ProcessStep[]): ProcessStep[] =>
  Array.isArray(v)
    ? v.map((s) => ({
        title: str((s as ProcessStep)?.title, ''),
        description: str((s as ProcessStep)?.description, ''),
      }))
    : fallback;

const SHAPES = ['default', 'circle', 'square', 'triangle'] as const;
const shape = (v: unknown): FloatingStyle['shape'] =>
  SHAPES.includes(v as FloatingStyle['shape'])
    ? (v as FloatingStyle['shape'])
    : 'default';

const hexOrNull = (v: unknown): string | null =>
  typeof v === 'string' && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(v.trim())
    ? v.trim()
    : null;

const hex = (v: unknown, fallback: string): string =>
  hexOrNull(v) ?? fallback;

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
      visible: bool(src.hero?.visible),
      floatingElements: bool(src.hero?.floatingElements),
      headingLine1: str(src.hero?.headingLine1, d.hero.headingLine1),
      headingAccent: str(src.hero?.headingAccent, d.hero.headingAccent),
      headingLine2: str(src.hero?.headingLine2, d.hero.headingLine2),
      description: str(src.hero?.description, d.hero.description),
      ctaPrimaryLabel: str(src.hero?.ctaPrimaryLabel, d.hero.ctaPrimaryLabel),
      ctaPrimaryUrl: str(src.hero?.ctaPrimaryUrl, d.hero.ctaPrimaryUrl),
      ctaPrimaryVariant: variant(src.hero?.ctaPrimaryVariant, d.hero.ctaPrimaryVariant),
      ctaSecondaryLabel: str(src.hero?.ctaSecondaryLabel, d.hero.ctaSecondaryLabel),
      ctaSecondaryUrl: str(src.hero?.ctaSecondaryUrl, d.hero.ctaSecondaryUrl),
      ctaSecondaryVariant: variant(src.hero?.ctaSecondaryVariant, d.hero.ctaSecondaryVariant),
    },
    portfolio: {
      visible: bool(src.portfolio?.visible),
      title: str(src.portfolio?.title, d.portfolio.title),
      subtitle: str(src.portfolio?.subtitle, d.portfolio.subtitle),
      ctaLabel: str(src.portfolio?.ctaLabel, d.portfolio.ctaLabel),
      ctaUrl: str(src.portfolio?.ctaUrl, d.portfolio.ctaUrl),
      ctaVariant: variant(src.portfolio?.ctaVariant, d.portfolio.ctaVariant),
    },
    about: {
      visible: bool(src.about?.visible),
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
      visible: bool(src.expertise?.visible),
      skillsLabel: str(src.expertise?.skillsLabel, d.expertise.skillsLabel),
      skills: strArr(src.expertise?.skills, d.expertise.skills),
      toolsLabel: str(src.expertise?.toolsLabel, d.expertise.toolsLabel),
      tools: strArr(src.expertise?.tools, d.expertise.tools),
      processLabel: str(src.expertise?.processLabel, d.expertise.processLabel),
      processSteps: steps(src.expertise?.processSteps, d.expertise.processSteps),
      proBonoVisible: bool(src.expertise?.proBonoVisible, false),
      proBonoText: str(src.expertise?.proBonoText, d.expertise.proBonoText),
      proBonoCtaLabel: str(src.expertise?.proBonoCtaLabel, d.expertise.proBonoCtaLabel),
      proBonoCtaUrl: str(src.expertise?.proBonoCtaUrl, d.expertise.proBonoCtaUrl),
      proBonoCtaVariant: variant(src.expertise?.proBonoCtaVariant, d.expertise.proBonoCtaVariant),
    },
    cta: {
      visible: bool(src.cta?.visible),
      floatingElements: bool(src.cta?.floatingElements),
      heading: str(src.cta?.heading, d.cta.heading),
      description1: str(src.cta?.description1, d.cta.description1),
      description2: str(src.cta?.description2, d.cta.description2),
      emailLabel: str(src.cta?.emailLabel, d.cta.emailLabel),
      emailAddress: str(src.cta?.emailAddress, d.cta.emailAddress),
      emailVariant: variant(src.cta?.emailVariant, d.cta.emailVariant),
      whatsappLabel: str(src.cta?.whatsappLabel, d.cta.whatsappLabel),
      whatsappUrl: str(src.cta?.whatsappUrl, d.cta.whatsappUrl),
      whatsappVariant: variant(src.cta?.whatsappVariant, d.cta.whatsappVariant),
    },
    theme: {
      useCustomTheme: bool(src.theme?.useCustomTheme, false),
      seedColor: hex(src.theme?.seedColor, d.theme.seedColor),
    },
    floating: {
      color: hexOrNull(src.floating?.color),
      shape: shape(src.floating?.shape),
    },
  };
}