import type { Metadata } from "next";
import { PrivacyBadge } from "@/components/ui/PrivacyBadge";

export const metadata: Metadata = {
  title: "About pdftools.one — Free Private PDF Tools",
  description:
    "Learn about pdftools.one, our mission to provide free, private PDF tools that process files entirely in your browser.",
  alternates: {
    canonical: "https://pdftools.one/about",
  },
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="flex justify-center mb-6">
        <PrivacyBadge />
      </div>

      <h1 className="text-4xl font-bold text-text dark:text-text-dark mb-8 text-center">
        About pdftools.one
      </h1>

      <div className="prose prose-gray max-w-none">
        <h2>Our Mission</h2>
        <p>
          pdftools.one was built with a simple but powerful mission: to make professional-quality
          PDF tools available to everyone, completely free, with absolute privacy. We believe
          that working with PDF files should not require expensive software subscriptions,
          account registrations, or surrendering your documents to unknown servers. Every tool
          on pdftools.one is free to use, requires no signup, and processes your files entirely
          within your web browser.
        </p>

        <h2>How It Works: 100% Client-Side Processing</h2>
        <p>
          What makes pdftools.one fundamentally different from other online PDF tools is our
          architecture. Traditional online PDF services require you to upload your files to
          their servers, where the processing happens remotely before sending the result back
          to you. This means your documents — which may contain sensitive personal, financial,
          or business information — pass through third-party infrastructure.
        </p>
        <p>
          pdftools.one takes a completely different approach. Every tool on our site runs
          entirely in your web browser using modern JavaScript and WebAssembly technologies.
          When you select a file, it is read directly from your device into your browser’s
          memory. All processing — whether merging, splitting, compressing, converting, or
          rotating — happens locally on your machine. The result is generated in your browser
          and saved directly to your device. At no point does any file data leave your computer.
        </p>
        <p>
          You can verify this yourself: disconnect from the internet after loading the page,
          and every tool will continue to work perfectly. That is the power of client-side
          processing.
        </p>

        <h2>Our Technology</h2>
        <p>
          pdftools.one is built with modern web technologies chosen for performance, reliability,
          and user experience. Our frontend is powered by Next.js and React, providing fast page
          loads and smooth interactions. For PDF manipulation, we use industry-standard open-source
          libraries including pdf-lib for document editing, pdfjs-dist for rendering and text
          extraction, and specialized libraries for format conversion. All of these run natively
          in your browser without plugins or extensions.
        </p>
        <p>
          We continuously optimize our tools for speed and compatibility across devices. Whether
          you are using a desktop computer, laptop, tablet, or smartphone, pdftools.one delivers
          a consistent, reliable experience. Our tools work in all modern browsers including
          Chrome, Firefox, Safari, and Edge.
        </p>

        <h2>Our Privacy Commitment</h2>
        <p>
          Privacy is not a feature we added — it is the foundation of everything we build.
          Here is our straightforward privacy commitment:
        </p>
        <ul>
          <li><strong>No file uploads:</strong> Your documents are never transmitted to any server.</li>
          <li><strong>No file storage:</strong> We have no servers that store or process your files.</li>
          <li><strong>No account required:</strong> Use any tool instantly without registration.</li>
          <li><strong>No file tracking:</strong> We cannot see, access, or analyze your documents.</li>
          <li><strong>No data retention:</strong> Once you close the browser tab, your file data is gone.</li>
        </ul>
        <p>
          We collect only basic, anonymous analytics (page views and device types) to understand
          which tools are most useful and to improve the site. This analytics data contains no
          information about your files or their contents.
        </p>

        <h2>Built by Developers Who Care</h2>
        <p>
          pdftools.one was created by a team of developers who were frustrated with the state
          of online PDF tools. Too many services hide behind free trials, require unnecessary
          account creation, impose artificial limits, or quietly upload your sensitive documents
          to their servers. We built the tool we wanted to use ourselves — fast, free, private,
          and genuinely useful.
        </p>
        <p>
          We are committed to keeping pdftools.one free and continuously improving our tools.
          If you have feedback, feature requests, or questions, we would love to hear from you.
          Our goal is to build the most trusted, most useful collection of PDF tools on the web.
        </p>
      </div>
    </div>
  );
}
