import type { Metadata } from 'next';
import CompressPdfTool from './CompressPdfTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free — Reduce PDF File Size',
  description: 'Compress PDF files to reduce file size while maintaining quality. Free online PDF compressor — no upload required, all processing in your browser.',
  alternates: { canonical: 'https://pdftools.one/compress-pdf' },
  openGraph: {
    title: 'Compress PDF Online Free — Reduce PDF File Size',
    description: 'Reduce PDF file size while maintaining quality. Free, private, no sign-up required.',
    url: 'https://pdftools.one/compress-pdf',
  },
};

const faqs = [
  {
    question: 'How does PDF compression work?',
    answer: 'Our tool compresses PDFs by optimizing images within the document, removing redundant data, and streamlining the file structure. The compression happens entirely in your browser using JavaScript.',
  },
  {
    question: 'Will compression reduce the quality of my PDF?',
    answer: 'The tool offers different compression levels. Light compression maintains near-original quality with modest size reduction. Higher compression levels reduce file size more aggressively but may slightly reduce image quality. Text and vector graphics remain sharp at all levels.',
  },
  {
    question: 'How much can I reduce my PDF file size?',
    answer: 'Results vary depending on the content. PDFs with many high-resolution images can often be reduced by 50-80%. Text-heavy PDFs with few images may see smaller reductions of 10-30%.',
  },
  {
    question: 'Is there a file size limit?',
    answer: 'There is no server-imposed limit since processing happens in your browser. The practical limit depends on your device\'s memory. Most devices handle PDFs up to 100MB without issues.',
  },
  {
    question: 'Are my files safe during compression?',
    answer: 'Yes. Your PDF files are processed entirely in your browser and never uploaded to any server. The compressed file is generated locally and downloaded directly to your device.',
  },
];

export default function CompressPdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">Compress PDF</h1>
      <p className="text-text-light mb-8">Reduce PDF file size while maintaining quality. Perfect for email attachments and faster sharing. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <CompressPdfTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Compress PDF Files Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Large PDF files can be a headache — they clog email inboxes, slow down file sharing, and eat up storage space. Our free online PDF compressor solves this by reducing file size while preserving the quality you need. Best of all, your files never leave your device.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDF.</strong> Drag and drop your PDF file into the upload area or click to browse your files. The tool accepts any standard PDF file regardless of size.
          </p>
          <p>
            <strong>Step 2: Choose Compression Level.</strong> Select your preferred compression level. Light compression preserves maximum quality with moderate size reduction. Medium compression offers a good balance between quality and file size. Heavy compression maximizes size reduction for the smallest possible file.
          </p>
          <p>
            <strong>Step 3: Compress and Download.</strong> Click the compress button to start processing. The tool analyzes your PDF, optimizes images, and removes unnecessary data. Once complete, you will see the original and compressed file sizes along with the percentage reduction. Download your compressed PDF with one click.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">How Compression Works</h3>
          <p>
            PDF compression primarily targets embedded images, which are usually the largest components of a PDF file. The tool re-encodes images at optimized quality settings, converts high-resolution images to appropriate dimensions, and removes duplicate image data. It also strips unnecessary metadata, removes unused fonts, and optimizes the internal PDF structure.
          </p>
          <p>
            Text content and vector graphics (like logos and diagrams) are not affected by compression and remain perfectly sharp at any zoom level. Only raster images (photographs, scanned pages) are optimized.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">When to Compress PDFs</h3>
          <p>
            <strong>Email attachments:</strong> Most email providers limit attachment sizes to 10-25MB. Compressing a large PDF ensures it fits within these limits. <strong>Web uploads:</strong> Many online forms and portals have file size restrictions. <strong>Storage optimization:</strong> Reduce the space consumed by PDF archives on your device or cloud storage.
          </p>
          <p>
            <strong>Faster sharing:</strong> Smaller files upload and download faster, especially on slower internet connections. <strong>Mobile devices:</strong> Compressed PDFs load faster and use less memory on phones and tablets.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            Start with light compression and check if the result meets your needs. If the file is still too large, try medium or heavy compression. For documents that will be printed, use light compression to maintain image quality. For screen-only viewing, medium or heavy compression is usually sufficient.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/compress-pdf" />

      <AdSlot slot="footer" />
    </div>
  );
}
