'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const tools = [
  { name: 'Merge PDF', href: '/merge-pdf' },
  { name: 'Split PDF', href: '/split-pdf' },
  { name: 'Compress PDF', href: '/compress-pdf' },
  { name: 'PDF to JPG', href: '/pdf-to-jpg' },
  { name: 'JPG to PDF', href: '/jpg-to-pdf' },
  { name: 'PDF to Word', href: '/pdf-to-word' },
  { name: 'Rotate PDF', href: '/rotate-pdf' },
];

export default function Header() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    if (!dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-surface border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDFTools<span className="text-text">.one</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1">
            {tools.slice(0, 4).map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-3 py-1.5 text-sm text-text-light hover:text-primary hover:bg-primary-light rounded-md transition-colors"
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="px-3 py-1.5 text-sm text-text-light hover:text-primary hover:bg-primary-light rounded-md transition-colors">
                More ▾
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {tools.slice(4).map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="block px-4 py-2 text-sm text-text-light hover:text-primary hover:bg-primary-light transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Dark/Light Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus:outline-none"
            style={{ backgroundColor: dark ? 'var(--color-primary)' : 'var(--color-border)' }}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-surface shadow-sm transition-transform ${
                dark ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
            <span className="absolute left-1.5 text-xs">{dark ? '☾' : ''}</span>
            <span className="absolute right-1.5 text-xs">{dark ? '' : '☀'}</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-surface-alt hover:bg-primary-light text-text-light hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-2">
          {tools.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-text-light hover:text-primary hover:bg-primary-light rounded-md transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
