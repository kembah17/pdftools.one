export interface ProcessingState {
  status: "idle" | "processing" | "complete" | "error";
  progress: number;
  message?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages?: number;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  thumbnail: string;
}

export type ImageQuality = "low" | "medium" | "high";

export type PageSize = "a4" | "letter" | "fit";

export type RotationAngle = 0 | 90 | 180 | 270;
