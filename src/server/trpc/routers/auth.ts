import { createRouter, protectedProcedure } from "../init";
import { getCurrentUser } from "@/server/auth";

export const authRouter = createRouter({
  getSession: protectedProcedure.query(async () => {
    const user = await getCurrentUser();
    return user;
  }),
});
