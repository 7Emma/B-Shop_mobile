import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const cartRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getCartItems(ctx.user.id);
  }),

  add: protectedProcedure
    .input(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.addToCart({
        userId: ctx.user.id,
        productId: input.productId,
        quantity: input.quantity,
      });
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().min(0).max(99),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.quantity === 0) {
        await db.removeFromCart(input.id);
        return true;
      }
      await db.updateCartItem(input.id, input.quantity);
      return true;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await db.removeFromCart(input.id);
      return true;
    }),

  clear: protectedProcedure.mutation(async ({ ctx }) => {
    await db.clearCart(ctx.user.id);
    return true;
  }),
});
