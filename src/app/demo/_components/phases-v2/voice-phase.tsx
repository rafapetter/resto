"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mic, Bot, User, Phone, Video, Users, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformVisualizer } from "../shared/waveform-visualizer";
import type { VoiceContent } from "@/lib/demo/types";

const VOICE_CHANNELS = [
  { id: "app", label: "Resto App", icon: Bot, color: "bg-emerald-600" },
  { id: "phone", label: "Phone Call", icon: Phone, color: "bg-blue-600" },
  { id: "meeting", label: "Team Meeting", icon: Video, color: "bg-violet-600" },
];

const CHANNEL_ORDER = ["app", "phone", "meeting"];

const MEETING_PARTICIPANTS = [
  { name: "You", role: "Founder", color: "bg-blue-500" },
  { name: "Resto", role: "AI Co-Founder", color: "bg-emerald-500" },
  { name: "Sarah L.", role: "Marketing Lead", color: "bg-violet-500" },
  { name: "Tom K.", role: "Sales Manager", color: "bg-amber-500" },
];

type Props = { isPlaying: boolean; onComplete: () => void; content: VoiceContent };

export default function VoicePhase({ isPlaying, onComplete, content }: Props) {
  const MAX_LINES = Math.min(content.transcript.length, 3);
  const transcript = content.transcript.slice(0, MAX_LINES);
  const [activeChannel, setActiveChannel] = useState("app");
  const [channelStage, setChannelStage] = useState<"voice" | "cycling" | "done">("voice");
  const [transitioning, setTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const [currentLine, setCurrentLine] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioInitRef = useRef(false);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !audioEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const english = voices.filter((v) => v.lang.startsWith("en"));
        const preferred = english.find((v) => v.name.includes("Google")) ||
                          english.find((v) => v.name.includes("Daniel")) ||
                          english.find((v) => v.name.includes("Alex")) ||
                          english.find((v) => !v.localService) ||
                          english[0];
        if (preferred) utterance.voice = preferred;
      }

      utterance.onstart = () => setAudioPlaying(true);
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      // speechSynthesis may not be available
    }
  }, [audioEnabled]);

  const toggleAudio = useCallback(() => {
    if (!audioEnabled) {
      // Trigger a silent speech to unlock audio context (browser policy)
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
        audioInitRef.current = true;
      }
    } else {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
        setAudioPlaying(false);
      }
    }
    setAudioEnabled((prev) => !prev);
  }, [audioEnabled]);

  // Initialize voices early
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const handler = () => { /* voices loaded */ };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
  }, []);

  const advanceLine = useCallback(() => {
    const nextIdx = currentLine + 1;
    if (nextIdx >= transcript.length) return;

    const line = transcript[nextIdx];
    if (line.speaker === "user") {
      setIsListening(true);
      setIsSpeaking(false);
      setTimeout(() => {
        setCurrentLine(nextIdx);
        setDisplayedText("");
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setDisplayedText(line.text.slice(0, i));
          if (i >= line.text.length) clearInterval(interval);
        }, 20);
        const duration = Math.min(line.durationMs, 1500);
        setTimeout(() => {
          setIsListening(false);
          clearInterval(interval);
          setDisplayedText(line.text);
        }, duration);
      }, 300);
    } else {
      setIsListening(false);
      setIsSpeaking(true);
      setCurrentLine(nextIdx);
      setDisplayedText("");
      speak(line.text);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(line.text.slice(0, i));
        if (i >= line.text.length) clearInterval(interval);
      }, 12);
      const duration = Math.min(line.durationMs, 2000);
      setTimeout(() => {
        setIsSpeaking(false);
        clearInterval(interval);
        setDisplayedText(line.text);
      }, duration);
    }
  }, [currentLine, transcript, speak]);

  useEffect(() => {
    if (currentLine === -1) {
      const timer = setTimeout(advanceLine, 800);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isPlaying || currentLine < 0 || channelStage !== "voice") return;
    const line = transcript[currentLine];
    if (!line) return;
    const delay = Math.min(line.durationMs, 1500) + 400;
    const timer = setTimeout(advanceLine, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, currentLine, transcript, advanceLine, channelStage]);

  // When transcript finishes, start cycling
  useEffect(() => {
    if (currentLine >= transcript.length - 1 && !isListening && !isSpeaking && channelStage === "voice") {
      const timer = setTimeout(() => setChannelStage("cycling"), 800);
      return () => clearTimeout(timer);
    }
  }, [currentLine, transcript.length, isListening, isSpeaking, channelStage]);

  // Auto-cycle with transition overlay — fast transitions
  const CHANNEL_DWELL_MS = 1500;
  const TRANSITION_MS = 400;
  useEffect(() => {
    if (channelStage !== "cycling" || !isPlaying) return;
    const currentIdx = CHANNEL_ORDER.indexOf(activeChannel);
    if (currentIdx >= CHANNEL_ORDER.length - 1) {
      const timer = setTimeout(() => { setChannelStage("done"); onComplete(); }, 2000);
      return () => clearTimeout(timer);
    }
    const nextChannel = CHANNEL_ORDER[currentIdx + 1];
    const nextLabel = VOICE_CHANNELS.find((c) => c.id === nextChannel)?.label ?? "";
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

  useEffect(() => {
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  return (
    <div className="relative flex h-full flex-col">
      {/* Transition overlay */}
      {transitioning && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
            {(() => { const Ch = VOICE_CHANNELS.find((c) => c.label === transitionLabel); return Ch ? <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-white", Ch.color)}><Ch.icon className="h-7 w-7" /></div> : null; })()}
            <p className="text-sm font-semibold">Switching to {transitionLabel}...</p>
          </div>
        </div>
      )}

      {/* Channel tabs */}
      <div className="flex items-center gap-1 border-b px-4 py-2">
        {VOICE_CHANNELS.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
              activeChannel === ch.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ch.icon className="h-3 w-3" />
            {ch.label}
          </button>
        ))}
        {channelStage === "cycling" && !transitioning && (
          <span className="ml-2 text-[10px] text-muted-foreground animate-pulse">
            Also available via...
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAudio}
          className={cn("ml-auto gap-1.5 text-xs", audioEnabled ? "text-emerald-500" : "text-muted-foreground")}
        >
          {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          {audioEnabled ? (audioPlaying ? "Speaking..." : "Audio On") : "Audio Off"}
        </Button>
      </div>

      {activeChannel === "app" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Voice Interaction</h2>
            <p className="text-sm text-muted-foreground">Morning briefing with your AI co-founder</p>
          </div>

          <div className="flex h-16 w-full max-w-md items-center justify-center rounded-xl border bg-muted/50 px-4">
            <WaveformVisualizer active={isListening || isSpeaking} barCount={32} className="h-12 w-full" />
          </div>

          <div className="flex items-center gap-2 text-sm">
            {isListening && <><Mic className="h-4 w-4 animate-pulse text-red-500" /><span className="text-red-500 font-medium">Listening...</span></>}
            {isSpeaking && <><Bot className="h-4 w-4 animate-pulse text-emerald-600" /><span className="text-emerald-600 font-medium">Resto speaking...</span></>}
            {!isListening && !isSpeaking && currentLine >= 0 && <span className="text-muted-foreground">Processing...</span>}
          </div>

          {!audioEnabled && currentLine <= 1 && (
            <Button
              onClick={toggleAudio}
              variant="outline"
              className="gap-2 border-emerald-700 text-emerald-400 hover:bg-emerald-950 hover:text-emerald-300"
            >
              <Volume2 className="h-4 w-4" />
              Turn on audio to hear Resto speak
            </Button>
          )}

          <div className="w-full max-w-lg space-y-3">
            {transcript.slice(0, currentLine + 1).map((line, i) => (
              <div key={i} className={cn("flex gap-3", line.speaker === "user" ? "flex-row-reverse" : "")}>
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", line.speaker === "agent" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300")}>
                  {line.speaker === "agent" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm", line.speaker === "agent" ? "rounded-tl-sm bg-muted" : "rounded-tr-sm bg-emerald-600 text-white")}>
                  {i === currentLine ? displayedText : line.text}
                  {i === currentLine && (isListening || isSpeaking) && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeChannel === "phone" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 animate-in fade-in slide-in-from-right-4 duration-500" key="phone">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-cyan-500 shadow-2xl shadow-emerald-500/20">
            <Phone className="h-12 w-12 text-white" />
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" style={{ animationDuration: "2s" }} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Call Your AI Co-Founder</h3>
            <p className="mt-1 text-sm text-muted-foreground">Dial in from any phone number to get instant project updates, give instructions, or approve actions via voice.</p>
          </div>
          <div className="w-full max-w-sm space-y-2 rounded-xl border bg-muted/50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Hotline</span><span className="font-mono font-medium">+1 (888) RESTO-AI</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Languages</span><span>English, Spanish, Portuguese</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span className="text-emerald-500 font-medium">24/7</span></div>
          </div>
        </div>
      )}

      {activeChannel === "meeting" && (
        <div className="flex flex-1 flex-col gap-4 p-6 animate-in fade-in slide-in-from-right-4 duration-500" key="meeting">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Team Meeting with Resto</h3>
            <p className="text-sm text-muted-foreground">Resto joins your meetings as a participant — provides context, takes notes, and executes actions in real-time.</p>
          </div>

          <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-3">
            {MEETING_PARTICIPANTS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold", p.color)}>
                  {p.name === "Resto" ? <Bot className="h-5 w-5" /> : p.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                </div>
                <div className="ml-auto">
                  <WaveformVisualizer active={p.name === "Resto" || p.name === "You"} barCount={5} className="h-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-xl border bg-zinc-900 p-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-xs text-muted-foreground">
              <p><span className="text-emerald-400 font-medium">Resto:</span> &quot;Based on last week&apos;s data, I recommend increasing ad spend on Instagram by 20%. I&apos;ve prepared the campaign — shall I launch it?&quot;</p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg space-y-1 rounded-xl border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Meeting Actions (auto-captured):</p>
            <div className="flex items-center gap-2 text-xs"><span className="text-emerald-400">✓</span> Reviewed weekly KPIs — revenue up 12%</div>
            <div className="flex items-center gap-2 text-xs"><span className="text-emerald-400">✓</span> Approved Instagram campaign ($2K budget)</div>
            <div className="flex items-center gap-2 text-xs"><span className="text-amber-400">◌</span> Schedule follow-up for Thursday</div>
          </div>
        </div>
      )}
    </div>
  );
}
