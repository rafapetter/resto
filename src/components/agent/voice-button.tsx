"use client";

import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
}: Props) {
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
      {voiceMode && isSupported && (
        <Button
          variant={recordingState === "listening" ? "destructive" : "outline"}
          size="sm"
          onMouseDown={onStartRecording}
          onMouseUp={onStopRecording}
          onTouchStart={onStartRecording}
          onTouchEnd={onStopRecording}
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

      {/* Browser support warning */}
      {voiceMode && !isSupported && (
        <span className="text-xs text-muted-foreground">
          Voice requires Chrome or Edge
        </span>
      )}
    </div>
  );
}
