"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Sparkles, ToggleRight, ToggleLeft, Edit3, Image, Star, Smartphone, LayoutDashboard } from "lucide-react";

export default function ProductShowcase() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"owner" | "diner">("diner");
  const [soldOutDemo, setSoldOutDemo] = useState(false);

  return (
    <section className="relative z-10 py-20 sm:py-28 px-[6vw] max-w-7xl mx-auto border-t border-[#2A332C]/60">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-semibold tracking-wider uppercase mb-3">
          {language === "my" ? "Live Preview" : "See it in action"}
        </div>
        <h2 className="display-font text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6F1] leading-tight mb-4">
          {language === "my" ? (
            <>
              ဧည့်သည်တိုင်း ဟင်းပွဲကို <br />
              <span className="text-[#C8F55A]">ချစ်မြတ်နိုးသွားမည်။</span>
            </>
          ) : (
            <>
              What your guests see <br />
              <span className="text-[#C8F55A]">when they scan your table.</span>
            </>
          )}
        </h2>
        <p className="text-[#8C948A] text-base leading-relaxed">
          {language === "my"
            ? "ဖောက်သည်တိုင်း ဓာတ်ပုံများ၊ ဟင်းပွဲဖော်ပြချက်များနှင့် လွယ်ကူသော ရှာဖွေမှုဖြင့် ဟင်းပွဲကို ကြည့်ရှုခံစားနိုင်သည်။ ဆိုင်ရှင်အတွက်မူ ဟင်းပွဲများကို ဖုန်းထဲမှ ချက်ချင်း ထိန်းချုပ်နိုင်သည်။"
            : "Guests explore your dishes through beautiful photos and descriptions. Toggle between the customer view and the simple owner dashboard."}
        </p>

        {/* View Switcher Tabs */}
        <div className="mt-8 inline-flex items-center gap-2 bg-[#1A211C] p-1.5 rounded-xl border border-[#2A332C]">
          <button
            type="button"
            onClick={() => setActiveTab("diner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "diner"
                ? "bg-[#C8F55A] text-[#0F1410] shadow-xs"
                : "text-[#8C948A] hover:text-[#F4F6F1]"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === "my" ? "ဧည့်သည် ဖုန်း မြင်ကွင်း" : "Guest menu view"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("owner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "owner"
                ? "bg-[#C8F55A] text-[#0F1410] shadow-xs"
                : "text-[#8C948A] hover:text-[#F4F6F1]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{language === "my" ? "ဆိုင်ရှင် Dashboard" : "Owner dashboard"}</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Frame */}
      <div className="rounded-3xl bg-[#141B15] border border-[#2A332C] p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
        
        {activeTab === "diner" ? (
          /* TAB 1: CUSTOMER DINER VIEW (PHONE MOCKUP) — default tab */
          <div className="flex flex-col items-center justify-center animate-in fade-in duration-300 py-2">
            <div className="w-full max-w-[340px] rounded-3xl bg-[#0F1410] border-[5px] border-[#2A332C] shadow-2xl overflow-hidden">
              
              {/* Phone Header */}
              <div className="flex items-center justify-between border-b border-[#2A332C] p-4 pb-3">
                <div>
                  <div className="text-[10px] text-[#8C948A] uppercase font-mono">Golden Spoon Restaurant</div>
                  <div className="text-sm font-bold text-[#F4F6F1]">{language === "my" ? "အားလုံး မြင်ကွင်း" : "Discover our menu"}</div>
                </div>
                <div className="flex items-center gap-1 bg-[#1A211C] border border-[#2A332C] px-2 py-0.5 rounded-full text-[10px] font-bold text-[#C8F55A]">
                  <span>MM</span> / <span className="text-[#8C948A]">EN</span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 text-[11px] px-4 py-3 overflow-x-auto scrollbar-hide border-b border-[#2A332C]">
                <span className="px-2.5 py-1 rounded-full bg-[#C8F55A] text-[#0F1410] font-bold shrink-0">
                  {language === "my" ? "အားလုံး" : "All"}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#8C948A] shrink-0">
                  {language === "my" ? "ထူးခြားဆုံး" : "Signature"}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#8C948A] shrink-0">
                  {language === "my" ? "ဟင်းလျာ" : "Mains"}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#1A211C] border border-[#2A332C] text-[#8C948A] shrink-0">
                  {language === "my" ? "အချိုများ" : "Desserts"}
                </span>
              </div>

              {/* Dishes with Photo Placeholders */}
              <div className="space-y-0 text-left divide-y divide-[#2A332C]">
                {/* Dish 1 - with photo */}
                <div className="p-4 flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2A332C] to-[#1A211C] border border-[#2A332C] flex items-center justify-center text-2xl shrink-0">
                    🍜
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-[#F4F6F1]">{language === "my" ? "ခေါက်ဆွဲကြော်" : "Fried Noodles"}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C8F55A]/20 text-[#C8F55A] font-bold flex items-center gap-0.5 shrink-0">
                        <Star className="w-2 h-2" /> {language === "my" ? "လူကြိုက်များ" : "Popular"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8C948A] leading-snug mb-1.5">
                      {language === "my" ? "ကြက်သား / ဝက်သား ရွေးချယ်နိုင်သည်" : "Chicken or pork, wok-fried with house sauce"}
                    </p>
                    <span className="text-xs font-mono font-bold text-[#C8F55A]">4,500 K</span>
                  </div>
                </div>

                {/* Dish 2 - with photo */}
                <div className="p-4 flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2A332C] to-[#1A211C] border border-[#2A332C] flex items-center justify-center text-2xl shrink-0">
                    🍲
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-[#F4F6F1]">{language === "my" ? "မုန့်ဟင်းခါး" : "Traditional Mohinga"}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C8F55A]/10 text-[#C8F55A] font-bold shrink-0">
                        {language === "my" ? "Chef's Pick" : "Chef's Pick"}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8C948A] leading-snug mb-1.5">
                      {language === "my" ? "အနှစ်ကြာ ပြုတ်ထားသော ရိုးရာ မြန်မာ ငါးဟင်းခါး" : "Slow-cooked Burmese fish noodle soup, a national classic"}
                    </p>
                    <span className="text-xs font-mono font-bold text-[#C8F55A]">3,000 K</span>
                  </div>
                </div>

                {/* Dish 3 */}
                <div className="p-4 flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2A332C] to-[#1A211C] border border-[#2A332C] flex items-center justify-center text-2xl shrink-0">
                    🍛
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-[#F4F6F1]">{language === "my" ? "ကြက်သားဟင်း" : "Burmese Chicken Curry"}</span>
                    </div>
                    <p className="text-[10px] text-[#8C948A] leading-snug mb-1.5">
                      {language === "my" ? "ပြည်တွင်း ဆေးဖက်ဝင် အပင်များဖြင့် ချက်ပြုတ်" : "Rich curry with traditional aromatics, served with rice"}
                    </p>
                    <span className="text-xs font-mono font-bold text-[#C8F55A]">5,000 K</span>
                  </div>
                </div>
              </div>

              {/* Phone Footer */}
              <div className="px-4 py-3 text-center text-[10px] text-[#8C948A] font-mono border-t border-[#2A332C] bg-[#0F1410]">
                ✓ {language === "my" ? "App ဒေါင်းရန် မလို · ၁ စက္ကန့်အတွင်း ပွင့်သည်" : "No app needed · Loaded in under 1s"}
              </div>

            </div>
            <p className="mt-5 text-xs text-[#8C948A] text-center font-mono">
              {language === "my" ? "↑ ဧည့်သည်တိုင်း ဤမြင်ကွင်းကို မြင်ရပါမည်" : "↑ This is what every guest sees after scanning"}
            </p>
          </div>
        ) : (
          /* TAB 2: OWNER DASHBOARD VIEW */
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#2A332C]">
              <div>
                <h4 className="text-lg font-bold text-[#F4F6F1] flex items-center gap-2">
                  <span>Golden Spoon Cafe</span>
                  <span className="text-[10px] bg-[#C8F55A]/20 text-[#C8F55A] px-2 py-0.5 rounded-full font-mono">
                    LIVE SYNC ACTIVE
                  </span>
                </h4>
                <p className="text-xs text-[#8C948A] mt-0.5">
                  {language === "my" ? "ဟင်းပွဲ ၁၈ မျိုး · အမျိုးအစား ၄ ခု" : "18 dishes · 4 categories · Updated today"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-[#1A211C] border border-[#2A332C] text-[#C8F55A] text-xs font-mono font-bold flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" />
                  <span>{language === "my" ? "ဓာတ်ပုံ ထည့်ရန်" : "Add photos"}</span>
                </div>
              </div>
            </div>

            {/* Simulated Dish Editor Rows */}
            <div className="space-y-3">
              
              {/* Item 1 */}
              <div className="rounded-xl bg-[#1A211C] border border-[#2A332C] p-4 flex flex-wrap items-center justify-between gap-4 hover:border-[#C8F55A]/30 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-xl">
                    🍜
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F4F6F1]">
                      ခေါက်ဆွဲကြော် (ကြက်သား / ဝက်သား)
                    </div>
                    <div className="text-xs text-[#8C948A] flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#C8F55A]" />
                      <span>{language === "my" ? "Popular tag ပါပြီ" : "Tagged as Popular"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#C8F55A]">
                      4,500 MMK
                    </div>
                    <span className="text-[10px] text-[#8C948A] flex items-center gap-1 cursor-pointer hover:underline">
                      <Edit3 className="w-2.5 h-2.5" /> {language === "my" ? "ပြင်ဆင်ရန်" : "Edit price"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSoldOutDemo(!soldOutDemo)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1410] border border-[#2A332C] text-xs font-semibold hover:border-[#C8F55A]/40 transition-colors"
                  >
                    <span className={soldOutDemo ? "text-amber-400" : "text-[#C8F55A]"}>
                      {soldOutDemo ? "🔴 " + (language === "my" ? "ကုန်သွားပြီ" : "Sold out") : "🟢 " + (language === "my" ? "ရရှိနိုင်သည်" : "Available")}
                    </span>
                    {soldOutDemo ? <ToggleLeft className="w-4 h-4 text-amber-400" /> : <ToggleRight className="w-4 h-4 text-[#C8F55A]" />}
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="rounded-xl bg-[#1A211C] border border-[#2A332C] p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-xl">
                    🍲
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F4F6F1]">
                      ရိုးရာ မုန့်ဟင်းခါး (အကြော်စုံ)
                    </div>
                    <div className="text-xs text-[#8C948A]">Traditional Burmese Mohinga</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#C8F55A]">
                      3,000 MMK
                    </div>
                    <span className="text-[10px] text-[#8C948A]">{language === "my" ? "Active" : "Active"}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1410] border border-[#2A332C] text-xs text-[#C8F55A] font-semibold">
                    <span>🟢 {language === "my" ? "ရရှိနိုင်သည်" : "Available"}</span>
                    <ToggleRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="rounded-xl bg-[#1A211C] border border-[#2A332C] p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-[#0F1410] border border-[#2A332C] flex items-center justify-center text-xl">
                    🍛
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F4F6F1]">
                      ကြက်သားဟင်း အနှစ်
                    </div>
                    <div className="text-xs text-[#8C948A]">Burmese Chicken Curry</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-[#C8F55A]">
                      5,000 MMK
                    </div>
                    <span className="text-[10px] text-[#8C948A]">{language === "my" ? "Active" : "Active"}</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1410] border border-[#2A332C] text-xs text-[#C8F55A] font-semibold">
                    <span>🟢 {language === "my" ? "ရရှိနိုင်သည်" : "Available"}</span>
                    <ToggleRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-[#0F1410] border border-[#2A332C] flex items-center justify-between text-xs text-[#8C948A]">
              <span>
                💡 {language === "my"
                  ? "ဖုန်းထဲမှ ပြင်ဆင်လိုက်သည်နှင့် စားပွဲပေါ်ရှိ QR မီနူးတွင် ချက်ချင်း ပြောင်းလဲသွားသည်"
                  : "Any change you make here instantly appears on every guest's phone — no refresh needed."}
              </span>
              <span className="font-mono text-[#C8F55A] hidden sm:inline">
                {language === "my" ? "Instant Update" : "Instant Update"}
              </span>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}
