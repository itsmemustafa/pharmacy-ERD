import { z } from "zod";

const purchaseItemSchema = z.object({
  medicine_id: z.coerce.number().int().positive(),
  batch_number: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  unit_price: z.coerce.number().positive(),
  expiry_Date: z.string().min(4), 
});

export const createPurchaseSchema = z.object({
  supplier_id: z.coerce.number().int().positive(),
  items: z.array(purchaseItemSchema).min(1),
});

