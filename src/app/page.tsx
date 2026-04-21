import Link from "next/link";
import { tools } from "@/lib/tools-data";
import { AdSlot } from "@/components/ui/AdSlot";

export default function HomePage() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="privacy-badge mx-auto mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your files never leave your device</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text dark:text-text-dark leading-tight">
          Free PDF Tools,{" "}
          <span className="text-primary dark:text-secondary">100% Private</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-text-light dark:text-text-dark-muted max-w-2xl mx-auto">
          Merge, split, compress, convert, and rotate PDFs — all processing happens
          in your browser. No uploads, no servers, no sign-up required.
        </p>
      </section>

      {/* Ad: Leaderboard */}
      <AdSlot slot="leaderboard" />

      {/* Tools Grid */}
      <section className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="tool-card group"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                {tool.name}
              </h2>
              <p className="mt-2 text-text-light dark:text-text-dark-muted">
                {tool.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary dark:text-secondary">
                Use tool
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad: Below results */}
      <AdSlot slot="below-results" />

      {/* Why pdftools.one */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-text dark:text-text-dark mb-10">
          Why Choose pdftools.one?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 dark:bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">100% Private</h3>
            <p className="text-text-light dark:text-text-dark-muted">
              Your files are processed entirely in your browser. Nothing is uploaded to any server. Ever.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 dark:bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary dark:text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">Lightning Fast</h3>
            <p className="text-text-light dark:text-text-dark-muted">
              No waiting for uploads or downloads. Processing starts instantly because everything runs locally.
            </p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-purple-500/10 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">Completely Free</h3>
            <p className="text-text-light dark:text-text-dark-muted">
              No sign-up, no watermarks, no file limits. All tools are free to use with no hidden costs.
            </p>
          </div>
        </div>
      </section>

      {/* Ad: In-content */}
      <AdSlot slot="in-content" />

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-text dark:text-text-dark mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Choose a Tool", desc: "Select from 7 powerful PDF tools above." },
            { step: "2", title: "Add Your Files", desc: "Drag and drop or click to upload your PDFs or images." },
            { step: "3", title: "Download Result", desc: "Your processed file is ready instantly. Click download." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-primary dark:bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">{item.title}</h3>
              <p className="text-text-light dark:text-text-dark-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad: Footer */}
      <AdSlot slot="footer" />
    </div>
  );
}
