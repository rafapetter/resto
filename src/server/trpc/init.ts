import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { tenants } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export type Context = {
  db: typeof db;
  userId: string | null;
  tenantId: string | null;
};

export async function createContext(): Promise<Context> {
  const { userId } = await auth();

  let tenantId: string | null = null;
  if (userId) {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.clerkUserId, userId),
    });
    tenantId = tenant?.id ?? null;
  }

  return { db, userId, tenantId };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const createRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const tenantProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.tenantId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Tenant not found. Complete onboarding first.",
      });
    }
    return next({ ctx: { ...ctx, tenantId: ctx.tenantId } });
  }
);
