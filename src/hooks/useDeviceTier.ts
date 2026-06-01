"use client";
import { useState, useEffect } from "react";

export type DeviceTier = "desktop" | "tablet" | "mobile";

export interface DeviceTierConfig {
  tier: DeviceTier;
  /** Max file size for OCR operations (bytes) */
  maxOcrFileSize: number;
  /** Max file size per PDF for merge/split/compress (bytes) */
  maxPdfFileSize: number;
  /** Max total size for multi-file operations (bytes) */
  maxTotalSize: number;
  preprocessingLevel: "full" | "basic" | "minimal";
  ocrWarning: string;
  pdfWarning: string;
  autoCompress: boolean;
}

const CONFIGS: Record<DeviceTier, Omit<DeviceTierConfig, "tier">> = {
  desktop: {
    maxOcrFileSize: 20 * 1024 * 1024, // 20MB
    maxPdfFileSize: 50 * 1024 * 1024, // 50MB
    maxTotalSize: 100 * 1024 * 1024, // 100MB
    preprocessingLevel: "full",
    ocrWarning: "Processing may take 10-30 seconds for large files.",
    pdfWarning: "Processing may take 10-30 seconds for large files.",
    autoCompress: false,
  },
  tablet: {
    maxOcrFileSize: 10 * 1024 * 1024, // 10MB
    maxPdfFileSize: 25 * 1024 * 1024, // 25MB
    maxTotalSize: 50 * 1024 * 1024, // 50MB
    preprocessingLevel: "basic",
    ocrWarning: "Processing may take 30-60 seconds. Keep this tab active.",
    pdfWarning: "Processing may take 30-60 seconds. Keep this tab active.",
    autoCompress: false,
  },
  mobile: {
    maxOcrFileSize: 5 * 1024 * 1024, // 5MB
    maxPdfFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalSize: 20 * 1024 * 1024, // 20MB
    preprocessingLevel: "minimal",
    ocrWarning:
      "Processing may take 1-2 minutes on mobile. Keep screen on and tab active. Consider using desktop for large files.",
    pdfWarning:
      "Processing may take 1-2 minutes on mobile. Keep screen on and tab active. Consider using desktop for large files.",
    autoCompress: true,
  },
};

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 2;

  if (width >= 1024 || cores >= 4) return "desktop";
  if (width >= 768 || cores >= 2) return "tablet";
  return "mobile";
}

export function useDeviceTier(): DeviceTierConfig {
  const [tier, setTier] = useState<DeviceTier>("desktop");

  useEffect(() => {
    setTier(detectTier());

    const handleResize = () => {
      setTier(detectTier());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { tier, ...CONFIGS[tier] };
}

export function formatMaxSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}
