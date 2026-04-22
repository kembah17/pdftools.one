import Link from 'next/link';

interface Tool {
  name: string;
  href: string;
  description: string;
}

const allTools: Tool[] = [
  { name: 'Merge PDF', href: '/merge-pdf', description: 'Combine multiple PDF files into a single document' },
  { name: 'Split PDF', href: '/split-pdf', description: 'Extract specific pages or split a PDF into multiple files' },
  { name: 'Compress PDF', href: '/compress-pdf', description: 'Reduce PDF file size while maintaining quality' },
  { name: 'PDF to JPG', href: '/pdf-to-jpg', description: 'Convert PDF pages to high-quality JPG images' },
  { name: 'JPG to PDF', href: '/jpg-to-pdf', description: 'Convert JPG images into a PDF document' },
  { name: 'PDF to Word', href: '/pdf-to-word', description: 'Convert PDF documents to editable Word format' },
  { name: 'Rotate PDF', href: '/rotate-pdf', description: 'Rotate PDF pages to any orientation' },
];

export interface RelatedToolsProps {
  currentTool?: string;
  currentSlug?: string;
}

export default function RelatedTools({ currentTool, currentSlug }: RelatedToolsProps) {
  // Normalize: currentSlug is without leading slash, currentTool may have it
  const slug = currentSlug || (currentTool ? currentTool.replace(/^\//, '') : '');
  const related = allTools.filter(t => t.href !== `/${slug}`).slice(0, 4);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-text mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block p-4 bg-surface border border-border rounded-lg shadow-sm hover:shadow-md hover:border-primary transition-all"
          >
            <h3 className="font-semibold text-primary mb-1">{tool.name}</h3>
            <p className="text-sm text-text-light">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
