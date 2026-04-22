import Link from 'next/link';
import { AdSlot } from '@/components/ui/AdSlot';

const tools = [
  { name: 'Merge PDF', href: '/merge-pdf' },
  { name: 'Split PDF', href: '/split-pdf' },
  { name: 'Compress PDF', href: '/compress-pdf' },
  { name: 'PDF to JPG', href: '/pdf-to-jpg' },
  { name: 'JPG to PDF', href: '/jpg-to-pdf' },
  { name: 'PDF to Word', href: '/pdf-to-word' },
  { name: 'Rotate PDF', href: '/rotate-pdf' },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <AdSlot slot="footer" />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-text mb-3">PDFTools.one</h3>
            <p className="text-sm text-text-light leading-relaxed">
              Free online PDF tools. All processing happens in your browser — your files never leave your device.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-text mb-3">Tools</h3>
            <ul className="space-y-2">
              {tools.map(tool => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-sm text-text-light hover:text-primary transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-text mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-text-light hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-text-light hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-light hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-light">
          &copy; {new Date().getFullYear()} PDFTools.one. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
