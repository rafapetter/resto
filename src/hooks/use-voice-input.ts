"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceInputState = "idle" | "listening" | "processing" | "error";

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [state, setState] = useState<VoiceInputState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  // Call this when voice mode is enabled to eagerly request mic permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted — stop the stream immediately, we just needed the grant
      stream.getTracks().forEach((t) => t.stop());
      setError(null);
      setState("idle");
    } catch {
      setError(
        "Microphone access denied. Allow microphone access in your browser settings."
      );
      setState("error");
    }
  }, [isSupported]);

  const start = useCallback(() => {
    if (!isSupported) {
      setError("Voice not supported in this browser. Use Chrome or Edge.");
      setState("error");
      return;
    }

    // Abort any ongoing recognition before starting a new one
    recognitionRef.current?.abort();

    setError(null);
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
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
        // Let onend handle the reset back to idle
      }
      // If no transcript, onend will set back to idle
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
    // Don't force idle here — let onend handle it so we don't race with onresult
  }, []);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { state, error, isSupported, start, stop, requestPermission };
}
