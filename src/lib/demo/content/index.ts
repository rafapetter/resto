import type { UseCaseSlug } from "../use-cases";
import type { UseCaseDemoContent } from "../types";

const loaders: Record<UseCaseSlug, () => Promise<{ default: UseCaseDemoContent }>> = {
  "doctor-clinical-management": () => import("./doctor-clinical-management"),
  "hospital-management": () => import("./hospital-management"),
  "crm": () => import("./crm"),
  "e-commerce": () => import("./e-commerce"),
  "voice-chat-assistant": () => import("./voice-chat-assistant"),
  "freight-forwarder": () => import("./freight-forwarder"),
  "supply-chain-management": () => import("./supply-chain-management"),
  "lawyer-office": () => import("./lawyer-office"),
  "insurance-tech": () => import("./insurance-tech"),
  "real-estate-agency": () => import("./real-estate-agency"),
};

export async function loadDemoContent(slug: string): Promise<UseCaseDemoContent | null> {
  const loader = loaders[slug as UseCaseSlug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
