import type { Metadata } from 'next';
import { AdSlot } from '@/components/ui/AdSlot';

export const metadata: Metadata = {
  title: 'Terms of Service — PDFTools.one',
  description: 'Terms of service for PDFTools.one. Read our terms and conditions for using our free online PDF tools.',
  alternates: { canonical: 'https://pdftools.one/terms' },
  openGraph: {
    title: 'Terms of Service — PDFTools.one',
    description: 'Terms and conditions for using PDFTools.one free online PDF tools.',
    url: 'https://pdftools.one/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-6">Terms of Service</h1>

      <AdSlot slot="leaderboard" />

      <div className="bg-surface border border-border rounded-xl p-8 shadow-sm space-y-6">
        <p className="text-text-light leading-relaxed">
          Last updated: April 2026. By using PDFTools.one, you agree to these terms of service.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Service Description</h2>
          <p className="text-text-light leading-relaxed">
            PDFTools.one provides free, browser-based PDF manipulation tools. All file processing occurs entirely within your web browser. We do not store, transmit, or have access to any files you process using our tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Acceptable Use</h2>
          <p className="text-text-light leading-relaxed">
            You may use PDFTools.one for any lawful purpose. You agree not to use our tools to process files that violate any applicable laws or regulations. You are solely responsible for the content of the files you process.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">No Warranty</h2>
          <p className="text-text-light leading-relaxed">
            PDFTools.one is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our tools will be error-free, uninterrupted, or that the results will meet your specific requirements. We recommend keeping backup copies of your original files before processing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Limitation of Liability</h2>
          <p className="text-text-light leading-relaxed">
            To the maximum extent permitted by law, PDFTools.one and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our tools. Since all processing happens in your browser, we have no control over or responsibility for the results produced.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Intellectual Property</h2>
          <p className="text-text-light leading-relaxed">
            The PDFTools.one website, including its design, code, and content, is protected by copyright. You retain all rights to the files you process using our tools. We claim no ownership or rights over your documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Advertising</h2>
          <p className="text-text-light leading-relaxed">
            PDFTools.one may display advertisements to support the free service. These ads are served by third-party advertising networks and are subject to their own terms and privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Changes to Terms</h2>
          <p className="text-text-light leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of PDFTools.one after any changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-3">Contact</h2>
          <p className="text-text-light leading-relaxed">
            If you have questions about these terms, please contact us at <a href="mailto:hello@pdftools.one" className="text-primary hover:underline">hello@pdftools.one</a>.
          </p>
        </section>
      </div>

      <AdSlot slot="footer" />
    </div>
  );
}
