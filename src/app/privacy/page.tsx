import type { Metadata } from 'next';
import { AdSlot } from '@/components/ui/AdSlot';

export const metadata: Metadata = {
  title: 'Privacy Policy — PDFTools.one',
  description: 'Privacy policy for PDFTools.one. Learn how we protect your data. All PDF processing happens in your browser — your files are never uploaded.',
  alternates: { canonical: 'https://pdftools.one/privacy' },
  openGraph: {
    title: 'Privacy Policy — PDFTools.one',
    description: 'Your privacy matters. All PDF processing happens in your browser.',
    url: 'https://pdftools.one/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-6">Privacy Policy</h1>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm space-y-6">
        <p className="text-text-light leading-relaxed">
          Last updated: April 2026. Your privacy is critically important to us. This policy explains how PDFTools.one handles your data.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">File Processing</h2>
          <p className="text-text-light leading-relaxed">
            All PDF and image processing on PDFTools.one happens entirely within your web browser. Your files are never uploaded to our servers or any third-party service. When you use any of our tools, the files are read into your browser's memory, processed using JavaScript, and the results are generated locally on your device. Once you close the browser tab, all file data is removed from memory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Data We Collect</h2>
          <p className="text-text-light leading-relaxed">
            We do not collect, store, or have access to any files you process using our tools. We may collect anonymous usage analytics (such as page views and tool usage counts) through third-party analytics services to help us improve our tools. This data does not include any personal information or file content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Cookies</h2>
          <p className="text-text-light leading-relaxed">
            We use essential cookies to remember your preferences (such as dark/light mode). Third-party advertising partners may use cookies to serve relevant ads. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Third-Party Services</h2>
          <p className="text-text-light leading-relaxed">
            We may use third-party services for analytics (such as Google Analytics) and advertising (such as Google AdSense). These services may collect anonymous data about your visit. We recommend reviewing their respective privacy policies for more information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Data Security</h2>
          <p className="text-text-light leading-relaxed">
            Since your files never leave your device, the risk of data breach through our service is effectively zero. We use HTTPS encryption for all website traffic to protect any data transmitted between your browser and our servers (such as loading the website itself).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Changes to This Policy</h2>
          <p className="text-text-light leading-relaxed">
            We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of PDFTools.one after any changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Contact</h2>
          <p className="text-text-light leading-relaxed">
            If you have questions about this privacy policy, please contact us at <a href="mailto:hello@pdftools.one" className="text-primary hover:underline">hello@pdftools.one</a>.
          </p>
        </section>
      </div>

      <AdSlot slot="footer" />
    </div>
  );
}
