"use client";

import { useState, useCallback, useRef } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PrivacyBadge } from "@/components/ui/PrivacyBadge";
import { formatFileSize, downloadBlob } from "@/lib/utils";
import type { ProcessingState } from "@/types";
import {
  type PreprocessingOptions,
  defaultPreprocessingOptions,
  applyPreprocessing,
} from "@/components/tools/PdfPreprocessor";

interface PageResult {
  pageNumber: number;
  text: string;
  confidence: number;
  thumbnailUrl: string;
}

interface OcrLanguage {
  code: string;
  label: string;
}

const LANGUAGES: OcrLanguage[] = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "por", label: "Portuguese" },
  { code: "deu", label: "German" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "ara", label: "Arabic" },
  { code: "hin", label: "Hindi" },
];

export default function PdfOcrTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({
    status: "idle",
    progress: 0,
  });
  const [language, setLanguage] = useState("eng");
  const [preprocessing, setPreprocessing] = useState<PreprocessingOptions>(
    defaultPreprocessingOptions
  );
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageProgress, setPageProgress] = useState(0);
  const [results, setResults] = useState<PageResult[]>([]);
  const [showCombined, setShowCombined] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRefs = useRef<HTMLCanvasElement[]>([]);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile(f);
      setResults([]);
      setPageThumbnails([]);
      setTotalPages(0);
      setProcessing({ status: "idle", progress: 0 });
      loadPdfThumbnails(f);
    }
  }, []);

  const loadPdfThumbnails = async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      const thumbnails: string[] = [];
      const canvases: HTMLCanvasElement[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        thumbnails.push(canvas.toDataURL("image/jpeg", 0.6));
        canvases.push(canvas);
      }

      setPageThumbnails(thumbnails);
      canvasRefs.current = canvases;
    } catch {
      setProcessing({
        status: "error",
        progress: 0,
        message: "Failed to load PDF. Please try a different file.",
      });
    }
  };

  const extractText = useCallback(async () => {
    if (!file) return;

    setProcessing({
      status: "processing",
      progress: 2,
      message: "Loading PDF for OCR...",
    });
    setResults([]);
    setCurrentPage(0);
    setPageProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "";

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      setProcessing({
        status: "processing",
        progress: 5,
        message: "Initializing OCR engine...",
      });

      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker(language, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setPageProgress(Math.round(m.progress * 100));
          }
        },
      });

      const pageResults: PageResult[] = [];

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        setPageProgress(0);

        const overallProgress = 5 + Math.round(((i - 1) / numPages) * 90);
        setProcessing({
          status: "processing",
          progress: overallProgress,
          message: `Processing page ${i} of ${numPages}...`,
        });

        // Render page at higher resolution for OCR
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        // Apply preprocessing
        const processedCanvas = applyPreprocessing(canvas, preprocessing);

        // Convert canvas to Blob for reliable OCR input (avoids silent failures with raw canvas)
        const ocrBlob = await new Promise<Blob>((resolve, reject) => {
          processedCanvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
            "image/png"
          );
        });

        // Run OCR on blob
        const result = await worker.recognize(ocrBlob);
        const pageText = result.data.text;
        const pageConfidence = result.data.confidence;

        // Generate thumbnail from processed canvas
        const thumbCanvas = document.createElement("canvas");
        const thumbScale = 150 / processedCanvas.width;
        thumbCanvas.width = 150;
        thumbCanvas.height = processedCanvas.height * thumbScale;
        const thumbCtx = thumbCanvas.getContext("2d")!;
        thumbCtx.drawImage(
          processedCanvas,
          0,
          0,
          thumbCanvas.width,
          thumbCanvas.height
        );

        pageResults.push({
          pageNumber: i,
          text: pageText,
          confidence: pageConfidence,
          thumbnailUrl: thumbCanvas.toDataURL("image/jpeg", 0.6),
        });
      }

      await worker.terminate();
      setResults(pageResults);
      setProcessing({
        status: "complete",
        progress: 100,
        message: "OCR complete!",
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setProcessing({
        status: "error",
        progress: 0,
        message: `OCR failed: ${errorMsg}`,
      });
    }
  }, [file, language, preprocessing]);

  const getCombinedText = () => {
    return results
      .map((r) => `--- Page ${r.pageNumber} ---\n${r.text}`)
      .join("\n\n");
  };

  const getAverageConfidence = () => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    );
  };

  const getWordCount = () => {
    return results.reduce((sum, r) => {
      const words = r.text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      return sum + words.length;
    }, 0);
  };

  const getCharCount = () => {
    return results.reduce((sum, r) => sum + r.text.length, 0);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCombinedText());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = getCombinedText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = getCombinedText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const baseName = file?.name.replace(/\.pdf$/i, "") || "extracted";
    downloadBlob(blob, `${baseName}_ocr.txt`);
  };

  const handleReset = () => {
    setFile(null);
    setResults([]);
    setPageThumbnails([]);
    setTotalPages(0);
    setCurrentPage(0);
    setPageProgress(0);
    setProcessing({ status: "idle", progress: 0 });
    canvasRefs.current = [];
  };

  const isProcessing = processing.status === "processing";
  const isComplete = processing.status === "complete";

  return (
    <div>
      {/* Upload Section */}
      {!file && (
        <div>
          <FileUpload
            accept=".pdf"
            multiple={false}
            onFiles={handleFiles}
            label="Upload Scanned PDF"
            description="Drop your scanned PDF here or click to browse"
          />
          <PrivacyBadge className="mt-3" />
        </div>
      )}

      {/* File Info & Thumbnails */}
      {file && !isComplete && (
        <div>
          <div
            className="flex items-center justify-between p-4 rounded-lg mb-6"
            style={{
              backgroundColor: "var(--color-bg-main)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-text-heading)" }}
                >
                  {file.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {formatFileSize(file.size)}
                  {totalPages > 0 && ` • ${totalPages} page${totalPages !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="text-sm px-3 py-1 rounded-md"
              style={{
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              ✕ Remove
            </button>
          </div>

          {/* Page Thumbnails */}
          {pageThumbnails.length > 0 && (
            <div className="mb-6">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                PDF Pages Preview
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {pageThumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 rounded-md overflow-hidden"
                    style={{
                      border: "1px solid var(--color-border-light)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <img
                      src={thumb}
                      alt={`Page ${idx + 1}`}
                      style={{ height: "100px", width: "auto" }}
                    />
                    <p
                      className="text-center text-xs py-1"
                      style={{
                        color: "var(--color-text-muted)",
                        backgroundColor: "var(--color-bg-main)",
                      }}
                    >
                      {idx + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preprocessing Panel */}
          <div
            className="rounded-lg p-5 mb-6"
            style={{
              backgroundColor: "var(--color-bg-main)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: "var(--color-text-heading)" }}
            >
              🔧 Image Preprocessing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Grayscale */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preprocessing.grayscale}
                  onChange={(e) =>
                    setPreprocessing((p) => ({
                      ...p,
                      grayscale: e.target.checked,
                    }))
                  }
                  disabled={isProcessing}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-brand)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Grayscale Conversion
                </span>
              </label>

              {/* Noise Removal */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preprocessing.noiseRemoval}
                  onChange={(e) =>
                    setPreprocessing((p) => ({
                      ...p,
                      noiseRemoval: e.target.checked,
                    }))
                  }
                  disabled={isProcessing}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-brand)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Noise Removal
                </span>
              </label>

              {/* Deskew */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preprocessing.deskew}
                  onChange={(e) =>
                    setPreprocessing((p) => ({
                      ...p,
                      deskew: e.target.checked,
                    }))
                  }
                  disabled={isProcessing}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-brand)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Deskew Detection
                </span>
              </label>

              {/* Contrast Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preprocessing.contrast}
                  onChange={(e) =>
                    setPreprocessing((p) => ({
                      ...p,
                      contrast: e.target.checked,
                    }))
                  }
                  disabled={isProcessing}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-brand)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Contrast Enhancement
                </span>
              </label>

              {/* Contrast Slider */}
              {preprocessing.contrast && (
                <div className="sm:col-span-2 pl-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs w-20"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Intensity: {preprocessing.contrastIntensity}%
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={preprocessing.contrastIntensity}
                      onChange={(e) =>
                        setPreprocessing((p) => ({
                          ...p,
                          contrastIntensity: Number(e.target.value),
                        }))
                      }
                      disabled={isProcessing}
                      className="flex-1 h-2 rounded-lg cursor-pointer"
                      style={{ accentColor: "var(--color-brand)" }}
                    />
                  </div>
                </div>
              )}

              {/* Binarize Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preprocessing.binarize}
                  onChange={(e) =>
                    setPreprocessing((p) => ({
                      ...p,
                      binarize: e.target.checked,
                    }))
                  }
                  disabled={isProcessing}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-brand)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Threshold / Binarize
                </span>
              </label>

              {/* Binarize Slider */}
              {preprocessing.binarize && (
                <div className="sm:col-span-2 pl-7">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs w-24"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Threshold: {preprocessing.binarizeThreshold}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={preprocessing.binarizeThreshold}
                      onChange={(e) =>
                        setPreprocessing((p) => ({
                          ...p,
                          binarizeThreshold: Number(e.target.value),
                        }))
                      }
                      disabled={isProcessing}
                      className="flex-1 h-2 rounded-lg cursor-pointer"
                      style={{ accentColor: "var(--color-brand)" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              OCR Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isProcessing}
              className="w-full sm:w-64 px-3 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "var(--color-bg-main)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-heading)",
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="mb-6">
              <ProgressBar
                progress={processing.progress}
                label={processing.message}
              />
              {currentPage > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: "var(--color-text-muted)" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {pageProgress}%
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-border-light)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pageProgress}%`,
                        backgroundColor: "var(--color-brand)",
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extract Button */}
          <div className="flex gap-3">
            <button
              onClick={extractText}
              disabled={isProcessing || totalPages === 0}
              className="px-6 py-3 rounded-lg font-semibold text-sm transition-opacity"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "#FFFFFF",
                opacity: isProcessing || totalPages === 0 ? 0.5 : 1,
                cursor:
                  isProcessing || totalPages === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isProcessing ? "Extracting Text..." : "🔍 Extract Text"}
            </button>
          </div>

          {/* Error */}
          {processing.status === "error" && (
            <div
              className="mt-4 p-4 rounded-lg text-sm"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
              }}
            >
              {processing.message}
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {isComplete && results.length > 0 && (
        <div>
          {/* Stats Bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          >
            <div
              className="text-center p-3 rounded-lg"
              style={{
                backgroundColor: "var(--color-brand-lightest)",
              }}
            >
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-brand)" }}
              >
                {results.length}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Pages
              </p>
            </div>
            <div
              className="text-center p-3 rounded-lg"
              style={{
                backgroundColor: "var(--color-brand-lightest)",
              }}
            >
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-brand)" }}
              >
                {getWordCount().toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Words
              </p>
            </div>
            <div
              className="text-center p-3 rounded-lg"
              style={{
                backgroundColor: "var(--color-brand-lightest)",
              }}
            >
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-brand)" }}
              >
                {getCharCount().toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Characters
              </p>
            </div>
            <div
              className="text-center p-3 rounded-lg"
              style={{
                backgroundColor:
                  getAverageConfidence() >= 80
                    ? "#F0FDF4"
                    : getAverageConfidence() >= 60
                    ? "#FFFBEB"
                    : "#FEF2F2",
              }}
            >
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    getAverageConfidence() >= 80
                      ? "#16A34A"
                      : getAverageConfidence() >= 60
                      ? "#D97706"
                      : "#DC2626",
                }}
              >
                {getAverageConfidence()}%
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                Avg Confidence
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowCombined(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: showCombined
                  ? "var(--color-brand)"
                  : "var(--color-bg-main)",
                color: showCombined ? "#FFFFFF" : "var(--color-text-secondary)",
                border: showCombined
                  ? "none"
                  : "1px solid var(--color-border)",
              }}
            >
              Combined View
            </button>
            <button
              onClick={() => setShowCombined(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: !showCombined
                  ? "var(--color-brand)"
                  : "var(--color-bg-main)",
                color: !showCombined
                  ? "#FFFFFF"
                  : "var(--color-text-secondary)",
                border: !showCombined
                  ? "none"
                  : "1px solid var(--color-border)",
              }}
            >
              Per-Page View
            </button>
          </div>

          {/* Combined Text View */}
          {showCombined && (
            <div
              className="rounded-lg p-4 mb-4"
              style={{
                backgroundColor: "var(--color-bg-main)",
                border: "1px solid var(--color-border)",
              }}
            >
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto"
                style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: "inherit",
                }}
              >
                {getCombinedText()}
              </pre>
            </div>
          )}

          {/* Per-Page View */}
          {!showCombined && (
            <div className="space-y-4 mb-4">
              {results.map((result) => (
                <div
                  key={result.pageNumber}
                  className="rounded-lg overflow-hidden"
                  style={{
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-2"
                    style={{
                      backgroundColor: "var(--color-brand-lightest)",
                      borderBottom: "1px solid var(--color-border-light)",
                    }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-heading)" }}
                    >
                      Page {result.pageNumber}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          result.confidence >= 80
                            ? "#DCFCE7"
                            : result.confidence >= 60
                            ? "#FEF3C7"
                            : "#FEE2E2",
                        color:
                          result.confidence >= 80
                            ? "#16A34A"
                            : result.confidence >= 60
                            ? "#D97706"
                            : "#DC2626",
                      }}
                    >
                      {Math.round(result.confidence)}% confidence
                    </span>
                  </div>
                  <div
                    className="p-4"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <pre
                      className="whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto"
                      style={{
                        color: "var(--color-text-secondary)",
                        fontFamily: "inherit",
                      }}
                    >
                      {result.text || "(No text detected on this page)"}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: "var(--color-brand)",
                color: "#FFFFFF",
              }}
            >
              {copySuccess ? "✓ Copied!" : "📋 Copy All Text"}
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: "var(--color-brand-lightest)",
                color: "var(--color-brand)",
              }}
            >
              💾 Download as .txt
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
            >
              ↻ Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
