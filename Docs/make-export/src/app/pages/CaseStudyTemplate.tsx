import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Plus, Trash2, Save, Eye, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { saveProject, getStoredProjects, deleteProject, getProjectBySlug, slugify, type StoredProject } from '../utils/projectStorage';

// ─── Form field components ────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-['Inter:Semi_Bold',sans-serif] text-[12px] tracking-[0.08em] uppercase text-[rgba(18,21,14,0.55)] dark:text-gray-500 mb-[6px]">
      {children} {required && <span className="text-[#0b6e4f]">*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[rgba(18,21,14,0.4)] dark:text-gray-600 mt-[4px] leading-[1.5]">
      {children}
    </p>
  );
}

function Input({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-[14px] py-[10px] rounded-[10px] font-['Inter:Regular',sans-serif] text-[14px] text-[#070309] dark:text-white bg-white dark:bg-[rgba(30,30,30,0.8)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#0b6e4f] transition-colors placeholder:text-[rgba(18,21,14,0.3)] dark:placeholder:text-gray-600 ${className}`}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-[14px] py-[10px] rounded-[10px] font-['Inter:Regular',sans-serif] text-[14px] text-[#070309] dark:text-white bg-white dark:bg-[rgba(30,30,30,0.8)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#0b6e4f] transition-colors placeholder:text-[rgba(18,21,14,0.3)] dark:placeholder:text-gray-600 resize-none"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-[14px] py-[10px] rounded-[10px] font-['Inter:Regular',sans-serif] text-[14px] text-[#070309] dark:text-white bg-white dark:bg-[rgba(30,30,30,0.8)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[#0b6e4f] transition-colors"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Section accordion ────────────────────────────────────────────────────────

function Section({ step, title, goal, children, defaultOpen = true }: {
  step: string; title: string; goal: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[20px] overflow-hidden border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] bg-white dark:bg-[rgba(25,25,25,0.9)]">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-[24px] py-[20px] text-left hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-[rgba(255,255,255,0.02)] transition-colors">
        <div className="flex items-center gap-[14px]">
          <span className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-white font-['Inter:Semi_Bold',sans-serif] text-[12px] shrink-0"
            style={{ backgroundImage: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }}>
            {step}
          </span>
          <div className="text-left">
            <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-[#070309] dark:text-white leading-[1.2]">{title}</p>
            <p className="font-['Inter:Regular',sans-serif] text-[11px] text-[rgba(18,21,14,0.45)] dark:text-gray-600 mt-[2px]">{goal}</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-[rgba(18,21,14,0.35)] shrink-0" /> : <ChevronDown size={16} className="text-[rgba(18,21,14,0.35)] shrink-0" />}
      </button>
      {open && (
        <div className="px-[24px] pb-[24px] border-t border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] pt-[24px]">
          <div className="flex flex-col gap-[20px]">{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── Repeatable list field ────────────────────────────────────────────────────

function ListField({ items, onChange, placeholder }: {
  items: string[]; onChange: (items: string[]) => void; placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      {items.map((item, i) => (
        <div key={i} className="flex gap-[8px]">
          <Input value={item} onChange={v => { const n = [...items]; n[i] = v; onChange(n); }} placeholder={placeholder} />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])}
        className="flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] hover:opacity-70 transition-opacity self-start mt-[2px]">
        <Plus size={13} /> Add
      </button>
    </div>
  );
}

// ─── Before/After field ───────────────────────────────────────────────────────

function BeforeAfterField({ items, onChange }: {
  items: { label: string; before: string; after: string }[];
  onChange: (items: { label: string; before: string; after: string }[]) => void;
}) {
  const update = (i: number, key: 'label' | 'before' | 'after', v: string) => {
    const n = items.map((item, idx) => idx === i ? { ...item, [key]: v } : item);
    onChange(n);
  };
  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((item, i) => (
        <div key={i} className="rounded-[12px] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
          <div className="px-[14px] py-[10px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] flex items-center gap-[8px]">
            <Input value={item.label} onChange={v => update(i, 'label', v)} placeholder="Feature or screen name" className="flex-1" />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 w-[30px] h-[30px] flex items-center justify-center rounded-[6px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-[rgba(0,0,0,0.05)] dark:divide-[rgba(255,255,255,0.05)]">
            <div className="p-[12px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] text-red-400 uppercase tracking-widest mb-[6px]">Before</p>
              <Textarea value={item.before} onChange={v => update(i, 'before', v)} placeholder="Original problem" rows={2} />
            </div>
            <div className="p-[12px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[10px] text-[#0b6e4f] uppercase tracking-widest mb-[6px]">After</p>
              <Textarea value={item.after} onChange={v => update(i, 'after', v)} placeholder="Your solution" rows={2} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { label: '', before: '', after: '' }])}
        className="flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] hover:opacity-70 transition-opacity self-start">
        <Plus size={13} /> Add comparison
      </button>
    </div>
  );
}

// ─── Stats field ──────────────────────────────────────────────────────────────

function StatsField({ items, onChange }: {
  items: { value: string; label: string }[];
  onChange: (items: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      {items.map((item, i) => (
        <div key={i} className="flex gap-[8px]">
          <Input value={item.value} onChange={v => { const n = [...items]; n[i] = { ...n[i], value: v }; onChange(n); }} placeholder="84%" className="w-[100px] shrink-0" />
          <Input value={item.label} onChange={v => { const n = [...items]; n[i] = { ...n[i], label: v }; onChange(n); }} placeholder="stressed by task lists" />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {items.length < 3 && (
        <button onClick={() => onChange([...items, { value: '', label: '' }])}
          className="flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] hover:opacity-70 transition-opacity self-start">
          <Plus size={13} /> Add stat
        </button>
      )}
    </div>
  );
}

// ─── Saved projects list ──────────────────────────────────────────────────────

function SavedProjects({ onEdit }: { onEdit: (slug: string) => void }) {
  const [projects, setProjects] = useState(getStoredProjects());

  const handleDelete = (slug: string) => {
    if (confirm(`Delete "${slug}"?`)) {
      deleteProject(slug);
      setProjects(getStoredProjects());
    }
  };

  if (projects.length === 0) return null;

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="font-['Inter:Semi_Bold',sans-serif] text-[12px] tracking-widest uppercase text-[rgba(18,21,14,0.5)] dark:text-gray-500">
        Saved case studies ({projects.length})
      </p>
      {projects.map(p => (
        <div key={p.slug} className="flex items-center justify-between p-[16px] rounded-[14px] bg-white dark:bg-[rgba(25,25,25,0.9)] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[#070309] dark:text-white">{p.title || 'Untitled'}</p>
            <p className="font-['Inter:Regular',sans-serif] text-[12px] text-[rgba(18,21,14,0.45)] dark:text-gray-600">/{p.slug} · {p.category}</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <Link to={`/portfolio/${p.slug}`}
              className="flex items-center gap-[5px] px-[12px] py-[6px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] border border-[rgba(11,110,79,0.3)] hover:bg-[rgba(11,110,79,0.05)] transition-colors">
              <Eye size={13} /> View
            </Link>
            <button onClick={() => onEdit(p.slug)}
              className="px-[12px] py-[6px] rounded-[8px] font-['Inter:Medium',sans-serif] text-[12px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-[rgba(255,255,255,0.03)] transition-colors">
              Edit
            </button>
            <button onClick={() => handleDelete(p.slug)}
              className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyForm(): Omit<StoredProject, 'slug' | 'createdAt'> {
  return {
    title: '', tagline: '', category: 'Web Design', devices: '', client: '',
    year: new Date().getFullYear().toString(), duration: '', role: '', constraints: '',
    heroImage: '', prototypeUrl: '', lofiUrl: '', overview: '',
    problemStatement: '', projectPurpose: '', challenge: '', targetUsers: '',
    researchMethods: '', researchStats: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
    persona: { name: '', description: '', userStory: '' },
    designApproach: '', wireframeImage: '', testingDetails: '',
    beforeAfter: [{ label: '', before: '', after: '' }],
    showcaseImages: [''], showcaseDescription: '', results: [''], technologies: [''],
    lessonsLearned: '', nextSteps: [''],
    testimonialQuote: '', testimonialAuthor: '', testimonialPosition: '',
    tags: [''],
    colorTokens: [{ token: '', value: '', role: '' }],
    typographyScale: [{ name: '', font: 'Inter', size: '', weight: '400', sample: '' }],
    moodboardImages: [''],
    moodboardCaption: '',
  };
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function CaseStudyTemplate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');

  const [form, setForm] = useState<Omit<StoredProject, 'slug' | 'createdAt'>>(emptyForm());
  const [slug, setSlug] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editSlug) {
      const existing = getProjectBySlug(editSlug);
      if (existing) {
        const { slug: s, createdAt, ...rest } = existing;
        setForm(rest);
        setSlug(s);
      }
    }
  }, [editSlug]);

  useEffect(() => {
    if (!editSlug && form.title) {
      setSlug(slugify(form.title));
    }
  }, [form.title, editSlug]);

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!slug.trim()) { setError('Slug is required'); return; }
    if (!form.heroImage.trim()) { setError('Hero image URL is required'); return; }

    const project: StoredProject = {
      ...form,
      slug: slug.trim(),
      createdAt: editSlug ? (getProjectBySlug(editSlug)?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
    };
    saveProject(project);
    setSaved(true);
    setError('');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleEdit = (s: string) => navigate(`/case-template?edit=${s}`);
  const handleNew = () => { setForm(emptyForm()); setSlug(''); navigate('/case-template'); };

  return (
    <div className="min-h-screen bg-[rgba(248,250,248,1)] dark:bg-[#0a0a0a] transition-colors duration-300">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[rgba(15,15,15,0.97)] backdrop-blur-md border-b border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[860px] mx-auto px-[24px] md:px-[48px] py-[14px] flex items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px] min-w-0">
            <Link to="/" className="flex items-center gap-[6px] font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.45)] dark:text-gray-600 hover:text-[#0b6e4f] transition-colors shrink-0">
              <ArrowLeft size={14} /> Home
            </Link>
            <span className="text-[rgba(18,21,14,0.2)] dark:text-gray-700">/</span>
            <div className="flex items-center gap-[8px] min-w-0">
              <span className="px-[8px] py-[3px] rounded-[6px] font-['Inter:Semi_Bold',sans-serif] text-[10px] tracking-widest uppercase text-white shrink-0" style={{ background: '#e57a00' }}>
                Internal
              </span>
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[#070309] dark:text-white truncate">
                {editSlug ? `Editing: ${form.title || editSlug}` : 'New Case Study'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[8px] shrink-0">
            {editSlug && (
              <button onClick={handleNew}
                className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] font-['Inter:Medium',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
                <Plus size={13} /> New
              </button>
            )}
            {slug && (
              <Link to={`/portfolio/${slug}`}
                className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[10px] font-['Inter:Medium',sans-serif] text-[13px] text-[#0b6e4f] border border-[rgba(11,110,79,0.3)] hover:bg-[rgba(11,110,79,0.05)] transition-colors">
                <Eye size={13} /> Preview
              </Link>
            )}
            <button onClick={handleSave}
              className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[10px] font-['Inter:Medium',sans-serif] text-[13px] text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}>
              {saved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> Save</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-[24px] md:px-[48px] py-[40px] flex flex-col gap-[16px]">

        {/* Error */}
        {error && (
          <div className="flex items-center gap-[10px] p-[14px] rounded-[12px] bg-red-50 dark:bg-[rgba(255,0,0,0.08)] border border-red-200 dark:border-red-900">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="font-['Inter:Regular',sans-serif] text-[13px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Saved projects */}
        <SavedProjects onEdit={handleEdit} />

        {/* Slug field */}
        <div className="p-[20px] rounded-[16px] bg-white dark:bg-[rgba(25,25,25,0.9)] border border-[rgba(11,110,79,0.2)]" style={{ background: 'rgba(11,110,79,0.03)' }}>
          <FieldLabel required>URL Slug</FieldLabel>
          <div className="flex items-center gap-[8px]">
            <span className="font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.4)] dark:text-gray-600 shrink-0">/portfolio/</span>
            <Input value={slug} onChange={setSlug} placeholder="my-project-name" />
          </div>
          <FieldHint>Генерируется автоматически из названия. Можно изменить вручную.</FieldHint>
        </div>

        {/* BLOCK 1 — Intro & Meta */}
        <Section step="01" title="Intro & Meta" goal="Мгновенно ввести посетителя в курс дела">
          <div>
            <FieldLabel required>Название проекта</FieldLabel>
            <Input value={form.title} onChange={v => set('title', v)} placeholder="Flow — мобильное приложение для тайм-менеджмента" />
          </div>
          <div>
            <FieldLabel>Tagline (подзаголовок)</FieldLabel>
            <Input value={form.tagline} onChange={v => set('tagline', v)} placeholder="One sentence that hooks the visitor" />
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <FieldLabel required>Категория</FieldLabel>
              <Select value={form.category} onChange={v => set('category', v)} options={['Web Design', 'App Design', 'UX Research']} />
            </div>
            <div>
              <FieldLabel>Устройства</FieldLabel>
              <Input value={form.devices} onChange={v => set('devices', v)} placeholder="iOS & Android" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <FieldLabel>Клиент</FieldLabel>
              <Input value={form.client} onChange={v => set('client', v)} placeholder="Client Name / Student project" />
            </div>
            <div>
              <FieldLabel>Год</FieldLabel>
              <Input value={form.year} onChange={v => set('year', v)} placeholder="2025" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <FieldLabel>Длительность</FieldLabel>
              <Input value={form.duration} onChange={v => set('duration', v)} placeholder="4 weeks" />
            </div>
            <div>
              <FieldLabel>Теги (через запятую)</FieldLabel>
              <Input value={form.tags.join(', ')} onChange={v => set('tags', v.split(',').map(t => t.trim()))} placeholder="UX Research, Figma, Mobile" />
            </div>
          </div>
          <div>
            <FieldLabel required>Моя роль</FieldLabel>
            <Input value={form.role} onChange={v => set('role', v)} placeholder="End-to-End UX/UI Designer — Research, Wireframing, Prototyping, Handoff" />
          </div>
          <div>
            <FieldLabel>Ограничения</FieldLabel>
            <Input value={form.constraints} onChange={v => set('constraints', v)} placeholder="Solo designer, 4-week sprint, no dev resources" />
          </div>
          <div>
            <FieldLabel required>Hero Image URL</FieldLabel>
            <Input value={form.heroImage} onChange={v => set('heroImage', v)} placeholder="https://images.unsplash.com/…" />
            <FieldHint>Соотношение сторон 16:9, минимум 1200px ширина</FieldHint>
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <FieldLabel>Hi-Fi прототип (Figma URL)</FieldLabel>
              <Input value={form.prototypeUrl} onChange={v => set('prototypeUrl', v)} placeholder="https://figma.com/proto/…" />
            </div>
            <div>
              <FieldLabel>Lo-Fi прототип (Figma URL)</FieldLabel>
              <Input value={form.lofiUrl} onChange={v => set('lofiUrl', v)} placeholder="https://figma.com/proto/…" />
            </div>
          </div>
        </Section>

        {/* BLOCK 2 — Problem & Audience */}
        <Section step="02" title="Problem & Audience" goal="Проявить эмпатию и доказать, что проблема реальна">
          <div>
            <FieldLabel required>Краткое описание (для карточки в галерее)</FieldLabel>
            <Textarea value={form.overview} onChange={v => set('overview', v)} placeholder="1-2 предложения для превью в галерее" rows={2} />
          </div>
          <div>
            <FieldLabel required>Проблема</FieldLabel>
            <Textarea value={form.problemStatement} onChange={v => set('problemStatement', v)} placeholder="Конкретная боль. Называй симптом, не категорию." rows={3} />
          </div>
          <div>
            <FieldLabel>Цель проекта</FieldLabel>
            <Textarea value={form.projectPurpose} onChange={v => set('projectPurpose', v)} placeholder="Измеримая цель: что изменится и на сколько?" rows={2} />
          </div>
          <div>
            <FieldLabel required>Целевые пользователи</FieldLabel>
            <Textarea value={form.targetUsers} onChange={v => set('targetUsers', v)} placeholder="Возраст, контекст, ключевое поведение" rows={2} />
          </div>
        </Section>

        {/* BLOCK 3 — Research */}
        <Section step="03" title="User Research" goal="Решения основаны на данных, не интуиции">
          <div>
            <FieldLabel required>Методология и ход исследования</FieldLabel>
            <Textarea value={form.researchMethods} onChange={v => set('researchMethods', v)} placeholder="Какие методы, сколько участников, что нашли?" rows={3} />
          </div>
          <div>
            <FieldLabel>3 ключевые метрики</FieldLabel>
            <StatsField items={form.researchStats} onChange={v => set('researchStats', v)} />
          </div>
          <div className="flex flex-col gap-[10px] p-[16px] rounded-[14px] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)]">
            <p className="font-['Inter:Semi_Bold',sans-serif] text-[12px] tracking-widest uppercase text-[rgba(18,21,14,0.5)] dark:text-gray-500">Персона</p>
            <div>
              <FieldLabel>Имя и возраст</FieldLabel>
              <Input value={form.persona.name} onChange={v => set('persona', { ...form.persona, name: v })} placeholder="Maria, 32" />
            </div>
            <div>
              <FieldLabel>Описание (2 предложения)</FieldLabel>
              <Textarea value={form.persona.description} onChange={v => set('persona', { ...form.persona, description: v })} placeholder="Работа, контекст, ключевое поведение" rows={2} />
            </div>
            <div>
              <FieldLabel>User Story</FieldLabel>
              <Textarea value={form.persona.userStory} onChange={v => set('persona', { ...form.persona, userStory: v })} placeholder='"As a [user], I want to [goal], so that [outcome]."' rows={2} />
            </div>
          </div>
        </Section>

        {/* BLOCK 4 — Design Process */}
        <Section step="04" title="Design Process" goal="Показать кухню дизайна и эволюцию мысли">
          <div>
            <FieldLabel required>Подход к проектированию</FieldLabel>
            <Textarea value={form.designApproach} onChange={v => set('designApproach', v)} placeholder="IA-решения, принцип Mobile-First, ключевые паттерны" rows={4} />
          </div>
          <div>
            <FieldLabel>Изображение вайрфреймов (URL)</FieldLabel>
            <Input value={form.wireframeImage} onChange={v => set('wireframeImage', v)} placeholder="https://…/wireframes.png" />
          </div>
        </Section>

        {/* BLOCK 5 — Design System */}
        <Section step="05" title="Design System" goal="Визуальный язык, токены цветов и типографика" defaultOpen={false}>
          <div>
            <FieldLabel>Moodboard — изображения (URLs)</FieldLabel>
            <ListField items={form.moodboardImages} onChange={v => set('moodboardImages', v)} placeholder="https://images.unsplash.com/…" />
            <FieldHint>До 6 изображений. Первое будет отображаться крупнее в сетке.</FieldHint>
          </div>
          <div>
            <FieldLabel>Подпись к moodboard</FieldLabel>
            <Textarea value={form.moodboardCaption} onChange={v => set('moodboardCaption', v)} placeholder="Эстетика, настроение и ключевые референсы." rows={2} />
          </div>
          <div>
            <FieldLabel>Цветовые токены</FieldLabel>
            <div className="flex flex-col gap-[8px]">
              {form.colorTokens.map((ct, i) => (
                <div key={i} className="flex gap-[8px] items-center">
                  <input
                    type="color"
                    value={ct.value.startsWith('#') ? ct.value : '#0b6e4f'}
                    onChange={e => { const n = [...form.colorTokens]; n[i] = { ...n[i], value: e.target.value }; set('colorTokens', n); }}
                    className="w-[36px] h-[36px] rounded-[8px] border border-[rgba(0,0,0,0.1)] cursor-pointer shrink-0 p-[2px] bg-white"
                  />
                  <Input value={ct.token} onChange={v => { const n = [...form.colorTokens]; n[i] = { ...n[i], token: v }; set('colorTokens', n); }} placeholder="--primary" className="w-[160px] shrink-0" />
                  <Input value={ct.value} onChange={v => { const n = [...form.colorTokens]; n[i] = { ...n[i], value: v }; set('colorTokens', n); }} placeholder="#0B6E4F или rgba(…)" />
                  <Input value={ct.role} onChange={v => { const n = [...form.colorTokens]; n[i] = { ...n[i], role: v }; set('colorTokens', n); }} placeholder="CTA / primary action" />
                  <button onClick={() => set('colorTokens', form.colorTokens.filter((_, idx) => idx !== i))}
                    className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => set('colorTokens', [...form.colorTokens, { token: '', value: '#000000', role: '' }])}
                className="flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] hover:opacity-70 transition-opacity self-start mt-[2px]">
                <Plus size={13} /> Add color token
              </button>
            </div>
            <FieldHint>Token name (–-primary), hex или rgba, назначение (CTA / background и т.д.)</FieldHint>
          </div>
          <div>
            <FieldLabel>Шкала типографики</FieldLabel>
            <div className="flex flex-col gap-[10px]">
              {form.typographyScale.map((ts, i) => (
                <div key={i} className="rounded-[12px] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden">
                  <div className="px-[14px] py-[10px] bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)] flex items-center gap-[8px]">
                    <Input value={ts.name} onChange={v => { const n = [...form.typographyScale]; n[i] = { ...n[i], name: v }; set('typographyScale', n); }} placeholder="Display / Heading / Body / Label" className="flex-1" />
                    <button onClick={() => set('typographyScale', form.typographyScale.filter((_, idx) => idx !== i))}
                      className="shrink-0 w-[30px] h-[30px] flex items-center justify-center rounded-[6px] text-red-400 hover:bg-red-50 dark:hover:bg-[rgba(255,0,0,0.08)] transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-[8px] p-[12px]">
                    <div>
                      <FieldLabel>Шрифт</FieldLabel>
                      <Select value={ts.font} onChange={v => { const n = [...form.typographyScale]; n[i] = { ...n[i], font: v }; set('typographyScale', n); }} options={['Inter', 'Poppins', 'Roboto', 'Other']} />
                    </div>
                    <div>
                      <FieldLabel>Размер</FieldLabel>
                      <Input value={ts.size} onChange={v => { const n = [...form.typographyScale]; n[i] = { ...n[i], size: v }; set('typographyScale', n); }} placeholder="34px" />
                    </div>
                    <div>
                      <FieldLabel>Weight</FieldLabel>
                      <Select value={ts.weight} onChange={v => { const n = [...form.typographyScale]; n[i] = { ...n[i], weight: v }; set('typographyScale', n); }} options={['300', '400', '500', '600', '700']} />
                    </div>
                  </div>
                  <div className="px-[12px] pb-[12px]">
                    <FieldLabel>Пример текста (sample)</FieldLabel>
                    <Input value={ts.sample} onChange={v => { const n = [...form.typographyScale]; n[i] = { ...n[i], sample: v }; set('typographyScale', n); }} placeholder="Your cart (3 items)" />
                  </div>
                </div>
              ))}
              <button onClick={() => set('typographyScale', [...form.typographyScale, { name: '', font: 'Inter', size: '', weight: '400', sample: '' }])}
                className="flex items-center gap-[6px] font-['Inter:Medium',sans-serif] text-[12px] text-[#0b6e4f] hover:opacity-70 transition-opacity self-start">
                <Plus size={13} /> Add type style
              </button>
            </div>
          </div>
        </Section>

        {/* BLOCK 6 — Testing */}
        <Section step="06" title="Testing & Iteration" goal="Показать умение итерировать по фидбеку">
          <div>
            <FieldLabel required>Ход тестирования и P0-находки</FieldLabel>
            <Textarea value={form.testingDetails} onChange={v => set('testingDetails', v)} placeholder="Кол-во участников, метод, что нашли?" rows={3} />
          </div>
          <div>
            <FieldLabel>Before → After (сравнения)</FieldLabel>
            <BeforeAfterField items={form.beforeAfter} onChange={v => set('beforeAfter', v)} />
          </div>
        </Section>

        {/* BLOCK 7 — Final Showcase */}
        <Section step="07" title="Final Showcase" goal="Вау-эффект: красивые мокапы и результаты">
          <div>
            <FieldLabel required>Описание финального дизайна</FieldLabel>
            <Textarea value={form.showcaseDescription} onChange={v => set('showcaseDescription', v)} placeholder="Дизайн-система, компонентная библиотека, ключевые UI-решения" rows={3} />
          </div>
          <div>
            <FieldLabel required>Изображения финального дизайна (URLs)</FieldLabel>
            <ListField items={form.showcaseImages} onChange={v => set('showcaseImages', v)} placeholder="https://… (соотношение 16:9)" />
          </div>
          <div>
            <FieldLabel>Результаты</FieldLabel>
            <ListField items={form.results} onChange={v => set('results', v)} placeholder="Completion rate increased from 26% to 71%" />
          </div>
          <div>
            <FieldLabel>Инструменты и технологии</FieldLabel>
            <ListField items={form.technologies} onChange={v => set('technologies', v)} placeholder="Figma" />
          </div>
        </Section>

        {/* BLOCK 8 — Conclusion */}
        <Section step="08" title="Reflection & Next Steps" goal="Профессиональная зрелость">
          <div>
            <FieldLabel required>Главный вывод</FieldLabel>
            <Textarea value={form.lessonsLearned} onChange={v => set('lessonsLearned', v)} placeholder="Что удивило? Что сделала бы иначе? Честно." rows={3} />
          </div>
          <div>
            <FieldLabel>Следующие шаги</FieldLabel>
            <ListField items={form.nextSteps} onChange={v => set('nextSteps', v)} placeholder="Accessibility audit with screen reader users" />
          </div>
          <div className="flex flex-col gap-[10px] p-[16px] rounded-[14px] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)]">
            <p className="font-['Inter:Semi_Bold',sans-serif] text-[12px] tracking-widest uppercase text-[rgba(18,21,14,0.5)] dark:text-gray-500">Отзыв (необязательно)</p>
            <div>
              <FieldLabel>Цитата</FieldLabel>
              <Textarea value={form.testimonialQuote} onChange={v => set('testimonialQuote', v)} placeholder='"The product shipped in half the time I expected."' rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <FieldLabel>Автор</FieldLabel>
                <Input value={form.testimonialAuthor} onChange={v => set('testimonialAuthor', v)} placeholder="First Last" />
              </div>
              <div>
                <FieldLabel>Должность</FieldLabel>
                <Input value={form.testimonialPosition} onChange={v => set('testimonialPosition', v)} placeholder="CEO, Company" />
              </div>
            </div>
          </div>
        </Section>

        {/* Save button bottom */}
        <button onClick={handleSave}
          className="flex items-center justify-center gap-[10px] w-full py-[16px] rounded-[14px] font-['Inter:Medium',sans-serif] text-[16px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-[1.01] active:scale-[0.99]"
          style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}>
          {saved ? <><CheckCircle2 size={18} /> Saved successfully!</> : <><Save size={18} /> Save case study</>}
        </button>

        {slug && saved && (
          <div className="text-center">
            <Link to={`/portfolio/${slug}`}
              className="inline-flex items-center gap-[8px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] hover:opacity-70 transition-opacity">
              <Eye size={15} /> View published case study →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
