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
import type { ProcessingState, FAQItem, RotationAngle } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "How do I rotate pages in a PDF?",
    answer:
      "Upload your PDF file, then use the rotation buttons next to each page to rotate individual pages by 90, 180, or 270 degrees. You can also rotate all pages at once using the buttons at the top of the page list. Once you are satisfied with the orientation, click the Download button to save the rotated PDF.",
  },
  {
    question: "Can I rotate just one page in a multi-page PDF?",
    answer:
      "Yes. Each page in your document has its own set of rotation buttons. You can rotate any individual page independently without affecting the other pages. This is useful when a single page in a scanned document was fed through the scanner sideways.",
  },
  {
    question: "What rotation angles are supported?",
    answer:
      "You can rotate pages by 90 degrees (quarter turn clockwise), 180 degrees (upside down), or 270 degrees (quarter turn counter-clockwise). Each click of the 90-degree button adds another 90 degrees of rotation, so clicking it twice gives you 180 degrees.",
  },
  {
    question: "Does rotating a PDF reduce its quality?",
    answer:
      "No. Rotating a PDF page is a lossless operation. It simply changes the page orientation metadata without recompressing or re-rendering the content. Text, images, and vector graphics all remain at their original quality.",
  },
  {
    question: "Is my PDF uploaded to a server for rotation?",
    answer:
      "No. The entire rotation process happens in your browser using client-side JavaScript. Your file is loaded into your device memory, the rotation is applied, and the result is saved back to your device. No data ever leaves your computer.",
  },
];

interface PageRotation {
  pageIndex: number;
  rotation: RotationAngle;
}

function nextRotation(current: RotationAngle, add: number): RotationAngle {
  return ((current + add) % 360) as RotationAngle;
}

export default function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [pages, setPages] = useState<PageRotation[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const uploaded = files[0];
    if (!uploaded) return;

    setFile(uploaded);
    setFileName(uploaded.name);
    setFileSize(uploaded.size);
    setResultBlob(null);
    setProcessing({ status: "idle", progress: 0 });

    try {
      const arrayBuffer = await uploaded.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPages(
        Array.from({ length: count }, (_, i) => ({
          pageIndex: i,
          rotation: 0 as RotationAngle,
        }))
      );
    } catch {
      setPages([]);
    }
  }, []);

  const rotatePage = useCallback((pageIndex: number, addDegrees: number) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageIndex === pageIndex
          ? { ...p, rotation: nextRotation(p.rotation, addDegrees) }
          : p
      )
    );
    setResultBlob(null);
  }, []);

  const rotateAll = useCallback((addDegrees: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: nextRotation(p.rotation, addDegrees),
      }))
    );
    setResultBlob(null);
  }, []);

  const resetRotations = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 as RotationAngle })));
    setResultBlob(null);
  }, []);

  const applyRotation = useCallback(async () => {
    if (!file || pages.length === 0) return;

    setProcessing({ status: "processing", progress: 0, message: "Loading document..." });
    setResultBlob(null);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const total = pages.length;

      for (let i = 0; i < total; i++) {
        setProcessing({
          status: "processing",
          progress: Math.round((i / total) * 90),
          message: `Rotating page ${i + 1}...`,
        });

        if (pages[i].rotation !== 0) {
          const page = pdf.getPage(i);
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + pages[i].rotation));
        }
      }

      setProcessing({ status: "processing", progress: 95, message: "Saving document..." });
      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setResultBlob(blob);
      setProcessing({ status: "complete", progress: 100, message: "Rotation complete!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "An error occurred during rotation.",
      });
    }
  }, [file, pages]);

  const handleDownload = useCallback(() => {
    if (resultBlob) {
      const baseName = fileName.replace(/\.pdf$/i, "");
      downloadBlob(resultBlob, `${baseName}-rotated.pdf`);
    }
  }, [resultBlob, fileName]);

  const reset = useCallback(() => {
    setFile(null);
    setFileName("");
    setFileSize(0);
    setPages([]);
    setProcessing({ status: "idle", progress: 0 });
    setResultBlob(null);
  }, []);

  const isProcessing = processing.status === "processing";
  const hasRotations = pages.some((p) => p.rotation !== 0);

  return (
    <div className="page-container">
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text dark:text-text-dark mb-3">
          Rotate PDF Pages Online
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl">
          Rotate individual pages or all pages in your PDF by 90, 180, or 270 degrees.
          Fix sideways scans and upside-down pages instantly. 100% private.
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

      {/* File Info & Page List */}
      {file && pages.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">{fileName}</h2>
              <p className="text-sm text-text-light dark:text-text-dark-muted">
                {formatFileSize(fileSize)} · {pages.length} page{pages.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={reset} className="btn-secondary text-sm" disabled={isProcessing}>
              Choose Different File
            </button>
          </div>

          {/* Rotate All Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
            <span className="text-sm font-medium text-text dark:text-text-dark">Rotate all pages:</span>
            <button
              onClick={() => rotateAll(90)}
              disabled={isProcessing}
              className="btn-secondary text-sm px-3 py-1.5"
            >
              90° CW
            </button>
            <button
              onClick={() => rotateAll(180)}
              disabled={isProcessing}
              className="btn-secondary text-sm px-3 py-1.5"
            >
              180°
            </button>
            <button
              onClick={() => rotateAll(270)}
              disabled={isProcessing}
              className="btn-secondary text-sm px-3 py-1.5"
            >
              90° CCW
            </button>
            {hasRotations && (
              <button
                onClick={resetRotations}
                disabled={isProcessing}
                className="text-sm text-red-500 hover:text-red-600 transition-colors ml-2"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Page List */}
          <ul className="space-y-2 max-h-[480px] overflow-y-auto">
            {pages.map((p) => (
              <li
                key={p.pageIndex}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {p.pageIndex + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text dark:text-text-dark">
                    Page {p.pageIndex + 1}
                  </p>
                  <p className="text-xs text-text-light dark:text-text-dark-muted">
                    {p.rotation === 0 ? "No rotation" : `Rotated ${p.rotation}°`}
                  </p>
                </div>
                {/* Rotation indicator */}
                <div
                  className="flex-shrink-0 w-8 h-10 border border-border dark:border-border-dark rounded flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <svg className="w-4 h-5 text-text-light dark:text-text-dark-muted" fill="none" viewBox="0 0 16 20" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="1" y="1" width="14" height="18" rx="1" />
                    <line x1="4" y1="5" x2="12" y2="5" />
                    <line x1="4" y1="8" x2="10" y2="8" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => rotatePage(p.pageIndex, 90)}
                    disabled={isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label={`Rotate page ${p.pageIndex + 1} 90 degrees clockwise`}
                    title="90° CW"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotatePage(p.pageIndex, 180)}
                    disabled={isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label={`Rotate page ${p.pageIndex + 1} 180 degrees`}
                    title="180°"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => rotatePage(p.pageIndex, 270)}
                    disabled={isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label={`Rotate page ${p.pageIndex + 1} 90 degrees counter-clockwise`}
                    title="90° CCW"
                  >
                    <svg className="w-4 h-4 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Apply & Download */}
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
                onClick={applyRotation}
                disabled={!hasRotations || isProcessing}
                className="btn-primary text-lg px-8 py-3"
              >
                {isProcessing ? "Applying Rotation..." : "Apply Rotation & Download"}
              </button>
            ) : (
              <button onClick={handleDownload} className="btn-accent text-lg px-8 py-3">
                Download Rotated PDF
              </button>
            )}
          </div>
        </section>
      )}

      <AdSlot slot="below-results" />

      {/* How-To Guide */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          How to Rotate PDF Pages Online — Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Rotating PDF pages is a common need when dealing with scanned documents, photographs
            embedded in PDFs, or files received from others with incorrect page orientation.
            Whether a single page is sideways or an entire document is upside down, pdftools.one
            lets you fix it in seconds directly in your browser without installing any software.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your PDF.</strong> Click the upload area or drag and drop your PDF
            file. The tool will immediately read the document and display a list of all pages with
            their current rotation status.
          </p>
          <p>
            <strong>2. Rotate individual pages.</strong> Each page in the list has three rotation
            buttons: 90 degrees clockwise (CW), 180 degrees, and 90 degrees counter-clockwise
            (CCW). Click the appropriate button for each page that needs correction. A visual
            indicator shows the current rotation angle for each page.
          </p>
          <p>
            <strong>3. Rotate all pages at once.</strong> If every page in the document needs the
            same rotation, use the &ldquo;Rotate all pages&rdquo; buttons at the top of the page
            list. This applies the same rotation to every page simultaneously, saving you time on
            large documents.
          </p>
          <p>
            <strong>4. Download the result.</strong> Click the &ldquo;Apply Rotation &amp;
            Download&rdquo; button. The tool applies your rotation settings and generates a new PDF
            file. Click the download button to save it to your device.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Understanding PDF Rotation</h3>
          <p>
            PDF rotation is a metadata operation, not a visual transformation. When you rotate a
            page, the tool updates the page&rsquo;s rotation property in the PDF structure. This
            means the content itself is not re-rendered or recompressed. Text remains searchable,
            fonts stay embedded, and images retain their original resolution. This is why PDF
            rotation is always a lossless operation.
          </p>
          <p>
            The three rotation options correspond to standard angles: 90 degrees clockwise turns
            the page a quarter turn to the right, 180 degrees flips it upside down, and 270 degrees
            (or 90 degrees counter-clockwise) turns it a quarter turn to the left. You can apply
            multiple rotations to the same page — they accumulate, so two 90-degree clockwise
            rotations equal one 180-degree rotation.
          </p>

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Common Scenarios</h3>
          <p>
            <strong>Scanned documents:</strong> When scanning paper documents, pages sometimes feed
            through the scanner at the wrong angle. This is especially common with automatic
            document feeders (ADF) that process mixed-orientation originals. Use the individual
            page rotation to fix each page independently.
          </p>
          <p>
            <strong>Landscape pages in portrait documents:</strong> Reports and presentations
            often contain a mix of portrait and landscape pages. If a landscape chart or table
            appears sideways in your PDF viewer, rotating that specific page by 90 degrees will
            correct the display without affecting the rest of the document.
          </p>
          <p>
            <strong>Mobile phone scans:</strong> Photos taken with a phone camera and converted to
            PDF sometimes have incorrect orientation metadata. A quick 90 or 180 degree rotation
            fixes the issue permanently.
          </p>
          <p>
            <strong>Batch correction:</strong> If you receive a multi-page document where every
            page is upside down (a common issue with certain scanner configurations), use the
            &ldquo;Rotate all pages 180 degrees&rdquo; button to fix the entire document in one
            click.
          </p>

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Like all tools on pdftools.one, the rotation tool processes your files entirely in your
            browser. No data is uploaded to any server. This makes it safe for confidential
            documents including legal contracts, medical records, financial statements, and personal
            identification documents. When you close the browser tab, all data is permanently
            erased from memory.
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
        <RelatedTools currentSlug="rotate-pdf" />
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
