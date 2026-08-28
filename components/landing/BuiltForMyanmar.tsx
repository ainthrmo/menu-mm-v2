"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ImageIcon, RefreshCw, Eye, Sparkles } from "lucide-react";

export default function BuiltForMyanmar() {
  const { language } = useLanguage();

  const benefits = [
    {
      icon: ImageIcon,
      title:
        language === "my"
          ? "ဟင်းပွဲ ဓာတ်ပုံများ — မမှာမဖြစ် ဆွဲဆောင်မှု"
          : "Let customers see what makes your dishes special.",
      desc:
        language === "my"
          ? "ကောင်းမွန်သော ဓာတ်ပုံတစ်ပုံသည် ဖောက်သည်တစ်ယောက်ကို ဟင်းပွဲအသစ် ကြိုးကြိုးပမ်းပမ်း မှာချင်စိတ် ဖြစ်ပေါ်စေနိုင်သည်။ မစမ်းဖူးသော ဟင်းပွဲများကိုပင် ဓာတ်ပုံကြောင့် ရဲရဲဝံ့ဝံ့ မှာနိုင်ကြသည်။"
          : "A great food photo turns curiosity into an order. Customers try dishes they've never heard of simply because the photo made it irresistible.",
    },
    {
      icon: Eye,
      title:
        language === "my"
          ? "Signature ဟင်းပွဲများ — ဖောက်သည်တိုင်း သိနိုင်မည်"
          : "Make your signature dishes impossible to miss.",
      desc:
        language === "my"
          ? "လူကြိုက်များသောဟင်းပွဲ၊ Chef's Pick ဟင်းပွဲများကို tag ပေးထားသောကြောင့် ဖောက်သည်တိုင်း မည်သည့်ဟင်းပွဲကို ကြိုးစားသင့်သည်ဆိုသည်ကို ချက်ချင်း သိနိုင်ကြသည်။"
          : "Tag your best dishes, highlight chef's picks, and surface your specials — so every guest knows exactly what's worth ordering.",
    },
    {
      icon: RefreshCw,
      title:
        language === "my"
          ? "မီနူး ပြောင်းလဲရာ Print ထုတ်ရန် မလိုတော့"
          : "Keep your menu fresh without reprinting.",
      desc:
        language === "my"
          ? "မည်သည့်အချိန်မဆို ဖုန်းထဲကနေ ၅ စက္ကန့်အတွင်း မီနူး ပြင်ဆင်နိုင်သည်။ QR ပြောင်းစရာမလို — ဖောက်သည်တိုင်း ချက်ချင်း အသစ်ဆုံး မီနူးကို မြင်ကြပါမည်။"
          : "Update prices, hide sold-out items, or add a new dish from your phone in seconds. Your QR stays the same. Your menu stays current — always.",
    },
    {
      icon: Sparkles,
      title:
        language === "my"
          ? "သင့် Paper menu ကို ဖယ်ရှားစရာ မလိုပါ"
          : "Upgrade your experience, not your entire operation.",
      desc:
        language === "my"
          ? "MOSSQR သည် Paper menu ကို အစားထိုးသည်မဟုတ်ပါ — ၎င်းနှင့်အတူ ဒစ်ဂျစ်တယ် အတွေ့အကြုံတစ်ခု ထည့်ပေးသည်။ ဆိုင်ကိုပြောင်းလဲမည်ဆိုသော ကြောက်ရွံ့မှုမရှိ — ထည့်ပေါင်းသာ ဖြစ်သည်။"
          : "MOSSQR sits alongside your existing setup — no complicated systems, no learning curve. Keep what works. Simply give your guests a richer way to discover your food.",
    },
  ];

  return (
    <section className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "ရရှိမည့် ရလဒ်များ" : "What you actually get"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? (
            <>
              မီနူး ကောင်းတက်တာ <br />
              <span className="text-[#C8F55A]">ဟင်းပွဲ ပိုရောင်းသည်</span>
            </>
          ) : (
            <>
              A better menu means <br />
              <span className="text-[#C8F55A]">more dishes discovered.</span>
            </>
          )}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed">
          {language === "my"
            ? "MOSSQR ၏ ရည်ရွယ်ချက်မှာ feature များ ပါဝင်စေရန် မဟုတ်ပါ — ဟင်းပွဲ တစ်ပွဲချင်းကို ဖောက်သည်တိုင်း ခံစားနိုင်အောင် ပြောင်းပေးရန်ဖြစ်သည်။"
            : "MOSSQR isn't about adding features. It's about helping every dish you cook find the customer who will love it most."}
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#1A211C]/70 border border-[#2A332C] p-7 flex gap-5 hover:border-[#C8F55A]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-[#C8F55A] shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F4F6F1] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8C948A] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
