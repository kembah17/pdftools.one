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

                {/* More Free Tools */}
        <div style={{ borderTop: '1px solid var(--color-footer-border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
          <h4 style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-footer-text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>More Free Tools</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.5rem' }}>
            <a href="https://pictools.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🖼️ Image Tools</a>
            <a href="https://percentcalc.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🔢 Percentage Calculator</a>
            <a href="https://developertools.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>💻 Developer Tools</a>
            <a href="https://wordcount.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>📝 Word Counter</a>
            <a href="https://texttools.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🔤 Text Tools</a>
            <a href="https://socialmediatools.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>📱 Social Media Tools</a>
            <a href="https://randomize.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🎲 Random Generator</a>
            <a href="https://qrcodegenerator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>📲 QR Code Generator</a>
            <a href="https://gpacalculator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🎓 GPA Calculator</a>
            <a href="https://invoicegenerator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🧾 Invoice Generator</a>
            <a href="https://caloriecalculator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🔥 Calorie Calculator</a>
            <a href="https://passwordgenerator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>🔐 Password Generator</a>
            <a href="https://datecalculator.one" target="_blank" rel="noopener" style={{ fontSize: '0.8125rem', color: 'var(--color-footer-muted)', textDecoration: 'none' }}>📅 Date Calculator</a>
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
