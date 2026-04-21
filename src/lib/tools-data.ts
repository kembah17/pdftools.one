import { ToolInfo } from "@/types";

export const tools: ToolInfo[] = [
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into one document. Drag, drop, reorder, and merge — all in your browser.",
    shortDescription: "Combine multiple PDFs into one",
    icon: "M12 4v16m-8-8h16",
    color: "bg-blue-500",
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    description: "Extract specific pages from a PDF. Select individual pages or enter page ranges to create a new PDF.",
    shortDescription: "Extract pages from a PDF",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m0 0l-4-4m4 4l-4 4",
    color: "bg-purple-500",
  },
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Reduce PDF file size by removing metadata and optimizing content. See savings instantly.",
    shortDescription: "Reduce PDF file size",
    icon: "M19 14l-7 7m0 0l-7-7m7 7V3",
    color: "bg-emerald-500",
  },
  {
    name: "PDF to JPG",
    slug: "pdf-to-jpg",
    description: "Convert PDF pages to high-quality JPG images. Adjust quality and download individually or as ZIP.",
    shortDescription: "Convert PDF pages to images",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "bg-amber-500",
  },
  {
    name: "JPG to PDF",
    slug: "jpg-to-pdf",
    description: "Convert JPG and PNG images to a PDF document. Reorder images, set page size, and add margins.",
    shortDescription: "Convert images to PDF",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "bg-rose-500",
  },
  {
    name: "PDF to Word",
    slug: "pdf-to-word",
    description: "Extract text from PDF and convert to a Word document (.docx). Basic text extraction done in your browser.",
    shortDescription: "Convert PDF text to Word",
    icon: "M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    color: "bg-sky-500",
  },
  {
    name: "Rotate PDF",
    slug: "rotate-pdf",
    description: "Rotate PDF pages by 90°, 180°, or 270°. Rotate individual pages or all at once.",
    shortDescription: "Rotate PDF pages",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    color: "bg-indigo-500",
  },
];

export function getRelatedTools(currentSlug: string): ToolInfo[] {
  return tools.filter((t) => t.slug !== currentSlug).slice(0, 4);
}
