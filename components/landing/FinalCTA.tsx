"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FinalCTA() {
  const { language } = useLanguage();
  const viberLink = "viber://chat?number=%2B959969069005";

  return (
    <section className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Container with moss-pixel brand accent */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#1A211C] via-[#141B15] to-[#0F1410] border border-[#C8F55A]/30 p-8 sm:p-16 text-center shadow-2xl overflow-hidden">
        
        {/* Subtle Decorative Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#C8F55A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C8F55A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1410] border border-[#2A332C] text-[#C8F55A] text-xs font-mono font-semibold mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === "my" ? "မိနစ်ပိုင်းအတွင်း စတင်နိုင်သည်" : "GET STARTED IN 5 MINUTES"}</span>
          </div>

          <h2 className="display-font text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F4F6F1] leading-tight mb-5">
            {language === "my" ? (
              <>
                သင့်ဆိုင်၏ ဟင်းပွဲများ <br />
                <span className="text-[#C8F55A]">ပိုကောင်းသော မီနူး တစ်ခု ထိုက်တန်သည်။</span>
              </>
            ) : (
              <>
                Your food deserves <br />
                <span className="text-[#C8F55A]">a better menu experience.</span>
              </>
            )}
          </h2>

          <p className="text-[#8C948A] text-base sm:text-lg leading-relaxed mb-8">
            {language === "my"
              ? "MOSSQR ဖြင့် သင့်ဆိုင်၏ မီနူးကို လှပသော ဒစ်ဂျစ်တယ် ဟင်းပွဲ အတွေ့အကြုံတစ်ခုအဖြစ် ပြောင်းပစ်လိုက်ပါ — ဟင်းပွဲ ၂၀ အထိ အမြဲတမ်း အခမဲ့။"
              : "Experience your restaurant menu with MOSSQR. Let your guests discover your food the way it deserves to be discovered. Free forever for up to 20 dishes."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="w-full sm:w-auto bg-[#C8F55A] text-[#0F1410] font-bold px-8 py-4 rounded-xl text-base hover:brightness-105 transition-all shadow-[0_0_30px_rgba(200,245,90,0.25)] inline-flex items-center justify-center gap-2 group"
            >
              <span>{language === "my" ? "မီနူး အခမဲ့ ဖန်တီးမည်" : "Give your menu a glow-up — free"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <a
              href={viberLink}
              className="w-full sm:w-auto border border-[#2A332C] bg-[#0F1410] text-[#F4F6F1] px-6 py-4 rounded-xl text-base font-semibold hover:border-[#C8F55A]/50 transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#C8F55A]" />
              <span>{language === "my" ? "Viber မှ မေးမြန်းရန်" : "Talk to us on Viber"}</span>
            </a>
          </div>

          <div className="mt-8 text-xs text-[#8C948A] font-mono">
            ✦ {language === "my"
              ? "စတင်ခ မလိုပါ • Paper menu ဆက်သုံးနိုင်သည် • ၁၀၀% ဒေသတွင်း အကူအညီ"
              : "No setup fee • Keep your paper menu • Cancel anytime"}
          </div>

        </div>

      </div>

    </section>
  );
}
