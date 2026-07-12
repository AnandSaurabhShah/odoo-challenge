import { z } from "zod";

const optionalText = z.string().trim().min(1).max(500).optional().or(z.literal(""));

export const maintenanceIdSchema = z.object({
  id: z.string().uuid(),
});

export const createMaintenanceSchema = z.object({
  assetId: z.string().uuid(),
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(2).max(1000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  beforePhotoUrl: optionalText,
});

export const assignTechnicianSchema = z.object({
  assignedToId: z.string().uuid(),
});

export const resolveMaintenanceSchema = z.object({
  resolutionNotes: z.string().trim().min(2).max(1000),
  afterPhotoUrl: optionalText,
});
