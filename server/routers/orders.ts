import { router, protectedProcedure } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";

export const ordersRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const orders = await db.getUserOrders(ctx.user.id);
      return orders.slice(0, limit);
    }),
});
