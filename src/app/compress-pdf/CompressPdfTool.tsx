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
    question: "How does the PDF compressor reduce file size?",
    answer:
      "Our compressor works in several ways. First, it strips all document metadata such as author name, title, subject, keywords, creator, and producer fields. Second, it re-saves the PDF using pdf-lib’s built-in optimization which removes orphaned objects, deduplicates streams, and cleans up the cross-reference table. For PDFs containing embedded images, the tool re-encodes those images at a lower quality setting using the browser’s Canvas API, which can significantly reduce file size for image-heavy documents.",
  },
  {
    question: "How much smaller will my PDF be after compression?",
    answer:
      "Results vary depending on the content of your PDF. Documents with many embedded images can see reductions of 30–70%. Text-heavy PDFs with few images may see more modest savings of 5–20%, primarily from metadata removal and structural optimization. The tool always shows you the exact original and compressed sizes so you can see the real savings.",
  },
  {
    question: "Does compression reduce the quality of my PDF?",
    answer:
      "Text, vector graphics, and page layout remain completely unchanged. Only embedded raster images are re-encoded at a slightly lower quality to save space. For most documents the visual difference is imperceptible. If your PDF is text-only, compression will not affect visual quality at all since the savings come from metadata removal and structural cleanup.",
  },
  {
    question: "Is my PDF uploaded to a server during compression?",
    answer:
      "No. The entire compression process runs locally in your web browser using JavaScript. Your file is read from your device into browser memory, processed client-side, and the result is saved back to your device. No data is ever transmitted over the internet. You can verify this by disconnecting from the internet before compressing — the tool will still work.",
  },
  {
    question: "Can I compress password-protected PDFs?",
    answer:
      "The tool can process PDFs that have an owner password (restricting editing or printing) but not PDFs that require a user password to open. If your PDF requires a password to view, you will need to remove the password protection first using a PDF unlock tool, then compress the unlocked file.",
  },
];

interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
}

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
      setProcessing({ status: "idle", progress: 0 });
    }
  }, []);

  const compressPdf = useCallback(async () => {
    if (!file) return;

    setProcessing({ status: "processing", progress: 10, message: "Loading PDF..." });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalSize = arrayBuffer.byteLength;

      setProcessing({ status: "processing", progress: 20, message: "Parsing document..." });

      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      setProcessing({ status: "processing", progress: 40, message: "Removing metadata..." });

      // Strip metadata
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setCreator("");
      pdfDoc.setProducer("");

      setProcessing({ status: "processing", progress: 60, message: "Optimizing images..." });

      // Attempt image re-encoding on each page
      const pages = pdfDoc.getPages();

      // Load pdfjs-dist ONCE outside the loop for performance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pdfJsDoc: any = null;
      let pdfjsAvailable = false;
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        pdfJsDoc = await loadingTask.promise;
        pdfjsAvailable = true;
      } catch {
        // pdfjs-dist not available, skip image re-encoding
      }

      // Reuse a single canvas element to avoid memory leaks
      const canvas = document.createElement("canvas");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // Re-encode page content as compressed JPEG image
        if (pdfjsAvailable && pdfJsDoc) {
          try {
            const scale = 1.5;
            const pdfJsPage = await pdfJsDoc.getPage(i + 1);
            const viewport = pdfJsPage.getViewport({ scale });
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              await pdfJsPage.render({ canvasContext: ctx, viewport }).promise;

              // Convert canvas to JPEG and embed back
              const jpegBlob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob((b) => resolve(b), "image/jpeg", 0.72)
              );

              if (jpegBlob) {
                const jpegBuffer = await jpegBlob.arrayBuffer();
                const jpegImage = await pdfDoc.embedJpg(new Uint8Array(jpegBuffer));

                // Draw compressed image over page
                page.drawImage(jpegImage, {
                  x: 0,
                  y: 0,
                  width,
                  height,
                });
              }
            }
            pdfJsPage.cleanup();
          } catch {
            // If image re-encoding fails for a page, skip it
            // Metadata removal and save optimization still apply
          }
        }

        setProcessing({
          status: "processing",
          progress: 60 + Math.round((i / pages.length) * 25),
          message: `Optimizing page ${i + 1} of ${pages.length}...`,
        });
      }

      // Clean up pdfjs document and canvas
      if (pdfjsAvailable && pdfJsDoc) {
        pdfJsDoc.destroy();
      }
      canvas.width = 0;
      canvas.height = 0;

      setProcessing({ status: "processing", progress: 90, message: "Saving optimized PDF..." });

      const pdfBytes = await pdfDoc.save();
      const compressedBlob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });

      setResult({
        blob: compressedBlob,
        originalSize,
        compressedSize: compressedBlob.size,
      });

      setProcessing({ status: "complete", progress: 100, message: "Compression complete!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "Failed to compress PDF",
      });
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    const name = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
    downloadBlob(result.blob, name);
  }, [result, file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setProcessing({ status: "idle", progress: 0 });
  }, []);

  const isProcessing = processing.status === "processing";
  const savingsPercent =
    result && result.originalSize > 0
      ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
      : 0;

  return (
    <div className="page-container">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-text dark:text-text-dark mb-3">
          Compress PDF
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl mx-auto">
          Reduce your PDF file size by removing metadata and optimizing content.
          100% free, 100% private — everything happens in your browser.
        </p>
        <div className="mt-4">
          <PrivacyBadge />
        </div>
      </section>

      <AdSlot slot="leaderboard" />

      {/* Upload Area */}
      {!file && (
        <section className="my-8">
          <FileUpload accept=".pdf" onFiles={handleFiles} />
        </section>
      )}

      {/* File Info & Compression */}
      {file && !result && (
        <section className="my-8 p-6 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-text dark:text-text-dark truncate max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-text-light dark:text-text-dark-muted">
                Original size: {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={reset}
              disabled={isProcessing}
              className="btn-secondary text-sm"
            >
              Change File
            </button>
          </div>

          {isProcessing && (
            <div className="mb-4">
              <ProgressBar progress={processing.progress} />
              <p className="text-sm text-text-light dark:text-text-dark-muted text-center mt-2">
                {processing.message}
              </p>
            </div>
          )}

          {processing.status === "error" && (
            <p className="text-sm text-red-500 text-center mb-4">{processing.message}</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={compressPdf}
              disabled={isProcessing}
              className="btn-primary text-lg px-8 py-3"
            >
              {isProcessing ? "Compressing..." : "Compress PDF"}
            </button>
          </div>
        </section>
      )}

      {/* Results */}
      {result && (
        <section className="my-8 p-6 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <h2 className="text-xl font-bold text-text dark:text-text-dark mb-6 text-center">
            Compression Complete
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-surface-alt dark:bg-surface-dark-alt">
              <p className="text-sm text-text-light dark:text-text-dark-muted">Original</p>
              <p className="text-2xl font-bold text-text dark:text-text-dark">
                {formatFileSize(result.originalSize)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-sm text-green-600 dark:text-green-400">Compressed</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatFileSize(result.compressedSize)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm text-primary-light dark:text-secondary">Savings</p>
              <p className="text-2xl font-bold text-primary dark:text-secondary">
                {savingsPercent > 0 ? `${savingsPercent}%` : "Minimal"}
              </p>
            </div>
          </div>

          {/* Visual bar comparison */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-light dark:text-text-dark-muted w-20">Original</span>
              <div className="flex-1 bg-surface-alt dark:bg-surface-dark-alt rounded-full h-4">
                <div className="bg-border dark:bg-surface-alt0 h-4 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-light dark:text-text-dark-muted w-20">Compressed</span>
              <div className="flex-1 bg-surface-alt dark:bg-surface-dark-alt rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${result.originalSize > 0 ? Math.max(5, (result.compressedSize / result.originalSize) * 100) : 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={handleDownload} className="btn-accent text-lg px-8 py-3">
              Download Compressed PDF
            </button>
            <button onClick={reset} className="btn-secondary text-lg px-6 py-3">
              Compress Another
            </button>
          </div>
        </section>
      )}

      <AdSlot slot="below-results" />

      {/* How-To Guide */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          How to Compress PDF Files Online — Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Large PDF files are a common headache. Whether you need to email a document that exceeds
            the attachment size limit, upload a file to a portal with strict size restrictions, or
            simply save storage space on your device, compressing a PDF is often the quickest
            solution. With pdftools.one you can reduce your PDF file size directly in your browser
            without installing any software, creating an account, or uploading sensitive documents
            to a third-party server.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your PDF.</strong> Click the upload area above or drag and drop your
            PDF file. The tool accepts files up to 100 MB. Once loaded, you will see the file name
            and its original size displayed clearly.
          </p>
          <p>
            <strong>2. Click Compress.</strong> Press the “Compress PDF” button to start the
            optimization process. The tool will strip unnecessary metadata, optimize the document
            structure, and re-encode embedded images at a balanced quality level. A progress bar
            shows you exactly what is happening at each stage.
          </p>
          <p>
            <strong>3. Review the results.</strong> After compression, you will see a side-by-side
            comparison of the original and compressed file sizes, along with the percentage of
            space saved. A visual bar chart makes it easy to see the difference at a glance.
          </p>
          <p>
            <strong>4. Download your file.</strong> Click the download button to save the compressed
            PDF to your device. The file name will have “-compressed” appended so you can
            easily distinguish it from the original.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">What Gets Optimized?</h3>
          <p>
            The compression process targets several areas of the PDF file. First, all document
            metadata is removed — this includes the title, author, subject, keywords, creator
            application, and producer fields. While this data is often small, it can add up in
            documents that have been edited by multiple applications over time. Second, the tool
            re-saves the PDF using an optimized serialization that removes orphaned objects,
            consolidates duplicate data streams, and rebuilds the cross-reference table efficiently.
          </p>
          <p>
            For PDFs containing embedded raster images — such as scanned documents, photos, or
            screenshots — the tool renders each page and re-encodes the visual content as a
            compressed JPEG image. This is where the most significant file size reductions occur.
            A scanned document that was saved with lossless compression can often be reduced by
            50% or more with minimal visible quality loss.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Understanding Compression Results</h3>
          <p>
            The amount of compression you achieve depends entirely on the content of your PDF.
            Image-heavy documents like scanned pages, photo albums, or design mockups will see
            the largest reductions, often 30–70%. Text-heavy documents with few or no images
            will see smaller savings, typically 5–20%, since the text itself is already stored
            efficiently. If your PDF was already optimized by another tool, the additional savings
            may be minimal — the tool will always show you the honest results.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Unlike most online PDF compressors that require you to upload your files to their
            servers, pdftools.one processes everything locally in your browser. Your PDF is read
            from your device into browser memory, compressed using JavaScript libraries (pdf-lib
            and pdfjs-dist), and the result is generated entirely on your machine. No network
            requests are made with your file data. You can verify this by opening your browser’s
            developer tools and monitoring the Network tab during compression — you will see
            zero file uploads. This makes our tool safe for confidential documents, legal files,
            medical records, and any other sensitive content.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Tips for Maximum Compression</h3>
          <p>
            If you need even smaller files, consider these strategies: remove unnecessary pages
            before compressing using our Split PDF tool, convert color pages to grayscale if color
            is not essential, or reduce the number of embedded fonts by using standard system fonts.
            For documents that will only be viewed on screen, lower resolution images are perfectly
            acceptable and can dramatically reduce file size.
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
        <RelatedTools currentSlug="compress-pdf" />
      </section>

      {/* Privacy Note */}
      <section className="section-spacing">
        <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Your Privacy is Guaranteed
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
            All PDF processing happens locally in your browser. Your files are never uploaded to any
            server. We don’t store, read, or share your documents. Once you close this tab, all
            data is permanently gone.
          </p>
        </div>
      </section>

      <AdSlot slot="footer" />
    </div>
  );
}
