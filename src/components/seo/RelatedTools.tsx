import Link from "next/link";
import { getRelatedTools } from "@/lib/tools-data";

interface RelatedToolsProps {
  currentSlug: string;
}

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const related = getRelatedTools(currentSlug);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {related.map((tool) => (
        <Link
          key={tool.slug}
          href={`/${tool.slug}`}
          className="tool-card group"
        >
          <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center mb-3`}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
            </svg>
          </div>
          <h3 className="font-semibold text-text dark:text-text-dark group-hover:text-primary dark:group-hover:text-secondary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-text-light dark:text-text-dark-muted mt-1">
            {tool.shortDescription}
          </p>
        </Link>
      ))}
    </div>
  );
}
