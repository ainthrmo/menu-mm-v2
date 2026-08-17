"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type BillingPeriod = "6months" | "yearly";

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("yearly");
  const { t } = useLanguage();

  const proPrice = billing === "yearly" ? "50,000" : "30,000";
  const proPeriod = billing === "yearly" ? t.pricing.proPerYear : t.pricing.proPer6Months;
  const proMonthly = billing === "yearly" ? t.pricing.proMonthlyYear : t.pricing.proMonthly6;
  const proSaving = billing === "yearly";

  const FREE_FEATURES = [
    t.pricing.freeFeat1,
    t.pricing.freeFeat2,
    t.pricing.freeFeat3,
    t.pricing.freeFeat4,
    t.pricing.freeFeat5,
  ];

  const PRO_FEATURES = [
    t.pricing.proFeat1,
    t.pricing.proFeat2,
    t.pricing.proFeat3,
    t.pricing.proFeat4,
    t.pricing.proFeat5,
    t.pricing.proFeat6,
    t.pricing.proFeat7,
    t.pricing.proFeat8,
  ];

  return (
    <section
      id="pricing"
      className="border-t border-[#E5E5E5] bg-[#F8F8F8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
            {t.pricing.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-[#666666]">
            {t.pricing.description}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setBilling("6months")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              billing === "6months"
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            {t.pricing.btn6Months}
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              billing === "yearly"
                ? "bg-[#111111] text-white shadow-sm"
                : "text-[#666666] hover:text-[#111111]"
            }`}
          >
            {t.pricing.btn1Year}
            <span className="rounded-full bg-[#CDF22B] px-2 py-0.5 text-[10px] font-bold text-[#111111]">
              {t.pricing.saveBadge}
            </span>
          </button>
        </div>

        {/* Plans grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:max-w-5xl lg:mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col rounded-3xl border border-[#E5E5E5] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">{t.pricing.freeTitle}</h3>
              <p className="mt-1 text-xs text-[#666666]">
                {t.pricing.freeDesc}
              </p>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111111]">
                  0
                </span>
                <span className="text-sm font-semibold text-[#666666]">
                  MMK
                </span>
                <span className="ml-1 text-xs text-[#888888]">{t.pricing.freeForever}</span>
              </div>
              <ul className="space-y-3">
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#444444]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E5E5E5]">
                      <Check className="h-2.5 w-2.5 stroke-[3] text-[#666666]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/auth/sign-up"
              className="mt-8 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#F5F5F5] text-sm font-semibold text-[#111111] transition-colors hover:bg-[#E5E5E5]"
            >
              {t.pricing.startFree}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-3xl border-2 border-[#1E45FB] bg-white p-8 shadow-xl ring-4 ring-[#1E45FB]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1E45FB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" />
              {t.pricing.proBadge}
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">{t.pricing.proTitle}</h3>
              <p className="mt-1 text-xs text-[#666666]">
                {t.pricing.proDesc}
              </p>
              <div className="my-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#111111]">
                    {proPrice}
                  </span>
                  <span className="text-sm font-semibold text-[#666666]">
                    MMK
                  </span>
                  <span className="ml-1 text-xs text-[#888888]">
                    / {proPeriod}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#888888]">
                  {proMonthly}
                </p>
                {proSaving && (
                  <p className="mt-1.5 text-xs font-semibold text-[#1E45FB]">
                    {t.pricing.proSave}
                  </p>
                )}
              </div>
              <ul className="space-y-3">
                {PRO_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#444444]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#CDF22B]">
                      <Check className="h-2.5 w-2.5 stroke-[3] text-[#111111]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/auth/sign-up"
              className="mt-8 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1E45FB] text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1737C9] hover:shadow-lg"
            >
              {t.pricing.getPro}
            </Link>
          </div>

          {/* Business Plan */}
          <div className="flex flex-col rounded-3xl border border-[#E5E5E5] bg-white p-8 shadow-sm opacity-70">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111]">{t.pricing.bizTitle}</h3>
                <span className="rounded-full border border-[#E5E5E5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  {t.pricing.bizBadge}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#666666]">
                {t.pricing.bizDesc}
              </p>
              <div className="my-6">
                <span className="text-2xl font-bold text-[#888888]">
                  —
                </span>
              </div>
              <p className="text-sm text-[#888888]">
                {t.pricing.bizFooter}
              </p>
            </div>
            <button
              type="button"
              disabled
              className="mt-8 flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] text-sm font-semibold text-[#AAAAAA]"
            >
              {t.pricing.notify}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-[#888888]">
          {t.pricing.footerNote1}{" "}
          <Link
            href="#faq"
            className="font-semibold text-[#1E45FB] hover:underline"
          >
            {t.pricing.footerNote2}
          </Link>
        </p>
      </div>
    </section>
  );
}
