import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-alt dark:bg-surface-dark-alt border-t border-border dark:border-border-dark mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-bold text-xl text-primary dark:text-secondary">
              pdftools.one
            </Link>
            <p className="mt-3 text-sm text-text-light dark:text-text-dark-muted">
              Free online PDF tools that run 100% in your browser. Your files never leave your device.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-text dark:text-text-dark mb-3">PDF Tools</h3>
            <ul className="space-y-2">
              {[
                { href: "/merge-pdf", label: "Merge PDF" },
                { href: "/split-pdf", label: "Split PDF" },
                { href: "/compress-pdf", label: "Compress PDF" },
                { href: "/pdf-to-jpg", label: "PDF to JPG" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="font-semibold text-text dark:text-text-dark mb-3">More Tools</h3>
            <ul className="space-y-2">
              {[
                { href: "/jpg-to-pdf", label: "JPG to PDF" },
                { href: "/pdf-to-word", label: "PDF to Word" },
                { href: "/rotate-pdf", label: "Rotate PDF" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text dark:text-text-dark mb-3">Company</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-light hover:text-primary dark:text-text-dark-muted dark:hover:text-secondary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-light dark:text-text-dark-muted">
            &copy; {new Date().getFullYear()} pdftools.one. All rights reserved.
          </p>
          <div className="privacy-badge">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>100% client-side processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
