"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/demo/i18n/context";
import type { ViewMode } from "@/lib/demo/types";

// ─── Matrix digital rain canvas ─────────────────────────────────────

function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFRESTØ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () =>
      Math.random() * -100
    );

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = "#ffffff";
        } else if (brightness > 0.8) {
          ctx.fillStyle = "#6ee7b7";
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + brightness * 0.5})`;
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}

// ─── Pill component ─────────────────────────────────────────────────

function Pill({
  color,
  label,
  sublabel,
  tooltip,
  hovered,
  onHover,
  onClick,
}: {
  color: "blue" | "red";
  label: string;
  sublabel: string;
  tooltip?: string;
  hovered: boolean;
  onHover: (h: boolean) => void;
  onClick: () => void;
}) {
  const isBlue = color === "blue";
  const gradientFrom = isBlue ? "from-blue-500" : "from-red-500";
  const gradientTo = isBlue ? "to-cyan-400" : "to-orange-400";
  const glowColor = isBlue ? "shadow-blue-500/60" : "shadow-red-500/60";
  const ringColor = isBlue ? "ring-blue-400/50" : "ring-red-400/50";
  const textColor = isBlue ? "text-blue-300" : "text-red-300";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "group relative flex flex-col items-center gap-4 transition-all duration-500",
        hovered && "scale-110"
      )}
    >
      {/* Pill shape */}
      <div
        className={cn(
          "relative h-16 w-36 rounded-full bg-gradient-to-r transition-all duration-500 sm:h-20 sm:w-44",
          gradientFrom,
          gradientTo,
          hovered ? `shadow-2xl ${glowColor} ring-2 ${ringColor}` : "shadow-lg"
        )}
      >
        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
        {/* Reflection */}
        <div className="absolute bottom-2 left-4 right-4 h-3 rounded-full bg-white/10 blur-sm" />
        {/* Pulse ring on hover */}
        {hovered && (
          <div
            className={cn(
              "absolute inset-0 animate-ping rounded-full opacity-20 bg-gradient-to-r",
              gradientFrom,
              gradientTo
            )}
            style={{ animationDuration: "2s" }}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={cn("text-lg font-bold tracking-wide", textColor)}>
          {label}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{sublabel}</p>
      </div>

      {/* Preview tooltip on hover */}
      {hovered && (
        <div className="absolute -bottom-24 w-64 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-center text-xs text-zinc-300 shadow-xl backdrop-blur">
            {tooltip}
          </div>
        </div>
      )}
    </button>
  );
}

// ─── Pixel Morpheus (standing, bald, sunglasses, long coat) ─────────

function PixelMorpheus({ tick }: { tick: number }) {
  const breathe = Math.sin(tick * 0.3) * 0.4;
  const glintOn = tick % 8 < 2;

  return (
    <div className="relative flex flex-col items-center" style={{ transform: `translateY(${breathe}px)` }}>
      {/* Bald head */}
      <div className="relative h-[14px] w-[16px] rounded-t-[7px] rounded-b-[3px]" style={{ backgroundColor: "#7a5a10" }}>
        {/* Scalp shine */}
        <div className="absolute left-[4px] top-[1px] h-[3px] w-[8px] rounded-full" style={{ backgroundColor: "#9a7a20", opacity: 0.4 }} />
        {/* Ears — small nubs */}
        <div className="absolute -left-[1px] top-[5px] h-[3px] w-[1px] rounded-l-full" style={{ backgroundColor: "#6b4e0e" }} />
        <div className="absolute -right-[1px] top-[5px] h-[3px] w-[1px] rounded-r-full" style={{ backgroundColor: "#6b4e0e" }} />
        {/* Sunglasses */}
        <div className="absolute left-[2px] top-[5px] flex items-center gap-[1px]">
          <div className="relative h-[4px] w-[5px] rounded-[1px]" style={{ backgroundColor: "#111" }}>
            {glintOn && <div className="absolute left-[1px] top-[1px] h-[1px] w-[2px]" style={{ backgroundColor: "#10b981" }} />}
          </div>
          <div className="h-[1px] w-[2px]" style={{ backgroundColor: "#555" }} />
          <div className="relative h-[4px] w-[5px] rounded-[1px]" style={{ backgroundColor: "#111" }}>
            {glintOn && <div className="absolute right-[1px] top-[1px] h-[1px] w-[2px]" style={{ backgroundColor: "#10b981" }} />}
          </div>
        </div>
        {/* Nose */}
        <div className="absolute bottom-[2px] left-1/2 h-[2px] w-[2px] -translate-x-1/2 rounded-b-full" style={{ backgroundColor: "#6b4e0e" }} />
      </div>

      {/* Neck */}
      <div className="h-[3px] w-[6px]" style={{ backgroundColor: "#7a5a10" }} />

      {/* Torso (coat) — shoulders are integrated, no separate bar */}
      <div className="relative">
        <div className="relative h-[14px] w-[22px] rounded-t-[3px]" style={{ backgroundColor: "#1a1a2e" }}>
          {/* Lapels */}
          <div className="absolute left-[2px] top-0 h-[9px] w-[4px]" style={{ backgroundColor: "#252540" }} />
          <div className="absolute right-[2px] top-0 h-[9px] w-[4px]" style={{ backgroundColor: "#252540" }} />
          {/* Shirt V */}
          <div className="absolute left-1/2 top-0 h-[7px] w-[5px] -translate-x-1/2" style={{ backgroundColor: "#ddd", clipPath: "polygon(50% 0, 100% 0, 70% 100%, 30% 100%, 0 0)" }} />
          {/* Tie */}
          <div className="absolute left-1/2 top-[6px] h-[5px] w-[2px] -translate-x-1/2" style={{ backgroundColor: "#065f46" }} />
        </div>
        {/* Coat bottom */}
        <div className="mx-auto h-[10px] w-[22px]" style={{ backgroundColor: "#1a1a2e" }}>
          <div className="mx-auto h-full w-[1px]" style={{ backgroundColor: "#111" }} />
        </div>

        {/* Arms attached to torso sides */}
        <div className="absolute -left-[4px] top-[1px] h-[16px] w-[4px] rounded-l-[2px]" style={{ backgroundColor: "#1a1a2e" }}>
          <div className="absolute -bottom-[1px] left-0 h-[4px] w-[4px] rounded-[1px]" style={{ backgroundColor: "#7a5a10" }}>
            <div className="absolute -bottom-[4px] -left-[1px] h-[5px] w-[7px] rounded-full" style={{ backgroundColor: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.8)" }} />
          </div>
        </div>
        <div className="absolute -right-[4px] top-[1px] h-[16px] w-[4px] rounded-r-[2px]" style={{ backgroundColor: "#1a1a2e" }}>
          <div className="absolute -bottom-[1px] right-0 h-[4px] w-[4px] rounded-[1px]" style={{ backgroundColor: "#7a5a10" }}>
            <div className="absolute -bottom-[4px] -right-[1px] h-[5px] w-[7px] rounded-full" style={{ backgroundColor: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.8)" }} />
          </div>
        </div>
      </div>

      {/* Legs */}
      <div className="flex gap-[2px]">
        <div className="h-[10px] w-[7px] rounded-b-[1px]" style={{ backgroundColor: "#15152a" }} />
        <div className="h-[10px] w-[7px] rounded-b-[1px]" style={{ backgroundColor: "#15152a" }} />
      </div>

      {/* Shoes */}
      <div className="flex gap-[3px]">
        <div className="h-[3px] w-[8px] rounded-b-[2px]" style={{ backgroundColor: "#0a0a0a" }} />
        <div className="h-[3px] w-[8px] rounded-b-[2px]" style={{ backgroundColor: "#0a0a0a" }} />
      </div>
    </div>
  );
}

// ─── Main entry screen ──────────────────────────────────────────────

type Props = {
  useCaseName: string;
  onChoose: (mode: ViewMode) => void;
};

export function MatrixEntry({ useCaseName, onChoose }: Props) {
  const { t } = useI18n();
  const [hoveredPill, setHoveredPill] = useState<"blue" | "red" | null>(null);
  const [chosen, setChosen] = useState<ViewMode | null>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [morpheusVisible, setMorpheusVisible] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 600);
    const t2 = setTimeout(() => setMorpheusVisible(true), 1200);
    const t3 = setTimeout(() => setPillsVisible(true), 1800);
    const t4 = setTimeout(() => setLinkVisible(true), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 300);
    return () => clearInterval(timer);
  }, []);

  const handleChoose = useCallback(
    (mode: ViewMode) => {
      setChosen(mode);
      setTimeout(() => onChoose(mode), 1200);
    },
    [onChoose]
  );

  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black transition-opacity duration-1000",
        chosen && "opacity-0"
      )}
    >
      <MatrixRain />

      {/* Back to Use Cases */}
      <Link
        href="/use-cases"
        className={cn(
          "absolute left-4 top-4 z-20 flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition-all hover:text-emerald-400",
          titleVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("matrix.backToUseCases")}
      </Link>

      {/* Vignette overlay — edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />

      {/* Center darkening — radial gradient behind content area */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-6">
        {/* Title — pushed up with negative margin */}
        <div
          className={cn(
            "-mt-8 text-center transition-all duration-1000",
            titleVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          )}
        >
          <p className="mb-3 font-mono text-sm tracking-[0.3em] text-emerald-400/80">
            {t("matrix.building")} {useCaseName.toUpperCase()}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("matrix.howDeep")}
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {t("matrix.toGo")}
            </span>
          </h1>
        </div>

        {/* Pixel Morpheus — explicit height container to prevent overflow */}
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-700",
            morpheusVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ height: 170, width: 110 }}
        >
          <div className="scale-[1.6] sm:scale-[2.2]" style={{ imageRendering: "pixelated" } as React.CSSProperties}>
            <PixelMorpheus tick={tick} />
          </div>
        </div>

        {/* Subtitle — below Morpheus */}
        <div
          className={cn(
            "text-center transition-all duration-1000",
            titleVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="mx-auto max-w-md font-mono text-sm text-zinc-500">
            {t("matrix.choosePath")}
          </p>
        </div>

        {/* Pills */}
        <div
          className={cn(
            "flex flex-col items-center gap-6 transition-all duration-1000 sm:flex-row sm:gap-16 md:gap-24",
            pillsVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          )}
        >
          <Pill
            color="blue"
            label={t("matrix.seeTheMagic")}
            sublabel={t("matrix.businessOutcomes")}
            tooltip={t("matrix.magicTooltip")}
            hovered={hoveredPill === "blue"}
            onHover={(h) => setHoveredPill(h ? "blue" : null)}
            onClick={() => handleChoose("magic")}
          />

          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-zinc-600">{t("matrix.or")}</span>
          </div>

          <Pill
            color="red"
            label={t("matrix.seeHowBuilt")}
            sublabel={t("matrix.technicalDetails")}
            tooltip={t("matrix.techTooltip")}
            hovered={hoveredPill === "red"}
            onHover={(h) => setHoveredPill(h ? "red" : null)}
            onClick={() => handleChoose("tech")}
          />
        </div>

        {/* "See Both" link */}
        <div
          className={cn(
            "transition-all duration-700",
            linkVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <button
            onClick={() => handleChoose("split")}
            className="group flex items-center gap-2 font-mono text-sm text-zinc-500 transition-colors hover:text-emerald-400"
          >
            <span className="inline-block h-px w-8 bg-zinc-700 transition-all group-hover:w-12 group-hover:bg-emerald-500" />
            {t("matrix.seeBothPaths")}
            <span className="inline-block h-px w-8 bg-zinc-700 transition-all group-hover:w-12 group-hover:bg-emerald-500" />
          </button>
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-6 font-mono text-[10px] tracking-widest text-zinc-700">
        {t("matrix.poweredBy")}
      </div>
    </div>
  );
}
