export type Language = "en" | "my";

export const translations = {
  en: {
    nav: {
      howItWorks: "How it works",
      pricing: "Pricing",
      faq: "FAQ",
      liveDemo: "View Live Demo",
      logIn: "Log in",
      startFree: "Start Free",
    },
    japandiNav: {
      examples: "Product",
      pricing: "Pricing",
      getStarted: "Start Free",
    },
    japandiHero: {
      badge: "No reprinting, ever",
      headlineLine1: "Still reprinting your menu every time the price changes?",
      headlineLine2: "Update it directly with",
      brandName: "Moss.",
      sub: "MOSSQR gives your restaurant a digital menu you can update from your phone. Change prices, dishes, photos, or availability without printing a new menu every time.",
      cta1: "Start 30 Days Free",
      cta2: "View Live Demo",
      support: "No app required for your customers. Scan. Open. Browse.",
    },
    hero: {
      speedBadge: "0.8s on Myanmar 4G",
      dualLangBadge: "Dual EN / မြန်မာ",
      titleLine1: "Still reprinting your menu",
      titleHighlight: "every time the price changes?",
      titleLine2: "Scan to browse —",
      titleLine3: "no app, under a second on Myanmar 4G.",
      description:
        "MOSSQR gives your restaurant a digital menu you can update from your phone. Change prices, dishes, photos, or availability without printing a new menu every time.",
      createMenu: "Start 30 Days Free",
      seeHowItWorks: "View Live Demo",
      pillFree: "Free 30 Days",
      pillFreeSub: "founding offer",
      pillNoApp: "No app",
      pillNoAppSub: "for customers",
      pillLive: "Live",
      pillLiveSub: "in seconds",
      cardScanToOpen: "Scan to open",
      cardDemoTitle: "Golden Duck Café",
      cardExploreDemo: "Explore live demo",
      stepScan: "Scan",
      stepOpen: "Open",
      stepBrowse: "Browse",
    },
    problem: {
      title: "Your menu shouldn't be the hardest thing to update.",
      description:
        "Every small change can mean a new design, a print run, and replacing menus around your restaurant. That's a lot of work for something that should take a few seconds.",
      items: [
        {
          title: "Prices change",
          desc: "Update your menu the moment ingredient costs or selling prices shift — no waiting for the next print run.",
        },
        {
          title: "Items sell out",
          desc: "Mark a dish unavailable instead of leaving customers to order something you can't serve.",
        },
        {
          title: "New dishes arrive",
          desc: "Add new items without redesigning and reprinting your entire menu.",
        },
        {
          title: "Printed menus get outdated",
          desc: "Keep a digital menu that's always current, while your printed menus stay exactly as they are.",
        },
      ],
    },
    // ── Solution / How It Works ──────────────────────────────────────────────
    howItWorks: {
      title: "Update your menu from your phone. That's it.",
      subtitle:
        "MOSSQR gives your restaurant a digital menu connected to a QR code. Customers scan it at the table and open your menu instantly. When something changes, you update it from your phone.",
      step1Title: "Add your menu",
      step1Desc: "Add your dishes, categories, prices, photos, and descriptions — once.",
      step2Title: "Put up your QR code",
      step2Desc: "Place it on tables, counters, or anywhere customers can scan it. It never needs to change.",
      step3Title: "Stay in control",
      step3Desc: "Change prices, add dishes, update photos, or mark items unavailable — any time, from your phone.",
      keyMessage: "Your printed menu can stay. MOSSQR simply gives you a digital version that's",
      keyMessageHighlight: "easy to keep up to date",
    },
    // ── Proof Section ────────────────────────────────────────────────────────
    proof: {
      title: "This is the whole product.",
      subtitle: "Not a dashboard tour — the actual change your customers see.",
      ownerPhoneLabel: "Owner's phone",
      customerPhoneLabel: "Customer's phone, seconds later",
      dishName: "Grilled Fish",
      oldPrice: "8,500 Ks",
      newPrice: "9,000 Ks",
    },
    // ── Features / Benefits Section ──────────────────────────────────────────
    benefits: {
      heading: "Everything your restaurant needs for a simple digital menu.",
      card1Title: "Price & availability updates",
      card1Desc: "Change a price or mark a dish sold out whenever you need to — it's live immediately.",
      card2Title: "Bilingual menu",
      card2Desc: "Customers can browse in English or Myanmar.",
      card3Title: "Dish photos",
      card3Desc: "Show customers what they're ordering with clear, attractive images.",
      card4Title: "Restaurant profile",
      card4Desc: "Location, phone number, hours, WiFi, and social links in one place.",
      card5Title: "Mobile-friendly by default",
      card5Desc: "Built for how customers actually browse — on their own phone, right at the table.",
    },
    explainer: {
      heading: "What your guests actually see",
      point1: "Scan the QR, no app needed — the menu opens straight in their browser",
      point2: "Browse by category, in Burmese or English",
      point3: "Build a list of what they want, ready to show the server",
    },
    whatYouGet: {
      title: "What you get",
      subtitle: "Read the way it actually matters to your restaurant.",
      items: [
        {
          title: "Guests order more",
          description: "A photo sells the dish better than a name on a list.",
        },
        {
          title: "Faster to decide",
          description: "No flipping pages, no waiting on a waiter.",
        },
        {
          title: "Change it yourself",
          description: "Sold out? Price changed? Update it in seconds.",
        },
        {
          title: "Burmese first",
          description: "Bilingual by default, fast on real mobile data.",
        },
      ],
    },
    napkinQuote: {
      quote: "We're a new product, built specifically for Myanmar restaurants. No case studies yet — you'd be one of our first, with direct access to the people building this.",
      author: "— The team building Moss QR, Yangon",
    },
    // ── Pricing ──────────────────────────────────────────────────────────────
    pricing: {
      title: "Simple pricing. No surprises.",
      subtitle: "Pick the plan that fits your menu. Both plans include everything you need to stop reprinting.",
      starterBadge: "Starter",
      starterPrice: "69,000 MMK",
      starterPeriod: "/ year",
      starterDishes: "For restaurants and cafés with up to 50 dishes",
      starterFeatures: [
        "Up to 50 dishes",
        "Digital QR menu",
        "Menu categories",
        "Dish photos",
        "English & Myanmar menu",
        "Restaurant profile (location, hours, WiFi, social links)",
        "Availability / sold-out toggle",
        "Your own QR code",
      ],
      starterNote: "Founding price: Free for 30 days, then 69,000 MMK/year",
      starterCta: "Start 30 Days Free",
      proBadge: "Pro",
      proRecommended: "Founding Price",
      proPrice: "125,000 MMK",
      proPeriod: "/ year",
      proDishes: "For restaurants with bigger menus",
      proFeatures: [
        "Everything in Starter, plus:",
        "Up to 100 dishes",
        "Advanced menu customization",
      ],
      proNote: "Founding price: Free for 30 days, then 125,000 MMK/year",
      proCta: "Start 30 Days Free",
      whyCheaperTitle: "Why this is cheaper than what you're doing now",
      whyCheaperDesc:
        "A single menu reprint — new design, printing, lamination — typically costs more than a full year of Starter, and you're paying it every time a price changes. MOSSQR is a one-time yearly cost that covers unlimited updates, any time, from your phone.",
      foundingBannerTitle: "Try MOSSQR free for 30 days.",
      foundingBannerDesc:
        "We're opening MOSSQR to our first founding restaurants in Myanmar. No commitment during your trial — cancel before it ends and pay nothing. The MOSS team will personally help you set up your account and build your first digital menu. Limited founding spots available.",
      foundingBannerCta: "Claim Your Free 30 Days",
      // Legacy compatibility keys
      freeBadge: "Starter",
      freePrice: "69,000 MMK",
      freePeriod: "/ year",
      freeFeatures: [
        "Up to 50 dishes",
        "Digital QR menu",
        "English & Myanmar menu",
        "Restaurant profile",
        "Availability toggle",
      ],
      freeCta: "Start 30 Days Free",
      proBadgeOld: "Pro plan",
    },
    faq: {
      title: "Questions restaurant owners ask.",
      items: [
        {
          q: "Do my customers need to download an app?",
          a: "No. Customers scan the QR code and open your menu directly in their phone's browser.",
        },
        {
          q: "Do I need a new QR code every time I change my menu?",
          a: "No. Your QR code stays the same. You simply update the menu content behind it.",
        },
        {
          q: "Can I still use my printed menus?",
          a: "Yes. MOSSQR doesn't require you to throw away your printed menus — use them alongside your digital one.",
        },
        {
          q: "Can I mark a dish as sold out?",
          a: "Yes. Update a dish's availability so customers see it isn't currently available.",
        },
        {
          q: "What if I don't know how to set everything up?",
          a: "The MOSS team will personally help you set up your account and build your first digital menu.",
        },
      ],
    },
    finalCta: {
      title: "Stop reprinting your menu for every small change.",
      description: "Give your restaurant a digital menu you can update from your phone.",
      cta: "Start 30 Days Free",
      tagline:
        "MOSSQR — Digital QR Menus for Restaurants & Cafés. Simple to manage. Easy for customers to use. Built for menus that change.",
    },
    footer: {
      copyright: "© 2026 MOSSQR. Yangon, Myanmar.",
    },
  },

  my: {
    nav: {
      howItWorks: "အသုံးပြုပုံ",
      pricing: "ဈေးနှုန်း",
      faq: "မေးခွန်းများ",
      liveDemo: "နမူနာမီနူး ကြည့်ရန်",
      logIn: "အကောင့်ဝင်ရန်",
      startFree: "အခမဲ့စတင်ရန်",
    },
    japandiNav: {
      examples: "ထုတ်ကုန်",
      pricing: "ဈေးနှုန်း",
      getStarted: "အခမဲ့စတင်ရန်",
    },
    japandiHero: {
      badge: "ပြန်ပုံနှိပ်ဖြုန်းစရာ မလိုတော့ပါ",
      headlineLine1: "ဈေးနှုန်းပြောင်းတိုင်း မီနူးအသစ် ပြန်ရိုက်နေရတုန်းလား?",
      headlineLine2: "ဖုန်းထဲကနေ တိုက်ရိုက်ပြင်နိုင်သော",
      brandName: "Moss.",
      sub: "MOSSQR ဖြင့် သင့်ဆိုင်မီနူးကို ဖုန်းထဲကနေ ကိုယ်တိုင်ပြင်နိုင်ပါပြီ။ စက္ကူမီနူးအသစ် ပြန်ရိုက်စရာမလိုဘဲ ဈေးနှုန်း၊ ဟင်းပွဲ၊ ဓာတ်ပုံနှင့် ပစ္စည်းကုန်မှုများကို စက္ကန့်ပိုင်းအတွင်း ပြောင်းလဲပါ။",
      cta1: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      cta2: "နမူနာမီနူး ကြည့်ရန်",
      support: "ဧည့်သည်များအတွက် App ဒေါင်းရန်မလိုပါ။ Scan ဖတ်မည်၊ ပွင့်မည်၊ ကြည့်မည်။",
    },
    hero: {
      speedBadge: "Myanmar 4G မှာ ၀.၈ စက္ကန့်",
      dualLangBadge: "မြန်မာ / English နှစ်ဘာသာ",
      titleLine1: "ဈေးနှုန်းပြောင်းတိုင်း မီနူးအသစ်",
      titleHighlight: "ပြန်ရိုက်နေရတုန်းလား?",
      titleLine2: "QR Scan ဖတ်ပြီး ကြည့်နိုင်မည် —",
      titleLine3: "App မလို၊ Myanmar 4G မှာ စက္ကန့်ပိုင်းအတွင်း။",
      description:
        "MOSSQR ဖြင့် သင့်ဆိုင်မီနူးကို ဖုန်းထဲကနေ ကိုယ်တိုင်ပြင်နိုင်ပါပြီ။ စက္ကူမီနူးအသစ် ပြန်ရိုက်စရာမလိုဘဲ ဈေးနှုန်း၊ ဟင်းပွဲ၊ ဓာတ်ပုံနှင့် ပစ္စည်းကုန်မှုများကို စက္ကန့်ပိုင်းအတွင်း ပြောင်းလဲပါ။",
      createMenu: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      seeHowItWorks: "နမူနာမီနူး ကြည့်ရန်",
      pillFree: "ရက် ၃၀ အခမဲ့",
      pillFreeSub: "မိတ်ဆက်ကာလ",
      pillNoApp: "App မလိုပါ",
      pillNoAppSub: "ဧည့်သည်များအတွက်",
      pillLive: "ချက်ချင်းသုံးနိုင်",
      pillLiveSub: "စက္ကန့်ပိုင်းအတွင်း",
      cardScanToOpen: "စကင်ဖတ်ပြီး ဖွင့်ကြည့်ပါ",
      cardDemoTitle: "ရွှေဘဲ စားသောက်ဆိုင်",
      cardExploreDemo: "နမူနာမီနူး စမ်းကြည့်ရန်",
      stepScan: "စကင်ဖတ်",
      stepOpen: "တိုက်ရိုက်ပွင့်",
      stepBrowse: "မီနူးကြည့်",
    },
    problem: {
      title: "မီနူးပြင်ဆင်တာဟာ အခက်ခဲဆုံးအရာ မဖြစ်သင့်ပါဘူး။",
      description:
        "အပြောင်းအလဲ အနည်းငယ်အတွက်နဲ့ ဒီဇိုင်းအသစ်ဆွဲ၊ စာအုပ်ပြန်ရိုက်ပြီး စားပွဲတိုင်းမှာ လိုက်လဲနေရတာ အချိန်ကုန်၊ ငွေကုန်ပါတယ်။ ဒါတွေအားလုံးဟာ စက္ကန့်ပိုင်းအတွင်း ပြီးစီးသင့်တဲ့ ကိစ္စဖြစ်ပါတယ်။",
      items: [
        {
          title: "ဈေးနှုန်းပြောင်းလဲခြင်း",
          desc: "ကုန်ကျစရိတ် သို့မဟုတ် ရောင်းဈေး ပြောင်းလဲသည့်အခါ စာအုပ်ပြန်ရိုက်စရာမလိုဘဲ ချက်ချင်းပြင်နိုင်ပါသည်။",
        },
        {
          title: "ဟင်းပွဲကုန်သွားခြင်း",
          desc: "မရှိတော့သည့် ဟင်းပွဲကို ဧည့်သည်မှာယူခြင်း မဖြစ်စေရန် ဖုန်းထဲမှ ပစ္စည်းကုန်ကြောင်း ချက်ချင်းပိတ်ထားနိုင်ပါသည်။",
        },
        {
          title: "ဟင်းပွဲအသစ် တိုးခြင်း",
          desc: "မီနူးတစ်ခုလုံး ပြန်ဒီဇိုင်းဆွဲ၊ ပြန်ရိုက်စရာမလိုဘဲ ဟင်းပွဲအသစ်များကို အလွယ်တကူ ထည့်သွင်းနိုင်ပါသည်။",
        },
        {
          title: "စက္ကူမီနူး ဟောင်းနွမ်းသွားခြင်း",
          desc: "လက်ရှိ စက္ကူမီနူးများကို ဆက်သုံးရင်း အမြဲတိကျမှန်ကန်သော ဒီဂျစ်တယ်မီနူးတစ်ခုကို တွဲဖက်ရရှိနိုင်ပါသည်။",
        },
      ],
    },
    // ── Solution / How It Works ──────────────────────────────────────────────
    howItWorks: {
      title: "ဖုန်းထဲကနေ မီနူးကို အလွယ်တကူ ပြင်ဆင်ပါ။ ဒါပါပဲ။",
      subtitle:
        "MOSSQR သည် QR ကုဒ်နှင့် ချိတ်ဆက်ထားသော ဒီဂျစ်တယ်မီနူးကို ပေးပါသည်။ ဧည့်သည်များ စားပွဲပေါ်မှ Scan ဖတ်ရုံဖြင့် မီနူးတိုက်ရိုက်ပွင့်လာမည်ဖြစ်ပြီး အပြောင်းအလဲရှိပါက ဖုန်းထဲမှ အချိန်မရွေး ပြင်နိုင်ပါသည်။",
      step1Title: "မီနူး ထည့်သွင်းပါ",
      step1Desc: "ဟင်းပွဲများ၊ အမျိုးအစား၊ ဈေးနှုန်း၊ ဓာတ်ပုံနှင့် ဖော်ပြချက်များကို တစ်ကြိမ်သာ ထည့်သွင်းပါ။",
      step2Title: "QR Code ချိတ်ဆွဲပါ",
      step2Desc: "စားပွဲ၊ ကောင်တာ သို့မဟုတ် မည်သည့်နေရာမဆို ကပ်ထားပါ။ ကုတ်ကို ဘယ်တော့မှ ပြန်လဲစရာမလိုပါ။",
      step3Title: "စိတ်တိုင်းကျ ထိန်းချုပ်ပါ",
      step3Desc: "ဈေးနှုန်းပြောင်းခြင်း၊ ဟင်းပွဲတိုးခြင်း၊ ဓာတ်ပုံတင်ခြင်း၊ ပစ္စည်းကုန်ပိတ်ခြင်းတို့ကို ဖုန်းထဲမှ အချိန်မရွေး လုပ်ဆောင်ပါ။",
      keyMessage: "သင့်စက္ကူမီနူးကို ဆက်သုံးနိုင်ပါသည်။ MOSSQR က သင့်အား",
      keyMessageHighlight: "အမြဲလွယ်ကူစွာ ပြင်ဆင်နိုင်သော ဒီဂျစ်တယ်မီနူးကို ပေးအပ်ပါသည်",
    },
    // ── Proof Section ────────────────────────────────────────────────────────
    proof: {
      title: "ဒါဟာ ထုတ်ကုန်ရဲ့ အဓိက စွမ်းဆောင်ချက်ပါ။",
      subtitle: "ရှုပ်ထွေးတဲ့ စနစ်မဟုတ်ပါ — ဧည့်သည်တွေ တကယ်တွေ့မြင်ရမယ့် အပြောင်းအလဲပါ။",
      ownerPhoneLabel: "ဆိုင်ရှင်၏ ဖုန်း",
      customerPhoneLabel: "ဧည့်သည်၏ ဖုန်းတွင် စက္ကန့်ပိုင်းအတွင်း ပြောင်းလဲမှု",
      dishName: "ငါးကင်",
      oldPrice: "၈,၅၀၀ ကျပ်",
      newPrice: "၉,၀၀၀ ကျပ်",
    },
    // ── Features / Benefits Section ──────────────────────────────────────────
    benefits: {
      heading: "ရိုးရှင်းပြီး ထိရောက်သော ဒီဂျစ်တယ်မီနူးအတွက် လိုအပ်ချက်အားလုံး။",
      card1Title: "ဈေးနှုန်းနှင့် ပစ္စည်းရရှိမှု ပြင်ဆင်နိုင်ခြင်း",
      card1Desc: "ဈေးပြောင်းခြင်း သို့မဟုတ် ပစ္စည်းကုန်ကြောင်း အချိန်မရွေး ပြောင်းနိုင်ပြီး ချက်ချင်း အကျိုးသက်ရောက်သည်။",
      card2Title: "နှစ်ဘာသာ မီနူး",
      card2Desc: "ဧည့်သည်များ အင်္ဂလိပ် သို့မဟုတ် မြန်မာဘာသာဖြင့် စိတ်ကြိုက်ဖတ်ရှုနိုင်သည်။",
      card3Title: "ဟင်းပွဲဓာတ်ပုံများ",
      card3Desc: "လှပရှင်းလင်းသော ဓာတ်ပုံများဖြင့် ဧည့်သည်များကို ဆွဲဆောင်နိုင်သည်။",
      card4Title: "ဆိုင်အချက်အလက် ပြည့်စုံမှု",
      card4Desc: "တည်နေရာ၊ ဖုန်းနံပါတ်၊ ဖွင့်ချိန်၊ WiFi နှင့် Social Links အားလုံး တစ်နေရာတည်းတွင်။",
      card5Title: "မိုဘိုင်းဖုန်းများအတွက် သီးသန့်အဆင်ပြေခြင်း",
      card5Desc: "စားပွဲပေါ်တွင် ဧည့်သည်များ ကိုယ်ပိုင်ဖုန်းဖြင့် ဖတ်ရှုရန် သီးသန့်တည်ဆောက်ထားသည်။",
    },
    explainer: {
      heading: "ဧည့်သည်များ တကယ်တွေ့မြင်ရမည့်အရာ",
      point1: "QR စကင်ဖတ်ပါ၊ App မလို — မီနူးက ဘရောက်ဇာထဲမှာ တိုက်ရိုက်ပွင့်လာမည်",
      point2: "အမျိုးအစားအလိုက် ကြည့်ရှုနိုင်သည်၊ မြန်မာ သို့မဟုတ် အင်္ဂလိပ်ဘာသာဖြင့်",
      point3: "မှာယူလိုသည်များကို စာရင်းပြုစုပြီး စားပွဲထိုးထံ အဆင်သင့်ပြသနိုင်သည်",
    },
    whatYouGet: {
      title: "သင်ရရှိမည့် အကျိုးကျေးဇူးများ",
      subtitle: "သင့်ဆိုင်အတွက် လက်တွေ့အသုံးဝင်ဆုံး အချက်များ",
      items: [
        {
          title: "ဧည့်သည်များ ပိုမိုမှာယူလာခြင်း",
          description: "ဟင်းပွဲနာမည်ချည်းထက် စားချင်စဖွယ်ဓာတ်ပုံက ပိုရောင်းအားတက်စေပါတယ်။",
        },
        {
          title: "ရွေးချယ်ရ လွယ်ကူမြန်ဆန်ခြင်း",
          description: "စာအုပ်လှန်စရာမလို၊ စားပွဲထိုးစောင့်စရာမလိုဘဲ ချက်ချင်းကြည့်နိုင်ပါတယ်။",
        },
        {
          title: "ကိုယ်တိုင် ချက်ချင်းပြင်ဆင်နိုင်ခြင်း",
          description: "ပစ္စည်းကုန်သွားတာ၊ ဈေးပြောင်းတာတွေကို စက္ကန့်ပိုင်းအတွင်း ဖုန်းထဲကနေ ပြောင်းနိုင်ပါတယ်။",
        },
        {
          title: "မြန်မာစာအတွက် သီးသန့်ဖြစ်ခြင်း",
          description: "မြန်မာ/အင်္ဂလိပ် နှစ်ဘာသာသုံးနိုင်ပြီး မြန်မာဒေတာလိုင်းမှာ အမြန်ဆုံး ပွင့်ပါတယ်။",
        },
      ],
    },
    napkinQuote: {
      quote: "ကျွန်တော်တို့ဟာ မြန်မာနိုင်ငံက စားသောက်ဆိုင်တွေအတွက် သီးသန့်တည်ဆောက်ထားတဲ့ ထုတ်ကုန်အသစ်ဖြစ်ပါတယ်။ အသုံးပြုသူတိုင်းအတွက် ကျွန်တော်တို့အဖွဲ့သားတွေက တိုက်ရိုက်ကူညီဆောင်ရွက်ပေးနေပါတယ်။",
      author: "— Moss QR တည်ဆောက်ရေးအဖွဲ့၊ ရန်ကုန်",
    },
    // ── Pricing ──────────────────────────────────────────────────────────────
    pricing: {
      title: "ရိုးရှင်းသော ဈေးနှုန်း။ ဝှက်ထားသောကြေး လုံးဝမရှိပါ။",
      subtitle: "သင့်ဆိုင်နှင့် ကိုက်ညီမည့် အစီအစဉ်ကို ရွေးချယ်ပါ။ အစီအစဉ် ၂ ခုစလုံးတွင် စာအုပ်ပြန်ရိုက်စရာမလိုတော့သည့် အင်္ဂါရပ်အားလုံး ပါဝင်သည်။",
      starterBadge: "Starter",
      starterPrice: "၆၉,၀၀၀ MMK",
      starterPeriod: "/ တစ်နှစ်",
      starterDishes: "ဟင်းပွဲ ၅၀ အထိရှိသော စားသောက်ဆိုင်များနှင့် ကဖေးများအတွက်",
      starterFeatures: [
        "ဟင်းပွဲ ၅၀ အထိ",
        "ဒီဂျစ်တယ် QR မီနူး",
        "မီနူး အမျိုးအစားများ",
        "ဟင်းပွဲ ဓာတ်ပုံများ",
        "အင်္ဂလိပ်နှင့် မြန်မာ ၂ ဘာသာ မီနူး",
        "ဆိုင် အချက်အလက် (တည်နေရာ၊ ဖွင့်ချိန်၊ WiFi၊ Social)",
        "ရရှိနိုင်မှု / ပစ္စည်းကုန် toggle ခလုတ်",
        "ကိုယ်ပိုင် QR ကုဒ်",
      ],
      starterNote: "မိတ်ဆက်ဈေး- ရက် ၃၀ အခမဲ့၊ ထို့နောက် တစ်နှစ်လျှင် ၆၉,၀၀၀ ကျပ်",
      starterCta: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      proBadge: "Pro",
      proRecommended: "မိတ်ဆက်ဈေး",
      proPrice: "၁၂၅,၀၀၀ MMK",
      proPeriod: "/ တစ်နှစ်",
      proDishes: "ဟင်းပွဲ ပိုများသော စားသောက်ဆိုင်များအတွက်",
      proFeatures: [
        "Starter ပါ အရာအားလုံး အပြင် —",
        "ဟင်းပွဲ ၁၀၀ အထိ",
        "အဆင့်မြင့် မီနူး စိတ်ကြိုက်ပြင်ဆင်မှု",
      ],
      proNote: "မိတ်ဆက်ဈေး- ရက် ၃၀ အခမဲ့၊ ထို့နောက် တစ်နှစ်လျှင် ၁၂၅,၀၀၀ ကျပ်",
      proCta: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      whyCheaperTitle: "လက်ရှိ စက္ကူမီနူးထက် ဘာကြောင့် ပိုသက်သာသနည်း",
      whyCheaperDesc:
        "မီနူးစာအုပ် တစ်ကြိမ်ပြန်ရိုက်ခြင်း (ဒီဇိုင်း၊ ပရင့်၊ ပလတ်စတစ်ကပ်) ကုန်ကျစရိတ်သည် Starter တစ်နှစ်စာထက်ပင် ပိုများပြီး ဈေးပြောင်းတိုင်း ထပ်မံကုန်ကျနေရပါသည်။ MOSSQR သည် တစ်နှစ်တစ်ကြိမ် ပေးရုံဖြင့် ဖုန်းထဲမှ အကန့်အသတ်မရှိ ပြင်ဆင်ခွင့် ရရှိစေပါသည်။",
      foundingBannerTitle: "MOSSQR ကို ရက် ၃၀ အခမဲ့ စမ်းသုံးကြည့်ပါ။",
      foundingBannerDesc:
        "မြန်မာနိုင်ငံရှိ ကျွန်ုပ်တို့၏ ပထမဆုံး မိတ်ဆက်ဆိုင်များအတွက် ဖွင့်လှစ်ပေးထားပါသည်။ စမ်းသပ်ကာလအတွင်း မည်သည့် ကတိကဝတ်မှ မလိုပါ — မကြိုက်ပါက ကုန်ဆုံးမီ ပယ်ဖျက်နိုင်ပြီး ငွေပေးရန်မလိုပါ။ MOSS အဖွဲ့သားများက သင့်အကောင့်နှင့် ပထမဆုံး မီနူးကို ကိုယ်တိုင်ကိုယ်ကျ ကူညီတည်ဆောက်ပေးပါမည်။ နေရာကန့်သတ်ထားပါသည်။",
      foundingBannerCta: "အခမဲ့ ရက် ၃၀ စတင်ရယူမည်",
      // Legacy compatibility keys
      freeBadge: "Starter",
      freePrice: "၆၉,၀၀၀ MMK",
      freePeriod: "/ တစ်နှစ်",
      freeFeatures: [
        "ဟင်းပွဲ ၅၀ အထိ",
        "ဒီဂျစ်တယ် QR မီနူး",
        "မြန်မာ/အင်္ဂလိပ် ၂ ဘာသာ",
        "ဆိုင် အချက်အလက်",
        "ပစ္စည်းကုန် toggle",
      ],
      freeCta: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      proBadgeOld: "Pro အစီအစဉ်",
    },
    faq: {
      title: "စားသောက်ဆိုင်ပိုင်ရှင်များ မေးလေ့ရှိသော မေးခွန်းများ",
      items: [
        {
          q: "ဧည့်သည်များ ဖုန်းထဲတွင် App ဒေါင်းလုပ်ဆွဲရန် လိုပါသလား?",
          a: "မလိုပါ။ ဧည့်သည်များသည် QR ကုဒ်ကို စကင်ဖတ်ရုံဖြင့် ၎င်းတို့၏ ဖုန်း Browser ထဲတွင် မီနူးကို တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။",
        },
        {
          q: "မီနူးပြင်တိုင်း QR ကုဒ်အသစ် ပြန်ထုတ်ရမှာလား?",
          a: "လုံးဝ မလိုပါ။ သင့် QR ကုဒ်သည် အမြဲတမ်း အတူတူပင် ဖြစ်ပြီး အတွင်းပိုင်း မီနူးဒေတာကိုသာ အချိန်မရွေး လွတ်လပ်စွာ ပြင်ဆင်နိုင်ပါသည်။",
        },
        {
          q: "လက်ရှိ စက္ကူမီနူးတွေကို ဆက်သုံးလို့ ရပါသလား?",
          a: "ရပါသည်။ လက်ရှိ စက္ကူမီနူးများကို ဆက်လက်ထားရှိရင်း အမြန်ပြင်ဆင်နိုင်သော ဒီဂျစ်တယ်မီနူးနှင့် တွဲဖက် အသုံးပြုနိုင်ပါသည်။",
        },
        {
          q: "ဟင်းပွဲကုန်သွားရင် ကုန်ကြောင်း မှတ်သားနိုင်ပါသလား?",
          a: "ရပါသည်။ ဖုန်းထဲမှ တဆင့် ဟင်းပွဲရရှိနိုင်မှုကို ပိတ်ထားနိုင်ပြီး ဧည့်သည်များထံတွင် လက်ရှိမရနိုင်ကြောင်း ချက်ချင်း ပြသပေးပါသည်။",
        },
        {
          q: "မီနူးစနစ်ကို ကိုယ်တိုင် မထည့်တတ်ရင် ဘယ်လိုလုပ်ရမလဲ?",
          a: "MOSS အဖွဲ့သားများက သင့်အကောင့် စတင်ဖွင့်လှစ်ခြင်းနှင့် ပထမဆုံး မီနူးထည့်သွင်းခြင်းကို ကိုယ်တိုင်ကိုယ်ကျ ကူညီဆောင်ရွက်ပေးပါမည်။",
        },
      ],
    },
    finalCta: {
      title: "အသေးအဖွဲ အပြောင်းအလဲတိုင်းအတွက် မီနူးအသစ် ပြန်ရိုက်နေရတာကို ရပ်တန့်လိုက်ပါ။",
      description: "သင့်စားသောက်ဆိုင်အတွက် ဖုန်းထဲကနေ ချက်ချင်းပြင်နိုင်မည့် ဒီဂျစ်တယ်မီနူးကို အသုံးပြုလိုက်ပါ။",
      cta: "ရက် ၃၀ အခမဲ့စမ်းသုံးမည်",
      tagline:
        "MOSSQR — စားသောက်ဆိုင်များနှင့် ကဖေးများအတွက် ဒီဂျစ်တယ် QR မီနူး။ စီမံခန့်ခွဲရ လွယ်ကူသည်။ ဧည့်သည်များ သုံးရလွယ်ကူသည်။ အမြဲပြောင်းလဲနေသော မီနူးများအတွက် သီးသန့်တည်ဆောက်ထားသည်။",
    },
    footer: {
      copyright: "© 2026 MOSSQR. ရန်ကုန်၊ မြန်မာနိုင်ငံ။",
    },
  },
};

