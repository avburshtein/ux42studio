import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ThemeToggle } from '../components/ThemeToggle';
import { FloatingElements } from '../components/FloatingElements';
import { PortfolioGallery } from '../components/PortfolioGallery';
import { PortfolioGalleryMobile } from '../components/PortfolioGalleryMobile';
import { useModal } from '../contexts/ModalContext';
import { useTheme } from '../contexts/ThemeContext';
import { MobileHeader } from '../components/MobileHeader';
import {
  ArrowRight,
  Mail,
  Instagram,
  Linkedin,
  CheckCircle2,
  Heart,
  Brain,
} from 'lucide-react';

// ─── Google UX Certification Badge ───────────────────────────────────────────

function GoogleCertBadge() {
  return (
    <div className="inline-flex items-center gap-[10px] px-[16px] py-[10px] rounded-[16px] bg-white dark:bg-[rgba(30,30,30,0.95)] shadow-[2px_2px_12px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_12px_0px_rgba(0,0,0,0.4)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]">
      {/* Google G Logo */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>

      <div className="flex flex-col gap-[1px]">
        <p className="font-['Inter:Semi_Bold',sans-serif] text-[11px] text-[#070309] dark:text-white leading-[1.2]">
          Google UX Design
        </p>
        <p className="font-['Inter:Regular',sans-serif] text-[10px] text-[rgba(18,21,14,0.6)] dark:text-gray-400 leading-[1.2]">
          Certificate · In progress
        </p>
      </div>

      <CheckCircle2 size={16} className="text-[#0b6e4f] shrink-0" />
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ isMobile }: { isMobile: boolean }) {
  const { openContactModal } = useModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isMobile) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(15,15,15,0.70)] backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
    >
      <div className="max-w-[1280px] mx-auto px-[64px] py-[20px] flex items-center justify-between">
        {/* Logo / Name */}
        <p
          className="font-['Poppins:Medium',sans-serif] text-[18px] leading-[1.2]"
          style={{
            backgroundImage:
              'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          UX42.studio
        </p>

        {/* Nav Links */}
        <div className="flex items-center gap-[32px]">
          <a
            href="#portfolio"
            className="font-['Inter:Regular',sans-serif] text-[16px] text-[#0b6e4f] hover:opacity-70 transition-opacity"
          >
            Work
          </a>
          <Link
            to="/about"
            className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 hover:text-[#0b6e4f] dark:hover:text-[#10b981] transition-colors"
          >
            About
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-[16px]">
          <ThemeToggle />
          <button
            onClick={openContactModal}
            className="flex items-center gap-[8px] px-[24px] py-[12px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
            }}
          >
            Hire me
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ isMobile }: { isMobile: boolean }) {
  const { openContactModal } = useModal();

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300 ${
        isMobile ? 'min-h-[560px]' : 'min-h-[760px]'
      }`}
    >
      <FloatingElements />

      <div
        className={`relative z-10 max-w-[1280px] mx-auto flex flex-col items-start justify-center h-full ${
          isMobile
            ? 'px-[24px] py-[64px]'
            : 'px-[64px] py-[112px]'
        }`}
      >

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-['Poppins:Medium',sans-serif] leading-[1.1] tracking-[-0.03em] text-[#070309] dark:text-white mb-[24px] max-w-[860px] ${
            isMobile ? 'text-[38px]' : 'text-[68px]'
          }`}
        >
          Design rooted in{isMobile ? ' ' : <br />}
          <span
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            psychology
          </span>{' '}
          & people.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`font-['Inter:Regular',sans-serif] leading-[1.6] text-[rgba(18,21,14,0.71)] dark:text-gray-400 mb-[32px] max-w-[560px] ${
            isMobile ? 'text-[16px]' : 'text-[18px]'
          }`}
        >
          UX/UI designer with a background in psychology and 10 years
          in retail. I design websites, mobile apps, and landing pages
          with real attention to how people think and behave.
        </motion.p>

        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap gap-[16px] items-center"
        >
          <button
            onClick={openContactModal}
            className="flex items-center gap-[10px] px-[32px] py-[16px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
            }}
          >
            Start a project
            <ArrowRight size={18} />
          </button>

          <a
            href="#portfolio"
            className="relative flex items-center gap-[8px] px-[32px] py-[16px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-[#070309] dark:text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <span
              aria-hidden="true"
              className="absolute border border-[#0b6e4f] border-solid inset-[-1px] pointer-events-none rounded-[48px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.08)]"
            />
            View work
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className={`flex mt-[64px] ${isMobile ? 'flex-wrap gap-[24px]' : 'gap-[48px]'}`}
        >
          {[
            { value: '10+', label: 'Years in business' },
            { value: 'MSc', label: 'Psychology' },
            { value: 'NGO', label: 'Pro bono available' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-[4px]">
              <p
                className="font-['Poppins:Medium',sans-serif] text-[26px] leading-[1.1]"
                style={{
                  backgroundImage:
                    'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
              <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme();
  const { openContactModal } = useModal();

  const skills = [
    'UX Research',
    'Wireframing',
    'Prototyping',
    'Figma Handoff',
    'Web Design',
    'Mobile Apps',
    'Landing Pages',
    'Psychology-led UX',
  ];

  const process = [
    { icon: <Brain size={20} />, title: 'Research & Insight', desc: 'I start with understanding how people think — psychology-backed UX research and user interviews.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>, title: 'Wireframe & Structure', desc: 'Low-fi wireframes to align on information architecture before any visual work begins.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title: 'Prototype & Test', desc: 'Interactive Figma prototypes validated with real users to catch issues early.' },
    { icon: <CheckCircle2 size={20} />, title: 'Handoff & Support', desc: 'Clean Figma files with design tokens, component documentation, and developer notes.' },
  ];

  const cardStyle = {
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    background: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
    boxShadow: theme === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.4)'
      : '0 2px 8px rgba(0,0,0,0.06), 0 16px 56px rgba(212,241,230,0.25)',
  };

  return (
    <div
      id="about"
      className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] border-t border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.06)] w-full transition-colors duration-300"
    >
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className={`content-stretch flex flex-col items-center ${isMobile ? 'px-[24px] py-[64px]' : 'px-[48px] lg:px-[64px] py-[80px] md:py-[100px] lg:py-[120px]'} relative w-full`}>
          <div className="content-stretch flex flex-col gap-[60px] items-center max-w-[1280px] relative shrink-0 w-full">

            {/* Section Title — mirror of Portfolio */}
            <div className="content-stretch flex flex-col gap-[24px] items-center max-w-[768px] not-italic relative shrink-0 text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-center w-full">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] text-[#070309] dark:text-white">
                About
              </p>
              <p className={`font-['Poppins:Medium',sans-serif] leading-[1.2] relative shrink-0 tracking-[-0.52px] w-full text-[rgba(18,21,14,0.71)] dark:text-gray-400 ${isMobile ? 'text-[28px]' : 'text-[32px] md:text-[42px] lg:text-[52px]'}`}>
                People-centered design begins with real curiosity.
              </p>
              <div className="flex flex-col gap-[12px] w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.7] text-[16px] md:text-[18px] dark:text-gray-400 w-full">
                  I am Aleksandra Burshtein — UX/UI designer with a background in
                  psychology and 10 years of experience in retail. That combination
                  gives me an unusual edge: I understand both business goals and the
                  human behaviour that drives them.
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.7] text-[16px] md:text-[18px] dark:text-gray-400 w-full">
                  My process includes UX research, wireframing, prototyping, and
                  Figma handoff. I design websites, mobile apps, and landing pages
                  with real attention to how people think and behave — not just how
                  they look.
                </p>
              </div>
            </div>

            {/* Two-column cards */}
            <div className={`grid w-full gap-[24px] ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>

              {/* Left column: Areas of expertise + Tools + Google badge */}
              <div className="flex flex-col gap-[24px]">
                {/* Areas of expertise */}
                <div className="rounded-[24px] p-[28px] flex flex-col gap-[20px]" style={cardStyle}>
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                    Areas of expertise
                  </p>
                  <div className="flex flex-wrap gap-[10px]">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-[14px] py-[8px] rounded-[12px] font-['Inter:Medium',sans-serif] text-[13px] text-white shadow-[1px_1px_4px_0px_rgba(0,0,0,0.1)]"
                        style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div className="rounded-[24px] p-[28px] flex flex-col gap-[16px]" style={cardStyle}>
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                    Tools
                  </p>
                  <div className="flex flex-wrap gap-[8px]">
                    {['Figma', 'FigJam', 'Maze', 'Protopie', 'Webflow', 'Adobe Firefly', 'Cursor'].map((tool) => (
                      <span
                        key={tool}
                        className="px-[12px] py-[6px] rounded-[10px] font-['Inter:Regular',sans-serif] text-[12px] bg-white dark:bg-[rgba(40,40,40,0.95)] text-[rgba(18,21,14,0.71)] dark:text-gray-300 border border-[rgba(11,110,79,0.2)]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Google cert badge */}
                <div className="flex flex-col gap-[12px] px-[4px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                    Certification
                  </p>
                  <GoogleCertBadge />
                </div>
              </div>

              {/* Right column: My process */}
              <div className="flex flex-col gap-[24px]">
                <div className="rounded-[24px] p-[28px] flex flex-col gap-[20px] h-full" style={cardStyle}>
                  <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                    My process
                  </p>
                  <div className="flex flex-col gap-[24px]">
                    {process.map((step, i) => (
                      <div key={i} className="flex items-start gap-[14px]">
                        <div className="text-[#0b6e4f] shrink-0 mt-[2px]">{step.icon}</div>
                        <div className="flex flex-col gap-[4px]">
                          <p className="font-['Inter:Semi_Bold',sans-serif] text-[14px] text-[#070309] dark:text-white">
                            {step.title}
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] text-[13px] leading-[1.6] text-[rgba(18,21,14,0.6)] dark:text-gray-500">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: NGO callout + CTA button */}
            <div className={`flex w-full items-center ${isMobile ? 'flex-col gap-[20px]' : 'gap-[32px]'} justify-between p-[28px] rounded-[24px]`}
              style={{
                background: 'rgba(11,110,79,0.07)',
                border: '1px solid rgba(11,110,79,0.2)',
              }}
            >
              <div className="flex items-start gap-[14px] flex-1">
                <Heart size={20} className="text-[#0b6e4f] shrink-0 mt-[2px]" />
                <p className="font-['Inter:Regular',sans-serif] text-[15px] leading-[1.6] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                  <span className="font-['Inter:Semi_Bold',sans-serif] text-[#0b6e4f]">
                    Open to pro bono projects for NGOs
                  </span>{' '}
                  — a great way to create real impact together while building
                  meaningful portfolio cases.
                </p>
              </div>
              <button
                onClick={openContactModal}
                className={`shrink-0 flex items-center gap-[10px] px-[28px] py-[14px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[15px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95 ${isMobile ? 'w-full justify-center' : ''}`}
                style={{ backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)' }}
              >
                <Mail size={16} />
                Get in touch
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function Cta({ isMobile }: { isMobile: boolean }) {
  const { openContactModal } = useModal();

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300">
      <FloatingElements count={10} minBlur={20} maxBlur={50} />

      <div
        className={`relative z-10 max-w-[1280px] mx-auto flex flex-col items-center text-center ${
          isMobile ? 'px-[24px] py-[80px]' : 'px-[64px] py-[120px]'
        }`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-['Inter:Medium',sans-serif] text-[13px] text-[rgba(18,21,14,0.5)] dark:text-gray-500 mb-[16px] tracking-widest uppercase"
        >
          Ready to build something meaningful?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-['Poppins:Medium',sans-serif] text-[#070309] dark:text-white leading-[1.1] tracking-[-0.03em] mb-[24px] max-w-[680px] ${
            isMobile ? 'text-[34px]' : 'text-[52px]'
          }`}
        >
          {"Let's design something"}
          <br />
          <span
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            people actually love.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 leading-[1.6] mb-[12px] max-w-[480px]"
        >
          Whether you have a product idea, need a UX audit, or want to
          create impact through an NGO project — I would love to hear
          from you.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.5)] dark:text-gray-500 mb-[48px]"
        >
          Pro bono spots available for NGOs and social-impact projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap gap-[16px] justify-center"
        >
          <button
            onClick={openContactModal}
            className="flex items-center gap-[10px] px-[36px] py-[18px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
            }}
          >
            Start a conversation
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
      <div
        className={`max-w-[1280px] mx-auto ${
          isMobile
            ? 'px-[24px] py-[48px] flex flex-col gap-[32px]'
            : 'px-[64px] py-[60px] flex items-center justify-between'
        }`}
      >
        {/* Left */}
        <div className="flex flex-col gap-[6px]">
          <p
            className="font-['Poppins:Medium',sans-serif] text-[18px]"
            style={{
              backgroundImage:
                'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
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

        {/* Social icons */}
        <div className="flex items-center gap-[20px]">
          {[
            {
              icon: <Linkedin size={20} />,
              label: 'LinkedIn',
              href: 'https://linkedin.com',
            },
            {
              icon: <Instagram size={20} />,
              label: 'Instagram',
              href: '#',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/>
                </svg>
              ),
              label: 'Behance',
              href: '#',
            },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgba(18,21,14,0.71)] dark:text-gray-400 hover:text-[#0b6e4f] dark:hover:text-[#10b981] transition-colors duration-200"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Legal */}
        <div
          className={`flex items-center gap-[16px] font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 underline ${
            isMobile ? 'flex-wrap' : ''
          }`}
        >
          <Link to="/privacy" className="hover:opacity-70 transition-opacity">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:opacity-70 transition-opacity">
            Terms
          </Link>
          <Link to="/cookies" className="hover:opacity-70 transition-opacity">
            Cookies
          </Link>
        </div>
      </div>

      <div className="border-t border-[rgba(18,21,14,0.1)] dark:border-[rgba(255,255,255,0.08)]">
        <div
          className={`max-w-[1280px] mx-auto ${
            isMobile ? 'px-[24px] py-[20px]' : 'px-[64px] py-[20px]'
          } font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.5)] dark:text-gray-500`}
        >
          © 2025 UX42.studio. All rights reserved.
          <Link to="/case-template" className="ml-[16px] opacity-30 hover:opacity-70 transition-opacity">🔧</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const { openMobileMenu } = useModal();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    openMobileMenu();
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] flex flex-col items-start relative w-full min-h-screen transition-colors duration-300">
      {isMobile && (
        <MobileHeader
          onMenuClick={handleMobileMenuClick}
          isMenuOpen={isMobileMenuOpen}
        />
      )}
      <Navbar isMobile={isMobile} />

      <div className={`flex flex-col w-full gap-0 ${isMobile ? 'mt-[72px]' : 'mt-[76px]'}`}>
        <Hero isMobile={isMobile} />

        <div id="portfolio">
          {isMobile ? <PortfolioGalleryMobile /> : <PortfolioGallery />}
        </div>

        <About isMobile={isMobile} />
        <Cta isMobile={isMobile} />
        <Footer isMobile={isMobile} />
      </div>
    </div>
  );
}
