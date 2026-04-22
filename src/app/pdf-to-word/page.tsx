import type { Metadata } from 'next';
import PdfToWordTool from './PdfToWordTool';
import { AdSlot } from '@/components/ui/AdSlot';
import FAQ from '@/components/ui/FAQ';
import FAQSchema from '@/components/seo/FAQSchema';
import RelatedTools from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'PDF to Word Converter Online Free — Convert PDF to DOCX',
  description: 'Convert PDF documents to editable Word (.docx) format for free. Extract text content from PDFs with formatting preserved. No upload required — all processing in your browser.',
  alternates: { canonical: 'https://pdftools.one/pdf-to-word' },
  openGraph: {
    title: 'PDF to Word Converter Online Free — Convert PDF to DOCX',
    description: 'Convert PDF to editable Word documents. Free, private, no sign-up required.',
    url: 'https://pdftools.one/pdf-to-word',
  },
};

const faqs = [
  {
    question: 'How does PDF to Word conversion work?',
    answer: 'The tool extracts text content from your PDF using PDF.js, then reconstructs it as a Word document (.docx) using the docx library. Text formatting, paragraphs, and basic structure are preserved in the output.',
  },
  {
    question: 'Will the formatting be exactly the same as the original PDF?',
    answer: 'The tool preserves text content, paragraphs, and basic formatting. However, complex layouts with multiple columns, tables, or intricate designs may not convert perfectly since PDF and Word use fundamentally different layout models.',
  },
  {
    question: 'Can I convert scanned PDFs to Word?',
    answer: 'This tool works best with digital PDFs that contain actual text. Scanned PDFs (which are essentially images) require OCR (Optical Character Recognition) technology, which is not included in this browser-based tool.',
  },
  {
    question: 'Is my PDF uploaded to a server for conversion?',
    answer: 'No. The entire conversion process happens in your browser. Your PDF is read locally, text is extracted using JavaScript, and the Word document is generated on your device. Nothing is transmitted over the internet.',
  },
  {
    question: 'What is the maximum file size I can convert?',
    answer: 'There is no server-imposed limit. The practical limit depends on your browser and device memory. Most modern devices handle PDFs up to 50-100MB without issues.',
  },
];

export default function PdfToWordPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FAQSchema faqs={faqs} />

      <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">PDF to Word Converter</h1>
      <p className="text-text-light mb-8">Convert PDF documents to editable Word (.docx) format with text extraction. Free, private, and works entirely in your browser.</p>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <PdfToWordTool />
      </div>

      <AdSlot slot="below-results" />

      <section className="mt-12 prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-text mb-4">How to Convert PDF to Word Online</h2>
        <div className="text-text-light space-y-4 leading-relaxed">
          <p>
            Need to edit a PDF document? Converting it to Word format is often the easiest solution. Our free online PDF to Word converter extracts text from your PDF and creates an editable .docx file that you can open in Microsoft Word, Google Docs, LibreOffice, or any other word processor. The entire process happens in your browser for complete privacy.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Step-by-Step Instructions</h3>
          <p>
            <strong>Step 1: Upload Your PDF.</strong> Drag and drop your PDF file into the upload area or click to browse. The tool reads the file locally and analyzes its content structure.
          </p>
          <p>
            <strong>Step 2: Review and Convert.</strong> The tool displays information about your PDF including page count and file size. Click the convert button to begin text extraction and Word document generation.
          </p>
          <p>
            <strong>Step 3: Download Your Word File.</strong> Once conversion is complete, download your .docx file. Open it in any word processor to edit the content. The text is fully editable and searchable.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Understanding the Conversion Process</h3>
          <p>
            PDF and Word documents use fundamentally different approaches to layout. PDFs position each text element at exact coordinates on a page, while Word documents use a flowing layout model. Our converter bridges this gap by extracting text content page by page, identifying paragraphs and text blocks, and reconstructing them in Word format.
          </p>
          <p>
            The tool uses PDF.js for text extraction and the docx library for Word document generation. This combination provides reliable text extraction with proper paragraph structure. Basic formatting like font sizes and text alignment is preserved where possible.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Best Results and Limitations</h3>
          <p>
            <strong>Works best with:</strong> Text-heavy documents like reports, articles, essays, and correspondence. Documents created digitally (not scanned) produce the best results since they contain actual text data.
          </p>
          <p>
            <strong>Limitations:</strong> Complex multi-column layouts, tables, and heavily designed documents may not convert perfectly. Images embedded in the PDF are not transferred to the Word document. Scanned PDFs require OCR technology for text recognition.
          </p>
          <h3 className="text-xl font-semibold text-text mt-6 mb-2">Tips for Best Results</h3>
          <p>
            After conversion, review the Word document and adjust formatting as needed. For documents with complex layouts, you may need to reorganize some sections. If the PDF was created from a Word document originally, the conversion typically produces excellent results since the text structure is well-defined.
          </p>
        </div>
      </section>

      <AdSlot slot="in-content" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-text mb-6">Frequently Asked Questions</h2>
        <FAQ items={faqs} />
      </section>

      <RelatedTools currentTool="/pdf-to-word" />

      <AdSlot slot="footer" />
    </div>
  );
}
