"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Pricing() {
  const { language } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<"yearly" | "6months">("yearly");

  return (
    <section id="pricing" className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "ပွင့်လင်းမြင်သာသော စျေးနှုန်းများ" : "Transparent Pricing"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? (
            <>
              ရိုးရှင်းပြီး လျှို့ဝှက်စရိတ်မရှိသော <br />
              <span className="text-[#C8F55A]">စျေးနှုန်းအစီအစဉ်များ</span>
            </>
          ) : (
            <>
              Simple, upfront pricing. <br />
              <span className="text-[#C8F55A]">No hidden fees.</span>
            </>
          )}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed mb-8">
          {language === "my"
            ? "အခမဲ့ အစီအစဉ်ဖြင့် စတင် စမ်းသပ်နိုင်ပြီး သင့်ဆိုင်ကြီးထွားလာချိန်တွင် Pro သို့ အလွယ်တကူ အဆင့်မြှင့်နိုင်ပါသည်။"
            : "Start completely free. Upgrade to Pro whenever your restaurant is ready."}
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-2 bg-[#141B15] p-1.5 rounded-full border border-[#2A332C]">
          <button
            type="button"
            onClick={() => setBillingPeriod("6months")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              billingPeriod === "6months"
                ? "bg-[#C8F55A] text-[#0F1410]"
                : "text-[#8C948A] hover:text-[#F4F6F1]"
            }`}
          >
            {language === "my" ? "၆ လ တစ်ကြိမ်" : "6 Months"}
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingPeriod === "yearly"
                ? "bg-[#C8F55A] text-[#0F1410]"
                : "text-[#8C948A] hover:text-[#F4F6F1]"
            }`}
          >
            <span>{language === "my" ? "၁ နှစ်စာ" : "1 Year"}</span>
            <span className="bg-[#0F1410] text-[#C8F55A] text-[9px] px-1.5 py-0.5 rounded-full font-extrabold border border-[#2A332C]">
              15% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* FREE PLAN */}
        <div className="rounded-3xl bg-[#141B15] border border-[#2A332C] p-8 sm:p-9 shadow-lg flex flex-col justify-between hover:border-[#2A332C]/90 transition-all">
          <div>
            <div className="text-xs text-[#8C948A] uppercase tracking-wider mb-2 font-mono font-semibold">
              Free Plan
            </div>
            <div className="display-font text-4xl sm:text-5xl font-bold text-[#F4F6F1] mb-1">
              0 Ks <span className="text-sm font-normal text-[#8C948A]">/ forever</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8C948A] mb-8">
              {language === "my"
                ? "ပထမဆုံး ဒစ်ဂျစ်တယ် မီနူးကို အခမဲ့ စမ်းသပ်လိုသော ဆိုင်များအတွက်။"
                : "For small cafes or testing your first digital QR menu."}
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#F4F6F1] mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "ဟင်းပွဲ ၂၀ အထိ ထည့်သွင်းနိုင်ခြင်း" : "Up to 20 dishes"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "ဘာသာစကားနှစ်မျိုး (MM + EN)" : "Bilingual menu (MM + EN)"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "ဆိုင် Logo ပါ စားပွဲတင် QR Code" : "Custom branded table QR code"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "အကန့်အသတ်မရှိ Customer Scan" : "Unlimited customer scans"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "ဖုန်းထဲမှ စျေးနှုန်း အချိန်မရွေး ပြင်ဆင်နိုင်ခြင်း" : "Instant mobile price updates"}</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/sign-up"
            className="block text-center py-3.5 rounded-xl border border-[#2A332C] bg-[#1A211C] text-sm font-bold text-[#F4F6F1] hover:border-[#C8F55A]/50 hover:bg-[#1A211C]/80 transition-all"
          >
            {language === "my" ? "အခမဲ့ စတင်မည်" : "Start free"}
          </Link>
        </div>

        {/* PRO PLAN */}
        <div className="rounded-3xl bg-gradient-to-b from-[#1A211C] to-[#141B15] border border-[#C8F55A]/40 p-8 sm:p-9 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#C8F55A] uppercase tracking-wider font-mono font-bold">
                Pro Plan
              </span>
              <span className="bg-[#C8F55A]/15 text-[#C8F55A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#C8F55A]/30">
                RECOMMENDED
              </span>
            </div>

            <div className="display-font text-4xl sm:text-5xl font-bold text-[#F4F6F1] mb-1">
              {billingPeriod === "yearly" ? "50,000 Ks" : "30,000 Ks"}{" "}
              <span className="text-sm font-normal text-[#8C948A]">
                {billingPeriod === "yearly" ? "/ year" : "/ 6 months"}
              </span>
            </div>
            
            <p className="text-xs font-mono text-[#C8F55A] mb-2">
              {billingPeriod === "yearly" ? "≈ 4,167 Ks / month (အထူးသက်သာ)" : "≈ 5,000 Ks / month"}
            </p>

            <p className="text-xs sm:text-sm text-[#8C948A] mb-8">
              {language === "my"
                ? "ဟင်းပွဲအရေအတွက် များပြားသော စားသောက်ဆိုင်ကြီးများအတွက်။"
                : "For restaurants with large menus and photo requirements."}
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#F4F6F1] mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span className="font-bold">{language === "my" ? "ဟင်းပွဲ ၁၀၀ အထိ ထည့်သွင်းနိုင်ခြင်း" : "Up to 100 dishes"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "ဟင်းပွဲ ဓာတ်ပုံများ ထည့်သွင်းနိုင်ခြင်း" : "High-resolution dish photos"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "Free တွင် ပါဝင်သော အရာအားလုံး" : "Everything in Free plan"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "KBZPay, WavePay, AYA Pay ဖြင့် ပေးချေနိုင်ခြင်း" : "Local KBZPay, WavePay payments"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0" />
                <span>{language === "my" ? "တိုက်ရိုက် Viber / Phone အကူအညီ (+959969069005)" : "Direct Priority Viber Support"}</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/sign-up"
            className="relative z-10 block text-center py-3.5 rounded-xl bg-[#C8F55A] text-[#0F1410] text-sm font-bold hover:brightness-105 transition-all shadow-[0_0_20px_rgba(200,245,90,0.22)]"
          >
            {language === "my" ? "Pro သို့ စတင် အဆင့်မြှင့်မည်" : "Upgrade to Pro"}
          </Link>
        </div>

      </div>

    </section>
  );
}
