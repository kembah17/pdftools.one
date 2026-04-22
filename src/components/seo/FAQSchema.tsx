interface FAQSchemaProps {
  faqs?: { question: string; answer: string }[];
  items?: { question: string; answer: string }[];
}

export function FAQSchema({ faqs, items }: FAQSchemaProps) {
  const faqList = items || faqs || [];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default FAQSchema;
