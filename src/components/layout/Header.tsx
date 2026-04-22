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
            className="relative flex items-center cursor-pointer"
            style={{
              width: '56px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: isDark ? 'var(--color-brand)' : 'var(--color-toggle-track)',
              border: '2px solid',
              borderColor: isDark ? 'var(--color-brand-dark)' : 'var(--color-border)',
              transition: 'all 0.3s ease',
              padding: '2px',
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            role="switch"
            aria-checked={isDark}
          >
            {/* Sun icon (left side) */}
            <span
              className="absolute flex items-center justify-center"
              style={{
                left: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                opacity: isDark ? 0.4 : 0,
                transition: 'opacity 0.3s ease',
                color: '#FCD34D',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>

            {/* Moon icon (right side) */}
            <span
              className="absolute flex items-center justify-center"
              style={{
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                opacity: isDark ? 0 : 0.4,
                transition: 'opacity 0.3s ease',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>

            {/* Sliding thumb */}
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: isDark ? '30px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-toggle-thumb)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                transition: 'left 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDark ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
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
