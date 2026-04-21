import type { Metadata } from "next";
import PdfToJpgTool from "./PdfToJpgTool";

export const metadata: Metadata = {
  title: "PDF to JPG Converter Online Free | pdftools.one",
  description:
    "Convert PDF pages to high-quality JPG images instantly. Adjust quality, preview pages, download individually or as ZIP. Free, private, no upload.",
  alternates: {
    canonical: "https://pdftools.one/pdf-to-jpg",
  },
  openGraph: {
    title: "PDF to JPG Converter Online Free | pdftools.one",
    description:
      "Convert PDF pages to high-quality JPG images instantly. Adjust quality, preview pages, download individually or as ZIP. Free, private, no upload.",
    url: "https://pdftools.one/pdf-to-jpg",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function PdfToJpgPage() {
  return <PdfToJpgTool />;
}
