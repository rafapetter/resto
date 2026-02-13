import { NextRequest, NextResponse } from "next/server";
import { refreshExpiringTokens } from "@/lib/integrations/token-refresh";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await refreshExpiringTokens();
  return NextResponse.json(result);
}
