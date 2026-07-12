import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const bookingSelect = {
  id: true,
  assetId: true,
  bookedById: true,
  startTime: true,
  endTime: true,
  purpose: true,
  status: true,
  cancellationReason: true,
  createdAt: true,
  asset: {
    select: {
      id: true,
      assetTag: true,
      name: true,
      status: true,
      condition: true,
    },
  },
  bookedBy: {
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
    },
  },
};

export async function listBookings(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const orderBy = buildOrderBy(query, "startTime", ["startTime", "endTime", "createdAt"]);
  const assetId = typeof query.assetId === "string" ? query.assetId.trim() : "";
  const bookedById = typeof query.bookedById === "string" ? query.bookedById.trim() : "";
  const status = typeof query.status === "string" ? query.status.trim() : "";

  const where = {
    ...(assetId ? { assetId } : {}),
    ...(bookedById ? { bookedById } : {}),
    ...(status ? { status } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.resourceBooking.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: bookingSelect,
    }),
    prisma.resourceBooking.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function createBooking(data, bookedById) {
  const { assetId, startTime, endTime, purpose } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    select: { id: true, isBookable: true, status: true },
  });

  if (!asset) {
    throw new AppError("Asset not found", 404);
  }

  if (!asset.isBookable) {
    throw new AppError("This asset is not marked as bookable", 400);
  }

  const forbiddenStatuses = ["LOST", "RETIRED", "DISPOSED", "UNDER_MAINTENANCE"];
  if (forbiddenStatuses.includes(asset.status)) {
    throw new AppError(`Asset cannot be booked. (Current status: ${asset.status})`, 400);
  }

  // Overlap Concurrency Check
  // A booking overlaps if: startTime < other.endTime AND endTime > other.startTime
  // only check UPCOMING and ONGOING bookings
  const overlappingBooking = await prisma.resourceBooking.findFirst({
    where: {
      assetId,
      status: { in: ["UPCOMING", "ONGOING"] },
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  if (overlappingBooking) {
    throw new AppError("The asset is already booked during the requested time slot", 409);
  }

  const booking = await prisma.resourceBooking.create({
    data: {
      assetId,
      bookedById,
      startTime,
      endTime,
      purpose,
      status: "UPCOMING",
    },
    select: bookingSelect,
  });

  return booking;
}

export async function cancelBooking(bookingId, userId, userRole, data) {
  const { cancellationReason } = data;

  const booking = await prisma.resourceBooking.findUnique({
    where: { id: bookingId },
    select: { id: true, bookedById: true, status: true },
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (["CANCELLED", "COMPLETED"].includes(booking.status)) {
    throw new AppError(`Cannot cancel a booking that is already ${booking.status.toLowerCase()}`, 400);
  }

  // Authorization Check: Creator OR Admin/Asset Manager
  const isCreator = booking.bookedById === userId;
  const isPrivileged = ["ADMIN", "ASSET_MANAGER"].includes(userRole);

  if (!isCreator && !isPrivileged) {
    throw new AppError("You do not have permission to cancel this booking", 403);
  }

  const updatedBooking = await prisma.resourceBooking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
      cancellationReason,
    },
    select: bookingSelect,
  });

  return updatedBooking;
}
