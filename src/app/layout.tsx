import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/ui/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL('https://pdftools.one'),
  title: {
    default: 'PDFTools.one \u2014 Free Online PDF Tools',
    template: '%s | PDFTools.one',
  },
  description: 'Free online PDF tools: merge, split, compress, convert PDF to JPG, JPG to PDF, PDF to Word, and rotate pages. 100% client-side processing \u2014 your files never leave your browser.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdftools.one',
    siteName: 'PDFTools.one',
    title: 'PDFTools.one \u2014 Free Online PDF Tools',
    description: 'Free online PDF tools: merge, split, compress, convert, and rotate. Privacy-first \u2014 all processing happens in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDFTools.one \u2014 Free Online PDF Tools',
    description: 'Free online PDF tools. Privacy-first \u2014 all processing happens in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pdftools.one',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-page-bg text-text antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
