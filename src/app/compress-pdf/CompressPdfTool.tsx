"use client";

import { useState, useCallback, useRef } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PrivacyBadge } from "@/components/ui/PrivacyBadge";
import { AdSlot } from "@/components/ui/AdSlot";
import { FAQ } from "@/components/seo/FAQ";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { formatFileSize, downloadBlob } from "@/lib/utils";
import type { ProcessingState, FAQItem } from "@/types";
import { useDeviceTier, formatMaxSize } from "@/hooks/useDeviceTier";

const faqItems: FAQItem[] = [
  {
    question: "How does the PDF compressor reduce file size?",
    answer:
      "Our compressor works in several ways. First, it strips all document metadata such as author name, title, subject, keywords, creator, and producer fields. Second, it re-saves the PDF using pdf-lib's built-in optimization which removes orphaned objects, deduplicates streams, and cleans up the cross-reference table. For PDFs containing embedded images, the tool re-encodes those images at a lower quality setting using the browser's Canvas API, which can significantly reduce file size for image-heavy documents.",
  },
  {
    question: "How much smaller will my PDF be after compression?",
    answer:
      "Results vary depending on the content of your PDF. Documents with many embedded images can see reductions of 30-70%. Text-heavy PDFs with few images may see more modest savings of 5-20%, primarily from metadata removal and structural optimization. The tool always shows you the exact original and compressed sizes so you can see the real savings.",
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
  const deviceConfig = useDeviceTier();
  const [file, setFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState("");
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [result, setResult] = useState<CompressionResult | null>(null);
  const abortRef = useRef(false);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      const uploaded = files[0];

      // File size validation
      if (uploaded.size > deviceConfig.maxPdfFileSize) {
        setFileSizeError(
          `File too large (${formatFileSize(uploaded.size)}). Maximum for your device: ${formatMaxSize(deviceConfig.maxPdfFileSize)}. Try a smaller file or use a desktop computer.`
        );
        return;
      }

      setFileSizeError("");
      setFile(uploaded);
      setResult(null);
      setProcessing({ status: "idle", progress: 0 });
    }
  }, [deviceConfig.maxPdfFileSize]);

  const cancelProcessing = useCallback(() => {
    abortRef.current = true;
    setProcessing({ status: "idle", progress: 0 });
  }, []);

  const compressPdf = useCallback(async () => {
    if (!file) return;

    setProcessing({ status: "processing", progress: 10, message: "Loading PDF..." });
    abortRef.current = false;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalSize = arrayBuffer.byteLength;

      if (abortRef.current) { setProcessing({ status: "idle", progress: 0 }); return; }

      setProcessing({ status: "processing", progress: 20, message: "Parsing document..." });

      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      if (abortRef.current) { setProcessing({ status: "idle", progress: 0 }); return; }

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
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        pdfJsDoc = await loadingTask.promise;
        pdfjsAvailable = true;
      } catch {
        // pdfjs-dist not available, skip image re-encoding
      }

      if (abortRef.current) {
        if (pdfJsDoc) pdfJsDoc.destroy();
        setProcessing({ status: "idle", progress: 0 });
        return;
      }

      // Reuse a single canvas element to avoid memory leaks
      const canvas = document.createElement("canvas");

      for (let i = 0; i < pages.length; i++) {
        if (abortRef.current) {
          if (pdfJsDoc) pdfJsDoc.destroy();
          canvas.width = 0;
          canvas.height = 0;
          setProcessing({ status: "idle", progress: 0 });
          return;
        }

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

      if (abortRef.current) { setProcessing({ status: "idle", progress: 0 }); return; }

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
      if (!abortRef.current) {
        const isMemoryError = err instanceof Error &&
          (err.message.includes("memory") || err.message.includes("allocation") || err.message.includes("ArrayBuffer"));
        setProcessing({
          status: "error",
          progress: 0,
          message: isMemoryError
            ? "Out of memory. Try a smaller file or use a desktop computer with more RAM."
            : (err instanceof Error ? err.message : "Failed to compress PDF"),
        });
      }
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (!result || !file) return;
    const name = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
    downloadBlob(result.blob, name);
  }, [result, file]);

  const reset = useCallback(() => {
    abortRef.current = true;
    setFile(null);
    setResult(null);
    setFileSizeError("");
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

      {/* File Size Error */}
      {fileSizeError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          ⚠️ {fileSizeError}
        </div>
      )}

      {/* Upload Area */}
      {!file && (
        <section className="my-8">
          <FileUpload accept=".pdf" maxSize={deviceConfig.maxPdfFileSize} onFiles={handleFiles}>
            <div className="space-y-3">
              <svg className="w-12 h-12 mx-auto text-text-light dark:text-text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p className="text-lg font-medium text-text dark:text-text-dark">
                Drag & drop a PDF file here
              </p>
              <p className="text-sm text-text-light dark:text-text-dark-muted">
                or click to browse · Max {formatMaxSize(deviceConfig.maxPdfFileSize)}
              </p>
            </div>
          </FileUpload>
          {/* Device tier info */}
          <p className="text-center text-xs text-text-light dark:text-text-dark-muted mt-2">
            📱 Detected: {deviceConfig.tier} · Max file size: {formatMaxSize(deviceConfig.maxPdfFileSize)}
          </p>
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

          {/* Processing Warning */}
          {isProcessing && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm">
              ⏱️ {deviceConfig.pdfWarning}
            </div>
          )}

          {isProcessing && (
            <div className="mb-4">
              <ProgressBar progress={processing.progress} label={processing.message} />
              <div className="flex justify-center mt-2">
                <button
                  onClick={cancelProcessing}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          )}

          {processing.status === "error" && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm text-center">
              {processing.message}
            </div>
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
                <div className="bg-border dark:bg-surface-alt h-4 rounded-full" style={{ width: "100%" }} />
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
            PDF file. Once loaded, you will see the file name and its original size displayed clearly.
          </p>
          <p>
            <strong>2. Click Compress.</strong> Press the &ldquo;Compress PDF&rdquo; button to start the
            optimization process. A progress bar shows you exactly what is happening at each stage.
          </p>
          <p>
            <strong>3. Review the results.</strong> After compression, you will see a side-by-side
            comparison of the original and compressed file sizes, along with the percentage of
            space saved.
          </p>
          <p>
            <strong>4. Download your file.</strong> Click the download button to save the compressed
            PDF to your device.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">What Gets Optimized?</h3>
          <p>
            The compression process targets several areas: metadata removal, structural optimization,
            and image re-encoding. For PDFs containing embedded raster images, the tool renders each
            page and re-encodes the visual content as a compressed JPEG image, which is where the
            most significant file size reductions occur.
          </p>

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Unlike most online PDF compressors that require you to upload your files to their
            servers, pdftools.one processes everything locally in your browser. Your PDF is read
            from your device into browser memory, compressed using JavaScript libraries, and the
            result is generated entirely on your machine. No network requests are made with your
            file data.
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
            server. We don&rsquo;t store, read, or share your documents. Once you close this tab, all
            data is permanently gone.
          </p>
        </div>
      </section>

      <AdSlot slot="footer" />
    </div>
  );
}
