import type { Metadata } from "next";
import { DemoPlayer } from "./_components/demo-player";

export const metadata: Metadata = {
  title: "Demo — Resto",
  description:
    "See Resto in action: from project setup to production deployment in minutes.",
};

export default function DemoPage() {
  return <DemoPlayer />;
}
