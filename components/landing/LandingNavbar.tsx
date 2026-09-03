"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t, isMounted } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = t.japandiNav ?? {
    examples: "Examples",
    pricing: "Pricing",
    getStarted: "Get started",
  };
  
  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[rgba(43,42,38,0.08)]"
          : "bg-[#F4F1EA]"
      }`}
    >
      <nav className="mx-auto flex h-[60px] max-w-[1120px] items-center justify-between px-10">
        {/* Logo mark + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: "#2B2A26" }}
            aria-hidden="true"
          >
            <span
              className="text-sm font-bold leading-none"
              style={{ color: "#A8CC3C", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
            >
              Q
            </span>
          </span>
          <span
            className="text-[15px] font-medium tracking-[-0.01em]"
            style={{ color: "#2B2A26", fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Moss
          </span>
        </Link>

        {/* Desktop links + lang switcher */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#examples"
            className="text-[13.5px] font-medium transition-colors"
            style={{ color: "rgba(43,42,38,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2B2A26")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(43,42,38,0.6)")}
          >
            {nav.examples}
          </a>
          <a
            href="#pricing"
            className="text-[13.5px] font-medium transition-colors"
            style={{ color: "rgba(43,42,38,0.6)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2B2A26")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(43,42,38,0.6)")}
          >
            {nav.pricing}
          </a>

          {/* Language switcher */}
          {isMounted && (
            <div
              className="flex items-center rounded-full p-0.5 text-[11px] font-semibold"
              style={{ background: "#E1E8CE", gap: 2 }}
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className="px-2.5 py-1 rounded-full transition-all"
                style={{
                  background: language === "en" ? "#2B2A26" : "transparent",
                  color: language === "en" ? "#F4F1EA" : "rgba(43,42,38,0.6)",
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("my")}
                className="px-2.5 py-1 rounded-full transition-all"
                style={{
                  background: language === "my" ? "#2B2A26" : "transparent",
                  color: language === "my" ? "#F4F1EA" : "rgba(43,42,38,0.6)",
                }}
              >
                မြန်မာ
              </button>
            </div>
          )}

          <Link
            href="/auth/sign-up"
            className="inline-flex items-center text-[13.5px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "#2B2A26", color: "#F4F1EA" }}
          >
            {nav.getStarted}
          </Link>
        </div>

        {/* Mobile: lang switcher + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {isMounted && (
            <div
              className="flex items-center rounded-full p-0.5 text-[11px] font-semibold"
              style={{ background: "#E1E8CE" }}
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className="px-2 py-0.5 rounded-full transition-all"
                style={{
                  background: language === "en" ? "#2B2A26" : "transparent",
                  color: language === "en" ? "#F4F1EA" : "rgba(43,42,38,0.6)",
                }}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("my")}
                className="px-2 py-0.5 rounded-full transition-all"
                style={{
                  background: language === "my" ? "#2B2A26" : "transparent",
                  color: language === "my" ? "#F4F1EA" : "rgba(43,42,38,0.6)",
                }}
              >
                မြန်မာ
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ color: "#2B2A26" }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          className="md:hidden border-t px-10 py-5 flex flex-col gap-4"
          style={{ background: "#F4F1EA", borderColor: "rgba(43,42,38,0.08)" }}
        >
          <a
            href="#examples"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium"
            style={{ color: "#2B2A26" }}
          >
            {nav.examples}
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium"
            style={{ color: "#2B2A26" }}
          >
            {nav.pricing}
          </a>
          <Link
            href="/auth/sign-up"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center text-sm font-medium px-4 py-2.5 rounded-lg"
            style={{ background: "#2B2A26", color: "#F4F1EA" }}
          >
            {nav.getStarted}
          </Link>
        </div>
      )}
    </header>
  );
}
