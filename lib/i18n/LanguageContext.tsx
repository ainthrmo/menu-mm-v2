"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "./translations";

type Translations = typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isMounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("my");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedLang = localStorage.getItem("app-language") as Language;
    if (savedLang === "en" || savedLang === "my") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const getTranslation = (lang: Language) => {
    // If language is 'my', but value is empty string "", fallback to 'en'
    const fallback = translations.en;
    const current = translations[lang];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged: any = {};
    for (const k of Object.keys(fallback)) {
      const key = k as keyof typeof fallback;
      merged[key] = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const subK of Object.keys(fallback[key])) {
        const subKey = subK as keyof typeof fallback[typeof key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (current as any)[key]?.[subKey];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        merged[key][subKey] = val ? val : (fallback as any)[key][subKey];
      }
    }
    return merged as Translations;
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isMounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
