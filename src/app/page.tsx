import HomeToolGrid from '@/components/ui/HomeToolGrid';
import FeaturedTools from '@/components/ui/FeaturedTools';
import { AdSlot } from '@/components/ui/AdSlot';
import WebSiteSchema from '@/components/seo/WebSiteSchema';

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />

      {/* Hero - milder warm gradient with extra bottom padding for card overlap */}
      <section
        className="pt-16 md:pt-24 pb-28 md:pb-36 relative"
        style={{ background: 'var(--color-bg-hero)' }}
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{ color: 'var(--color-text-heading)' }}>
            Free Online{' '}
            <span style={{ color: 'var(--color-brand)' }}>PDF Tools</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Merge, split, compress, convert, and rotate PDF files — all for free, directly in your browser. Your files never leave your device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tools"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-base font-semibold no-underline transition-all"
              style={{ backgroundColor: 'var(--color-brand)', color: '#FFFFFF' }}
            >
              Explore Tools
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl text-base font-semibold no-underline transition-all"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                color: 'var(--color-brand)',
                border: '2px solid var(--color-brand)',
              }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Featured Tools - overlapping the hero */}
      <div className="max-w-7xl mx-auto px-4" style={{ marginTop: '-5rem' }}>
        <FeaturedTools />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <AdSlot slot="home-leaderboard" />

        {/* Remaining Tools Grid */}
        <section id="tools" className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-heading)' }}>
              All PDF Tools
            </h2>
            <p className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>
              Select a tool below to get started — no sign-up required
            </p>
          </div>
          <HomeToolGrid />
        </section>

        <AdSlot slot="home-mid" />

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-text-heading)' }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose a Tool', desc: 'Select the PDF tool you need from our collection of seven essential utilities.' },
              { step: '2', title: 'Upload Your File', desc: 'Drag and drop your PDF or images. Files stay in your browser — nothing is uploaded.' },
              { step: '3', title: 'Download Result', desc: 'Get your processed file instantly. Close the tab and all data is gone.' },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center p-8 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '2px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                  style={{ backgroundColor: 'var(--color-brand-lightest)', color: 'var(--color-brand)' }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--color-text-heading)' }}>
            Why Choose PDFTools.one?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '🔒', title: '100% Private', desc: 'All processing happens in your browser. Your files are never uploaded to any server.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'No waiting for server processing. Results are instant because everything runs locally.' },
              { icon: '💰', title: 'Completely Free', desc: 'No hidden fees, no premium tiers, no sign-up required. Every tool is free forever.' },
              { icon: '🌐', title: 'Works Everywhere', desc: 'Use on any device with a modern browser — desktop, tablet, or phone. No installation needed.' },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl flex gap-4"
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  border: '2px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-heading)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-tertiary)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slot="home-lower" />

        {/* Rich SEO Content */}
        <section
          className="mb-16 rounded-xl p-8 md:p-12"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '2px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-heading)' }}>
            The Complete Guide to Online PDF Tools
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              PDF (Portable Document Format) is the universal standard for sharing documents. Whether you are a student, professional, or business owner, you likely work with PDFs daily. PDFTools.one provides seven essential tools to handle every common PDF task — completely free and with total privacy.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>Merge PDF</strong> lets you combine multiple PDF files into a single document. This is perfect for assembling reports, combining scanned pages, or creating portfolios. Simply drag and drop your files, reorder them as needed, and download the merged result.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>Split PDF</strong> extracts specific pages from a PDF or divides it into multiple files. Use it to pull out a single page from a long document, separate chapters, or create smaller files for easier sharing.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>Compress PDF</strong> reduces file size while maintaining visual quality. Large PDFs can be difficult to email or upload — our compressor typically reduces file size by 40-70% without noticeable quality loss.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>PDF to JPG</strong> converts each page of a PDF into a high-quality JPG image. This is useful for creating thumbnails, sharing individual pages on social media, or embedding PDF content in presentations.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>JPG to PDF</strong> converts images into PDF documents. Combine multiple photos into a single PDF for easy sharing, create photo albums, or convert scanned images into proper PDF documents.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>PDF to Word</strong> extracts text from PDFs and creates editable Word documents. While complex layouts may not convert perfectly, this tool is excellent for extracting text content from reports, articles, and simple documents.
            </p>
            <p>
              <strong style={{ color: 'var(--color-text-heading)' }}>Rotate PDF</strong> changes the orientation of PDF pages. Fix sideways scans, rotate individual pages, or adjust the orientation of an entire document with a single click.
            </p>
            <p>
              Every tool on PDFTools.one processes files entirely in your browser using JavaScript. This means your sensitive documents — contracts, financial records, medical files — never leave your computer. There is zero risk of data interception, and no account or sign-up is required.
            </p>
          </div>
        </section>

        <AdSlot slot="home-footer" />
      </div>
    </>
  );
}
