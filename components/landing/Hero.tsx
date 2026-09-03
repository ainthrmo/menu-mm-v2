"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// ─── Phone Mockup sub-component ─────────────────────────────────────────────

function PhoneMockup({
  rotation,
  style,
  shadow,
  children,
}: {
  rotation: number;
  style?: React.CSSProperties;
  shadow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
        borderRadius: 28,
        border: "2.5px solid #2B2A26",
        background: "#2B2A26",
        width: 190,
        padding: "10px 8px 14px",
        boxShadow: shadow ?? "none",
        flexShrink: 0,
        position: "absolute",
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Notch */}
      <div
        style={{
          width: 52,
          height: 6,
          background: "#2B2A26",
          borderRadius: 8,
          margin: "0 auto 8px",
        }}
      />
      {/* Screen */}
      <div
        style={{
          background: "#FBFAF6",
          borderRadius: 18,
          overflow: "hidden",
          minHeight: 320,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Menu list screen ────────────────────────────────────────────────────────

function MenuListScreen({ lang }: { lang: "en" | "my" }) {
  const dishes = [
    {
      name: lang === "my" ? "သိုးသားရာဂူ" : "Lamb ragu",
      kcal: lang === "my" ? "၅၂၀ ကယ်လိုရီ" : "520 kcal",
      bg: "#C4694E",
    },
    {
      name: lang === "my" ? "ဆေးမွှေးကြက်" : "Herb chicken",
      kcal: lang === "my" ? "၄၁၀ ကယ်လိုရီ" : "410 kcal",
      bg: "#7D8C48",
    },
    {
      name: lang === "my" ? "မှိုတင်မုန့်" : "Mushroom toast",
      kcal: lang === "my" ? "၃၁၀ ကယ်လိုရီ" : "310 kcal",
      bg: "#C4A882",
    },
  ];

  return (
    <div style={{ padding: "14px 12px 10px", fontFamily: "'Inter', sans-serif" }}>
      <p
        style={{
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(43,42,38,0.45)",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {lang === "my" ? "ကောရာ ဘစ်ထရို" : "Koura Bistro"}
      </p>
      <p style={{ fontSize: 12, fontWeight: 500, color: "#2B2A26", marginBottom: 12 }}>
        {lang === "my" ? "ညစာမီနူး" : "Dinner menu"}
      </p>

      {dishes.map((d) => (
        <div
          key={d.name}
          style={{ borderRadius: 10, overflow: "hidden", marginBottom: 8, background: "#fff" }}
        >
          <div
            style={{
              height: 60,
              background: d.bg,
              display: "flex",
              alignItems: "flex-end",
              padding: "0 8px 6px",
            }}
          >
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
              {d.kcal}
            </span>
          </div>
          <div style={{ padding: "6px 8px 8px" }}>
            <p style={{ fontSize: 10, fontWeight: 500, color: "#2B2A26", margin: 0 }}>{d.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Dessert detail screen ───────────────────────────────────────────────────

function DessertDetailScreen({ lang }: { lang: "en" | "my" }) {
  const related = [
    { name: lang === "my" ? "သံပရာတာ့ট" : "Lemon tart", bg: "#E6C97A" },
    { name: lang === "my" ? "ပန်နာကော်တာ" : "Panna cotta", bg: "#D9BFA8" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          height: 130,
          background: "#C2677A",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 12px 10px",
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#FBFAF6",
            fontFamily: "Georgia, serif",
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {lang === "my" ? "သစ်တော်သီး\nမူး" : "Raspberry\nmousse"}
        </p>
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontSize: 8, color: "rgba(43,42,38,0.5)", marginBottom: 10, lineHeight: 1.5 }}>
          {lang === "my"
            ? "သစ်တော်သီးနဲ့ ခရင်မ် ချမ်းအောင် အမွှေးနဲ့ ဆောင်ပေးသည်။"
            : "Fresh raspberry with cream, served chilled with mint."}
        </p>

        <p
          style={{
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(43,42,38,0.4)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {lang === "my" ? "တခြားဟင်းပွဲ" : "Also available"}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {related.map((r) => (
            <div key={r.name} style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: 42, background: r.bg }} />
              <div style={{ padding: "4px 6px 6px" }}>
                <p style={{ fontSize: 8, fontWeight: 500, color: "#2B2A26", margin: 0 }}>
                  {r.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero component ──────────────────────────────────────────────────────────

export default function Hero() {
  const { language, t } = useLanguage();
  const h = t.japandiHero ?? {
     headlineLine1: "Keep your paper menu.",
    headlineLine2: "Update it through",
    brandName: "Moss",
    cta1: "Try Moss free",
    cta2: "See an example",
  };

  return (
    <section
      aria-label="Hero section"
      style={{ background: "#F4F1EA", position: "relative", overflow: "hidden" }}
    >
      {/* Decorative soft circle accent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "#E1E8CE",
          opacity: 0.6,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          padding: "56px 40px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
        }}
        className="hero-inner"
      >
        {/* ── LEFT COLUMN ──────────────────────────────────────── */}
        <div
          style={{
            flex: "1 1 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          {/* Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#E1E8CE",
              color: "#3B6D11",
              fontSize: 12,
              fontWeight: 500,
              padding: "5px 12px",
              borderRadius: 20,
              lineHeight: 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 10C2 10 3.5 7 6 5.5C8.5 4 10.5 3 10.5 3C10.5 3 10 5.5 8 7.5C6 9.5 4 10.5 2 10Z"
                fill="#3B6D11"
              />
              <path d="M6 5.5L4 9" stroke="#3B6D11" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            {h.badge}
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 400,
              fontSize: 44,
              lineHeight: 1.2,
              color: "#2B2A26",
              margin: 0,
              maxWidth: 460,
            }}
          >
            {h.headlineLine1}
            <br />
            {h.headlineLine2}{" "}
            <span style={{ color: "#3B6D11" }}>{h.brandName}</span>
          </h1>

          {/* Button row */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/auth/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#3B6D11",
                color: "#F4F1EA",
                fontWeight: 500,
                fontSize: 14,
                padding: "12px 24px",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
                transition: "opacity 0.15s",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {h.cta1}
            </Link>

            <a
              href="#examples"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "transparent",
                border: "0.5px solid rgba(43,42,38,0.25)",
                color: "#2B2A26",
                fontWeight: 500,
                fontSize: 14,
                padding: "12px 22px",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "'Inter', sans-serif",
                transition: "border-color 0.15s",
                lineHeight: 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(43,42,38,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(43,42,38,0.25)")}
            >
              {h.cta2}
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN — phone mockups ─────────────────────── */}
        <div
          style={{
            flex: "1 1 0",
            position: "relative",
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          {/* Phone 1 — back left, menu list */}
          <PhoneMockup
            rotation={-4}
            shadow="4px 8px 24px rgba(43,42,38,0.14)"
            style={{ left: "calc(50% - 210px)", top: 20 }}
          >
            <MenuListScreen lang={language} />
          </PhoneMockup>

          {/* Phone 2 — front right, dessert detail */}
          <PhoneMockup
            rotation={3}
            shadow="8px 16px 40px rgba(43,42,38,0.22)"
            style={{ left: "calc(50% - 60px)", top: 0 }}
          >
            <DessertDetailScreen lang={language} />
          </PhoneMockup>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-inner {
            flex-direction: column !important;
            padding: 48px 24px 40px !important;
          }
          .hero-inner > div:last-child {
            height: 360px !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
