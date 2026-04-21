export interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages?: number;
  thumbnail?: string;
}

export interface ProcessingState {
  status: "idle" | "processing" | "complete" | "error";
  progress: number;
  message?: string;
}

export interface ToolPageProps {
  params: Promise<Record<string, string>>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolInfo {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
}

export type PageSize = "a4" | "letter" | "fit";
export type ImageQuality = "low" | "medium" | "high";
export type RotationAngle = 0 | 90 | 180 | 270;
