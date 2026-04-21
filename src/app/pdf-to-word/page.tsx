import type { Metadata } from "next";
import PdfToWordTool from "./PdfToWordTool";

export const metadata: Metadata = {
  title: "PDF to Word Converter Online Free | pdftools.one",
  description:
    "Convert PDF to Word (.docx) free online. Extract text from PDF files in your browser. No upload, no signup, 100% private.",
  alternates: {
    canonical: "https://pdftools.one/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter Online Free | pdftools.one",
    description:
      "Convert PDF to Word (.docx) free online. Extract text from PDF files in your browser. No upload, no signup, 100% private.",
    url: "https://pdftools.one/pdf-to-word",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function PdfToWordPage() {
  return <PdfToWordTool />;
}
