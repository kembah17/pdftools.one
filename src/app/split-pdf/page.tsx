import type { Metadata } from "next";
import SplitPdfTool from "./SplitPdfTool";

export const metadata: Metadata = {
  title: "Split PDF Online Free — Extract Pages | pdftools.one",
  description:
    "Split PDF files and extract specific pages instantly. Free online PDF splitter with page range support. No upload, no signup — 100% private.",
  alternates: {
    canonical: "https://pdftools.one/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online Free — Extract Pages | pdftools.one",
    description:
      "Split PDF files and extract specific pages instantly. Free online PDF splitter with page range support. No upload, no signup.",
    url: "https://pdftools.one/split-pdf",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function SplitPdfPage() {
  return <SplitPdfTool />;
}
