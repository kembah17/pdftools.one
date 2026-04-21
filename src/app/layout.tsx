import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdftools.one"),
  title: {
    default: "pdftools.one — Free Online PDF Tools | 100% Private",
    template: "%s | pdftools.one",
  },
  description:
    "Free online PDF tools that run 100% in your browser. Merge, split, compress, convert, and rotate PDFs. Your files never leave your device.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "PDF to JPG",
    "JPG to PDF",
    "PDF to Word",
    "rotate PDF",
    "online PDF",
    "free PDF tools",
    "private PDF",
    "client-side PDF",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pdftools.one",
    siteName: "pdftools.one",
    title: "pdftools.one — Free Online PDF Tools | 100% Private",
    description:
      "Free online PDF tools that run 100% in your browser. Your files never leave your device.",
  },
  twitter: {
    card: "summary_large_image",
    title: "pdftools.one — Free Online PDF Tools | 100% Private",
    description:
      "Free online PDF tools that run 100% in your browser. Your files never leave your device.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
