'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tools } from '@/lib/tools-data';

export default function HomeToolGrid() {
  const remaining = tools.slice(3);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {remaining.map((tool) => (
        <Link
          key={tool.slug}
          href={tool.slug}
          className="group rounded-xl p-6 no-underline transition-all duration-200"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: hoveredSlug === tool.slug ? '2px solid var(--color-brand)' : '2px solid var(--color-border)',
            boxShadow: hoveredSlug === tool.slug ? 'var(--shadow-lg)' : 'var(--shadow-card)',
            transform: hoveredSlug === tool.slug ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => setHoveredSlug(tool.slug)}
          onMouseLeave={() => setHoveredSlug(null)}
        >
          <div className="text-3xl mb-3">{tool.icon}</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-heading)' }}>
            {tool.name}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
            {tool.shortDesc}
          </p>
          <div
            className="mt-4 text-sm font-medium flex items-center gap-1"
            style={{ color: 'var(--color-brand)' }}
          >
            Use Tool
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
