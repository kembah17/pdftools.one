"use client";

import { useState, useCallback } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PrivacyBadge } from "@/components/ui/PrivacyBadge";
import { AdSlot } from "@/components/ui/AdSlot";
import { FAQ } from "@/components/seo/FAQ";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { formatFileSize, generateId, downloadBlob } from "@/lib/utils";
import type { PDFFile, ProcessingState, FAQItem } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "How do I merge PDF files online for free?",
    answer:
      "Simply drag and drop your PDF files into the upload area above, arrange them in your preferred order using the move up and down buttons, then click the Merge PDFs button. Your combined document will be ready to download in seconds. The entire process happens in your browser with no file uploads to any server.",
  },
  {
    question: "Is there a limit on how many PDFs I can merge?",
    answer:
      "There is no hard limit on the number of files. You can merge as many PDFs as your browser memory allows. For most devices this means dozens of average-sized documents. Very large files (hundreds of megabytes each) may be limited by your device's available RAM.",
  },
  {
    question: "Are my files safe when I merge PDFs here?",
    answer:
      "Absolutely. Your files never leave your device. All PDF processing is performed entirely in your browser using client-side JavaScript. No data is uploaded to any server, no copies are stored anywhere, and no one else can access your documents. Once you close or refresh the page, all data is gone.",
  },
  {
    question: "Can I reorder pages before merging?",
    answer:
      "Yes. After uploading your files, you can rearrange the order of entire documents using the move up and move down buttons next to each file. The final merged PDF will contain pages in the exact order you specify, with each file's pages appended sequentially.",
  },
  {
    question: "What if my merged PDF is too large?",
    answer:
      "If the resulting file is larger than you need, you can use our Compress PDF tool to reduce the file size after merging. The merged file size is roughly the sum of all input files. For significantly smaller output, consider compressing individual files before merging.",
  },
];

export default function MergePdfTool() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    const pdfFiles: PDFFile[] = [];
    for (const file of newFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(arrayBuffer);
        pdfFiles.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          pages: pdf.getPageCount(),
        });
      } catch {
        pdfFiles.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          pages: undefined,
        });
      }
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
    setResultBlob(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResultBlob(null);
  }, []);

  const moveFile = useCallback((index: number, direction: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResultBlob(null);
  }, []);

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing({ status: "processing", progress: 0, message: "Starting merge..." });
    setResultBlob(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      const total = files.length;

      for (let i = 0; i < total; i++) {
        setProcessing({
          status: "processing",
          progress: Math.round((i / total) * 90),
          message: `Processing ${files[i].name}...`,
        });

        const arrayBuffer = await files[i].file.arrayBuffer();
        const donor = await PDFDocument.load(arrayBuffer);
        const pages = await merged.copyPages(donor, donor.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }

      setProcessing({ status: "processing", progress: 95, message: "Saving document..." });
      const pdfBytes = await merged.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setResultBlob(blob);
      setProcessing({ status: "complete", progress: 100, message: "Merge complete!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "An error occurred during merge.",
      });
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (resultBlob) {
      downloadBlob(resultBlob, "merged.pdf");
    }
  }, [resultBlob]);

  const reset = useCallback(() => {
    setFiles([]);
    setProcessing({ status: "idle", progress: 0 });
    setResultBlob(null);
  }, []);

  const totalPages = files.reduce((sum, f) => sum + (f.pages ?? 0), 0);
  const isProcessing = processing.status === "processing";

  return (
    <div className="page-container">
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark mb-3">
          Merge PDF Files Online
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl">
          Combine multiple PDF documents into a single file. Reorder files before merging.
          Everything happens in your browser — your files stay private.
        </p>
      </section>

      <PrivacyBadge className="mb-4" />
      <AdSlot slot="leaderboard" />

      {/* Upload Area */}
      <section className="mb-8">
        <FileUpload accept=".pdf" multiple={true} maxSize={100 * 1024 * 1024} onFiles={handleFiles}>
          <div className="space-y-3">
            <svg className="w-12 h-12 mx-auto text-text-light dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-lg font-medium text-text dark:text-text-dark">
              Drag & drop PDF files here
            </p>
            <p className="text-sm text-text-light dark:text-text-dark-muted">
              or click to browse · Max 100 MB per file
            </p>
          </div>
        </FileUpload>
      </section>

      {/* File List */}
      {files.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text dark:text-text-dark">
              {files.length} file{files.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
            </h2>
            <button onClick={reset} className="btn-secondary text-sm" disabled={isProcessing}>
              Clear All
            </button>
          </div>

          <ul className="space-y-2">
            {files.map((f, idx) => (
              <li
                key={f.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text dark:text-text-dark truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-text-light dark:text-text-dark-muted">
                    {formatFileSize(f.size)}{f.pages != null ? ` · ${f.pages} page${f.pages !== 1 ? "s" : ""}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFile(idx, -1)}
                    disabled={idx === 0 || isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label="Move up"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveFile(idx, 1)}
                    disabled={idx === files.length - 1 || isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label="Move down"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeFile(f.id)}
                    disabled={isProcessing}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 disabled:opacity-30 transition-colors"
                    aria-label="Remove file"
                    title="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Merge Button & Progress */}
          <div className="mt-6 flex flex-col items-center gap-4">
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
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                className="btn-primary text-lg px-8 py-3"
              >
                {isProcessing ? "Merging..." : `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}`}
              </button>
            ) : (
              <button onClick={handleDownload} className="btn-accent text-lg px-8 py-3">
                Download Merged PDF
              </button>
            )}
          </div>
        </section>
      )}

      <AdSlot slot="below-results" />

      {/* How-To Guide */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          How to Merge PDF Files Online — Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Merging PDF files is one of the most common document tasks, whether you are combining
            invoices for accounting, assembling chapters of a report, or packaging multiple forms
            into a single submission. With pdftools.one you can merge PDFs directly in your browser
            without installing software, creating an account, or uploading sensitive files to a
            remote server.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your files.</strong> Click the upload area or drag and drop multiple
            PDF documents at once. Each file can be up to 100 MB. The tool reads the page count
            of every file instantly so you can verify you selected the right documents.
          </p>
          <p>
            <strong>2. Arrange the order.</strong> Use the up and down arrow buttons next to each
            file to reorder them. The final merged document will contain pages in exactly the
            sequence shown in the list. You can also remove files you added by mistake.
          </p>
          <p>
            <strong>3. Click Merge.</strong> Press the &ldquo;Merge PDFs&rdquo; button and watch the
            progress bar. The tool processes each file sequentially, copying all pages into a new
            combined document. Processing speed depends on the total number of pages and your
            device&rsquo;s performance.
          </p>
          <p>
            <strong>4. Download the result.</strong> Once merging is complete, click the download
            button to save your combined PDF. The file is generated entirely in your browser memory
            and is never transmitted over the internet.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Why Merge PDFs Client-Side?</h3>
          <p>
            Most online PDF tools require you to upload your documents to their servers. This raises
            privacy concerns, especially for confidential business documents, legal contracts, or
            personal records. Our tool uses the pdf-lib library running entirely in your web browser.
            Your files are read from your local disk into browser memory, processed using JavaScript,
            and the result is saved back to your device. At no point does any data leave your
            computer.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Tips for Best Results</h3>
          <p>
            For the smoothest experience, make sure all your source PDFs are not password-protected.
            If a file is encrypted, you will need to remove the password first using a PDF unlock
            tool. Also keep in mind that the merged file size will be approximately the sum of all
            input files. If you need a smaller output, consider compressing the merged PDF afterward
            using our Compress PDF tool.
          </p>
          <p>
            When merging scanned documents, the page orientation of each source file is preserved.
            If some pages appear rotated in the final document, use our Rotate PDF tool to correct
            individual pages before or after merging.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Common Use Cases</h3>
          <p>
            <strong>Business reports:</strong> Combine a cover page, table of contents, multiple
            chapter files, and appendices into a single professional document. <strong>Tax
            filing:</strong> Merge W-2 forms, 1099s, receipts, and supporting schedules into one
            PDF for your accountant. <strong>Academic submissions:</strong> Package your thesis
            chapters, bibliography, and supplementary materials into the required single-file
            format. <strong>Legal documents:</strong> Assemble contracts, exhibits, and signature
            pages into a complete filing package.
          </p>
          <p>
            No matter your use case, pdftools.one makes it fast, free, and completely private. Try
            it now by uploading your first files above.
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
        <RelatedTools currentSlug="merge-pdf" />
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
