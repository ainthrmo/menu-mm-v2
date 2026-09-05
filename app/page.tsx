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

        /* FAQ Grid Transition */
        .faq-content-grid {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .faq-content-grid.open {
          grid-template-rows: 1fr;
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

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-12 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="mb-8">
          <h2 className="text-[24px] sm:text-[28px] md:text-[30px] font-fraunces font-semibold text-[var(--ink)] mb-2">
            {content.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)]">
            {content.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Add your dishes */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--stone-2)] flex items-center justify-center mb-4 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                1
              </div>
              <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
                {content.howItWorks.step1Title}
              </h3>
              <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
                {content.howItWorks.step1Desc}
              </p>
            </div>
          </div>

          {/* Card 2: Get your QR code */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--stone-2)] flex items-center justify-center mb-4 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                2
              </div>
              <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
                {content.howItWorks.step2Title}
              </h3>
              <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
                {content.howItWorks.step2Desc}
              </p>
            </div>
          </div>

          {/* Card 3: Guests scan and order */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--stone-2)] flex items-center justify-center mb-4 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                3
              </div>
              <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
                {content.howItWorks.step3Title}
              </h3>
              <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
                {content.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. EXPLAINER SECTION */}
      <section id="explainer" className="py-12 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="bg-white rounded-[20px] p-6 sm:p-10 border border-[var(--border)] shadow-[0_4px_24px_rgba(30,36,23,0.04)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column: Customer menu mockup image */}
          <div className="bg-[var(--stone)] rounded-2xl p-4 sm:p-5 border border-[var(--border)] relative overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full max-w-[320px] rounded-2xl overflow-hidden shadow-md border border-[var(--border)] bg-white">
              <Image
                src="/customer_menu.png"
                alt="Customer mobile menu view"
                width={606}
                height={951}
                className="w-full h-auto object-contain block"
                priority
              />
            </div>
          </div>

          {/* Right column: Heading & 3 short numbered points */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-fraunces font-semibold text-[var(--ink)] mb-6 leading-tight">
              {content.explainer.heading}
            </h2>
            <ol className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--stone-2)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                  1
                </div>
                <span className="text-sm sm:text-base text-[var(--ink)] font-medium leading-snug pt-0.5">
                  {content.explainer.point1}
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--stone-2)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                  2
                </div>
                <span className="text-sm sm:text-base text-[var(--ink)] font-medium leading-snug pt-0.5">
                  {content.explainer.point2}
                </span>
              </li>
              <li className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--stone-2)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)] text-[var(--moss-deep)] text-xs font-semibold font-fraunces">
                  3
                </div>
                <span className="text-sm sm:text-base text-[var(--ink)] font-medium leading-snug pt-0.5">
                  {content.explainer.point3}
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section id="benefits" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <h2 className="text-[24px] sm:text-[28px] md:text-[30px] mb-8 font-fraunces font-semibold text-[var(--ink)]">
          {content.benefits.heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[940px]">
          {/* Card 1: Update anytime */}
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

          {/* Card 2: Your own branding */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card2Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card2Desc}
            </p>
          </div>

          {/* Card 3: Bilingual by default */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card3Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card3Desc}
            </p>
          </div>

          {/* Card 4: Mark items sold out */}
          <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-[var(--border)] shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_28px_rgba(30,36,23,0.07)] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[var(--stone-2)] flex items-center justify-center mb-4 text-[var(--moss-deep)]">
              <ToggleRight className="w-5 h-5" />
            </div>
            <h3 className="font-fraunces text-base sm:text-[17px] font-semibold text-[var(--ink)] mb-1.5">
              {content.benefits.card4Title}
            </h3>
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.benefits.card4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3. PRICING SECTION */}
      <section id="pricing" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="max-w-[840px]">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] mb-2 font-fraunces text-[var(--ink)] tracking-tight font-semibold">
            {content.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)] mb-8 sm:mb-10 max-w-[520px] font-normal leading-relaxed">
            {content.pricing.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[var(--border)] flex flex-col justify-between shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_32px_rgba(30,36,23,0.08)] transition-all duration-300">
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

                <div className="space-y-3.5 text-sm text-[var(--ink)] my-6">
                  {content.pricing.starterFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--stone-2)] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[var(--moss-mid)]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
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
            <div className="bg-[var(--moss-deep)] text-[var(--stone)] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between border-2 border-[var(--lime)] shadow-[0_16px_40px_rgba(27,36,20,0.18)] hover:shadow-[0_20px_48px_rgba(27,36,20,0.28)] transition-all duration-300 relative overflow-hidden">
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

                <div className="space-y-3.5 text-sm text-[var(--stone)] my-6">
                  {content.pricing.proFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[var(--lime)]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[var(--lime)]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
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
        </div>
      </section>

      {/* 4. FINAL CTA SECTION */}
      <section className="py-10 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" id="lastNode" />
        <div className="bg-[var(--moss-deep)] text-center py-16 px-6 sm:px-10 rounded-[24px] relative overflow-hidden text-[var(--stone)] shadow-2xl">
          <div
            className="w-24 h-24 rounded-full bg-[var(--moss-deep)] mx-auto mb-5 flex items-center justify-center relative overflow-hidden shadow-lg"
            style={{
              boxShadow: "0 0 0 4px var(--moss-deep), 0 0 0 5px rgba(200, 240, 74, 0.4)",
            }}
          >
            <Image
              src="/moss_logo.jpg"
              alt="Moss logo mark"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-white text-2xl md:text-[30px] mb-2 font-fraunces font-semibold">
            {content.finalCta.title}
          </h2>
          <p className="text-[#c2c8b8] text-sm mb-6 font-normal max-w-md mx-auto">
            {content.finalCta.description}
          </p>
          <Link href="/auth/sign-up" className="btn-editorial btn-editorial-primary text-sm sm:text-base px-8 py-3.5">
            <span>{content.finalCta.cta}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto text-xs text-[var(--sub)] flex items-center justify-between flex-wrap gap-4 border-t border-[var(--border)] mt-8">
        <div className="flex items-center gap-2">
          <Image
            src="/moss_logo.jpg"
            alt="Moss logo"
            width={22}
            height={22}
            className="w-5.5 h-5.5 rounded-xs object-cover"
          />
          <span>{content.footer.copyright}</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#how" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.howItWorks}
          </a>
          <a href="#pricing" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.pricing}
          </a>
          <Link href="/auth/login" className="hover:text-[var(--ink)] transition-colors">
            {content.nav.logIn}
          </Link>
        </div>
      </footer>
    </div>
  );
}
