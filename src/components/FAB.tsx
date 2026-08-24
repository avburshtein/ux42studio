import { CircleHelp } from 'lucide-react';
import Link from 'next/link';

interface FABProps { href?: string; ariaLabel?: string; }

export function FAB({ href = '#contact', ariaLabel = 'Help' }: FABProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="fixed bottom-8 right-8 z-50 inline-flex h-16 w-16 items-center justify-center rounded-tl-full rounded-tr-full rounded-bl-full rounded-br-none bg-secondary-fixed-dim shadow-lg hover:opacity-90 transition-opacity"
    >
      <CircleHelp size={24} className="text-on-secondary-fixed" />
    </Link>
  );
}
