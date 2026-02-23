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

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "#pricing", label: "Pricing" },
];

export function MobileNav({
  coursesUrl,
  landingUrl,
}: {
  coursesUrl: string;
  landingUrl: string;
}) {
  const [open, setOpen] = useState(false);

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
            Back to ATR
          </a>
          <div className="border-t border-border pt-4" />
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href={coursesUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="text-lg font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Courses
          </a>
          <div className="mt-4">
            <a
              href="/sign-up"
              className="flex h-10 w-full items-center justify-center rounded-lg bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Get Started
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
