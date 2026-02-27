"use client";

import { Menu, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useI18n } from "@/lib/demo/i18n/context";
import { LanguageToggle } from "./language-toggle";
import type { TranslationKeys } from "@/lib/demo/i18n/types";

const NAV_LINKS: { href: string; labelKey: keyof TranslationKeys }[] = [
  { href: "#features", labelKey: "nav.features" },
  { href: "/use-cases", labelKey: "nav.useCases" },
  { href: "#pricing", labelKey: "nav.pricing" },
];

export function MobileNav({
  coursesUrl,
  landingUrl,
}: {
  coursesUrl: string;
  landingUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav className="flex flex-col gap-4 pt-8">
          <a
            href={landingUrl}
            onClick={() => setOpen(false)}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {t("nav.backToAtr")}
          </a>
          <div className="border-t border-border pt-4" />
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              {t(link.labelKey)}
            </a>
          ))}
          <a
            href={coursesUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="text-lg font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            {t("nav.courses")}
          </a>
          <div className="flex items-center gap-2 pt-2">
            <LanguageToggle />
          </div>
          <div className="mt-4">
            <a
              href="/sign-up"
              className="flex h-10 w-full items-center justify-center rounded-lg bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              {t("nav.getStarted")}
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
