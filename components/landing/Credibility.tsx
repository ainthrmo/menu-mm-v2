"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Sparkles } from "lucide-react";

export default function Credibility() {
  const { language } = useLanguage();

  return (
    <section className="relative z-10 py-16 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Credibility Box */}
      <div className="rounded-3xl bg-gradient-to-b from-[#1A211C] to-[#12160F] border border-[#2A332C] p-8 sm:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-start border-b lg:border-b-0 lg:border-r border-[#2A332C] pb-6 lg:pb-0 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1410] border border-[#2A332C] text-[#C8F55A] text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-[#C8F55A]" />
              <span>YANGON, MYANMAR</span>
            </div>
            <h3 className="display-font text-2xl sm:text-3xl font-bold text-[#F4F6F1] leading-tight">
              {language === "my"
                ? "မြန်မာ စားသောက်ဆိုင်များ၏ မီနူးကို ဒစ်ဂျစ်တယ် ဟင်းပွဲ အတွေ့အကြုံအဖြစ် ပြောင်းရန် ဖန်တီးထားသည်"
                : "Built to transform Myanmar restaurant menus into dining experiences."}
            </h3>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="display-font text-2xl sm:text-3xl font-bold text-[#C8F55A] mb-1">
                20+
              </div>
              <div className="text-xs text-[#8C948A]">
                {language === "my" ? "ဟင်းပွဲ ဓာတ်ပုံ Tag" : "Dish photo tags"}
              </div>
            </div>

            <div className="p-3">
              <div className="display-font text-2xl sm:text-3xl font-bold text-[#C8F55A] mb-1">
                0 MB
              </div>
              <div className="text-xs text-[#8C948A]">
                {language === "my" ? "App ဒေါင်းရန် မလို" : "Zero app download"}
              </div>
            </div>

            <div className="p-3">
              <div className="display-font text-2xl sm:text-3xl font-bold text-[#C8F55A] mb-1">
                1 QR
              </div>
              <div className="text-xs text-[#8C948A]">
                {language === "my" ? "တစ်ကြိမ်သာ Print ရသည်" : "Print once, use forever"}
              </div>
            </div>

            <div className="p-3">
              <div className="display-font text-2xl sm:text-3xl font-bold text-[#C8F55A] mb-1">
                5 Sec
              </div>
              <div className="text-xs text-[#8C948A]">
                {language === "my" ? "မီနူး Update" : "Menu update speed"}
              </div>
            </div>
          </div>

        </div>

        {/* Mission Note */}
        <div className="mt-8 pt-6 border-t border-[#2A332C]/60 text-xs sm:text-sm text-[#8C948A] leading-relaxed italic">
          {language === "my"
            ? `"ကျွန်တော်တို့ MOSSQR ကို ဖန်တီးရသည်မှာ မြန်မာ စားသောက်ဆိုင်ရှင်များသည် ၎င်းတို့ ချက်ပြုတ်သော ဟင်းပွဲ၏ အစစ်အမှန်တန်ဖိုးကို ဖောက်သည်တိုင်း ခံစားနိုင်အောင် ဆောင်ရွက်ပေးနိုင်ရန်ဖြစ်သည်။ QR ကုဒ်သည် နည်းပညာမျှသာ — အစစ်အမှန်ရလဒ်မှာ ဟင်းပွဲ တစ်ပွဲ ပိုရောင်းနိုင်ခြင်းဖြစ်သည်။"`
            : `"We built MOSSQR because great food deserves a menu that does it justice. QR is just the delivery. The real goal is helping every dish find the customer who'll love it."`}
          <span className="block mt-2 not-italic font-mono text-[#C8F55A] text-xs">
            — The team building MOSSQR (Yangon)
          </span>
        </div>
      </div>

    </section>
  );
}
