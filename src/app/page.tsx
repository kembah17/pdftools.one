import Link from 'next/link';
import { AdSlot } from '@/components/ui/AdSlot';
import WebSiteSchema from '@/components/seo/WebSiteSchema';
import { PrivacyBadge } from '@/components/ui/PrivacyBadge';

const tools = [
  {
    name: 'Merge PDF',
    href: '/merge-pdf',
    description: 'Combine multiple PDF files into a single document. Drag and drop to reorder pages.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Split PDF',
    href: '/split-pdf',
    description: 'Extract specific pages or split a PDF into multiple separate files.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
  },
  {
    name: 'Compress PDF',
    href: '/compress-pdf',
    description: 'Reduce PDF file size while maintaining quality. Perfect for email attachments.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    name: 'PDF to JPG',
    href: '/pdf-to-jpg',
    description: 'Convert PDF pages to high-quality JPG images. Download individually or as ZIP.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'JPG to PDF',
    href: '/jpg-to-pdf',
    description: 'Convert JPG images into a PDF document. Supports multiple images with reordering.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'PDF to Word',
    href: '/pdf-to-word',
    description: 'Convert PDF documents to editable Word (.docx) format with text extraction.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Rotate PDF',
    href: '/rotate-pdf',
    description: 'Rotate PDF pages to any orientation. Rotate individual pages or all at once.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

const steps = [
  { step: '1', title: 'Upload Your PDF', description: 'Drag and drop your PDF file or click to browse. Files stay in your browser.' },
  { step: '2', title: 'Choose Your Action', description: 'Select from merge, split, compress, convert, or rotate tools.' },
  { step: '3', title: 'Download Result', description: 'Get your processed file instantly. No email required, no waiting.' },
];

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />

      {/* Hero Section */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Free Online <span className="text-primary">PDF Tools</span>
          </h1>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-8">
            Merge, split, compress, convert, and rotate PDFs entirely in your browser.
            No uploads, no sign-ups, no limits — your files never leave your device.
          </p>
          <PrivacyBadge />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <AdSlot slot="leaderboard" />

        {/* Tools Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 text-center">All PDF Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block p-6 bg-surface border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all"
              >
                <div className="text-primary mb-3 group-hover:scale-110 transition-transform inline-block">
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-lg text-text mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-text-light leading-relaxed">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot slot="in-content" />

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-surface rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-light">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text mb-8 text-center">Why Choose PDFTools.one?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: '100% Private', desc: 'Your files are processed entirely in your browser. Nothing is uploaded to any server.' },
              { title: 'Completely Free', desc: 'All tools are free to use with no hidden fees, no sign-ups, and no file limits.' },
              { title: 'Lightning Fast', desc: 'Client-side processing means instant results. No waiting for server uploads or downloads.' },
              { title: 'Works Offline', desc: 'Once loaded, our tools work without an internet connection since all logic runs locally.' },
            ].map(item => (
              <div key={item.title} className="p-6 bg-surface border border-border rounded-xl shadow-sm">
                <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                <p className="text-sm text-text-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slot="footer" />
      </div>
    </>
  );
}
