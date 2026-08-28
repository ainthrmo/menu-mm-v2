"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function FAQSection() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const contactPhone = "+959969069005";
  const viberLink = "viber://chat?number=%2B959969069005";
  const telLink = "tel:+959969069005";

  const faqs = [
    {
      q: language === "my" ? "Free Plan သည် အမှန်တကယ် အခမဲ့ အသုံးပြုနိုင်ပါသလား?" : "Is the Free plan really free forever?",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ လုံးဝ အခမဲ့ဖြစ်ပါသည်။ ဟင်းပွဲ ၂၀ အထိ မည်သည့် Credit Card မှ မလိုဘဲ အချိန်အကန့်အသတ်မရှိ အခမဲ့ သုံးနိုင်ပါသည်။ စကင်ဖတ်သည့် အရေအတွက်လည်း အကန့်အသတ်မရှိပါ။"
        : "Yes! The Free plan is 100% free forever for up to 20 dishes with unlimited diner scans. No credit card required.",
    },
    {
      q: language === "my" ? "စားပွဲတင် QR ကို Print ထုတ်ပြီးမှ စျေးနှုန်းပြင်ပါက အသစ်ပြန်ထုတ်ရန် လိုပါသလား?" : "Can I update prices after printing my table QR code?",
      a: language === "my"
        ? "လုံးဝ မလိုပါ။ စားပွဲတင် QR Code သည် အမြဲသုံးဖြစ်ပြီး ဆိုင်ရှင်သည် မိမိဖုန်းထဲမှ ၅ စက္ကန့်အတွင်း စျေးနှုန်းပြင်လိုက်သည်နှင့် စားပွဲပေါ်ရှိ QR မီနူးတွင် ချက်ချင်း အလိုအလျောက် အသစ်ဖြစ်သွားပါမည်။"
        : "Never reprint! The table QR code remains permanent. When you change prices from your dashboard, the live menu updates automatically in real time.",
    },
    {
      q: language === "my" ? "ဧည့်သည်များ မီနူးကြည့်ရန် App ဒေါင်းလုဒ်လုပ်ရန် လိုအပ်ပါသလား?" : "Do customers need to install an app or make an account?",
      a: language === "my"
        ? "လုံးဝမလိုပါ။ ဧည့်သည်များသည် ၎င်းတို့၏ ဖုန်းကင်မရာ (သို့မဟုတ် Viber/Facebook QR scanner) ဖြင့် စကင်ဖတ်ရုံဖြင့် Safari/Chrome browser တွင် ၁ စက္ကန့်အတွင်း ချက်ချင်းပွင့်လာပါမည်။"
        : "No app or account needed. Diners simply point their phone camera at the QR stand and the menu opens straight in Safari or Chrome in under 1 second.",
    },
    {
      q: language === "my" ? "မြန်မာစာနှင့် English ဘာသာစကားနှစ်မျိုးလုံး ထည့်သွင်းနိုင်ပါသလား?" : "Can I use both Burmese and English on my menu?",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ ဟင်းပွဲတိုင်းတွင် မြန်မာအမည်နှင့် English အမည်ကို ယှဉ်တွဲထည့်သွင်းနိုင်ပါသည်။ ဧည့်သည်သည် မီနူးပေါ်တွင် မြန်မာ သို့မဟုတ် English ကို တစ်ချက်နှိပ်၍ အလွယ်တကူ ပြောင်းလဲကြည့်ရှုနိုင်ပါသည်။"
        : "Yes, you can add names in both Burmese and English. Customers can toggle between languages with a single tap.",
    },
    {
      q: language === "my" ? "Pro Plan ကို KBZPay / WavePay ဖြင့် ပေးချေနိုင်ပါသလား?" : "How do local payments work for the Pro plan? (KBZPay / WavePay)",
      a: language === "my"
        ? "ဟုတ်ကဲ့၊ KBZPay, WavePay, AYA Pay နှင့် ဘဏ်အကောင့်လွှဲပြောင်းမှုများဖြင့် လွယ်ကူစွာ ပေးချေနိုင်ပါသည်။ ဖုန်းနံပါတ် +959969069005 (Viber) သို့ တိုက်ရိုက် ဆက်သွယ်၍ မိနစ်ပိုင်းအတွင်း စတင်နိုင်ပါသည်။"
        : "We accept all Myanmar local payment methods including KBZPay, WavePay, AYA Pay, and bank transfers. You can message our Viber anytime.",
    },
  ];

  return (
    <section id="faq" className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-4xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "မေးလေ့ရှိသော မေးခွန်းများ" : "FAQ"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? "သိရှိလိုသည်များကို ဖြေကြားပေးထားပါသည်" : "Everything you need to know."}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed">
          {language === "my"
            ? "အသုံးများသော မေးခွန်းများနှင့် အသေးစိတ် အချက်အလက်များ။"
            : "Clear answers to the most common questions from restaurant owners."}
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3.5 mb-12">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#141B15] border border-[#2A332C] overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-[#F4F6F1] hover:text-[#C8F55A] transition-colors"
              >
                <span className="font-bold text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[#8C948A] transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#C8F55A]" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#8C948A] leading-relaxed border-t border-[#2A332C]/40 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Box */}
      <div className="rounded-2xl bg-[#1A211C] border border-[#2A332C] p-6 sm:p-7 text-center">
        <p className="text-sm font-bold text-[#F4F6F1] mb-1">
          {language === "my" ? "အခြား သိရှိလိုသည်များ ရှိပါသလား?" : "Still have questions?"}
        </p>
        <p className="text-xs text-[#8C948A] mb-5">
          {language === "my"
            ? "ကျွန်ုပ်တို့ထံ Viber သို့မဟုတ် ဖုန်းဖြင့် တိုက်ရိုက် ဆက်သွယ် မေးမြန်းနိုင်ပါသည်။"
            : "Reach our local Myanmar support team directly via Viber or phone."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={viberLink}
            className="bg-[#C8F55A] text-[#0F1410] font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs hover:brightness-105 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Viber: {contactPhone}</span>
          </a>
          <a
            href={telLink}
            className="border border-[#2A332C] bg-[#141B15] text-[#F4F6F1] text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 hover:border-[#C8F55A]/40 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C8F55A]" />
            <span>Call: {contactPhone}</span>
          </a>
        </div>
      </div>

    </section>
  );
}
