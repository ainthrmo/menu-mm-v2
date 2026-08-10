"use client";

import FAQ from "@/components/landing/FAQ";
import { useEffect, useState } from "react";
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

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`reveal ${className}`}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-[#E5E5E5] bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl"
            : "bg-white"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 font-bold text-[#111111]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E45FB] text-white shadow-xs transition-transform duration-300 group-hover:scale-105">
              <UtensilsCrossed className="h-4 w-4" />
            </span>

            <span>Menuu-QR</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#product"
              className="text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
            >
              Product
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
            >
              How it works
            </Link>

            <Link
              href="#pricing"
              className="text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
            >
              Pricing
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#666666] transition-colors hover:text-[#111111]"
            >
              Login
            </Link>

            <Link
              href="/auth/sign-up"
              className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#1E45FB] px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1737C9] hover:shadow-md active:translate-y-0"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111] md:hidden"
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
          <div className="border-t border-[#E5E5E5] bg-white/95 px-4 py-5 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link
                href="#product"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]"
              >
                Product
              </Link>

              <Link
                href="#how-it-works"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]"
              >
                How it works
              </Link>

              <Link
                href="#pricing"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]"
              >
                Pricing
              </Link>

              <div className="mt-3 border-t border-[#E5E5E5] pt-4">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="flex min-h-11 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white text-sm font-medium text-[#666666]"
                >
                  Login
                </Link>

                <Link
                  href="/auth/sign-up"
                  onClick={closeMenu}
                  className="group mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E45FB] text-sm font-semibold text-white"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          {/* Playful background accents */}
          <div
            className="hero-glow pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#1E45FB]/12 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="hero-orb hero-orb-yellow pointer-events-none absolute right-[8%] top-24 hidden h-24 w-24 rounded-full bg-[#CDF22B]/35 blur-2xl sm:block"
            aria-hidden="true"
          />
          <div
            className="hero-orb hero-orb-orange pointer-events-none absolute left-[7%] top-72 hidden h-16 w-16 rounded-full bg-[#1E45FB]/15 blur-xl sm:block"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <Reveal delay={0}>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] px-3.5 py-1.5 text-xs font-semibold text-[#111111] shadow-xs backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#1E45FB]" />
                  Digital menus for restaurants
                  <span className="ml-1 h-2 w-2 rounded-full bg-[#CDF22B]" />
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#111111] sm:text-5xl lg:text-7xl">
                  Your restaurant menu,
                  <span className="block text-[#1E45FB]">
                    made digital.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#666666] sm:text-lg">
                  Create a beautiful digital menu, connect it to a QR code,
                  and give your customers a better way to browse your food.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E45FB] px-6 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1737C9] hover:shadow-lg active:translate-y-0 sm:w-auto"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="#how-it-works"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 text-sm font-semibold text-[#111111] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#F5F5F5] hover:shadow-md sm:w-auto"
                  >
                    See how it works
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Product preview */}
            <Reveal delay={450} className="mx-auto mt-12 max-w-5xl sm:mt-16">
              <div className="glass-frame rounded-2xl p-2 sm:rounded-3xl sm:p-3">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl sm:rounded-2xl">
                  {/* Browser bar */}
                  <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />

                    <div className="ml-3 hidden h-6 flex-1 rounded-md bg-neutral-950 sm:block" />
                  </div>

                  {/* Mockup */}
                  <div className="grid min-h-[280px] grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
                    {/* Admin */}
                    <div className="hidden border-r border-white/10 bg-neutral-950 p-6 lg:block">
                      <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-stone-100">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1E45FB] text-white">
                          <UtensilsCrossed className="h-3.5 w-3.5" />
                        </span>
                        Menuu-QR
                      </div>

                      <div className="space-y-2">
                        <div className="rounded-lg bg-white/10 px-3 py-2 text-xs text-stone-100">
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
                          ].map(([name, price], index) => (
                            <div
                              key={name}
                              className={`preview-card-${index} flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4`}
                            >
                              <div>
                                <p className="text-sm font-medium text-stone-100">
                                  {name}
                                </p>

                                <p className="mt-1 text-xs text-stone-500">
                                  Freshly prepared
                                </p>
                              </div>

                              <span className="text-sm font-bold text-[#CDF22B]">
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

              <p className="mt-4 text-center text-xs text-[#888888]">
                A simple experience for restaurant owners and their customers.
              </p>
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          id="how-it-works"
          className="border-t border-[#E5E5E5] bg-[#F5F5F5]/40 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-sm font-bold text-[#1E45FB]">
                  HOW IT WORKS
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                  From menu to table in three steps.
                </h2>

                <p className="mt-4 text-[#666666]">
                  Keep the setup simple. Manage your menu online and let
                  customers access it from their phones.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 100}>
                  <article className="group rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1E45FB]/30 hover:shadow-md sm:p-6">
                    <span
                      className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-xs font-bold ${
                        index % 2 === 0
                          ? "bg-[#CDF22B] text-[#111111]"
                          : "bg-[#1E45FB]/10 text-[#1E45FB]"
                      }`}
                    >
                      {step.number}
                    </span>

                    <h3 className="mt-5 text-xl font-bold text-[#111111]">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#666666]">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT / FEATURES
        ====================================================== */}

        <section
          id="product"
          className="border-t border-[#E5E5E5] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-bold text-[#1E45FB]">
                  THE PRODUCT
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                  Everything you need for a digital menu.
                </h2>

                <p className="mt-4 text-[#666666]">
                  No complicated setup. Just the tools your restaurant needs.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <Reveal key={feature.title} delay={index * 80}>
                    <article className="group h-full rounded-2xl border border-[#E5E5E5] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#1E45FB]/30 hover:shadow-lg">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                          index % 2 === 0
                            ? "bg-[#1E45FB]/10 text-[#1E45FB]"
                            : "bg-[#CDF22B] text-[#111111]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="mt-5 font-bold text-[#111111]">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#666666]">
                        {feature.description}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            SIMPLE VALUE SECTION
        ====================================================== */}

        <section className="border-t border-[#E5E5E5] bg-[#F5F5F5]/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="text-sm font-bold text-[#1E45FB]">
                  LESS WORK
                </p>

                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                  Change your menu without printing it again.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-[#666666]">
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
                      className="flex items-center gap-3 text-sm font-medium text-[#111111]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#CDF22B] text-[#111111]">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>

                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="glass-frame rounded-3xl p-2 sm:p-3">
                <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs text-stone-500">MENU</p>

                      <p className="mt-1 font-semibold text-stone-100">
                        Restaurant Menu
                      </p>
                    </div>

                    <span className="rounded-full bg-[#CDF22B] px-2.5 py-1 text-xs font-bold text-[#111111]">
                      Published
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      ["Main Dishes", "8 items"],
                      ["Drinks", "6 items"],
                      ["Desserts", "4 items"],
                    ].map(([name, count], index) => (
                      <div
                        key={name}
                        className="value-card rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-transform duration-300 hover:translate-x-1"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-stone-200">
                            {name}
                          </span>

                          <span className="text-xs text-stone-500">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* =====================================================
            PRICING
        ====================================================== */}

        <section
          id="pricing"
          className="border-t border-[#E5E5E5] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold text-[#1E45FB]">
                PRICING
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#111111] sm:text-4xl">
                Simple pricing for restaurants.
              </h2>

              <p className="mt-4 text-[#666666]">
                We&apos;re keeping our pricing simple while we build the first
                version of Menuu-QR.
              </p>

              <div className="mt-8 rounded-2xl border border-[#E5E5E5] bg-[#F5F5F5] p-8 shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CDF22B] text-[#111111]">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="mt-4 text-base font-bold text-[#111111]">
                  Pricing plans coming soon.
                </p>
                <p className="mt-1 text-sm text-[#666666]">
                  We&apos;re keeping Menuu-QR simple while we build.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <FAQ />

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Reveal>
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-[#E5E5E5] bg-[#111111] px-6 py-14 text-center shadow-xl sm:px-12 sm:py-20">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#1E45FB]/30 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#CDF22B]/20 blur-2xl" aria-hidden="true" />
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to put your menu online?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-stone-400">
                Create your digital menu and give your customers a simpler way
                to browse.
              </p>

              <Link
                href="/auth/sign-up"
                className="group mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#CDF22B] px-8 text-sm font-bold text-[#111111] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B8DA20] hover:shadow-lg active:translate-y-0"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-[#E5E5E5] bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-[#111111]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1E45FB] text-white">
              <UtensilsCrossed className="h-3.5 w-3.5" />
            </span>

            Menuu-QR
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#666666]">
            <Link href="#product" className="hover:text-[#111111]">
              Product
            </Link>

            <Link href="#how-it-works" className="hover:text-[#111111]">
              How it works
            </Link>

            <Link href="#pricing" className="hover:text-[#111111]">
              Pricing
            </Link>

            <Link href="/auth/login" className="hover:text-[#111111]">
              Login
            </Link>
          </div>

          <p className="text-sm text-[#888888]">© 2026 Menuu-QR</p>
        </div>
      </footer>

      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          animation: reveal-up 700ms cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
          animation-delay: var(--delay, 0ms);
        }

        .hero-glow {
          animation: glow-float 10s ease-in-out infinite;
        }

        .glass-frame {
          border: 1px solid rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.42);
          box-shadow:
            0 24px 70px rgba(28, 25, 23, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .preview-card-0 {
          animation: card-reveal 700ms 650ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .preview-card-1 {
          animation: card-reveal 700ms 760ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .preview-card-2 {
          animation: card-reveal 700ms 870ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-orb-yellow {
          animation: orb-float 8s ease-in-out infinite;
        }

        .hero-orb-orange {
          animation: orb-float 7s ease-in-out infinite reverse;
        }

        @keyframes orb-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, 14px, 0) scale(1.08);
          }
        }

        @keyframes reveal-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes card-reveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes glow-float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
          }

          50% {
            transform: translateX(-50%) translateY(25px) scale(1.04);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .reveal {
            opacity: 1;
            transform: none;
          }

          .hero-orb-yellow,
          .hero-orb-orange {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}