import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  password: z.string().min(8),
  // departmentId is optional at signup — backend will pick first available if omitted
  departmentId: z.string().uuid().optional().nullable(),
});