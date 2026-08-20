"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  QrCode,
  Smartphone,
  UtensilsCrossed,
  Search,
  Share2,
  X,
  ShoppingBag,
  Star,
  RefreshCw,
  Globe2,
  ExternalLink,
  Facebook,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Layers,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FAQ from "@/components/landing/FAQ";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [billing, setBilling] = useState<"6months" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] font-sans selection:bg-[#CDF22B] selection:text-[#111111] overflow-x-clip">
      <LandingNavbar />

      <main>
        {/* =========================================================================
            1. HERO SECTION (Airy, Light, High-Impact with Ambient Radial Glows)
           ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F6FF] via-[#FAFAFD] to-[#FFFFFF] px-4 pb-14 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24 border-b border-[#E5E5E5]">
          {/* Subtle Ambient Radial Glowing Blobs */}
          <div
            className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#1E45FB]/15 to-[#CDF22B]/20 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-[450px] h-[450px] bg-[#1E45FB]/10 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
              {/* Hero Text */}
              <div className="max-w-2xl text-center lg:text-left z-10 mx-auto lg:mx-0">
                <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#1E45FB] shadow-sm border border-[#1E45FB]/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E45FB] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E45FB]"></span>
                  </span>
                  {t.hero.badge || "Zero Reprinting. 100% Live Menus."}
                </div>

                <h1 className="text-3xl font-black leading-[1.15] tracking-tight text-[#111111] xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {t.hero.titleLine1 || "Stop reprinting menus."}
                  <br />
                  <span className="text-[#1E45FB]">
                    {t.hero.titleHighlight || "Update live in seconds."}
                  </span>
                </h1>

                <p className="mx-auto lg:mx-0 mt-4 sm:mt-5 max-w-xl text-base leading-relaxed text-[#555555] sm:text-lg lg:text-xl font-medium">
                  {t.hero.titleLine3 ||
                    "Prices change. Your menu should too — instantly on every diner's phone with zero app downloads."}
                </p>

                <div className="mt-7 sm:mt-9 flex flex-col items-stretch sm:items-center gap-3.5 sm:flex-row lg:justify-start">
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-[#1E45FB] px-7 sm:px-8 text-base font-bold text-white shadow-xl shadow-[#1E45FB]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1737C9] hover:shadow-2xl hover:shadow-[#1E45FB]/30 active:translate-y-0"
                  >
                    {t.hero.createMenu || "Launch Your Menu in 5 Mins"}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="#live-proof"
                    className="inline-flex min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] bg-white px-7 sm:px-8 text-base font-bold text-[#111111] shadow-sm transition-all duration-300 hover:border-[#1E45FB] hover:text-[#1E45FB] hover:bg-[#EEF2FF]/50"
                  >
                    <Sparkles className="h-4 w-4 text-[#1E45FB]" />
                    {t.liveProof?.eyebrow || "See Live Proof"}
                  </Link>
                </div>
              </div>

              {/* Hero Visual Composition - QR Stand + Diner Phone (Mohinga & Shan Noodles) */}
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none flex items-center justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#1E45FB]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative w-[270px] xs:w-[290px] sm:w-[320px] h-[540px] xs:h-[580px] sm:h-[640px] perspective-[1000px] group z-20">
                  {/* Floating Permanent QR Stand */}
                  <div className="absolute -left-4 xs:-left-8 sm:-left-16 lg:-left-20 bottom-12 sm:bottom-24 w-36 xs:w-40 sm:w-44 h-48 xs:h-52 sm:h-56 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-[#E5E5E5] flex flex-col z-30 animate-qr-stand">
                    <div className="flex-1 border-2 border-dashed border-[#E5E5E5] rounded-xl flex items-center justify-center p-2.5 sm:p-3 relative bg-[#FAFAFA] overflow-hidden">
                      {/* Viewfinder Target Brackets */}
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 border-[#1E45FB] rounded-tl-sm"></div>
                      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 border-[#1E45FB] rounded-tr-sm"></div>
                      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 border-[#1E45FB] rounded-bl-sm"></div>
                      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 border-[#1E45FB] rounded-br-sm"></div>

                      {/* Laser Beam */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1E45FB] to-transparent shadow-[0_0_10px_#1E45FB] animate-scan-laser pointer-events-none z-10"></div>

                      <QrCode className="w-full h-full text-[#111111]" />
                      <div className="absolute inset-0 bg-[#1E45FB]/5 rounded-xl"></div>
                    </div>
                    <div className="pt-2 sm:pt-3 text-center">
                      <div className="inline-flex items-center gap-1 mb-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1E45FB] animate-ping"></span>
                        <p className="text-[9px] sm:text-[10px] font-black text-[#111111] tracking-wider">
                          {t.hero.scanForMenu}
                        </p>
                      </div>
                      <p className="text-[7px] sm:text-[8px] text-[#888888] font-medium truncate">
                        {t.hero.sampleRestaurant}
                      </p>
                    </div>
                  </div>

                  {/* Smartphone showing Menu */}
                  <div className="absolute inset-0 bg-[#111111] rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-[#111111] shadow-2xl overflow-hidden animate-ambient-phone z-20">
                    <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-[#111111] z-50 rounded-b-2xl sm:rounded-b-3xl flex items-center justify-center">
                      <div className="w-12 sm:w-16 h-2.5 sm:h-3.5 bg-black/60 rounded-full"></div>
                    </div>
                    <div className="w-full h-full bg-[#FDFDFD] relative overflow-hidden flex flex-col">
                      <div className="bg-[#1E45FB] px-4 sm:px-5 pb-5 sm:pb-6 pt-9 sm:pt-12 text-white shrink-0">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-white/20">
                            <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] sm:text-xs font-medium text-[#CDF22B] mb-0.5">
                              {t.hero.sampleRestaurant}
                            </p>
                            <h2 className="text-base sm:text-lg font-bold leading-tight">
                              Digital Menu
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 flex-1 overflow-hidden flex flex-col gap-2.5 sm:gap-3 relative bg-[#F8F8F8]">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5 sm:gap-3 border border-[#E5E5E5]">
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#AAAAAA]" />
                          <span className="text-xs sm:text-sm text-[#888888] truncate">
                            {t.hero.searchPlaceholder}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-[#1E45FB] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md shadow-[#1E45FB]/20">
                            {t.hero.popularTab}
                          </span>
                          <span className="bg-white text-[#666666] border border-[#E5E5E5] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold">
                            {t.hero.noodlesTab}
                          </span>
                        </div>

                        {/* Dish 1: Mohinga */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm border border-[#E5E5E5] flex gap-3 sm:gap-4">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl bg-[#FEF3C7] shrink-0 relative overflow-hidden flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600/40" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-[#111111] text-xs sm:text-sm truncate">
                                {t.hero.mohingaTitle}
                              </h3>
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-[#888888] mt-0.5 truncate">
                              {t.hero.mohingaSub}
                            </p>
                            <p className="font-black text-[#1E45FB] mt-1.5 sm:mt-2 text-xs sm:text-sm">
                              {t.hero.mohingaPrice}
                            </p>
                          </div>
                        </div>

                        {/* Dish 2: Shan Noodles */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm border border-[#E5E5E5] flex gap-3 sm:gap-4">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl bg-[#DBEAFE] shrink-0 relative overflow-hidden flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600/40" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                            <h3 className="font-bold text-[#111111] text-xs sm:text-sm truncate">
                              {t.hero.shanNoodlesTitle}
                            </h3>
                            <p className="text-[9px] sm:text-[10px] text-[#888888] mt-0.5 truncate">
                              {t.hero.shanNoodlesSub}
                            </p>
                            <p className="font-black text-[#1E45FB] mt-1.5 sm:mt-2 text-xs sm:text-sm">
                              {t.hero.shanNoodlesPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Live Sync Tag */}
                  <div className="absolute top-20 sm:top-32 -right-2 xs:-right-4 sm:-right-10 lg:-right-12 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-[#E5E5E5] flex items-center gap-2.5 sm:gap-3 transform rotate-[5deg] z-40 transition-transform group-hover:translate-x-1 sm:group-hover:translate-x-2">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#CDF22B] rounded-full flex items-center justify-center shrink-0">
                      <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-[#111111]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-[#111111]">
                        {t.hero.liveSync}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-[#666666]">
                        {t.hero.liveSyncSub}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. DOMINANT VISUAL PROOF MOMENT (Customer-Facing QR-to-Menu Scan Flow)
            The single most visually prominent element after the hero
           ========================================================================= */}
        <section
          id="live-proof"
          className="relative bg-[#0A0D18] text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-y border-[#1E293B]"
        >
          {/* Neon Grid Glow Ambient */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#1E45FB]/25 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#CDF22B]/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1E45FB]/20 border border-[#1E45FB]/40 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-[#CDF22B] mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                {t.liveProof?.eyebrow || "Customer Scan Experience"}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {t.liveProof?.title || "Real menu. Real scan. No app needed."}
              </h2>
              <p className="mt-3.5 text-sm sm:text-lg text-[#94A3B8] font-medium leading-relaxed">
                {t.liveProof?.subtitle ||
                  "See exactly what your diners see the moment they scan your table QR code — a lightning-fast, photo-rich digital menu in their mobile browser."}
              </p>
            </div>

            {/* Proof Shell Container */}
            <div className="bg-[#111625]/90 border border-[#1E293B] rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-xl">
              {/* Feature Highlights Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#1E293B]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CDF22B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CDF22B]"></span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {t.liveProof?.tableBadge || "Table #04 • Mobile Browser"}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] bg-[#1E293B] text-[#CDF22B] px-2.5 py-0.5 rounded-full font-mono">
                    {t.liveProof?.instantBadge || "⚡ 1-Sec Instant Load"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-[#94A3B8]">
                  <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-[#CDF22B]" />
                    {t.liveProof?.noAppBadge || "No App Download"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-[#CDF22B]" />
                    {t.liveProof?.bilingualBadge || "Burmese + English"}
                  </span>
                </div>
              </div>

              {/* Two-Column Side-by-Side: Physical QR Table Stand (Left) & Customer Phone Menu (Right) */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* LEFT: Real Scannable Table QR Stand (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-full max-w-sm bg-gradient-to-b from-[#1C2337] to-[#121727] rounded-3xl p-6 sm:p-7 border border-[#273553] shadow-xl relative overflow-hidden group">
                    {/* Glow behind the QR */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#1E45FB]/20 rounded-full blur-2xl pointer-events-none"></div>

                    {/* Table QR Card Representation */}
                    <div className="relative bg-white text-[#111111] rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/20 text-center">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <div className="flex items-center gap-2 text-left">
                          <div className="h-7 w-7 rounded-lg bg-[#1E45FB] flex items-center justify-center text-white">
                            <UtensilsCrossed className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black leading-tight text-[#111111]">
                              {t.liveProof?.demoRestName || "Golden Spoon Cuisine"}
                            </h4>
                            <p className="text-[9px] text-[#888888]">Table #04 • Dine-in</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-[#EEF2FF] text-[#1E45FB] px-2 py-0.5 rounded-full border border-[#1E45FB]/20">
                          Scan QR
                        </span>
                      </div>

                      {/* Scannable SVG QR Code with viewfinders */}
                      <div className="relative mx-auto w-44 h-44 sm:w-48 sm:h-48 bg-[#FAFAFA] p-3 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                        {/* Target corner brackets */}
                        <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#1E45FB] rounded-tl-sm"></div>
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#1E45FB] rounded-tr-sm"></div>
                        <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#1E45FB] rounded-bl-sm"></div>
                        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#1E45FB] rounded-br-sm"></div>

                        {/* Interactive Real QR Code */}
                        <QRCodeSVG
                          value="https://my-qr-saas.vercel.app/menu"
                          size={156}
                          level="M"
                          includeMargin={false}
                          className="w-full h-full"
                        />

                        {/* Subtle animated scan beam */}
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1E45FB] to-transparent shadow-[0_0_8px_#1E45FB] animate-scan-laser pointer-events-none"></div>
                      </div>

                      <div className="mt-4 pt-2">
                        <p className="text-xs font-extrabold text-[#111111]">
                          {t.liveProof?.scanHeadline || "Scan with your phone camera"}
                        </p>
                        <p className="text-[10px] text-[#666666] mt-0.5">
                          {t.liveProof?.scanSub || "Opens instantly in Safari or Chrome"}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Direct Demo Link for Desktop Users */}
                    <div className="mt-5 text-center">
                      <Link
                        href="/menu"
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#1E45FB] hover:bg-[#1737C9] text-white text-xs font-bold transition-colors shadow-lg shadow-[#1E45FB]/25"
                      >
                        <span>{t.liveProof?.openDirectly || "Open Live Demo Menu in Browser"}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* 3 Micro-Steps Under QR */}
                  <div className="mt-6 space-y-2.5 w-full max-w-sm text-left">
                    <div className="flex items-center gap-3 text-xs text-[#CBD5E1] bg-[#141A2B] p-2.5 rounded-xl border border-[#222C42]">
                      <span className="flex h-5 w-5 rounded-full bg-[#1E45FB] text-white font-black text-[10px] items-center justify-center shrink-0">
                        1
                      </span>
                      <span>{t.liveProof?.step1 || "Scan permanent table QR code"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#CBD5E1] bg-[#141A2B] p-2.5 rounded-xl border border-[#222C42]">
                      <span className="flex h-5 w-5 rounded-full bg-[#1E45FB] text-white font-black text-[10px] items-center justify-center shrink-0">
                        2
                      </span>
                      <span>{t.liveProof?.step2 || "Menu opens in < 1 second in browser"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#CBD5E1] bg-[#141A2B] p-2.5 rounded-xl border border-[#222C42]">
                      <span className="flex h-5 w-5 rounded-full bg-[#1E45FB] text-white font-black text-[10px] items-center justify-center shrink-0">
                        3
                      </span>
                      <span>{t.liveProof?.step3 || "Browse dishes, photos, and order"}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Real Customer Phone Screen Mockup (7 cols) */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-[370px] bg-[#0C0E14] rounded-[2.75rem] p-3 sm:p-3.5 border-[6px] sm:border-[8px] border-[#222D46] shadow-2xl relative">
                    {/* Dynamic Island / Speaker */}
                    <div className="absolute top-4 inset-x-0 flex justify-center z-30">
                      <div className="w-20 sm:w-24 h-4 bg-black rounded-full flex items-center justify-end px-2">
                        <div className="h-2 w-2 rounded-full bg-[#1E293B]"></div>
                      </div>
                    </div>

                    {/* Customer Mobile Browser Container */}
                    <div className="bg-[#F8F7F4] text-[#171717] rounded-[2rem] overflow-hidden flex flex-col h-[580px] sm:h-[620px] select-none shadow-inner relative">
                      {/* Safari / Chrome Browser URL Bar */}
                      <div className="bg-white px-3 pt-6 pb-2 border-b border-[#EAE8E3] shrink-0">
                        <div className="bg-[#F0EFEB] rounded-lg py-1 px-2.5 flex items-center justify-between text-[10px] text-[#666666]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[#10B981]">🔒</span>
                            <span className="font-mono text-[#333333] font-medium truncate">
                              menuu.me/golden-spoon
                            </span>
                          </div>
                          <span className="text-[9px] bg-white px-1.5 py-0.2 rounded text-[#888888] shrink-0 font-bold">
                            EN / မြန်မာ
                          </span>
                        </div>
                      </div>

                      {/* Customer Restaurant Header */}
                      <div className="bg-white px-4 py-3 border-b border-[#EAE8E3] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[#0B7A5F] flex items-center justify-center text-white font-black text-sm shadow-sm">
                            G
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-xs sm:text-sm font-bold text-[#171717]">
                                Golden Spoon
                              </h3>
                              <span className="bg-[#0B7A5F]/15 text-[#0B7A5F] text-[8px] font-black px-1 rounded">
                                PRO
                              </span>
                            </div>
                            <p className="text-[10px] text-[#737373]">
                              Yangon Cuisine • Table #04
                            </p>
                          </div>
                        </div>
                        <div className="h-7 px-2.5 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] flex items-center text-[10px] font-bold text-[#525252]">
                          📞 Call Staff
                        </div>
                      </div>

                      {/* Search Bar + Category Pills */}
                      <div className="p-3 pb-2 bg-white/70 border-b border-[#EAE8E3] space-y-2 shrink-0">
                        <div className="bg-white border border-[#E5E5E5] rounded-xl px-2.5 py-1.5 flex items-center gap-2 text-[#999] shadow-sm">
                          <Search className="h-3.5 w-3.5 text-[#999]" />
                          <span className="text-[11px] text-[#888888]">
                            Search tea leaf salad, noodles...
                          </span>
                        </div>
                        <div className="flex gap-1.5 overflow-x-hidden">
                          <span className="bg-[#0B7A5F] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                            ⭐ Popular
                          </span>
                          <span className="bg-white border border-[#E8E6E1] text-[#525252] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                            🥗 Salads
                          </span>
                          <span className="bg-white border border-[#E8E6E1] text-[#525252] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                            🍜 Noodles
                          </span>
                          <span className="bg-white border border-[#E8E6E1] text-[#525252] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                            🍧 Desserts
                          </span>
                        </div>
                      </div>

                      {/* Scrollable Customer Menu Dish Feed */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F8F7F4] scrollbar-thin">
                        {/* Dish 1: Laphet Thoke */}
                        <div className="bg-white rounded-2xl p-2.5 border border-[#E8E6E1] shadow-sm flex gap-3 items-center">
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-100 shrink-0 relative overflow-hidden flex items-center justify-center text-3xl shadow-inner">
                            🥗
                            <span className="absolute top-1 left-1 bg-[#0B7A5F] text-white text-[7px] font-black px-1 rounded">
                              POPULAR
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="text-xs font-bold text-[#171717] truncate">
                                Laphet Thoke (Tea Leaf)
                              </h4>
                            </div>
                            <p className="text-[9px] text-[#737373] line-clamp-1 mt-0.5">
                              လက်ဖက်သုတ် • Fermented tea leaves, crunchy beans & garlic
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-black text-[#0B7A5F]">
                                3,500 MMK
                              </span>
                              <button className="h-6 px-2.5 rounded-full bg-[#0B7A5F] text-white text-[10px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1">
                                <span>+ Add</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Dish 2: Shan Khao Swe */}
                        <div className="bg-white rounded-2xl p-2.5 border border-[#E8E6E1] shadow-sm flex gap-3 items-center">
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shrink-0 relative overflow-hidden flex items-center justify-center text-3xl shadow-inner">
                            🍜
                            <span className="absolute top-1 left-1 bg-amber-600 text-white text-[7px] font-black px-1 rounded">
                              CHEF SPECIAL
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#171717] truncate">
                              Shan Khao Swe (Chicken)
                            </h4>
                            <p className="text-[9px] text-[#737373] line-clamp-1 mt-0.5">
                              ရှမ်းခေါက်ဆွဲ • Spiced chicken, sticky rice noodles & chili oil
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-black text-[#0B7A5F]">
                                4,500 MMK
                              </span>
                              <button className="h-6 px-2.5 rounded-full bg-[#0B7A5F] text-white text-[10px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1">
                                <span>+ Add</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Dish 3: Kyay Oh Soup */}
                        <div className="bg-white rounded-2xl p-2.5 border border-[#E8E6E1] shadow-sm flex gap-3 items-center">
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 shrink-0 relative overflow-hidden flex items-center justify-center text-3xl shadow-inner">
                            🍲
                            <span className="absolute top-1 left-1 bg-[#1E45FB] text-white text-[7px] font-black px-1 rounded">
                              BESTSELLER
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#171717] truncate">
                              Kyay Oh Special Soup
                            </h4>
                            <p className="text-[9px] text-[#737373] line-clamp-1 mt-0.5">
                              ကြေးအိုး • Pork meatballs, quail egg, vermicelli soup
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-black text-[#0B7A5F]">
                                6,500 MMK
                              </span>
                              <button className="h-6 px-2.5 rounded-full bg-[#0B7A5F] text-white text-[10px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1">
                                <span>+ Add</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Dish 4: Shwe Yin Aye */}
                        <div className="bg-white rounded-2xl p-2.5 border border-[#E8E6E1] shadow-sm flex gap-3 items-center">
                          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-pink-50 to-purple-100 shrink-0 relative overflow-hidden flex items-center justify-center text-3xl shadow-inner">
                            🍧
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-[#171717] truncate">
                              Shwe Yin Aye Dessert
                            </h4>
                            <p className="text-[9px] text-[#737373] line-clamp-1 mt-0.5">
                              ရွှေရင်အေး • Chilled coconut milk, sticky rice & jelly
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-black text-[#0B7A5F]">
                                2,800 MMK
                              </span>
                              <button className="h-6 px-2.5 rounded-full bg-[#0B7A5F] text-white text-[10px] font-bold shadow-sm hover:opacity-90 flex items-center gap-1">
                                <span>+ Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sticky Diner Bottom Cart Bar */}
                      <div className="bg-white border-t border-[#EAE8E3] p-2.5 shrink-0 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#0B7A5F] text-white flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-[#171717] leading-none">
                              1 item selected
                            </p>
                            <p className="text-[10px] text-[#737373] mt-0.5">
                              Total: <span className="font-bold text-[#0B7A5F]">3,500 MMK</span>
                            </p>
                          </div>
                        </div>
                        <button className="bg-[#0B7A5F] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm">
                          View Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. COMPARISON SECTION (Structured Table - Replaces repetitive bullet lists)
            Direct visual contrast between Traditional Paper Menus and Menuu QR
           ========================================================================= */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#1E45FB]/20 mb-3 inline-block">
                The Reality Check
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight leading-snug">
                {t.problem?.title || "Paper menus cost you money and waste your staff's time."}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#666666] font-medium">
                Why modern restaurants in Myanmar are abandoning paper booklets for permanent QR stands.
              </p>
            </div>

            {/* Asymmetric 2-Column Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Traditional Paper Menu (Pain Points) */}
              <div className="bg-white border-2 border-rose-200/80 rounded-3xl p-6 sm:p-9 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        <X className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                        {t.comparison?.beforeLabel || "Traditional Paper Menu"}
                      </h3>
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                      High Friction
                    </span>
                  </div>

                  <ul className="space-y-4 text-sm sm:text-base text-[#555555]">
                    {[
                      t.comparison?.beforeItems?.[0] || "Expensive printing & reprinting bills every time prices change",
                      t.comparison?.beforeItems?.[1] || "Outdated printed prices create angry disputes at the cash register",
                      t.comparison?.beforeItems?.[2] || "Crossed-out dishes & correction tape look unprofessional to guests",
                      t.comparison?.beforeItems?.[3] || "Waitstaff waste time repeatedly explaining sold-out items to tables",
                      t.comparison?.beforeItems?.[4] || "Static text without appetizing photos or quick mobile search",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-5 w-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                          <X className="h-3 w-3 stroke-[3]" />
                        </span>
                        <span className="font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-rose-100 bg-rose-50/50 -mx-6 -mb-6 sm:-mx-9 sm:-mb-9 p-6 sm:p-9 rounded-b-3xl text-xs sm:text-sm text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Result: Constant reprint overhead & customer confusion.</span>
                </div>
              </div>

              {/* Menuu Digital QR (The Solution) */}
              <div className="bg-[#111111] text-white border-2 border-[#1E45FB] rounded-3xl p-6 sm:p-9 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E45FB]/20 rounded-full blur-3xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#1E45FB] text-white flex items-center justify-center font-bold">
                        <Check className="h-5 w-5 stroke-[3]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {t.comparison?.afterLabel || "With Menuu-QR"}
                      </h3>
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-[#111111] bg-[#CDF22B] px-3 py-1 rounded-full">
                      Zero Friction
                    </span>
                  </div>

                  <ul className="space-y-4 text-sm sm:text-base text-[#D1D5DB]">
                    {[
                      t.comparison?.afterItems?.[0] || "Update prices & items in 5 seconds flat from your phone",
                      t.comparison?.afterItems?.[1] || "Customers always see 100% accurate, live prices at all times",
                      t.comparison?.afterItems?.[2] || "Hide sold-out dishes with a single tap before tables sit down",
                      t.comparison?.afterItems?.[3] || "One permanent table QR stand forever — zero reprint bills",
                      t.comparison?.afterItems?.[4] || "Fast visual mobile menu that boosts appetite and orders",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 h-5 w-5 rounded-full bg-[#CDF22B] text-[#111111] flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                        <span className="font-medium leading-relaxed text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-5 border-t border-[#2A2A2A] bg-[#1A1A1A] -mx-6 -mb-6 sm:-mx-9 sm:-mb-9 p-6 sm:p-9 rounded-b-3xl text-xs sm:text-sm text-[#CDF22B] font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#CDF22B] shrink-0" />
                    <span>Result: 0 MMK reprint bills & faster table turnover.</span>
                  </div>
                  <Link
                    href="/auth/sign-up"
                    className="text-xs font-black text-white hover:underline flex items-center gap-1"
                  >
                    Start Free <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. HOW IT WORKS (Connected 3-Step Pipeline - Progressive Flow)
           ========================================================================= */}
        <section
          id="how-it-works"
          className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#1E45FB]/20 mb-2 inline-block">
                {t.howItWorksSection?.eyebrow || "3 Simple Steps"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight leading-snug">
                {t.howItWorksSection?.title || "From zero to live QR menu in 3 steps."}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#666666] font-medium">
                {t.howItWorksSection?.subTitle || "No technical skills needed. Have your restaurant live today."}
              </p>
            </div>

            {/* Connected Horizontal Timeline Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {[
                {
                  num: t.howItWorksSection?.step1Num || "01",
                  tag: t.howItWorksSection?.step1Tag || "SETUP",
                  title: t.howItWorksSection?.step1Title || "Create your store",
                  desc:
                    t.howItWorksSection?.step1Desc ||
                    "Register your restaurant and claim your unique digital menu link in 2 minutes.",
                  icon: UtensilsCrossed,
                  badge: "2 MINS",
                },
                {
                  num: t.howItWorksSection?.step2Num || "02",
                  tag: t.howItWorksSection?.step2Tag || "MENU",
                  title: t.howItWorksSection?.step2Title || "Add dishes & live prices",
                  desc:
                    t.howItWorksSection?.step2Desc ||
                    "Upload food photos, set prices, and organize categories with zero hassle.",
                  icon: RefreshCw,
                  badge: "INSTANT SYNC",
                },
                {
                  num: t.howItWorksSection?.step3Num || "03",
                  tag: t.howItWorksSection?.step3Tag || "LAUNCH",
                  title: t.howItWorksSection?.step3Title || "Place your QR & go live",
                  desc:
                    t.howItWorksSection?.step3Desc ||
                    "Download your permanent table QR code. It never expires, even when menus change.",
                  icon: QrCode,
                  badge: "PERMANENT QR",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="bg-[#F8F8F8] border-2 border-[#E5E5E5] rounded-2xl p-6 relative overflow-hidden group hover:border-[#1E45FB] hover:bg-white transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-[#1E45FB]">
                        {step.num}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-[#E5E5E5] px-2.5 py-1 rounded-full text-[#111111]">
                        {step.badge}
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-[#1E45FB] text-white flex items-center justify-center mb-4">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center gap-1.5 text-xs font-bold text-[#1E45FB]">
                    <span>Step {i + 1} of 3</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. ASYMMETRIC CORE CAPABILITIES (Bilingual & Speed Deep Dive)
            Distinct asymmetric format replacing old repetitive 3x2 feature grid
           ========================================================================= */}
        <section
          id="features"
          className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]"
        >
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#1E45FB]/20 mb-3 inline-block">
                {t.localContext?.badge || "Built for Myanmar Dining"}
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight leading-snug">
                {t.valuePropSection?.title || "Built to replace slow paper menus forever."}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#666666] font-medium">
                Engineered specifically for the daily realities of running food businesses in Myanmar.
              </p>
            </div>

            {/* Asymmetric Showcase: Spotlight Card (Left 60%) + Deep Dive Pillars (Right 40%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Showcase: Full Dual-Language & Fast Mobile Data Experience (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1E45FB] bg-[#EEF2FF] px-3 py-1 rounded-full mb-4">
                    <Globe2 className="h-4 w-4" />
                    <span>Native Myanmar (Burmese) + English</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111111] mb-3">
                    Bilingual menus that cater to local regulars and international diners.
                  </h3>
                  <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-6 font-medium">
                    Provide dish titles, rich ingredients, and descriptions in both Burmese and English. Diners switch instantly with one tap without reloading the page.
                  </p>

                  {/* Visual Demonstration of Unique Dishes (Kyay Oh & Danbauk) */}
                  <div className="space-y-3 bg-[#F8F8F8] p-4 rounded-2xl border border-[#E5E5E5]">
                    {/* Dish A: Kyay Oh */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#E5E5E5] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-orange-100 flex items-center justify-center text-xl">
                          🍲
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#111111]">Kyay Oh Soup</span>
                            <span className="text-xs text-[#888888] font-burmese">(ကြေးအိုး)</span>
                          </div>
                          <p className="text-[11px] text-[#666666]">Pork meatballs, egg, vermicelli noodles</p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-[#1E45FB]">6,500 MMK</span>
                    </div>

                    {/* Dish B: Danbauk Biryani */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#E5E5E5] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-amber-100 flex items-center justify-center text-xl">
                          🍛
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#111111]">Danbauk Chicken Biryani</span>
                            <span className="text-xs text-[#888888] font-burmese">(ဒံပေါက်)</span>
                          </div>
                          <p className="text-[11px] text-[#666666]">Spiced basmati rice, tender chicken, cashew nuts</p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-[#1E45FB]">7,000 MMK</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#666666] pt-4 border-t border-[#E5E5E5]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    MPT, Atom, Ooredoo fast loading
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Zero app install needed
                  </span>
                </div>
              </div>

              {/* Right Stack: 3 Distinct Value Pillars (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                {/* Pillar 1 */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 hover:border-[#1E45FB] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-[#EEF2FF] text-[#1E45FB] flex items-center justify-center font-bold">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-base text-[#111111]">1-Click Price Adjustments</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium leading-relaxed">
                    Market prices for cooking oil and fresh ingredients fluctuate. Adjust live menu prices in 5 seconds from your smartphone.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 hover:border-[#1E45FB] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-[#CDF22B]/20 text-[#111111] flex items-center justify-center font-bold">
                      <QrCode className="h-4 w-4 text-[#1E45FB]" />
                    </div>
                    <h4 className="font-bold text-base text-[#111111]">One Permanent QR Stand</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium leading-relaxed">
                    Place acrylic stands or stickers once. The QR code never changes, even if you revamp your entire culinary menu.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-6 hover:border-[#1E45FB] transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <h4 className="font-bold text-base text-[#111111]">Frictionless Browser Scanning</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium leading-relaxed">
                    Guests simply open their native camera. No APK downloads, no logins, no battery drain. Just immediate dining.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. SOCIAL PROOF & RESTAURANT TESTIMONIAL (Soft Framing, Authentic Voice)
           ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#1E45FB]/20 mb-3 inline-block">
                {t.socialProof?.eyebrow || "Real Restaurant Impact"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight leading-snug">
                {t.socialProof?.title || "Built for Yangon's first wave of digital menus."}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#666666] font-medium">
                {t.socialProof?.subtitle ||
                  "From bustling tea houses to boutique cafés across Myanmar, restaurant owners are eliminating printing headaches."}
              </p>
            </div>

            {/* Testimonial Spotlight Card */}
            <div className="bg-gradient-to-br from-[#FAFAFD] to-[#F0F4FF] border-2 border-[#E0E7FF] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md relative overflow-hidden">
              <div className="relative z-10">
                {/* Quote marks icon */}
                <div className="text-4xl sm:text-5xl text-[#1E45FB]/30 font-serif leading-none mb-3">
                  “
                </div>

                <blockquote className="text-base sm:text-xl lg:text-2xl font-bold text-[#111111] leading-relaxed mb-8">
                  {t.socialProof?.quote ||
                    "With commodity and ingredient costs shifting every month, reprinting physical paper menus was draining our budget and frustrating our staff. Now, when prices update, our manager changes them on their phone in 5 seconds. Diners scan and always see exact prices."}
                </blockquote>

                {/* Author Profile */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-full bg-[#1E45FB] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#1E45FB]/20">
                      KT
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-[#111111]">
                        {t.socialProof?.author || "Ko Thura & Management Team"}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#666666] font-medium">
                        {t.socialProof?.role || "Mingalar Café & Tea Lounge"} •{" "}
                        {t.socialProof?.location || "Sanchaung, Yangon"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-[#CBD5E1] text-[#1E45FB] px-3.5 py-1.5 rounded-full shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-[#1E45FB]" />
                    {t.socialProof?.badge || "Verified Pilot Restaurant"}
                  </span>
                </div>
              </div>
            </div>

            {/* Soft-Framed Key Metrics (No Fabricated Stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-black text-[#1E45FB]">
                  {t.socialProof?.stat1Val || "0 MMK"}
                </p>
                <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mt-1">
                  {t.socialProof?.stat1Label || "Ongoing reprint costs"}
                </p>
              </div>

              <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-black text-[#111111]">
                  {t.socialProof?.stat2Val || "< 5 Sec"}
                </p>
                <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mt-1">
                  {t.socialProof?.stat2Label || "Price update sync time"}
                </p>
              </div>

              <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {t.socialProof?.stat3Val || "100%"}
                </p>
                <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mt-1">
                  {t.socialProof?.stat3Label || "Browser-based (No App required)"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. PRICING SECTION (Clean, High-Conversion with Period Toggle)
           ========================================================================= */}
        <section
          id="pricing"
          className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#1E45FB]/20 mb-3 inline-block">
                {t.pricing.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
                {t.pricing.title}
              </h2>
              <p className="mt-2.5 sm:mt-3 text-base sm:text-lg text-[#666666] font-medium">
                {t.pricing.subTitle}
              </p>
            </div>

            {/* Period Toggle */}
            <div className="mb-8 sm:mb-12 flex justify-center">
              <div className="bg-white p-1 rounded-full border border-[#E5E5E5] inline-flex shadow-sm">
                <button
                  onClick={() => setBilling("6months")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                    billing === "6months"
                      ? "bg-[#111111] text-white"
                      : "text-[#666666] hover:text-[#111111]"
                  }`}
                >
                  {t.pricing.toggle6Months}
                </button>
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 sm:gap-2 ${
                    billing === "yearly"
                      ? "bg-[#111111] text-white"
                      : "text-[#666666] hover:text-[#111111]"
                  }`}
                >
                  {t.pricing.toggleYearly}
                  <span className="bg-[#CDF22B] text-[#111111] text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                    {t.pricing.saveBadge}
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* FREE PLAN */}
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-[#E5E5E5] shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111111] mb-1 sm:mb-2">
                    {t.pricing.freePlan}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#888888] font-medium mb-6 sm:mb-8">
                    {t.pricing.freeSub}
                  </p>
                  <div className="text-4xl sm:text-5xl font-black text-[#111111] mb-6 sm:mb-8">
                    {t.pricing.freePrice}{" "}
                    <span className="text-lg sm:text-xl text-[#888888] font-semibold">
                      {t.pricing.freeCurrency}
                    </span>
                  </div>
                  <div className="h-px bg-[#E5E5E5] w-full mb-6 sm:mb-8"></div>
                  <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-[#111111] mb-6 sm:mb-8">
                    <UtensilsCrossed className="text-[#1E45FB] h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                    <span>{t.pricing.freeItems}</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[#666666] font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#1E45FB]" />
                      Permanent table QR code
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#1E45FB]" />
                      Unlimited customer scans
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#1E45FB]" />
                      Real-time price & dish updates
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/sign-up"
                  className="block w-full py-3.5 sm:py-4 text-center rounded-xl bg-[#F5F5F5] text-sm sm:text-base text-[#111111] font-bold hover:bg-[#E5E5E5] transition-colors"
                >
                  {t.pricing.freeCta}
                </Link>
              </div>

              {/* PRO PLAN */}
              <div className="bg-[#111111] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative md:scale-105 border border-[#333333] flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 bg-[#CDF22B] text-[#111111] text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-2xl sm:rounded-tr-[2.5rem] uppercase tracking-widest">
                  {t.pricing.proRecommended}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">
                    {t.pricing.proPlan}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#AAAAAA] font-medium mb-6 sm:mb-8">
                    {t.pricing.proSub}
                  </p>
                  <div className="text-4xl sm:text-5xl font-black text-white mb-1 sm:mb-2">
                    {billing === "yearly"
                      ? t.pricing.proPriceYearly
                      : t.pricing.proPrice6Months}{" "}
                    <span className="text-lg sm:text-xl text-[#888888] font-semibold">
                      {t.pricing.freeCurrency}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#888888] mb-6">
                    {billing === "yearly" ? t.pricing.proPerYear : t.pricing.proPer6Months}
                  </p>
                  <div className="h-px bg-[#333333] w-full mb-6 sm:mb-8"></div>
                  <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-bold text-white mb-6 sm:mb-8">
                    <UtensilsCrossed className="text-[#CDF22B] h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                    <span>{t.pricing.proItems}</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[#AAAAAA] font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#CDF22B]" />
                      High-resolution food photos per dish
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#CDF22B]" />
                      Bilingual menu (Myanmar + English)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#CDF22B]" />
                      Custom branding, logo & theme colors
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#CDF22B]" />
                      Mark popular & chef special dishes
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/sign-up"
                  className="block w-full py-3.5 sm:py-4 text-center rounded-xl bg-[#1E45FB] text-sm sm:text-base text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#1E45FB]/25"
                >
                  {t.pricing.proCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. FAQ SECTION (Accordion Component)
           ========================================================================= */}
        <FAQ />

        {/* =========================================================================
            9. FINAL FULL-BLEED CTA (High Energy #CDF22B Accent Banner)
           ========================================================================= */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl bg-[#CDF22B] rounded-2xl sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-[#D9FA3A] shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4)_0,transparent_50%)] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight mb-4 sm:mb-6 leading-tight">
                {t.cta.title || "Stop reprinting paper menus today."}
              </h2>

              <p className="mx-auto max-w-2xl text-base sm:text-xl text-[#111111]/80 font-medium mb-8 sm:mb-12">
                {t.cta.description}
              </p>

              <Link
                href="/auth/sign-up"
                className="group inline-flex min-h-[3.5rem] sm:min-h-[4rem] items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-[#111111] px-8 sm:px-10 text-base sm:text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[#222222]"
              >
                {t.cta.startFree || t.hero.createMenu || "Launch Your Free Menu Now"}
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1 text-[#CDF22B]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          10. FOOTER
         ========================================================================= */}
      <footer className="border-t border-[#E5E5E5] bg-white px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-black text-[#111111] text-lg sm:text-xl"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#1E45FB] text-white">
                  <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span>Menuu</span>
              </Link>
              <p className="mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm leading-5 sm:leading-6 text-[#888888] font-medium">
                {t.footer.description}
              </p>
              <div className="mt-5 sm:mt-6 flex gap-3">
                <Link
                  href={process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F8F8] text-[#111111] transition-colors hover:bg-[#1E45FB] hover:text-white border border-[#E5E5E5]"
                  aria-label="Facebook Page"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-4 sm:mb-6 text-xs font-bold uppercase tracking-widest text-[#111111]">
                {t.footer.product}
              </p>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#888888] font-medium">
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover:text-[#1E45FB] transition-colors"
                  >
                    {t.nav.howItWorks}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-[#1E45FB] transition-colors"
                  >
                    {t.nav.pricing}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="hover:text-[#1E45FB] transition-colors"
                  >
                    {t.nav.faq}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    target="_blank"
                    className="hover:text-[#1E45FB] transition-colors flex items-center gap-1.5"
                  >
                    {t.hero.viewDemo} <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 sm:mb-6 text-xs font-bold uppercase tracking-widest text-[#111111]">
                {t.footer.account}
              </p>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#888888] font-medium">
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-[#1E45FB] transition-colors"
                  >
                    {t.nav.login}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/sign-up"
                    className="hover:text-[#1E45FB] transition-colors"
                  >
                    {t.nav.getStarted}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col gap-3 sm:gap-4 border-t border-[#E5E5E5] pt-6 sm:pt-8 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
            <p className="text-[#888888] font-medium">
              &copy; 2026 {t.footer.copyright}
            </p>
            <p className="text-[#888888] font-medium">{t.footer.madeFor}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}