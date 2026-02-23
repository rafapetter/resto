import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const isPublicRoute = createRouteMatcher([
  "/",
  "/demo(.*)",
  "/use-cases",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/oauth(.*)",
]);

const isRateLimitedRoute = createRouteMatcher([
  "/api/copilotkit(.*)",
  "/api/trpc(.*)",
  "/api/voice(.*)",
]);

const clerk = clerkMiddleware(async (auth, request) => {
  // Rate limit API routes before processing
  if (isRateLimitedRoute(request)) {
    const session = await auth();
    const userId =
      session.userId ??
      request.headers.get("x-forwarded-for") ??
      "anonymous";
    const isCopilotKit = request.nextUrl.pathname.startsWith("/api/copilotkit");

    const { success, remaining } = rateLimit({
      key: `${userId}:${isCopilotKit ? "copilotkit" : "trpc"}`,
      limit: isCopilotKit ? 30 : 120, // per minute
      windowMs: 60_000,
    });

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: { "Retry-After": "60" },
        }
      );
    }

    // Attach remaining count as response header for client visibility
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// Next.js 16 requires named "proxy" export instead of "middleware"
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
