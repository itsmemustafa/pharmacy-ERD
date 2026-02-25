import { z } from "zod";

const baseMedicine = z.object({
  name: z.string().min(3).max(100),
  generic_name: z.string().min(3).max(100),
  price_sell: z.coerce.number().positive(),
  min_quantity: z.coerce.number().int().nonnegative(),
  requires_prescription: z.boolean().optional(),
});

export const createMedicineSchema = baseMedicine;

export const updateMedicineSchema = baseMedicine
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

