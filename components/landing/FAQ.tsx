"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Mee Nhuu?",
    answer:
      "Mee Nhuu is a digital menu platform for restaurants and cafés. It lets you create a modern online menu that customers can access by scanning a QR code.",
  },
  {
    question: "Do I need a website to use Mee Nhuu?",
    answer:
      "No. Mee Nhuu provides your digital menu page, so you don't need to build or maintain a separate website.",
  },
  {
    question: "How do customers access my menu?",
    answer:
      "Customers simply scan your restaurant's QR code with their phone camera. Your digital menu opens instantly in their browser.",
  },
  {
    question: "Can I update my menu myself?",
    answer:
      "Yes. You can log in to your dashboard and update menu items, prices, categories, images, and other information whenever you need.",
  },
  {
    question: "Can I use Burmese and English?",
    answer:
      "Yes. Mee Nhuu is designed to support both Burmese and English menus, making it easier to serve different customers.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "No. The dashboard is designed for restaurant owners and staff. You can manage your menu without knowing how to code.",
  },
  {
    question: "Can Mee Nhuu generate my QR code?",
    answer:
      "Yes. Mee Nhuu can generate a QR code linked directly to your digital menu. You can then print it and place it on tables, counters, or other locations.",
  },
  {
    question: "How much does Mee Nhuu cost?",
    answer:
      "Mee Nhuu is designed to be simple and affordable for local restaurants and cafés. Pricing and available plans will be shown when you are ready to get started.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="w-full border-t border-[#E5E5E5] bg-white"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-[#1E45FB]">
            FAQ
          </p>

          <h2
            id="faq-heading"
            className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl"
          >
            Frequently asked questions
          </h2>

          <p className="mt-4 text-base leading-7 text-[#666666] sm:text-lg">
            Everything you need to know about Menuu-QR.
          </p>
        </div>

        {/* FAQ list */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={
                  index !== faqs.length - 1
                    ? "border-b border-[#E5E5E5]"
                    : ""
                }
              >
                <button
                id={`faq-question-${index}`}
                type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E45FB] sm:px-6"
                >
                  <span className="text-sm font-semibold leading-6 text-[#111111] sm:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#666666] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1E45FB]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pr-12 text-sm leading-6 text-[#666666] sm:px-6 sm:pb-6 sm:text-base sm:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#666666]">
            Still have questions?
          </p>

          <a
            href="#contact"
            className="mt-2 inline-flex items-center font-semibold text-[#1E45FB] transition-colors hover:text-[#1737C9]"
          >
            Get in touch
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}