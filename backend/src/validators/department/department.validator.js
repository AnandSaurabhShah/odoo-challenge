import { z } from "zod";

const optionalText = z.string().trim().min(1).max(500).optional().or(z.literal(""));

export const departmentIdSchema = z.object({
  id: z.string().uuid(),
});

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(32).transform((value) => value.toUpperCase()),
  description: optionalText,
  parentDepartmentId: z.string().uuid().optional().nullable(),
  headId: z.string().uuid().optional().nullable(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();
