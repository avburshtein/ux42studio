import { ImageWithFallback } from './figma/ImageWithFallback';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, Mail, Users, Clock, Layers } from 'lucide-react';
import { useModal } from '../contexts/ModalContext';
import { getProjectBySlug, type StoredProject } from '../utils/projectStorage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectData {
  // Original fields
  title: string;
  category: string;
  client: string;
  year: string;
  duration: string;
  heroImage: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  images: string[];
  testimonial?: { quote: string; author: string; position: string };
  // Google UX extended
  tagline?: string;
  devices?: string;
  role?: string;
  constraints?: string;
  prototypeUrl?: string;
  lofiUrl?: string;
  problemStatement?: string;
  projectPurpose?: string;
  targetUsers?: string;
  researchMethods?: string;
  researchStats?: { value: string; label: string }[];
  persona?: { name: string; description: string; userStory: string };
  designApproach?: string;
  wireframeImage?: string;
  testingDetails?: string;
  beforeAfter?: { label: string; before: string; after: string }[];
  showcaseDescription?: string;
  lessonsLearned?: string;
  nextSteps?: string[];
  colorTokens?: { token: string; value: string; role: string }[];
  typographyScale?: { name: string; font: string; size: string; weight: string; sample: string }[];
  moodboardImages?: string[];
  moodboardCaption?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projectData: Record<string, ProjectData> = {
  'modern-ecommerce-platform': {
    title: 'Modern E-commerce Platform',
    category: 'Web Design',
    client: 'TechStore Inc.',
    year: '2024',
    duration: '3 months',
    heroImage: 'https://images.unsplash.com/photo-1763437153598-78b5579ddefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc3MTE4MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    overview: 'A comprehensive e-commerce platform designed to revolutionize online shopping with intuitive UX and seamless checkout.',
    challenge: 'The client needed a scalable platform handling thousands of concurrent users while maintaining fast load times across all devices.',
    solution: 'Custom e-commerce solution with advanced caching, CDN integration, and progressive web app features.',
    results: ['250% increase in conversion rate', '40% reduction in page load time', '95% positive user feedback', '3x mobile traffic growth'],
    technologies: ['Figma', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1661956602116-aa6865609028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWduJTIwZGV0YWlsfGVufDF8fHx8MTc3MTIxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBwcm9kdWN0JTIwcGFnZXxlbnwxfHx8fDE3NzEyMTAxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGNhcnQlMjB1aXxlbnwxfHx8fDE3NzEyMTAxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    testimonial: { quote: 'The team delivered beyond our expectations. Our revenue has tripled since the launch.', author: 'Sarah Johnson', position: 'CEO, TechStore Inc.' },
    tagline: 'Redesigning checkout to eliminate drop-off and build trust.',
    devices: 'Desktop & Mobile Web',
    role: 'End-to-End UX/UI Designer — Research, IA, Wireframing, Prototyping, Handoff',
    constraints: 'Existing backend constraints, multi-currency requirements, WCAG 2.1 AA compliance.',
    prototypeUrl: 'https://figma.com',
    lofiUrl: 'https://figma.com',
    problemStatement: 'The existing checkout had a 74% abandonment rate. Users reported confusion around payment options, distrust of the interface, and too many steps between cart and confirmation.',
    projectPurpose: 'Redesign the purchase funnel to reduce cognitive load and increase conversion rate by at least 30%.',
    targetUsers: 'Online shoppers aged 25–45, primarily mobile, who value speed and transparency and are often interrupted mid-task.',
    researchMethods: '8 contextual interviews, 120-person survey, and heatmap analysis of the existing flow. Synthesised with affinity mapping in FigJam.',
    researchStats: [
      { value: '74%', label: 'Checkout abandonment' },
      { value: '120', label: 'Survey participants' },
      { value: '#1 pain', label: '"Too many steps"' },
    ],
    persona: {
      name: 'Maria, 32',
      description: 'Marketing manager. Shops on mobile during commute. Abandons checkout if it takes over 3 minutes.',
      userStory: '"As a busy professional, I want to complete my purchase in under 2 minutes so I can get back to my day without frustration."',
    },
    designApproach: 'Mobile-First progressive enhancement. Collapsed 5-step checkout into a 2-step accordion, removed redundant fields, introduced inline validation to eliminate end-of-form errors.',
    testingDetails: 'Moderated usability testing with 5 participants on the Lo-Fi prototype. Key findings: users missed the order summary (P0), CVC field label caused confusion (P1).',
    beforeAfter: [
      { label: 'Order summary visibility', before: 'Hidden behind "Review order" link', after: 'Always-visible sticky sidebar on desktop, collapsible on mobile' },
      { label: 'Form validation', before: 'All errors shown only on submit', after: 'Inline real-time validation per field' },
      { label: 'Step count', before: '5 separate pages', after: '2-step accordion on a single page' },
    ],
    showcaseDescription: 'Hi-Fi design built on a custom design system with tokenised colours, spacing, and typography. Delivered as a Figma library with auto-layout components and developer annotations.',
    lessonsLearned: 'Trust is not built through words — it is built through consistent, predictable behaviour. Every micro-interaction either earns trust or erodes it.',
    nextSteps: ['Accessibility audit with screen reader users (WCAG 2.1 AA)', 'A/B test 2-step vs 1-page scroll on mobile', 'Localisation design for 3 additional markets'],
    colorTokens: [
      { token: '--primary', value: '#0B6E4F', role: 'CTA / primary action' },
      { token: '--primary-dark', value: '#2C5A07', role: 'Hover / gradient end' },
      { token: '--surface', value: '#FFFFFF', role: 'Page background' },
      { token: '--surface-alt', value: '#F8FAF8', role: 'Section fills' },
      { token: '--on-surface', value: 'rgba(18,21,14,.71)', role: 'Body text' },
      { token: '--on-surface-dim', value: 'rgba(18,21,14,.35)', role: 'Captions / meta' },
      { token: '--error', value: '#D32F2F', role: 'Validation errors' },
      { token: '--success', value: '#1B5E20', role: 'Confirmation states' },
    ],
    typographyScale: [
      { name: 'Display', font: 'Poppins', size: '60px', weight: '500', sample: 'Checkout, reimagined.' },
      { name: 'Heading 1', font: 'Poppins', size: '34px', weight: '500', sample: 'Your cart (3 items)' },
      { name: 'Body', font: 'Inter', size: '17px', weight: '400', sample: 'Free delivery on orders over €50. Returns within 30 days.' },
      { name: 'Label / CTA', font: 'Inter', size: '14px', weight: '500', sample: 'COMPLETE PURCHASE' },
    ],
    moodboardImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    ],
    moodboardCaption: 'Clean, high-contrast e-commerce aesthetics. Minimal chrome, maximum focus on product and trust signals.',
  },

  'mobile-banking-app': {
    title: 'Mobile Banking App',
    category: 'App Design',
    client: 'FinTech Solutions',
    year: '2025',
    duration: '4 months',
    heroImage: 'https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzcxMTUxNDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    overview: 'Secure and user-friendly mobile banking application featuring advanced financial management tools and biometric authentication.',
    challenge: 'Balancing high security with exceptional user experience while meeting strict regulatory requirements.',
    solution: 'Clean, intuitive interface with biometric authentication and real-time fraud detection while maintaining smooth UX.',
    results: ['500K+ downloads in 6 months', '4.8/5 App Store rating', '60% daily active users', 'Zero security incidents'],
    technologies: ['Figma', 'Maze', 'React Native', 'Firebase', 'Plaid API'],
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBiYW5raW5nJTIwYXBwfGVufDF8fHx8MTc3MTIxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwYXltZW50fGVufDF8fHx8MTc3MTIxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    testimonial: { quote: 'They transformed our vision into a secure, beautiful app that our customers love.', author: 'Michael Chen', position: 'CTO, FinTech Solutions' },
    tagline: 'Making personal finance feel calm, clear, and in your control.',
    devices: 'iOS & Android',
    role: 'Lead UX/UI Designer — Research, IA, Hi-Fi Prototyping, Design System',
    constraints: 'PSD2 regulatory compliance, biometric auth requirements, zero tolerance for security UX errors.',
    prototypeUrl: 'https://figma.com',
    problemStatement: 'Users felt anxious rather than empowered. Complex transaction lists, unclear balances, and confusing navigation created cognitive overload.',
    projectPurpose: 'Design an interface that reduces financial anxiety, makes key information immediately legible, and earns trust through calm, transparent design.',
    targetUsers: 'Digitally-native adults 22–40 managing personal finances independently, expecting UX parity with Revolut or Monzo.',
    researchMethods: 'Diary study over 2 weeks with 6 participants, 15 structured interviews, and competitive analysis of 8 apps.',
    researchStats: [
      { value: '67%', label: 'Feel anxious checking balance' },
      { value: '15', label: 'User interviews' },
      { value: '#1 request', label: '"Show my balance clearly"' },
    ],
    persona: {
      name: 'Artem, 28',
      description: 'Freelance developer, irregular income. Checks balance multiple times a day but dreads what he might see.',
      userStory: '"As a freelancer with variable income, I want to see my real spending power at a glance so I can make confident daily decisions without anxiety."',
    },
    designApproach: 'Calm design principles: high contrast, reduced visual noise, progressive disclosure of complex data. Designed for thumb reach on 6" screens as primary constraint.',
    testingDetails: 'Unmoderated testing with 8 participants via Maze. Critical finding: users missed "upcoming bills" — repositioned from tab 3 to home screen widget.',
    beforeAfter: [
      { label: 'Balance display', before: 'Small number buried in header', after: 'Full-screen hero balance with trend indicator' },
      { label: 'Upcoming bills', before: 'Hidden in third navigation tab', after: 'Proactive card on home screen' },
      { label: 'Transaction list', before: 'Raw transaction names from bank', after: 'Auto-categorised with merchant logos' },
    ],
    showcaseDescription: 'Material Design 3 component library adapted for financial context with custom semantic colour tokens (positive/negative states) and full dark mode support.',
    lessonsLearned: 'Anxiety in financial apps comes from information overload, not the numbers themselves. Removing 40% of visible data paradoxically made users feel more in control.',
    nextSteps: ['Accessibility research with low financial literacy users', 'Savings goal feature design sprint', 'Biometric onboarding flow optimisation'],
    colorTokens: [
      { token: '--primary', value: '#1565C0', role: 'Primary actions / links' },
      { token: '--positive', value: '#2E7D32', role: 'Income / positive values' },
      { token: '--negative', value: '#C62828', role: 'Expenses / negative values' },
      { token: '--surface', value: '#FAFAFA', role: 'App background (light)' },
      { token: '--surface-dark', value: '#121212', role: 'App background (dark)' },
      { token: '--on-surface', value: 'rgba(0,0,0,.87)', role: 'Primary text' },
      { token: '--on-surface-dim', value: 'rgba(0,0,0,.54)', role: 'Secondary text' },
      { token: '--warning', value: '#E65100', role: 'Upcoming bills / alerts' },
    ],
    typographyScale: [
      { name: 'Balance Display', font: 'Inter', size: '52px', weight: '300', sample: '€ 2,840.00' },
      { name: 'Section Title', font: 'Inter', size: '20px', weight: '500', sample: 'Recent transactions' },
      { name: 'Body', font: 'Inter', size: '16px', weight: '400', sample: 'Grocery Store — yesterday at 14:32' },
      { name: 'Amount Label', font: 'Inter', size: '15px', weight: '600', sample: '− €34.90' },
    ],
    moodboardImages: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    moodboardCaption: 'Calm, clarity-first financial interface. Generous whitespace, high-contrast numerics, no visual noise.',
  },
};

// ─── UI helpers ───────────────────────────────────────────────────────────────

function BlockLabel({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[10px] mb-[20px]">
      <span className="font-['Inter:Semi_Bold',sans-serif] text-[11px] tracking-[0.14em] uppercase text-[#0b6e4f]">{step}</span>
      <span className="flex-1 h-[1px] bg-[rgba(11,110,79,0.18)]" />
      <span className="font-['Inter:Semi_Bold',sans-serif] text-[11px] tracking-[0.14em] uppercase text-[rgba(18,21,14,0.35)] dark:text-gray-600">{children}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-['Poppins:Medium',sans-serif] text-[26px] md:text-[34px] leading-[1.2] tracking-[-0.02em] text-[#070309] dark:text-white mb-[20px]">
      {children}
    </h2>
  );
}

function Body({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-['Inter:Regular',sans-serif] text-[16px] md:text-[17px] leading-[1.75] text-[rgba(18,21,14,0.71)] dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="w-full h-[1px] bg-[rgba(0,0,0,0.07)] dark:bg-[rgba(255,255,255,0.06)] my-[64px]" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openContactModal } = useModal();

  // Merge: localStorage projects override hardcoded ones
  const storedRaw = slug ? getProjectBySlug(slug) : null;
  const storedProject: ProjectData | null = storedRaw ? {
    title: storedRaw.title,
    category: storedRaw.category,
    client: storedRaw.client,
    year: storedRaw.year,
    duration: storedRaw.duration,
    heroImage: storedRaw.heroImage,
    overview: storedRaw.overview,
    challenge: storedRaw.challenge,
    solution: storedRaw.showcaseDescription,
    results: storedRaw.results.filter(Boolean),
    technologies: storedRaw.technologies.filter(Boolean),
    images: storedRaw.showcaseImages.filter(Boolean),
    testimonial: storedRaw.testimonialQuote ? { quote: storedRaw.testimonialQuote, author: storedRaw.testimonialAuthor, position: storedRaw.testimonialPosition } : undefined,
    tagline: storedRaw.tagline,
    devices: storedRaw.devices,
    role: storedRaw.role,
    constraints: storedRaw.constraints,
    prototypeUrl: storedRaw.prototypeUrl,
    lofiUrl: storedRaw.lofiUrl,
    problemStatement: storedRaw.problemStatement,
    projectPurpose: storedRaw.projectPurpose,
    targetUsers: storedRaw.targetUsers,
    researchMethods: storedRaw.researchMethods,
    researchStats: storedRaw.researchStats.filter(s => s.value),
    persona: storedRaw.persona.name ? storedRaw.persona : undefined,
    designApproach: storedRaw.designApproach,
    wireframeImage: storedRaw.wireframeImage,
    testingDetails: storedRaw.testingDetails,
    beforeAfter: storedRaw.beforeAfter.filter(b => b.label),
    showcaseDescription: storedRaw.showcaseDescription,
    lessonsLearned: storedRaw.lessonsLearned,
    nextSteps: storedRaw.nextSteps.filter(Boolean),
    colorTokens: storedRaw.colorTokens ?? [],
    typographyScale: storedRaw.typographyScale ?? [],
    moodboardImages: storedRaw.moodboardImages ?? [],
    moodboardCaption: storedRaw.moodboardCaption ?? '',
  } : null;

  const project = storedProject ?? projectData[slug || ''];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-center flex flex-col items-center gap-[24px]">
          <h1 className="font-['Poppins:Medium',sans-serif] text-[32px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">Project not found</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-[8px] px-[32px] py-[16px] text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">

      {/* Back button */}
      <div className="fixed top-[20px] left-[24px] z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-[8px] px-[18px] py-[10px] bg-white/90 dark:bg-[rgba(20,20,20,0.9)] backdrop-blur-sm rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] shadow-[2px_2px_8px_0px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* ══ BLOCK 1 — HERO / INTRO & META ═══════════════════════════════════════ */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
        <ImageWithFallback src={project.heroImage} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-[24px] md:px-[64px] py-[48px] md:py-[64px]">
          <div className="max-w-[900px]">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="font-['Inter:Medium',sans-serif] text-white/70 text-[13px] tracking-[0.1em] uppercase mb-[10px]">
              {project.category}{project.devices ? ` · ${project.devices}` : ''}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-['Poppins:Medium',sans-serif] text-white text-[32px] md:text-[52px] lg:text-[60px] leading-[1.1] tracking-[-0.03em] mb-[14px]">
              {project.title}
            </motion.h1>
            {project.tagline && (
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="font-['Inter:Regular',sans-serif] text-white/80 text-[16px] md:text-[19px] leading-[1.5] max-w-[600px]">
                {project.tagline}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md border-b border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[900px] mx-auto px-[24px] md:px-[64px] py-[28px] grid grid-cols-2 md:grid-cols-4 gap-[20px]">
          {[
            { icon: <Users size={13} />, label: 'Client', value: project.client },
            { icon: <Clock size={13} />, label: 'Timeline', value: `${project.year} · ${project.duration}` },
            { icon: <Layers size={13} />, label: 'My role', value: project.role || 'UX/UI Designer' },
            { icon: <Layers size={13} />, label: 'Devices', value: project.devices || project.category },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-[5px]">
              <div className="flex items-center gap-[5px] text-[#0b6e4f]">
                {item.icon}
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] tracking-[0.1em] uppercase text-[#0b6e4f]">{item.label}</p>
              </div>
              <p className="font-['Inter:Regular',sans-serif] text-[13px] leading-[1.5] text-[rgba(18,21,14,0.71)] dark:text-gray-400">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[900px] mx-auto px-[24px] md:px-[64px] py-[72px] md:py-[96px]">

        {/* ══ BLOCK 2 — PROBLEM & AUDIENCE ════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <BlockLabel step="01">Problem & Audience</BlockLabel>
          <SectionHeading>What problem are we solving?</SectionHeading>
          <div className="flex flex-col gap-[20px]">
            {project.problemStatement ? (
              <div className="p-[24px] rounded-[16px] border-l-[3px] border-[#0b6e4f]" style={{ background: 'rgba(11,110,79,0.05)' }}>
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[#0b6e4f] mb-[8px] uppercase tracking-widest">Problem</p>
                <Body>{project.problemStatement}</Body>
              </div>
            ) : <Body>{project.overview}</Body>}
            {project.projectPurpose && (
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 mb-[8px] uppercase tracking-widest">Goal</p>
                <Body>{project.projectPurpose}</Body>
              </div>
            )}
            {project.challenge && !project.problemStatement && (
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 mb-[8px] uppercase tracking-widest">Challenge</p>
                <Body>{project.challenge}</Body>
              </div>
            )}
            {project.targetUsers && (
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 mb-[8px] uppercase tracking-widest">Target users</p>
                <Body>{project.targetUsers}</Body>
              </div>
            )}
          </div>
        </motion.section>

        <Divider />

        {/* ══ BLOCK 3 — USER RESEARCH ══════════════════════════════════════════════ */}
        {(project.researchMethods || project.researchStats || project.persona) && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <BlockLabel step="02">User Research</BlockLabel>
            <SectionHeading>What the data revealed.</SectionHeading>

            {project.researchStats && (
              <div className="grid grid-cols-3 gap-[14px] mb-[36px]">
                {project.researchStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center p-[20px] rounded-[20px] bg-white dark:bg-[rgba(30,30,30,0.8)] shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                    <p className="font-['Poppins:Medium',sans-serif] text-[26px] md:text-[30px] leading-[1.1] mb-[6px]"
                      style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {stat.value}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[rgba(18,21,14,0.55)] dark:text-gray-500 leading-[1.4]">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {project.researchMethods && <Body className="mb-[36px]">{project.researchMethods}</Body>}

            {project.persona && (
              <div className="p-[28px] md:p-[36px] rounded-[24px] bg-white dark:bg-[rgba(30,30,30,0.8)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] tracking-[0.1em] uppercase text-[#0b6e4f] mb-[20px]">User persona</p>
                <div className="flex items-start gap-[16px] mb-[20px]">
                  <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white font-['Poppins:Medium',sans-serif] text-[18px] shrink-0"
                    style={{ backgroundImage: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }}>
                    {project.persona.name[0]}
                  </div>
                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[17px] text-[#070309] dark:text-white">{project.persona.name}</p>
                    <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.55)] dark:text-gray-500 mt-[2px] leading-[1.5]">{project.persona.description}</p>
                  </div>
                </div>
                <div className="pl-[16px] border-l-[2px] border-[rgba(11,110,79,0.3)]">
                  <p className="font-['Inter:Regular',sans-serif] text-[15px] leading-[1.7] text-[rgba(18,21,14,0.71)] dark:text-gray-400 italic">{project.persona.userStory}</p>
                </div>
              </div>
            )}
          </motion.section>
        )}

        <Divider />

        {/* ══ BLOCK 4 — DESIGN PROCESS ════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <BlockLabel step="03">Design Process</BlockLabel>

          <SectionHeading>From blank page to structure.</SectionHeading>
          <Body className="mb-[36px]">{project.designApproach || project.solution}</Body>
          {project.wireframeImage && (
            <div className="rounded-[20px] overflow-hidden mb-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              <ImageWithFallback src={project.wireframeImage} alt="Wireframes" className="w-full object-cover" />
            </div>
          )}
          {project.lofiUrl && (
            <a href={project.lofiUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] hover:opacity-70 transition-opacity">
              <ExternalLink size={14} /> View Lo-Fi prototype in Figma
            </a>
          )}
        </motion.section>

        <Divider />

        {/* ══ BLOCK 4.5 — DESIGN SYSTEM ═══════════════════════════════════════════ */}
        {((project.colorTokens && project.colorTokens.length > 0) || (project.typographyScale && project.typographyScale.length > 0) || (project.moodboardImages && project.moodboardImages.length > 0)) && (
          <>
            <Divider />
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <BlockLabel step="04">Design System</BlockLabel>
              <SectionHeading>Visual language & token system.</SectionHeading>

              {/* Moodboard */}
              {project.moodboardImages && project.moodboardImages.length > 0 && (
                <div className="mb-[48px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[16px]">Moodboard</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] mb-[12px]">
                    {project.moodboardImages.map((img, i) => (
                      <div key={i} className={`rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square' : 'aspect-[4/3]'}`}>
                        <ImageWithFallback src={img} alt={`Moodboard ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {project.moodboardCaption && (
                    <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.45)] dark:text-gray-600 italic leading-[1.6]">{project.moodboardCaption}</p>
                  )}
                </div>
              )}

              {/* Color Palette */}
              {project.colorTokens && project.colorTokens.length > 0 && (
                <div className="mb-[48px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[16px]">Color tokens</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px]">
                    {project.colorTokens.map((ct, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
                        className="rounded-[16px] overflow-hidden border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[rgba(30,30,30,0.8)]">
                        <div className="h-[56px] w-full" style={{ backgroundColor: ct.value.startsWith('rgba') ? ct.value : ct.value }} />
                        <div className="p-[12px] flex flex-col gap-[4px]">
                          <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] tracking-[0.06em] text-[#0b6e4f] uppercase">{ct.role}</p>
                          <p className="font-mono text-[11px] text-[rgba(18,21,14,0.55)] dark:text-gray-500 leading-[1.3] break-all">{ct.token}</p>
                          <p className="font-mono text-[10px] text-[rgba(18,21,14,0.35)] dark:text-gray-600 leading-[1.3]">{ct.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Typography Scale */}
              {project.typographyScale && project.typographyScale.length > 0 && (
                <div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[16px]">Type scale</p>
                  <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.05)] dark:divide-[rgba(255,255,255,0.05)] rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[rgba(30,30,30,0.8)]">
                    {project.typographyScale.map((ts, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-[12px] px-[24px] py-[20px]">
                        <div className="md:w-[160px] shrink-0 flex flex-col gap-[3px]">
                          <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] tracking-[0.08em] uppercase text-[#0b6e4f]">{ts.name}</p>
                          <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-600">{ts.font} · {ts.size} · {ts.weight}</p>
                        </div>
                        <p className="text-[rgba(18,21,14,0.82)] dark:text-gray-200 leading-[1.2] truncate overflow-hidden"
                          style={{ fontFamily: ts.font === 'Poppins' ? 'Poppins, sans-serif' : 'Inter, sans-serif', fontSize: `clamp(14px, 2vw, ${parseFloat(ts.size) > 30 ? '28px' : ts.size})`, fontWeight: ts.weight }}>
                          {ts.sample}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          </>
        )}

        {/* ══ BLOCK 5 — TESTING & ITERATION ═══════════════════════════════════════ */}
        {(project.testingDetails || project.beforeAfter) && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <BlockLabel step="05">Testing & Iteration</BlockLabel>
            <SectionHeading>What users taught me.</SectionHeading>
            {project.testingDetails && <Body className="mb-[40px]">{project.testingDetails}</Body>}
            {project.beforeAfter && (
              <div className="flex flex-col gap-[14px]">
                {project.beforeAfter.map((item, i) => (
                  <motion.div key={i} className="rounded-[18px] overflow-hidden border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)]"
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                    <div className="px-[20px] py-[10px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                      <p className="font-['Inter:Semi_Bold',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">{item.label}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="p-[20px] border-r border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
                        <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] text-red-400 uppercase tracking-widest mb-[8px]">Before</p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[1.6] text-[rgba(18,21,14,0.71)] dark:text-gray-400">{item.before}</p>
                      </div>
                      <div className="p-[20px]">
                        <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] text-[#0b6e4f] uppercase tracking-widest mb-[8px]">After</p>
                        <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[1.6] text-[rgba(18,21,14,0.71)] dark:text-gray-400">{item.after}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        <Divider />

        {/* ══ BLOCK 6 — FINAL SHOWCASE ════════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <BlockLabel step="06">Final Design</BlockLabel>
          <SectionHeading>The finished product.</SectionHeading>
          <Body className="mb-[36px]">{project.showcaseDescription || project.solution}</Body>

          {project.images && project.images.length > 0 && (
            <div className="flex flex-col gap-[16px] mb-[32px]">
              {project.images.map((img, i) => (
                <div key={i} className="rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <ImageWithFallback src={img} alt={`${project.title} — screen ${i + 1}`} className="w-full object-cover aspect-[16/9]" />
                </div>
              ))}
            </div>
          )}

          {project.prototypeUrl && (
            <a href={project.prototypeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-[10px] px-[28px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95 mb-[40px]"
              style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}>
              <ExternalLink size={16} /> View Hi-Fi prototype in Figma
            </a>
          )}

          {project.results && project.results.length > 0 && (
            <div className="mt-[8px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[16px]">Results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                {project.results.map((result, i) => (
                  <div key={i} className="flex items-start gap-[14px] p-[18px] bg-white dark:bg-[rgba(40,40,40,0.8)] rounded-[14px] shadow-[2px_2px_8px_0px_rgba(0,0,0,0.05)] dark:shadow-none border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                    <div className="w-[6px] h-[6px] rounded-full mt-[8px] shrink-0" style={{ backgroundImage: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }} />
                    <p className="font-['Inter:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-300 text-[15px] leading-[1.5]">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-[32px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[14px]">Tools & technologies</p>
              <div className="flex flex-wrap gap-[10px]">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-[16px] py-[8px] rounded-[48px] text-white text-[13px] font-['Inter:Medium',sans-serif] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.1)]"
                    style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        <Divider />

        {/* ══ BLOCK 7 — REFLECTION ════════════════════════════════════════════════ */}
        {(project.lessonsLearned || project.nextSteps) && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <BlockLabel step="07">Reflection</BlockLabel>
            <SectionHeading>What I learned.</SectionHeading>
            {project.lessonsLearned && <Body className="mb-[40px]">{project.lessonsLearned}</Body>}
            {project.nextSteps && (
              <div>
                <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-500 uppercase tracking-widest mb-[16px]">Next steps</p>
                <div className="flex flex-col gap-[12px]">
                  {project.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-[14px]">
                      <div className="w-[6px] h-[6px] rounded-full mt-[9px] shrink-0" style={{ background: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }} />
                      <Body>{step}</Body>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {project.testimonial && (
          <>
            <Divider />
            <motion.div className="p-[32px] md:p-[48px] rounded-[24px] bg-white dark:bg-[rgba(40,40,40,0.8)] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.08)] dark:shadow-none border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <svg className="w-[36px] h-[36px] mb-[20px] opacity-15 text-[rgba(18,21,14,0.71)] dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-['Inter:Regular',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-300 text-[17px] md:text-[20px] leading-[1.65] mb-[20px] italic">"{project.testimonial.quote}"</p>
              <p className="font-['Poppins:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-300 text-[15px]">{project.testimonial.author}</p>
              <p className="font-['Inter:Regular',sans-serif] text-[#0b6e4f] text-[13px] mt-[2px]">{project.testimonial.position}</p>
            </motion.div>
          </>
        )}

        <Divider />

        {/* CTA */}
        <motion.div className="rounded-[28px] p-[40px] md:p-[56px] text-center" style={{ background: 'rgba(11,110,79,0.05)', border: '1px solid rgba(11,110,79,0.15)' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] tracking-[0.12em] uppercase text-[#0b6e4f] mb-[14px]">Have a project in mind?</p>
          <h2 className="font-['Poppins:Medium',sans-serif] text-[26px] md:text-[34px] leading-[1.2] tracking-[-0.02em] text-[#070309] dark:text-white mb-[14px]">{"Let's work together."}</h2>
          <p className="font-['Inter:Regular',sans-serif] text-[15px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 mb-[32px] max-w-[400px] mx-auto leading-[1.6]">
            Whether you need a full UX process or a focused design sprint — I would love to hear from you.
          </p>
          <div className="flex flex-wrap gap-[14px] justify-center">
            <button onClick={openContactModal}
              className="flex items-center gap-[10px] px-[28px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
              style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}>
              Start a project <ArrowRight size={16} />
            </button>
            <a href="mailto:hello@ux42.studio"
              className="relative flex items-center gap-[10px] px-[28px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-[#070309] dark:text-white hover:opacity-90 hover:scale-105 transition-all duration-200 active:scale-95">
              <span aria-hidden="true" className="absolute border border-[#0b6e4f] border-solid inset-[-1px] pointer-events-none rounded-[48px]" />
              <Mail size={15} /> Email directly
            </a>
          </div>
        </motion.div>

        <div className="mt-[56px] flex justify-center">
          <Link to="/" className="inline-flex items-center gap-[8px] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.45)] dark:text-gray-600 hover:text-[#0b6e4f] dark:hover:text-[#10b981] transition-colors">
            <ArrowLeft size={14} /> Back to all work
          </Link>
        </div>
      </div>
    </div>
  );
}
