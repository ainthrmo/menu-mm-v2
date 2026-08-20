export interface DemoCategory {
  id: string;
  name: string;
  name_mm?: string;
  sort_order?: number;
}

export interface DemoMenuItem {
  id: string;
  name: string;
  name_mm?: string;
  category: string;
  price: number;
  description?: string | null;
  description_mm?: string | null;
  image?: string;
  is_available?: boolean;
  is_popular?: boolean;
  is_spicy?: boolean;
}

export interface DemoStoreProfile {
  store_name: string;
  cover_url?: string;
  logo_url?: string;
  description: string;
  location?: string;
  address?: string;
  city?: string;
  social_phone?: string;
  wifi_password?: string;
  show_wifi?: boolean;
  wifi_name?: string;
}

export const DEMO_STORE_PROFILE: DemoStoreProfile = {
  store_name: "Golden Spoon Cuisine (ရွှေဇွန်း)",
  description: "Authentic Myanmar Cuisine & Specialty Tea House • စစ်မှန်သော မြန်မာ့ရိုးရာ စားသောက်ဆိုင်",
  cover_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
  location: "Bahan, Yangon • ရန်ကုန်မြို့",
  address: "No. 45, Sayar San Road, Bahan",
  city: "Yangon",
  social_phone: "+95 9 123 456 789",
  wifi_password: "goldenspoon2026",
  show_wifi: true,
  wifi_name: "GoldenSpoon-Guest",
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  { id: "cat-popular", name: "Popular Specials", name_mm: "လူကြိုက်အများဆုံး", sort_order: 1 },
  { id: "cat-salads", name: "Traditional Salads", name_mm: "မြန်မာ့ရိုးရာ အသုပ်များ", sort_order: 2 },
  { id: "cat-mains", name: "Main Dishes & Curries", name_mm: "ဟင်းလျာများ", sort_order: 3 },
  { id: "cat-noodles", name: "Noodles & Soups", name_mm: "ခေါက်ဆွဲ နှင့် ဟင်းချို", sort_order: 4 },
  { id: "cat-drinks", name: "Drinks & Desserts", name_mm: "အအေး နှင့် အချိုပွဲ", sort_order: 5 },
];

export const DEMO_MENU_ITEMS: DemoMenuItem[] = [
  {
    id: "dish-1",
    name: "Burmese Tea Leaf Salad (Laphet Thoke)",
    name_mm: "လက်ဖက်သုပ် အထူး",
    category: "Popular Specials",
    price: 4500,
    description: "Fermented tea leaves tossed with crunchy roasted beans, peanuts, toasted sesame, garlic, and fresh chili.",
    description_mm: "ရှမ်းပြည်နယ်ထွက် လက်ဖက်ညွန့်အိအိနှင့် ကြွပ်ရွသော ပဲကြော်စုံ၊ နှမ်းမွှေး၊ ကြက်သွန်ဖြူတို့ဖြင့် စီမံထားသည်။",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
    is_spicy: true,
  },
  {
    id: "dish-2",
    name: "Classic Shan Noodles (Shan Khauk Swe)",
    name_mm: "ရှမ်းခေါက်ဆွဲ (ဆီချက် / အရည်)",
    category: "Popular Specials",
    price: 5500,
    description: "Silky rice noodles with spiced chicken or pork curry, sweet tomato paste, crushed peanuts, and fresh scallions.",
    description_mm: "ရှမ်းရိုးရာ ဆန်စီးခေါက်ဆွဲ၊ ကြက်သား/ဝက်သားဟင်းအနှစ်နှင့် မြေပဲမှုန့်၊ တို့ဟူးချဉ် တွဲဖက်ကျွေးမွေးပါသည်။",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
  {
    id: "dish-3",
    name: "Crispy Shan Tofu Fritters (Tofu Kyaw)",
    name_mm: "ရှမ်းတို့ဟူးကြော် ပူပူစပ်စပ်",
    category: "Traditional Salads",
    price: 3500,
    description: "Crispy outside, creamy yellow split-pea tofu inside. Served with tamarind garlic dipping sauce.",
    description_mm: "ကုလားပဲစစ်စစ်ဖြင့်ပြုလုပ်ထားသော ရှမ်းတို့ဟူးကြော် ပူပူကြွပ်ကြွပ် နှင့် မန်ကျည်းမှည့်ချဉ်စပ်ဆော့စ်။",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
  {
    id: "dish-4",
    name: "Ginger Salad (Ghin Thoke)",
    name_mm: "ဂျင်းသုပ် အကြွပ်",
    category: "Traditional Salads",
    price: 4000,
    description: "Pickled shredded young ginger, roasted chickpea powder, crunchy peas, and lime juice.",
    description_mm: "ဂျင်းနုနုစိမ် အကြွပ်ကြော် ပဲစုံတို့နှင့် သံပရာရည်ရွှမ်းရွှမ်း သုပ်ထားသော ရိုးရာဂျင်းသုပ်။",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    is_available: true,
  },
  {
    id: "dish-5",
    name: "Golden Prawn Curry with Sweet Tamarind",
    name_mm: "ပုစွန်ဆီပြန်ဟင်း",
    category: "Main Dishes & Curries",
    price: 12000,
    description: "Fresh Andaman prawns simmered in aromatic lemongrass, shallot, tomato, and turmeric reduction.",
    description_mm: "ပင်လယ်ငါးပုစွန်လတ်လတ်ဆတ်ဆတ်ကို ကြက်သွန်နီ၊ ခရမ်းချဉ်သီး အနှစ်ဆီပြန် မွှေးကြိုင်စွာ ချက်ပြုတ်ထားသည်။",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
  {
    id: "dish-6",
    name: "Burmese Braised Pork Belly & Pickled Mango",
    name_mm: "ဝက်သား သရက်သီးသနပ်ဟင်း",
    category: "Main Dishes & Curries",
    price: 9500,
    description: "Tender slow-braised pork belly gently cooked with green pickled mango slices and soy spices.",
    description_mm: "ဝက်သားသုံးထပ်သားနူးနူးအိအိနှင့် သရက်သီးသနပ် ချဉ်ငံစပ် ဆီပြန်ဟင်းလျာ။",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    is_available: true,
  },
  {
    id: "dish-7",
    name: "Traditional Mohinga (Lemongrass Catfish Broth)",
    name_mm: "မုန့်ဟင်းခါး (ငါးခူအဆီအနှစ်စစ်စစ်)",
    category: "Noodles & Soups",
    price: 4500,
    description: "Myanmar's national dish: rice vermicelli in aromatic catfish, lemongrass, ginger, and crispy gourd fritters.",
    description_mm: "ငါးခူစစ်စစ်၊ စပါးလင်၊ ဂျင်းတို့ဖြင့် ချက်ထားသော မုန့်ဟင်းခါးရည် နှင့် ဘဲဥ၊ ဘူးသီးကြော်။",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
  {
    id: "dish-8",
    name: "Coconut Milk Noodles (Ohn No Khao Swe)",
    name_mm: "အုန်းနို့ခေါက်ဆွဲ အထူး",
    category: "Noodles & Soups",
    price: 5000,
    description: "Rich coconut chicken curry broth poured over wheat noodles, topped with boiled egg and crispy fritters.",
    description_mm: "မွှေးကြိုင်သော အုန်းနို့ကြက်သားဟင်းရည် နှင့် ဂျုံခေါက်ဆွဲ၊ ကြက်သွန်နီ၊ မုန့်ကြွပ်။",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80",
    is_available: true,
  },
  {
    id: "dish-9",
    name: "Royal Myanmar Milk Tea (Laphet Yay Cho)",
    name_mm: "မြန်မာ့လက်ဖက်ရည် (ချိုကျဲ/ချိုဆိမ့်)",
    category: "Drinks & Desserts",
    price: 2500,
    description: "Brewed black tea pulled with condensed milk and evaporated cream for a silky smooth finish.",
    description_mm: "လက်ဖက်ခြောက်ကောင်းကောင်းဖြင့် ဖျော်စပ်ထားသော ရိုးရာမြန်မာ့လက်ဖက်ရည် ချိုဆိမ့်။",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
  {
    id: "dish-10",
    name: "Falooda with Basil Seeds & Rose Ice Cream",
    name_mm: "ဖာလူဒါ အထူးအအေး",
    category: "Drinks & Desserts",
    price: 4500,
    description: "Layered sweet dessert with rose syrup, basil seeds, egg pudding, jelly cubes, and rich vanilla ice cream.",
    description_mm: "နှင်းဆီရနံ့သာ အမွှေးရည်၊ ပင်ပွား၊ သာကူ၊ ကျောက်ကျော၊ ပူဒင်း နှင့် ရေခဲမုန့်။",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    is_available: true,
    is_popular: true,
  },
];
