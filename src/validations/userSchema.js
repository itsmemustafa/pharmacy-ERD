import { z } from "zod";

// reusable fields to avoid repetition dry :)
const emailField = z.string().email().toLowerCase();
const passwordField = z.string().min(8).max(50);

export const registerSchema = z.object({
  name: z.string().min(3).max(50),
  email: emailField,
  password: passwordField,
  role: z.enum(["admin", "pharmacist", "cashier"]),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string(),
});
export const logoutSchema = z.object({
  token: z.string().min(10).max(100),
});
export const verifyEmailSchema = z.object({
  token: z.string().min(10).max(100),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
