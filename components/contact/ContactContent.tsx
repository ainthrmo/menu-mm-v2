"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  PhoneCall,
  Send,
  Loader2,
  HelpCircle,
  Sparkles,
  Layers,
  UtensilsCrossed,
} from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FB_PAGE_URL =
  process.env.NEXT_PUBLIC_MOSS_FB_PAGE_URL ||
  process.env.NEXT_PUBLIC_MENUU_FB_PAGE_URL ||
  "https://www.facebook.com/getmossqr/";

const VIBER_URL =
  process.env.NEXT_PUBLIC_MOSS_VIBER_URL ||
  process.env.NEXT_PUBLIC_MENUU_VIBER_URL ||
  "viber://chat?number=%2B959969069005";

const CONTACT_PHONE = "09969069005";
const CONTACT_EMAIL = "contact@getmossqr.com";

const TOPIC_OPTIONS = [
  "I want to learn about MOSSQR",
  "Pricing question",
  "Request a demo",
  "Setup help",
  "Custom menu",
  "Other",
] as const;

export default function ContactContent() {
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [topic, setTopic] = useState<string>(TOPIC_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim() || !restaurantName.trim() || !contactInfo.trim()) {
      setSubmitError(
        language === "my"
          ? "ကျေးဇူးပြု၍ အမည်၊ စားသောက်ဆိုင်အမည်နှင့် ဆက်သွယ်ရန် ဖုန်း သို့မဟုတ် အီးမေးလ် ထည့်သွင်းပေးပါ။"
          : "Please provide your name, restaurant name, and email or phone number."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_name: restaurantName.trim(),
          contact_name: name.trim(),
          phone: contactInfo.trim(),
          notes: `[Topic: ${topic}] ${message.trim()}`,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit message. Please try again.");
      }

      setSubmitSuccess(true);
      setName("");
      setRestaurantName("");
      setContactInfo("");
      setTopic(TOPIC_OPTIONS[0]);
      setMessage("");
    } catch (err: any) {
      setSubmitError(err?.message || "An unexpected error occurred. Please reach out via Facebook or email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTopicFromCard = (selectedTopic: string) => {
    setTopic(selectedTopic);
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-editorial-root min-h-screen bg-[var(--stone)] text-[var(--ink)] antialiased overflow-x-hidden selection:bg-[var(--lime)] selection:text-[var(--ink)]">
      <style jsx global>{`
        .landing-editorial-root {
          --stone: #f6f2e8;
          --stone-2: #efe9da;
          --moss-deep: #1b2414;
          --moss-mid: #556036;
          --ink: #1e2417;
          --sub: #57604f;
          --lime: #c8f04a;
          --lime-hover: #bde63d;
          --border: rgba(30, 36, 23, 0.12);
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.55;
        }

        .font-fraunces {
          font-family: "Fraunces", Georgia, serif;
          font-weight: 600;
        }

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

        .btn-editorial-outline {
          border: 1px solid var(--border);
          color: var(--ink);
          background: transparent;
        }

        .btn-editorial-outline:hover {
          background: var(--stone-2);
          border-color: rgba(30, 36, 23, 0.25);
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

        .contact-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 20px;
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-card:hover {
          border-color: rgba(30, 36, 23, 0.24);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(30, 36, 23, 0.05);
        }
      `}</style>

      {/* TOP NAVIGATION */}
      <LandingNavbar />

      <main>
        {/* 1. HERO SECTION */}
        <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 px-6 sm:px-8 max-w-[1040px] mx-auto text-center">
          <div className="max-w-[720px] mx-auto space-y-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--moss-mid)] px-3 py-1 rounded-full border border-[rgba(85,96,54,0.25)] bg-[rgba(85,96,54,0.07)]">
              {language === "my" ? "ဆက်သွယ်ရန်" : "Get in touch"}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-fraunces font-semibold text-[var(--ink)] leading-[1.18] tracking-tight">
              {language === "my" ? "သင့်စားသောက်ဆိုင်မီနူးအတွက် ဆွေးနွေးကြစို့။" : "Let's talk about your menu."}
            </h1>

            <p className="text-sm sm:text-base text-[var(--sub)] font-normal leading-relaxed max-w-[620px] mx-auto">
              {language === "my"
                ? "MOSSQR၊ ဈေးနှုန်း သို့မဟုတ် ဒစ်ဂျစ်တယ်မီနူး စတင်အသုံးပြုခြင်းနှင့် ပတ်သက်၍ သိရှိလိုသည်များရှိပါက ဆက်သွယ်မေးမြန်းနိုင်ပါသည်။ သင့်ဆိုင်နှင့် အသင့်တော်ဆုံးနည်းလမ်းကို ကူညီဆောင်ရွက်ပေးပါမည်။"
                : "Have questions about MOSSQR, pricing, or getting your digital menu set up? Reach out and we'll help you figure out what works best for your restaurant or café."}
            </p>

            <div className="pt-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <a
                href="#contact-form"
                className="btn-editorial btn-editorial-primary text-sm px-6 py-3"
              >
                <span>{language === "my" ? "မက်ဆေ့ခ်ျပို့ရန်" : "Message us"}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <Link
                href="/#pricing"
                className="btn-editorial btn-editorial-outline text-sm px-6 py-3"
              >
                <span>{language === "my" ? "ဈေးနှုန်းများကြည့်ရန်" : "View Pricing"}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. CONTACT OPTIONS */}
        <section className="py-6 px-6 sm:px-8 max-w-[1040px] mx-auto" aria-labelledby="direct-channels-title">
          <div className="text-center mb-8">
            <h2 id="direct-channels-title" className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--moss-mid)]">
              {language === "my" ? "တိုက်ရိုက်ဆက်သွယ်နိုင်သော လိုင်းများ" : "Direct Channels"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Primary Channel: Facebook */}
            <div className="contact-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1b2414] text-[#c8f04a] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">Facebook</h3>
                  <p className="text-xs sm:text-[13px] text-[var(--sub)] mt-1.5 leading-relaxed">
                    {language === "my"
                      ? "မေးခွန်းများ၊ နမူနာပြသမှုများနှင့် စတင်အသုံးပြုခြင်းအတွက် တိုက်ရိုက် စကားပြောနိုင်ပါသည်။"
                      : "Chat with MOSSQR directly for questions, demos, and setup."}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a
                  href={FB_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-editorial-primary w-full text-xs py-2.5"
                >
                  <span>{language === "my" ? "Facebook တွင် မက်ဆေ့ခ်ျပို့ရန်" : "Message on Facebook"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>

            {/* Email Channel */}
            <div className="contact-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#efe9da] text-[var(--ink)] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">Email</h3>
                  <p className="text-xs sm:text-[13px] text-[var(--sub)] mt-1.5 leading-relaxed">
                    {language === "my"
                      ? "လုပ်ငန်းဆိုင်ရာ စုံစမ်းမေးမြန်းမှုများ၊ သီးသန့်လိုအပ်ချက်များနှင့် အခြားမေးခွန်းများအတွက် ဆက်သွယ်ပါ။"
                      : "For business inquiries, custom requirements, or other questions."}
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="btn-editorial btn-editorial-outline w-full text-xs py-2.5"
                >
                  <span>{language === "my" ? "အီးမေးလ် ပို့ရန်" : "Send an Email"}</span>
                  <Mail className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>

            {/* Viber / Hotline Channel */}
            <div className="contact-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#efe9da] text-[var(--ink)] flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--ink)]">
                    {language === "my" ? "Viber / ဖုန်းဆက်သွယ်ရန်" : "Viber / Hotline"}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[var(--sub)] mt-1.5 leading-relaxed">
                    {language === "my"
                      ? "Viber အက်ပ်မှ တိုက်ရိုက် ဆက်သွယ်နိုင်သည်။ ဖုန်းဆက်ရန်လည်း အသုံးပြုနိုင်ပါသည်။"
                      : "Chat via Viber or call us directly on the same number."}
                  </p>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[var(--ink)] hover:text-[var(--moss-mid)] transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
              <div className="pt-6">
                <a
                  href={VIBER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-editorial btn-editorial-outline w-full text-xs py-2.5"
                >
                  <span>{language === "my" ? "Viber တွင် ဆက်သွယ်ရန်" : "Open in Viber"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT CAN WE HELP WITH? */}
        <section className="py-12 px-6 sm:px-8 max-w-[1040px] mx-auto" aria-labelledby="help-topics-title">
          <div className="mb-8">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--moss-mid)] mb-2">
              {language === "my" ? "ကူညီဆောင်ရွက်ပေးနိုင်သော ကဏ္ဍများ" : "Topics"}
            </span>
            <h2 id="help-topics-title" className="text-2xl sm:text-3xl font-fraunces font-semibold text-[var(--ink)] leading-snug">
              {language === "my" ? "ကျွန်ုပ်တို့ ဘာတွေကူညီပေးနိုင်မလဲ။" : "What can we help with?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Option 1 */}
            <div
              onClick={() => handleSelectTopicFromCard("I want to learn about MOSSQR")}
              className="contact-card p-5 cursor-pointer flex flex-col justify-between group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectTopicFromCard("I want to learn about MOSSQR");
                }
              }}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--stone)] flex items-center justify-center text-[var(--moss-mid)] mb-3 group-hover:bg-[#1b2414] group-hover:text-[#c8f04a] transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  {language === "my" ? "MOSSQR အကြောင်း သိကောင်းစရာ" : "Learn about MOSSQR"}
                </h3>
                <p className="text-xs text-[var(--sub)] mt-1.5 leading-relaxed">
                  {language === "my"
                    ? "QR မီနူး အလုပ်လုပ်ပုံနှင့် သင့်ဆိုင်နှင့် သင့်တော်မှု ရှိမရှိ လေ့လာနိုင်ပါသည်။"
                    : "See how a QR menu works and whether it fits your restaurant."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[var(--moss-mid)] mt-4 inline-flex items-center group-hover:text-[var(--ink)]">
                {language === "my" ? "မေးမြန်းရန်" : "Ask question"} &rarr;
              </span>
            </div>

            {/* Option 2 */}
            <div
              onClick={() => handleSelectTopicFromCard("Pricing question")}
              className="contact-card p-5 cursor-pointer flex flex-col justify-between group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectTopicFromCard("Pricing question");
                }
              }}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--stone)] flex items-center justify-center text-[var(--moss-mid)] mb-3 group-hover:bg-[#1b2414] group-hover:text-[#c8f04a] transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  {language === "my" ? "ဈေးနှုန်းနှင့် အစီအစဉ်များ" : "Pricing & Plans"}
                </h3>
                <p className="text-xs text-[var(--sub)] mt-1.5 leading-relaxed">
                  {language === "my"
                    ? "အစီအစဉ်များ၊ အထူးဈေးနှုန်းများနှင့် ပါဝင်သော လုပ်ဆောင်ချက်များကို မေးမြန်းပါ။"
                    : "Ask about plans, founding pricing, and what's included."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[var(--moss-mid)] mt-4 inline-flex items-center group-hover:text-[var(--ink)]">
                {language === "my" ? "မေးမြန်းရန်" : "Ask question"} &rarr;
              </span>
            </div>

            {/* Option 3 */}
            <div
              onClick={() => handleSelectTopicFromCard("Request a demo")}
              className="contact-card p-5 cursor-pointer flex flex-col justify-between group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectTopicFromCard("Request a demo");
                }
              }}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--stone)] flex items-center justify-center text-[var(--moss-mid)] mb-3 group-hover:bg-[#1b2414] group-hover:text-[#c8f04a] transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  {language === "my" ? "နမူနာကြည့်ရှုခြင်း" : "Get a Demo"}
                </h3>
                <p className="text-xs text-[var(--sub)] mt-1.5 leading-relaxed">
                  {language === "my"
                    ? "မစတင်မီ MOSSQR မည်သို့ အဆင်ပြေပြေ အလုပ်လုပ်သည်ကို ကြည့်ရှုပါ။"
                    : "See how MOSSQR works before getting started."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[var(--moss-mid)] mt-4 inline-flex items-center group-hover:text-[var(--ink)]">
                {language === "my" ? "တောင်းဆိုရန်" : "Request demo"} &rarr;
              </span>
            </div>

            {/* Option 4 */}
            <div
              onClick={() => handleSelectTopicFromCard("Custom menu")}
              className="contact-card p-5 cursor-pointer flex flex-col justify-between group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectTopicFromCard("Custom menu");
                }
              }}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--stone)] flex items-center justify-center text-[var(--moss-mid)] mb-3 group-hover:bg-[#1b2414] group-hover:text-[#c8f04a] transition-colors">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)]">
                  {language === "my" ? "သီးသန့်မီနူး လိုအပ်ချက်များ" : "Custom Menu"}
                </h3>
                <p className="text-xs text-[var(--sub)] mt-1.5 leading-relaxed">
                  {language === "my"
                    ? "ပုံမှန် အစီအစဉ်များအပြင် သီးသန့် အထူးမီနူး စီစဉ်ပေးမှုများအတွက် ဆွေးနွေးပါ။"
                    : "Talk to us if you need a menu setup beyond the standard MOSSQR plans."}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[var(--moss-mid)] mt-4 inline-flex items-center group-hover:text-[var(--ink)]">
                {language === "my" ? "ဆွေးနွေးရန်" : "Discuss setup"} &rarr;
              </span>
            </div>
          </div>
        </section>

        {/* 4. SIMPLE CONTACT FORM */}
        <section id="contact-form" className="py-12 px-6 sm:px-8 max-w-[800px] mx-auto scroll-mt-24" aria-labelledby="form-title">
          <div className="bg-white border border-[var(--border)] rounded-[24px] p-6 sm:p-10 shadow-xs">
            <div className="mb-6 space-y-1.5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--moss-mid)]">
                {language === "my" ? "မက်ဆေ့ခ်ျပေးပို့ရန်" : "Direct Message"}
              </span>
              <h2 id="form-title" className="text-2xl font-fraunces font-semibold text-[var(--ink)]">
                {language === "my" ? "ကျွန်ုပ်တို့ထံ ဆက်သွယ်ပါ" : "Send us a message"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--sub)]">
                {language === "my"
                  ? "အောက်ပါ အချက်အလက်များကို ဖြည့်သွင်းပေးပါ၊ ကျွန်ုပ်တို့ အဖွဲ့မှ အမြန်ဆုံး ပြန်လည်ဆက်သွယ်ပါမည်။"
                  : "Fill out the fields below and we'll get back to you as soon as possible."}
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-[#f4f7eb] border border-[#d2e2b0] rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5 text-[#3b6d11]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="text-sm font-bold">
                    {language === "my" ? "မက်ဆေ့ခ်ျ ပို့ပြီးပါပြီ။ ကျေးဇူးတင်ပါသည်။" : "Message sent successfully"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--sub)] leading-relaxed">
                  {language === "my"
                    ? "သင့်ပေးပို့ချက်ကို လက်ခံရရှိပါသည်။ မကြာမီ ကျွန်ုပ်တို့အဖွဲ့မှ ဆက်သွယ်ပေးပါမည်။"
                    : "Thank you for reaching out. We have received your inquiry and our team will get back to you shortly."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="btn-editorial btn-editorial-outline text-xs py-2 px-4"
                  >
                    {language === "my" ? "နောက်ထပ် မက်ဆေ့ခ်ျ ပို့ရန်" : "Send another message"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="block text-xs font-bold text-[var(--ink)]">
                      {language === "my" ? "အမည်" : "Name"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === "my" ? "ဥပမာ - ဦးမောင်မောင်" : "e.g. John Doe"}
                      className="w-full bg-[#fdfcf9] border border-[var(--border)] text-[var(--ink)] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[var(--moss-deep)] focus:ring-1 focus:ring-[var(--moss-deep)] transition-all"
                    />
                  </div>

                  {/* Restaurant / Café Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="restaurant-name" className="block text-xs font-bold text-[var(--ink)]">
                      {language === "my" ? "ဆိုင်အမည်" : "Restaurant / Café Name"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="restaurant-name"
                      type="text"
                      required
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      placeholder={language === "my" ? "ဥပမာ - ရွှေမွန် ကဖေး" : "e.g. Green Leaf Café"}
                      className="w-full bg-[#fdfcf9] border border-[var(--border)] text-[var(--ink)] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[var(--moss-deep)] focus:ring-1 focus:ring-[var(--moss-deep)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email or Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-info" className="block text-xs font-bold text-[var(--ink)]">
                      {language === "my" ? "အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ်" : "Email or Phone"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-info"
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder={language === "my" ? "09... သို့မဟုတ် name@example.com" : "e.g. +95 9... or name@example.com"}
                      className="w-full bg-[#fdfcf9] border border-[var(--border)] text-[var(--ink)] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[var(--moss-deep)] focus:ring-1 focus:ring-[var(--moss-deep)] transition-all"
                    />
                  </div>

                  {/* What can we help with? */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-topic" className="block text-xs font-bold text-[var(--ink)]">
                      {language === "my" ? "မည်သို့ ကူညီပေးရမလဲ" : "What can we help with?"}
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-[#fdfcf9] border border-[var(--border)] text-[var(--ink)] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[var(--moss-deep)] focus:ring-1 focus:ring-[var(--moss-deep)] transition-all cursor-pointer"
                    >
                      {TOPIC_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs font-bold text-[var(--ink)]">
                    {language === "my" ? "မက်ဆေ့ခ်ျ" : "Message"}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      language === "my"
                        ? "သင့်မေးမြန်းလိုသည်များကို ဤနေရာတွင် ရေးသားနိုင်ပါသည်..."
                        : "Tell us about your restaurant, questions, or requirements..."
                    }
                    className="w-full bg-[#fdfcf9] border border-[var(--border)] text-[var(--ink)] rounded-xl p-3.5 text-xs focus:outline-none focus:border-[var(--moss-deep)] focus:ring-1 focus:ring-[var(--moss-deep)] transition-all resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-editorial btn-editorial-dark w-full sm:w-auto text-xs px-7 py-3 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        <span>{language === "my" ? "ပေးပို့နေသည်..." : "Sending..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === "my" ? "မက်ဆေ့ခ်ျ ပို့ရန်" : "Send Message"}</span>
                        <Send className="w-3.5 h-3.5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <section className="py-12 px-6 sm:px-8 max-w-[1040px] mx-auto">
          <div className="bg-[var(--moss-deep)] text-left py-12 px-8 sm:px-12 rounded-[24px] relative overflow-hidden text-[var(--stone)] shadow-xl">
            <div className="max-w-[620px]">
              <h2 className="text-white text-2xl sm:text-3xl font-fraunces font-semibold mb-3 leading-tight">
                {language === "my" ? "သင့်မီနူးကို အွန်လိုင်းတင်ရန် အဆင်သင့်ဖြစ်ပြီလား။" : "Ready to put your menu online?"}
              </h2>
              <p className="text-[#c2c8b8] text-sm sm:text-base mb-8 font-normal leading-relaxed">
                {language === "my"
                  ? "MOSSQR ဖြင့် စတင်အသုံးပြုပြီး သင့်မီနူးကို အချိန်မရွေး အလွယ်တကူ ပြင်ဆင်၊ မျှဝေ၊ အသုံးပြုနိုင်အောင် ပြုလုပ်ပါ။"
                  : "Start with MOSSQR and keep your menu easy to update, share, and access."}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/auth/sign-up"
                  className="btn-editorial btn-editorial-primary text-sm px-7 py-3"
                >
                  <span>{language === "my" ? "အခမဲ့ စတင်စမ်းသပ်ရန်" : "Get Started"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/#pricing"
                  className="btn-editorial btn-editorial-outline text-sm px-6 py-3 border-white/20 text-[var(--stone)] hover:bg-white/10"
                >
                  <span>{language === "my" ? "ဈေးနှုန်းများကြည့်ရန်" : "View Pricing"}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-6 sm:px-8 max-w-[1040px] mx-auto text-xs text-[var(--sub)] flex items-center justify-between flex-wrap gap-4 border-t border-[var(--border)] mt-6">
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
          <span>© 2026 MOSSQR. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/#solution" className="hover:text-[var(--ink)] transition-colors">
            {language === "my" ? "အသုံးပြုပုံ" : "How it works"}
          </Link>
          <Link href="/#pricing" className="hover:text-[var(--ink)] transition-colors">
            {language === "my" ? "ဈေးနှုန်း" : "Pricing"}
          </Link>
          <Link href="/#faq" className="hover:text-[var(--ink)] transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-[var(--ink)] font-semibold text-[var(--ink)] transition-colors">
            {language === "my" ? "ဆက်သွယ်ရန်" : "Contact"}
          </Link>
          <Link href="/auth/login" className="hover:text-[var(--ink)] transition-colors">
            {language === "my" ? "အကောင့်ဝင်ရန်" : "Log in"}
          </Link>
        </div>
      </footer>
    </div>
  );
}
