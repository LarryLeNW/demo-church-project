"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { translations, type Language } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
  bilingual: (viText: string, enText: string) => string;
  pick: <T extends Record<string, any>>(obj: T, viKey: keyof T, enKey: keyof T) => any;
  isVi: boolean;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "sam_selected_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("EN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "VI" || saved === "EN") {
        setLangState(saved);
        document.documentElement.lang = saved.toLowerCase();
      } else {
        setLangState("EN");
        document.documentElement.lang = "en";
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang.toLowerCase();
    }
  };

  const toggleLang = () => {
    const next: Language = lang === "VI" ? "EN" : "VI";
    setLang(next);
  };

  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (entry && entry[lang]) {
      return entry[lang];
    }
    return fallback ?? key;
  };

  const bilingual = (viText: string, enText: string): string => {
    return lang === "EN" ? enText || viText : viText || enText;
  };

  const pick = <T extends Record<string, any>>(obj: T, viKey: keyof T, enKey: keyof T): any => {
    if (!obj) return "";
    return lang === "EN" ? obj[enKey] ?? obj[viKey] : obj[viKey] ?? obj[enKey];
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t,
      bilingual,
      pick,
      isVi: lang === "VI",
      isEn: lang === "EN",
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
