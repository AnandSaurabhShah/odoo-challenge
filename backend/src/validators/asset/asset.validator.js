import { z } from "zod";

const optionalText = z.string().trim().min(1).max(255).optional().or(z.literal(""));

export const assetIdSchema = z.object({
  id: z.string().uuid(),
});

export const createAssetSchema = z.object({
  assetTag: z.string().trim().min(2).max(100),
  name: z.string().trim().min(2).max(150),
  description: optionalText,
  serialNumber: optionalText,
  qrCode: optionalText,
  categoryId: z.string().uuid(),
  ownerDepartmentId: z.string().uuid(),
  locationCode: z.string().trim().min(1).max(100),
  status: z.enum(["AVAILABLE", "ALLOCATED", "RESERVED", "UNDER_MAINTENANCE", "LOST", "RETIRED", "DISPOSED"]).optional(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"]).optional(),
  acquisitionDate: z.coerce.date().optional().nullable(),
  warrantyExpiry: z.coerce.date().optional().nullable(),
  acquisitionCost: z.coerce.number().nonnegative().optional().nullable(),
  vendor: optionalText,
  imageUrl: optionalText,
  documentUrl: optionalText,
  isBookable: z.boolean().optional(),
});

export const updateAssetSchema = z.object({
  assetTag: z.string().trim().min(2).max(100).optional(),
  name: z.string().trim().min(2).max(150).optional(),
  description: optionalText,
  serialNumber: optionalText,
  qrCode: optionalText,
  categoryId: z.string().uuid().optional(),
  ownerDepartmentId: z.string().uuid().optional(),
  locationCode: z.string().trim().min(1).max(100).optional(),
  status: z.enum(["AVAILABLE", "ALLOCATED", "RESERVED", "UNDER_MAINTENANCE", "LOST", "RETIRED", "DISPOSED"]).optional(),
  condition: z.enum(["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"]).optional(),
  acquisitionDate: z.coerce.date().optional().nullable(),
  warrantyExpiry: z.coerce.date().optional().nullable(),
  acquisitionCost: z.coerce.number().nonnegative().optional().nullable(),
  vendor: optionalText,
  imageUrl: optionalText,
  documentUrl: optionalText,
  isBookable: z.boolean().optional(),
});
