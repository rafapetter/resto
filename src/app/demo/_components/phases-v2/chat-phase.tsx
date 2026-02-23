"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Check, Shield } from "lucide-react";
import type { ChatContent, ChatMessage } from "@/lib/demo/types";

function useTypewriter(text: string, speed: number, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (!enabled) { setDisplayed(text); setIsDone(true); return; }
    setDisplayed(""); setIsDone(false);
    let i = 0;
    const interval = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) { setIsDone(true); clearInterval(interval); } }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);
  return { displayed, isDone };
}

function ChatBubble({ message, animate, onApprove, approved }: { message: ChatMessage; animate: boolean; onApprove?: () => void; approved?: boolean }) {
  const isAssistant = message.role === "assistant";
  const { displayed, isDone } = useTypewriter(message.content, isAssistant && animate ? 12 : 0, animate);
  return (
    <div className={cn("flex gap-3", isAssistant ? "justify-start" : "flex-row-reverse")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", isAssistant ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300")}>
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[80%] space-y-2", !isAssistant && "text-right")}>
        <div className={cn("inline-block rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line", isAssistant ? "rounded-tl-sm bg-muted" : "rounded-tr-sm bg-emerald-600 text-white")}>
          {displayed}
          {!isDone && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />}
        </div>
        {message.action && isDone && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.action.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{message.action.description}</p>
                  <div className="mt-2 flex gap-2">
                    {approved ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"><Check className="mr-1 h-3 w-3" />Approved</Badge>
                    ) : (
                      <Button size="sm" className="h-7 bg-emerald-600 text-xs hover:bg-emerald-700" onClick={onApprove}>Approve</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"><Bot className="h-4 w-4" /></div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

type Props = { isPlaying: boolean; onComplete: () => void; content: ChatContent };

export default function ChatPhase({ isPlaying, onComplete, content }: Props) {
  const SCRIPT = content.script;
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const advancingRef = useRef(false);

  const advanceMessage = useCallback(() => {
    if (advancingRef.current) return;
    if (visibleMessages >= SCRIPT.length) { onComplete(); return; }
    advancingRef.current = true;
    setIsTyping(true);
    const delay = SCRIPT[visibleMessages]?.role === "assistant" ? 1200 : 600;
    setTimeout(() => { setIsTyping(false); setVisibleMessages((v) => v + 1); advancingRef.current = false; }, delay);
  }, [visibleMessages, SCRIPT, onComplete]);

  useEffect(() => { if (visibleMessages === 0) advanceMessage(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isPlaying || isTyping || visibleMessages === 0 || visibleMessages >= SCRIPT.length) return;
    const lastMsg = SCRIPT[visibleMessages - 1];
    if (lastMsg?.action && !approvalDone) { const t = setTimeout(() => setApprovalDone(true), 1500); return () => clearTimeout(t); }
    const timer = setTimeout(advanceMessage, 2000);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleMessages, isTyping, approvalDone, advanceMessage, SCRIPT]);

  useEffect(() => {
    if (visibleMessages >= SCRIPT.length && !isTyping && isPlaying) { const t = setTimeout(onComplete, 3000); return () => clearTimeout(t); }
  }, [visibleMessages, SCRIPT.length, isTyping, isPlaying, onComplete]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [visibleMessages, isTyping]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {SCRIPT.slice(0, visibleMessages).map((msg, i) => (
          <ChatBubble key={i} message={msg} animate={i === visibleMessages - 1} onApprove={msg.action ? () => setApprovalDone(true) : undefined} approved={msg.action ? approvalDone : undefined} />
        ))}
        {isTyping && <ThinkingIndicator />}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2">
          <input type="text" placeholder="Ask me anything about your project..." className="flex-1 bg-transparent text-sm outline-none" readOnly />
          <Button size="sm" className="h-8 w-8 rounded-lg bg-emerald-600 p-0 hover:bg-emerald-700" onClick={() => { if (!isTyping && visibleMessages < SCRIPT.length) advanceMessage(); }}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
