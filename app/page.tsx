"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, UtensilsCrossed, Clock, Palette, Languages, ToggleRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { landingEn } from "@/lib/i18n/landing-en";
import { landingMy } from "@/lib/i18n/landing-my";
import JapandiHero from "@/components/landing/Hero";
import JapandiNavbar from "@/components/landing/LandingNavbar";
import HowItWorks from "@/components/ui/how-it-works";
import FaqAccordion from "@/components/ui/faq-accordion";


export default function LandingPage() {
  const { language } = useLanguage();
  const vineFillRef = useRef<HTMLDivElement | null>(null);
  const vineTrackRef = useRef<HTMLDivElement | null>(null);

  const content = language === "my" ? landingMy : landingEn;

  useEffect(() => {
    const sizeTrack = () => {
      if (vineTrackRef.current) {
        vineTrackRef.current.style.height = `${document.body.scrollHeight}px`;
      }
    };

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.body.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.min(100, (scrollTop / docH) * 100) : 0;
      if (vineFillRef.current) {
        vineFillRef.current.style.height = `${pct}%`;
      }
    };

    sizeTrack();
    onScroll();

    window.addEventListener("resize", sizeTrack);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Light up nodes as sections are reached
    const sections = document.querySelectorAll<HTMLElement>("section");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const node = e.target.querySelector<HTMLElement>(".vine-node");
            if (node) node.classList.add("lit");
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => obs.observe(s));

    return () => {
      window.removeEventListener("resize", sizeTrack);
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="landing-editorial-root min-h-screen bg-[var(--stone)] text-[var(--ink)] antialiased overflow-x-hidden selection:bg-[var(--lime)] selection:text-[var(--ink)]">
      <style jsx global>{`
        /* Fix 8: Removed unused Fraunces weight 500 — saves ~15KB font payload */
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap");

        .landing-editorial-root {
          --stone: #f6f2e8;
          --stone-2: #efe9da;
          --moss-deep: #1b2414;
          --moss-mid: #556036;
          --ink: #1e2417;
          --sub: #57604f;
          --lime: #c8f04a;
          --lime-hover: #bde63d;
          --clay: #d98a4a;
          --border: rgba(30, 36, 23, 0.12);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.55;
        }

        .font-fraunces {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600;
        }

        .font-caveat {
          font-family: "Caveat", cursive, sans-serif;
        }

        /* Growing vine spine */
        #vine-track {
          position: absolute;
          top: 0;
          left: 38px;
          width: 3px;
          background: var(--border);
          z-index: 10;
        }

        #vine-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, var(--lime) 0%, var(--moss-mid) 100%);
          height: 0%;
          transition: height 0.12s ease-out;
          box-shadow: 0 0 10px rgba(200, 240, 74, 0.6);
        }

        .vine-node {
          position: absolute;
          left: 31px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--stone);
          border: 2px solid var(--border);
          z-index: 11;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vine-node.lit {
          background: var(--lime);
          border-color: var(--lime);
          box-shadow: 0 0 14px rgba(200, 240, 74, 0.85);
          transform: scale(1.15);
        }

        /* Mobile responsive vine spine & nodes */
        @media (max-width: 768px) {
          #vine-track {
            left: 14px;
            width: 2.5px;
            display: block !important;
          }
          .vine-node {
            left: 9px;
            width: 12.5px;
            height: 12.5px;
            display: block !important;
          }
          .vine-node.lit {
            transform: scale(1.25);
            box-shadow: 0 0 10px rgba(200, 240, 74, 0.9);
          }
        }

        /* Editorial Buttons */
        .btn-editorial {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-weight: 600;
          font-size: 13.5px;
          padding: 11px 22px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
          text-decoration: none;
        }

        .btn-editorial:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .btn-editorial-primary {
          background: var(--lime);
          color: var(--ink);
          box-shadow: 0 4px 12px rgba(200, 240, 74, 0.25);
        }

        .btn-editorial-primary:hover {
          background: var(--lime-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(200, 240, 74, 0.4);
        }

        .btn-editorial-dark {
          background: var(--moss-deep);
          color: var(--stone);
          box-shadow: 0 4px 12px rgba(27, 36, 20, 0.2);
        }

        .btn-editorial-dark:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(27, 36, 20, 0.35);
        }

        .btn-editorial-outline {
          border: 1px solid var(--border);
          color: var(--ink);
          background: transparent;
        }

        .btn-editorial-outline:hover {
          background: var(--stone-2);
          border-color: rgba(30, 36, 23, 0.25);
        }

        /* Order Ticket Clip-path */
        .ticket-card {
          clip-path: polygon(
            0 0,
            100% 0,
            100% 92%,
            95% 100%,
            90% 92%,
            85% 100%,
            80% 92%,
            75% 100%,
            70% 92%,
            65% 100%,
            60% 92%,
            55% 100%,
            50% 92%,
            45% 100%,
            40% 92%,
            35% 100%,
            30% 92%,
            25% 100%,
            20% 92%,
            15% 100%,
            10% 92%,
            5% 100%,
            0 92%
          );
        }

        /* Fix 3: Smooth rotate transition on ticket cards (was instant snap) */
        .ticket-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s ease;
        }

        /* Fix 5: Mobile gap below torn clip-path so cards don't bleed together */
        @media (max-width: 640px) {
          .ticket-card {
            margin-bottom: 20px;
          }
        }

        /* UI/UX Polish: Interactive details summary reset */
        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
        details summary:focus-visible {
          outline: 2px solid var(--moss-mid);
          outline-offset: 4px;
          border-radius: 6px;
        }

        .btn-editorial:active {
          transform: translateY(1px);
        }

        /* Glassmorphism Problem Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.72);
          box-shadow:
            0 4px 24px rgba(30, 36, 23, 0.07),
            0 1.5px 0 rgba(255,255,255,0.9) inset;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.28s ease;
        }

        .glass-card:hover {
          transform: translateY(-4px) rotate(0deg) !important;
          box-shadow:
            0 16px 40px rgba(30, 36, 23, 0.12),
            0 1.5px 0 rgba(255,255,255,0.9) inset;
        }

        /* Staggered entry offsets */
        .glass-card-0 { transform: rotate(-1.2deg) translateY(0px); }
        .glass-card-1 { transform: rotate(0.8deg) translateY(6px); }
        .glass-card-2 { transform: rotate(1deg) translateY(-4px); }
        .glass-card-3 { transform: rotate(-0.6deg) translateY(8px); }

        /* Lime orb icon */
        .glass-icon-orb {
          background: rgba(200, 240, 74, 0.22);
          border: 1px solid rgba(200, 240, 74, 0.45);
          box-shadow: 0 0 12px rgba(200, 240, 74, 0.25);
        }

        /* Problem section radial bloom */
        .problem-bloom {
          background: radial-gradient(ellipse 70% 55% at 50% 60%, rgba(200, 240, 74, 0.09) 0%, transparent 70%);
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* GROWING VINE TRACK (Active on Desktop & Mobile) */}
      <div id="vine-track" ref={vineTrackRef} aria-hidden="true">
        <div id="vine-fill" ref={vineFillRef} />
      </div>

      {/* NAVIGATION */}
      <JapandiNavbar />

      {/* HERO SECTION */}
      <JapandiHero />

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />

        {/* Radial lime bloom behind the cards */}
        <div
          className="problem-bloom absolute inset-0 pointer-events-none rounded-[32px]"
          aria-hidden="true"
        />

        {/* Section header */}
        <div className="relative mb-10 max-w-[660px]">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--moss-mid)] mb-3 px-2.5 py-1 rounded-full border border-[rgba(85,96,54,0.25)] bg-[rgba(85,96,54,0.07)]">
            {language === "my" ? "ပြဿနာ" : "The problem"}
          </span>
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-fraunces font-semibold text-[var(--ink)] mb-3 leading-tight">
            {content.problem.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)] font-normal leading-relaxed">
            {content.problem.description}
          </p>
        </div>

        {/* Staggered glass card grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {content.problem.items.map((item, idx) => {
            const icons = ["💸", "🚫", "✨", "📋"];
            return (
              <div
                key={idx}
                className={`glass-card glass-card-${idx} rounded-[20px] p-6 sm:p-7 cursor-default`}
              >
                {/* Lime icon orb */}
                <div className="glass-icon-orb w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg select-none">
                  {icons[idx]}
                </div>

                {/* Serif number accent */}
                <div className="font-caveat text-[var(--moss-mid)] text-sm font-semibold mb-1 opacity-60">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--sub)] leading-relaxed">
                  {item.desc}
                </p>

                {/* Subtle bottom lime streak */}
                <div className="mt-5 h-[2px] w-10 rounded-full bg-gradient-to-r from-[var(--lime)] to-transparent opacity-60" />
              </div>
            );
          })}
        </div>
      </section>

      {/* SOLUTION / HOW IT WORKS SECTION */}
      <section id="solution" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="mb-10 max-w-[720px]">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-fraunces font-semibold text-[var(--ink)] mb-3 leading-tight">
            {content.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)] leading-relaxed">
            {content.howItWorks.subtitle}
          </p>
        </div>

        {/* Pin-card animated workflow */}
        <HowItWorks
          data={[
            {
              title: content.howItWorks.step1Title,
              description: content.howItWorks.step1Desc,
              colorTheme: "lime",
            },
            {
              title: content.howItWorks.step2Title,
              description: content.howItWorks.step2Desc,
              colorTheme: "moss",
            },
            {
              title: content.howItWorks.step3Title,
              description: content.howItWorks.step3Desc,
              colorTheme: "lime",
            },
          ]}
          className="mb-8"
        />

        {/* Key message banner */}
        <div className="p-6 sm:p-7 bg-[var(--moss-deep)] text-[var(--stone)] rounded-[18px] text-base sm:text-[18px] font-fraunces leading-relaxed shadow-lg">
          {content.howItWorks.keyMessage}{" "}
          <span className="text-[var(--lime)] font-medium">
            {content.howItWorks.keyMessageHighlight}
          </span>
          .
        </div>

      </section>

      {/* PROOF SECTION */}
      <section id="proof" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="bg-[var(--moss-deep)] text-[var(--stone)] rounded-[24px] p-8 sm:p-12 shadow-xl">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] font-fraunces font-semibold text-white mb-2 leading-tight">
              {content.proof.title}
            </h2>
            <p className="text-sm sm:text-base text-[#c2c8b8] leading-relaxed">
              {content.proof.subtitle}
            </p>
          </div>

          {/* Before / After cards */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10">
            {/* Owner's phone — editing */}
            <div className="bg-white text-[var(--ink)] rounded-2xl p-6 w-full max-w-[240px] shadow-md">
              <div className="text-[10px] font-bold text-[var(--sub)] uppercase tracking-wider mb-3">
                {content.proof.ownerPhoneLabel}
              </div>
              <div className="font-fraunces text-base font-semibold text-[var(--ink)] mb-3">
                {content.proof.dishName}
              </div>
              {/* Simulated edit row */}
              <div className="flex items-center justify-between bg-[var(--stone-2)] rounded-lg px-3 py-2">
                <span className="text-sm text-[var(--sub)] line-through">{content.proof.oldPrice}</span>
                <span className="text-sm font-bold text-[var(--moss-mid)]">{content.proof.newPrice}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-[var(--lime)] text-[var(--ink)] text-[10px] font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b6d11] inline-block" />
                {language === "my" ? "သိမ်းဆည်းပြီး" : "Saved"}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1 text-[var(--lime)]">
              <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-[10px] font-semibold text-[#c2c8b8] uppercase tracking-wider whitespace-nowrap">
                {language === "my" ? "စက္ကန့်ပိုင်းအတွင်း" : "seconds later"}
              </span>
            </div>

            {/* Customer's phone — sees update */}
            <div className="bg-white text-[var(--ink)] rounded-2xl p-6 w-full max-w-[240px] shadow-md">
              <div className="text-[10px] font-bold text-[var(--sub)] uppercase tracking-wider mb-3">
                {content.proof.customerPhoneLabel}
              </div>
              <div className="font-fraunces text-base font-semibold text-[var(--ink)] mb-3">
                {content.proof.dishName}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#3b6d11]">{content.proof.newPrice}</span>
              </div>
              <div className="mt-3 text-[11px] text-[var(--sub)]">
                {language === "my" ? "App မလိုဘဲ QR Scan ဖတ်ရုံ" : "No app. Just scan the QR."}
              </div>
            </div>
          </div>

          {/* Napkin quote — honest, no fake testimonials */}
          <div className="max-w-[520px] mx-auto border-t border-white/10 pt-8">
            <blockquote className="text-sm sm:text-base text-[#c2c8b8] leading-relaxed italic font-light">
              &ldquo;{content.napkinQuote.quote}&rdquo;
            </blockquote>
            <cite className="block mt-3 text-xs text-[#7a9a6a] font-medium not-italic">
              {content.napkinQuote.author}
            </cite>
          </div>
        </div>
      </section>


      {/* FEATURES / BENEFITS SECTION */}
      <section id="features" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] mb-8 font-fraunces font-semibold text-[var(--ink)]">
          {content.benefits.heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[940px]">
          {/* Card 1: Price & availability updates */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card1Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card1Desc}
            </p>
          </div>

          {/* Card 2: Bilingual menu */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card2Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card2Desc}
            </p>
          </div>

          {/* Card 3: Dish photos */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card3Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card3Desc}
            </p>
          </div>

          {/* Card 4: Restaurant profile */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card4Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card4Desc}
            </p>
          </div>

          {/* Card 5: Mobile-friendly by default (wide) */}
          <div className="sm:col-span-2 bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <ToggleRight className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card5Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card5Desc}
            </p>
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA BRIDGE */}
      <div className="pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 px-7 sm:px-8 rounded-[18px] bg-[var(--stone-2)] border border-[var(--border)]">
          <p className="font-fraunces text-base sm:text-lg font-semibold text-[var(--ink)] leading-snug max-w-[480px]">
            {language === "my"
              ? "ဆိုင်ဖွင့်ချိန်မှာ ဈေးနှုန်းပြောင်းရတာ မကြာသင့်ပါ — ဖုန်းထဲကနေ စက္ကန့်ပိုင်းနဲ့ ပြင်နိုင်ပါတယ်။"
              : "Ready to stop reprinting? See what it costs — less than one menu reprint."}
          </p>
          <Link
            href="#pricing"
            className="btn-editorial btn-editorial-dark shrink-0 text-sm font-semibold px-6 py-3 rounded-xl whitespace-nowrap flex items-center gap-2"
          >
            {language === "my" ? "ဈေးနှုန်းကြည့်ရန်" : "See pricing"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="max-w-[880px]">
          <h2 className="text-[26px] sm:text-[30px] md:text-[34px] mb-2 font-fraunces text-[var(--ink)] tracking-tight font-semibold">
            {content.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)] mb-8 sm:mb-10 max-w-[600px] font-normal leading-relaxed">
            {content.pricing.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-[22px] p-6 sm:p-8 border border-[var(--border)] flex flex-col justify-between shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_32px_rgba(30,36,23,0.08)] transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] px-2.5 py-1 rounded-md bg-[var(--stone-2)]">
                    {content.pricing.starterBadge}
                  </span>
                </div>

                <div className="my-4 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-fraunces text-3xl sm:text-4xl font-semibold text-[var(--ink)]">
                      {content.pricing.starterPrice}
                    </span>
                    <span className="text-sm font-normal text-[var(--sub)] font-sans">
                      {content.pricing.starterPeriod}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--sub)] mt-1.5">
                    {content.pricing.starterDishes}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-[var(--ink)] my-6">
                  {content.pricing.starterFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--stone-2)] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[var(--moss-mid)]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-semibold text-[#556036] mt-4 mb-2">
                  {content.pricing.starterNote}
                </p>
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  href="/auth/sign-up"
                  className="btn-editorial btn-editorial-outline w-full py-3.5 justify-center text-sm font-semibold rounded-xl"
                >
                  {content.pricing.starterCta}
                </Link>
              </div>
            </div>

            {/* Pro Plan Featured */}
            <div className="bg-[var(--moss-deep)] text-[var(--stone)] rounded-[22px] p-6 sm:p-8 flex flex-col justify-between border-2 border-[var(--lime)] shadow-[0_16px_40px_rgba(27,36,20,0.18)] hover:shadow-[0_20px_48px_rgba(27,36,20,0.28)] transition-all duration-300 relative overflow-hidden">
              {/* Featured Badge */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-[var(--lime)] text-[var(--ink)] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                {content.pricing.proRecommended}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--lime)] px-2.5 py-1 rounded-md bg-white/[0.08]">
                    {content.pricing.proBadge}
                  </span>
                </div>

                <div className="my-4 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-fraunces text-3xl sm:text-4xl font-semibold text-white">
                      {content.pricing.proPrice}
                    </span>
                    <span className="text-sm font-normal text-[#c2c8b8] font-sans">
                      {content.pricing.proPeriod}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--lime)] mt-1.5">
                    {content.pricing.proDishes}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-[var(--stone)] my-6">
                  {content.pricing.proFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--lime)]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[var(--lime)]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-semibold text-[var(--lime)] mt-4 mb-2">
                  {content.pricing.proNote}
                </p>
              </div>

              <div className="pt-4 mt-auto">
                <Link
                  href="/auth/sign-up"
                  className="btn-editorial btn-editorial-primary w-full py-3.5 justify-center text-sm font-semibold rounded-xl"
                >
                  {content.pricing.proCta}
                </Link>
              </div>
            </div>
          </div>

          {/* Value Anchor Card: Why this is cheaper */}
          <div className="p-6 sm:p-7 bg-[var(--stone-2)] rounded-[20px] border border-[var(--border)] mb-8">
            <h3 className="font-fraunces text-base sm:text-lg font-semibold text-[var(--ink)] mb-2">
              {content.pricing.whyCheaperTitle}
            </h3>
            <p className="text-sm text-[var(--sub)] leading-relaxed">
              {content.pricing.whyCheaperDesc}
            </p>
          </div>

          {/* Founding Offer Banner */}
          <div className="p-7 sm:p-9 bg-[var(--moss-deep)] text-[var(--stone)] rounded-[22px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-white/10">
            <div className="max-w-[540px]">
              <h3 className="font-fraunces text-xl sm:text-2xl font-semibold text-white mb-2">
                {content.pricing.foundingBannerTitle}
              </h3>
              <p className="text-sm text-[#c2c8b8] leading-relaxed">
                {content.pricing.foundingBannerDesc}
              </p>
            </div>
            <Link
              href="/auth/sign-up"
              className="btn-editorial btn-editorial-primary shrink-0 text-sm font-semibold px-6 py-3 rounded-xl whitespace-nowrap"
            >
              {content.pricing.foundingBannerCta}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <FaqAccordion
          title={content.faq.title}
          items={content.faq.items}
        />
      </section>


      {/* FINAL CTA SECTION */}
      <section className="py-12 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" id="lastNode" />
        <div className="bg-[var(--moss-deep)] text-left py-14 px-8 sm:px-12 rounded-[24px] relative overflow-hidden text-[var(--stone)] shadow-2xl">
          <div className="max-w-[620px]">
            <h2 className="text-white text-2xl sm:text-3xl md:text-[36px] mb-3 font-fraunces font-semibold leading-tight">
              {content.finalCta.title}
            </h2>
            <p className="text-[#c2c8b8] text-sm sm:text-base mb-8 font-normal leading-relaxed">
              {content.finalCta.description}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/auth/sign-up" className="btn-editorial btn-editorial-primary text-sm sm:text-base px-8 py-3.5">
                <span>{content.finalCta.cta}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href="/examples"
                className="btn-editorial btn-editorial-outline text-sm sm:text-base px-7 py-3.5 border-white/20 text-[var(--stone)] hover:bg-white/10"
              >
                <span>{content.nav.liveDemo}</span>
              </a>
            </div>
            {content.finalCta.tagline && (
              <p className="mt-10 pt-6 border-t border-white/10 text-xs text-[#a4ad9a] leading-relaxed">
                {content.finalCta.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto text-xs text-[var(--sub)] flex items-center justify-between flex-wrap gap-4 border-t border-[var(--border)] mt-8">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-xs"
            style={{ background: "#2B2A26" }}
          >
            <span
              className="text-[10px] font-bold leading-none"
              style={{ color: "#c8f04a", fontFamily: "Georgia, serif" }}
            >
              Q
            </span>
          </span>
          <span>{content.footer.copyright}</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#problem" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.howItWorks}
          </a>
          <a href="#pricing" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.pricing}
          </a>
          <a href="#faq" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.faq}
          </a>
          <Link href="/auth/login" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.logIn}
          </Link>
        </div>
      </footer>
    </div>
  );
}
