"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Menu as MenuIcon,
  QrCode,
  Smartphone,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Simple menu management",
    description:
      "Add dishes, organize categories, update prices, and keep your menu current.",
  },
  {
    icon: Smartphone,
    title: "Built for phones",
    description:
      "Give customers a clean menu experience designed for the device in their hands.",
  },
  {
    icon: QrCode,
    title: "QR-ready",
    description:
      "Connect your digital menu to QR codes that customers can scan at their table.",
  },
  {
    icon: Zap,
    title: "Instant updates",
    description:
      "Change your menu whenever you need. No reprinting required.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your menu",
    description:
      "Add your restaurant information, categories, dishes, prices, and images.",
  },
  {
    number: "02",
    title: "Get your QR code",
    description:
      "Connect your digital menu to a QR code and place it where customers can scan it.",
  },
  {
    number: "03",
    title: "Customers browse",
    description:
      "Customers scan with their phone camera and instantly see your menu.",
  },
];

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1917]">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-[#E7E5E4] bg-[#FDFBF7]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#1C1917]"
            aria-label="Mee Nhuu home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B7A5F] text-white">
              <UtensilsCrossed className="h-4 w-4" />
            </span>

            <span>Mee Nhuu</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#product"
              className="text-sm text-[#78716C] transition-colors hover:text-[#1C1917]"
            >
              Product
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm text-[#78716C] transition-colors hover:text-[#1C1917]"
            >
              How it works
            </Link>

            <Link
              href="#pricing"
              className="text-sm text-[#78716C] transition-colors hover:text-[#1C1917]"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#78716C] transition-colors hover:text-[#1C1917]"
            >
              Login
            </Link>

            <Link
              href="/auth/sign-up"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#0B7A5F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#09634d]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#78716C] transition-colors hover:bg-[#F4F1EA] hover:text-[#1C1917] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="border-t border-[#E7E5E4] bg-[#FDFBF7] px-4 py-5 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                href="#product"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#78716C] hover:bg-[#F4F1EA] hover:text-[#1C1917]"
              >
                Product
              </Link>

              <Link
                href="#how-it-works"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#78716C] hover:bg-[#F4F1EA] hover:text-[#1C1917]"
              >
                How it works
              </Link>

              <Link
                href="#pricing"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#78716C] hover:bg-[#F4F1EA] hover:text-[#1C1917]"
              >
                Pricing
              </Link>

              <div className="mt-3 border-t border-[#E7E5E4] pt-4">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-[#E7E5E4] bg-white text-sm font-medium text-[#78716C]"
                >
                  Login
                </Link>

                <Link
                  href="/auth/sign-up"
                  onClick={closeMenu}
                  className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0B7A5F] text-sm font-semibold text-white hover:bg-[#09634d]"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#0B7A5F]/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FDFBF7] px-3 py-1.5 text-xs font-medium text-[#78716C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0B7A5F]" />
                Digital menus for restaurants
              </div>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#1C1917] sm:text-5xl lg:text-7xl">
                Your restaurant menu,
                <span className="block text-[#0B7A5F]">
                  made digital.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#78716C] sm:text-lg">
                Create a beautiful digital menu, connect it to a QR code,
                and give your customers a better way to browse your food.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/auth/sign-up"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B7A5F] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#09634d] sm:w-auto"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#E7E5E4] bg-white px-6 text-sm font-medium text-[#78716C] transition-colors hover:bg-[#FDFBF7] hover:text-[#1C1917] sm:w-auto"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Product preview */}
            <div className="mx-auto mt-14 max-w-5xl sm:mt-20">
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FDFBF7] p-2 shadow-lg sm:rounded-3xl sm:p-3">
                <div className="overflow-hidden rounded-xl border border-stone-100/10 bg-neutral-900 sm:rounded-2xl">
                  {/* Browser bar */}
                  <div className="flex h-10 items-center gap-2 border-b border-stone-100/10 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />

                    <div className="ml-3 hidden h-6 flex-1 rounded-md bg-neutral-950 sm:block" />
                  </div>

                  {/* Mockup */}
                  <div className="grid min-h-[280px] grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
                    {/* Admin */}
                    <div className="hidden border-r border-stone-100/10 bg-neutral-950 p-6 lg:block">
                      <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-stone-100">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0B7A5F] text-white">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                        </span>
                        Mee Nhuu
                      </div>

                      <div className="space-y-2">
                        <div className="rounded-lg bg-stone-100/10 px-3 py-2 text-xs text-stone-100">
                          Dashboard
                        </div>
                        <div className="px-3 py-2 text-xs text-stone-500">
                          Menu
                        </div>
                        <div className="px-3 py-2 text-xs text-stone-500">
                          QR Codes
                        </div>
                      </div>
                    </div>

                    {/* Customer menu */}
                    <div className="bg-neutral-950 p-5 sm:p-8">
                      <div className="mx-auto max-w-md">
                        <div className="mb-6 text-center">
                          <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                            Your restaurant
                          </p>
                          <h2 className="mt-2 text-2xl font-bold text-stone-100">
                            Today&apos;s Menu
                          </h2>
                        </div>

                        <div className="space-y-3">
                          {[
                            ["Classic Noodles", "4,500 MMK"],
                            ["Chicken Rice", "5,000 MMK"],
                            ["Iced Coffee", "2,500 MMK"],
                          ].map(([name, price]) => (
                            <div
                              key={name}
                              className="flex items-center justify-between rounded-xl border border-stone-100/10 bg-stone-100/[0.02] p-4"
                            >
                              <div>
                                <p className="text-sm font-medium text-stone-100">{name}</p>
                                <p className="mt-1 text-xs text-stone-500">
                                  Freshly prepared
                                </p>
                              </div>

                              <span className="text-sm font-semibold text-stone-200">
                                {price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs text-[#A8A29E]">
                A simple experience for restaurant owners and their customers.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================== */}
        <section
          id="how-it-works"
          className="border-t border-[#E7E5E4] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#0B7A5F]">
                HOW IT WORKS
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl">
                From menu to table in three steps.
              </h2>

              <p className="mt-4 text-[#78716C]">
                Keep the setup simple. Manage your menu online and let
                customers access it from their phones.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-[#E7E5E4] bg-[#FDFBF7] p-6 sm:p-8 shadow-sm"
                >
                  <span className="text-sm font-bold text-[#0B7A5F]">
                    {step.number}
                  </span>

                  <h3 className="mt-6 text-xl font-semibold text-[#1C1917]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#78716C]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            PRODUCT / FEATURES
        ========================== */}
        <section
          id="product"
          className="border-t border-[#E7E5E4] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-[#0B7A5F]">
                THE PRODUCT
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl">
                Everything you need for a digital menu.
              </h2>

              <p className="mt-4 text-[#78716C]">
                No complicated setup. Just the tools your restaurant needs.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-[#E7E5E4] bg-[#FDFBF7] p-6 transition-colors hover:border-[#0B7A5F]/30 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B7A5F]/10 text-[#0B7A5F]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 font-semibold text-[#1C1917]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#78716C]">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================
            SIMPLE VALUE SECTION
        ========================== */}
        <section className="border-t border-[#E7E5E4] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0B7A5F]">
                LESS WORK
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl">
                Change your menu without printing it again.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[#78716C]">
                When a dish changes, a price changes, or something goes out
                of stock, update your digital menu instead of replacing
                printed menus around the restaurant.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Update dishes and prices",
                  "Organize menu categories",
                  "Upload food images",
                  "Keep one menu available everywhere",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#1C1917]"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B7A5F]/10 text-[#0B7A5F]">
                      <Check className="h-3 w-3" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E7E5E4] bg-[#FDFBF7] p-6 sm:p-8 shadow-sm">
              <div className="rounded-2xl border border-stone-100/10 bg-neutral-950 p-6">
                <div className="flex items-center justify-between border-b border-stone-100/10 pb-5">
                  <div>
                    <p className="text-xs text-stone-500">MENU</p>
                    <p className="mt-1 font-semibold text-stone-100">Restaurant Menu</p>
                  </div>

                  <span className="rounded-full bg-stone-100/10 px-2.5 py-1 text-xs text-stone-200">
                    Published
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-xl bg-stone-100/[0.03] p-4 border border-stone-100/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-200">
                        Main Dishes
                      </span>

                      <span className="text-xs text-stone-500">
                        8 items
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-stone-100/[0.03] p-4 border border-stone-100/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-200">
                        Drinks
                      </span>

                      <span className="text-xs text-stone-500">
                        6 items
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-stone-100/[0.03] p-4 border border-stone-100/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-200">
                        Desserts
                      </span>

                      <span className="text-xs text-stone-500">
                        4 items
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            PRICING PLACEHOLDER
        ========================== */}
        <section
          id="pricing"
          className="border-t border-[#E7E5E4] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#0B7A5F]">
              PRICING
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl">
              Simple pricing for restaurants.
            </h2>

            <p className="mt-4 text-[#78716C]">
              We&apos;re keeping our pricing simple while we build
              the first version of Mee Nhuu.
            </p>

            <div className="mt-8 rounded-2xl border border-[#E7E5E4] bg-[#FDFBF7] p-8 shadow-sm">
              <p className="text-sm text-[#78716C]">
                Pricing plans coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            FINAL CTA
        ========================== */}
        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#E7E5E4] bg-[#FDFBF7] px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#1C1917] sm:text-4xl">
              Ready to put your menu online?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#78716C]">
              Create your digital menu and give your customers a simpler
              way to browse.
            </p>

            <Link
              href="/auth/sign-up"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0B7A5F] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#09634d]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-[#E7E5E4] px-4 py-10 sm:px-6 lg:px-8 bg-[#FDFBF7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-[#1C1917]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0B7A5F] text-white">
              <UtensilsCrossed className="h-3.5 w-3.5" />
            </span>

            Mee Nhuu
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#78716C]">
            <Link href="#product" className="hover:text-[#1C1917]">
              Product
            </Link>

            <Link href="#how-it-works" className="hover:text-[#1C1917]">
              How it works
            </Link>

            <Link href="#pricing" className="hover:text-[#1C1917]">
              Pricing
            </Link>

            <Link href="/auth/login" className="hover:text-[#1C1917]">
              Login
            </Link>
          </div>

          <p className="text-sm text-[#A8A29E]">
            © 2026 Mee Nhuu
          </p>
        </div>
      </footer>
    </div>
  );
}