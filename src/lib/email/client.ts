import { Resend } from "resend";
import { env } from "@/lib/env";
import type React from "react";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
  if (!_resend) _resend = new Resend(env.RESEND_API_KEY);
  return _resend;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  react: React.ReactElement;
}): Promise<void> {
  if (!env.RESEND_API_KEY) return; // silently no-op if not configured
  const from = env.EMAIL_FROM ?? "ATR Resto <noreply@atr.resto>";
  const { error } = await getResend().emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    react: opts.react,
  });
  if (error) {
    console.error("[email] Failed to send:", error);
  }
}
