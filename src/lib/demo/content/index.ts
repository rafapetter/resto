import type { UseCaseSlug } from "../use-cases";
import type { UseCaseDemoContent } from "../types";
import type { Locale } from "../i18n/types";
import { getDefaultOperations } from "./_shared";

type ContentModule = {
  default: (locale: Locale) => UseCaseDemoContent;
};

const loaders: Record<UseCaseSlug, () => Promise<ContentModule>> = {
  "doctor-clinical-management": () => import("./doctor-clinical-management") as Promise<ContentModule>,
  "hospital-management": () => import("./hospital-management") as Promise<ContentModule>,
  "crm": () => import("./crm") as Promise<ContentModule>,
  "e-commerce": () => import("./e-commerce") as Promise<ContentModule>,
  "voice-chat-assistant": () => import("./voice-chat-assistant") as Promise<ContentModule>,
  "freight-forwarder": () => import("./freight-forwarder") as Promise<ContentModule>,
  "supply-chain-management": () => import("./supply-chain-management") as Promise<ContentModule>,
  "lawyer-office": () => import("./lawyer-office") as Promise<ContentModule>,
  "insurance-tech": () => import("./insurance-tech") as Promise<ContentModule>,
  "real-estate-agency": () => import("./real-estate-agency") as Promise<ContentModule>,
};

export async function loadDemoContent(slug: string, locale: Locale = "en"): Promise<UseCaseDemoContent | null> {
  const loader = loaders[slug as UseCaseSlug];
  if (!loader) return null;
  const mod = await loader();
  const content = mod.default(locale);
  if (!content.operations) {
    content.operations = getDefaultOperations(locale);
  }
  return content;
}
