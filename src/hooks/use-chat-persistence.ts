"use client";

import { useEffect, useRef } from "react";
import { useCopilotChatInternal } from "@copilotkit/react-core";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertAguiToDb, convertDbToAgui } from "@/lib/chat/message-converter";
import type { Message as DbMessage } from "@/server/db/schema/conversations";

export function useChatPersistence(projectId: string) {
  const trpc = useTRPC();
  const { messages, setMessages } = useCopilotChatInternal();
  const hasRestored = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load conversation on mount
  const { data: conversation, isLoading } = useQuery(
    trpc.chat.getConversation.queryOptions({ projectId })
  );

  // Save mutation
  const saveMut = useMutation(
    trpc.chat.saveConversation.mutationOptions({})
  );

  // Restore messages from DB (once)
  useEffect(() => {
    if (hasRestored.current || isLoading) return;
    if (conversation?.messages && (conversation.messages as DbMessage[]).length > 0) {
      const agui = convertDbToAgui(conversation.messages as DbMessage[]);
      setMessages(agui);
    }
    hasRestored.current = true;
  }, [conversation, isLoading, setMessages]);

  // Debounced auto-save on message changes
  useEffect(() => {
    if (!hasRestored.current) return;
    if (messages.length === 0) return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const dbMessages = convertAguiToDb(messages);
      saveMut.mutate({ projectId, messages: dbMessages });
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [messages, projectId, saveMut.mutate]);

  return {
    isLoading,
    hasRestored: hasRestored.current,
    messageCount: messages.length,
  };
}
