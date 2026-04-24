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
import type { ProcessingState, FAQItem, ImageQuality } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "How do I convert a PDF to JPG images?",
    answer:
      "Upload your PDF file using the upload area above. The tool will render each page of your PDF as a separate JPG image. You can choose between Low, Medium, and High quality presets to balance image quality against file size. Once conversion is complete, you can preview each page, download individual images, or download all pages as a single ZIP file.",
  },
  {
    question: "What quality setting should I choose?",
    answer:
      "For most purposes, Medium quality (75%) provides an excellent balance between image clarity and file size. Choose High quality (92%) when you need crisp images for printing or professional presentations. Low quality (50%) is ideal when you need the smallest possible file sizes, such as for web thumbnails or quick previews where fine detail is not critical.",
  },
  {
    question: "Can I convert a multi-page PDF to JPG?",
    answer:
      "Yes. The tool converts every page of your PDF into a separate JPG image. After conversion, you can see thumbnail previews of all pages, download any individual page, or click the Download All as ZIP button to get every page in a single compressed archive. There is no limit on the number of pages.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. All conversion happens entirely in your web browser using JavaScript. Your PDF file is read from your device into browser memory, each page is rendered to an HTML Canvas element, and the canvas is exported as a JPG image. No data is ever sent over the internet. Your documents remain completely private.",
  },
  {
    question: "Why are my converted images blurry?",
    answer:
      "If your images appear blurry, try selecting the High quality preset which uses 92% JPEG quality and a higher rendering scale. The rendering resolution depends on the original PDF page dimensions and the scale factor used. For PDFs created from scanned documents, the output quality is limited by the scan resolution of the original document.",
  },
];

interface ConvertedPage {
  pageNumber: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

const qualityPresets: Record<ImageQuality, { label: string; value: number; scale: number }> = {
  low: { label: "Low (50%)", value: 0.5, scale: 1 },
  medium: { label: "Medium (75%)", value: 0.75, scale: 1.5 },
  high: { label: "High (92%)", value: 0.92, scale: 2 },
};

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<ImageQuality>("medium");
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [pages, setPages] = useState<ConvertedPage[]>([]);

  const handleFiles = useCallback((files: File[]) => {
    // Revoke old object URLs to prevent memory leaks
    setPages((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
    if (files.length > 0) {
      setFile(files[0]);
      setPages([]);
      setProcessing({ status: "idle", progress: 0 });
    }
  }, []);

  const convertPdf = useCallback(async () => {
    if (!file) return;

    setProcessing({ status: "processing", progress: 5, message: "Loading PDF..." });

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      setProcessing({ status: "processing", progress: 15, message: "Parsing document..." });

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      const preset = qualityPresets[quality];
      const convertedPages: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProcessing({
          status: "processing",
          progress: 15 + Math.round((i / totalPages) * 80),
          message: `Converting page ${i} of ${totalPages}...`,
        });

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: preset.scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Failed to get canvas context");

        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error(`Failed to convert page ${i} to JPG`));
            },
            "image/jpeg",
            preset.value
          );
        });

        convertedPages.push({
          pageNumber: i,
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
        });
      }

      pdfDoc.destroy();
      setPages(convertedPages);
      setProcessing({ status: "complete", progress: 100, message: "Conversion complete!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "Failed to convert PDF",
      });
    }
  }, [file, quality]);

  const downloadPage = useCallback(
    (page: ConvertedPage) => {
      if (!file) return;
      const baseName = file.name.replace(/\.pdf$/i, "");
      downloadBlob(page.blob, `${baseName}-page-${page.pageNumber}.jpg`);
    },
    [file]
  );

  const downloadAllAsZip = useCallback(async () => {
    if (!file || pages.length === 0) return;

    setProcessing({ status: "processing", progress: 0, message: "Creating ZIP..." });

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 0; i < pages.length; i++) {
        zip.file(`${baseName}-page-${pages[i].pageNumber}.jpg`, pages[i].blob);
        setProcessing({
          status: "processing",
          progress: Math.round(((i + 1) / pages.length) * 80),
          message: `Adding page ${i + 1} to ZIP...`,
        });
      }

      setProcessing({ status: "processing", progress: 90, message: "Compressing ZIP..." });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `${baseName}-all-pages.zip`);
      setProcessing({ status: "complete", progress: 100, message: "ZIP downloaded!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "Failed to create ZIP",
      });
    }
  }, [file, pages]);

  const reset = useCallback(() => {
    // Revoke object URLs to free memory
    pages.forEach((p) => URL.revokeObjectURL(p.url));
    setFile(null);
    setPages([]);
    setProcessing({ status: "idle", progress: 0 });
  }, [pages]);

  const isProcessing = processing.status === "processing";

  return (
    <div className="page-container">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-text dark:text-text-dark mb-3">
          PDF to JPG Converter
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl mx-auto">
          Convert every page of your PDF into a high-quality JPG image.
          Choose your quality, preview results, and download individually or as ZIP.
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

      {/* File loaded - quality selection & convert */}
      {file && pages.length === 0 && (
        <section className="my-8 p-6 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-text dark:text-text-dark truncate max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-text-light dark:text-text-dark-muted">
                Size: {formatFileSize(file.size)}
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

          {/* Quality Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text dark:text-text-dark mb-3">
              Image Quality
            </label>
            <div className="flex gap-3">
              {(Object.keys(qualityPresets) as ImageQuality[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    quality === key
                      ? "bg-primary text-white border-primary"
                      : "bg-surface dark:bg-surface-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary"
                  }`}
                >
                  {qualityPresets[key].label}
                </button>
              ))}
            </div>
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
              onClick={convertPdf}
              disabled={isProcessing}
              className="btn-primary text-lg px-8 py-3"
            >
              {isProcessing ? "Converting..." : "Convert to JPG"}
            </button>
          </div>
        </section>
      )}

      {/* Results - Thumbnails & Downloads */}
      {pages.length > 0 && (
        <section className="my-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text dark:text-text-dark">
              Converted Pages ({pages.length})
            </h2>
            <div className="flex gap-3">
              <button onClick={downloadAllAsZip} disabled={isProcessing} className="btn-accent px-4 py-2">
                {isProcessing ? "Creating ZIP..." : "Download All as ZIP"}
              </button>
              <button onClick={reset} className="btn-secondary px-4 py-2">
                Convert Another
              </button>
            </div>
          </div>

          {isProcessing && (
            <div className="mb-4">
              <ProgressBar progress={processing.progress} />
              <p className="text-sm text-text-light dark:text-text-dark-muted text-center mt-2">
                {processing.message}
              </p>
            </div>
          )}

          <div className="thumbnail-grid">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="rounded-lg border border-border dark:border-border-dark overflow-hidden bg-surface dark:bg-surface-dark"
              >
                <div className="aspect-[3/4] relative bg-surface-alt dark:bg-surface-dark-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      Page {page.pageNumber}
                    </p>
                    <p className="text-xs text-text-light dark:text-text-dark-muted">
                      {formatFileSize(page.blob.size)} &middot; {page.width}&times;{page.height}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadPage(page)}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="below-results" />

      {/* How-To Guide */}
      <section className="section-spacing">
        <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-6">
          How to Convert PDF to JPG Online &mdash; Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Converting PDF documents to JPG images is useful in many situations. You might need to
            extract a chart from a report for a presentation, create image previews of document
            pages for a website, share a single page on social media, or prepare thumbnails for a
            document management system. With pdftools.one you can convert any PDF to high-quality
            JPG images directly in your browser without installing software or uploading files to
            a remote server.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your PDF.</strong> Click the upload area or drag and drop your PDF
            file. The tool accepts files up to 100 MB. Once loaded, you will see the file name and
            size displayed along with quality options.
          </p>
          <p>
            <strong>2. Choose your quality.</strong> Select from three presets: Low (50% JPEG
            quality, smallest files), Medium (75%, good balance), or High (92%, best visual
            quality). Higher quality means larger image files but sharper details. For most uses,
            Medium is the recommended starting point.
          </p>
          <p>
            <strong>3. Click Convert.</strong> Press the &ldquo;Convert to JPG&rdquo; button. The
            tool renders each page of your PDF onto an HTML Canvas element at the selected quality
            level, then exports each canvas as a JPEG image. A progress bar shows the current page
            being processed.
          </p>
          <p>
            <strong>4. Preview and download.</strong> After conversion, thumbnail previews of all
            pages are displayed in a grid. Each thumbnail shows the page number, file size, and
            pixel dimensions. You can download individual pages by clicking the Download button on
            each thumbnail, or download all pages at once as a ZIP archive.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Understanding Quality Settings</h3>
          <p>
            The quality slider controls two factors: the JPEG compression level and the rendering
            scale. At Low quality, pages are rendered at 1x scale with 50% JPEG compression,
            producing the smallest files but with visible compression artifacts on detailed content.
            Medium quality uses 1.5x scale and 75% compression, providing a good balance for most
            documents. High quality renders at 2x scale with 92% compression, producing crisp
            images suitable for printing or zooming in on fine details.
          </p>
          <p>
            For text-heavy documents like contracts or articles, even Low quality usually produces
            readable results. For documents with photographs, diagrams, or fine graphics, Medium
            or High quality is recommended to preserve visual fidelity.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Your PDF file never leaves your device. The entire conversion process runs in your
            browser using the pdfjs-dist library (the same engine that powers Firefox&rsquo;s
            built-in PDF viewer) and the HTML Canvas API. No data is transmitted over the internet
            at any point. This makes the tool safe for confidential documents, legal files, medical
            records, financial statements, and any other sensitive content.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Tips for Best Results</h3>
          <p>
            If your converted images appear blurry, switch to the High quality preset for sharper
            rendering. For very large PDFs with many pages, the conversion may take longer as each
            page must be individually rendered. If your browser runs out of memory on extremely
            large documents, try converting a smaller range of pages using our Split PDF tool first,
            then converting each section separately.
          </p>
          <p>
            The output image dimensions depend on the original PDF page size and the rendering
            scale. A standard A4 page at 2x scale produces an image approximately 1190 by 1684
            pixels, which is suitable for most screen and print applications. If you need specific
            dimensions, you can resize the images after download using any image editor.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Common Use Cases</h3>
          <p>
            <strong>Presentations:</strong> Extract charts, tables, or diagrams from PDF reports
            to embed in PowerPoint or Google Slides. <strong>Social media:</strong> Convert a
            single page or infographic to JPG for sharing on platforms that don&rsquo;t support PDF.
            <strong>Web publishing:</strong> Create image previews of PDF documents for your
            website. <strong>Archiving:</strong> Convert scanned documents to individual page
            images for easier organization and tagging.
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
        <RelatedTools currentSlug="pdf-to-jpg" />
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
