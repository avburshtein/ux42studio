import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FloatingElements } from '../components/FloatingElements';
import { useModal } from '../contexts/ModalContext';
import { MobileHeader } from '../components/MobileHeader';
import {
  ArrowRight,
  Mail,
  Search,
  LayoutPanelLeft,
  FlaskConical,
  Handshake,
  ArrowLeft,
} from 'lucide-react';

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ isMobile }: { isMobile: boolean }) {
  const { openContactModal } = useModal();

  if (isMobile) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(15,15,15,0.70)] backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="max-w-[1280px] mx-auto px-[64px] py-[20px] flex items-center justify-between">
        <Link
          to="/"
          className="font-['Poppins:Medium',sans-serif] text-[18px] leading-[1.2]"
          style={{
            backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          UX42.studio
        </Link>

        <div className="flex items-center gap-[32px]">
          <Link
            to="/#portfolio"
            className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 hover:text-[#0b6e4f] dark:hover:text-[#10b981] transition-colors"
          >
            Work
          </Link>
          <Link
            to="/about"
            className="font-['Inter:Regular',sans-serif] text-[16px] text-[#0b6e4f]"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-[16px]">
          <ThemeToggle />
          <button
            onClick={openContactModal}
            className="flex items-center gap-[8px] px-[24px] py-[12px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}
          >
            Hire me
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] border-t border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)] w-full transition-colors duration-300 ${className}`}
    >
      <div className="flex flex-col items-center size-full">
        {children}
      </div>
    </div>
  );
}

// ─── Divider label ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] text-[#070309] dark:text-white">
      {children}
    </p>
  );
}

// ─── Gradient text heading ────────────────────────────────────────────────────

function GradientHeading({
  children,
  isMobile,
  center = true,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  center?: boolean;
}) {
  return (
    <h2
      className={`font-['Poppins:Medium',sans-serif] leading-[1.15] tracking-[-0.03em] ${isMobile ? 'text-[32px]' : 'text-[48px]'} ${center ? 'text-center' : 'text-left'}`}
      style={{
        backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </h2>
  );
}

// ─── Section 1 — Origin Story ─────────────────────────────────────────────────

function OriginStory({ isMobile }: { isMobile: boolean }) {
  return (
    <Section>
      <div className={`max-w-[768px] w-full mx-auto flex flex-col items-center gap-[32px] ${isMobile ? 'px-[24px] py-[64px]' : 'px-[24px] py-[112px]'}`}>
        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Label>Where I come from</Label>
          <GradientHeading isMobile={isMobile}>
            A far corner of the world,<br />a wide view of it.
          </GradientHeading>
        </motion.div>

        <motion.p
          className="font-['Inter:Regular',sans-serif] text-[17px] md:text-[18px] leading-[1.8] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          I grew up in Anadyr, in Russia's Far North — a place where harsh climate
          and isolation paradoxically opened an early window into global culture and
          technology. That upbringing shaped my instinct for clarity and minimalism,
          a baseline trust in people, and a calm curiosity toward new things —
          qualities that now define how I approach UX/UI design.
        </motion.p>

        {/* Visual: location accent */}
        <motion.div
          className="flex items-center gap-[12px] mt-[8px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span
            className="px-[16px] py-[8px] rounded-[48px] font-['Inter:Regular',sans-serif] text-[13px]"
            style={{ background: 'rgba(11,110,79,0.08)', color: '#0b6e4f', border: '1px solid rgba(11,110,79,0.2)' }}
          >
            Anadyr, Russia
          </span>
          <span className="text-[rgba(18,21,14,0.3)] dark:text-gray-600 text-[18px]">→</span>
          <span
            className="px-[16px] py-[8px] rounded-[48px] font-['Inter:Regular',sans-serif] text-[13px]"
            style={{ background: 'rgba(11,110,79,0.08)', color: '#0b6e4f', border: '1px solid rgba(11,110,79,0.2)' }}
          >
            Alicante, Spain
          </span>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── Section 2 — Professional Path ───────────────────────────────────────────

const timelineSteps = [
  {
    year: '2000s',
    role: 'MSc Psychology',
    place: 'Taurida National University',
    desc: 'Academic foundation in how people think, decide, and behave.',
  },
  {
    year: '2010s',
    role: 'Kitchen Design',
    place: 'IKEA · 10 years',
    desc: 'Hundreds of real UX conversations — listening, framing problems, presenting solutions.',
  },
  {
    year: '2023',
    role: 'Moved to Spain',
    place: 'Alicante',
    desc: 'A new chapter, a new language, and the decision to make UX design official.',
  },
  {
    year: 'Now',
    role: 'UX/UI Designer',
    place: 'UX42.studio',
    desc: 'Working with startups, NGOs, and product teams across Europe.',
  },
];

function ProfessionalPath({ isMobile }: { isMobile: boolean }) {
  return (
    <Section>
      <div className={`max-w-[900px] w-full mx-auto flex flex-col items-center gap-[56px] ${isMobile ? 'px-[24px] py-[64px]' : 'px-[24px] py-[112px]'}`}>
        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Label>How I got here</Label>
          <GradientHeading isMobile={isMobile}>
            Psychology, IKEA,<br />and a move to Spain.
          </GradientHeading>
          <p className="font-['Inter:Regular',sans-serif] text-[17px] md:text-[18px] leading-[1.8] text-[rgba(18,21,14,0.71)] dark:text-gray-400 max-w-[640px]">
            I studied psychology at Taurida National University, completed a clinical
            residency, and then spent 10 years at IKEA helping hundreds of people
            design their kitchens. That role was essentially applied UX: deep
            listening, problem framing, iterative design, and presenting solutions
            that truly fit the user. In 2023 I moved to Spain and made it official —
            transitioning fully into UX/UI design.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className={`w-full ${isMobile ? 'flex flex-col gap-[0px]' : 'flex items-start gap-0'}`}>
          {timelineSteps.map((step, i) => (
            <motion.div
              key={step.year}
              className={`flex ${isMobile ? 'flex-row gap-[16px]' : 'flex-col flex-1'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Desktop connector */}
              {!isMobile && (
                <div className="flex items-center w-full mb-[20px]">
                  <div
                    className="w-[12px] h-[12px] rounded-full shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }}
                  />
                  {i < timelineSteps.length - 1 && (
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[rgba(11,110,79,0.4)] to-[rgba(11,110,79,0.1)]" />
                  )}
                </div>
              )}

              {/* Mobile connector */}
              {isMobile && (
                <div className="flex flex-col items-center pt-[4px]">
                  <div
                    className="w-[10px] h-[10px] rounded-full shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }}
                  />
                  {i < timelineSteps.length - 1 && (
                    <div className="w-[1px] flex-1 min-h-[40px] bg-gradient-to-b from-[rgba(11,110,79,0.4)] to-[rgba(11,110,79,0.1)] mt-[4px]" />
                  )}
                </div>
              )}

              <div className={`flex flex-col gap-[6px] ${isMobile ? 'pb-[32px]' : 'pr-[24px]'}`}>
                <p
                  className="font-['Inter:Semi_Bold',sans-serif] text-[12px] tracking-widest uppercase"
                  style={{ color: '#0b6e4f' }}
                >
                  {step.year}
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-[#070309] dark:text-white leading-[1.3]">
                  {step.role}
                </p>
                <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.5)] dark:text-gray-500">
                  {step.place}
                </p>
                <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[1.6] text-[rgba(18,21,14,0.71)] dark:text-gray-400 mt-[4px]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 3 — Process ──────────────────────────────────────────────────────

const processSteps = [
  {
    icon: <Search size={28} />,
    title: 'Research & Insight',
    desc: 'Psychology-backed UX research and user interviews to understand how people actually think — before any design begins.',
  },
  {
    icon: <LayoutPanelLeft size={28} />,
    title: 'Wireframe & Structure',
    desc: 'Low-fi wireframes to align on information architecture and user flows before any visual work starts.',
  },
  {
    icon: <FlaskConical size={28} />,
    title: 'Prototype & Test',
    desc: 'Interactive Figma prototypes validated with real users to catch friction early and iterate fast.',
  },
  {
    icon: <Handshake size={28} />,
    title: 'Handoff & Support',
    desc: 'Clean Figma files with design tokens, component docs, and developer notes. I stay available through launch.',
  },
];

function Process({ isMobile }: { isMobile: boolean }) {
  return (
    <Section>
      <div className={`max-w-[1080px] w-full mx-auto flex flex-col items-center gap-[64px] ${isMobile ? 'px-[24px] py-[64px]' : 'px-[24px] py-[112px]'}`}>
        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Label>My process</Label>
          <GradientHeading isMobile={isMobile}>
            Four steps, no shortcuts.
          </GradientHeading>
        </motion.div>

        <div className={`w-full grid gap-[24px] ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {processSteps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex flex-col gap-[20px] p-[28px] rounded-[24px] bg-white/60 dark:bg-[rgba(0,0,0,0.35)] border border-white/50 dark:border-[rgba(255,255,255,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_40px_rgba(212,241,230,0.25)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-[#0b6e4f]">{step.icon}</div>
                <span
                  className="font-['Poppins:Medium',sans-serif] text-[32px] leading-[1] opacity-10"
                  style={{ color: '#0b6e4f' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Poppins:Medium',sans-serif] text-[17px] text-[#070309] dark:text-white leading-[1.3]">
                  {step.title}
                </p>
                <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[1.7] text-[rgba(18,21,14,0.65)] dark:text-gray-400">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 4 — Why UX42 ────────────────────────────────────────────────────

const whyParagraphs = [
  '42 is the answer. To what exactly — depends on who\'s asking.',
  'For me, it started with a number from a science fiction book that somehow stuck. Not because I\'m looking for the meaning of life, but because I believe good design asks the right questions before offering any answers.',
  'UX42 is also for two — for the person who uses a product and the person who builds it. Design works when both sides are heard.',
  'I came to UX through psychology and a decade of helping people make decisions about their homes at IKEA. What I learned there: people don\'t want complicated. They want things that work, feel right, and respect their intelligence.',
  'I design with a simple principle in mind — the circle of empathy keeps expanding. First we design for ourselves, then for people like us, then for everyone. The best products live in that last place.',
];

function WhyUX42({ isMobile }: { isMobile: boolean }) {
  return (
    <Section>
      <div className={`max-w-[768px] w-full mx-auto flex flex-col items-center gap-[48px] ${isMobile ? 'px-[24px] py-[64px]' : 'px-[24px] py-[112px]'}`}>
        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Label>Why UX42?</Label>
          <GradientHeading isMobile={isMobile}>
            The number, the name,<br />the principle.
          </GradientHeading>
        </motion.div>

        <div className="flex flex-col gap-[24px] w-full">
          {whyParagraphs.map((text, i) => (
            <motion.p
              key={i}
              className="font-['Inter:Regular',sans-serif] text-[17px] md:text-[18px] leading-[1.8] text-[rgba(18,21,14,0.71)] dark:text-gray-400"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {text}
            </motion.p>
          ))}

          <motion.p
            className="font-['Poppins:Medium',sans-serif] text-[18px] md:text-[20px] leading-[1.5] text-[#070309] dark:text-white mt-[8px]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            style={{
              backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            UX42.studio is where I work from that place.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function Cta({ isMobile }: { isMobile: boolean }) {
  const { openContactModal } = useModal();

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300 border-t border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)]">
      <FloatingElements count={8} minBlur={20} maxBlur={50} />

      <div className={`relative z-10 max-w-[768px] mx-auto flex flex-col items-center text-center ${isMobile ? 'px-[24px] py-[80px]' : 'px-[24px] py-[120px]'}`}>
        <motion.p
          className="font-['Inter:Medium',sans-serif] text-[13px] text-[rgba(18,21,14,0.5)] dark:text-gray-500 mb-[16px] tracking-widest uppercase"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Open to new projects
        </motion.p>

        <motion.h2
          className={`font-['Poppins:Medium',sans-serif] text-[#070309] dark:text-white leading-[1.1] tracking-[-0.03em] mb-[24px] max-w-[560px] ${isMobile ? 'text-[34px]' : 'text-[52px]'}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {"Let's work"}
          <br />
          <span
            style={{
              backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            together.
          </span>
        </motion.h2>

        <motion.p
          className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 leading-[1.6] mb-[48px] max-w-[420px]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Whether you have a product idea, need a UX audit, or want
          to create impact through an NGO project — I would love to hear from you.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-[16px] justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <button
            onClick={openContactModal}
            className="flex items-center gap-[10px] px-[36px] py-[18px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}
          >
            Start a project
            <ArrowRight size={18} />
          </button>

          <a
            href="mailto:hello@ux42.studio"
            className="relative flex items-center gap-[10px] px-[36px] py-[18px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-[#070309] dark:text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <span
              aria-hidden="true"
              className="absolute border border-[#0b6e4f] border-solid inset-[-1px] pointer-events-none rounded-[48px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08)]"
            />
            <Mail size={18} />
            Email directly
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="bg-[rgba(255,255,255,0.88)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] w-full transition-colors duration-300">
      <div className={`max-w-[1280px] mx-auto ${isMobile ? 'px-[24px] py-[48px] flex flex-col gap-[24px]' : 'px-[64px] py-[40px] flex items-center justify-between'}`}>
        <div className="flex flex-col gap-[4px]">
          <p
            className="font-['Poppins:Medium',sans-serif] text-[18px]"
            style={{
              backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            UX42.studio
          </p>
          <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
            Aleksandra Burshtein · UX/UI Designer
          </p>
        </div>

        <div className={`flex items-center gap-[16px] font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 underline ${isMobile ? 'flex-wrap' : ''}`}>
          <Link to="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
          <Link to="/terms" className="hover:opacity-70 transition-opacity">Terms</Link>
          <Link to="/cookies" className="hover:opacity-70 transition-opacity">Cookies</Link>
        </div>
      </div>

      <div className="border-t border-[rgba(18,21,14,0.1)] dark:border-[rgba(255,255,255,0.08)]">
        <div className={`max-w-[1280px] mx-auto ${isMobile ? 'px-[24px] py-[16px]' : 'px-[64px] py-[16px]'} font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.5)] dark:text-gray-500`}>
          © 2025 UX42.studio. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { openMobileMenu } = useModal();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] flex flex-col w-full min-h-screen transition-colors duration-300">
      {isMobile && (
        <MobileHeader
          onMenuClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); openMobileMenu(); }}
          isMenuOpen={isMobileMenuOpen}
        />
      )}
      <Navbar isMobile={isMobile} />

      {/* Hero — subtle, not full-height */}
      <div className={`relative w-full overflow-hidden bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300 ${isMobile ? 'mt-[72px]' : 'mt-[76px]'}`}>
        <FloatingElements />
        <div className={`relative z-10 max-w-[768px] mx-auto flex flex-col items-center text-center ${isMobile ? 'px-[24px] py-[72px]' : 'px-[24px] py-[112px]'}`}>
          {/* Back link */}
          <motion.div
            className="mb-[32px] self-start"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-[8px] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.5)] dark:text-gray-500 hover:text-[#0b6e4f] dark:hover:text-[#10b981] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to portfolio
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-[24px]"
          >
            <span
              className="inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[13px]"
              style={{ color: '#0b6e4f', border: '1px solid rgba(11,110,79,0.25)', background: 'rgba(11,110,79,0.07)' }}
            >
              <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #0b6e4f, #2c5a07)' }} />
              About Aleksandra
            </span>

            <h1
              className={`font-['Poppins:Medium',sans-serif] leading-[1.1] tracking-[-0.03em] text-[#070309] dark:text-white ${isMobile ? 'text-[40px]' : 'text-[64px]'}`}
            >
              The designer
              {isMobile ? ' ' : <br />}
              <span
                style={{
                  backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                behind UX42.
              </span>
            </h1>

            <p className={`font-['Inter:Regular',sans-serif] leading-[1.7] text-[rgba(18,21,14,0.71)] dark:text-gray-400 max-w-[520px] ${isMobile ? 'text-[16px]' : 'text-[18px]'}`}>
              UX/UI designer with a background in psychology and 10 years
              at IKEA. I design with real attention to how people think and behave.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sections */}
      <OriginStory isMobile={isMobile} />
      <ProfessionalPath isMobile={isMobile} />
      <Process isMobile={isMobile} />
      <WhyUX42 isMobile={isMobile} />
      <Cta isMobile={isMobile} />
      <Footer isMobile={isMobile} />
    </div>
  );
}
