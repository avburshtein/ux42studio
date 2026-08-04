"use client";

import Link from "next/link";
import { Globe, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type PortfolioHeaderProps = {
  username: string;
};

export function PortfolioHeader({ username }: PortfolioHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"EN" | "ES">("EN");

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  function toggleLang() {
    setLang((prev) => (prev === "EN" ? "ES" : "EN"));
  }

  return (
    <header className="mx-auto flex h-24 w-full max-w-[var(--sizing-container-page)] items-center justify-between px-4 md:px-16">
      <div className="flex items-center gap-6 md:gap-10">
        <Link
          href={`/${username}`}
          className="flex h-16 min-w-[89px] items-center text-title-lg text-[var(--md-sys-color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          aria-label="UX42 Portfolio home"
        >
          UX42
        </Link>
        <nav aria-label="Portfolio" className="flex items-center gap-6">
          <Link
            href={`/${username}`}
            className="inline-flex h-11 min-w-10 items-center text-label-md text-[var(--md-sys-color-on-surface)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          >
            Works
          </Link>
          <Link
            href={`/${username}#about`}
            className="inline-flex h-11 min-w-[47px] items-center text-label-md text-[var(--md-sys-color-on-surface)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
          >
            About Me
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
          className="inline-flex size-12 items-center justify-center rounded-[var(--radius-base)] text-[var(--md-sys-color-on-surface)] transition-colors hover:bg-[var(--md-sys-surface-tint-8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          {theme === "light" ? (
            <Moon size={20} aria-hidden />
          ) : (
            <Sun size={20} aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={toggleLang}
          aria-label={`Language: ${lang}. Switch language`}
          className="inline-flex h-12 min-w-[96px] items-center justify-center gap-2 rounded-[var(--radius-base)] px-3 text-label-md text-[var(--md-sys-color-on-surface)] transition-colors hover:bg-[var(--md-sys-surface-tint-8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          <Globe size={18} aria-hidden />
          <span>{lang}</span>
        </button>
      </div>
    </header>
  );
}
