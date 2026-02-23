"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Check, Shield } from "lucide-react";

// ─── Scripted conversation ──────────────────────────────────────────

type Message = {
  role: "assistant" | "user";
  content: string;
  action?: {
    type: "approval";
    title: string;
    description: string;
  };
};

const SCRIPT: Message[] = [
  {
    role: "assistant",
    content:
      "Welcome to Bella's Bistro! I've already set up your project with online ordering, reservations, menu management, and a loyalty program. Let me start by building your core features.\n\nFirst, I'll scaffold the menu management system with a Next.js app, database schema, and API routes. I'll also seed your knowledge base with restaurant best practices.",
  },
  {
    role: "user",
    content: "Sounds great! Can you also set up Stripe for payments?",
  },
  {
    role: "assistant",
    content:
      "Absolutely! I'll integrate Stripe for payment processing. This falls under the Integrations category where you've set Quick Confirm approval.",
    action: {
      type: "approval",
      title: "Connect Stripe Integration",
      description:
        "Install @stripe/stripe-js, create checkout API route, add webhook handler for order confirmations",
    },
  },
  {
    role: "user",
    content: "Yes, go ahead!",
  },
  {
    role: "assistant",
    content:
      "Stripe is connected! I've created:\n\n• Payment checkout API route\n• Webhook handler for order events\n• Customer portal for subscription management\n\nI'm now generating the full online ordering flow with cart, checkout, and order confirmation pages. Your checklist is being updated in real-time.",
  },
  {
    role: "user",
    content: "This is amazing. How's the overall progress looking?",
  },
  {
    role: "assistant",
    content:
      "Here's where we stand:\n\n✅ Menu management system — complete\n✅ Stripe payment integration — complete\n✅ Online ordering flow — complete\n🔄 Table reservations — in progress\n⏳ Loyalty program — up next\n\nWe're about 65% through the build phase. I'm also writing documentation for your knowledge base as I go. Ready to deploy a preview?",
  },
];

// ─── Typewriter hook ────────────────────────────────────────────────

function useTypewriter(text: string, speed: number, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }
    setDisplayed("");
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

// ─── Chat bubble ────────────────────────────────────────────────────

function ChatBubble({
  message,
  animate,
  onTypingDone,
  onApprove,
  approved,
}: {
  message: Message;
  animate: boolean;
  onTypingDone?: () => void;
  onApprove?: () => void;
  approved?: boolean;
}) {
  const isAssistant = message.role === "assistant";
  const { displayed, isDone } = useTypewriter(
    message.content,
    isAssistant && animate ? 12 : 0,
    animate
  );

  useEffect(() => {
    if (isDone && onTypingDone) onTypingDone();
  }, [isDone, onTypingDone]);

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "justify-start" : "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        )}
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[80%] space-y-2", !isAssistant && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line",
            isAssistant
              ? "rounded-tl-sm bg-muted"
              : "rounded-tr-sm bg-emerald-600 text-white"
          )}
        >
          {displayed}
          {!isDone && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />
          )}
        </div>

        {/* Approval card */}
        {message.action && isDone && (
          <Card className="border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.action.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {message.action.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {approved ? (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <Check className="mr-1 h-3 w-3" />
                        Approved
                      </Badge>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="h-7 bg-emerald-600 text-xs hover:bg-emerald-700"
                          onClick={onApprove}
                        >
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Review Details
                        </Button>
                      </>
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

// ─── Thinking indicator ─────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
};

export function ChatPhase({ isPlaying, onComplete }: Props) {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const advancingRef = useRef(false);

  const advanceMessage = useCallback(() => {
    if (advancingRef.current) return;
    if (visibleMessages >= SCRIPT.length) {
      onComplete();
      return;
    }
    advancingRef.current = true;
    setIsTyping(true);
    const delay = SCRIPT[visibleMessages]?.role === "assistant" ? 1200 : 600;
    setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages((v) => v + 1);
      advancingRef.current = false;
    }, delay);
  }, [visibleMessages, onComplete]);

  // Start first message
  useEffect(() => {
    if (visibleMessages === 0) advanceMessage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play: advance after typing completes
  useEffect(() => {
    if (!isPlaying || isTyping) return;
    if (visibleMessages === 0 || visibleMessages >= SCRIPT.length) return;

    // Wait for approval interaction on message 3 (index 2)
    const lastMsg = SCRIPT[visibleMessages - 1];
    if (lastMsg?.action && !approvalDone) {
      const autoApprove = setTimeout(() => setApprovalDone(true), 1500);
      return () => clearTimeout(autoApprove);
    }

    const timer = setTimeout(advanceMessage, 2000);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleMessages, isTyping, approvalDone, advanceMessage]);

  // Auto-advance after last message
  useEffect(() => {
    if (visibleMessages >= SCRIPT.length && !isTyping && isPlaying) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, isTyping, isPlaying, onComplete]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleMessages, isTyping]);

  return (
    <div className="flex h-full flex-col">
      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {SCRIPT.slice(0, visibleMessages).map((msg, i) => (
          <ChatBubble
            key={i}
            message={msg}
            animate={i === visibleMessages - 1}
            onTypingDone={
              i === visibleMessages - 1 && !isPlaying
                ? () => {}
                : undefined
            }
            onApprove={msg.action ? () => setApprovalDone(true) : undefined}
            approved={msg.action ? approvalDone : undefined}
          />
        ))}
        {isTyping && <ThinkingIndicator />}
      </div>

      {/* Input bar */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2 rounded-xl border bg-background px-4 py-2">
          <input
            type="text"
            placeholder="Ask me anything about your project..."
            className="flex-1 bg-transparent text-sm outline-none"
            readOnly
            value={
              !isPlaying && visibleMessages < SCRIPT.length && !isTyping
                ? SCRIPT[visibleMessages]?.role === "user"
                  ? SCRIPT[visibleMessages]?.content ?? ""
                  : ""
                : ""
            }
          />
          <Button
            size="sm"
            className="h-8 w-8 rounded-lg bg-emerald-600 p-0 hover:bg-emerald-700"
            onClick={() => {
              if (!isTyping && visibleMessages < SCRIPT.length) {
                advanceMessage();
              }
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
