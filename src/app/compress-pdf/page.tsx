import type { Metadata } from "next";
import CompressPdfTool from "./CompressPdfTool";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce File Size | pdftools.one",
  description:
    "Reduce PDF file size instantly in your browser. Free online PDF compressor removes metadata and optimizes content. No upload, no signup.",
  alternates: {
    canonical: "https://pdftools.one/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online Free — Reduce File Size | pdftools.one",
    description:
      "Reduce PDF file size instantly in your browser. Free online PDF compressor removes metadata and optimizes content. No upload, no signup.",
    url: "https://pdftools.one/compress-pdf",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function CompressPdfPage() {
  return <CompressPdfTool />;
}
