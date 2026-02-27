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

const CHANNEL_CONVERSATIONS: Record<string, { role: "user" | "resto"; text: string }[]> = {
  whatsapp: [
    { role: "user", text: "Hey Resto, how's ShopVelocity doing today?" },
    { role: "resto", text: "Morning! Revenue is $47.8K ↑12% from yesterday. 3 items need your attention." },
    { role: "user", text: "What items?" },
    { role: "resto", text: "1) Cart abandonment up 8% — I've drafted a recovery email. 2) Inventory alert: Blue Widget below threshold. 3) New review flagged for response. Want me to handle all three?" },
    { role: "user", text: "Yes, handle them all 👍" },
    { role: "resto", text: "Done ✅ Recovery email sent to 187 carts, reorder placed for Blue Widget (qty 500), and review response posted. I'll send you a summary tonight." },
  ],
  telegram: [
    { role: "user", text: "/status" },
    { role: "resto", text: "📊 ShopVelocity Status\n━━━━━━━━━━━\n✅ Site: Online (99.98%)\n💰 Today: $12.4K revenue\n👥 Active users: 342\n🛒 Orders: 89 (+15%)" },
    { role: "user", text: "/deploy preview" },
    { role: "resto", text: "🚀 Deploy initiated...\n⏳ Building... (23s)\n✅ Preview deployed!\n🔗 preview-v47.shopvelocity.vercel.app" },
    { role: "user", text: "/approve deploy production" },
    { role: "resto", text: "✅ Production deploy complete!\n0 errors. All health checks passing.\nSite live at shopvelocity.com" },
  ],
  slack: [
    { role: "resto", text: "#shopvelocity — 🔔 Daily Standup\nHere's what happened overnight:" },
    { role: "resto", text: "• Cart recovery campaign launched → 187 carts targeted ($28K potential)\n• Auto-fixed 3 broken product links\n• SEO scores improved: 78 → 84" },
    { role: "user", text: "Nice! Can you run the A/B test on the new checkout flow?" },
    { role: "resto", text: "Starting A/B test now. Variant A (current) vs Variant B (simplified 2-step). I'll split traffic 50/50 and report results in 48h. 🧪" },
  ],
  email: [
    { role: "resto", text: "Subject: Weekly Report — ShopVelocity\n\nHi there,\n\nHere's your weekly summary:" },
    { role: "resto", text: "📈 Revenue: $47.8K (+12%)\n👥 New customers: 234\n🛒 Conversion rate: 3.8% (+0.4pp)\n⚡ Avg load time: 1.2s\n🚀 Features shipped: 3" },
    { role: "resto", text: "Action items for your review:\n• Approve holiday pricing strategy\n• Review new supplier proposal\n• Confirm Q2 marketing budget" },
    { role: "user", text: "Reply: Approve the holiday pricing. Let's discuss the supplier proposal in our meeting Thursday." },
    { role: "resto", text: "Got it! Holiday pricing activated. I've added the supplier discussion to Thursday's agenda and prepared a comparison doc for the meeting." },
  ],
};

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

// Platform-styled chat bubble for channel previews
const CHANNEL_STYLES: Record<string, { userBg: string; restoBg: string; restoAvatar: string; userAvatar: string; containerBg: string }> = {
  whatsapp:  { userBg: "bg-green-800 text-white",   restoBg: "bg-zinc-800 text-zinc-100", restoAvatar: "bg-green-600",  userAvatar: "bg-zinc-600",   containerBg: "bg-[#0b141a]" },
  telegram:  { userBg: "bg-blue-700 text-white",    restoBg: "bg-zinc-800 text-zinc-100", restoAvatar: "bg-blue-500",   userAvatar: "bg-indigo-600", containerBg: "bg-[#0e1621]" },
  slack:     { userBg: "bg-transparent text-zinc-200 border border-zinc-700", restoBg: "bg-transparent text-zinc-200 border border-zinc-700", restoAvatar: "bg-purple-600", userAvatar: "bg-zinc-600", containerBg: "bg-[#1a1d21]" },
  email:     { userBg: "bg-blue-900/50 text-zinc-200 border border-blue-800/50", restoBg: "bg-zinc-800/80 text-zinc-200 border border-zinc-700/50", restoAvatar: "bg-rose-600", userAvatar: "bg-zinc-600", containerBg: "bg-zinc-900" },
};

function ChannelConversation({ channelId }: { channelId: string }) {
  const messages = CHANNEL_CONVERSATIONS[channelId] ?? [];
  const styles = CHANNEL_STYLES[channelId] ?? CHANNEL_STYLES.whatsapp;
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(0);
  }, [channelId]);

  useEffect(() => {
    if (visibleCount >= messages.length) return;
    const timer = setTimeout(() => setVisibleCount((v) => v + 1), visibleCount === 0 ? 300 : 700);
    return () => clearTimeout(timer);
  }, [visibleCount, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleCount]);

  const ch = CHANNELS.find((c) => c.id === channelId);

  return (
    <div className={cn("flex flex-1 flex-col rounded-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500", styles.containerBg)} key={channelId}>
      {/* Platform header */}
      <div className="flex items-center gap-2 border-b border-zinc-700/50 px-4 py-2.5">
        {ch && <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-white", ch.color)}><ch.icon className="h-3.5 w-3.5" /></div>}
        <div>
          <p className="text-sm font-semibold text-white">Resto AI</p>
          <p className="text-[10px] text-zinc-400">
            {channelId === "whatsapp" && "online"}
            {channelId === "telegram" && "bot • last seen just now"}
            {channelId === "slack" && "#shopvelocity"}
            {channelId === "email" && "resto@shopvelocity.com"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.slice(0, visibleCount).map((msg, i) => {
          const isUser = msg.role === "user";
          const isLatest = i === visibleCount - 1;
          return (
            <div key={i} className={cn("flex gap-2", isUser ? "flex-row-reverse" : "")}>
              <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold", isUser ? styles.userAvatar : styles.restoAvatar)}>
                {isUser ? "Y" : "R"}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-xs whitespace-pre-line transition-all duration-300",
                isUser ? styles.userBg : styles.restoBg,
                isUser ? "rounded-tr-sm" : "rounded-tl-sm",
                isLatest ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""
              )}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {visibleCount < messages.length && visibleCount > 0 && (
          <div className="flex gap-2">
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold", messages[visibleCount]?.role === "user" ? styles.userAvatar : styles.restoAvatar)}>
              {messages[visibleCount]?.role === "user" ? "Y" : "R"}
            </div>
            <div className="flex items-center gap-1 rounded-xl rounded-tl-sm bg-zinc-800 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Props = { isPlaying: boolean; onComplete: () => void; content: ChatContent };

export default function ChatPhase({ isPlaying, onComplete, content }: Props) {
  const MAX_MESSAGES = Math.min(content.script.length, 3);
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
    const timer = setTimeout(advanceMessage, 800);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleMessages, isTyping, approvalDone, advanceMessage, SCRIPT, channelStage]);

  // When chat messages are done, start channel cycling
  useEffect(() => {
    if (visibleMessages >= SCRIPT.length && !isTyping && channelStage === "chat") {
      const timer = setTimeout(() => setChannelStage("cycling"), 800);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, SCRIPT.length, isTyping, channelStage]);

  // Time each channel stays visible (enough for messages to animate in)
  const CHANNEL_DWELL_MS = 3000;
  const TRANSITION_MS = 500;

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
        setTimeout(() => setTransitioning(false), 300);
      }, TRANSITION_MS);
    }, CHANNEL_DWELL_MS);
    return () => clearTimeout(timer);
  }, [channelStage, activeChannel, isPlaying, onComplete]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [visibleMessages, isTyping]);

  return (
    <div className="relative flex h-full flex-col">
      {/* Transition overlay */}
      {transitioning && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
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
        <div className="flex flex-1 p-4">
          <ChannelConversation channelId={activeChannel} />
        </div>
      )}
    </div>
  );
}
