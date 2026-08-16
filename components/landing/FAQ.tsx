"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What is Menuu-QR?",
    answer:
      "Menuu-QR is a digital QR menu platform built for Myanmar restaurants, cafés, and tea shops. It lets you create a professional online menu that your customers can access instantly by scanning a QR code — no app download needed.",
  },
  {
    question: "How does a QR menu work?",
    answer:
      "You create your menu in your Menuu-QR dashboard, then download your QR code. Display it on your tables, counter, or entrance. When customers scan it with their phone camera, your full menu opens immediately in their browser.",
  },
  {
    question: "Do my customers need to download an app?",
    answer:
      "No. Your digital menu opens directly in the customer's phone browser. No app, no account, no extra steps. They scan and see your menu instantly.",
  },
  {
    question: "Can I update my menu after publishing?",
    answer:
      "Yes — this is exactly what Menuu-QR is built for. Log in to your dashboard, make any changes (update prices, add dishes, remove items, upload photos), and your live menu updates immediately. Your QR code stays the same forever — no reprinting required.",
  },
  {
    question: "Can I write my menu in Myanmar (Burmese)?",
    answer:
      "Yes. Menuu-QR supports both Burmese and English. You can add dish names and descriptions in both languages. Customers on the Pro plan can switch between languages on the menu.",
  },
  {
    question: "How do I get my QR code?",
    answer:
      "After setting up your menu, go to the QR Codes section in your dashboard. Your unique QR code is ready to download as an image. Print it, laminate it, and place it anywhere in your restaurant.",
  },
  {
    question: "How much does it cost and how do I pay?",
    answer:
      "The Free plan is always free with up to 20 menu items. The Pro plan costs 30,000 MMK for 6 months or 50,000 MMK for 1 year (saving 10,000 MMK). Payment details are confirmed at checkout. We are working on making payment as easy as possible for Myanmar restaurants.",
  },
  {
    question: "What happens if I stay on the Free plan?",
    answer:
      "You can use Menuu-QR on the Free plan for as long as you like. You get a working QR menu, up to 20 menu items, categories, basic customization, and QR code download. Upgrade to Pro any time you want food photos, bilingual support, and unlimited items.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-[#666666]">
            Everything you need to know about Menuu-QR.
          </p>
        </div>

        {/* FAQ list */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
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
            Still have questions?
          </p>
          <p className="mt-1 text-sm text-[#666666]">
            Reach us on{" "}
            <Link
              href={process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1E45FB] hover:underline"
            >
              Facebook
            </Link>{" "}
            or{" "}
            <Link
              href={process.env.NEXT_PUBLIC_MENUU_VIBER_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1E45FB] hover:underline"
            >
              Viber
            </Link>{" "}
            — we reply quickly.
          </p>
        </div>
      </div>
    </section>
  );
}