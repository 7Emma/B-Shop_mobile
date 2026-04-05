import { z } from "zod";
import { router, publicProcedure } from "../_core/trpc";
import * as db from "../db";

export const productsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
          category: z.string().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const category = input?.category;

      if (category) {
        return db.getProductsByCategory(category, limit, offset);
      }

      return db.getProducts(limit, offset);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const product = await db.getProductById(input.id);
      if (!product) return null;
      return product;
    }),
});
