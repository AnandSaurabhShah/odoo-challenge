import { z } from "zod";

const optionalText = z.string().trim().min(1).max(500).optional().or(z.literal(""));

export const transferIdSchema = z.object({
  id: z.string().uuid(),
});

export const createTransferSchema = z.object({
  assetId: z.string().uuid(),
  toUserId: z.string().uuid(),
  reason: z.string().trim().min(2).max(500),
});

export const handleTransferActionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  remarks: optionalText,
});
