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
    if (!isMounted) return <div className="w-16 h-6 animate-pulse bg-slate-200 rounded-full"></div>;
    return (
      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1 text-xs font-bold shadow-2xs">
        <button
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 rounded-full transition-all min-h-[28px] ${
            language === "en" ? "bg-white text-slate-950 shadow-2xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("my")}
          className={`px-2.5 py-1 rounded-full transition-all min-h-[28px] ${
            language === "my" ? "bg-white text-slate-950 shadow-2xs" : "text-slate-500 hover:text-slate-900"
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
          ? "border-b border-slate-200/80 bg-white/90 shadow-2xs backdrop-blur-xl"
          : "bg-white"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-slate-950"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <UtensilsCrossed className="h-4.5 w-4.5" />
          </span>
          <span className="tracking-tight text-lg">Moss QR</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
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
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-slate-950 hover:bg-slate-100"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/auth/sign-up"
              className="group inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0"
            >
              {t.hero.createMenu}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Mobile toggle & Lang Switcher */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 min-h-[40px] min-w-[40px]"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-500/20 active:scale-[0.99]"
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
