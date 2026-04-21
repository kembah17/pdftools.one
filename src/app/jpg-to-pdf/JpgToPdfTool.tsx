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
import type { ProcessingState, FAQItem, PageSize } from "@/types";

const faqItems: FAQItem[] = [
  {
    question: "How do I convert JPG images to a PDF?",
    answer:
      "Upload one or more JPG, JPEG, PNG, or WEBP images using the upload area above. Arrange them in your desired order using the move up and down buttons. Choose your preferred page size (A4, Letter, or Fit to Image) and margin setting, then click the Create PDF button. Your images will be combined into a single PDF document ready for download.",
  },
  {
    question: "Can I combine multiple images into one PDF?",
    answer:
      "Yes. You can upload as many images as you need and they will all be included in the final PDF, one image per page. Use the reorder buttons to arrange the pages in your preferred sequence. You can also remove individual images before creating the PDF if you change your mind about including them.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "The tool supports JPG (JPEG), PNG, and WEBP image formats. JPG and PNG images are embedded directly into the PDF. WEBP images are automatically converted to a compatible format before embedding. All common image types from cameras, screenshots, and web downloads are supported.",
  },
  {
    question: "What is the difference between the page size options?",
    answer:
      "A4 (210 x 297 mm) is the international standard paper size used in most countries. Letter (8.5 x 11 inches) is the standard paper size in the United States and Canada. Fit to Image creates each page exactly the size of the image, which is ideal when you want to preserve the original dimensions without any scaling or white space.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No. All processing happens entirely in your web browser. Your images are read from your device into browser memory, embedded into a PDF document using the pdf-lib JavaScript library, and the result is saved back to your device. No data is ever transmitted over the internet. Your images remain completely private.",
  },
];

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
}

type MarginSize = "none" | "small" | "medium" | "large";

const pageSizeOptions: Record<PageSize, { label: string; width: number; height: number }> = {
  a4: { label: "A4 (210 × 297 mm)", width: 595.28, height: 841.89 },
  letter: { label: "Letter (8.5 × 11 in)", width: 612, height: 792 },
  fit: { label: "Fit to Image", width: 0, height: 0 },
};

const marginOptions: Record<MarginSize, { label: string; value: number }> = {
  none: { label: "None", value: 0 },
  small: { label: "Small (20pt)", value: 20 },
  medium: { label: "Medium (40pt)", value: 40 },
  large: { label: "Large (60pt)", value: 60 },
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
    img.src = URL.createObjectURL(file);
  });
}

export default function JpgToPdfTool() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [margin, setMargin] = useState<MarginSize>("medium");
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = [];
    for (const file of files) {
      try {
        const img = await loadImage(file);
        newImages.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          previewUrl: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch {
        // Skip files that can't be loaded as images
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    setResultBlob(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
    setResultBlob(null);
  }, []);

  const moveImage = useCallback((index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const newArr = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
      [newArr[index], newArr[targetIndex]] = [newArr[targetIndex], newArr[index]];
      return newArr;
    });
    setResultBlob(null);
  }, []);

  const createPdf = useCallback(async () => {
    if (images.length === 0) return;

    setProcessing({ status: "processing", progress: 5, message: "Initializing..." });

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      const marginPt = marginOptions[margin].value;

      for (let i = 0; i < images.length; i++) {
        setProcessing({
          status: "processing",
          progress: 5 + Math.round((i / images.length) * 85),
          message: `Processing image ${i + 1} of ${images.length}...`,
        });

        const imgFile = images[i];
        const arrayBuffer = await imgFile.file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);

        let embeddedImage;
        const fileType = imgFile.file.type;
        const fileName = imgFile.name.toLowerCase();

        if (fileType === "image/png" || fileName.endsWith(".png")) {
          embeddedImage = await pdfDoc.embedPng(uint8);
        } else if (
          fileType === "image/jpeg" ||
          fileName.endsWith(".jpg") ||
          fileName.endsWith(".jpeg")
        ) {
          embeddedImage = await pdfDoc.embedJpg(uint8);
        } else {
          // For WEBP and other formats, convert to PNG via canvas
          const img = await loadImage(imgFile.file);
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Failed to get canvas context");
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(img.src);

          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error("Failed to convert image to PNG"));
              },
              "image/png"
            );
          });
          const pngBuffer = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(new Uint8Array(pngBuffer));
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === "fit") {
          // Page size matches image + margins
          pageWidth = imgWidth + marginPt * 2;
          pageHeight = imgHeight + marginPt * 2;
        } else {
          pageWidth = pageSizeOptions[pageSize].width;
          pageHeight = pageSizeOptions[pageSize].height;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate drawing dimensions to fit within page minus margins
        const availableWidth = pageWidth - marginPt * 2;
        const availableHeight = pageHeight - marginPt * 2;

        let drawWidth: number;
        let drawHeight: number;

        if (pageSize === "fit") {
          drawWidth = imgWidth;
          drawHeight = imgHeight;
        } else {
          // Scale image to fit within available area while maintaining aspect ratio
          const scaleX = availableWidth / imgWidth;
          const scaleY = availableHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
          drawWidth = imgWidth * scale;
          drawHeight = imgHeight * scale;
        }

        // Center image on page
        const x = marginPt + (availableWidth - drawWidth) / 2;
        const y = marginPt + (availableHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      setProcessing({ status: "processing", progress: 95, message: "Saving PDF..." });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      setResultBlob(blob);
      setProcessing({ status: "complete", progress: 100, message: "PDF created!" });
    } catch (err) {
      setProcessing({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "Failed to create PDF",
      });
    }
  }, [images, pageSize, margin]);

  const handleDownload = useCallback(() => {
    if (!resultBlob) return;
    downloadBlob(resultBlob, "images-to-pdf.pdf");
  }, [resultBlob]);

  const reset = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setResultBlob(null);
    setProcessing({ status: "idle", progress: 0 });
  }, [images]);

  const isProcessing = processing.status === "processing";

  return (
    <div className="page-container">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-text dark:text-text-dark mb-3">
          JPG to PDF Converter
        </h1>
        <p className="text-lg text-text-light dark:text-text-dark-muted max-w-2xl mx-auto">
          Convert your JPG, PNG, and WEBP images into a single PDF document.
          Reorder pages, choose page size, and set margins &mdash; all in your browser.
        </p>
        <div className="mt-4">
          <PrivacyBadge />
        </div>
      </section>

      <AdSlot slot="leaderboard" />

      {/* Upload Area */}
      <section className="my-8">
        <FileUpload
          accept=".jpg,.jpeg,.png,.webp"
          multiple={true}
          onFiles={handleFiles}
        />
      </section>

      {/* Image List & Options */}
      {images.length > 0 && (
        <section className="my-8 p-6 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text dark:text-text-dark">
              Images ({images.length})
            </h2>
            <button
              onClick={reset}
              disabled={isProcessing}
              className="btn-secondary text-sm"
            >
              Clear All
            </button>
          </div>

          {/* Image Thumbnails */}
          <ul className="space-y-2 mb-6">
            {images.map((img, idx) => (
              <li
                key={img.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text dark:text-text-dark truncate">
                    {img.name}
                  </p>
                  <p className="text-xs text-text-light dark:text-text-dark-muted">
                    {formatFileSize(img.size)} &middot; {img.width}&times;{img.height}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveImage(idx, -1)}
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
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1 || isProcessing}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
                    aria-label="Move down"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    disabled={isProcessing}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 disabled:opacity-30 transition-colors"
                    aria-label="Remove image"
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

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-3">
                Page Size
              </label>
              <div className="flex flex-col gap-2">
                {(Object.keys(pageSizeOptions) as PageSize[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setPageSize(key)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border text-left ${
                      pageSize === key
                        ? "bg-primary text-white border-primary"
                        : "bg-surface dark:bg-surface-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary"
                    }`}
                  >
                    {pageSizeOptions[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-3">
                Margins
              </label>
              <div className="flex flex-col gap-2">
                {(Object.keys(marginOptions) as MarginSize[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setMargin(key)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border text-left ${
                      margin === key
                        ? "bg-primary text-white border-primary"
                        : "bg-surface dark:bg-surface-dark text-text dark:text-text-dark border-border dark:border-border-dark hover:border-primary"
                    }`}
                  >
                    {marginOptions[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress & Actions */}
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
                onClick={createPdf}
                disabled={images.length === 0 || isProcessing}
                className="btn-primary text-lg px-8 py-3"
              >
                {isProcessing ? "Creating PDF..." : `Create PDF from ${images.length} Image${images.length !== 1 ? "s" : ""}`}
              </button>
            ) : (
              <div className="flex gap-4">
                <button onClick={handleDownload} className="btn-accent text-lg px-8 py-3">
                  Download PDF ({formatFileSize(resultBlob.size)})
                </button>
                <button onClick={reset} className="btn-secondary text-lg px-6 py-3">
                  Start Over
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
          How to Convert JPG Images to PDF Online &mdash; Complete Guide
        </h2>
        <div className="prose dark:prose-invert max-w-none text-text-light dark:text-text-dark-muted leading-relaxed space-y-4">
          <p>
            Converting images to PDF is one of the most common document tasks. Whether you need to
            compile photos into a single document for sharing, create a PDF portfolio of your work,
            package scanned receipts for expense reporting, or combine screenshots into a
            presentation handout, pdftools.one makes it fast and easy. The entire process runs in
            your browser with no software installation, no account creation, and no file uploads
            to any server.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Step-by-Step Instructions</h3>
          <p>
            <strong>1. Upload your images.</strong> Click the upload area or drag and drop one or
            more image files. The tool accepts JPG, JPEG, PNG, and WEBP formats. You can upload
            multiple files at once, and add more files later by clicking the upload area again.
            Each image is displayed with a thumbnail preview, file name, size, and pixel dimensions.
          </p>
          <p>
            <strong>2. Arrange the order.</strong> Use the up and down arrow buttons next to each
            image to reorder them. The final PDF will contain one image per page in exactly the
            order shown in the list. You can also remove individual images by clicking the X button
            if you change your mind about including them.
          </p>
          <p>
            <strong>3. Choose page size.</strong> Select from three options: A4 (the international
            standard at 210 &times; 297 mm), Letter (the US standard at 8.5 &times; 11 inches), or
            Fit to Image (each page matches the exact dimensions of its image). For most printing
            purposes, A4 or Letter is recommended. For digital viewing where you want to preserve
            original image proportions, choose Fit to Image.
          </p>
          <p>
            <strong>4. Set margins.</strong> Choose from None (images extend to the page edge),
            Small (20pt), Medium (40pt), or Large (60pt) margins. Margins add white space around
            each image, which is useful for printing since most printers cannot print to the very
            edge of the paper. For digital-only documents, None or Small margins work well.
          </p>
          <p>
            <strong>5. Create and download.</strong> Click the &ldquo;Create PDF&rdquo; button and
            wait for processing to complete. The tool embeds each image into a new PDF page,
            scaling it to fit within the available area while maintaining the original aspect ratio.
            Once complete, click the download button to save your PDF.
          </p>

          <AdSlot slot="in-content" />

          <h3 className="text-lg font-semibold text-text dark:text-text-dark">How Image Scaling Works</h3>
          <p>
            When using A4 or Letter page sizes, each image is scaled to fit within the printable
            area (page size minus margins) while maintaining its original aspect ratio. Images
            smaller than the available area are centered without upscaling, preserving their native
            resolution. Landscape images on portrait pages are scaled to fit the width, with
            vertical centering. This ensures your images always look their best regardless of
            orientation or size.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Supported Image Formats</h3>
          <p>
            The tool natively supports JPG (JPEG) and PNG images, which are embedded directly into
            the PDF without re-encoding. WEBP images are automatically converted to PNG format
            using the browser&rsquo;s Canvas API before embedding. This means JPG and PNG files
            retain their exact original quality, while WEBP files undergo a lossless conversion
            to PNG. All common image types from digital cameras, smartphones, screenshots, and
            web downloads are fully supported.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Privacy and Security</h3>
          <p>
            Your images never leave your device. The entire conversion process runs locally in your
            browser using the pdf-lib JavaScript library. No data is transmitted over the internet
            at any point. This makes the tool safe for personal photos, confidential documents,
            business receipts, medical images, and any other sensitive content. You can verify this
            by disconnecting from the internet before converting &mdash; the tool will still work
            perfectly.
          </p>
          <h3 className="text-lg font-semibold text-text dark:text-text-dark">Common Use Cases</h3>
          <p>
            <strong>Expense reports:</strong> Photograph or scan receipts and combine them into a
            single PDF for submission. <strong>Photo albums:</strong> Create a PDF photo book from
            vacation pictures or event photos. <strong>Portfolios:</strong> Compile design work,
            artwork, or photography into a professional PDF portfolio. <strong>Documentation:</strong>
            Convert screenshots of software interfaces, error messages, or web pages into a PDF
            for bug reports or training materials. <strong>Scanning:</strong> If you use your phone
            camera as a scanner, combine the resulting images into a proper multi-page PDF document.
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
        <RelatedTools currentSlug="jpg-to-pdf" />
      </section>

      {/* Privacy Note */}
      <section className="section-spacing">
        <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
            Your Privacy is Guaranteed
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm leading-relaxed">
            All image processing happens locally in your browser. Your files are never uploaded to
            any server. We don&rsquo;t store, read, or share your images. Once you close this tab,
            all data is permanently gone.
          </p>
        </div>
      </section>

      <AdSlot slot="footer" />
    </div>
  );
}
