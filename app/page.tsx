"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Coffee,
  Globe,
  Hotel,
  Layers,
  Loader2,
  Menu,
  MessageSquare,
  QrCode,
  Send,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wine,
  X,
  FileText,
  Clock,
  Sparkle,
} from "lucide-react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { motion } from "motion/react";

const smoothEase = [0.21, 0.47, 0.32, 0.98] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: smoothEase },
};

type Lang = "en" | "mm";

const CONTENT = {
  en: {
    badge: "Pilot Program",
    navHow: "How it works",
    navBenefits: "What you get",
    navWho: "Who can join",
    navDemo: "Live Demo",
    navCta: "Apply for Free Pilot",
    heroBadge: "Limited Spots Open for Myanmar Restaurants",
    heroH1A: "Send us your menu.",
    heroH1B: "We’ll make it digital",
    heroH1C: "— free for a limited time.",
    heroSub: "Join our free pilot and get a professionally set-up digital menu with QR access. No technical work required from you.",
    heroCta: "Apply for Free Pilot",
    heroDemo: "View Live Demo",
    heroMicro: "Limited spots available · 2-month free access",
    mockupTextTheme: "Text Theme",
    mockupTextSub: "No food photos needed",
    mockupPhotoTheme: "Photo Theme",
    mockupPhotoSub: "Visual dish cards",
    problemH2: "Printing new menus every time prices change is",
    problemH2Highlight: "expensive and slow.",
    problemSub: "Updating dishes, adding photos, or switching languages shouldn’t take days.",
    problemBadge: "MOSS MENU handles the setup for you.",
    howTag: "Simple Onboarding",
    howTitle: "From your menu to your customers in",
    howTitleHighlight: "three simple steps.",
    step1Tag: "Step 1",
    step1Title: "Send your menu",
    step1Desc: "Share your current paper menu or PDF with us.",
    step2Tag: "Step 2",
    step2Title: "We set everything up",
    step2Desc: "We build your digital menu, organize categories, add prices and descriptions, and prepare both Text and Photo themes.",
    step3Tag: "Step 3",
    step3Title: "You go live",
    step3Desc: "Once you approve, you receive your QR code. Customers scan and view the menu instantly — no app needed.",
    benefitsTag: "2 Months Free Access",
    benefitsTitle: "Everything included",
    benefitsTitleHighlight: "during the pilot.",
    benefit1Title: "Full managed menu setup",
    benefit1Desc: "We convert and structure your dishes from your existing menu.",
    benefit2Title: "Choice of two presentation styles",
    benefit2DescText: "Text Theme: clean, elegant, no photos required.",
    benefit2DescPhoto: "Photo Theme: visual food cards with dish photos.",
    benefit3Title: "QR code for customers",
    benefit3Desc: "Ready for table tents, stickers, or entrance displays.",
    benefit4Title: "English + Myanmar bilingual support",
    benefit4Desc: "Seamless language toggle for all your diners.",
    benefit5Title: "Restaurant information page",
    benefit5Desc: "Wi-Fi credentials, phone, address, and opening hours.",
    benefit6Title: "Easy updates during pilot period",
    benefit6Desc: "Change prices, mark sold-out items, or adjust descriptions easily.",
    benefitsBottomNote: "2 months of free access · No hidden fees · No technical skills needed",
    whoTag: "Eligibility",
    whoTitle: "Open to every food business",
    whoTitleHighlight: "with a menu.",
    whoBottom: "If you have a menu, you can apply.",
    limitedTag: "Cohort Setup",
    limitedTitle: "Only a limited number of pilot spots.",
    limitedDesc: "We are accepting a small group of restaurants for this pilot so we can provide proper setup and support. Once the spots are filled, the free pilot will close.",
    trustTag: "Zero Friction",
    trustTitle: "Simple. Managed. Professional.",
    trustPoint1: "You send the menu.",
    trustPoint2: "We handle the rest.",
    trustPoint3: "Your customers scan.",
    trustSub1: "No complicated dashboard to learn during the pilot.",
    trustSub2: "No long contracts.",
    trustSub3: "Just a clean digital menu that works.",
    applyTag: "Free 2-Month Pilot Application",
    applyTitle: "Ready to try a better way to",
    applyTitleHighlight: "present your menu?",
    applySub: "Apply now for the free 2-month pilot. Limited spots available.",
    formSuccessTitle: "Thank you!",
    formSuccessDesc: "We've received your application. Our team will review it and contact you within 1–2 working days on Phone or Viber.",
    formReset: "Submit another application",
    lblRestaurant: "Restaurant Name",
    phRestaurant: "e.g. MOSS MENU Bistro",
    lblContact: "Contact Person",
    phContact: "e.g. Alex / Owner",
    lblPhone: "Phone / Viber",
    lblType: "Type of business",
    lblItems: "Approx. Menu Items",
    lblTheme: "Preferred Theme Style",
    lblTownship: "Township or Message",
    phTownship: "e.g. Bahan, Yangon. We have a PDF menu ready to send to MOSS MENU.",
    btnSubmit: "Submit Application",
    btnSubmitting: "Submitting Application...",
    formSupportNote: "We’ll review your application and get back to you within 1–2 working days.",
  },
  mm: {
    badge: "စမ်းသပ်အစီအစဉ်",
    navHow: "အသုံးပြုပုံ",
    navBenefits: "ရရှိမည့်အရာများ",
    navWho: "လျှောက်ထားနိုင်သူများ",
    navDemo: "နမူနာကြည့်ရန်",
    navCta: "အခမဲ့စမ်းသပ်ခွင့်လျှောက်ရန်",
    heroBadge: "မြန်မာနိုင်ငံရှိ စားသောက်ဆိုင်များအတွက် အကန့်အသတ်ဖြင့်သာ",
    heroH1A: "သင့် မီနူးစာအုပ်ကို ပို့ပေးပါ။",
    heroH1B: "ဒစ်ဂျစ်တယ်မီနူး ပြုလုပ်ပေးပါမည်",
    heroH1C: "— အချိန်အကန့်အသတ်ဖြင့် အခမဲ့။",
    heroSub: "ကျွန်ုပ်တို့၏ အခမဲ့ Pilot အစီအစဉ်တွင် ပါဝင်ပြီး QR ကုဒ်ဖြင့် အလွယ်တကူ ကြည့်ရှုနိုင်သော ဒစ်ဂျစ်တယ်မီနူးကို ရယူလိုက်ပါ။ နည်းပညာဆိုင်ရာ အလုပ်များ လုပ်ဆောင်ရန် မလိုပါ။",
    heroCta: "အခမဲ့စမ်းသပ်ခွင့် လျှောက်ထားရန်",
    heroDemo: "နမူနာမီနူး စမ်းကြည့်ရန်",
    heroMicro: "ဆိုင်အရေအတွက် အကန့်အသတ်ဖြင့်သာ · (၂) လ အခမဲ့ အသုံးပြုခွင့်",
    mockupTextTheme: "Text Theme (စာသားပုံစံ)",
    mockupTextSub: "ဟင်းပွဲဓာတ်ပုံ မလိုပါ",
    mockupPhotoTheme: "Photo Theme (ဓာတ်ပုံပုံစံ)",
    mockupPhotoSub: "ဟင်းပွဲပုံများနှင့် တင်ဆက်မှု",
    problemH2: "ဈေးနှုန်းပြောင်းတိုင်း မီနူးအသစ် ရိုက်နှိပ်ရခြင်းသည်",
    problemH2Highlight: "ကုန်ကျစရိတ်များပြီး ကြန့်ကြာစေသည်။",
    problemSub: "ဟင်းပွဲအသစ်ထည့်ခြင်း၊ ဓာတ်ပုံထည့်ခြင်း သို့မဟုတ် ဘာသာစကားပြောင်းခြင်းတို့အတွက် ရက်ပေါင်းများစွာ အချိန်ပေးစရာမလိုပါ။",
    problemBadge: "MOSS MENU က အစအဆုံး စနစ်တကျ ပြုလုပ်ပေးပါသည်။",
    howTag: "လွယ်ကူသော အဆင့်များ",
    howTitle: "သင့် မီနူးမှ ဖောက်သည်များထံသို့",
    howTitleHighlight: "ရိုးရှင်းသော အဆင့် (၃) ဆင့်ဖြင့်။",
    step1Tag: "အဆင့် ၁",
    step1Title: "မီနူးပို့ပေးပါ",
    step1Desc: "လက်ရှိအသုံးပြုနေသော စက္ကူမီနူး သို့မဟုတ် PDF ဖိုင်ကို ကျွန်ုပ်တို့ထံ ပေးပို့ပါ။",
    step2Tag: "အဆင့် ၂",
    step2Title: "ကျွန်ုပ်တို့ အားလုံး ပြင်ဆင်ပေးမည်",
    step2Desc: "အမျိုးအစားများ ခွဲခြားခြင်း၊ ဈေးနှုန်းနှင့် အညွှန်းများထည့်သွင်းခြင်းနှင့် Text & Photo Themes နှစ်မျိုးလုံးအတွက် ပြင်ဆင်ပေးပါသည်။",
    step3Tag: "အဆင့် ၃",
    step3Title: "စတင် အသုံးပြုနိုင်ပါပြီ",
    step3Desc: "အတည်ပြုပြီးပါက သင့်ဆိုင်အတွက် QR ကုဒ် ရရှိမည်ဖြစ်ပြီး ဖောက်သည်များသည် App ဒေါင်းစရာမလိုဘဲ ဖုန်းဖြင့် တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။",
    benefitsTag: "(၂) လ အခမဲ့ အသုံးပြုခွင့်",
    benefitsTitle: "Pilot ကာလအတွင်း",
    benefitsTitleHighlight: "ပါဝင်သည့် ဝန်ဆောင်မှုအားလုံး။",
    benefit1Title: "မီနူးတစ်ခုလုံးကို အပြည့်အစုံ ပြင်ဆင်ပေးခြင်း",
    benefit1Desc: "လက်ရှိ မီနူးမှ ဟင်းပွဲများကို စနစ်တကျ ပြောင်းလဲထည့်သွင်းပေးပါသည်။",
    benefit2Title: "ဒီဇိုင်းပုံစံ (၂) မျိုး ရွေးချယ်နိုင်ခြင်း",
    benefit2DescText: "Text Theme: သပ်ရပ်ပြီး ဟင်းပွဲဓာတ်ပုံ မလိုသော ပုံစံ။",
    benefit2DescPhoto: "Photo Theme: ဟင်းပွဲဓာတ်ပုံများဖြင့် လှပသော ပုံစံ။",
    benefit3Title: "ဆိုင်သုံး QR ကုဒ် ရရှိခြင်း",
    benefit3Desc: "စားပွဲပေါ်တင်ရန် သို့မဟုတ် စတစ်ကာကပ်ရန် အသင့်သုံး QR ကုဒ်။",
    benefit4Title: "အင်္ဂလိပ် + မြန်မာ နှစ်ဘာသာ ထောက်ပံ့မှု",
    benefit4Desc: "ဧည့်သည်များ အလွယ်တကူ ဘာသာစကား ပြောင်းလဲကြည့်ရှုနိုင်ခြင်း။",
    benefit5Title: "ဆိုင်အချက်အလက် စာမျက်နှာ",
    benefit5Desc: "ဆိုင် Wi-Fi၊ ဖုန်းနံပါတ်၊ လိပ်စာနှင့် ဖွင့်ချိန်ပိတ်ချိန်များ ဖော်ပြနိုင်ခြင်း။",
    benefit6Title: "Pilot ကာလအတွင်း အလွယ်တကူ ပြင်ဆင်နိုင်ခြင်း",
    benefit6Desc: "ဈေးနှုန်းပြောင်းလဲခြင်း၊ ကုန်သွားသော ဟင်းပွဲများ ပိတ်ထားခြင်းတို့ကို အလွယ်တကူ လုပ်ဆောင်နိုင်ခြင်း။",
    benefitsBottomNote: "(၂) လ အခမဲ့ အသုံးပြုခွင့် · လျှို့ဝှက်ကြေးမရှိ · နည်းပညာကျွမ်းကျင်စရာမလိုပါ",
    whoTag: "လျှောက်ထားနိုင်သော ဆိုင်များ",
    whoTitle: "မီနူးစာအုပ်ရှိသော စားသောက်ကုန်လုပ်ငန်းတိုင်း",
    whoTitleHighlight: "ပါဝင်နိုင်ပါသည်။",
    whoBottom: "မီနူးစာအုပ်ရှိသော မည်သည့်ဆိုင်မဆို လျှောက်ထားနိုင်ပါသည်။",
    limitedTag: "အဖွဲ့ငယ်ဖြင့် စတင်ခြင်း",
    limitedTitle: "ဆိုင်အရေအတွက် အကန့်အသတ်ဖြင့်သာ လက်ခံပါမည်။",
    limitedDesc: "စနစ်တကျ ဝန်ဆောင်မှုပေးနိုင်ရန်အတွက် ဆိုင်အရေအတွက် အကန့်အသတ်ဖြင့်သာ လက်ခံဆောင်ရွက်ပေးနေပါသည်။ သတ်မှတ်အရေအတွက်ပြည့်ပါက အခမဲ့အစီအစဉ် ပိတ်ပါမည်။",
    trustTag: "စိတ်ချလက်ချ အသုံးပြုနိုင်မှု",
    trustTitle: "ရိုးရှင်းသည်။ စနစ်တကျရှိသည်။ စိတ်ချရသည်။",
    trustPoint1: "မီနူးပေးပို့ရုံသာ။",
    trustPoint2: "ကျန်တာ ကျွန်ုပ်တို့ တာဝန်ယူသည်။",
    trustPoint3: "ဖောက်သည်များ စကင်ဖတ်ရုံသာ။",
    trustSub1: "ရှုပ်ထွေးသော စနစ်များ သင်ယူစရာ မလိုပါ။",
    trustSub2: "နှစ်ရှည်စာချုပ် ချုပ်ဆိုစရာ မလိုပါ။",
    trustSub3: "အမှန်တကယ် အဆင်ပြေပြေ အလုပ်လုပ်သော ဒစ်ဂျစ်တယ်မီနူးတစ်ခုသာ ဖြစ်ပါသည်။",
    applyTag: "(၂) လ အခမဲ့ Pilot လျှောက်လွှာ",
    applyTitle: "သင့် မီနူးကို ပိုမိုကောင်းမွန်သော နည်းလမ်းဖြင့်",
    applyTitleHighlight: "စတင်ပြသရန် အဆင်သင့်ဖြစ်ပြီလား။",
    applySub: "အခမဲ့ (၂) လ Pilot အတွက် ယခုပင် လျှောက်ထားလိုက်ပါ။ အရေအတွက် ကန့်သတ်ထားပါသည်။",
    formSuccessTitle: "ကျေးဇူးတင်ရှိပါသည်!",
    formSuccessDesc: "သင့်လျှောက်လွှာကို လက်ခံရရှိပြီးဖြစ်ပါသည်။ ကျွန်ုပ်တို့အဖွဲ့မှ (၁-၂) ရက်အတွင်း ဖုန်း (သို့) Viber ဖြင့် ဆက်သွယ်ပေးပါမည်။",
    formReset: "နောက်ထပ် လျှောက်လွှာတစ်ခု ထပ်မံပေးပို့ရန်",
    lblRestaurant: "စားသောက်ဆိုင် / ဆိုင်အမည်",
    phRestaurant: "ဥပမာ - MOSS MENU ကဖေး & စားသောက်ဆိုင်",
    lblContact: "ဆက်သွယ်ရမည့် ပုဂ္ဂိုလ်",
    phContact: "ဥပမာ - မန်နေဂျာ / ဆိုင်ရှင်",
    lblPhone: "ဖုန်းနံပါတ် / Viber",
    lblType: "ဆိုင်အမျိုးအစား",
    lblItems: "ခန့်မှန်းခြေ ဟင်းပွဲအရေအတွက်",
    lblTheme: "ကြိုက်နှစ်သက်သော ပုံစံ",
    lblTownship: "မြို့နယ် သို့မဟုတ် မေးမြန်းလိုသည်များ",
    phTownship: "ဥပမာ - ဗဟန်းမြို့နယ်၊ ရန်ကုန်။ MOSS MENU သို့ ပေးပို့ရန် PDF မီနူးအသင့်ရှိပါသည်။",
    btnSubmit: "လျှောက်လွှာ ပေးပို့မည်",
    btnSubmitting: "ပေးပို့နေပါသည်...",
    formSupportNote: "သင့်လျှောက်လွှာကို စိစစ်ပြီး (၁-၂) ရက်အတွင်း အမြန်ဆုံး ဆက်သွယ်ပေးပါမည်။",
  },
};

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = CONTENT[lang];

  // Application form state
  const [restaurantName, setRestaurantName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("Restaurant");
  const [menuItemsCount, setMenuItemsCount] = useState("20–50 items");
  const [preferredTheme, setPreferredTheme] = useState("Not sure yet");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!restaurantName.trim() || !contactName.trim() || !phone.trim()) {
      setSubmitError(
        lang === "mm"
          ? "ကျေးဇူးပြု၍ ဆိုင်အမည်၊ ဆက်သွယ်ရမည့်သူနှင့် ဖုန်းနံပါတ် ဖြည့်သွင်းပေးပါ။"
          : "Please fill in your restaurant name, contact name, and phone / Viber."
      );
      return;
    }

    setSubmitting(true);
    try {
      const formattedNotes = [
        `[Pilot Application - ${lang.toUpperCase()}]`,
        `Business Type: ${businessType}`,
        `Est. Menu Items: ${menuItemsCount}`,
        `Preferred Theme: ${preferredTheme}`,
        message.trim() ? `Additional Notes: ${message.trim()}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_name: restaurantName.trim(),
          contact_name: contactName.trim(),
          phone: phone.trim(),
          city: businessType,
          notes: formattedNotes,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (lang === "mm"
              ? "ပေးပို့ခြင်း မအောင်မြင်ပါ။ Viber သို့မဟုတ် Telegram မှ တိုက်ရိုက် ဆက်သွယ်ပေးပါ။"
              : "Failed to submit. Please reach out to us on Viber or Telegram.")
        );
      }

      setSubmitSuccess(true);
      setRestaurantName("");
      setContactName("");
      setPhone("");
      setMessage("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToApply = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const applyElem = document.getElementById("apply");
    if (applyElem) {
      applyElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#E5E5E1] p-3 sm:p-6 lg:p-8 font-[family-name:var(--font-space-grotesk)] font-sans text-[#121410] antialiased selection:bg-[#C6F24E] selection:text-[#121410] ${
        lang === "mm" ? "landing-mm" : ""
      }`}
    >
      {/* Skip to Main Content Link for Keyboard / Screen Reader Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#121410] focus:text-[#C6F24E] focus:rounded-lg focus:font-semibold focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C6F24E]"
      >
        Skip to content
      </a>

      {/* Outer Rounded White Sheet */}
      <div className="max-w-[1240px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] border border-[#D5D5CF] shadow-xs overflow-hidden">
        
        {/* ====================================================
            NAVIGATION
        ==================================================== */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EAEAE5] px-4 sm:px-10 py-3.5 transition-colors">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 select-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shrink-0"
              aria-label="MOSS MENU Home"
            >
              <span className="w-8 h-8 rounded-lg bg-[#121410] text-[#C6F24E] flex items-center justify-center font-bold text-sm tracking-tight">
                M
              </span>
              <span className="font-semibold text-lg tracking-[-0.02em] text-[#121410]">
                MOSS MENU
              </span>
              <span className="hidden lg:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C6F24E] text-[#121410] border border-[#121410]/15">
                {t.badge}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                {t.navHow}
              </a>
              <a
                href="#pilot-benefits"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                {t.navBenefits}
              </a>
              <a
                href="#who-can-join"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                {t.navWho}
              </a>
              <Link
                href="/menu?demo=true"
                target="_blank"
                className="text-sm font-medium text-[#55584D] hover:text-[#121410] transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                {t.navDemo}
              </Link>
            </nav>

            {/* Right Side: Language Toggle + CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Bilingual Language Switcher */}
              <div className="flex items-center p-0.5 rounded-full bg-[#F3F3EF] border border-[#121410]/15 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    lang === "en"
                      ? "bg-[#121410] text-[#C6F24E] shadow-xs font-bold"
                      : "text-[#55584D] hover:text-[#121410]"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang("mm")}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    lang === "mm"
                      ? "bg-[#121410] text-[#C6F24E] shadow-xs font-bold"
                      : "text-[#55584D] hover:text-[#121410]"
                  }`}
                  aria-label="မြန်မာဘာသာသို့ ပြောင်းရန်"
                >
                  မြန်မာ
                </button>
              </div>

              {/* Desktop CTA */}
              <div className="hidden sm:flex items-center">
                <a
                  href="#apply"
                  onClick={scrollToApply}
                  className="inline-flex items-center justify-center bg-[#121410] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-[10px] text-xs sm:text-sm font-semibold hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shadow-xs shrink-0"
                >
                  {t.navCta}
                </a>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="md:hidden p-2 rounded-[10px] text-[#121410] hover:bg-[#F3F3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 border-t border-[#EAEAE5] mt-3 flex flex-col gap-1.5">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF]"
              >
                {t.navHow}
              </a>
              <a
                href="#pilot-benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF]"
              >
                {t.navBenefits}
              </a>
              <a
                href="#who-can-join"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF]"
              >
                {t.navWho}
              </a>
              <Link
                href="/menu?demo=true"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#121410] py-2.5 px-2.5 min-h-[44px] flex items-center rounded-lg hover:bg-[#F3F3EF]"
              >
                {t.navDemo}
              </Link>
              <div className="pt-2">
                <a
                  href="#apply"
                  onClick={scrollToApply}
                  className="w-full inline-flex items-center justify-center min-h-[44px] bg-[#121410] text-white px-5 py-3 rounded-[10px] text-sm font-semibold hover:bg-[#232720] transition-colors"
                >
                  {t.navCta}
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Landmark */}
        <main id="main-content">

          {/* ====================================================
              1. HERO SECTION
          ==================================================== */}
          <section className="px-6 sm:px-10 lg:px-16 pt-14 pb-16 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="text-center max-w-[880px] mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F3EF] border border-[#121410]/15 mb-6 text-xs font-semibold text-[#121410]">
                <span className="w-2 h-2 rounded-full bg-[#C6F24E] animate-pulse" />
                {t.heroBadge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[#121410] leading-[1.14]">
                {t.heroH1A}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2.5 py-0.5 rounded-[6px] inline-block mt-1 sm:mt-0">
                  {t.heroH1B}
                </span>{" "}
                {t.heroH1C}
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#55584D] max-w-[620px] mx-auto leading-relaxed">
                {t.heroSub}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
                  <a
                    href="#apply"
                    onClick={scrollToApply}
                    className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 shadow-xs active:scale-[0.98]"
                  >
                    {t.heroCta}
                  </a>
                  <Link
                    href="/menu?demo=true"
                    target="_blank"
                    className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 rounded-[10px] bg-white text-[#121410] border-2 border-[#121410] font-semibold text-sm hover:bg-[#F3F3EF] transition-colors active:scale-[0.98]"
                  >
                    {t.heroDemo}
                  </Link>
                </div>
                <p className="text-xs text-[#55584D] font-medium tracking-wide mt-1">
                  {t.heroMicro}
                </p>
              </div>
            </motion.div>

            {/* Hero Visual: Two presentation themes on display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
              className="mt-14 sm:mt-18 relative max-w-[640px] mx-auto flex items-center justify-center"
            >
              {/* Tabletop Pedestal Card */}
              <div
                className="w-[330px] h-[280px] sm:w-[520px] sm:h-[330px] rounded-[28px] sm:rounded-[36px] bg-[#F3F3EF] border-2 border-[#121410] shadow-[0_6px_0_#121410] absolute inset-0 m-auto -z-0 pointer-events-none"
                aria-hidden="true"
              >
                <div className="absolute inset-2 sm:inset-3 rounded-[20px] sm:rounded-[28px] border border-[#121410]/10 pointer-events-none" />
              </div>

              {/* Four-point star accent */}
              <div
                className="absolute -top-3 left-6 sm:left-12 z-20 pointer-events-none"
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#121410">
                  <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
                </svg>
              </div>

              {/* Lime dot accent */}
              <div
                className="absolute bottom-6 right-8 sm:right-16 w-3.5 h-3.5 rounded-full bg-[#C6F24E] border border-[#121410]/20 z-20 shadow-xs pointer-events-none"
                aria-hidden="true"
              />

              {/* Phone Mockups: Photo Theme vs Text Theme */}
              <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-6 py-6 sm:py-8">
                
                {/* Phone 1: Text Theme (Editorial / Botanical Archive) */}
                <motion.div
                  whileHover={{ scale: 1.025, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-[170px] sm:w-[220px] bg-[#F5F7F4] border-2 border-[#1A2E26] rounded-[24px] sm:rounded-[30px] p-3 shadow-[0_5px_0_#1A2E26] flex flex-col justify-between transform -rotate-2 cursor-default select-none"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E7DF]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#8C7A4B] inline-block" />
                      <span className="text-[10px] font-bold text-[#1A2E26] font-serif">Shan Archive</span>
                    </div>
                    <span className="text-[8.5px] font-medium text-[#8C7A4B] font-serif italic">{t.mockupTextTheme}</span>
                  </div>
                  <div className="py-2 space-y-1.5 font-serif">
                    <div className="pb-1 border-b border-dashed border-[#E2E7DF]">
                      <div className="flex justify-between items-baseline text-[10px]">
                        <span className="font-bold text-[#1A2E26]">Shan Noodles</span>
                        <span className="text-[#8C7A4B] font-sans text-[9px] font-semibold">3,500 Ks</span>
                      </div>
                      <p className="text-[8px] text-[#4A5D54] font-sans">Traditional warm broth</p>
                    </div>
                    <div className="pb-1 border-b border-dashed border-[#E2E7DF]">
                      <div className="flex justify-between items-baseline text-[10px]">
                        <span className="font-bold text-[#1A2E26]">Tea Leaf Salad</span>
                        <span className="text-[#8C7A4B] font-sans text-[9px] font-semibold">4,000 Ks</span>
                      </div>
                      <p className="text-[8px] text-[#4A5D54] font-sans">Fermented tea & crisp nuts</p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-[#E2E7DF] text-center">
                    <span className="text-[8.5px] font-medium text-[#4A5D54]">{t.mockupTextSub}</span>
                  </div>
                </motion.div>

                {/* Phone 2: Photo Theme (Classic) */}
                <motion.div
                  whileHover={{ scale: 1.025, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-[170px] sm:w-[220px] bg-white border-2 border-[#121410] rounded-[24px] sm:rounded-[30px] p-3 shadow-[0_5px_0_#C6F24E] flex flex-col justify-between transform rotate-2 cursor-default select-none"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEAE5]">
                    <span className="text-[10px] font-bold text-[#121410]">Golden Spoon</span>
                    <span className="text-[8.5px] font-bold text-[#121410] bg-[#C6F24E] px-1.5 py-0.2 rounded">{t.mockupPhotoTheme}</span>
                  </div>
                  <div className="py-2.5 space-y-2">
                    <div className="bg-[#F3F3EF] rounded-xl p-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#E0E2D8] flex items-center justify-center text-[10px]">🍲</div>
                      <div>
                        <p className="text-[10px] font-bold text-[#121410]">Grilled Fish</p>
                        <p className="text-[9px] font-semibold text-[#55584D]">9,000 Ks</p>
                      </div>
                    </div>
                    <div className="bg-[#F3F3EF] rounded-xl p-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#E0E2D8] flex items-center justify-center text-[10px]">🍜</div>
                      <div>
                        <p className="text-[10px] font-bold text-[#121410]">Moffingah</p>
                        <p className="text-[9px] font-semibold text-[#55584D]">2,500 Ks</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#EAEAE5] text-center">
                    <span className="text-[8.5px] font-medium text-[#55584D]">{t.mockupPhotoSub}</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </section>

          {/* ====================================================
              2. PROBLEM / AGITATION (Short)
          ==================================================== */}
          <section className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-14 sm:py-18 border-t border-b border-[#D5D5CF]">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.problemH2}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  {t.problemH2Highlight}
                </span>
              </h2>
              <p className="mt-4 text-[#55584D] text-base sm:text-lg leading-relaxed max-w-[640px] mx-auto">
                {t.problemSub}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#121410] bg-white border border-[#121410] px-4 py-2 rounded-xl shadow-[0_2px_0_#121410]">
                <Sparkles className="w-4 h-4 text-[#8C7A4B]" />
                {t.problemBadge}
              </div>
            </motion.div>
          </section>

          {/* ====================================================
              3. HOW IT WORKS
          ==================================================== */}
          <section id="how-it-works" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center mb-12 sm:mb-16"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#55584D] mb-2">
                {t.howTag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.howTitle}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  {t.howTitleHighlight}
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1020px] mx-auto">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.05, ease: smoothEase }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center border border-[#121410]/20 mb-5">
                    1
                  </span>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#55584D] mb-1">
                    {t.step1Tag}
                  </div>
                  <h3 className="text-xl font-bold text-[#121410]">{t.step1Title}</h3>
                  <p className="text-[#55584D] text-sm mt-2.5 leading-relaxed">
                    {t.step1Desc}
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.15, ease: smoothEase }}
                whileHover={{ y: -4 }}
                className="bg-[#121410] text-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#C6F24E] hover:shadow-[0_8px_0_#C6F24E] transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center mb-5">
                    2
                  </span>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A4A89C] mb-1">
                    {t.step2Tag}
                  </div>
                  <h3 className="text-xl font-bold text-white">{t.step2Title}</h3>
                  <p className="text-[#E0E2D8] text-sm mt-2.5 leading-relaxed">
                    {t.step2Desc}
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.25, ease: smoothEase }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-[#121410] rounded-3xl p-7 shadow-[0_5px_0_#121410] hover:shadow-[0_8px_0_#121410] transition-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="w-9 h-9 rounded-lg bg-[#C6F24E] text-[#121410] font-bold text-sm flex items-center justify-center border border-[#121410]/20 mb-5">
                    3
                  </span>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#55584D] mb-1">
                    {t.step3Tag}
                  </div>
                  <h3 className="text-xl font-bold text-[#121410]">{t.step3Title}</h3>
                  <p className="text-[#55584D] text-sm mt-2.5 leading-relaxed">
                    {t.step3Desc}
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ====================================================
              4. WHAT YOU GET IN THE FREE PILOT
          ==================================================== */}
          <section id="pilot-benefits" className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-24 border-t border-b border-[#D5D5CF]">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center mb-12 sm:mb-16"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#121410]/15 mb-3 text-xs font-bold text-[#121410]">
                <Clock className="w-3.5 h-3.5 text-[#8C7A4B]" />
                {t.benefitsTag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.benefitsTitle}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  {t.benefitsTitleHighlight}
                </span>
              </h2>
            </motion.div>

            <div className="max-w-[880px] mx-auto bg-white border-2 border-[#121410] rounded-3xl p-6 sm:p-10 shadow-[0_6px_0_#121410]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit1Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">{t.benefit1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit2Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">
                      <span className="font-semibold text-[#121410]">{t.benefit2DescText}</span><br />
                      <span className="font-semibold text-[#121410]">{t.benefit2DescPhoto}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit3Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">{t.benefit3Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit4Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">{t.benefit4Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit5Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">{t.benefit5Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#121410]">{t.benefit6Title}</h4>
                    <p className="text-xs text-[#55584D] mt-0.5">{t.benefit6Desc}</p>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-[#EAEAE5] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm font-semibold text-[#121410] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C6F24E]" />
                  {t.benefitsBottomNote}
                </div>
                <a
                  href="#apply"
                  onClick={scrollToApply}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-[10px] bg-[#121410] text-white font-semibold text-xs hover:bg-[#232720] transition-colors"
                >
                  {t.navCta} →
                </a>
              </div>
            </div>
          </section>

          {/* ====================================================
              5. WHO CAN JOIN
          ==================================================== */}
          <section id="who-can-join" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center mb-12"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#55584D] mb-2">
                {t.whoTag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.whoTitle}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  {t.whoTitleHighlight}
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-[1020px] mx-auto">
              {[
                { titleEn: "Cafés", titleMm: "ကဖေးဆိုင်များ", icon: Coffee },
                { titleEn: "Restaurants", titleMm: "စားသောက်ဆိုင်များ", icon: UtensilsCrossed },
                { titleEn: "Hotel Restaurants", titleMm: "ဟိုတယ်စားသောက်ဆိုင်", icon: Hotel },
                { titleEn: "Bars & Lounges", titleMm: "ဘား & လောင်းဂျ်", icon: Wine },
                { titleEn: "Bakeries & Desserts", titleMm: "မုန့်တိုက် & အချိုပွဲ", icon: Sparkles },
                { titleEn: "Paper & PDF Menus", titleMm: "စက္ကူ/PDF မီနူးဆိုင်များ", icon: FileText },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.titleEn}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: idx * 0.05, ease: smoothEase }}
                    className="bg-white border-2 border-[#121410] rounded-2xl p-4 text-center shadow-[0_4px_0_#121410] flex flex-col items-center justify-center gap-2.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F3F3EF] text-[#121410] flex items-center justify-center border border-[#121410]/10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#121410] leading-tight">
                      {lang === "mm" ? item.titleMm : item.titleEn}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-sm font-semibold text-[#121410] text-center mt-8">
              {t.whoBottom}
            </p>
          </section>

          {/* ====================================================
              6. LIMITED AVAILABILITY (Callout Card)
          ==================================================== */}
          <section className="px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="max-w-[840px] mx-auto bg-[#121410] text-white rounded-3xl p-8 sm:p-12 text-center border-2 border-[#121410] shadow-[0_6px_0_#C6F24E]"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C6F24E] text-xs font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-[#C6F24E]" />
                {t.limitedTag}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.025em] text-white leading-tight">
                {t.limitedTitle}
              </h2>
              <p className="mt-4 text-[#A4A89C] text-sm sm:text-base leading-relaxed max-w-[580px] mx-auto">
                {t.limitedDesc}
              </p>
              <div className="mt-6">
                <a
                  href="#apply"
                  onClick={scrollToApply}
                  className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[10px] bg-[#C6F24E] text-[#121410] font-semibold text-sm hover:bg-[#b5e03e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F24E] focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  {t.navCta}
                </a>
              </div>
            </motion.div>
          </section>

          {/* ====================================================
              7. TRUST / REASSURANCE
          ==================================================== */}
          <section className="bg-[#F3F3EF] px-6 sm:px-10 lg:px-16 py-16 sm:py-20 border-t border-b border-[#D5D5CF]">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center mb-10"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#55584D] mb-1">
                {t.trustTag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.trustTitle}
              </h2>
            </motion.div>

            <div className="max-w-[720px] mx-auto bg-white border-2 border-[#121410] rounded-3xl p-7 sm:p-9 shadow-[0_5px_0_#121410] text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-bold text-[#121410]">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#8C7A4B]" /> {t.trustPoint1}
                </span>
                <span className="hidden sm:inline text-[#D5D5CF]">·</span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#8C7A4B]" /> {t.trustPoint2}
                </span>
                <span className="hidden sm:inline text-[#D5D5CF]">·</span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#8C7A4B]" /> {t.trustPoint3}
                </span>
              </div>

              <div className="pt-4 border-t border-[#EAEAE5] text-xs sm:text-sm text-[#55584D] leading-relaxed space-y-1">
                <p>{t.trustSub1}</p>
                <p>{t.trustSub2}</p>
                <p className="font-semibold text-[#121410]">{t.trustSub3}</p>
              </div>
            </div>
          </section>

          {/* ====================================================
              8. APPLICATION FORM / FINAL CTA
          ==================================================== */}
          <section id="apply" className="px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
            <motion.div
              {...fadeInUp}
              className="max-w-[760px] mx-auto text-center mb-10"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6F24E] border border-[#121410]/15 mb-3 text-xs font-bold text-[#121410]">
                {t.applyTag}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#121410] leading-tight">
                {t.applyTitle}{" "}
                <span className="bg-[#C6F24E] text-[#121410] px-2 py-0.5 rounded-[6px] inline-block">
                  {t.applyTitleHighlight}
                </span>
              </h2>
              <p className="mt-3 text-[#55584D] text-base leading-relaxed">
                {t.applySub}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="max-w-[620px] mx-auto bg-white border-2 border-[#121410] rounded-3xl p-6 sm:p-9 shadow-[0_5px_0_#121410]"
            >
              {submitSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#C6F24E] text-[#121410] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#121410]">{t.formSuccessTitle}</h3>
                  <p className="text-sm text-[#55584D] max-w-[420px] mx-auto leading-relaxed">
                    {t.formSuccessDesc}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 text-xs font-semibold text-[#121410] underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] py-1 px-1.5 inline-block active:scale-[0.98]"
                  >
                    {t.formReset}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="app-restaurant" className="block text-xs font-bold text-[#121410] mb-1.5">
                      {t.lblRestaurant} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="app-restaurant"
                      type="text"
                      required
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder={t.phRestaurant}
                      className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="app-contact" className="block text-xs font-bold text-[#121410] mb-1.5">
                        {t.lblContact} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="app-contact"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.phContact}
                        className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="app-phone" className="block text-xs font-bold text-[#121410] mb-1.5">
                        {t.lblPhone} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="app-phone"
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09..."
                        className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="app-type" className="block text-xs font-bold text-[#121410] mb-1.5">
                        {t.lblType}
                      </label>
                      <select
                        id="app-type"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                      >
                        <option value="Café">{lang === "mm" ? "ကဖေးဆိုင်" : "Café"}</option>
                        <option value="Restaurant">{lang === "mm" ? "စားသောက်ဆိုင်" : "Restaurant"}</option>
                        <option value="Hotel Restaurant">{lang === "mm" ? "ဟိုတယ် စားသောက်ဆိုင်" : "Hotel Restaurant"}</option>
                        <option value="Bar & Lounge">{lang === "mm" ? "ဘား & လောင်းဂျ်" : "Bar & Lounge"}</option>
                        <option value="Bakery & Dessert">{lang === "mm" ? "မုန့်တိုက် & အချိုပွဲ" : "Bakery & Dessert"}</option>
                        <option value="Other">{lang === "mm" ? "အခြား စားသောက်ကုန်လုပ်ငန်း" : "Other food business"}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="app-items" className="block text-xs font-bold text-[#121410] mb-1.5">
                        {t.lblItems}
                      </label>
                      <select
                        id="app-items"
                        value={menuItemsCount}
                        onChange={(e) => setMenuItemsCount(e.target.value)}
                        className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                      >
                        <option value="Under 20 items">{lang === "mm" ? "ဟင်းပွဲ ၂၀ အောက်" : "Under 20 items"}</option>
                        <option value="20–50 items">{lang === "mm" ? "ဟင်းပွဲ ၂၀ မှ ၅၀ ကြား" : "20–50 items"}</option>
                        <option value="50–100 items">{lang === "mm" ? "ဟင်းပွဲ ၅၀ မှ ၁၀၀ ကြား" : "50–100 items"}</option>
                        <option value="100+ items">{lang === "mm" ? "ဟင်းပွဲ ၁၀၀ နှင့်အထက်" : "100+ items"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="app-theme" className="block text-xs font-bold text-[#121410] mb-1.5">
                      {t.lblTheme}
                    </label>
                    <select
                      id="app-theme"
                      value={preferredTheme}
                      onChange={(e) => setPreferredTheme(e.target.value)}
                      className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium min-h-[48px]"
                    >
                      <option value="Not sure yet">{lang === "mm" ? "မသေချာသေးပါ (ကူညီရွေးချယ်ပေးပါ)" : "Not sure yet (Help us decide)"}</option>
                      <option value="Text Theme">{lang === "mm" ? "Text Theme (သပ်ရပ်သော စာသားပုံစံ၊ ဓာတ်ပုံမလို)" : "Text Theme (Clean editorial, no photos needed)"}</option>
                      <option value="Photo Theme">{lang === "mm" ? "Photo Theme (ဟင်းပွဲဓာတ်ပုံများဖြင့် ပုံစံ)" : "Photo Theme (Visual cards with dish photos)"}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="app-message" className="block text-xs font-bold text-[#121410] mb-1.5">
                      {t.lblTownship} <span className="text-[11px] font-normal text-[#55584D]">{lang === "mm" ? "(စိတ်ကြိုက်)" : "(optional)"}</span>
                    </label>
                    <textarea
                      id="app-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.phTownship}
                      className="w-full bg-[#F3F3EF] border border-[#D5D5CF] rounded-xl px-4 py-3 text-sm text-[#121410] placeholder:text-[#55584D] focus:outline-none focus:ring-2 focus:ring-[#121410] transition-all font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full min-h-[48px] px-6 py-3.5 rounded-[10px] bg-[#121410] text-white font-semibold text-sm hover:bg-[#232720] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121410] focus-visible:ring-offset-2 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.btnSubmitting}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t.btnSubmit}
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#55584D] text-center mt-2.5">
                      {t.formSupportNote}
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </section>

        </main>

        {/* ====================================================
            9. FOOTER
        ==================================================== */}
        <footer className="px-4 sm:px-8 pb-8" aria-label="Site Footer">
          <div className="rounded-3xl overflow-hidden border-2 border-[#121410] shadow-[0_5px_0_#121410]">
            <HalftoneWordmarkFooter
              wordmark="mossmenu"
              label="MOSS MENU"
              meta="A managed digital menu service by ATER"
              palette={{
                background: "#121410",
                ink: "#F6F3EA",
                warm: "#C6F24E",
              }}
              fontFamily='"Fraunces", Georgia, serif'
              fontWeight={900}
              height="480px"
              columns={[
                {
                  title: lang === "mm" ? "Pilot အစီအစဉ်" : "Pilot Program",
                  links: [
                    { label: t.navHow, href: "#how-it-works" },
                    { label: t.navBenefits, href: "#pilot-benefits" },
                    { label: t.navWho, href: "#who-can-join" },
                    { label: t.navCta, href: "#apply" },
                  ],
                },
                {
                  title: lang === "mm" ? "နမူနာကြည့်ရှုရန်" : "Live Preview",
                  links: [
                    { label: lang === "mm" ? "နမူနာ မီနူး စမ်းကြည့်ရန်" : "Explore live demo menu", href: "/menu?demo=true" },
                  ],
                },
                {
                  title: lang === "mm" ? "တိုက်ရိုက် ဆက်သွယ်ရန်" : "Direct Contact",
                  links: [
                    { label: "Viber: 09 969 069 005", href: "viber://chat?number=%2B959969069005" },
                    { label: "Telegram Support", href: "https://t.me/mossqrSupport" },
                    { label: "Website: getmossqr.com", href: "https://getmossqr.com" },
                  ],
                },
              ]}
            />
          </div>
        </footer>

      </div>
    </div>
  );
}
