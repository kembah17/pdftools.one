import type { Metadata } from 'next';
import JpgToPdfTool from './JpgToPdfTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter Online Free — Convert Images to PDF',
  description: 'Convert JPG images to PDF documents for free. Combine multiple images into one PDF with custom page sizes and margins. No upload required — all processing in your browser.',
  alternates: { canonical: 'https://pdftools.one/jpg-to-pdf' },
  openGraph: {
    title: 'JPG to PDF Converter Online Free — Convert Images to PDF',
    description: 'Convert JPG images to PDF documents. Combine multiple images into one PDF. Free, private, no sign-up required.',
    url: 'https://pdftools.one/jpg-to-pdf',
  },
};

const faqs = [
  {
    question: 'How do I convert JPG images to a PDF?',
    answer: 'Upload one or more JPG images, arrange them in your desired order, choose page size and orientation, then click convert. The tool creates a PDF with each image on its own page.',
  },
  {
    question: 'Can I combine multiple images into one PDF?',
    answer: 'Yes. Upload as many images as you need, drag and drop to reorder them, and the tool will create a single PDF with all images in your chosen sequence.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'The tool supports JPG/JPEG, PNG, and WebP image formats. All formats are converted to high-quality PDF pages with proper scaling and positioning.',
  },
  {
    question: 'Can I choose the page size for the PDF?',
    answer: 'Yes. You can select from standard page sizes including A4, Letter, Legal, and more. You can also choose between portrait and landscape orientation for each conversion.',
  },
  {
    question: 'Is there a limit on the number of images?',
    answer: 'There is no hard limit. Since processing happens in your browser, the practical limit depends on your device\'s memory. Most users can convert dozens of images without issues.',
  },
];

export default function JpgToPdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">JPG to PDF Converter</h1>
      <p className="text-text-light mb-8">Convert JPG images into PDF documents. Combine multiple images, choose page sizes, and reorder pages. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <JpgToPdfTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Convert JPG Images to PDF</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Converting images to PDF is a common need — whether you are creating a photo album, digitizing paper documents from phone photos, assembling a portfolio, or preparing images for professional printing. Our free JPG to PDF converter handles single images and batch conversions with full control over page layout and quality.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your Images.</strong> Click the upload area or drag and drop your JPG, PNG, or WebP images. You can select multiple files at once. Each image appears as a thumbnail preview with its filename and dimensions.
          </p>
          <p>
            <strong>Step 2: Arrange and Configure.</strong> Drag and drop image thumbnails to reorder them. The first image becomes the first page of your PDF. Select your preferred page size (A4, Letter, etc.) and orientation (portrait or landscape). Adjust margins if needed.
          </p>
          <p>
            <strong>Step 3: Convert and Download.</strong> Click the convert button to generate your PDF. The tool uses pdf-lib to create a properly formatted PDF document with each image scaled to fit the page while maintaining its aspect ratio. The finished PDF downloads automatically.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Image Handling and Quality</h3>
          <p>
            The converter embeds your images at their original resolution, ensuring maximum quality in the output PDF. JPG and PNG images are embedded directly, while WebP images are automatically converted to a compatible format before embedding. Images are scaled to fit within the page margins while preserving their original aspect ratio — no stretching or distortion.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Common Use Cases</h3>
          <p>
            <strong>Document scanning:</strong> Convert phone photos of documents, receipts, or whiteboards into organized PDF files. <strong>Photo albums:</strong> Create PDF photo books from vacation pictures, event photos, or family albums. <strong>Portfolios:</strong> Assemble design work, artwork, or photography into a professional PDF portfolio.
          </p>
          <p>
            <strong>Archiving:</strong> Convert image collections into searchable, organized PDF archives. <strong>Printing:</strong> Prepare images with proper page sizes and margins for professional printing services. <strong>Sharing:</strong> Combine multiple images into a single PDF for easy email attachment or file sharing.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            For the best output quality, use high-resolution source images. The tool preserves original image quality, so higher resolution inputs produce sharper PDF pages. When combining images of different sizes, the tool automatically scales each to fit the page while maintaining proportions. For consistent results, try to use images with similar aspect ratios.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/jpg-to-pdf" />

      <AdSlot slot="footer" />
    </div>
  );
}
