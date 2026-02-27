"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Locale, TranslationKeys } from "./types";
import en from "./en";
import pt from "./pt";

const translations: Record<Locale, TranslationKeys> = { en, pt };

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof TranslationKeys, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("demo-locale") as Locale) || "en";
    }
    return "en";
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("demo-locale", newLocale);
    }
  }, []);

  const t = useCallback(
    (key: keyof TranslationKeys, vars?: Record<string, string | number>) => {
      let value = translations[locale][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
