import { Mail } from 'lucide-react';
import Link from 'next/link';

interface FABProps {
  href?: string;
  /** Имя кнопки для скринридера. По умолчанию — «Contact us»: */
  ariaLabel?: string;
}

/**
 * FAB — Floating Action Button (`/u/[slug]`).
 *
 * Ведёт к секции контакта (`#contact` → CtaSection), т.е. это быстрый доступ
 * к email/WhatsApp, а НЕ виртуальный помощник.
 *
 * История: до 2026-09-26 здесь стояла иконка `CircleHelp` с `aria-label="Help"`,
 * что обещало несуществующего ИИ-ассистента (кнопка просто скроллила к контакту).
 * Иконка и имя приведены в соответствие с реальным поведением.
 * План по настоящему ассистенту: `Docs/roadmap/ai-assistant-fab.md`.
 *
 * Внешний вид: 64×64 (Main_page_Spec §11), фиксирован в правом нижнем углу,
 * z-50 (выше шапки z-40). Светлое «стекло»: --md-sys-color-secondary-fixed-dim
 * + backdrop-blur (тот же приём, что в header-glass, и по той же причине —
 * LightningCSS вырезает стандартный backdrop-filter, блюр даёт только
 * Tailwind-утилита). Текст/иконка — --md-sys-color-on-secondary-fixed.
 * HEX не хардкодим: пару токенов задаёт тема (см. globals.css).
 */
export function FAB({ href = '#contact', ariaLabel = 'Contact us' }: FABProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="fixed bottom-8 right-8 z-50 inline-flex h-16 w-16 items-center justify-center rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-secondary-fixed-dim backdrop-blur-md shadow-lg hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Mail size={24} className="text-on-secondary-fixed" aria-hidden />
    </Link>
  );
}
