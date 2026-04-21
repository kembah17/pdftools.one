import type { Metadata } from "next";
import MergePdfTool from "./MergePdfTool";

export const metadata: Metadata = {
  title: "Merge PDF Online Free — No Signup | pdftools.one",
  description:
    "Combine multiple PDF files into one document instantly. Free online PDF merger with drag-and-drop reordering. No upload, no signup — 100% private.",
  alternates: {
    canonical: "https://pdftools.one/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Online Free — No Signup | pdftools.one",
    description:
      "Combine multiple PDF files into one document instantly. Free online PDF merger with drag-and-drop reordering. No upload, no signup.",
    url: "https://pdftools.one/merge-pdf",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function MergePdfPage() {
  return <MergePdfTool />;
}
