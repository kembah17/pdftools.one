"use client";

import { useState, useCallback } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PrivacyBadge } from "@/components/ui/PrivacyBadge";
import { AdSlot } from "@/components/ui/AdSlot";
import { FAQ } from "@/components/seo/FAQ";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { formatFileSize, downloadBlob } from "@/lib/utils";
import type { ProcessingState, FAQItem } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "How does the PDF to Word converter work?",
    answer:
      "Our converter reads your PDF file entirely in your browser using JavaScript. It extracts the text content from every page of the PDF using the pdfjs-dist library, then assembles that text into a properly formatted Word document (.docx) using the docx library. The resulting file preserves the text content organized by page with clear page headings.",
  },
  {
    question: "Will the converted Word document look exactly like my PDF?",
    answer:
      "This tool focuses on extracting text content from your PDF. Simple text-based PDFs convert very well. However, complex layouts, multi-column designs, embedded images, tables, and special formatting may not be perfectly preserved. The tool is ideal for extracting editable text from reports, articles, ebooks, and similar text-heavy documents.",
  },
  {
    question: "Is my PDF uploaded to a server during conversion?",
    answer:
      "No. The entire conversion process runs 100% locally in your web browser. Your PDF file never leaves your device. The text extraction and Word document generation all happen client-side using JavaScript. You can verify this by disconnecting from the internet before converting — the tool will still work perfectly.",
  },
  {
    question: "What types of PDFs can I convert to Word?",
    answer:
      "This tool works best with PDFs that contain actual text content — documents created from word processors, web pages, or other text-based sources. Scanned PDFs that contain only images of text will not produce useful results because there is no extractable text layer. For scanned documents, you would need an OCR (Optical Character Recognition) tool first.",
  },
  {
    question: "Is there a file size limit for PDF to Word conversion?",
    answer:
      "There is no hard file size limit since processing happens in your browser. However, very large PDFs (over 100 MB) may be slow to process depending on your device's memory and processing power. For best results, we recommend files under 50 MB. The tool processes one PDF at a time to ensure reliable conversion.",
  },
];

interface ConversionResult {
  blob: Blob;
  fileName: string;
  pageCount: number;
  textPreview: string;
}

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
      setError(null);
      setProcessing({ status: "idle", progress: 0 });
    }
  }, []);

  const convertToWord = useCallback(async () => {
    if (!file) return;

    setProcessing({ status: "processing", progress: 5, message: "Reading PDF file..." });
    setError(null);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();

      setProcessing({ status: "processing", progress: 15, message: "Loading PDF engine..." });

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      setProcessing({ status: "processing", progress: 25, message: "Parsing PDF document..." });

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const pages: string[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProcessing({
          status: "processing",
          progress: 25 + Math.round((i / totalPages) * 40),
          message: `Extracting text from page ${i} of ${totalPages}...`,
        });

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? (item as { str: string }).str : ""))
          .join(" ");
        pages.push(pageText);
      }

      const allText = pages.join("\n\n");

      if (allText.trim().length === 0) {
        setError(
          "No extractable text found in this PDF. It may be a scanned document containing only images. Try an OCR tool first."
        );
        setProcessing({ status: "error", progress: 0, message: "No text found" });
        return;
      }

      setProcessing({ status: "processing", progress: 70, message: "Generating Word document..." });

      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: pages.flatMap((pageText, i) => [
              new Paragraph({
                text: `Page ${i + 1}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: i === 0 ? 0 : 400, after: 200 },
              }),
              ...pageText
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .map(
                  (line) =>
                    new Paragraph({
                      children: [new TextRun({ text: line.trim() })],
                      spacing: { after: 120 },
                    })
                ),
            ]),
          },
        ],
      });

      setProcessing({ status: "processing", progress: 90, message: "Packaging .docx file..." });

      const blob = await Packer.toBlob(doc);

      const baseName = file.name.replace(/\.pdf$/i, "");
      const textPreview = allText.substring(0, 500) + (allText.length > 500 ? "..." : "");

      setResult({
        blob,
        fileName: `${baseName}.docx`,
        pageCount: totalPages,
        textPreview,
      });

      setProcessing({ status: "complete", progress: 100, message: "Conversion complete!" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Conversion failed: ${message}`);
      setProcessing({ status: "error", progress: 0, message: "Conversion failed" });
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (result) {
      downloadBlob(result.blob, result.fileName);
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProcessing({ status: "idle", progress: 0 });
  }, []);

  return (
    <>
      <FAQSchema items={faqItems} />

      <div className="page-container">
        <AdSlot slot="leaderboard" />

        <section className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <PrivacyBadge />
          </div>
          <h1 className="text-4xl font-bold text-text dark:text-text-dark mb-4">
            PDF to Word Converter
          </h1>
          <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl mx-auto">
            Convert PDF files to editable Word documents (.docx) instantly in your
            browser. No upload required — your files stay private on your device.
          </p>
        </section>

        {/* Upload Area */}
        {!file && (
          <section className="mb-8">
            <FileUpload
              accept=".pdf"
              multiple={false}
              maxSize={200 * 1024 * 1024}
              onFiles={handleFiles}
            />
          </section>
        )}

        {/* File Info & Convert Button */}
        {file && !result && processing.status !== "processing" && (
          <section className="mb-8 bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📄</span>
                </div>
                <div>
                  <p className="font-medium text-text dark:text-text-dark">{file.name}</p>
                  <p className="text-sm text-text-light dark:text-text-dark-muted">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleReset} className="btn-secondary">
                  Change File
                </button>
                <button onClick={convertToWord} className="btn-primary">
                  Convert to Word
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Processing */}
        {processing.status === "processing" && (
          <section className="mb-8 bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6">
            <p className="text-sm text-text-light dark:text-text-dark-muted mb-3">{processing.message}</p>
            <ProgressBar progress={processing.progress} />
          </section>
        )}

        {/* Error */}
        {error && (
          <section className="mb-8 bg-red-50 rounded-xl border border-red-200 p-6">
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={handleReset} className="btn-secondary">
              Try Another File
            </button>
          </section>
        )}

        {/* Result */}
        {result && (
          <section className="mb-8 bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 text-xl">✅</span>
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">Conversion Complete</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-text-light dark:text-text-dark-muted">Pages</p>
                <p className="text-lg font-semibold text-text dark:text-text-dark">{result.pageCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-text-light dark:text-text-dark-muted">Original Size</p>
                <p className="text-lg font-semibold text-text dark:text-text-dark">{formatFileSize(file!.size)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-sm text-text-light dark:text-text-dark-muted">Word File Size</p>
                <p className="text-lg font-semibold text-text dark:text-text-dark">{formatFileSize(result.blob.size)}</p>
              </div>
            </div>

            {/* Text Preview */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text dark:text-text-dark mb-2">Extracted Text Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-sm text-text-light dark:text-text-dark-muted whitespace-pre-wrap font-mono">
                  {result.textPreview}
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> This tool extracts text content from your PDF.
                Complex layouts, images, and formatting may not be preserved.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleDownload} className="btn-primary">
                Download .docx
              </button>
              <button onClick={handleReset} className="btn-secondary">
                Convert Another PDF
              </button>
            </div>
          </section>
        )}

        <AdSlot slot="below-results" />

        {/* How-To Guide */}
        <section className="section-spacing">
          <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
            How to Convert PDF to Word Online
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Converting PDF files to editable Word documents is one of the most common document
              tasks people face every day. Whether you need to edit a contract, update a report,
              or repurpose content from a PDF, having a reliable PDF to Word converter is essential.
              Our free online tool makes this process simple, fast, and completely private.
            </p>

            <h3>Step-by-Step Guide</h3>
            <p>
              Using our PDF to Word converter is straightforward. First, click the upload area
              or drag and drop your PDF file onto the page. The tool accepts any standard PDF
              file up to 200 MB in size. Once your file is loaded, you will see the file name
              and size displayed. Click the &quot;Convert to Word&quot; button to begin the
              conversion process.
            </p>
            <p>
              The converter will read through every page of your PDF, extracting all the text
              content it finds. You can watch the progress bar as it works through each page.
              For a typical 10-page document, conversion takes just a few seconds. Once complete,
              you will see a preview of the extracted text so you can verify the content before
              downloading.
            </p>
            <p>
              Click &quot;Download .docx&quot; to save the Word document to your device. The
              file will open in Microsoft Word, Google Docs, LibreOffice Writer, or any other
              application that supports the .docx format.
            </p>

            <h3>What Gets Converted</h3>
            <p>
              Our tool extracts the actual text content embedded in your PDF. This works
              excellently for documents that were created digitally — files exported from
              Word, Google Docs, web pages saved as PDF, or any document where the text
              is stored as real characters rather than images. The extracted text is organized
              by page in the resulting Word document, with clear page headings for easy
              navigation.
            </p>

            <h3>Understanding Limitations</h3>
            <p>
              It is important to understand what this tool does and does not do. Since the
              conversion happens entirely in your browser without any server processing,
              the tool focuses on text extraction rather than full layout reproduction.
              Complex formatting such as multi-column layouts, tables, headers and footers,
              embedded images, and custom fonts will not be preserved in the output. The
              Word document will contain the raw text content organized by page.
            </p>
            <p>
              Scanned PDFs — documents that are essentially photographs of pages — will
              not produce useful results because there is no text layer to extract. For
              scanned documents, you would need to use an OCR (Optical Character Recognition)
              tool first to create a text layer, then convert the result to Word.
            </p>

            <h3>Privacy and Security</h3>
            <p>
              Unlike most online PDF converters that require you to upload your files to
              remote servers, our tool processes everything locally in your web browser.
              Your PDF file never leaves your device. No data is transmitted over the
              internet during conversion. This makes our tool ideal for sensitive documents
              such as contracts, financial reports, medical records, or any file you would
              prefer to keep private. You can even disconnect from the internet before
              converting and the tool will work perfectly.
            </p>

            <h3>Tips for Best Results</h3>
            <p>
              For the best conversion results, use PDFs that contain actual text rather
              than scanned images. Documents exported from word processors, spreadsheets,
              or presentation software typically convert very well. If your PDF contains
              a mix of text and images, the text portions will be extracted while images
              will be skipped. For very large documents, allow a few extra seconds for
              processing — the tool handles files of any size but larger files naturally
              take longer to process.
            </p>
          </div>
        </section>

        <AdSlot slot="in-content" />

        <section className="section-spacing">
          <FAQ items={faqItems} />
        </section>

        <section className="section-spacing">
          <RelatedTools currentSlug="pdf-to-word" />
        </section>

        <section className="section-spacing">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Your Privacy is Guaranteed
            </h2>
            <p className="text-green-700">
              All PDF to Word conversion happens locally in your browser. Your files are
              never uploaded to any server. No data leaves your device.
            </p>
          </div>
        </section>

        <AdSlot slot="footer" />
      </div>
    </>
  );
}
