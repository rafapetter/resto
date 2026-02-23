import type { Metadata } from "next";
import { getUseCase, USE_CASES } from "@/lib/demo/use-cases";
import { notFound } from "next/navigation";
import { DemoPlayerShell } from "../_components/demo-player-shell";

export function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};
  return {
    title: `${useCase.name} Demo — Resto`,
    description: `See how Resto builds a ${useCase.name} system from idea to production.`,
  };
}

export default async function UseCaseDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();
  return <DemoPlayerShell slug={slug} />;
}
