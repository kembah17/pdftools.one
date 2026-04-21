"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border dark:border-border-dark">
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
          <div className="hidden md:flex items-center gap-6">
            <Link href="/merge-pdf" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">Merge</Link>
            <Link href="/split-pdf" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">Split</Link>
            <Link href="/compress-pdf" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">Compress</Link>
            <Link href="/pdf-to-jpg" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">PDF→JPG</Link>
            <Link href="/jpg-to-pdf" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">JPG→PDF</Link>
            <Link href="/pdf-to-word" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">PDF→Word</Link>
            <Link href="/rotate-pdf" className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">Rotate</Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-dark-alt transition-colors"
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
              {[
                { href: "/merge-pdf", label: "Merge PDF" },
                { href: "/split-pdf", label: "Split PDF" },
                { href: "/compress-pdf", label: "Compress PDF" },
                { href: "/pdf-to-jpg", label: "PDF to JPG" },
                { href: "/jpg-to-pdf", label: "JPG to PDF" },
                { href: "/pdf-to-word", label: "PDF to Word" },
                { href: "/rotate-pdf", label: "Rotate PDF" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm text-text-light hover:bg-surface-alt dark:text-text-dark-muted dark:hover:bg-surface-dark-alt transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
