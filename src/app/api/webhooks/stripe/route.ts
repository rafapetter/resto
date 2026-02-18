import { NextResponse } from "next/server";
import { constructWebhookEvent, getStripe } from "@/lib/billing/stripe";
import { db } from "@/server/db";
import { subscriptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// Stripe requires the raw body for signature verification — disable body parsing
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const tenantId = session.metadata?.tenantId;

      if (tenantId && session.subscription) {
        // Retrieve the subscription to determine the plan from the price ID
        const stripe = getStripe();
        const stripeSub = await stripe.subscriptions.retrieve(
          String(session.subscription)
        );
        const item = stripeSub.items.data[0];
        const priceId = item?.price.id;
        const plan =
          priceId === env.STRIPE_SCALE_PRICE_ID ? "scale" : "pro";
        const periodEnd = item?.current_period_end;

        await db
          .update(subscriptions)
          .set({
            stripeSubscriptionId: String(session.subscription),
            plan,
            status: "active",
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.tenantId, tenantId));
      }
    }

    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object;
      const tenantId = sub.metadata?.tenantId;
      const item = sub.items.data[0];
      const priceId = item?.price.id;
      const plan = priceId === env.STRIPE_SCALE_PRICE_ID ? "scale" : "pro";
      const periodEnd = item?.current_period_end;

      if (tenantId) {
        await db
          .update(subscriptions)
          .set({
            plan,
            status: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.tenantId, tenantId));
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const tenantId = sub.metadata?.tenantId;

      if (tenantId) {
        await db
          .update(subscriptions)
          .set({
            plan: "free",
            status: "canceled",
            stripeSubscriptionId: null,
            cancelAtPeriodEnd: false,
            currentPeriodEnd: null,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.tenantId, tenantId));
      }
    }
  } catch (err) {
    console.error("[Stripe webhook] Error processing event:", err);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
