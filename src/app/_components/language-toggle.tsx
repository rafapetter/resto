"use client";

import { useI18n } from "@/lib/demo/i18n/context";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => setLocale("en")}
        className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
          locale === "en"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        onClick={() => setLocale("pt")}
        className={`rounded px-1.5 py-0.5 font-medium transition-colors ${
          locale === "pt"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        PT
      </button>
    </div>
  );
}
