import { z } from "zod";

const optionalText = z.string().trim().min(1).max(500).optional().or(z.literal(""));

export const allocationIdSchema = z.object({
  id: z.string().uuid(),
});

export const allocateAssetSchema = z.object({
  assetId: z.string().uuid(),
  userId: z.string().uuid(),
  expectedReturnDate: z.coerce.date().optional().nullable(),
});

export const returnAssetSchema = z.object({
  returnCondition: z.enum(["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"]),
  returnRemarks: optionalText,
});
