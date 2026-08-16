"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

type BillingPeriod = "6months" | "yearly";

const FREE_FEATURES = [
  "Up to 20 menu items",
  "QR code generation & download",
  "Category management",
  "Basic store customization",
  "Mobile-optimized customer menu",
];

const PRO_FEATURES = [
  "Unlimited menu items",
  "Food photos per dish",
  "Full store customization",
  "Custom theme color & branding",
  "Bilingual menu (English + Myanmar)",
  "Social links on customer menu",
  "Cart for customers",
  "Mark popular items",
];

export default function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("yearly");

  const proPrice = billing === "yearly" ? "50,000" : "30,000";
  const proPeriod = billing === "yearly" ? "per year" : "per 6 months";
  const proMonthly = billing === "yearly" ? "≈ 4,167" : "5,000";
  const proSaving = billing === "yearly";

  return (
    <section
      id="pricing"
      className="border-t border-[#E5E5E5] bg-[#F8F8F8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
            Simple pricing for Myanmar restaurants
          </h2>
          <p className="mt-4 text-[#666666]">
            Start free. Upgrade when you&apos;re ready.
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
            6 Months
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
            1 Year
            <span className="rounded-full bg-[#CDF22B] px-2 py-0.5 text-[10px] font-bold text-[#111111]">
              Save 10,000 MMK
            </span>
          </button>
        </div>

        {/* Plans grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:max-w-5xl lg:mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col rounded-3xl border border-[#E5E5E5] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Free</h3>
              <p className="mt-1 text-xs text-[#666666]">
                Try Menuu-QR with no commitment.
              </p>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111111]">
                  0
                </span>
                <span className="text-sm font-semibold text-[#666666]">
                  MMK
                </span>
                <span className="ml-1 text-xs text-[#888888]">/ forever</span>
              </div>
              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#444444]">
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
              Start for free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-3xl border-2 border-[#1E45FB] bg-white p-8 shadow-xl ring-4 ring-[#1E45FB]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1E45FB] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" />
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Pro</h3>
              <p className="mt-1 text-xs text-[#666666]">
                Everything your restaurant needs.
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
                  ≈ {proMonthly} MMK per month
                </p>
                {proSaving && (
                  <p className="mt-1.5 text-xs font-semibold text-[#1E45FB]">
                    You save 10,000 MMK vs 6-month plan
                  </p>
                )}
              </div>
              <ul className="space-y-3">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#444444]">
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
              Get Pro
            </Link>
          </div>

          {/* Business Plan */}
          <div className="flex flex-col rounded-3xl border border-[#E5E5E5] bg-white p-8 shadow-sm opacity-70">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111111]">Business</h3>
                <span className="rounded-full border border-[#E5E5E5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                  Coming Soon
                </span>
              </div>
              <p className="mt-1 text-xs text-[#666666]">
                Advanced features for growing businesses.
              </p>
              <div className="my-6">
                <span className="text-2xl font-bold text-[#888888]">
                  —
                </span>
              </div>
              <p className="text-sm text-[#888888]">
                We&apos;re building more powerful features for larger
                restaurant operations. Be the first to know when it launches.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="mt-8 flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#F5F5F5] text-sm font-semibold text-[#AAAAAA]"
            >
              Notify me when ready
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-[#888888]">
          All plans include a QR menu for your restaurant.{" "}
          <Link
            href="#faq"
            className="font-semibold text-[#1E45FB] hover:underline"
          >
            See FAQ for payment details →
          </Link>
        </p>
      </div>
    </section>
  );
}
