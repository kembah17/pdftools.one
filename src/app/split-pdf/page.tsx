import type { Metadata } from 'next';
import SplitPdfTool from './SplitPdfTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Split PDF Online Free — Extract Pages from PDF',
  description: 'Split PDF files into individual pages or extract specific page ranges for free. No upload required — all processing happens in your browser.',
  alternates: { canonical: 'https://pdftools.one/split-pdf' },
  openGraph: {
    title: 'Split PDF Online Free — Extract Pages from PDF',
    description: 'Extract pages from PDF files instantly. Free, private, no sign-up required.',
    url: 'https://pdftools.one/split-pdf',
  },
};

const faqs = [
  {
    question: 'How do I split a PDF into individual pages?',
    answer: 'Upload your PDF file, select the pages you want to extract or choose to split into individual pages, then click the split button. Each page or range downloads as a separate PDF file.',
  },
  {
    question: 'Can I extract specific page ranges from a PDF?',
    answer: 'Yes. You can specify exact page numbers or ranges (e.g., 1-3, 5, 7-10) to extract only the pages you need into a new PDF document.',
  },
  {
    question: 'Are my files uploaded to a server?',
    answer: 'No. All PDF splitting happens entirely in your browser. Your files never leave your device, ensuring complete privacy and security.',
  },
  {
    question: 'Is there a page limit for splitting?',
    answer: 'There is no imposed limit. Since processing is done locally in your browser, the practical limit depends on your device\'s available memory. PDFs with hundreds of pages work fine on most modern devices.',
  },
  {
    question: 'Will splitting affect the quality of my PDF?',
    answer: 'No. The split operation preserves the original quality of each page exactly as it appears in the source PDF. Text, images, fonts, and formatting remain unchanged.',
  },
];

export default function SplitPdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">Split PDF Pages</h1>
      <p className="text-text-light mb-8">Extract specific pages or split a PDF into multiple files. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <SplitPdfTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Split PDF Files Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Splitting a PDF allows you to extract specific pages from a larger document, creating smaller, more focused files. Whether you need to pull out a single chapter from an ebook, extract specific pages from a report, or break a large document into manageable sections, our free PDF splitter handles it all without uploading your files anywhere.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDF.</strong> Click the upload area or drag and drop your PDF file. The tool reads the file locally and displays a preview of all pages so you can see exactly what you are working with.
          </p>
          <p>
            <strong>Step 2: Select Pages to Extract.</strong> Choose which pages you want to extract. You can select individual pages by clicking on them, specify page ranges using the input field (e.g., "1-5, 8, 12-15"), or choose to split every page into a separate file.
          </p>
          <p>
            <strong>Step 3: Split and Download.</strong> Click the split button to process your selection. The tool creates new PDF files containing only your selected pages. For multiple files, they download as a ZIP archive for convenience.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Privacy and Security</h3>
          <p>
            Our PDF splitter uses the pdf-lib JavaScript library to process files entirely within your web browser. This client-side approach means your documents are never transmitted over the internet. Whether you are splitting confidential business contracts, personal tax documents, or sensitive medical records, your data remains completely private.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Common Use Cases</h3>
          <p>
            <strong>Extract chapters:</strong> Pull individual chapters from ebooks or manuals for focused reading or sharing. <strong>Reduce file size:</strong> Extract only the pages you need instead of sharing an entire large document. <strong>Organize documents:</strong> Break a multi-section report into separate files for different team members or departments.
          </p>
          <p>
            <strong>Legal documents:</strong> Extract specific clauses or sections from contracts for review. <strong>Academic work:</strong> Pull relevant pages from research papers or textbooks for citations. <strong>Presentations:</strong> Extract specific slides exported as PDF for targeted sharing.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            When specifying page ranges, use commas to separate individual pages and hyphens for ranges. For example, "1, 3-5, 8" extracts pages 1, 3, 4, 5, and 8. The page numbers correspond to the PDF page numbers shown in the preview, which may differ from printed page numbers in the document.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/split-pdf" />

      <AdSlot slot="footer" />
    </div>
  );
}
