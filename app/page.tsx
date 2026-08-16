import Link from "next/link";
import {
  ArrowRight,
  Check,
  QrCode,
  Smartphone,
  UtensilsCrossed,
  Zap,
  ImageIcon,
  Search,
  Palette,
  Share2,
  X,
  ShoppingBag,
  Star,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import PricingSection from "@/components/landing/PricingSection";
import FAQ from "@/components/landing/FAQ";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Zap,
    title: "Instant menu updates",
    description:
      "Change prices, add dishes, or remove items any time. Your live menu reflects the change immediately — no reprinting ever.",
    accent: true,
  },
  {
    icon: Smartphone,
    title: "Mobile-first customer menu",
    description:
      "Your customers get a fast, clean menu experience designed for the phone already in their hand.",
    accent: false,
  },
  {
    icon: ImageIcon,
    title: "Food photos per dish",
    description:
      "Upload a photo for every item on your menu. Customers see exactly what they are ordering.",
    accent: false,
  },
  {
    icon: Search,
    title: "Search & categories",
    description:
      "Customers can search for any dish or jump straight to a category. No more endless scrolling.",
    accent: true,
  },
  {
    icon: Palette,
    title: "Your restaurant's look",
    description:
      "Set your logo, cover image, brand color, and social links. Your menu feels like your restaurant.",
    accent: false,
  },
  {
    icon: QrCode,
    title: "QR code download",
    description:
      "One QR code, linked to your live menu forever. Download, print, and place it anywhere.",
    accent: true,
  },
];

const STEPS = [
  {
    number: "01",
    titleEn: "Create your menu",
    titleMM: "Menu ဖန်တီးပါ",
    description:
      "Add your restaurant name, logo, categories, and all your dishes with photos and prices.",
  },
  {
    number: "02",
    titleEn: "Download your QR code",
    titleMM: "QR Code ရယူပါ",
    description:
      "Your unique QR code is ready instantly. Print it and place it on tables, counters, or doors.",
  },
  {
    number: "03",
    titleEn: "Update anytime",
    titleMM: "အချိန်မရွေး ပြင်ဆင်ပါ",
    description:
      "Price changed? New dish? Log in, update in seconds. Your QR code stays the same forever.",
  },
];

/* ─────────────────────────────────────────────
   PAGE (Server Component)
───────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {/* ── NAVBAR (client — needs scroll + mobile state) ── */}
      <LandingNavbar />

      <main>
        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pt-24">
          {/* Subtle background texture */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(30,69,251,0.08),transparent)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111111] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#1E45FB]" />
                QR Digital Menu for Myanmar Restaurants
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-[5rem]">
                Update your menu once.
                <span className="block text-[#1E45FB]">
                  Customers always see
                  <br className="hidden sm:block" /> the latest.
                </span>
              </h1>

              {/* Sub */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#555555] sm:text-lg sm:leading-8">
                Menuu-QR lets Myanmar restaurants replace expensive printed menus
                with a digital QR menu that customers scan with their phone.
                Change prices anytime — your QR code never changes.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E45FB] px-8 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1737C9] hover:shadow-lg active:translate-y-0 sm:w-auto"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-8 text-sm font-semibold text-[#111111] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CCCCCC] hover:shadow-md active:translate-y-0 sm:w-auto"
                >
                  See how it works
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#888888]">
                {[
                  "Free forever plan",
                  "No credit card required",
                  "Ready in 5 minutes",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#1E45FB]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Hero Visual: Phone mockup ── */}
            <div className="mx-auto mt-16 max-w-sm sm:mt-20">
              <div className="relative mx-auto w-[260px] sm:w-[280px]">
                {/* Phone shell */}
                <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-[#111111] bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#111111]" />

                  {/* Screen */}
                  <div className="relative h-[520px] overflow-hidden bg-white">
                    {/* Restaurant header */}
                    <div className="bg-[#1E45FB] px-4 pb-5 pt-10 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                          <UtensilsCrossed className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-blue-200">
                            ကြへいらっしゃ Café
                          </p>
                          <p className="text-sm font-bold leading-tight">
                            Golden Spoon
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Search bar */}
                    <div className="border-b border-[#F0F0F0] bg-white px-3 py-2">
                      <div className="flex items-center gap-2 rounded-lg bg-[#F5F5F5] px-3 py-2">
                        <Search className="h-3.5 w-3.5 text-[#AAAAAA]" />
                        <span className="text-[11px] text-[#AAAAAA]">
                          Search dishes…
                        </span>
                      </div>
                    </div>

                    {/* Category tabs */}
                    <div className="flex gap-2 overflow-x-auto border-b border-[#F0F0F0] bg-white px-3 py-2 scrollbar-hide">
                      {["All", "Noodles", "Rice", "Drinks", "Desserts"].map(
                        (cat, i) => (
                          <span
                            key={cat}
                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${
                              i === 0
                                ? "bg-[#1E45FB] text-white"
                                : "bg-[#F5F5F5] text-[#666666]"
                            }`}
                          >
                            {cat}
                          </span>
                        )
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="space-y-0 overflow-hidden">
                      {[
                        {
                          name: "Mohinga",
                          nameMM: "မုန့်ဟင်းခါး",
                          price: "2,500",
                          color: "#FEF3C7",
                          popular: true,
                        },
                        {
                          name: "Shan Noodles",
                          nameMM: "ရှမ်းခေါက်ဆွဲ",
                          price: "3,000",
                          color: "#DBEAFE",
                          popular: false,
                        },
                        {
                          name: "Iced Coffee",
                          nameMM: "အေးသောကော်ဖီ",
                          price: "1,500",
                          color: "#D1FAE5",
                          popular: false,
                        },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 border-b border-[#F5F5F5] bg-white px-3 py-2.5"
                        >
                          <div
                            className="h-12 w-12 shrink-0 rounded-xl"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-[11px] font-bold text-[#111111]">
                                {item.name}
                              </p>
                              {item.popular && (
                                <span className="flex items-center gap-0.5 rounded-full bg-[#CDF22B] px-1.5 py-0.5 text-[9px] font-bold text-[#111111]">
                                  <Star className="h-2 w-2" />
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#888888]">
                              {item.nameMM}
                            </p>
                            <p className="mt-0.5 text-[11px] font-bold text-[#1E45FB]">
                              {item.price} MMK
                            </p>
                          </div>
                          <button
                            type="button"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E45FB] text-white"
                            aria-label={`Add ${item.name} to cart`}
                          >
                            <span className="text-sm leading-none">+</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Floating cart */}
                    <div className="absolute bottom-4 left-3 right-3">
                      <div className="flex items-center justify-between rounded-xl bg-[#111111] px-4 py-2.5 shadow-lg">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-[#CDF22B]" />
                          <span className="text-[11px] font-semibold text-white">
                            2 items
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#CDF22B]">
                          5,500 MMK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge — QR */}
                <div className="absolute -right-10 top-20 flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 shadow-lg">
                  <QrCode className="h-5 w-5 text-[#1E45FB]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#111111]">
                      Scan & browse
                    </p>
                    <p className="text-[9px] text-[#888888]">No app needed</p>
                  </div>
                </div>

                {/* Floating badge — update */}
                <div className="absolute -left-10 bottom-32 flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 shadow-lg">
                  <Zap className="h-5 w-5 text-[#CDF22B]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#111111]">
                      Live updates
                    </p>
                    <p className="text-[9px] text-[#888888]">Instant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PROBLEM vs SOLUTION
        ══════════════════════════════════════════════════ */}
        <section className="border-t border-[#E5E5E5] bg-[#F8F8F8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
                The Problem
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                Printed menus cost more than you think
              </h2>
              <p className="mt-4 text-[#666666]">
                Every time a price changes or a dish goes out of stock, you pay
                again to reprint. Menuu-QR eliminates that cycle.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {/* Old way */}
              <div className="rounded-3xl border border-[#FFCCCC] bg-white p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    The old way
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Design & print menus (again)",
                    "Price changed? Print everything again",
                    "Dish unavailable? Scratch it out by hand",
                    "Menus wear out — replace them",
                    "Customers see outdated information",
                  ].map((pain) => (
                    <li
                      key={pain}
                      className="flex items-start gap-3 text-sm text-[#555555]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                        <X className="h-3 w-3 stroke-[3] text-red-500" />
                      </span>
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New way */}
              <div className="rounded-3xl border border-[#1E45FB]/20 bg-[#1E45FB] p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    With Menuu-QR
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Create your menu once, online",
                    "Update prices in seconds — for free",
                    "Dishes instantly appear or disappear",
                    "Your QR code never changes",
                    "Customers always see live, accurate prices",
                  ].map((win) => (
                    <li
                      key={win}
                      className="flex items-start gap-3 text-sm text-blue-100"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CDF22B]">
                        <Check className="h-3 w-3 stroke-[3] text-[#111111]" />
                      </span>
                      {win}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="border-t border-[#E5E5E5] bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                အဆင့် ၃ ဆင့်သာ လိုပါသည်
              </h2>
              <p className="mt-4 text-[#666666]">
                From zero to a live digital menu in under 5 minutes.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <article
                  key={step.number}
                  className="group relative rounded-3xl border border-[#E5E5E5] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#1E45FB]/30 hover:shadow-xl"
                >
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute right-0 top-12 hidden h-0.5 w-8 translate-x-full bg-[#E5E5E5] md:block" />
                  )}

                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E45FB] text-sm font-extrabold text-white">
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-xl font-extrabold text-[#111111]">
                    {step.titleEn}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-[#1E45FB]">
                    {step.titleMM}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#666666]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════ */}
        <section
          id="features"
          className="border-t border-[#E5E5E5] bg-[#F8F8F8] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                Everything your restaurant needs
              </h2>
              <p className="mt-4 text-[#666666]">
                No complicated setup. No technical knowledge needed. Just the
                tools that help your restaurant run better.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className={`group rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      feature.accent
                        ? "border-[#1E45FB]/20 bg-[#1E45FB] text-white"
                        : "border-[#E5E5E5] bg-white text-[#111111]"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        feature.accent
                          ? "bg-white/20"
                          : "bg-[#1E45FB]/10"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          feature.accent ? "text-white" : "text-[#1E45FB]"
                        }`}
                      />
                    </div>

                    <h3
                      className={`mt-5 text-lg font-extrabold ${
                        feature.accent ? "text-white" : "text-[#111111]"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-7 ${
                        feature.accent ? "text-blue-200" : "text-[#666666]"
                      }`}
                    >
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRODUCT PREVIEW
        ══════════════════════════════════════════════════ */}
        <section className="border-t border-[#E5E5E5] bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-xl text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#1E45FB]">
                The Product
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                Built for restaurant owners, <br className="hidden sm:block" />
                loved by their customers
              </h2>
              <p className="mt-4 text-[#666666]">
                A simple dashboard for you. A beautiful menu for them.
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {/* Dashboard panel */}
              <div className="rounded-3xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 sm:p-8">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#888888]">
                  Owner Dashboard
                </p>
                <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
                  {/* Top bar */}
                  <div className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1E45FB]">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-bold text-[#111111]">
                        Menuu-QR
                      </span>
                    </div>
                    <span className="rounded-full bg-[#CDF22B] px-2.5 py-1 text-[10px] font-bold text-[#111111]">
                      Pro
                    </span>
                  </div>

                  {/* Sidebar + content */}
                  <div className="flex">
                    {/* Sidebar */}
                    <div className="hidden w-36 shrink-0 border-r border-[#E5E5E5] bg-[#FAFAFA] p-3 sm:block">
                      {[
                        { label: "Dashboard", active: false },
                        { label: "Menu", active: true },
                        { label: "QR Codes", active: false },
                        { label: "Settings", active: false },
                      ].map(({ label, active }) => (
                        <div
                          key={label}
                          className={`mb-1 rounded-lg px-3 py-2 text-xs font-medium ${
                            active
                              ? "bg-[#1E45FB] text-white"
                              : "text-[#666666]"
                          }`}
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Content area */}
                    <div className="flex-1 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#111111]">
                          Menu Items
                        </p>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-lg bg-[#1E45FB] px-2.5 py-1.5 text-[10px] font-semibold text-white"
                        >
                          + Add dish
                        </button>
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "Mohinga", cat: "Noodles", price: "2,500", available: true },
                          { name: "Shan Noodles", cat: "Noodles", price: "3,000", available: true },
                          { name: "Iced Coffee", cat: "Drinks", price: "1,500", available: false },
                        ].map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-[#E5E5E5]" />
                              <div>
                                <p className="text-[11px] font-semibold text-[#111111]">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-[#888888]">
                                  {item.cat}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#111111]">
                                {item.price} MMK
                              </span>
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  item.available ? "bg-green-400" : "bg-[#CCCCCC]"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-[#888888]">
                  Manage everything from your browser — no tech knowledge needed
                </p>
              </div>

              {/* Customer menu panel */}
              <div className="rounded-3xl border border-[#E5E5E5] bg-[#F8F8F8] p-6 sm:p-8">
                <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#888888]">
                  Customer Experience
                </p>
                <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
                  {/* Restaurant header */}
                  <div className="bg-[#1E45FB] px-5 py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                        <UtensilsCrossed className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200">Yangon, Myanmar</p>
                        <p className="font-bold">Golden Spoon</p>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="border-b border-[#F0F0F0] px-4 py-2.5">
                    <div className="flex items-center gap-2 rounded-xl bg-[#F5F5F5] px-3 py-2">
                      <Search className="h-4 w-4 text-[#AAAAAA]" />
                      <span className="text-xs text-[#AAAAAA]">
                        Search your favourite dish…
                      </span>
                    </div>
                  </div>

                  {/* Category tabs */}
                  <div className="flex gap-2 overflow-x-auto border-b border-[#F0F0F0] px-4 py-2.5 scrollbar-hide">
                    {["All", "Noodles", "Rice", "Drinks"].map((cat, i) => (
                      <span
                        key={cat}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                          i === 0
                            ? "bg-[#1E45FB] text-white"
                            : "bg-[#F5F5F5] text-[#666666]"
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {[
                      { name: "Mohinga", price: "2,500", color: "#FEF3C7", popular: true },
                      { name: "Shan Noodles", price: "3,000", color: "#DBEAFE", popular: false },
                      { name: "Iced Coffee", price: "1,500", color: "#D1FAE5", popular: false },
                      { name: "Tea Leaf Salad", price: "2,000", color: "#FCE7F3", popular: true },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="overflow-hidden rounded-xl border border-[#F0F0F0]"
                      >
                        <div
                          className="h-20 w-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="p-2">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-[11px] font-bold leading-tight text-[#111111]">
                              {item.name}
                            </p>
                            {item.popular && (
                              <Star className="h-3 w-3 shrink-0 text-[#F59E0B]" />
                            )}
                          </div>
                          <p className="mt-1 text-[11px] font-bold text-[#1E45FB]">
                            {item.price} MMK
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-center text-xs text-[#888888]">
                  What customers see when they scan your QR code
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PRICING (client — has toggle)
        ══════════════════════════════════════════════════ */}
        <PricingSection />

        {/* ══════════════════════════════════════════════════
            FAQ (client — has accordion)
        ══════════════════════════════════════════════════ */}
        <FAQ />

        {/* ══════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════ */}
        <section className="border-t border-[#E5E5E5] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-[#111111] px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Accent dot */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#1E45FB]/30 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CDF22B]" />
                Free plan available now
              </div>

              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to put your menu online?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base text-[#999999]">
                Thousands of restaurants waste money reprinting menus. Yours
                doesn&apos;t have to. Get started in 5 minutes — no credit card
                required.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/auth/sign-up"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#CDF22B] px-8 text-sm font-bold text-[#111111] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B8DA20] hover:shadow-lg active:translate-y-0 sm:w-auto"
                >
                  Start for free — no card needed
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5 sm:w-auto"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="border-t border-[#E5E5E5] bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-extrabold text-[#111111]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E45FB] text-white">
                  <UtensilsCrossed className="h-4 w-4" />
                </span>
                <span className="tracking-tight">Menuu-QR</span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-6 text-[#666666]">
                Digital QR menus for Myanmar restaurants. Update once, customers
                always see the latest.
              </p>
              <div className="mt-5 flex gap-3">
                <Link
                  href={process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#666666] transition-colors hover:border-[#1E45FB] hover:text-[#1E45FB]"
                  aria-label="Facebook"
                >
                  <Share2 className="h-4 w-4" />
                </Link>
                <Link
                  href={process.env.NEXT_PUBLIC_MENUU_VIBER_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E5E5] text-[#666666] transition-colors hover:border-[#1E45FB] hover:text-[#1E45FB]"
                  aria-label="Viber"
                >
                  <Smartphone className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Product links */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#111111]">
                Product
              </p>
              <ul className="space-y-3 text-sm text-[#666666]">
                {[
                  ["Features", "#features"],
                  ["How it works", "#how-it-works"],
                  ["Pricing", "#pricing"],
                  ["FAQ", "#faq"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-[#111111]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account & Legal links */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#111111]">
                Account
              </p>
              <ul className="space-y-3 text-sm text-[#666666]">
                {[
                  ["Login", "/auth/login"],
                  ["Sign up free", "/auth/sign-up"],
                  ["Privacy Policy", "/privacy"],
                  ["Terms of Service", "/terms"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition-colors hover:text-[#111111]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-[#E5E5E5] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#888888]">
              © 2026 Menuu-QR. All rights reserved.
            </p>
            <p className="text-sm text-[#888888]">
              Made for Myanmar restaurants 🍜
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}