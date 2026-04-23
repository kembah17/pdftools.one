import Link from 'next/link';
import { tools } from '@/lib/tools-data';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-footer-bg)',
        color: 'var(--color-footer-text)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: 'var(--color-brand)', color: '#FFFFFF' }}
              >
                PDF
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--color-footer-text)' }}>
                PDF<span style={{ color: 'var(--color-footer-link)' }}>Tools</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-footer-muted)' }}>
              Free online PDF tools that work entirely in your browser. No uploads, no sign-ups, no data collection. Your files never leave your device.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-footer-text)' }}>PDF Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={tool.slug}
                    className="text-sm no-underline hover:underline"
                    style={{ color: 'var(--color-footer-muted)' }}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-footer-text)' }}>Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm no-underline hover:underline" style={{ color: 'var(--color-footer-muted)' }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm no-underline hover:underline" style={{ color: 'var(--color-footer-muted)' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm no-underline hover:underline" style={{ color: 'var(--color-footer-muted)' }}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center text-sm"
          style={{
            borderTop: '1px solid var(--color-footer-border)',
            color: 'var(--color-footer-muted)',
          }}
        >
          &copy; {new Date().getFullYear()} PDFTools.one. All rights reserved. All processing happens in your browser.
        </div>
      </div>
    </footer>
  );
}
