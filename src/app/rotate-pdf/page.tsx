import type { Metadata } from "next";
import RotatePdfTool from "./RotatePdfTool";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online Free | pdftools.one",
  description:
    "Rotate PDF pages by 90, 180, or 270 degrees instantly. Rotate individual pages or all at once. Free online tool — no upload, no signup, 100% private.",
  alternates: {
    canonical: "https://pdftools.one/rotate-pdf",
  },
  openGraph: {
    title: "Rotate PDF Pages Online Free | pdftools.one",
    description:
      "Rotate PDF pages by 90, 180, or 270 degrees instantly. Rotate individual pages or all at once. Free, private, no signup required.",
    url: "https://pdftools.one/rotate-pdf",
    siteName: "pdftools.one",
    type: "website",
  },
};

export default function RotatePdfPage() {
  return <RotatePdfTool />;
}
