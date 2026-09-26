"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
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

  const bullets =
    language === "my"
      ? [
          "ဖုန်းထဲမှ ချက်ချင်းပြင်ဆင်နိုင်ခြင်း",
          "မြန်မာ / အင်္ဂလိပ် ၂ မျိုးပြသနိုင်ခြင်း",
          "Customer ဘက်မှ App ဒေါင်းရန်မလိုခြင်း",
        ]
      : [
          "Instant price updates from phone",
          "Bilingual EN / မြန်မာ support",
          "No app required for customers",
        ];

  const bannerText =
    language === "my"
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
    </div>
  );
}
