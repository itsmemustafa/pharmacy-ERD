import { z } from "zod";

const saleItemSchema = z.object({
  medicine_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  unit_price: z.coerce.number().positive(),
});

export const createSaleSchema = z.object({
  payment_method: z
    .enum(["cash", "credit_card", "debit_card", "insurance"])
    .optional()
    .default("cash"),
  items: z.array(saleItemSchema).min(1),
});

