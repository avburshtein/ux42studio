import Link from "next/link";
import { ArrowUpRight, Dribbble, Linkedin, Mail } from "lucide-react";

type PortfolioFooterProps = {
  username: string;
  authorName: string;
  tagline: string;
};

export function PortfolioFooter({
  username,
  authorName,
  tagline,
}: PortfolioFooterProps) {
  return (
    <footer className="mx-auto w-full max-w-[var(--sizing-container-content)] px-4 py-12 md:px-16 md:py-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-title-lg text-[var(--md-sys-color-on-surface)]">
            {authorName}
          </p>
          <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">
            {tagline}
          </p>
          <div className="mt-2 flex items-center gap-5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-11 items-center justify-center text-[var(--md-sys-color-on-surface)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
            >
              <Linkedin size={20} aria-hidden />
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Dribbble"
              className="inline-flex size-11 items-center justify-center text-[var(--md-sys-color-on-surface)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
            >
              <Dribbble size={20} aria-hidden />
            </a>
            <a
              href="mailto:hello@ux42.studio"
              aria-label="Email"
              className="inline-flex size-11 items-center justify-center text-[var(--md-sys-color-on-surface)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
            >
              <Mail size={20} aria-hidden />
            </a>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <Link
            href="/privacy"
            className="inline-flex h-11 items-center text-label-md text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="inline-flex h-11 items-center text-label-md text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          >
            Terms
          </Link>
          <Link
            href="/cookies"
            className="inline-flex h-11 items-center text-label-md text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          >
            Cookies
          </Link>
        </nav>

        <Link
          href={`/${username}`}
          className="inline-flex h-12 items-center gap-2 text-button text-[var(--md-sys-color-primary)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          Back to Gallery
          <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>

      <div className="mt-12 border-t border-[var(--md-sys-color-outline-variant)] pt-6">
        <p className="text-body-sm text-[var(--md-sys-color-on-surface-variant)]">
          © {new Date().getFullYear()} UX42.studio — Digital Craftsmanship
        </p>
      </div>
    </footer>
  );
}
