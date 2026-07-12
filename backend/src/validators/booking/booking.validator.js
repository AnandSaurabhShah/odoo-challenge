import { z } from "zod";

export const bookingIdSchema = z.object({
  id: z.string().uuid(),
});

export const createBookingSchema = z.object({
  assetId: z.string().uuid(),
  startTime: z.coerce.date().refine((val) => val > new Date(), {
    message: "Start time must be in the future",
  }),
  endTime: z.coerce.date(),
  purpose: z.string().trim().min(2).max(500),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const cancelBookingSchema = z.object({
  cancellationReason: z.string().trim().min(2).max(500),
});
