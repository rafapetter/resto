import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const ALLOWED_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
] as const;
type Voice = (typeof ALLOWED_VOICES)[number];

export async function POST(req: Request) {
  const body = (await req.json()) as { text?: string };
  const text = body.text?.trim();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const voiceEnv = env.OPENAI_TTS_VOICE;
  const voice: Voice =
    voiceEnv && (ALLOWED_VOICES as readonly string[]).includes(voiceEnv)
      ? (voiceEnv as Voice)
      : "nova";

  const mp3 = await openai.audio.speech.create({
    model: "tts-1", // fastest + cheapest ($0.015/1K chars)
    voice,
    input: text.slice(0, 4000), // OpenAI TTS limit
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(buffer.length),
      "Cache-Control": "no-store",
    },
  });
}
