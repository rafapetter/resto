"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VoiceInputState } from "@/hooks/use-voice-input";

type Props = {
  voiceMode: boolean;
  onToggleVoiceMode: () => void;
  recordingState: VoiceInputState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isSupported: boolean;
  error?: string | null;
  onRetryPermission?: () => void;
};

export function VoiceButton({
  voiceMode,
  onToggleVoiceMode,
  recordingState,
  onStartRecording,
  onStopRecording,
  isSpeaking,
  onStopSpeaking,
  isSupported,
  error,
  onRetryPermission,
}: Props) {
  const isHoldingRef = useRef(false);

  // Listen for mouseup/touchend on document so releasing outside the button still stops recording
  useEffect(() => {
    if (!voiceMode) return;

    const handleGlobalRelease = () => {
      if (isHoldingRef.current) {
        isHoldingRef.current = false;
        onStopRecording();
      }
    };

    document.addEventListener("mouseup", handleGlobalRelease);
    document.addEventListener("touchend", handleGlobalRelease);
    return () => {
      document.removeEventListener("mouseup", handleGlobalRelease);
      document.removeEventListener("touchend", handleGlobalRelease);
    };
  }, [voiceMode, onStopRecording]);

  const handlePressStart = () => {
    isHoldingRef.current = true;
    onStartRecording();
  };

  const handlePressEnd = () => {
    isHoldingRef.current = false;
    onStopRecording();
  };

  return (
    <div className="flex items-center gap-2 border-t bg-muted/20 px-3 py-1.5">
      {/* Voice mode toggle */}
      <Button
        variant={voiceMode ? "default" : "ghost"}
        size="sm"
        onClick={onToggleVoiceMode}
        title={voiceMode ? "Disable voice mode" : "Enable voice mode"}
        className="h-7 gap-1.5 text-xs"
      >
        {voiceMode ? (
          <Volume2 className="h-3.5 w-3.5" />
        ) : (
          <VolumeX className="h-3.5 w-3.5" />
        )}
        Voice
      </Button>

      {/* Hold-to-speak mic button — only when voice mode on and supported */}
      {voiceMode && isSupported && recordingState !== "error" && (
        <Button
          variant={recordingState === "listening" ? "destructive" : "outline"}
          size="sm"
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onTouchStart={(e) => {
            e.preventDefault(); // prevent ghost mouse events on touch
            handlePressStart();
          }}
          onTouchEnd={handlePressEnd}
          disabled={recordingState === "processing"}
          title="Hold to speak"
          className={cn(
            "h-7 select-none gap-1.5 text-xs",
            recordingState === "listening" && "animate-pulse"
          )}
        >
          {recordingState === "listening" ? (
            <>
              <MicOff className="h-3.5 w-3.5" />
              Release to send
            </>
          ) : recordingState === "processing" ? (
            <>
              <Mic className="h-3.5 w-3.5" />
              Sending…
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5" />
              Hold to speak
            </>
          )}
        </Button>
      )}

      {/* Speaking indicator with stop button */}
      {voiceMode && isSpeaking && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onStopSpeaking}
          className="h-7 animate-pulse gap-1.5 text-xs text-muted-foreground"
          title="Click to stop"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Speaking…
        </Button>
      )}

      {/* Error feedback with retry button */}
      {voiceMode && recordingState === "error" && error && (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Microphone access denied.
          {onRetryPermission && (
            <button
              onClick={onRetryPermission}
              className="underline underline-offset-2 hover:no-underline"
            >
              Click to retry
            </button>
          )}
        </span>
      )}

      {/* Browser support warning */}
      {voiceMode && !isSupported && (
        <span className="text-xs text-muted-foreground">
          Voice requires Chrome or Edge
        </span>
      )}
    </div>
  );
}
