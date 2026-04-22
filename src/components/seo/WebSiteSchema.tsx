export default function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PDFTools.one',
    url: 'https://pdftools.one',
    description: 'Free online PDF tools. Merge, split, compress, convert, and rotate PDFs entirely in your browser.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pdftools.one/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
