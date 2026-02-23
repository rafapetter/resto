export type UseCaseSlug =
  | "doctor-clinical-management"
  | "hospital-management"
  | "crm"
  | "e-commerce"
  | "voice-chat-assistant"
  | "freight-forwarder"
  | "supply-chain-management"
  | "lawyer-office"
  | "insurance-tech"
  | "real-estate-agency";

export type UseCase = {
  slug: UseCaseSlug;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
};

export const USE_CASES: Record<UseCaseSlug, UseCase> = {
  "doctor-clinical-management": {
    slug: "doctor-clinical-management",
    name: "Doctor Clinical Management",
    shortName: "Clinical Mgmt",
    icon: "🩺",
    color: "blue",
    description:
      "EHR, appointment scheduling, prescriptions, billing, and insurance claims for private clinics and group practices.",
  },
  "hospital-management": {
    slug: "hospital-management",
    name: "Hospital Management",
    shortName: "Hospital Mgmt",
    icon: "🏥",
    color: "teal",
    description:
      "End-to-end hospital operations: admissions, bed management, staff scheduling, pharmacy, and departmental coordination.",
  },
  crm: {
    slug: "crm",
    name: "CRM",
    shortName: "CRM",
    icon: "📊",
    color: "violet",
    description:
      "Sales pipeline, lead tracking, customer engagement, email campaigns, and revenue forecasting for any B2B/B2C business.",
  },
  "e-commerce": {
    slug: "e-commerce",
    name: "E-Commerce",
    shortName: "E-Commerce",
    icon: "🛒",
    color: "orange",
    description:
      "Product catalog, shopping cart, payments, inventory, shipping, and customer loyalty from storefront to fulfillment.",
  },
  "voice-chat-assistant": {
    slug: "voice-chat-assistant",
    name: "Professional Voice/Chat Assistant",
    shortName: "Voice Assistant",
    icon: "🎙️",
    color: "pink",
    description:
      "AI-powered voice and chat support for customer service, sales, scheduling, and FAQ handling across multiple channels.",
  },
  "freight-forwarder": {
    slug: "freight-forwarder",
    name: "Freight Forwarder (Export/Import)",
    shortName: "Freight Fwd",
    icon: "🚢",
    color: "cyan",
    description:
      "Shipment tracking, customs documentation, carrier management, rate negotiation, and compliance for global trade.",
  },
  "supply-chain-management": {
    slug: "supply-chain-management",
    name: "Supply Chain Management",
    shortName: "Supply Chain",
    icon: "🔗",
    color: "amber",
    description:
      "Procurement, vendor management, inventory optimization, demand forecasting, and warehouse operations.",
  },
  "lawyer-office": {
    slug: "lawyer-office",
    name: "Lawyer Office / Cases Management",
    shortName: "Legal Mgmt",
    icon: "⚖️",
    color: "slate",
    description:
      "Case tracking, document management, billable hours, client portal, court calendar, and legal research assistance.",
  },
  "insurance-tech": {
    slug: "insurance-tech",
    name: "Insurance Tech Management",
    shortName: "InsurTech",
    icon: "🛡️",
    color: "emerald",
    description:
      "Policy management, claims processing, underwriting, risk assessment, agent portals, and regulatory compliance.",
  },
  "real-estate-agency": {
    slug: "real-estate-agency",
    name: "Real Estate Agency Management",
    shortName: "Real Estate",
    icon: "🏠",
    color: "rose",
    description:
      "Property listings, CRM, virtual tours, contract management, commission tracking, and marketing automation.",
  },
};

export const USE_CASE_LIST: UseCase[] = Object.values(USE_CASES);

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES[slug as UseCaseSlug];
}
