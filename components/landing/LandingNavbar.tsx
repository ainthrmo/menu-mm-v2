"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed, Menu, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t, isMounted } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.faq, href: "#faq" },
  ];

  const LanguageSwitcher = () => {
    if (!isMounted) return <div className="w-16 h-6 animate-pulse bg-gray-200 rounded"></div>;
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setLanguage("en")}
          className={`transition-colors ${
            language === "en" ? "text-[#1E45FB]" : "text-[#888888] hover:text-[#111111]"
          }`}
        >
          EN
        </button>
        <span className="text-[#E5E5E5]">|</span>
        <button
          onClick={() => setLanguage("my")}
          className={`transition-colors ${
            language === "my" ? "text-[#1E45FB]" : "text-[#888888] hover:text-[#111111]"
          }`}
        >
          မြန်မာ
        </button>
      </div>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#E5E5E5] bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-[#111111]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E45FB] text-white shadow-sm">
            <UtensilsCrossed className="h-4 w-4" />
          </span>
          <span className="tracking-tight">Menuu-QR</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[#666666] transition-colors hover:text-[#111111]"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#666666] transition-colors hover:text-[#111111]"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/auth/sign-up"
              className="group inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#1E45FB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1737C9] hover:shadow-md active:translate-y-0"
            >
              {t.nav.getStarted}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Mobile toggle & Lang Switcher */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t border-[#E5E5E5] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#111111]"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#E5E5E5] pt-4">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-xl border border-[#E5E5E5] text-sm font-semibold text-[#666666]"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1E45FB] text-sm font-semibold text-white"
              >
                {t.nav.getStarted}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
