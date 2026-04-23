'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tools } from '@/lib/tools-data';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 85%, transparent)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: 'var(--color-brand)', color: '#FFFFFF' }}
          >
            PDF
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>
            PDF<span style={{ color: 'var(--color-brand)' }}>Tools</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.slug}
              className="px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors"
              style={{
                color: hoveredLink === tool.slug ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                backgroundColor: hoveredLink === tool.slug ? 'var(--color-brand-lightest)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredLink(tool.slug)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {tool.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Toggle Switch */}
          <button
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.25rem",
                borderRadius: "9999px",
                border: "2px solid var(--color-border, #CBD5E1)",
                backgroundColor: dark ? "var(--color-primary, #10B981)" : "var(--color-border, #CBD5E1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "4rem",
                height: "2rem",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <span style={{ position: "absolute", left: "0.375rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", opacity: dark ? 0.4 : 1, transition: "opacity 0.3s ease", lineHeight: 1 }}>☀️</span>
              <span style={{ position: "absolute", right: "0.375rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", opacity: dark ? 1 : 0.4, transition: "opacity 0.3s ease", lineHeight: 1 }}>🌙</span>
              <span style={{ position: "absolute", top: "2px", left: dark ? "calc(100% - 1.625rem)" : "2px", width: "1.5rem", height: "1.5rem", borderRadius: "50%", backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "left 0.3s ease" }} />
            </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-bg-secondary)',
            }}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden px-4 pb-4"
          style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border-light)' }}
        >
          <nav className="flex flex-col gap-1 pt-2">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.slug}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium no-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span className="mr-2">{tool.icon}</span>
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
