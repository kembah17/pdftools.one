"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/merge-pdf", label: "Merge", color: "bg-blue-500" },
    { href: "/split-pdf", label: "Split", color: "bg-purple-500" },
    { href: "/compress-pdf", label: "Compress", color: "bg-emerald-500" },
    { href: "/pdf-to-jpg", label: "PDF→JPG", color: "bg-amber-500" },
    { href: "/jpg-to-pdf", label: "JPG→PDF", color: "bg-rose-500" },
    { href: "/pdf-to-word", label: "PDF→Word", color: "bg-sky-500" },
    { href: "/rotate-pdf", label: "Rotate", color: "bg-indigo-500" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-border dark:border-border-dark shadow-sm dark:shadow-none">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary dark:text-secondary">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="2" width="24" height="28" rx="3" className="fill-primary dark:fill-secondary" />
              <path d="M10 10h12M10 16h12M10 22h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            pdftools.one
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-text dark:text-text-dark-muted hover:bg-surface-alt dark:hover:bg-surface-dark-alt hover:text-primary dark:hover:text-secondary transition-all border border-transparent hover:border-border dark:hover:border-border-dark"
              >
                {link.label}
              </Link>
            ))}

            {/* Toggle Switch */}
            <div className="ml-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "dark" ? "bg-secondary" : "bg-slate-300"
                }`}
                role="switch"
                aria-checked={theme === "dark"}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <svg className="w-4 h-4 text-text-light dark:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                theme === "dark" ? "bg-secondary" : "bg-slate-300"
              }`}
              role="switch"
              aria-checked={theme === "dark"}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors border border-border dark:border-border-dark"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-border dark:border-border-dark mt-2 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text dark:text-text-dark-muted hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors border border-border dark:border-border-dark"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={`w-2 h-2 rounded-full ${link.color}`} />
                  {link.label.replace("→", " → ")}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
