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
    question: "How do I split a PDF into specific pages?",
    answer:
      "Upload your PDF file, then enter the page numbers or ranges you want to extract in the input field. Use commas to separate individual pages and hyphens for ranges. For example, '1-3, 5, 7-10' will extract pages 1 through 3, page 5, and pages 7 through 10 into a new PDF document.",
  },
  {
    question: "Can I extract a single page from a PDF?",
    answer:
      "Yes. Simply enter the page number you want to extract, such as '5' to get only page 5. You can also extract multiple individual pages by separating them with commas, like '2, 5, 8' to get pages 2, 5, and 8 in a new document.",
  },
  {
    question: "Does splitting a PDF affect the original file?",
    answer:
      "No. The original file is never modified. The tool creates a brand-new PDF containing only the pages you selected. Your original document remains exactly as it was on your device.",
  },
  {
    question: "Is there a page limit for splitting PDFs?",
    answer:
      "There is no artificial page limit. You can split PDFs with hundreds of pages. The only constraint is your device's available memory. For very large documents with thousands of pages, processing may take a few extra seconds.",
  },
  {
    question: "Are my files uploaded to a server when splitting?",
    answer:
      "No. All processing happens entirely in your browser. Your PDF file is read into your device's memory, the selected pages are extracted using client-side JavaScript, and the result is saved directly to your device. No data is ever sent to any server.",
  },
];

interface ParsedRange {
  start: number;
  end: number;
}

function parsePageRanges(input: string, maxPages: number): { pages: number[]; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { pages: [], error: "Please enter page numbers or ranges." };

  const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  const ranges: ParsedRange[] = [];

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) return { pages: [], error: `Invalid range: "${part}"` };
      if (start < 1 || end < 1) return { pages: [], error: `Page numbers must be at least 1.` };
      if (start > maxPages || end > maxPages) return { pages: [], error: `Page ${Math.max(start, end)} exceeds document length (${maxPages} pages).` };
      if (start > end) return { pages: [], error: `Invalid range: "${part}" — start must be less than or equal to end.` };
      ranges.push({ start, end });
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) return { pages: [], error: `Invalid page number: "${part}"` };
      if (page < 1) return { pages: [], error: `Page numbers must be at least 1.` };
      if (page > maxPages) return { pages: [], error: `Page ${page} exceeds document length (${maxPages} pages).` };
      ranges.push({ start: page, end: page });
    }
  }

  const pageSet = new Set<number>();
  for (const range of ranges) {
    for (let i = range.start; i <= range.end; i++) {
      pageSet.add(i);
    }
  }

  const pages = Array.from(pageSet).sort((a, b) => a - b);
  if (pages.length === 0) return { pages: [], error: "No valid pages specified." };

  return { pages, error: null };
}

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [extractedPageCount, setExtractedPageCount] = useState(0);

  const handleFiles = useCallback(async (files: File[]) => {
    const uploaded = files[0];
    if (!uploaded) return;

    setFile(uploaded);
    setFileName(uploaded.name);
    setFileSize(uploaded.size);
    setResultBlob(null);
    setRangeInput("");
    setValidationError(null);
    setProcessing({ status: "idle", progress: 0 });

    try {
      const arrayBuffer = await uploaded.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(0);
      setValidationError("Could not read this PDF. The file may be corrupted or password-protected.");
    }
  }, []);

  const handleRangeChange = useCallback(
    (value: string) => {
      setRangeInput(value);
      setResultBlob(null);
      if (value.trim() && pageCount > 0) {
        const { error } = parsePageRanges(value, pageCount);
        setValidationError(error);
      } else {
        setValidationError(null);
      }
    },
    [pageCount]
  );

  const splitPdf = useCallback(async () => {
    if (!file || pageCount === 0) return;

    const { pages, error } = parsePageRanges(rangeInput, pageCount);
    if (error || pages.length === 0) {
      setValidationError(error || "No pages selected.");
      return;
    }

    setProcessing({ status: "processing", progress: 0, message: "Loading document..." });
    setResultBlob(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const source = await PDFDocument.load(arrayBuffer);
      const output = await PDFDocument.create();

      const total = pages.length;
      for (let i = 0; i < total; i++) {
        setProcessing({
          status: "processing",
          progress: Math.round((i / total) * 90),
          message: `Extracting page ${pages[i]}...`,
        });

        const [copiedPage] = await output.copyPages(source, [pages[i] - 1]);
        output.addPage(copiedPage);
      }

      setProcessing({ status: "processing", progress: 95, message: "Saving document..." });
      const pdfBytes = await output.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setResultBlob(blob);
      setExtractedPageCount(pages.length);
      setProcessing({ status: "complete", progress: 100, message: "Split complete!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "An error occurred during splitting.",
      });
    }
  }, [file, pageCount, rangeInput]);

  const handleDownload = useCallback(() => {
    if (resultBlob) {
      const baseName = fileName.replace(/\.pdf$/i, "");
      downloadBlob(resultBlob, `${baseName}-split.pdf`);
    }
  }, [resultBlob, fileName]);

  const reset = useCallback(() => {
    setFile(null);
    setFileName("");
    setFileSize(0);
    setPageCount(0);
    setRangeInput("");
    setValidationError(null);
    setProcessing({ status: "idle", progress: 0 });
    setResultBlob(null);
    setExtractedPageCount(0);
  }, []);

  const isProcessing = processing.status === "processing";

  return (
    <div className="page-container">
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark mb-3">
          Split PDF — Extract Pages Online
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl">
          Extract specific pages or page ranges from any PDF document. Enter the pages you need
          and download a new PDF instantly. 100% private — nothing leaves your browser.
        </p>
      </section>

      <PrivacyBadge className="mb-4" />
      <AdSlot slot="leaderboard" />

      {/* Upload Area */}
      {!file && (
        <section className="mb-8">
          <FileUpload accept=".pdf" multiple={false} maxSize={100 * 1024 * 1024} onFiles={handleFiles}>
            <div className="space-y-3">
              <svg className="w-12 h-12 mx-auto text-text-light dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p className="text-lg font-medium text-text dark:text-text-dark">
                Drag & drop a PDF file here
              </p>
              <p className="text-sm text-text-light dark:text-text-dark-muted">
                or click to browse · Max 100 MB
              </p>
            </div>
          </FileUpload>
        </section>
      )}

      {/* File Info & Range Input */}
      {file && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">{fileName}</h2>
              <p className="text-sm text-text-light dark:text-text-dark-muted">
                {formatFileSize(fileSize)} · {pageCount} page{pageCount !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={reset} className="btn-secondary text-sm" disabled={isProcessing}>
              Choose Different File
            </button>
          </div>

          {/* Page Range Input */}
          <div className="mb-6">
            <label
              htmlFor="page-ranges"
              className="block text-sm font-medium text-text dark:text-text-dark mb-2"
            >
              Page ranges to extract
            </label>
            <input
              id="page-ranges"
              type="text"
              value={rangeInput}
              onChange={(e) => handleRangeChange(e.target.value)}
              placeholder={`e.g. 1-3, 5, 7-${pageCount}`}
              disabled={isProcessing}
              className="w-full max-w-md px-4 py-2.5 rounded-lg border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-text dark:text-text-dark placeholder:text-text-light/50 dark:placeholder:text-text-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <p className="text-xs text-text-light dark:text-text-dark-muted mt-1.5">
              Use commas to separate pages, hyphens for ranges. Example: 1-3, 5, 7-10
            </p>
            {validationError && (
              <p className="text-sm text-red-500 mt-1.5" role="alert">{validationError}</p>
            )}
          </div>

          {/* Split Button & Progress */}
          <div className="flex flex-col items-center gap-4">
            {isProcessing && (
              <div className="w-full max-w-md">
                <ProgressBar progress={processing.progress} />
                <p className="text-sm text-text-light dark:text-text-dark-muted text-center mt-2">
                  {processing.message}
                </p>
              </div>
            )}

            {processing.status === "error" && (
              <p className="text-sm text-red-500 text-center">{processing.message}</p>
            )}

            {!resultBlob ? (
              <button
                onClick={splitPdf}
                disabled={!rangeInput.trim() || !!validationError || isProcessing}
                className="btn-primary text-lg px-8 py-3"
              >
                {isProcessing ? "Splitting..." : "Split PDF"}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                  Extracted {extractedPageCount} page{extractedPageCount !== 1 ? "s" : ""} successfully.
                </p>
                <button onClick={handleDownload} className="btn-accent text-lg px-8 py-3">
                  Download Split PDF
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <AdSlot slot="below-results" />

      {/* How-To Guide */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          How to Split a PDF File Online — Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Splitting a PDF is essential when you need to extract specific pages from a larger
            document. Whether you are pulling a single chapter from a textbook, isolating a
            signature page from a contract, or extracting key slides from a presentation export,
            pdftools.one lets you do it instantly in your browser without any software installation
            or account creation.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your PDF.</strong> Click the upload area or drag and drop your PDF
            file. The tool will immediately read the document and display the total page count so
            you know exactly which pages are available for extraction.
          </p>
          <p>
            <strong>2. Enter page ranges.</strong> Type the pages you want to extract into the
            input field. You can use individual page numbers separated by commas (like &ldquo;1, 3,
            5&rdquo;) or ranges with hyphens (like &ldquo;1-5&rdquo;). You can also combine both
            formats: &ldquo;1-3, 7, 10-15&rdquo; will extract pages 1 through 3, page 7, and pages
            10 through 15.
          </p>
          <p>
            <strong>3. Click Split.</strong> Press the &ldquo;Split PDF&rdquo; button. The tool
            will extract the specified pages and assemble them into a new PDF document. A progress
            bar shows the extraction status in real time.
          </p>
          <p>
            <strong>4. Download the result.</strong> Once splitting is complete, click the download
            button to save your new PDF containing only the pages you selected. The original file
            remains completely unchanged.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Understanding Page Range Syntax</h3>
          <p>
            The page range input supports a flexible syntax designed to make it easy to specify
            exactly which pages you need. Here are some examples for a 20-page document:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>&ldquo;5&rdquo;</strong> — extracts only page 5</li>
            <li><strong>&ldquo;1-5&rdquo;</strong> — extracts pages 1, 2, 3, 4, and 5</li>
            <li><strong>&ldquo;1, 3, 5&rdquo;</strong> — extracts pages 1, 3, and 5</li>
            <li><strong>&ldquo;1-3, 10-15, 20&rdquo;</strong> — extracts pages 1 through 3, 10 through 15, and page 20</li>
          </ul>
          <p>
            Duplicate pages are automatically removed, and the output pages are always arranged in
            ascending order regardless of the order you type them.
          </p>

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Your PDF file is processed entirely within your web browser. The document is loaded
            into your device&rsquo;s memory, the selected pages are copied into a new PDF structure,
            and the result is generated locally. At no point is any data transmitted over the
            internet. This makes our tool safe for confidential documents, legal files, medical
            records, and any other sensitive material.
          </p>

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Common Use Cases</h3>
          <p>
            <strong>Legal documents:</strong> Extract signature pages or specific clauses from
            lengthy contracts. <strong>Academic work:</strong> Pull individual chapters or sections
            from textbooks and research papers. <strong>Business reports:</strong> Isolate executive
            summaries or specific data sections for stakeholder distribution. <strong>Government
            forms:</strong> Extract completed pages from multi-page form packets for individual
            submission.
          </p>
          <p>
            After splitting, you can use our Merge PDF tool to combine extracted pages with other
            documents, or our Rotate PDF tool to fix page orientation issues in the extracted pages.
            All tools work together seamlessly and maintain the same privacy-first approach.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          Frequently Asked Questions
        </h2>
        <FAQ items={faqItems} />
        <FAQSchema items={faqItems} />
      </section>

      {/* Related Tools */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          Related PDF Tools
        </h2>
        <RelatedTools currentSlug="split-pdf" />
      </section>

      {/* Privacy Note */}
      <section className="section-spacing">
        <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Your Privacy is Guaranteed
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
            All PDF processing happens locally in your browser. Your files are never uploaded to any
            server. We don&rsquo;t store, read, or share your documents. Once you close this tab, all
            data is permanently gone.
          </p>
        </div>
      </section>

      <AdSlot slot="footer" />
    </div>
  );
}
