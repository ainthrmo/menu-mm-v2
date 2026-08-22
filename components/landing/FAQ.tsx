"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs = [
    { question: t.faq.q1, answer: t.faq.a1 },
    { question: t.faq.q2, answer: t.faq.a2 },
    { question: t.faq.q3, answer: t.faq.a3 },
    { question: t.faq.q4, answer: t.faq.a4 },
    { question: t.faq.q5, answer: t.faq.a5 },
    { question: t.faq.q6, answer: t.faq.a6 },
    { question: t.faq.q7, answer: t.faq.a7 },
    { question: t.faq.q8, answer: t.faq.a8 },
  ];

  return (
    <section
      id="faq"
      className="border-t border-[#E5E5E5] bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
            {t.faq.eyebrow}
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl"
          >
            {t.faq.title}
          </h2>
          <p className="mt-4 text-[#666666]">
            {t.faq.description}
          </p>
        </div>

        {/* FAQ list */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={index !== faqs.length - 1 ? "border-b border-[#E5E5E5]" : ""}
              >
                <button
                  id={`faq-btn-${index}`}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-[#F8F8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E45FB]"
                >
                  <span className="text-sm font-semibold leading-6 text-[#111111] sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#888888] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1E45FB]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 pr-14 text-sm leading-7 text-[#666666] sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 text-center">
          <p className="text-sm font-semibold text-[#111111]">
            {t.faq.stillQuestions}
          </p>
          <p className="mt-1 text-sm text-[#666666]">
            {t.faq.reachUs}{" "}
            <Link
              href={
                process.env.NEXT_PUBLIC_MOSS_FB_PAGE_URL ||
                process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL ||
                "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1E45FB] hover:underline"
            >
              {t.faq.facebook}
            </Link>{" "}
            {t.faq.or}{" "}
            <Link
              href={
                process.env.NEXT_PUBLIC_MOSS_VIBER_URL ||
                process.env.NEXT_PUBLIC_MENUU_VIBER_URL ||
                "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1E45FB] hover:underline"
            >
              {t.faq.viber}
            </Link>{" "}
            {t.faq.replyQuickly}
          </p>
        </div>
      </div>
    </section>
  );
}