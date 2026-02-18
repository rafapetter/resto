import Stripe from "stripe";
import { env } from "@/lib/env";

function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });
}

export async function createOrGetCustomer(
  tenantId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  const stripe = getStripe();
  if (existingCustomerId) return existingCustomerId;
  const customer = await stripe.customers.create({
    email,
    metadata: { tenantId },
  });
  return customer.id;
}

export async function createCheckoutSession(opts: {
  tenantId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    customer: opts.stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: opts.stripePriceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: { tenantId: opts.tenantId },
    subscription_data: {
      metadata: { tenantId: opts.tenantId },
    },
  });
  if (!session.url) throw new Error("Stripe session URL missing");
  return session.url;
}

export async function createPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
}

export function constructWebhookEvent(
  payload: string,
  sig: string
): Stripe.Event {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET);
}

export { getStripe };
