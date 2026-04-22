import type { Metadata } from 'next';
import MergePdfTool from './MergePdfTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online Free — Combine PDFs Instantly',
  description: 'Merge multiple PDF files into one document for free. Drag and drop to reorder pages. No upload required — all processing happens in your browser.',
  alternates: { canonical: 'https://pdftools.one/merge-pdf' },
  openGraph: {
    title: 'Merge PDF Files Online Free — Combine PDFs Instantly',
    description: 'Combine multiple PDF files into a single document. Free, private, no sign-up required.',
    url: 'https://pdftools.one/merge-pdf',
  },
};

const faqs = [
  {
    question: 'How do I merge PDF files online?',
    answer: 'Simply drag and drop your PDF files into the upload area or click to browse. Reorder them as needed, then click "Merge PDFs" to combine them into a single document. The merged file downloads automatically.',
  },
  {
    question: 'Is it safe to merge PDFs on this website?',
    answer: 'Yes, completely safe. All PDF processing happens entirely in your browser using JavaScript. Your files are never uploaded to any server. Once you close the page, all data is gone.',
  },
  {
    question: 'Is there a limit on the number of PDFs I can merge?',
    answer: 'There is no hard limit. Since processing happens in your browser, the practical limit depends on your device\'s memory. Most users can merge dozens of PDFs without any issues.',
  },
  {
    question: 'Can I reorder pages before merging?',
    answer: 'Yes. After uploading your PDF files, you can drag and drop them to change the order. The files will be merged in the order shown on screen.',
  },
  {
    question: 'What happens to my files after merging?',
    answer: 'Nothing — your files exist only in your browser\'s memory during processing. They are never stored, cached, or transmitted anywhere. Closing the tab removes all traces.',
  },
];

export default function MergePdfPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">Merge PDF Files</h1>
      <p className="text-text-light mb-8">Combine multiple PDF files into a single document. Drag and drop to reorder. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <MergePdfTool />
      </div>

      <AdSlot slot="below-results" />

      {/* How-to Guide */}
      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Merge PDF Files Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Merging PDF files is one of the most common document tasks, whether you are combining reports for a presentation, assembling scanned documents, or creating a single portfolio from multiple files. Our free online PDF merger makes this process simple, fast, and completely private.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDFs.</strong> Click the upload area or drag and drop your PDF files directly onto the tool. You can select multiple files at once from your file browser. Each file appears as a card showing the filename and file size.
          </p>
          <p>
            <strong>Step 2: Arrange the Order.</strong> Your PDFs will be merged in the order they appear on screen. Use the drag handles or arrow buttons to rearrange files into your desired sequence. The first file in the list becomes the first pages of the merged document.
          </p>
          <p>
            <strong>Step 3: Merge and Download.</strong> Click the "Merge PDFs" button to combine all files. The tool processes everything locally in your browser using the pdf-lib library. Once complete, the merged PDF downloads automatically to your device.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Why Use Our PDF Merger?</h3>
          <p>
            Unlike most online PDF tools that require you to upload files to a remote server, our merger processes everything client-side. This means your sensitive documents — contracts, financial reports, medical records — never leave your computer. There is zero risk of data interception or unauthorized access.
          </p>
          <p>
            The tool uses pdf-lib, a robust JavaScript library for PDF manipulation. It preserves all original formatting, fonts, images, and interactive elements in your PDFs. Bookmarks, links, and form fields are maintained in the merged output.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Common Use Cases</h3>
          <p>
            <strong>Business:</strong> Combine invoices, contracts, and proposals into a single file for clients. Merge monthly reports into quarterly summaries. Assemble meeting agendas with supporting documents.
          </p>
          <p>
            <strong>Education:</strong> Combine lecture notes, assignments, and reference materials. Merge research papers with appendices. Create study guides from multiple sources.
          </p>
          <p>
            <strong>Personal:</strong> Combine scanned receipts for expense reports. Merge travel documents — boarding passes, hotel confirmations, and itineraries — into one file. Assemble photo albums from multiple PDF exports.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            For the smoothest experience, ensure all your PDF files are not password-protected before merging. If a PDF is encrypted, you will need to remove the password first using a PDF unlock tool. The merger works best with standard PDF files — scanned documents, digital documents, and hybrid PDFs are all supported.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/merge-pdf" />

      <AdSlot slot="footer" />
    </div>
  );
}
