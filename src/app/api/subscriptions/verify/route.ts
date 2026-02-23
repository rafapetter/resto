import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { tenants } from "@/server/db/schema/tenants";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const apiSecret = process.env.COURSES_API_SECRET;

  if (!apiSecret || req.headers.get("authorization") !== `Bearer ${apiSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const userId: string | undefined = body?.userId;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const tenant = await db
    .select({ id: tenants.id })
    .from(tenants)
    .where(eq(tenants.clerkUserId, userId))
    .limit(1);

  return NextResponse.json({ active: tenant.length > 0 });
}
