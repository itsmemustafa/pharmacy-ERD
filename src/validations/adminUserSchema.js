import { z } from "zod";
import { ROLES } from "../constants/roles.js";

const baseAdminUserUpdate = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().toLowerCase().optional(),
  role: z.enum([ROLES.ADMIN, ROLES.PHARMACIST, ROLES.CASHIER]).optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = baseAdminUserUpdate.refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" },
);

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  role: z.enum([ROLES.ADMIN, ROLES.PHARMACIST, ROLES.CASHIER]).optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(50).optional(),
  isActive: z.coerce.boolean().optional(),
});

