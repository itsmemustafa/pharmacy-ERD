import { z } from "zod";

const baseSupplier = z.object({
  name: z.string().min(3).max(100),
  phone: z.string().min(5).max(30),
  email: z.string().email(),
  address: z.string().min(3).max(200),
});

export const createSupplierSchema = baseSupplier;

// All fields optional, but at least one must be provided
export const updateSupplierSchema = baseSupplier.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

