import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | pdftools.one",
  description:
    "Terms of service for pdftools.one. Read the terms governing your use of our free online PDF tools.",
  alternates: {
    canonical: "https://pdftools.one/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-text dark:text-text-dark mb-4 text-center">
        Terms of Service
      </h1>
      <p className="text-center text-text-light dark:text-text-dark-muted mb-10">
        Last updated: April 21, 2026
      </p>

      <div className="prose prose-gray max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using pdftools.one (the &quot;Service&quot;), you agree to be bound
          by these Terms of Service (the &quot;Terms&quot;). If you do not agree to these Terms,
          please do not use the Service. We reserve the right to modify these Terms at any time,
          and your continued use of the Service after any changes constitutes acceptance of the
          updated Terms.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          pdftools.one provides free, browser-based PDF tools including but not limited to PDF
          merging, splitting, compression, rotation, format conversion, and text extraction.
          All file processing occurs entirely within your web browser using client-side
          JavaScript technology. No files are uploaded to or processed on our servers.
        </p>
        <p>
          The Service is provided free of charge and is supported by advertising. We reserve
          the right to modify, suspend, or discontinue any part of the Service at any time
          without prior notice.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>
          When using pdftools.one, you agree to the following:
        </p>
        <ul>
          <li>You will use the Service only for lawful purposes and in compliance with all applicable laws and regulations.</li>
          <li>You will not attempt to interfere with, disrupt, or compromise the integrity or security of the Service.</li>
          <li>You will not use automated tools, bots, or scripts to access the Service in a manner that could overload or impair its functionality.</li>
          <li>You are solely responsible for the files you process using our tools and for ensuring you have the right to modify or convert those files.</li>
          <li>You will not use the Service to process files containing illegal content.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The pdftools.one website, including its design, code, text content, graphics, logos,
          and overall appearance, is the intellectual property of pdftools.one and is protected
          by applicable copyright and trademark laws. You may not reproduce, distribute, modify,
          or create derivative works from any part of the Service without our express written
          permission.
        </p>
        <p>
          You retain full ownership of all files you process using our tools. Since all
          processing occurs in your browser, we never have access to or any claim over your
          documents or their contents.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, pdftools.one and its operators,
          developers, and affiliates shall not be liable for any direct, indirect, incidental,
          special, consequential, or punitive damages arising from or related to your use of
          the Service. This includes, without limitation:
        </p>
        <ul>
          <li>Loss of data or file corruption during processing.</li>
          <li>Inability to access or use the Service.</li>
          <li>Errors, inaccuracies, or omissions in the processing results.</li>
          <li>Any unauthorized access to or alteration of your data.</li>
          <li>Any loss of profits, revenue, or business opportunities.</li>
        </ul>
        <p>
          Since all file processing occurs locally in your browser, the risk of data loss
          during processing is inherent to your device’s capabilities and browser
          environment, which are outside our control.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis
          without warranties of any kind, either express or implied. We do not warrant that:
        </p>
        <ul>
          <li>The Service will be uninterrupted, timely, secure, or error-free.</li>
          <li>The results obtained from using the Service will be accurate or reliable.</li>
          <li>The quality of any tools, information, or other material obtained through the Service will meet your expectations.</li>
          <li>Any errors in the Service will be corrected.</li>
        </ul>
        <p>
          You acknowledge that you use the Service at your own risk and that you are solely
          responsible for any damage to your device or loss of data that may result from
          using the Service.
        </p>

        <h2>7. Advertising</h2>
        <p>
          The Service is supported by third-party advertising. By using the Service, you
          acknowledge that advertisements may be displayed alongside our tools. We are not
          responsible for the content of third-party advertisements or for any products or
          services advertised. Your interactions with advertisers are solely between you and
          the advertiser.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to update or modify these Terms at any time. When we make
          changes, we will update the &quot;Last updated&quot; date at the top of this page.
          Your continued use of the Service after any modifications indicates your acceptance
          of the updated Terms. We encourage you to review these Terms periodically.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with applicable laws,
          without regard to conflict of law principles. Any disputes arising from or relating
          to these Terms or the Service shall be resolved through good-faith negotiation
          first, and if necessary, through binding arbitration or in the courts of competent
          jurisdiction.
        </p>

        <h2>10. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid by a court
          of competent jurisdiction, that provision shall be limited or eliminated to the
          minimum extent necessary, and the remaining provisions shall remain in full force
          and effect.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> legal@pdftools.one<br />
          <strong>Website:</strong> https://pdftools.one
        </p>
      </div>
    </div>
  );
}
