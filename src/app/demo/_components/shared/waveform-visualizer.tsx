"use client";

import { cn } from "@/lib/utils";

type Props = {
  active: boolean;
  barCount?: number;
  color?: string;
  className?: string;
};

export function WaveformVisualizer({
  active,
  barCount = 24,
  color = "emerald",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-[2px]",
        className
      )}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const baseHeight = 4 + Math.random() * 20;
        const delay = (i * 80) % 600;

        return (
          <div
            key={i}
            className={cn(
              "w-[3px] rounded-full transition-all duration-200",
              active
                ? `bg-${color}-500 dark:bg-${color}-400`
                : "bg-muted"
            )}
            style={{
              height: active ? `${baseHeight}px` : "4px",
              animationName: active ? "waveform" : "none",
              animationDuration: "800ms",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationDelay: `${delay}ms`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes waveform {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
