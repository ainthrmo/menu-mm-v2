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
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FAQ from "@/components/landing/FAQ";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();
  const [billing, setBilling] = useState<"6months" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111111] font-sans selection:bg-[#CDF22B] selection:text-[#111111] overflow-x-clip">
      <LandingNavbar />

      <main>
        {/* 1. HERO - Mobile-first Layout */}
        <section className="relative overflow-hidden bg-[#1E45FB] px-4 pb-16 pt-16 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-32">
          <div
            className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0,transparent_100%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Hero Text */}
              <div className="max-w-2xl text-center lg:text-left z-10 mx-auto lg:mx-0">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#CDF22B] backdrop-blur-sm border border-white/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CDF22B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CDF22B]"></span>
                  </span>
                  {t.hero.badge}
                </div>

                <h1 className="text-3xl font-black leading-[1.2] tracking-tight text-white xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                  {t.hero.titleLine1}<br />
                  <span className="text-[#CDF22B]">{t.hero.titleHighlight}</span><br />
                  {t.hero.titleLine3}
                </h1>

                <p className="mx-auto lg:mx-0 mt-5 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg lg:text-xl font-medium">
                  {t.hero.description}
                </p>

                <div className="mt-8 sm:mt-10 flex flex-col items-stretch sm:items-center gap-3.5 sm:flex-row lg:justify-start">
                  <Link
                    href="/auth/sign-up"
                    className="group inline-flex min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl bg-[#CDF22B] px-7 sm:px-8 text-base font-bold text-[#111111] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D9FA3A] hover:shadow-2xl active:translate-y-0"
                  >
                    {t.hero.startFree}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/menu"
                    target="_blank"
                    className="inline-flex min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl border-2 border-white/20 bg-transparent px-7 sm:px-8 text-base font-bold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                  >
                    {t.hero.viewDemo}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Hero Visual Composition - Responsive & Scaled */}
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none flex items-center justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative w-[270px] xs:w-[290px] sm:w-[320px] h-[540px] xs:h-[580px] sm:h-[640px] perspective-[1000px] group z-20">
                  {/* Floating QR Stand (Table Context with Laser Scan Beam) */}
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
                        <p className="text-[9px] sm:text-[10px] font-black text-[#111111] tracking-wider">{t.hero.scanForMenu}</p>
                      </div>
                      <p className="text-[7px] sm:text-[8px] text-[#888888] font-medium truncate">{t.hero.sampleRestaurant}</p>
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
                            <p className="text-[11px] sm:text-xs font-medium text-[#CDF22B] mb-0.5">{t.hero.sampleRestaurant}</p>
                            <h2 className="text-base sm:text-lg font-bold leading-tight">Digital Menu</h2>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 flex-1 overflow-hidden flex flex-col gap-2.5 sm:gap-3 relative bg-[#F8F8F8]">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm flex items-center gap-2.5 sm:gap-3 border border-[#E5E5E5]">
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#AAAAAA]" />
                          <span className="text-xs sm:text-sm text-[#888888] truncate">{t.hero.searchPlaceholder}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-[#1E45FB] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md shadow-[#1E45FB]/20">{t.hero.popularTab}</span>
                          <span className="bg-white text-[#666666] border border-[#E5E5E5] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold">{t.hero.noodlesTab}</span>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm border border-[#E5E5E5] flex gap-3 sm:gap-4">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl bg-[#FEF3C7] shrink-0 relative overflow-hidden flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600/40" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-[#111111] text-xs sm:text-sm truncate">{t.hero.mohingaTitle}</h3>
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-[#888888] mt-0.5 truncate">{t.hero.mohingaSub}</p>
                            <p className="font-black text-[#1E45FB] mt-1.5 sm:mt-2 text-xs sm:text-sm">{t.hero.mohingaPrice}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm border border-[#E5E5E5] flex gap-3 sm:gap-4">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl bg-[#DBEAFE] shrink-0 relative overflow-hidden flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600/40" />
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                            <h3 className="font-bold text-[#111111] text-xs sm:text-sm truncate">{t.hero.shanNoodlesTitle}</h3>
                            <p className="text-[9px] sm:text-[10px] text-[#888888] mt-0.5 truncate">{t.hero.shanNoodlesSub}</p>
                            <p className="font-black text-[#1E45FB] mt-1.5 sm:mt-2 text-xs sm:text-sm">{t.hero.shanNoodlesPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements (Connection) */}
                  <div className="absolute top-20 sm:top-32 -right-2 xs:-right-4 sm:-right-10 lg:-right-12 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-[#E5E5E5] flex items-center gap-2.5 sm:gap-3 transform rotate-[5deg] z-40 transition-transform group-hover:translate-x-1 sm:group-hover:translate-x-2">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#CDF22B] rounded-full flex items-center justify-center shrink-0">
                      <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-[#111111]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-[#111111]">{t.hero.liveSync}</p>
                      <p className="text-[9px] sm:text-[10px] text-[#666666]">{t.hero.liveSyncSub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM - Responsive Cards */}
        <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight leading-snug">
                {t.problem.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: t.problem.card1Title,
                  desc: t.problem.card1Desc,
                  icon: X,
                  color: "bg-red-50 text-red-600 border-red-100"
                },
                {
                  title: t.problem.card2Title,
                  desc: t.problem.card2Desc,
                  icon: X,
                  color: "bg-red-50 text-red-600 border-red-100"
                },
                {
                  title: t.problem.card3Title,
                  desc: t.problem.card3Desc,
                  icon: X,
                  color: "bg-red-50 text-red-600 border-red-100"
                }
              ].map((situation, i) => (
                <div key={i} className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border ${situation.color}`}>
                    <situation.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-2">{situation.title}</h3>
                  <p className="text-sm sm:text-base text-[#666666] font-medium leading-relaxed">{situation.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. TRANSFORMATION - Responsive Comparison */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-[#E5E5E5] shadow-xl sm:shadow-2xl">
              {/* Old Way */}
              <div className="bg-white p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-bold tracking-widest text-[#888888] uppercase mb-6 sm:mb-8">{t.comparison.beforeLabel}</p>
                <ul className="space-y-4 sm:space-y-5">
                  {t.comparison.beforeItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 sm:gap-4 text-[#888888] font-semibold text-sm sm:text-base">
                      <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Menuu-QR */}
              <div className="bg-[#1E45FB] p-6 sm:p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#CDF22B] rounded-full blur-[100px] opacity-40 pointer-events-none"></div>
                <p className="text-xs sm:text-sm font-bold tracking-widest text-[#CDF22B] uppercase mb-6 sm:mb-8 relative z-10">{t.comparison.afterLabel}</p>
                <ul className="space-y-4 sm:space-y-5 relative z-10">
                  {t.comparison.afterItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 sm:gap-4 text-white font-bold text-base sm:text-lg">
                      <div className="h-6 w-6 sm:h-7 sm:w-7 bg-[#CDF22B] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#111111]" strokeWidth={3} />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT EXPERIENCE - Fluid Stages */}
        <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight leading-snug">
                {t.productExperience.title}
              </h2>
            </div>

            <div className="space-y-16 sm:space-y-24">
              {/* Stage 1: Manage */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1 bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-inner overflow-hidden">
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E5E5E5] shadow-lg overflow-hidden flex flex-col h-full transform transition-transform hover:scale-[1.01] duration-300">
                    <div className="border-b border-[#E5E5E5] p-3 sm:p-4 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="font-bold text-xs sm:text-sm text-[#111111]">{t.productExperience.stage1DashTitle}</div>
                      <div className="bg-[#1E45FB] text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold">{t.productExperience.stage1DashAdd}</div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 border border-[#E5E5E5] rounded-lg sm:rounded-xl">
                          <div className="flex gap-2.5 sm:gap-3 items-center">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-[#E5E5E5] rounded-lg"></div>
                            <div>
                              <div className="w-20 sm:w-24 h-2.5 sm:h-3 bg-[#111111] rounded mb-1 sm:mb-1.5"></div>
                              <div className="w-12 sm:w-16 h-2 bg-[#888888] rounded"></div>
                            </div>
                          </div>
                          <div className="w-14 sm:w-16 h-4 sm:h-5 bg-[#1E45FB]/15 rounded-md"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 lg:pl-12">
                  <span className="text-[#1E45FB] font-black text-4xl sm:text-6xl opacity-20 mb-2 sm:mb-4 block">{t.productExperience.stage1Num}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2 sm:mb-4">{t.productExperience.stage1Title}</h3>
                  <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-medium">{t.productExperience.stage1Desc}</p>
                </div>
              </div>

              {/* Stage 2: Scan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="lg:pr-12 text-left lg:text-right">
                  <span className="text-[#1E45FB] font-black text-4xl sm:text-6xl opacity-20 mb-2 sm:mb-4 block">{t.productExperience.stage2Num}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2 sm:mb-4">{t.productExperience.stage2Title}</h3>
                  <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-medium">{t.productExperience.stage2Desc}</p>
                </div>
                <div className="bg-[#1E45FB] rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative z-10 transform transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                    {/* Viewfinder Target Brackets */}
                    <div className="absolute top-2.5 left-2.5 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-l-2 border-[#1E45FB] rounded-tl-sm"></div>
                    <div className="absolute top-2.5 right-2.5 w-4 sm:w-5 h-4 sm:h-5 border-t-2 border-r-2 border-[#1E45FB] rounded-tr-sm"></div>
                    <div className="absolute bottom-2.5 left-2.5 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-l-2 border-[#1E45FB] rounded-bl-sm"></div>
                    <div className="absolute bottom-2.5 right-2.5 w-4 sm:w-5 h-4 sm:h-5 border-b-2 border-r-2 border-[#1E45FB] rounded-br-sm"></div>

                    {/* Laser Scanning Line */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#1E45FB] to-transparent shadow-[0_0_12px_#1E45FB] animate-scan-laser pointer-events-none z-20"></div>

                    <QrCode className="w-28 h-28 sm:w-40 sm:h-40 text-[#111111]" />
                    <div className="absolute -inset-4 border-2 border-white/20 rounded-2xl sm:rounded-[2.5rem] animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Stage 3: Explore */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-2 lg:order-1 bg-[#F8F8F8] border border-[#E5E5E5] rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-inner overflow-hidden flex justify-center">
                   <div className="w-[240px] xs:w-[260px] sm:w-[280px] h-[460px] sm:h-[540px] bg-[#111111] rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-[#111111] shadow-2xl overflow-hidden relative transform transition-transform hover:scale-[1.01] duration-300">
                    <div className="w-full h-full bg-white flex flex-col">
                       <div className="bg-[#CDF22B] px-3 sm:px-4 py-6 sm:py-8 text-[#111111]">
                         <h4 className="font-black text-lg sm:text-xl truncate">{t.hero.sampleRestaurant}</h4>
                         <p className="text-[10px] sm:text-xs font-semibold opacity-80 mt-1">Yangon, Myanmar</p>
                       </div>
                       <div className="p-3 sm:p-4 flex-1 bg-white space-y-3 sm:space-y-4">
                         <div className="h-8 sm:h-10 bg-[#F5F5F5] rounded-lg sm:rounded-xl w-full"></div>
                         <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                           {[1, 2, 3, 4].map((i) => (
                             <div key={i} className="border border-[#E5E5E5] rounded-lg sm:rounded-xl overflow-hidden">
                               <div className="h-14 sm:h-20 bg-[#FAFAFA]"></div>
                               <div className="p-1.5 sm:p-2 space-y-1.5 sm:space-y-2">
                                 <div className="h-2.5 sm:h-3 bg-[#111111] rounded w-3/4"></div>
                                 <div className="h-2.5 sm:h-3 bg-[#1E45FB]/20 rounded w-1/2"></div>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>
                   </div>
                </div>
                <div className="order-1 lg:order-2 lg:pl-12">
                  <span className="text-[#1E45FB] font-black text-4xl sm:text-6xl opacity-20 mb-2 sm:mb-4 block">{t.productExperience.stage3Num}</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-2 sm:mb-4">{t.productExperience.stage3Title}</h3>
                  <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-medium">{t.productExperience.stage3Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BUILT FOR MYANMAR RESTAURANTS */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#1E45FB] px-4 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="mb-5 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#CDF22B] backdrop-blur-sm border border-white/10">
                  <Globe2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {t.localContext.badge}
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-6 sm:mb-8 leading-tight">
                  {t.localContext.title}
                </h2>
                <div className="space-y-4 sm:space-y-5">
                  {t.localContext.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4 text-sm sm:text-lg text-blue-50 font-medium">
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#CDF22B] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#111111] stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-auto py-8 sm:h-[480px] w-full rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-white/10 p-4 sm:p-6 flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E45FB] to-blue-900 opacity-50 mix-blend-multiply pointer-events-none"></div>
                <div className="relative z-10 space-y-4 max-w-md mx-auto w-full">
                   <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl transform -rotate-1 sm:-rotate-2">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-[#111111] text-base sm:text-lg">{t.localContext.sampleItem1Name}</h4>
                       <span className="bg-[#CDF22B] text-[#111111] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-full uppercase">{t.localContext.sampleItem1Badge}</span>
                     </div>
                     <p className="text-[#888888] text-xs sm:text-sm mb-3 sm:mb-4">{t.localContext.sampleItem1Burmese}</p>
                     <div className="flex justify-between items-center border-t border-[#E5E5E5] pt-3 sm:pt-4 mt-2">
                       <span className="text-xs text-[#888888] line-through">{t.localContext.sampleItem1OldPrice}</span>
                       <span className="font-black text-[#1E45FB] text-base sm:text-lg">{t.localContext.sampleItem1Price}</span>
                     </div>
                   </div>
                   <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl transform rotate-1 sm:rotate-2">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold text-[#111111] text-base sm:text-lg">{t.localContext.sampleItem2Name}</h4>
                       <span className="bg-blue-100 text-[#1E45FB] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-full uppercase">{t.localContext.sampleItem2Badge}</span>
                     </div>
                     <p className="text-[#888888] text-xs sm:text-sm mb-3 sm:mb-4">{t.localContext.sampleItem2Burmese}</p>
                     <div className="flex justify-between items-center border-t border-[#E5E5E5] pt-3 sm:pt-4 mt-2">
                       <span></span>
                       <span className="font-black text-[#1E45FB] text-base sm:text-lg">{t.localContext.sampleItem2Price}</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SHOW THE CUSTOMER EXPERIENCE */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5] overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mb-3 sm:mb-4 leading-snug">
                {t.digitalFrontDoor.title}
              </h2>
              <p className="text-base sm:text-lg text-[#666666] font-medium">{t.digitalFrontDoor.description}</p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#CDF22B] via-[#1E45FB] to-[#CDF22B] -translate-y-1/2 rounded-full opacity-20 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
                {t.digitalFrontDoor.steps.map((item, i) => {
                  const icons = [QrCode, Smartphone, Star, UtensilsCrossed, ShoppingBag];
                  const IconComponent = icons[i] || QrCode;
                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center group bg-white sm:bg-transparent p-5 sm:p-0 rounded-2xl sm:rounded-none border sm:border-0 border-[#E5E5E5]">
                      <div className="h-16 w-16 sm:h-24 sm:w-24 bg-white rounded-full shadow-md sm:shadow-xl border border-[#E5E5E5] flex items-center justify-center mb-4 sm:mb-6 transform transition-transform group-hover:-translate-y-1 sm:group-hover:-translate-y-2 group-hover:border-[#1E45FB] duration-300 relative">
                        <IconComponent className="h-7 w-7 sm:h-10 sm:w-10 text-[#111111] group-hover:text-[#1E45FB] transition-colors" />
                        <div className="absolute inset-0 bg-[#CDF22B]/20 rounded-full scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl -z-10"></div>
                      </div>
                      <p className="text-[#1E45FB] font-bold text-xs uppercase tracking-widest mb-1 sm:mb-2">{item.step}</p>
                      <h4 className="text-sm sm:text-base font-bold text-[#111111] text-center">{item.title}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 7. PRO - Sell the Experience */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl">
            <div className="bg-[#111111] rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E45FB] rounded-full blur-[120px] opacity-20 -mr-72 -mt-72 pointer-events-none"></div>
              
              <div className="lg:w-1/2 relative z-10 w-full">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 sm:mb-8 leading-tight">
                  {t.proShowcase.title}
                </h2>
                <ul className="space-y-3.5 sm:space-y-5">
                  {t.proShowcase.points.map((item, i) => (
                    <li key={i} className="flex items-start sm:items-center gap-3 sm:gap-4 text-base sm:text-lg text-white font-semibold">
                      <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#CDF22B] shrink-0 mt-2 sm:mt-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-1/2 relative z-10 w-full flex justify-center">
                 <div className="w-full max-w-[260px] xs:max-w-[280px] sm:max-w-[300px] h-[480px] sm:h-[560px] bg-black rounded-[2.5rem] sm:rounded-[3.5rem] border-[6px] sm:border-[10px] border-black shadow-2xl relative overflow-hidden">
                   <div className="w-full h-full bg-[#FAFAFA] flex flex-col relative">
                     <div className="h-28 sm:h-36 bg-[#111111] absolute top-0 inset-x-0"></div>
                     <div className="relative z-10 px-4 sm:px-5 pt-8 sm:pt-12 pb-4 sm:pb-6 text-white bg-gradient-to-b from-black/80 to-transparent">
                       <h4 className="font-black text-xl sm:text-2xl">{t.proShowcase.previewTitle}</h4>
                     </div>
                     <div className="px-3 sm:px-4 py-3 sm:py-4 relative z-10 -mt-6 sm:-mt-8">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-[#E5E5E5] mb-3 sm:mb-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-[#CDF22B] text-[#111111] text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-bl-xl">{t.proShowcase.featuredBadge}</div>
                          <div className="h-22 sm:h-28 bg-gray-100 rounded-lg sm:rounded-xl mb-2 sm:mb-3 flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                          </div>
                          <h5 className="font-bold text-sm sm:text-base text-[#111111]">{t.proShowcase.sampleDishName}</h5>
                          <p className="text-[11px] sm:text-xs text-[#888888] mb-1.5 sm:mb-2">{t.proShowcase.sampleDishDesc}</p>
                          <p className="font-black text-[#1E45FB] text-sm sm:text-base">{t.proShowcase.sampleDishPrice}</p>
                        </div>
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 border border-[#E5E5E5] flex gap-3 sm:gap-4">
                           <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                             <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h5 className="font-bold text-xs sm:text-sm text-[#111111] truncate">{t.proShowcase.sampleDish2Name}</h5>
                             <p className="font-black text-[#1E45FB] text-xs sm:text-sm mt-1 sm:mt-2">{t.proShowcase.sampleDish2Price}</p>
                           </div>
                        </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. PRICING - Mobile Friendly */}
        <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">{t.pricing.title}</h2>
              <p className="mt-2.5 sm:mt-3 text-base sm:text-lg text-[#666666] font-medium">{t.pricing.subTitle}</p>
            </div>

            <div className="mb-8 sm:mb-10 flex justify-center">
               <div className="bg-white p-1 rounded-full border border-[#E5E5E5] inline-flex shadow-sm">
                 <button 
                   onClick={() => setBilling("6months")}
                   className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors ${billing === "6months" ? "bg-[#111111] text-white" : "text-[#666666] hover:text-[#111111]"}`}
                 >
                   {t.pricing.toggle6Months}
                 </button>
                 <button 
                   onClick={() => setBilling("yearly")}
                   className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 sm:gap-2 ${billing === "yearly" ? "bg-[#111111] text-white" : "text-[#666666] hover:text-[#111111]"}`}
                 >
                   {t.pricing.toggleYearly}
                   <span className="bg-[#CDF22B] text-[#111111] text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold">{t.pricing.saveBadge}</span>
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* FREE */}
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-[#E5E5E5] shadow-sm hover:shadow-xl transition-shadow">
                <h3 className="text-xl sm:text-2xl font-black text-[#111111] mb-1 sm:mb-2">{t.pricing.freePlan}</h3>
                <p className="text-xs sm:text-sm text-[#888888] font-medium mb-6 sm:mb-8">{t.pricing.freeSub}</p>
                <div className="text-4xl sm:text-5xl font-black text-[#111111] mb-6 sm:mb-8">{t.pricing.freePrice} <span className="text-lg sm:text-xl text-[#888888] font-semibold">{t.pricing.freeCurrency}</span></div>
                <div className="h-px bg-[#E5E5E5] w-full mb-6 sm:mb-8"></div>
                <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-xl font-bold text-[#111111] mb-6 sm:mb-8">
                  <UtensilsCrossed className="text-[#1E45FB] h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                  <span>{t.pricing.freeItems}</span>
                </div>
                <Link href="/auth/sign-up" className="block w-full py-3.5 sm:py-4 text-center rounded-xl bg-[#F5F5F5] text-sm sm:text-base text-[#111111] font-bold hover:bg-[#E5E5E5] transition-colors">
                  {t.pricing.freeCta}
                </Link>
              </div>

              {/* PRO */}
              <div className="bg-[#111111] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative md:scale-105 border border-[#333333]">
                <div className="absolute top-0 right-0 bg-[#CDF22B] text-[#111111] text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-bl-xl sm:rounded-bl-2xl rounded-tr-2xl sm:rounded-tr-[2.5rem] uppercase tracking-widest">
                  {t.pricing.proRecommended}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">{t.pricing.proPlan}</h3>
                <p className="text-xs sm:text-sm text-[#AAAAAA] font-medium mb-6 sm:mb-8">{t.pricing.proSub}</p>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 sm:mb-2">
                  {billing === "yearly" ? t.pricing.proPriceYearly : t.pricing.proPrice6Months} 
                  <span className="text-lg sm:text-xl text-[#888888] font-semibold"> {t.pricing.freeCurrency}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#888888] mb-6">{billing === "yearly" ? t.pricing.proPerYear : t.pricing.proPer6Months}</p>
                <div className="h-px bg-[#333333] w-full mb-6 sm:mb-8"></div>
                <div className="flex items-center gap-3 sm:gap-4 text-base sm:text-xl font-bold text-white mb-6 sm:mb-8">
                  <UtensilsCrossed className="text-[#CDF22B] h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                  <span>{t.pricing.proItems}</span>
                </div>
                <Link href="/auth/sign-up" className="block w-full py-3.5 sm:py-4 text-center rounded-xl bg-[#1E45FB] text-sm sm:text-base text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#1E45FB]/25">
                  {t.pricing.proCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SOCIAL PROOF / TRUST */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mb-10 sm:mb-16 leading-snug">
              {t.trustStats.title}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
              {[
                { label: t.trustStats.stat1Label, value: t.trustStats.stat1Val },
                { label: t.trustStats.stat2Label, value: t.trustStats.stat2Val },
                { label: t.trustStats.stat3Label, value: t.trustStats.stat3Val },
                { label: t.trustStats.stat4Label, value: t.trustStats.stat4Val }
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F8F8] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#E5E5E5]">
                   <p className="text-[10px] sm:text-xs text-[#888888] font-semibold uppercase tracking-wider mb-1.5 sm:mb-2">{item.label}</p>
                   <p className="text-sm sm:text-lg font-bold text-[#111111]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />

        {/* 10. FINAL CTA */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl bg-[#CDF22B] rounded-2xl sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-[#D9FA3A]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4)_0,transparent_50%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111111] tracking-tight mb-4 sm:mb-6 leading-tight">
                {t.cta.title}
              </h2>
              
              <p className="mx-auto max-w-2xl text-base sm:text-xl text-[#111111]/80 font-medium mb-8 sm:mb-12">
                {t.cta.description}
              </p>
              
              <Link
                href="/auth/sign-up"
                className="group inline-flex min-h-[3.5rem] sm:min-h-[4rem] items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-[#111111] px-8 sm:px-10 text-base sm:text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:bg-[#222222]"
              >
                {t.cta.startFree}
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1 text-[#CDF22B]" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E5E5] bg-white px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 font-black text-[#111111] text-lg sm:text-xl">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#1E45FB] text-white">
                  <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span>Menuu</span>
              </Link>
              <p className="mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm leading-5 sm:leading-6 text-[#888888] font-medium">
                {t.footer.description}
              </p>
              <div className="mt-5 sm:mt-6 flex gap-3">
                <Link href={process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL || "#"} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F8F8F8] text-[#111111] transition-colors hover:bg-[#1E45FB] hover:text-white border border-[#E5E5E5]" aria-label="Facebook Page">
                  <Share2 className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-4 sm:mb-6 text-xs font-bold uppercase tracking-widest text-[#111111]">{t.footer.product}</p>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#888888] font-medium">
                <li><Link href="#how-it-works" className="hover:text-[#1E45FB] transition-colors">{t.nav.howItWorks}</Link></li>
                <li><Link href="#pricing" className="hover:text-[#1E45FB] transition-colors">{t.nav.pricing}</Link></li>
                <li><Link href="#faq" className="hover:text-[#1E45FB] transition-colors">{t.nav.faq}</Link></li>
                <li><Link href="/menu" target="_blank" className="hover:text-[#1E45FB] transition-colors flex items-center gap-1.5">{t.hero.viewDemo} <ExternalLink className="h-3 w-3" /></Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 sm:mb-6 text-xs font-bold uppercase tracking-widest text-[#111111]">{t.footer.account}</p>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-[#888888] font-medium">
                <li><Link href="/auth/login" className="hover:text-[#1E45FB] transition-colors">{t.nav.login}</Link></li>
                <li><Link href="/auth/sign-up" className="hover:text-[#1E45FB] transition-colors">{t.nav.getStarted}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col gap-3 sm:gap-4 border-t border-[#E5E5E5] pt-6 sm:pt-8 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
            <p className="text-[#888888] font-medium">
              &copy; 2026 {t.footer.copyright}
            </p>
            <p className="text-[#888888] font-medium">
              {t.footer.madeFor}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}