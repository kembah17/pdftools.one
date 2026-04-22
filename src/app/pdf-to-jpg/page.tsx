import type { Metadata } from 'next';
import PdfToJpgTool from './PdfToJpgTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter Online Free — Convert PDF Pages to Images',
  description: 'Convert PDF pages to high-quality JPG images for free. Download individual images or all pages as a ZIP file. No upload required — all processing in your browser.',
  alternates: { canonical: 'https://pdftools.one/pdf-to-jpg' },
  openGraph: {
    title: 'PDF to JPG Converter Online Free — Convert PDF Pages to Images',
    description: 'Convert PDF pages to high-quality JPG images. Free, private, no sign-up required.',
    url: 'https://pdftools.one/pdf-to-jpg',
  },
};

const faqs = [
  {
    question: 'How do I convert a PDF to JPG images?',
    answer: 'Upload your PDF file, select the image quality and resolution, then click convert. Each page of your PDF is rendered as a separate JPG image. You can download individual images or all pages as a ZIP file.',
  },
  {
    question: 'What image quality can I expect?',
    answer: 'Our converter renders PDF pages at configurable resolutions. Higher DPI settings produce sharper images suitable for printing, while lower settings create smaller files ideal for web use or email.',
  },
  {
    question: 'Can I convert specific pages instead of the entire PDF?',
    answer: 'Yes. After uploading your PDF, you can select which pages to convert. This is useful when you only need images of certain pages rather than the entire document.',
  },
  {
    question: 'Are my PDF files uploaded to a server?',
    answer: 'No. The entire conversion process happens in your browser using JavaScript and the HTML5 Canvas API. Your PDF files never leave your device.',
  },
  {
    question: 'Can I convert a large PDF with many pages?',
    answer: 'Yes. The tool handles PDFs with many pages. For very large documents, pages are processed sequentially to manage memory efficiently. The practical limit depends on your device\'s capabilities.',
  },
];

export default function PdfToJpgPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">PDF to JPG Converter</h1>
      <p className="text-text-light mb-8">Convert PDF pages to high-quality JPG images. Download individually or as a ZIP archive. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <PdfToJpgTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Convert PDF to JPG Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Converting PDF pages to JPG images is essential for many workflows — from creating social media posts from document pages to embedding PDF content in presentations, websites, or emails. Our free online converter transforms each PDF page into a crisp, high-quality JPG image without requiring any software installation.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDF.</strong> Drag and drop your PDF file into the upload area or click to browse. The tool loads the document and displays a preview of all pages so you can see what will be converted.
          </p>
          <p>
            <strong>Step 2: Configure Output Settings.</strong> Choose your preferred image quality and resolution. Higher DPI values (200-300) produce sharper images suitable for printing, while lower values (72-150) create smaller files perfect for screen viewing, web use, or email attachments.
          </p>
          <p>
            <strong>Step 3: Convert and Download.</strong> Click the convert button to start processing. Each page is rendered to a high-quality JPG image using the HTML5 Canvas API. Download individual images by clicking on them, or download all pages at once as a convenient ZIP archive.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">How the Conversion Works</h3>
          <p>
            Our tool uses PDF.js, the same rendering engine used by Firefox to display PDFs. Each page is rendered onto an HTML5 Canvas element at your chosen resolution, then exported as a JPG image. This approach produces accurate, high-fidelity images that faithfully reproduce the original PDF content including text, graphics, photos, and complex layouts.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Common Use Cases</h3>
          <p>
            <strong>Social media:</strong> Convert PDF infographics, flyers, or brochures to JPG for sharing on Instagram, Facebook, or Twitter. <strong>Presentations:</strong> Insert PDF pages as images in PowerPoint or Google Slides. <strong>Web content:</strong> Convert PDF charts, diagrams, or pages for use on websites and blogs.
          </p>
          <p>
            <strong>Email:</strong> Embed PDF content directly in emails as inline images instead of attachments. <strong>Documentation:</strong> Create image versions of PDF pages for inclusion in Word documents or wikis. <strong>Archiving:</strong> Convert important PDF pages to images for easy browsing and organization.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            For documents with small text, use a higher DPI setting (200 or above) to ensure readability. For photos and graphics, 150 DPI usually provides excellent quality with reasonable file sizes. If you need transparent backgrounds, consider using our PDF to PNG conversion option instead, as JPG does not support transparency.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/pdf-to-jpg" />

      <AdSlot slot="footer" />
    </div>
  );
}
