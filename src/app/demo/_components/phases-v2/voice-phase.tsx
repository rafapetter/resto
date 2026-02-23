"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Mic, Bot, User } from "lucide-react";
import { WaveformVisualizer } from "../shared/waveform-visualizer";
import type { VoiceContent } from "@/lib/demo/types";

type Props = { isPlaying: boolean; onComplete: () => void; content: VoiceContent };

export default function VoicePhase({ isPlaying, onComplete, content }: Props) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const advanceLine = useCallback(() => {
    const nextIdx = currentLine + 1;
    if (nextIdx >= content.transcript.length) {
      onComplete();
      return;
    }

    const line = content.transcript[nextIdx];
    if (line.speaker === "user") {
      setIsListening(true);
      setIsSpeaking(false);
      // Simulate user speaking then transcription appearing
      setTimeout(() => {
        setCurrentLine(nextIdx);
        setDisplayedText("");
        // Typewriter the transcription
        let i = 0;
        const interval = setInterval(() => {
          i++;
          setDisplayedText(line.text.slice(0, i));
          if (i >= line.text.length) clearInterval(interval);
        }, 20);
        setTimeout(() => {
          setIsListening(false);
          clearInterval(interval);
          setDisplayedText(line.text);
        }, line.durationMs);
      }, 800);
    } else {
      setIsListening(false);
      setIsSpeaking(true);
      setCurrentLine(nextIdx);
      setDisplayedText("");
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(line.text.slice(0, i));
        if (i >= line.text.length) clearInterval(interval);
      }, 15);
      setTimeout(() => {
        setIsSpeaking(false);
        clearInterval(interval);
        setDisplayedText(line.text);
      }, line.durationMs);
    }
  }, [currentLine, content.transcript, onComplete]);

  // Start first line
  useEffect(() => {
    if (currentLine === -1) {
      const timer = setTimeout(advanceLine, 1000);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || currentLine < 0) return;
    const line = content.transcript[currentLine];
    if (!line) return;
    const timer = setTimeout(advanceLine, line.durationMs + 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentLine, content.transcript, advanceLine]);

  // Complete after last line
  useEffect(() => {
    if (currentLine >= content.transcript.length - 1 && !isListening && !isSpeaking && isPlaying) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentLine, content.transcript.length, isListening, isSpeaking, isPlaying, onComplete]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Voice Interaction</h2>
        <p className="text-sm text-muted-foreground">Simulating a morning briefing with your AI agent</p>
      </div>

      {/* Waveform */}
      <div className="flex h-16 w-full max-w-md items-center justify-center rounded-xl border bg-muted/50 px-4">
        <WaveformVisualizer active={isListening || isSpeaking} barCount={32} className="h-12 w-full" />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-sm">
        {isListening && (
          <>
            <Mic className="h-4 w-4 animate-pulse text-red-500" />
            <span className="text-red-500 font-medium">Listening...</span>
          </>
        )}
        {isSpeaking && (
          <>
            <Bot className="h-4 w-4 animate-pulse text-emerald-600" />
            <span className="text-emerald-600 font-medium">Agent speaking...</span>
          </>
        )}
        {!isListening && !isSpeaking && currentLine >= 0 && (
          <span className="text-muted-foreground">Processing...</span>
        )}
      </div>

      {/* Transcript */}
      <div className="w-full max-w-lg space-y-3">
        {content.transcript.slice(0, currentLine + 1).map((line, i) => (
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
  );
}
