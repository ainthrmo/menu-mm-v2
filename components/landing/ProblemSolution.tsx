"use client";

import { X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ProblemSolution() {
  const { language } = useLanguage();

  return (
    <section className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "အမှန်တကယ် ကြုံနေသော ပြဿနာ" : "The real problem"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? (
            <>
              သင့်ဟင်းပွဲများ ကောင်းမွန်သည်။ <br />
              <span className="text-[#8C948A]">မီနူးကတော့ မပြနိုင်သေးပါ။</span>
            </>
          ) : (
            <>
              Your food is great. <br />
              <span className="text-[#8C948A]">Your menu just isn&apos;t showing it.</span>
            </>
          )}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed">
          {language === "my"
            ? "မီနူးသည် ဧည့်သည်တစ်ဦး၏ ပထမဆုံး အတွေ့အကြုံဖြစ်သည်။ ထိုအတွေ့အကြုံသည် ညံ့ဖျင်းနေလျှင် အကောင်းဆုံး ဟင်းပွဲများပင် ကွယ်ပျောက်သွားနိုင်သည်။"
            : "Your menu is one of the first things a customer experiences. If it's flat and forgettable, your best dishes get overlooked — even when they're extraordinary."}
        </p>
      </div>

      {/* 4 Pain Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="rounded-2xl bg-[#1A211C]/60 border border-[#2A332C] p-6 hover:border-[#2A332C]/90 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#C8F55A] mb-4 font-mono font-bold text-sm">
            01
          </div>
          <h3 className="text-lg font-bold text-[#F4F6F1] mb-2">
            {language === "my" ? "မီနူးသည် အစားအသောက်ကို မပြနိုင်ပါ" : "Your menu doesn't represent your food"}
          </h3>
          <p className="text-sm text-[#8C948A] leading-relaxed">
            {language === "my"
              ? "ဟင်းပွဲအမည်နှင့် စျေးနှုန်းသာ ရှိသော မီနူးသည် ဧည့်သည်တွေ ဘာမှာရမည်ဆိုသည်ကို မဆုံးဖြတ်နိုင်ဘဲ ဆိုင်ကို ထွက်သွားနိုင်သည်။"
              : "A menu with only names and prices gives guests nothing to be excited about. They leave without discovering the dishes that make your restaurant special."}
          </p>
        </div>

        <div className="rounded-2xl bg-[#1A211C]/60 border border-[#2A332C] p-6 hover:border-[#2A332C]/90 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#C8F55A] mb-4 font-mono font-bold text-sm">
            02
          </div>
          <h3 className="text-lg font-bold text-[#F4F6F1] mb-2">
            {language === "my" ? "Signature ဟင်းပွဲများ ကိုင်ဆောင်မနိုင်ခြင်း" : "Signature dishes go unnoticed"}
          </h3>
          <p className="text-sm text-[#8C948A] leading-relaxed">
            {language === "my"
              ? "သင့်အထူး ဟင်းပွဲများသည် ရိုးရိုး မီနူးစာမျက်နှာပေါ်တွင် ဝေဖန်မသိ ကျန်နေတတ်သည်။ ဖောက်သည်တိုင်း ၎င်းတို့ကို ကြည့်ရူပြီး ရွေးချယ်ချင်သော ဟန်မဟုတ်ပါ။"
              : "Your chef's pride, your most-ordered dish, your house specialty — they all look the same on a plain list. Guests order the familiar instead of the outstanding."}
          </p>
        </div>

        <div className="rounded-2xl bg-[#1A211C]/60 border border-[#2A332C] p-6 hover:border-[#2A332C]/90 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#C8F55A] mb-4 font-mono font-bold text-sm">
            03
          </div>
          <h3 className="text-lg font-bold text-[#F4F6F1] mb-2">
            {language === "my" ? "မီနူး ပြောင်းလဲချင်တိုင်း Print ထုတ်ရသည်" : "Updating your menu is a headache"}
          </h3>
          <p className="text-sm text-[#8C948A] leading-relaxed">
            {language === "my"
              ? "စျေးနှုန်းတစ်ခု ပြောင်းလဲသည်နှင့် မီနူးအသစ် ပြန်ရိုက်ရသည်။ ဟင်းပွဲကုန်သွားသည်နှင့် ဧည့်သည်ကို လိုက်ရှင်းပြရသည်။ ဤသည်မှာ မလိုအပ်ဘဲ ဖြစ်နေသော ပင်ပန်းမှုများဖြစ်သည်။"
              : "A price change means a full reprint. A sold-out dish means awkward conversations. These are unnecessary frictions that interrupt your team every single day."}
          </p>
        </div>

        <div className="rounded-2xl bg-[#1A211C]/60 border border-[#2A332C] p-6 hover:border-[#2A332C]/90 transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#C8F55A] mb-4 font-mono font-bold text-sm">
            04
          </div>
          <h3 className="text-lg font-bold text-[#F4F6F1] mb-2">
            {language === "my" ? "ရောင်းချသင့်သော ဟင်းပွဲ ဆုံးရှုံးနေသည်" : "Missed upsell opportunities every table"}
          </h3>
          <p className="text-sm text-[#8C948A] leading-relaxed">
            {language === "my"
              ? "ဧည့်သည်တိုင်း ဟင်းပွဲအကြောင်း မသိဘဲ ထုပ်ပြန်သွားနေကြသည်။ ဓာတ်ပုံနှင့် ဖော်ပြချက်တစ်ခုသာ ထည့်လိုက်သည်နှင့် ဖောက်သည်များ ပိုမှာနိုင်သည်ကို သုတေသနများ သက်သေပြနေသည်။"
              : "Guests who don't know about your specials, set meals, or desserts simply leave without ordering them. A photo and a description is often all it takes for them to say yes."}
          </p>
        </div>
      </div>

      {/* Visual Comparison: Old Way vs MOSSQR */}
      <div className="rounded-3xl bg-[#141B15] border border-[#2A332C] p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-[#C8F55A] uppercase">
            {language === "my" ? "ခြားနားချက်" : "The transformation"}
          </span>
          <h3 className="display-font text-2xl sm:text-3xl font-bold text-[#F4F6F1] mt-1">
            {language === "my"
              ? "မီနူးကို ရောင်းချရေး ကိရိယာအဖြစ် ပြောင်းလဲပါ"
              : "Turn your menu into your best salesperson."}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Before Column */}
          <div className="rounded-2xl bg-[#0F1410]/80 border border-red-500/20 p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-red-500/20">
              <span className="font-bold text-sm text-[#F4F6F1]">
                {language === "my" ? "မီနူး ဟောင်းဟောင်းမောင်းမောင်း" : "The old printed menu"}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold">
                BEFORE
              </span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#8C948A]">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{language === "my" ? "ဓာတ်ပုံမပါ — ဟင်းပွဲ မမြင်ရ" : "No photos — guests can't picture the dish"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{language === "my" ? "ဖော်ပြချက်မပါ — မည်ကြောင့် မှာရမည် မသိ" : "No descriptions — nothing to inspire a choice"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{language === "my" ? "Signature ဟင်းပွဲများ မပေါ်ချင် ကျန်နေသည်" : "Best dishes buried among a flat list"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{language === "my" ? "ပြောင်းလဲချင်တိုင်း မီနူးအသစ် ပြန်ရိုက်ရသည်" : "Every update means another print run"}</span>
              </li>
            </ul>
          </div>

          {/* After Column */}
          <div className="rounded-2xl bg-[#1A211C] border border-[#C8F55A]/40 p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2A332C]">
              <span className="font-bold text-sm text-[#F4F6F1] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C8F55A]"></span>
                <span>{language === "my" ? "MOSSQR ဒစ်ဂျစ်တယ် မီနူး" : "MOSSQR digital menu"}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8F55A]/20 text-[#C8F55A] font-bold">
                AFTER
              </span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-[#F4F6F1]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0 mt-0.5" />
                <span>{language === "my" ? "ဟင်းပွဲ ဓာတ်ပုံများ — မမှာမဖြစ် ဆွဲဆောင်မှု" : "Food photos that make customers want to order"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0 mt-0.5" />
                <span>{language === "my" ? "Signature ဟင်းပွဲ tag — ဖောက်သည် ချက်ချင်းသိ" : "Highlight signature dishes and chef's picks"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0 mt-0.5" />
                <span>{language === "my" ? "ဖုန်းထဲကနေ ၅ စက္ကန့်အတွင်း ပြင်ဆင်နိုင်" : "Update prices and availability in 5 seconds"}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#C8F55A] shrink-0 mt-0.5" />
                <span>{language === "my" ? "Paper menu ကို ဖယ်ရှားရန် မလိုပါ — ထပ်ပေါင်းထည့်ရုံသာ" : "Keeps your paper menu — just adds a better experience"}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </section>
  );
}
