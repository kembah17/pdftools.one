"use client";

import { useState } from "react";
import type { FAQItem } from "@/types";

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className="w-full flex items-center justify-between py-4 text-left font-medium text-text dark:text-text-dark hover:text-primary dark:hover:text-secondary transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span>{item.question}</span>
            <svg
              className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="pb-4 text-text-light dark:text-text-dark-muted leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
