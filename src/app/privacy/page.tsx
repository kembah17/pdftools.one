import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | pdftools.one",
  description:
    "Privacy policy for pdftools.one. Learn how we protect your data with 100% client-side PDF processing.",
  alternates: {
    canonical: "https://pdftools.one/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-text dark:text-text-dark mb-4 text-center">
        Privacy Policy
      </h1>
      <p className="text-center text-text-light dark:text-text-dark-muted mb-10">
        Last updated: April 21, 2026
      </p>

      <div className="prose prose-gray max-w-none">
        <h2>Introduction</h2>
        <p>
          At pdftools.one, your privacy is our highest priority. This Privacy Policy explains
          how we handle information when you use our website and PDF tools. The most important
          thing to know is that your files are processed 100% client-side in your web browser.
          We never receive, store, or have access to any files you work with on our site.
        </p>

        <h2>File Processing and Data Handling</h2>
        <p>
          All PDF processing on pdftools.one occurs entirely within your web browser using
          client-side JavaScript and WebAssembly technologies. When you select or drag a file
          into one of our tools, the file is read from your device directly into your browser’s
          local memory. All operations — merging, splitting, compressing, converting, rotating,
          and any other processing — happen locally on your device.
        </p>
        <p>
          <strong>We do not upload your files to any server.</strong> No file data is ever
          transmitted over the internet when you use our tools. We have no server-side file
          processing infrastructure. We cannot see, access, read, or analyze any document
          you work with on pdftools.one. Once you close your browser tab or navigate away
          from the page, all file data in browser memory is automatically released.
        </p>

        <h2>Information We Collect</h2>
        <p>
          While we do not collect any file data, we do collect limited anonymous analytics
          information to help us understand how our site is used and to improve our tools:
        </p>
        <ul>
          <li><strong>Page views:</strong> Which pages and tools are visited.</li>
          <li><strong>Device information:</strong> Browser type, operating system, screen size, and device category (desktop, mobile, tablet).</li>
          <li><strong>Geographic region:</strong> Approximate location based on IP address (country/region level only).</li>
          <li><strong>Referral source:</strong> How you arrived at our site (search engine, direct link, etc.).</li>
          <li><strong>Usage patterns:</strong> Time spent on pages, navigation paths, and tool usage frequency.</li>
        </ul>
        <p>
          This analytics data is aggregated and anonymous. It contains no information about
          your files, their contents, names, or any personally identifiable information.
        </p>

        <h2>Cookies</h2>
        <p>
          pdftools.one uses a limited number of cookies for the following purposes:
        </p>
        <ul>
          <li><strong>Analytics cookies:</strong> Used by our analytics service to distinguish unique visitors and track site usage patterns. These cookies contain no personal information.</li>
          <li><strong>Consent cookie:</strong> Stores your cookie consent preference so we do not ask you repeatedly.</li>
          <li><strong>Advertising cookies:</strong> Our advertising partners may set cookies to serve relevant ads and measure ad performance. These are subject to the ad networks’ own privacy policies.</li>
        </ul>
        <p>
          You can control cookie settings through our cookie consent banner or through your
          browser settings. Disabling cookies will not affect the functionality of our PDF tools.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use the following third-party services that may collect anonymous data:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> For website traffic analysis and usage statistics. Google Analytics uses cookies to collect anonymous usage data. You can opt out using the Google Analytics opt-out browser extension.</li>
          <li><strong>Advertising networks:</strong> We display advertisements to support the free operation of our tools. Ad networks may use cookies and similar technologies to serve relevant advertisements. These networks operate under their own privacy policies.</li>
          <li><strong>Content delivery network (CDN):</strong> We use a CDN to deliver our website quickly worldwide. CDN providers may log IP addresses in server access logs for security and performance purposes.</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          <strong>File data:</strong> We retain zero file data because we never receive it.
          Your files exist only in your browser’s memory during processing and are
          automatically cleared when you close the tab.
        </p>
        <p>
          <strong>Analytics data:</strong> Anonymous analytics data is retained for up to
          26 months to identify long-term usage trends, after which it is automatically deleted.
        </p>

        <h2>GDPR Compliance</h2>
        <p>
          For users in the European Economic Area (EEA), we comply with the General Data
          Protection Regulation (GDPR). Since we do not collect personal data through our
          PDF tools, most GDPR provisions regarding personal data processing do not apply
          to file processing. For analytics data, we rely on legitimate interest as our
          legal basis, and we provide cookie consent mechanisms as required. You have the
          right to opt out of analytics tracking at any time through our cookie settings.
        </p>

        <h2>Children’s Privacy</h2>
        <p>
          pdftools.one is not directed at children under the age of 13. We do not knowingly
          collect personal information from children. Since our tools do not require account
          creation or personal information, there is minimal risk of collecting children’s data.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices or for legal, operational, or regulatory reasons. We will update the
          &quot;Last updated&quot; date at the top of this page when changes are made.
          We encourage you to review this policy periodically.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices,
          please contact us at:
        </p>
        <p>
          <strong>Email:</strong> privacy@pdftools.one<br />
          <strong>Website:</strong> https://pdftools.one
        </p>
      </div>
    </div>
  );
}
