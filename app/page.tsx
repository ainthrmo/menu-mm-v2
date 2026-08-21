"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  Phone,
  MessageSquare,
  ChevronDown,
  QrCode,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LandingPage() {
  const { language, setLanguage, isMounted } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "6months">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactPhone = "+959969069005";
  const viberLink = "viber://chat?number=%2B959969069005";
  const telLink = "tel:+959969069005";

  const faqs = [
    {
      q: language === "my" ? "အင်တာနက်လိုင်း (MPT / Atom / Ooredoo) ဖြင့် အသုံးပြုနိုင်ပါသလား?" : "Does it load fast on Myanmar mobile data (MPT / Atom / Ooredoo)?",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ အလွန်မြန်ဆန်စွာ အသုံးပြုနိုင်ပါသည်။ Menuu သည် ပေါ့ပါးသော နည်းပညာဖြင့် တည်ဆောက်ထားသောကြောင့် 3G/4G လိုင်းမကောင်းသည့် အခြေအနေတွင်ပင် ၁ စက္ကန့်အတွင်း မီနူးပွင့်စေပါသည်။"
        : "Yes, Menuu is ultra-lightweight and optimized to open in under 1 second even on standard 3G/4G connections across Myanmar without lag."
    },
    {
      q: language === "my" ? "ဧည့်သည်များ App ဒေါင်းလုဒ်လုပ်ရန် လိုအပ်ပါသလား?" : "Do customers need to download any application?",
      a: language === "my"
        ? "လုံးဝမလိုပါ။ ဧည့်သည်များသည် ၎င်းတို့၏ ဖုန်းကင်မရာ (သို့မဟုတ် Viber/Facebook QR scanner) ဖြင့် စကင်ဖတ်ရုံဖြင့် Safari/Chrome browser တွင် ချက်ချင်းကြည့်ရှုနိုင်ပါသည်။"
        : "No app download or account creation required. Diners simply point their phone camera at the table QR code and the menu opens directly in Safari or Chrome."
    },
    {
      q: language === "my" ? "ဟင်းပွဲစျေးနှုန်းများကို အချိန်မရွေး ပြောင်းလဲနိုင်ပါသလား?" : "Can I update dish prices and availability in real time?",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ ဆိုင်ရှင်သည် မိမိဖုန်းထဲမှ ၅ စက္ကန့်အတွင်း စျေးနှုန်းပြင်ဆင်ခြင်း သို့မဟုတ် ကုန်သွားသော ဟင်းပွဲများကို ခေတ္တပိတ်ထားခြင်း ပြုလုပ်နိုင်ပါသည်။ စားပွဲတင် QR ကို ပြန်လည် Print ထုတ်ရန် မလိုပါ။"
        : "Yes! Update prices or mark dishes as sold-out from your phone in 5 seconds. The permanent table QR code updates automatically without reprinting."
    },
    {
      q: language === "my" ? "KBZPay / WavePay ဖြင့် ပေးချေနိုင်ပါသလား?" : "How can I pay for the Pro plan? (KBZPay / WavePay)",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ KBZPay, WavePay, AYA Pay နှင့် ဘဏ်အကောင့်လွှဲပြောင်းမှုများဖြင့် လွယ်ကူစွာ ပေးချေနိုင်ပါသည်။ ဖုန်းနံပါတ် +959969069005 (Viber) သို့ တိုက်ရိုက်ဆက်သွယ်၍ အလွယ်တကူ စတင်နိုင်ပါသည်။"
        : "We accept all local Myanmar payment methods including KBZPay, WavePay, AYA Pay, and bank transfers. You can contact +959969069005 anytime via Viber."
    },
  ];

  return (
    <div className="landing-root min-h-screen bg-[#0D120D] text-[#F2F0E6] font-sans selection:bg-[#C8FF4D] selection:text-[#0D120D] relative overflow-x-hidden">
      <style jsx global>{`
        :root {
          --bg: #0D120D;
          --bg-soft: #12160F;
          --card: #1A211A;
          --card-line: #2C3527;
          --lime: #C8FF4D;
          --lime-text: #C8FF4D;
          --ink: #F2F0E6;
          --sage: #93A38C;
          --muted: #66705F;
        }

        .display-font {
          font-family: var(--font-space-grotesk, 'Space Grotesk', system-ui, -apple-system, sans-serif);
        }

        .bg-glyph {
          position: fixed;
          top: -25%;
          right: -15%;
          width: 60vw;
          height: 60vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 255, 77, 0.06), transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        /* Phone Screen Animations */
        .screen-qr-anim {
          animation: qrOut 6s infinite;
        }
        .scan-line-anim {
          animation: scanMove 6s infinite;
        }
        .screen-menu-anim {
          opacity: 0;
          animation: menuIn 6s infinite;
        }

        @keyframes qrOut {
          0%, 28% { opacity: 1; }
          38%, 100% { opacity: 0; }
        }
        @keyframes scanMove {
          0% { top: 20%; }
          25% { top: 75%; }
          30%, 100% { top: 20%; opacity: 0; }
          26% { opacity: 1; }
        }
        @keyframes menuIn {
          0%, 32% { opacity: 0; transform: translateY(8px); }
          42%, 92% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .screen-qr-anim, .scan-line-anim, .screen-menu-anim {
            animation: none;
          }
          .screen-menu-anim {
            opacity: 1;
          }
          .screen-qr-anim {
            display: none;
          }
        }

        .liquid-pro::before {
          content: '';
          position: absolute;
          inset: -40%;
          background:
            radial-gradient(circle at 30% 30%, rgba(200, 255, 77, 0.14), transparent 55%),
            radial-gradient(circle at 75% 70%, rgba(255, 255, 255, 0.06), transparent 50%);
          filter: blur(24px);
          animation: liquidMove 10s ease-in-out infinite alternate;
          pointer-events: none;
        }

        @keyframes liquidMove {
          0% { transform: translate(-4%, -3%) scale(1); }
          100% { transform: translate(4%, 3%) scale(1.08); }
        }
      `}</style>

      {/* Ambient Radial Background */}
      <div className="bg-glyph" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 85% 0%, rgba(200,255,77,0.07), transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 100%, rgba(200,255,77,0.04), transparent 60%)
          `,
        }}
      />

      {/* TOP ANNOUNCEMENT STRIP (Direct Contact) */}
      <div className="relative z-30 bg-[#12160F] border-b border-[#2C3527]/70 py-1.5 px-4 text-center text-xs text-[#93A38C] flex items-center justify-center gap-4">
        <span>
          🇲🇲 {language === "my" ? "တိုက်ရိုက် အကူအညီနှင့် စုံစမ်းရန်:" : "Direct Support & Viber:"}{" "}
          <a
            href={viberLink}
            className="text-[#C8FF4D] font-bold hover:underline inline-flex items-center gap-1 ml-1"
          >
            <Phone className="w-3 h-3 inline" />
            {contactPhone}
          </a>
        </span>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="relative z-20 flex justify-between items-center px-[6vw] py-5 border-b border-[#2C3527]/40 bg-[#0D120D]/80 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-[#F2F0E6]">
          <span className="w-2.5 h-2.5 bg-[#C8FF4D] rounded-xs shadow-[0_0_8px_#C8FF4D]"></span>
          <span className="display-font tracking-tight text-xl font-bold">Menuu</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#93A38C]">
          <a href="#how" className="hover:text-[#F2F0E6] transition-colors">
            {language === "my" ? "အသုံးပြုပုံ" : "How it works"}
          </a>
          <a href="#pricing" className="hover:text-[#F2F0E6] transition-colors">
            {language === "my" ? "စျေးနှုန်းများ" : "Pricing"}
          </a>
          <a href="#faq" className="hover:text-[#F2F0E6] transition-colors">
            {language === "my" ? "မေးလေ့ရှိသောမေးခွန်းများ" : "FAQ"}
          </a>
          <Link href="/menu" target="_blank" className="hover:text-[#C8FF4D] transition-colors flex items-center gap-1.5">
            <span>{language === "my" ? "Demo မီနူး" : "Live Demo"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          {isMounted && (
            <div className="flex items-center gap-1 rounded-full border border-[#2C3527] bg-[#12160F] p-1 text-xs font-bold">
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === "en"
                    ? "bg-[#C8FF4D] text-[#0D120D]"
                    : "text-[#93A38C] hover:text-[#F2F0E6]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("my")}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === "my"
                    ? "bg-[#C8FF4D] text-[#0D120D]"
                    : "text-[#93A38C] hover:text-[#F2F0E6]"
                }`}
              >
                မြန်မာ
              </button>
            </div>
          )}

          <Link
            href="/auth/login"
            className="hidden sm:inline-block border border-[#2C3527] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm text-[#F2F0E6] hover:bg-[#1A211A] transition-colors"
          >
            {language === "my" ? "အကောင့်ဝင်ရန်" : "Log in"}
          </Link>

          <Link
            href="/auth/sign-up"
            className="hidden sm:inline-block bg-[#C8FF4D] text-[#0D120D] font-semibold px-4 py-1.5 rounded-lg text-xs sm:text-sm hover:brightness-105 transition-all shadow-[0_0_15px_rgba(200,255,77,0.2)]"
          >
            {language === "my" ? "အခမဲ့ စတင်ရန်" : "Start free"}
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[#2C3527] bg-[#12160F] text-[#F2F0E6]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[90px] bg-[#0D120D]/95 border-b border-[#2C3527] p-6 z-50 backdrop-blur-xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium">
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#93A38C] hover:text-[#C8FF4D] py-1"
            >
              {language === "my" ? "အသုံးပြုပုံ" : "How it works"}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#93A38C] hover:text-[#C8FF4D] py-1"
            >
              {language === "my" ? "စျေးနှုန်းများ" : "Pricing"}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#93A38C] hover:text-[#C8FF4D] py-1"
            >
              {language === "my" ? "မေးလေ့ရှိသောမေးခွန်းများ" : "FAQ"}
            </a>
            <Link
              href="/menu"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#C8FF4D] py-1 flex items-center gap-1.5"
            >
              <span>{language === "my" ? "Live Demo မီနူး စမ်းသပ်ရန်" : "Live Demo Menu"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#2C3527] flex flex-col gap-2.5">
            <Link
              href="/auth/sign-up"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center bg-[#C8FF4D] text-[#0D120D] font-bold py-2.5 rounded-xl text-sm"
            >
              {language === "my" ? "အခမဲ့ စတင်မည်" : "Start Free"}
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center border border-[#2C3527] text-[#F2F0E6] py-2.5 rounded-xl text-sm"
            >
              {language === "my" ? "အကောင့်ဝင်ရန်" : "Log in"}
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center px-[6vw] pt-10 sm:pt-14 pb-12 sm:pb-16 gap-10 lg:gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-[#C8FF4D] text-xs uppercase tracking-widest font-semibold mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-[#C8FF4D] rounded-full shadow-[0_0_6px_#C8FF4D]"></span>
            {language === "my" ? "မြန်မာနိုင်ငံရှိ စားသောက်ဆိုင်များအတွက် အထူးသင့်လျော်သည်" : "Built for Myanmar restaurants"}
          </div>

          <h1 className="display-font text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F2F0E6] leading-[1.08] max-w-xl">
            {language === "my" ? (
              <>
                မီနူးတစ်ခုတည်းဖြင့်။<br />
                ဘာသာစကားနှစ်မျိုးလုံး။<br />
                <span className="text-[#93A38C] font-normal text-[0.55em] block mt-3 font-sans">
                  မြန်မာ + English Bilingual Menu
                </span>
              </>
            ) : (
              <>
                One menu.<br />
                Both languages.<br />
                <span className="text-[#93A38C] font-normal text-[0.52em] block mt-3 font-sans">
                  Burmese &amp; English
                </span>
              </>
            )}
          </h1>

          <p className="text-[#93A38C] text-base sm:text-lg max-w-lg mt-5 mb-8 leading-relaxed">
            {language === "my"
              ? "ဧည့်သည်များ ဖုန်းဖြင့် Scan ဖတ်ရုံဖြင့် ချက်ချင်းကြည့်ရှုနိုင်သော Bilingual Menu။ App သီးသန့်ဒေါင်းလုဒ်လုပ်ရန် မလိုပါ။ စျေးနှုန်းများကို အချိန်မရွေး ဖုန်းထဲမှ အလွယ်တကူ ပြင်ဆင်နိုင်ပါသည်။"
              : "Set up a bilingual menu your guests can scan and read instantly — Burmese first, English if you need it. No app for them to install."}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-7">
            <Link
              href="/auth/sign-up"
              className="bg-[#C8FF4D] text-[#0D120D] font-semibold px-6 py-3 rounded-xl text-base hover:brightness-105 transition-all shadow-[0_0_20px_rgba(200,255,77,0.25)] inline-flex items-center gap-2"
            >
              <span>{language === "my" ? "အခမဲ့ စတင်မည်" : "Start free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              target="_blank"
              className="text-sm text-[#F2F0E6] border border-[#2C3527] bg-[#12160F] px-4 py-2.5 rounded-xl hover:border-[#C8FF4D] transition-colors inline-flex items-center gap-2"
            >
              <span>{language === "my" ? "Live Demo စမ်းသပ်ကြည့်ရန်" : "Try Live Demo"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C8FF4D]" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-[#66705F]">
            <span className="flex items-center gap-2">
              <span className="text-[#C8FF4D] font-bold">✓</span>{" "}
              {language === "my" ? "ဟင်းပွဲ ၂၀ အထိ အခမဲ့" : "Free for up to 20 dishes"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#C8FF4D] font-bold">✓</span>{" "}
              {language === "my" ? "Credit Card မလိုပါ" : "No card required to start"}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#C8FF4D] font-bold">✓</span>{" "}
              {language === "my" ? "၁၀ မိနစ်အတွင်း အသင့်သုံးနိုင်သည်" : "Live in under 10 minutes"}
            </span>
          </div>
        </div>

        {/* PHONE MOCKUP WITH SCAN ANIMATION & SCANNABLE QR */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="w-[270px] xs:w-[280px] h-[560px] bg-[#0A0E09] border-[6px] border-[#1B231A] rounded-[38px] shadow-[0_30px_90px_rgba(0,0,0,0.65)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#12160F]" />

            {/* Step 1 in Phone: Real Scannable QR Code Screen */}
            <div className="screen-qr-anim absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-44 h-44 bg-[#F2F0E6] rounded-2xl p-3.5 shadow-2xl flex items-center justify-center">
                <QRCodeSVG
                  value="https://my-qr-saas.vercel.app/menu"
                  size={148}
                  level="M"
                  fgColor="#0D120D"
                  bgColor="#F2F0E6"
                />
                {/* Animated Scan Line */}
                <div className="scan-line-anim absolute left-[8%] right-[8%] h-0.5 bg-[#C8FF4D] shadow-[0_0_12px_#C8FF4D]" />
              </div>
              <p className="text-[11px] text-[#93A38C] mt-4 font-mono tracking-wider">
                SCAN WITH PHONE CAMERA
              </p>
            </div>

            {/* Step 2 in Phone: Live Menu Screen with Real Burmese Dishes */}
            <div className="screen-menu-anim absolute inset-0 p-5 pt-7 flex flex-col">
              <div className="text-[10px] text-[#93A38C] uppercase tracking-wider mb-1">
                Golden Spoon • Yangon
              </div>
              <div className="display-font font-bold text-lg text-[#F2F0E6] mb-4 flex items-center justify-between">
                <span>{language === "my" ? "အစားအသောက် မီနူး" : "Full Menu"}</span>
                <span className="text-[9px] bg-[#1A211A] text-[#C8FF4D] border border-[#2C3527] px-2 py-0.5 rounded-full">
                  Table #04
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-0.5">
                {/* Dish 1 */}
                <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.015] backdrop-blur-md border border-white/[0.09] border-t-white/[0.18] rounded-xl p-3 shadow-lg">
                  <div className="float-right text-[#C8FF4D] text-xs font-bold">
                    4,500 K
                  </div>
                  <div className="text-sm font-semibold text-[#F2F0E6] flex items-center gap-1.5">
                    <span>ခေါက်ဆွဲကြော်</span>
                    <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded">⭐ POPULAR</span>
                  </div>
                  <div className="text-[10px] text-[#93A38C]">
                    Fried Noodles (Chicken / Pork)
                  </div>
                </div>

                {/* Dish 2 */}
                <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.015] backdrop-blur-md border border-white/[0.09] border-t-white/[0.18] rounded-xl p-3 shadow-lg">
                  <div className="float-right text-[#C8FF4D] text-xs font-bold">
                    3,000 K
                  </div>
                  <div className="text-sm font-semibold text-[#F2F0E6]">
                    မုန့်ဟင်းခါး
                  </div>
                  <div className="text-[10px] text-[#93A38C]">
                    Traditional Burmese Mohinga
                  </div>
                </div>

                {/* Dish 3 */}
                <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.015] backdrop-blur-md border border-white/[0.09] border-t-white/[0.18] rounded-xl p-3 shadow-lg">
                  <div className="float-right text-[#C8FF4D] text-xs font-bold">
                    5,000 K
                  </div>
                  <div className="text-sm font-semibold text-[#F2F0E6]">
                    ကြက်သားဟင်း
                  </div>
                  <div className="text-[10px] text-[#93A38C]">
                    Burmese Chicken Curry
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-[#2C3527] text-center">
                <span className="text-[10px] text-[#93A38C] bg-[#1A211A] px-3 py-1 rounded-full border border-[#2C3527]">
                  ✓ 100% Live Sync • No App Needed
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#93A38C] mt-3 font-mono">
            {language === "my" ? "စမ်းသပ်ရန် ကင်မရာဖြင့် scan ဖတ်နိုင်ပါသည်" : "Scan to test live on your phone"}
          </p>
        </div>
      </section>

      {/* REASSURANCE STRIP */}
      <div className="relative z-10 border-y border-[#2C3527] py-4 px-[6vw] flex justify-center gap-8 sm:gap-12 flex-wrap text-xs text-[#93A38C] bg-[#12160F]">
        <span>✦ {language === "my" ? "စတင်ခ မလိုပါ" : "No setup fees"}</span>
        <span>✦ {language === "my" ? "အချိန်မရွေး ပယ်ဖျက်နိုင်သည်" : "Cancel anytime"}</span>
        <span>✦ {language === "my" ? "သင့်ဒေတာများ လုံခြုံစိတ်ချရသည်" : "Your data stays yours"}</span>
        <span>✦ {language === "my" ? "မည်သည့်ဖုန်းကင်မရာဖြင့်မဆို ဖတ်နိုင်သည်" : "Works on any phone camera"}</span>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 py-20 px-[6vw] max-w-7xl mx-auto">
        <div className="text-[#C8FF4D] text-xs uppercase tracking-widest font-semibold mb-3">
          {language === "my" ? "အသုံးပြုပုံ" : "How it works"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl font-semibold text-[#F2F0E6] mb-12 sm:mb-14 max-w-md leading-snug">
          {language === "my" ? "အဆင့် ၃ ဆင့်ဖြင့် အလွယ်တကူ စတင်လိုက်ပါ။" : "Three steps, no technical setup."}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12160F]/60 border border-[#2C3527] rounded-2xl p-7 hover:border-[#C8FF4D]/40 transition-colors">
            <div className="display-font text-base text-[#C8FF4D] font-bold mb-3">01</div>
            <h3 className="text-lg font-semibold text-[#F2F0E6] mb-2">
              {language === "my" ? "ဟင်းပွဲများကို ထည့်သွင်းပါ" : "Add your dishes"}
            </h3>
            <p className="text-sm text-[#93A38C] leading-relaxed">
              {language === "my"
                ? "ဟင်းပွဲအမည်များကို မြန်မာလို အလွယ်တကူထည့်နိုင်ပြီး English ဘာသာလည်း ထည့်သွင်းနိုင်ပါသည်။ အမျိုးအစားအလိုက် ခွဲခြားနိုင်ပါသည်။"
                : "Enter names in Burmese — English is optional. Organize into categories as you go."}
            </p>
          </div>

          <div className="bg-[#12160F]/60 border border-[#2C3527] rounded-2xl p-7 hover:border-[#C8FF4D]/40 transition-colors">
            <div className="display-font text-base text-[#C8FF4D] font-bold mb-3">02</div>
            <h3 className="text-lg font-semibold text-[#F2F0E6] mb-2">
              {language === "my" ? "သင့် QR Code ကို ရယူပါ" : "Get your QR code"}
            </h3>
            <p className="text-sm text-[#93A38C] leading-relaxed">
              {language === "my"
                ? "သင့်ဆိုင် Logo ပါဝင်သော စားပွဲတင် QR Code ကို download ရယူပြီး Print ထုတ်လိုက်ပါ။"
                : "Download it with your restaurant's logo already placed in the center."}
            </p>
          </div>

          <div className="bg-[#12160F]/60 border border-[#2C3527] rounded-2xl p-7 hover:border-[#C8FF4D]/40 transition-colors">
            <div className="display-font text-base text-[#C8FF4D] font-bold mb-3">03</div>
            <h3 className="text-lg font-semibold text-[#F2F0E6] mb-2">
              {language === "my" ? "ဧည့်သည်များ စကင်ဖတ်နိုင်ပြီ" : "Guests scan and read"}
            </h3>
            <p className="text-sm text-[#93A38C] leading-relaxed">
              {language === "my"
                ? "App ဒေါင်းရန်မလိုဘဲ ဖုန်းကင်မရာဖြင့် scan ဖတ်လိုက်သည်နှင့် မီနူးတန်းပွင့်လာပါမည်။"
                : "No app to install. The menu opens straight in their phone's browser."}
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER / MISSION NOTE */}
      <section className="relative z-10 py-6 px-[6vw] max-w-7xl mx-auto">
        <div className="bg-[#12160F] border border-[#2C3527] rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-2 flex justify-start">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#26301F] to-[#161D15] border border-[#2C3527] flex items-center justify-center text-[#C8FF4D] font-bold text-lg">
              M
            </div>
          </div>
          <div className="md:col-span-10">
            <blockquote className="text-base sm:text-lg leading-relaxed text-[#F2F0E6] font-normal">
              {language === "my"
                ? "“ကျွန်တော်တို့ Menuu ကို ဖန်တီးရတဲ့ ရည်ရွယ်ချက်ကတော့ လက်ရှိ menu tools အများစုဟာ မြန်မာစာအတွက် သီးသန့်ရည်ရွယ်မထားတာကြောင့် ဖြစ်ပါတယ်။ ဆိုင်ရှင်ကိုယ်တိုင် မိနစ်ပိုင်းအတွင်း အကူအညီမလိုဘဲ လွယ်လွယ်ကူကူ အသုံးပြုနိုင်စေချင်ပါတယ်။”"
                : "“We built Menuu because most menu tools weren't made with Burmese in mind — the language always felt like an afterthought. We wanted restaurant owners to set one up themselves, in minutes, without needing anyone's help.”"}
              <cite className="block mt-4 not-italic text-xs text-[#93A38C] font-mono">
                — From the team building Menuu (Yangon)
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* PRICING SECTION WITH BILLING TOGGLE */}
      <section id="pricing" className="relative z-10 py-20 px-[6vw] max-w-7xl mx-auto">
        <div className="text-[#C8FF4D] text-xs uppercase tracking-widest font-semibold mb-3">
          {language === "my" ? "စျေးနှုန်းများ" : "Pricing"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl font-semibold text-[#F2F0E6] mb-6 leading-snug">
          {language === "my" ? "ရှင်းလင်းပြီး ပွင့်လင်းမြင်သာသော စျေးနှုန်း။" : "Simple pricing, shown upfront."}
        </h2>

        {/* Toggle */}
        <div className="mb-10 inline-flex items-center gap-2 bg-[#12160F] p-1.5 rounded-full border border-[#2C3527]">
          <button
            onClick={() => setBillingPeriod("6months")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              billingPeriod === "6months"
                ? "bg-[#C8FF4D] text-[#0D120D]"
                : "text-[#93A38C] hover:text-[#F2F0E6]"
            }`}
          >
            {language === "my" ? "၆ လ တစ်ကြိမ်" : "6 Months"}
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingPeriod === "yearly"
                ? "bg-[#C8FF4D] text-[#0D120D]"
                : "text-[#93A38C] hover:text-[#F2F0E6]"
            }`}
          >
            <span>{language === "my" ? "၁ နှစ်စာ (အထူးသက်သာ)" : "1 Year (Save)"}</span>
            <span className="bg-[#0D120D] text-[#C8FF4D] text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
              15% OFF
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {/* Free Plan */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.015] backdrop-blur-xl border border-white/[0.09] border-t-white/[0.18] rounded-2xl p-8 sm:p-9 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs text-[#93A38C] uppercase tracking-wider mb-2 font-semibold">
                Free Plan
              </div>
              <div className="display-font text-4xl font-bold text-[#F2F0E6] mb-1">
                0 K <span className="text-sm font-normal text-[#66705F]">/ forever</span>
              </div>
              <p className="text-sm text-[#93A38C] mb-6">
                {language === "my" ? "ပထမဆုံး ဒစ်ဂျစ်တယ် မီနူး စမ်းသပ်စတင်ရန်။" : "For getting your first menu online."}
              </p>

              <ul className="space-y-3 text-sm text-[#F2F0E6] mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "ဟင်းပွဲ ၂၀ အထိ" : "Up to 20 dishes"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "ဘာသာစကားနှစ်မျိုး (MM / EN)" : "Bilingual menu (MM/EN)"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "Logo ပါဝင်သော စားပွဲတင် QR Code" : "QR code with your logo"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "အကန့်အသတ်မရှိ စကင်ဖတ်နိုင်ခြင်း" : "Unlimited customer scans"}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              className="block text-center py-3 rounded-xl border border-[#2C3527] text-sm font-semibold hover:bg-[#1A211A] transition-colors"
            >
              {language === "my" ? "အခမဲ့ စတင်မည်" : "Start free"}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="liquid-pro relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-[#C8FF4D]/[0.03] backdrop-blur-2xl border border-[#C8FF4D]/30 border-t-[#C8FF4D]/50 rounded-2xl p-8 sm:p-9 shadow-[0_16px_40px_rgba(0,0,0,0.45)] flex flex-col justify-between">
            <div className="relative z-10">
              <div className="inline-block bg-[#C8FF4D]/15 text-[#C8FF4D] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#C8FF4D]/30 mb-4">
                {language === "my" ? "အထူးနှုန်းထား" : "Founding rate"}
              </div>
              <div className="text-xs text-[#93A38C] uppercase tracking-wider mb-2 font-semibold">
                Pro Plan
              </div>
              <div className="display-font text-4xl font-bold text-[#F2F0E6] mb-1">
                {billingPeriod === "yearly" ? "50,000 K" : "30,000 K"}{" "}
                <span className="text-sm font-normal text-[#66705F]">
                  {billingPeriod === "yearly" ? "/ year" : "/ 6 months"}
                </span>
              </div>
              <p className="text-sm text-[#93A38C] mb-6">
                {language === "my"
                  ? "ဟင်းပွဲစာရင်းများပြားသော စားသောက်ဆိုင်ကြီးများအတွက်။"
                  : "For restaurants with a bigger menu. KBZPay / WavePay accepted."}
              </p>

              <ul className="space-y-3 text-sm text-[#F2F0E6] mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "ဟင်းပွဲ ၁၀၀ အထိ" : "Up to 100 dishes"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "Free တွင်ပါဝင်သော အရာအားလုံး" : "Everything in Free"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>{language === "my" ? "ဟင်းပွဲ ဓာတ်ပုံများ ထည့်သွင်းနိုင်ခြင်း" : "High-res food photos"}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#C8FF4D]">✓</span>
                  <span>
                    {language === "my" ? "တိုက်ရိုက် Viber / Phone အကူအညီ (+959969069005)" : "Direct Priority Support (+959969069005)"}
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              className="relative z-10 block text-center py-3 rounded-xl bg-[#C8FF4D] text-[#0D120D] text-sm font-bold hover:brightness-105 transition-all shadow-[0_0_15px_rgba(200,255,77,0.25)]"
            >
              {language === "my" ? "Pro သို့ အဆင့်မြှင့်မည်" : "Upgrade to Pro"}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-20 px-[6vw] max-w-4xl mx-auto border-t border-[#2C3527]">
        <div className="text-center mb-12">
          <div className="text-[#C8FF4D] text-xs uppercase tracking-widest font-semibold mb-2">
            {language === "my" ? "မေးလေ့ရှိသော မေးခွန်းများ" : "Frequently Asked Questions"}
          </div>
          <h2 className="display-font text-3xl sm:text-4xl font-semibold text-[#F2F0E6]">
            {language === "my" ? "သိရှိလိုသည်များကို ဖြေကြားပေးထားပါသည်" : "Everything you need to know"}
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#12160F] border border-[#2C3527] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-[#F2F0E6] hover:text-[#C8FF4D] transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform text-[#93A38C] ${
                      isOpen ? "rotate-180 text-[#C8FF4D]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-[#93A38C] leading-relaxed border-t border-[#2C3527]/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Box */}
        <div className="mt-10 bg-gradient-to-r from-[#12160F] to-[#1A211A] border border-[#2C3527] rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-[#F2F0E6] mb-1">
            {language === "my" ? "အခြားသိရှိလိုသည်များ ရှိသေးပါသလား?" : "Still have questions?"}
          </p>
          <p className="text-xs text-[#93A38C] mb-4">
            {language === "my"
              ? "ကျွန်ုပ်တို့ထံ Viber သို့မဟုတ် ဖုန်းဖြင့် တိုက်ရိုက်ဆက်သွယ် မေးမြန်းနိုင်ပါသည်။"
              : "Reach our team directly via Viber or Phone."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={viberLink}
              className="bg-[#C8FF4D] text-[#0D120D] font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Viber: {contactPhone}</span>
            </a>
            <a
              href={telLink}
              className="border border-[#2C3527] text-[#F2F0E6] text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 hover:bg-[#1A211A]"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8FF4D]" />
              <span>Call: {contactPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#2C3527] py-10 px-[6vw] flex justify-between items-center flex-wrap gap-4 text-xs text-[#66705F] max-w-7xl mx-auto">
        <div>
          &copy; 2026 Menuu. All rights reserved. • Myanmar (Yangon)
        </div>
        <div className="flex items-center gap-6">
          <Link href="/menu" target="_blank" className="hover:text-[#F2F0E6] transition-colors">
            Demo Menu
          </Link>
          <Link href="/auth/login" className="hover:text-[#F2F0E6] transition-colors">
            Login
          </Link>
          <a
            href={viberLink}
            className="hover:text-[#C8FF4D] transition-colors flex items-center gap-1 font-semibold"
          >
            <Phone className="w-3 h-3 text-[#C8FF4D]" />
            <span>Viber: {contactPhone}</span>
          </a>
        </div>
      </footer>
    </div>
  );
}