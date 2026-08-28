"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PlusCircle, Image, Smartphone, RefreshCw } from "lucide-react";

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = [
    {
      num: "01",
      icon: PlusCircle,
      title: language === "my" ? "ဟင်းပွဲများ ထည့်သွင်းပါ" : "Build your menu",
      desc:
        language === "my"
          ? "ဟင်းပွဲအမည်များ၊ မြန်မာ / English ဘာသာ၊ ဖော်ပြချက်များကို မိနစ်ပိုင်းအတွင်း ထည့်သွင်းနိုင်ပါသည်။"
          : "Add your dishes, bilingual names, descriptions, and categories in just a few minutes. No technical skills needed.",
    },
    {
      num: "02",
      icon: Image,
      title: language === "my" ? "ဓာတ်ပုံနှင့် Signature ဖော်ပြချက် ထည့်ပါ" : "Add photos & dish stories",
      desc:
        language === "my"
          ? "အထူး ဟင်းပွဲများအတွက် ဓာတ်ပုံနှင့် ဆွဲဆောင်မှုရှိသော ဖော်ပြချက်ထည့်ပြီး ဖောက်သည်တိုင်း ရွေးချယ်လိုဆန္ဒ ဖြစ်ပေါ် အောင် ပြုလုပ်ပါ။"
          : "Upload food photos and write descriptions that make customers curious. Show what makes each dish worth ordering.",
    },
    {
      num: "03",
      icon: Smartphone,
      title: language === "my" ? "QR ကို ဒေါင်းလုဒ်ဆွဲပြီး ထားပါ" : "Place your QR on the table",
      desc:
        language === "my"
          ? "သင့်ဆိုင် Logo ပါဝင်သော QR ကို တစ်ကြိမ် Print ထုတ်ပြီး စားပွဲပေါ် တင်ထားပါ။ ထပ်ပြန်မထုတ်ရပါ။"
          : "Download your branded QR code, print it once, and place it on your tables. It never needs reprinting.",
    },
    {
      num: "04",
      icon: RefreshCw,
      title: language === "my" ? "မီနူး တစ်ချိန်မဆို ပြင်ဆင်ပါ" : "Keep your menu fresh, effortlessly",
      desc:
        language === "my"
          ? "စျေးနှုန်း ပြောင်းလဲချင်တိုင်း၊ ဟင်းပွဲသစ် ထည့်ချင်တိုင်း ဖုန်းထဲကနေ လုပ်ဆောင်နိုင်ပါသည်။ QR ပြန်ပြောင်းစရာ မလိုပါ။"
          : "Change a price, hide a sold-out dish, add a new special — all from your phone in seconds. Your table QR updates automatically.",
    },
  ];

  return (
    <section id="how" className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "မည်သို့ အလုပ်လုပ်သနည်း" : "How it works"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? (
            <>
              ရိုးရှင်းသော ၄ ဆင့်ဖြင့် <br />
              <span className="text-[#C8F55A]">ဟင်းပွဲ အတွေ့အကြုံ ပြောင်းပါ။</span>
            </>
          ) : (
            <>
              From plain list to <br />
              <span className="text-[#C8F55A]">beautiful dining experience.</span>
            </>
          )}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed">
          {language === "my"
            ? "MOSSQR သည် သင်မှီဝဲနေသော Paper menu ကို ဖယ်ရှားစရာမလိုဘဲ ၎င်းနှင့်အတူ ဒစ်ဂျစ်တယ် အတွေ့အကြုံတစ်ခု ထည့်ပေးသည်။"
            : "MOSSQR upgrades your dining experience without replacing anything. Your paper menu stays. Your guests just get something even better to explore."}
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#1A211C]/60 border border-[#2A332C] p-6 sm:p-7 relative flex flex-col justify-between hover:border-[#C8F55A]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="display-font text-2xl font-bold text-[#C8F55A]">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#8C948A] group-hover:text-[#C8F55A] group-hover:border-[#C8F55A]/30 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#F4F6F1] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8C948A] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2A332C]/40 flex items-center gap-1.5 text-[11px] text-[#8C948A] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F55A]"></span>
                <span>
                  {idx === 0
                    ? language === "my" ? "မိနစ်ပိုင်းအတွင်း" : "Minutes to set up"
                    : idx === 1
                    ? language === "my" ? "ဟင်းပွဲ ထင်ရှားပေါ်လာ" : "Makes dishes stand out"
                    : idx === 2
                    ? language === "my" ? "တစ်ကြိမ်သာ Print" : "Print once, done"
                    : language === "my" ? "QR ပြောင်းစရာမလို" : "Zero reprinting"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
