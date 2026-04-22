import type { Metadata } from 'next';
import { AdSlot } from '@/components/ui/AdSlot';

export const metadata: Metadata = {
  title: 'About PDFTools.one — Free Online PDF Tools',
  description: 'Learn about PDFTools.one, our mission to provide free, private, browser-based PDF tools. No uploads, no sign-ups, no limits.',
  alternates: { canonical: 'https://pdftools.one/about' },
  openGraph: {
    title: 'About PDFTools.one — Free Online PDF Tools',
    description: 'Free, private, browser-based PDF tools. Learn about our mission and technology.',
    url: 'https://pdftools.one/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-6">About PDFTools.one</h1>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Our Mission</h2>
          <p className="text-text-light leading-relaxed">
            PDFTools.one was created with a simple mission: provide powerful PDF tools that are completely free, entirely private, and require no sign-up. We believe that basic document manipulation should be accessible to everyone without compromising privacy or requiring expensive software subscriptions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">How It Works</h2>
          <p className="text-text-light leading-relaxed">
            Every tool on PDFTools.one runs entirely in your web browser. When you upload a PDF file, it is processed using JavaScript libraries running on your device — nothing is ever sent to a server. This client-side approach means your documents remain completely private, processing is instant (no upload/download wait times), and the tools work even without an internet connection once the page has loaded.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Our Technology</h2>
          <p className="text-text-light leading-relaxed">
            We use industry-standard open-source libraries to ensure reliable, high-quality results. Our tools are built with pdf-lib for PDF manipulation, PDF.js (the same engine Firefox uses) for rendering, and modern web APIs like Canvas for image processing. The website itself is built with Next.js and React for a fast, responsive experience on any device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Available Tools</h2>
          <ul className="list-disc list-inside text-text-light space-y-2">
            <li><strong className="text-text">Merge PDF</strong> — Combine multiple PDF files into a single document</li>
            <li><strong className="text-text">Split PDF</strong> — Extract specific pages or split into multiple files</li>
            <li><strong className="text-text">Compress PDF</strong> — Reduce file size while maintaining quality</li>
            <li><strong className="text-text">PDF to JPG</strong> — Convert PDF pages to high-quality images</li>
            <li><strong className="text-text">JPG to PDF</strong> — Convert images into PDF documents</li>
            <li><strong className="text-text">PDF to Word</strong> — Convert PDFs to editable Word format</li>
            <li><strong className="text-text">Rotate PDF</strong> — Change page orientation with a single click</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Contact</h2>
          <p className="text-text-light leading-relaxed">
            Have questions, feedback, or suggestions? We would love to hear from you. Reach out to us at <a href="mailto:hello@pdftools.one" className="text-primary hover:underline">hello@pdftools.one</a>.
          </p>
        </section>
      </div>

      <AdSlot slot="footer" />
    </div>
  );
}
