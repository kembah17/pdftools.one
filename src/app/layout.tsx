import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/ui/CookieConsent';
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

// GSC verification loaded from env
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  ...(gscVerification && { verification: { google: gscVerification } }),
  metadataBase: new URL('https://pdftools.one'),
  title: {
    default: 'PDFTools.one — Free Online PDF Tools',
    template: '%s | PDFTools.one',
  },
  description: 'Free online PDF tools: merge, split, compress, convert PDF to JPG, JPG to PDF, PDF to Word, and rotate pages. 100% client-side processing — your files never leave your browser.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdftools.one',
    siteName: 'PDFTools.one',
    title: 'PDFTools.one — Free Online PDF Tools',
    description: 'Free online PDF tools: merge, split, compress, convert, and rotate. Privacy-first — all processing happens in your browser.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDF Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFTools.one — Free Online PDF Tools',
    description: 'Free online PDF tools. Privacy-first — all processing happens in your browser.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://pdftools.one' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
