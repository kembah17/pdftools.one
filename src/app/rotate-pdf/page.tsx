import type { Metadata } from 'next';
import RotatePdfTool from './RotatePdfTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Rotate PDF Pages Online Free — Change PDF Orientation',
  description: 'Rotate PDF pages to any orientation for free. Rotate individual pages or all pages at once — 90°, 180°, or 270°. No upload required — all processing in your browser.',
  alternates: { canonical: 'https://pdftools.one/rotate-pdf' },
  openGraph: {
    title: 'Rotate PDF Pages Online Free — Change PDF Orientation',
    description: 'Rotate PDF pages to any orientation. Free, private, no sign-up required.',
    url: 'https://pdftools.one/rotate-pdf',
  },
};

const faqs = [
  {
    question: 'How do I rotate pages in a PDF?',
    answer: 'Upload your PDF file, then click the rotation buttons on individual pages to rotate them 90° clockwise or counterclockwise. You can also rotate all pages at once. When satisfied, click save to download the rotated PDF.',
  },
  {
    question: 'Can I rotate individual pages instead of the whole document?',
    answer: 'Yes. Each page has its own rotation controls, so you can rotate specific pages while leaving others unchanged. This is perfect for fixing individual scanned pages that are sideways or upside down.',
  },
  {
    question: 'What rotation angles are supported?',
    answer: 'You can rotate pages by 90° (quarter turn clockwise), 180° (upside down), or 270° (quarter turn counterclockwise). Multiple rotations can be applied to achieve any desired orientation.',
  },
  {
    question: 'Will rotating affect the quality of my PDF?',
    answer: 'No. Rotation is a lossless operation that changes only the page orientation metadata. All text, images, and formatting remain exactly as they were in the original document.',
  },
  {
    question: 'Are my files safe when using this tool?',
    answer: 'Yes. All processing happens entirely in your browser. Your PDF files are never uploaded to any server. The rotated file is generated locally and downloaded directly to your device.',
  },
];

export default function RotatePdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">Rotate PDF Pages</h1>
      <p className="text-text-light mb-8">Rotate PDF pages to any orientation. Fix sideways or upside-down pages with a single click. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <RotatePdfTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Rotate PDF Pages Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Incorrectly oriented PDF pages are a common frustration — scanned documents that come out sideways, pages that are upside down, or mixed orientations in a single document. Our free online PDF rotation tool lets you fix these issues quickly and easily, with visual previews so you can see exactly how each page will look.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDF.</strong> Drag and drop your PDF file into the upload area or click to browse. The tool loads the document and displays thumbnail previews of all pages so you can identify which ones need rotation.
          </p>
          <p>
            <strong>Step 2: Rotate Pages.</strong> Click the rotation buttons on individual page thumbnails to rotate them. Each click rotates the page 90° clockwise. You can also use the "Rotate All" button to rotate every page in the document at once. The preview updates in real-time so you can see the result immediately.
          </p>
          <p>
            <strong>Step 3: Save and Download.</strong> Once all pages are oriented correctly, click the save button. The tool applies the rotations and generates a new PDF file that downloads automatically to your device.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">How Rotation Works</h3>
          <p>
            PDF rotation is a metadata operation — the tool modifies the page rotation property in the PDF structure without re-encoding any content. This means the operation is lossless: text remains sharp, images retain their original quality, and all interactive elements (links, form fields, bookmarks) continue to work correctly.
          </p>
          <p>
            The tool uses pdf-lib, a robust JavaScript library for PDF manipulation. It reads the existing page rotation values, applies your changes, and writes the updated PDF. This approach is fast and reliable, even for large documents with hundreds of pages.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Common Use Cases</h3>
          <p>
            <strong>Scanned documents:</strong> Fix pages that were scanned sideways or upside down. This is the most common use case, especially with automatic document feeders that occasionally misalign pages. <strong>Mixed orientation:</strong> Correct documents where some pages are landscape and others are portrait.
          </p>
          <p>
            <strong>Presentation prep:</strong> Ensure all pages in a presentation PDF have consistent orientation before sharing. <strong>Mobile scans:</strong> Fix orientation issues from phone camera scans where the device orientation was not detected correctly.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            Use the page previews to verify each page is oriented correctly before saving. For documents with many pages, use the "Rotate All" feature first, then adjust individual pages as needed. Remember that rotation is cumulative — clicking the rotate button multiple times adds 90° each time.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/rotate-pdf" />

      <AdSlot slot="footer" />
    </div>
  );
}
