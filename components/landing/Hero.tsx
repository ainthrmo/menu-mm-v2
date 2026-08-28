"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function Hero() {
  const words = ["menu.", "sushi.", "pasta."];
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFadeState("in");
      }, 200);
    }, 1800);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section
      className="relative z-10 bg-[#10140f] text-[#dfe3da] overflow-hidden"
      aria-label="Hero section"
    >
      <style jsx>{`
        @keyframes sweepBeam {
          0% {
            opacity: 0;
            transform: translateY(24px) scaleX(0.8);
          }
          15% {
            opacity: 0.9;
          }
          65% {
            opacity: 0.9;
            transform: translateY(-36px) scaleX(1.15);
          }
          85%,
          100% {
            opacity: 0;
            transform: translateY(-48px) scaleX(1.2);
          }
        }

        @keyframes cornerGlow {
          0%,
          40% {
            opacity: 0.2;
            filter: drop-shadow(0 0 0px rgba(200, 240, 74, 0));
          }
          60%,
          85% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(200, 240, 74, 0.8));
          }
          100% {
            opacity: 0.2;
            filter: drop-shadow(0 0 0px rgba(200, 240, 74, 0));
          }
        }

        @keyframes toastCycle {
          0%,
          45% {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          58%,
          88% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          96%,
          100% {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
        }

        @keyframes trustFadeIn {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .beam-pulse {
          animation: sweepBeam 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .corner-pulse {
          animation: cornerGlow 3.2s ease-in-out infinite;
        }

        .toast-pulse {
          animation: toastCycle 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .trust-item-1 {
          animation: trustFadeIn 0.5s ease-out 0.1s forwards;
        }
        .trust-item-2 {
          animation: trustFadeIn 0.5s ease-out 0.25s forwards;
        }
        .trust-item-3 {
          animation: trustFadeIn 0.5s ease-out 0.4s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .beam-pulse,
          .corner-pulse,
          .toast-pulse,
          .trust-item-1,
          .trust-item-2,
          .trust-item-3 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[640px] lg:min-h-[720px]">
        {/* Left Column — Text */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-medium tracking-tight text-white leading-[1.15] mb-6">
            Your{" "}
            <span
              className={`inline-block text-[#c8f04a] transition-all duration-200 ${
                fadeState === "in"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1"
              }`}
            >
              {words[wordIndex]}
            </span>
            <br />
            online in minutes.
          </h1>

          <p className="text-base sm:text-lg text-[#a9b0a3] leading-relaxed max-w-xl mb-8 font-normal">
            Add your dishes, print your QR code, and change prices yourself
            whenever you need to.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-9">
            <Link
              href="/auth/sign-up"
              className="w-full sm:w-auto bg-[#c8f04a] text-[#1c2417] font-medium px-6 py-3 rounded-lg text-sm sm:text-base hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Create your menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how"
              className="w-full sm:w-auto border border-white/20 bg-transparent text-[#dfe3da] font-medium px-5 py-3 rounded-lg text-sm sm:text-base hover:bg-white/5 hover:border-white/30 transition-all inline-flex items-center justify-center gap-2"
            >
              <span>See how it works</span>
            </a>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#a9b0a3]">
            <div className="inline-flex items-center gap-2 opacity-0 trust-item-1">
              <Check className="w-4 h-4 text-[#c8f04a] shrink-0" />
              <span>Free up to 20 dishes</span>
            </div>
            <div className="inline-flex items-center gap-2 opacity-0 trust-item-2">
              <Check className="w-4 h-4 text-[#c8f04a] shrink-0" />
              <span>No app for guests</span>
            </div>
            <div className="inline-flex items-center gap-2 opacity-0 trust-item-3">
              <Check className="w-4 h-4 text-[#c8f04a] shrink-0" />
              <span>Live in 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Right Column — Hero Visual */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[620px] rounded-xl overflow-hidden bg-[#161c14] border border-white/10">
            <Image
              src="/hero-restaurant.png"
              alt="Restaurant table scene with QR code table tent and phone showing instant digital menu"
              width={1000}
              height={750}
              priority
              quality={92}
              className="w-full h-auto object-cover object-center"
            />

            {/* Sweep light beam overlay element */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              aria-hidden="true"
            >
              {/* Beam line from phone to QR stand */}
              <div
                className="beam-pulse absolute w-[140px] sm:w-[180px] h-[70px] sm:h-[90px] rounded-full blur-[10px]"
                style={{
                  top: "42%",
                  left: "38%",
                  background:
                    "linear-gradient(135deg, rgba(200,240,74,0.45) 0%, rgba(200,240,74,0.1) 100%)",
                }}
              />

              {/* Corner focus brackets over QR code tent */}
              <div
                className="corner-pulse absolute w-14 h-14 sm:w-18 sm:h-18"
                style={{ top: "34%", left: "46%" }}
              >
                <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#c8f04a]" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#c8f04a]" />
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#c8f04a]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#c8f04a]" />
              </div>
            </div>

            {/* Animated toast status badge */}
            <div className="toast-pulse absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-20 bg-[#10140f]/95 border border-[#c8f04a]/30 rounded-lg px-3.5 py-2.5 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#c8f04a] shrink-0" />
              <div>
                <div className="text-white text-xs font-medium leading-tight">
                  Scan → menu opens instantly
                </div>
                <div className="text-[#a9b0a3] text-[11px] mt-0.5">
                  No app for guests
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

