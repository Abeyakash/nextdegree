// src/components/ui/FAQ.tsx
'use client';

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How can I apply for colleges listed here?",
    answer: "Click on 'View Details' of a college and follow the admission process mentioned there.",
  },
  {
    question: "Can I compare more than 3 colleges?",
    answer: "Currently, you can compare up to 3 colleges side by side.",
  },
  {
    question: "Are placement details authentic?",
    answer: "Yes, data is collected from official college reports and verified sources.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">❓ Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                {faq.question}
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
