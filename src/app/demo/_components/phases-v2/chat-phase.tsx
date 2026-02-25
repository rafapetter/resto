"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Check, Shield, MessageCircle, Hash, Mail } from "lucide-react";
import type { ChatContent, ChatMessage } from "@/lib/demo/types";

const CHANNELS = [
  { id: "resto", label: "Resto Chat", icon: Bot, color: "bg-emerald-600" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "bg-green-600" },
  { id: "telegram", label: "Telegram", icon: Send, color: "bg-blue-500" },
  { id: "slack", label: "Slack", icon: Hash, color: "bg-purple-600" },
  { id: "email", label: "Email", icon: Mail, color: "bg-rose-600" },
];

const CHANNEL_ORDER = ["resto", "whatsapp", "telegram", "slack", "email"];

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
  const { displayed, isDone } = useTypewriter(message.content, isAssistant && animate ? 8 : 0, animate);
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
  const MAX_MESSAGES = Math.min(content.script.length, 4);
  const SCRIPT = content.script.slice(0, MAX_MESSAGES);
  const [activeChannel, setActiveChannel] = useState("resto");
  const [channelStage, setChannelStage] = useState<"chat" | "cycling" | "done">("chat");
  const [transitioning, setTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const advancingRef = useRef(false);

  const advanceMessage = useCallback(() => {
    if (advancingRef.current) return;
    if (visibleMessages >= SCRIPT.length) return;
    advancingRef.current = true;
    setIsTyping(true);
    const delay = SCRIPT[visibleMessages]?.role === "assistant" ? 800 : 400;
    setTimeout(() => { setIsTyping(false); setVisibleMessages((v) => v + 1); advancingRef.current = false; }, delay);
  }, [visibleMessages, SCRIPT]);

  useEffect(() => { if (visibleMessages === 0) advanceMessage(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isPlaying || isTyping || visibleMessages === 0 || visibleMessages >= SCRIPT.length || channelStage !== "chat") return;
    const lastMsg = SCRIPT[visibleMessages - 1];
    if (lastMsg?.action && !approvalDone) { const t = setTimeout(() => setApprovalDone(true), 1000); return () => clearTimeout(t); }
    const timer = setTimeout(advanceMessage, 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleMessages, isTyping, approvalDone, advanceMessage, SCRIPT, channelStage]);

  // When chat messages are done, start channel cycling
  useEffect(() => {
    if (visibleMessages >= SCRIPT.length && !isTyping && channelStage === "chat") {
      const timer = setTimeout(() => setChannelStage("cycling"), 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, SCRIPT.length, isTyping, channelStage]);

  // Auto-cycle through channels with transition animation
  useEffect(() => {
    if (channelStage !== "cycling" || !isPlaying) return;
    const currentIdx = CHANNEL_ORDER.indexOf(activeChannel);
    if (currentIdx >= CHANNEL_ORDER.length - 1) {
      const timer = setTimeout(() => { setChannelStage("done"); onComplete(); }, 2000);
      return () => clearTimeout(timer);
    }
    const nextChannel = CHANNEL_ORDER[currentIdx + 1];
    const nextLabel = CHANNELS.find((c) => c.id === nextChannel)?.label ?? "";
    const timer = setTimeout(() => {
      setTransitionLabel(nextLabel);
      setTransitioning(true);
      setTimeout(() => {
        setActiveChannel(nextChannel);
        setTimeout(() => setTransitioning(false), 400);
      }, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [channelStage, activeChannel, isPlaying, onComplete]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [visibleMessages, isTyping]);

  return (
    <div className="relative flex h-full flex-col">
      {/* Transition overlay */}
      {transitioning && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
            {(() => { const Ch = CHANNELS.find((c) => c.label === transitionLabel); return Ch ? <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-white", Ch.color)}><Ch.icon className="h-7 w-7" /></div> : null; })()}
            <p className="text-sm font-semibold">Switching to {transitionLabel}...</p>
          </div>
        </div>
      )}

      {/* Channel tabs */}
      <div className="flex items-center gap-1 border-b px-4 py-2">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
              activeChannel === ch.id
                ? `${ch.color} text-white shadow-sm`
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ch.icon className="h-3 w-3" />
            {ch.label}
          </button>
        ))}
        {channelStage === "cycling" && !transitioning && (
          <span className="ml-auto text-[10px] text-muted-foreground animate-pulse">
            Also available on...
          </span>
        )}
      </div>

      {/* Chat area */}
      {activeChannel === "resto" ? (
        <>
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
        </>
      ) : (
        /* Other channel preview — with entrance animation */
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 animate-in fade-in slide-in-from-right-4 duration-500" key={activeChannel}>
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl text-white", CHANNELS.find((c) => c.id === activeChannel)?.color)}>
            {(() => { const Ch = CHANNELS.find((c) => c.id === activeChannel); return Ch ? <Ch.icon className="h-8 w-8" /> : null; })()}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Resto on {CHANNELS.find((c) => c.id === activeChannel)?.label}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {activeChannel === "whatsapp" && "Send a message anytime to check status, approve actions, or give instructions. Resto responds in seconds."}
              {activeChannel === "telegram" && "Quick commands and real-time alerts. Use /status, /approve, or /report for instant updates."}
              {activeChannel === "slack" && "Integrated into your team workspace with dedicated channels per project and slash commands."}
              {activeChannel === "email" && "Daily digests, detailed reports, and async communication. Resto summarizes everything you missed."}
            </p>
          </div>
          <div className="w-full max-w-sm rounded-xl border bg-muted/50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Resto</Badge>
                <span className="text-muted-foreground">
                  {activeChannel === "whatsapp" && "Your daily briefing is ready. Revenue: $47.8K ↑12%. 3 items need your attention."}
                  {activeChannel === "telegram" && "✅ Deploy complete. 0 errors. Site live at shopvelocity.vercel.app"}
                  {activeChannel === "slack" && "#shopvelocity — Cart recovery campaign launched. Targeting 187 abandoned carts ($28K potential)."}
                  {activeChannel === "email" && "Subject: Weekly Report — ShopVelocity. Revenue up 12%, 3 new features deployed, 99.98% uptime."}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
