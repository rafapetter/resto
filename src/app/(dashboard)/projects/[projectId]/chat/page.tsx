"use client";

import { useParams } from "next/navigation";
import { RestoChat } from "@/components/agent/resto-chat";

export default function ChatPage() {
  const params = useParams<{ projectId: string }>();
  return <RestoChat projectId={params.projectId} />;
}
