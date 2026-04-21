import type { Metadata } from "next";
import JpgToPdfTool from "./JpgToPdfTool";

export const metadata: Metadata = {
  title: "JPG to PDF Converter Online Free | pdftools.one",
  description:
    "Convert JPG, PNG, and WEBP images to a PDF document. Reorder pages, set page size and margins. Free, private, no upload required.",
  alternates: {
    canonical: "https://pdftools.one/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Converter Online Free | pdftools.one",
    description:
      "Convert JPG, PNG, and WEBP images to a PDF document. Reorder pages, set page size and margins. Free, private, no upload required.",
    url: "https://pdftools.one/jpg-to-pdf",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function JpgToPdfPage() {
  return <JpgToPdfTool />;
}
