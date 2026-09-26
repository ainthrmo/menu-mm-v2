"use client";

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
        borderRadius: 30,
        border: "1px solid rgba(43,42,38,0.18)",
        background: "#24241F",
        width: 204,
        padding: "9px 7px 12px",
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
          width: 48,
          height: 5,
          background: "#171713",
          borderRadius: 8,
          margin: "0 auto 8px",
        }}
      />
      {/* Screen */}
      <div
        style={{
          background: "#FBFAF6",
          borderRadius: 23,
          overflow: "hidden",
          minHeight: 348,
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

import { HeroSection } from "@/components/ui/hero-section-6";

export default function Hero() {
  const { language, t } = useLanguage();
  const h = t.japandiHero ?? {
    headlineLine1: "Still reprinting your menu every time the price changes?",
    headlineLine2: "Update it directly with",
    brandName: "Moss.",
    sub: "MOSSQR gives your restaurant a digital menu you can update from your phone. Change prices, dishes, photos, or availability without printing a new menu every time.",
    cta1: "Start 30 Days Free",
    cta2: "View Live Demo",
    support: "No app required for your customers. Scan. Open. Browse.",
  };

  const bullets = language === "my" ? [
    "ဖုန်းထဲမှ ချက်ချင်းပြင်ဆင်နိုင်ခြင်း",
    "မြန်မာ / အင်္ဂလိပ် ၂ မျိုးပြသနိုင်ခြင်း",
    "Customer ဘက်မှ App ဒေါင်းရန်မလိုခြင်း",
  ] : [
    "Instant price updates from phone",
    "Bilingual EN / မြန်မာ support",
    "No app required for customers",
  ];

  const bannerText = language === "my" 
    ? "စားသောက်ဆိုင်များအတွက် ဒစ်ဂျစ်တယ် QR မီနူး" 
    : "Digital QR menus built for restaurants";

  return (
    <div className="relative w-full">
      <HeroSection
        title={h.headlineLine1}
        highlight={h.brandName}
        description={h.sub}
        bannerBadge={language === "my" ? "အသစ်" : "New"}
        bannerText={bannerText}
        bannerHref="#solution"
        ctaText={h.cta1}
        ctaHref="/auth/sign-up"
        loginHref="/auth/login"
        bullets={bullets}
        language={language as "en" | "my"}
        withNav={false}
      />
<<<<<<< HEAD

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1120,
          margin: "0 auto",
          padding: "72px 40px 64px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 56px,
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

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 400,
              fontSize: 50,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#2B2A26",
              margin: 0,
              maxWidth: 500,
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
                background: "#2F4F12",
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
              href="/examples"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "transparent",
                border: "1px solid rgba(43,42,38,0.16)",
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
            height: 440,
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
            style={{ left: "calc(50% - 218px)", top: 22 }}
          >
            <MenuListScreen lang={language} />
          </PhoneMockup>

          {/* Phone 2 — front right, dessert detail */}
          <PhoneMockup
            rotation={3}
            shadow="8px 16px 40px rgba(43,42,38,0.22)"
            style={{ left: "calc(50% - 68px)", top: 0 }}
          >
            <DessertDetailScreen lang={language} />
          </PhoneMockup>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-inner {
            flex-direction: column !important;
            padding: 52px 20px 36px !important;
          }
          .hero-inner > div:last-child {
            height: 390px !important;
            width: 100%;
            max-width: 430px;
          }
          .hero-inner h1 { font-size: 40px !important; line-height: 1.08 !important; }
        }
      `}</style>
    </section>
=======
    </div>
>>>>>>> 0bb1adc (landing page update)
  );
}




