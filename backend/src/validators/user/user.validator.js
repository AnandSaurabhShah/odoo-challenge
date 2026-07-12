import { z } from "zod";
import { ROLE_VALUES } from "../../constants/roles.js";

const optionalText = z.string().trim().min(1).max(255).optional().or(z.literal(""));

export const userIdSchema = z.object({
  id: z.string().uuid(),
});

export const createUserSchema = z.object({
  employeeId: z.string().trim().min(2).max(50),
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email(),
  password: z.string().min(8),
  phone: optionalText,
  designation: optionalText,
  role: z.enum(ROLE_VALUES),
  departmentId: z.string().uuid(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateUserSchema = z.object({
  employeeId: z.string().trim().min(2).max(50).optional(),
  fullName: z.string().trim().min(2).max(150).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(8).optional(),
  phone: optionalText,
  designation: optionalText,
  role: z.enum(ROLE_VALUES).optional(),
  departmentId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
