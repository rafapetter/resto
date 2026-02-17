"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceInputState = "idle" | "listening" | "processing" | "error";

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [state, setState] = useState<VoiceInputState>("idle");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (!isSupported) {
      setError("Voice not supported in this browser. Use Chrome or Edge.");
      setState("error");
      return;
    }

    setError(null);
    const SR =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";

    r.onstart = () => setState("listening");

    r.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript?.trim() ?? "";
      if (transcript) {
        setState("processing");
        onTranscript(transcript);
      }
      setState("idle");
    };

    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== "aborted") {
        setError(`Voice error: ${e.error}`);
        setState("error");
      } else {
        setState("idle");
      }
    };

    r.onend = () => setState((s) => (s === "error" ? s : "idle"));

    recognitionRef.current = r;
    r.start();
  }, [isSupported, onTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
  }, []);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { state, error, isSupported, start, stop };
}
