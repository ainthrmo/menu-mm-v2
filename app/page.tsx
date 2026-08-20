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
        {/* 1. HERO - Option 3: Crisp Premium Light Theme with Radial Highlights */}
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
                  {t.hero.titleLine1 || "Stop reprinting menus."}<br />
                  <span className="text-[#1E45FB]">{t.hero.titleHighlight || "Update live in seconds."}</span>
                </h1>

                <p className="mx-auto lg:mx-0 mt-4 sm:mt-5 max-w-xl text-base leading-relaxed text-[#555555] sm:text-lg lg:text-xl font-medium">
                  {t.hero.titleLine3 || "Prices change. Your menu should too — instantly on every diner's phone with zero app downloads."}
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
                    href="#how-it-works"
                    className="inline-flex min-h-[3.25rem] sm:min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] bg-white px-7 sm:px-8 text-base font-bold text-[#111111] shadow-sm transition-all duration-300 hover:border-[#1E45FB] hover:text-[#1E45FB] hover:bg-[#EEF2FF]/50"
                  >
                    {t.hero.seeHowItWorks || "See How It Works"}
                  </Link>
                </div>
              </div>

              {/* Hero Visual Composition - Responsive & Scaled */}
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none flex items-center justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#1E45FB]/5 rounded-full blur-3xl pointer-events-none"></div>
                
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

        {/* 2. HOW IT WORKS (3-STEP SECTION) */}
        <section id="how-it-works" className="py-10 sm:py-16 lg:py-20 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#1E45FB]/20 mb-2 inline-block">
                {t.howItWorksSection?.eyebrow || "3 Simple Steps"}
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#111111] tracking-tight leading-snug">
                {t.howItWorksSection?.title || "How Menuu Works"}
              </h2>
              <p className="mt-1.5 text-xs sm:text-base text-[#666666] font-medium">
                {t.howItWorksSection?.subTitle || "Get your digital menu up and running in 3 easy steps."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  num: t.howItWorksSection?.step1Num || "01",
                  tag: t.howItWorksSection?.step1Tag || "CREATE",
                  title: t.howItWorksSection?.step1Title || "Create Your Menu",
                  desc: t.howItWorksSection?.step1Desc || "Set up your restaurant account and digital menu in under 5 minutes.",
                  icon: UtensilsCrossed,
                  color: "bg-[#1E45FB] text-white"
                },
                {
                  num: t.howItWorksSection?.step2Num || "02",
                  tag: t.howItWorksSection?.step2Tag || "CUSTOMIZE",
                  title: t.howItWorksSection?.step2Title || "Add Categories & Dishes",
                  desc: t.howItWorksSection?.step2Desc || "Add your categories, dishes, prices, descriptions, and food photos.",
                  icon: RefreshCw,
                  color: "bg-[#111111] text-white"
                },
                {
                  num: t.howItWorksSection?.step3Num || "03",
                  tag: t.howItWorksSection?.step3Tag || "SHARE",
                  title: t.howItWorksSection?.step3Title || "Place Your QR Code",
                  desc: t.howItWorksSection?.step3Desc || "Let customers scan your permanent QR code and view your menu instantly.",
                  icon: QrCode,
                  color: "bg-[#CDF22B] text-[#111111]"
                }
              ].map((step, i) => (
                <div key={i} className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden group hover:border-[#1E45FB]/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-9 w-9 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shadow-sm ${step.color}`}>
                        <step.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-[#1E45FB]/30 group-hover:text-[#1E45FB] transition-colors">{step.num}</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-white border border-[#E5E5E5] px-2.5 py-0.5 rounded-full text-[#666666]">{step.tag}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#111111] mb-1 sm:mb-1.5">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#666666] font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. VALUE PROPOSITION */}
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E45FB] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-[#1E45FB]/20 mb-3 inline-block">
                {t.valuePropSection?.eyebrow || "Why Menuu"}
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight leading-snug">
                {t.valuePropSection?.title || "Built for restaurants that want a simpler menu."}
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#666666] font-medium">
                {t.valuePropSection?.subTitle || "Everything you need to give your guests a modern, effortless dining experience."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: t.valuePropSection?.feat1Title || "No App Required",
                  desc: t.valuePropSection?.feat1Desc || "Customers scan and view directly in their phone browser without downloading anything.",
                  icon: Smartphone,
                },
                {
                  title: t.valuePropSection?.feat2Title || "1-Click Menu Updates",
                  desc: t.valuePropSection?.feat2Desc || "Update dish prices or toggle sold-out items instantly from your phone.",
                  icon: RefreshCw,
                },
                {
                  title: t.valuePropSection?.feat3Title || "One Permanent QR Code",
                  desc: t.valuePropSection?.feat3Desc || "Never waste money reprinting paper menus or table cards when prices change.",
                  icon: QrCode,
                },
                {
                  title: t.valuePropSection?.feat4Title || "Beautiful Digital Experience",
                  desc: t.valuePropSection?.feat4Desc || "Clean, mobile-first design with dish photos, categories, and fast search.",
                  icon: UtensilsCrossed,
                },
                {
                  title: t.valuePropSection?.feat5Title || "Bilingual Support",
                  desc: t.valuePropSection?.feat5Desc || "Serve local and international guests with seamless Myanmar + English menus.",
                  icon: Globe2,
                },
                {
                  title: t.valuePropSection?.feat6Title || "Centralized Management",
                  desc: t.valuePropSection?.feat6Desc || "Manage all your categories, menu items, and store settings from one simple place.",
                  icon: Share2,
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-[#1E45FB] transition-all duration-300 hover:shadow-md">
                  <div className="h-12 w-12 rounded-xl bg-[#EEF2FF] text-[#1E45FB] flex items-center justify-center mb-5 font-bold">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#111111] mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-[#666666] font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SOCIAL PROOF / TRUST */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] tracking-tight mb-4 leading-snug">
              {t.trustStats.title}
            </h2>
            <p className="text-base sm:text-lg text-[#666666] font-medium max-w-2xl mx-auto mb-10 sm:mb-16">
              {t.trustStats.subTitle || "Built specifically for Myanmar restaurants, cafés, and tea shops ready to cut overhead."}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
              {[
                { label: t.trustStats.stat1Label, value: t.trustStats.stat1Val },
                { label: t.trustStats.stat2Label, value: t.trustStats.stat2Val },
                { label: t.trustStats.stat3Label, value: t.trustStats.stat3Val },
                { label: t.trustStats.stat4Label, value: t.trustStats.stat4Val }
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F8F8] p-5 sm:p-8 rounded-2xl border border-[#E5E5E5]">
                   <p className="text-[10px] sm:text-xs text-[#888888] font-bold uppercase tracking-wider mb-2">{item.label}</p>
                   <p className="text-base sm:text-xl font-black text-[#111111]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRICING - Mobile Friendly */}
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

        <FAQ />

        {/* 6. FINAL CTA */}
        <section className="py-16 sm:py-24 lg:py-32 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl bg-[#CDF22B] rounded-2xl sm:rounded-[3rem] p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-[#D9FA3A]">
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
                  <Facebook className="h-4 w-4" />
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