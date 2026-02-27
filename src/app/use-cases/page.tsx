import type { Metadata } from "next";
import UseCasesContent from "./use-cases-content";

export const metadata: Metadata = {
  title: "Use Cases — Resto",
  description:
    "See how Resto builds full-stack businesses across 10 industries with AI agents.",
};

export default function UseCasesPage() {
  return <UseCasesContent />;
}
