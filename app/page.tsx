"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { landingEn } from "@/lib/i18n/landing-en";
import { landingMy } from "@/lib/i18n/landing-my";
import JapandiHero from "@/components/landing/Hero";
import JapandiNavbar from "@/components/landing/LandingNavbar";

export default function LandingPage() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

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


      {/* PROBLEM STATEMENT SECTION */}
      <section className="py-8 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="bg-[var(--moss-deep)] rounded-[20px] p-7 sm:p-10 text-[var(--stone)] max-w-[940px] shadow-lg">
          <h2 className="text-xl sm:text-2xl mb-3 max-w-[540px] text-white font-fraunces font-semibold leading-snug">
            {content.problem.title}
          </h2>
          <p className="text-sm text-[#c2c8b8] max-w-[500px] leading-relaxed font-normal">
            {content.problem.description}
          </p>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <h2 className="text-[24px] sm:text-[26px] mb-1.5 font-fraunces text-[var(--ink)]">
          {content.whatYouGet.title}
        </h2>
        <p className="text-sm text-[var(--sub)] mb-7 max-w-[460px] font-normal">
          {content.whatYouGet.subtitle}
        </p>

        {/* Fix 6: Removed space-y-4 — items use py-5 internal padding now */}
        <div className="max-w-[820px]">
          {content.whatYouGet.items.map((item, idx) => (
            <div key={idx}>
              {/* Fix 6: py-4 → py-5 — more breathing room between feature rows */}
              <div className="flex items-baseline gap-2 py-5 border-b border-dashed border-[var(--border)]">
                <span className="font-fraunces text-base font-semibold whitespace-nowrap text-[var(--ink)]">
                  {item.title}
                </span>
                <span className="flex-1 border-b border-dotted border-[var(--sub)] opacity-40 -translate-y-1" />
              </div>
              {/* Fix 2: text-[12.5px] → text-sm (14px) for WCAG AA compliance */}
              <p className="text-sm text-[var(--sub)] mt-1.5 font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <h2 className="text-[24px] sm:text-[26px] mb-1.5 font-fraunces text-[var(--ink)]">
          {content.howItWorks.title}
        </h2>
        <p className="text-sm text-[var(--sub)] mb-8 max-w-[460px] font-normal">
          {content.howItWorks.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Ticket 1 */}
          <div
            className="ticket-card bg-white p-6 pb-8 relative rounded-t-sm hover:rotate-0 hover:-translate-y-2"
            style={{
              transform: "rotate(-1.5deg)",
              boxShadow: "0 10px 26px rgba(30, 36, 23, 0.08)",
            }}
          >
            <p className="font-fraunces text-xs text-[var(--clay)] font-semibold mb-2 tracking-wide">
              {content.howItWorks.step1Tag}
            </p>
            <h3 className="text-[16px] mb-1 font-semibold text-[var(--ink)] font-fraunces">
              {content.howItWorks.step1Title}
            </h3>
            {/* Fix 2: text-[13px] → text-sm (14px) for readability */}
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.howItWorks.step1Desc}
            </p>
          </div>

          {/* Ticket 2 */}
          <div
            className="ticket-card bg-white p-6 pb-8 relative rounded-t-sm hover:rotate-0 hover:-translate-y-2"
            style={{
              transform: "rotate(1deg)",
              boxShadow: "0 10px 26px rgba(30, 36, 23, 0.08)",
            }}
          >
            <p className="font-fraunces text-xs text-[var(--clay)] font-semibold mb-2 tracking-wide">
              {content.howItWorks.step2Tag}
            </p>
            <h3 className="text-[16px] mb-1 font-semibold text-[var(--ink)] font-fraunces">
              {content.howItWorks.step2Title}
            </h3>
            {/* Fix 2: text-[13px] → text-sm (14px) for readability */}
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.howItWorks.step2Desc}
            </p>
          </div>

          {/* Ticket 3 */}
          <div
            className="ticket-card bg-white p-6 pb-8 relative rounded-t-sm hover:rotate-0 hover:-translate-y-2"
            style={{
              transform: "rotate(-1deg)",
              boxShadow: "0 10px 26px rgba(30, 36, 23, 0.08)",
            }}
          >
            <p className="font-fraunces text-xs text-[var(--clay)] font-semibold mb-2 tracking-wide">
              {content.howItWorks.step3Tag}
            </p>
            <h3 className="text-[16px] mb-1 font-semibold text-[var(--ink)] font-fraunces">
              {content.howItWorks.step3Title}
            </h3>
            {/* Fix 2: text-[13px] → text-sm (14px) for readability */}
            <p className="text-sm text-[var(--sub)] font-normal leading-relaxed">
              {content.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* TAPED NAPKIN QUOTE */}
      <section className="py-12 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div
          className="bg-[#fffdf7] max-w-[620px] p-7 sm:p-10 relative rounded-xs transition-transform duration-200 hover:rotate-0"
          style={{
            transform: "rotate(1deg)",
            boxShadow: "0 16px 36px rgba(30, 36, 23, 0.10)",
          }}
        >
          {/* Tape Left */}
          <div
            className="absolute w-[50px] h-[19px] bg-[rgba(200,240,74,0.65)] -top-2.5 left-6 shadow-2xs pointer-events-none"
            style={{ transform: "rotate(-8deg)" }}
          />
          {/* Tape Right */}
          <div
            className="absolute w-[50px] h-[19px] bg-[rgba(200,240,74,0.65)] -top-2.5 right-6 shadow-2xs pointer-events-none"
            style={{ transform: "rotate(7deg)" }}
          />
          <blockquote className="font-caveat text-2xl md:text-[27px] leading-[1.4] text-[var(--ink)] mb-3 font-semibold">
            &ldquo;{content.napkinQuote.quote}&rdquo;
          </blockquote>
          <cite className="block not-italic text-xs text-[var(--sub)] font-semibold font-sans">
            {content.napkinQuote.author}
          </cite>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <div className="max-w-[840px]">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] mb-2 font-fraunces text-[var(--ink)] tracking-tight">
            {content.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-[var(--sub)] mb-8 sm:mb-10 max-w-[520px] font-normal leading-relaxed">
            {content.pricing.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[var(--border)] flex flex-col justify-between shadow-[0_4px_20px_rgba(30,36,23,0.04)] hover:shadow-[0_12px_32px_rgba(30,36,23,0.08)] transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--sub)] px-2.5 py-1 rounded-md bg-[var(--stone-2)]">
                    {content.pricing.freeBadge}
                  </span>
                </div>
                
                <div className="my-4 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="font-fraunces text-3xl sm:text-4xl font-semibold text-[var(--ink)]">
                      {content.pricing.freePrice}
                    </span>
                    <span className="text-sm font-normal text-[var(--sub)] font-sans">
                      {content.pricing.freePeriod}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 text-sm text-[var(--ink)] my-6">
                  {content.pricing.freeFeatures.map((feat, idx) => (
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
                  {content.pricing.freeCta}
                </Link>
              </div>
            </div>

            {/* Pro Plan Featured */}
            <div className="bg-[var(--moss-deep)] text-[var(--stone)] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between border-2 border-[var(--lime)] shadow-[0_16px_40px_rgba(27,36,20,0.18)] hover:shadow-[0_20px_48px_rgba(27,36,20,0.28)] transition-all duration-300 relative overflow-hidden">
              {/* Pro Badge */}
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

      {/* FAQ SECTION */}
      <section id="faq" className="py-14 pl-10 pr-5 sm:pl-12 sm:pr-8 md:pl-20 md:px-8 max-w-[1040px] mx-auto relative">
        <div className="vine-node" />
        <h2 className="text-[24px] sm:text-[26px] mb-7 font-fraunces text-[var(--ink)]">
          {content.faq.title}
        </h2>

        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)] max-w-[820px]">
          {content.faq.items.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-colors">
                {/* Fix 4: Added hover:bg + px/-mx so the full row lights up on hover, not just the text */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4.5 px-3 -mx-3 flex justify-between items-center text-left text-[15px] font-fraunces font-semibold text-[var(--ink)] hover:text-[var(--moss-mid)] hover:bg-[var(--stone-2)] rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--sub)] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[var(--ink)]" : ""
                    }`}
                  />
                </button>
                <div className={`faq-content-grid ${isOpen ? "open" : ""}`}>
                  <div className="overflow-hidden">
                    {/* Fix 2: text-[13.5px] → text-sm (14px) for readability */}
                    <p className="text-sm text-[var(--sub)] leading-relaxed font-normal pb-4.5 max-w-[700px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
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
