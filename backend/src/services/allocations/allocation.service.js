import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const allocationSelect = {
  id: true,
  assetId: true,
  userId: true,
  allocatedById: true,
  allocatedAt: true,
  expectedReturnDate: true,
  returnedAt: true,
  returnCondition: true,
  returnRemarks: true,
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
  user: {
    select: {
      id: true,
      employeeId: true,
      fullName: true,
      email: true,
      role: true,
    },
  },
  allocatedBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
};

export async function listAllocations(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const orderBy = buildOrderBy(query, "createdAt", ["createdAt", "allocatedAt", "expectedReturnDate", "returnedAt"]);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const userId = typeof query.userId === "string" ? query.userId.trim() : "";
  const assetId = typeof query.assetId === "string" ? query.assetId.trim() : "";
  const isReturned = query.returned; // 'true' or 'false'

  const where = {
    ...(userId ? { userId } : {}),
    ...(assetId ? { assetId } : {}),
    ...(isReturned === "true"
      ? { NOT: { returnedAt: null } }
      : isReturned === "false"
      ? { returnedAt: null }
      : {}),
    ...(search
      ? {
          OR: [
            { user: { fullName: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { employeeId: { contains: search, mode: "insensitive" } } },
            { asset: { name: { contains: search, mode: "insensitive" } } },
            { asset: { assetTag: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.assetAllocation.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: allocationSelect,
    }),
    prisma.assetAllocation.count({ where }),
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

export async function allocateAsset(data, allocatedById) {
  const { assetId, userId, expectedReturnDate } = data;

  const [asset, user] = await Promise.all([
    prisma.asset.findUnique({
      where: { id: assetId },
      select: { id: true, status: true, isBookable: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    }),
  ]);

  if (!asset) {
    throw new AppError("Asset not found", 404);
  }

  if (asset.isBookable) {
    throw new AppError("Bookable assets cannot be allocated directly. Please use the Resource Booking module.", 400);
  }

  if (asset.status !== "AVAILABLE") {
    throw new AppError(`Asset is not available for allocation (Current status: ${asset.status})`, 400);
  }

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Assets cannot be allocated to an inactive user", 400);
  }

  // Create allocation and update asset status in a transaction
  const [allocation] = await prisma.$transaction([
    prisma.assetAllocation.create({
      data: {
        assetId,
        userId,
        allocatedById,
        expectedReturnDate,
      },
      select: allocationSelect,
    }),
    prisma.asset.update({
      where: { id: assetId },
      data: { status: "ALLOCATED" },
    }),
  ]);

  return allocation;
}

export async function returnAsset(assetId, data) {
  const { returnCondition, returnRemarks } = data;

  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: {
      assetId,
      returnedAt: null,
    },
    select: { id: true },
  });

  if (!activeAllocation) {
    throw new AppError("No active allocation found for this asset", 404);
  }

  // If asset is damaged or poor, route it to maintenance status
  const nextAssetStatus = ["DAMAGED", "POOR"].includes(returnCondition) 
    ? "UNDER_MAINTENANCE" 
    : "AVAILABLE";

  const [updatedAllocation] = await prisma.$transaction([
    prisma.assetAllocation.update({
      where: { id: activeAllocation.id },
      data: {
        returnedAt: new Date(),
        returnCondition,
        returnRemarks: returnRemarks || null,
      },
      select: allocationSelect,
    }),
    prisma.asset.update({
      where: { id: assetId },
      data: {
        status: nextAssetStatus,
        condition: returnCondition,
      },
    }),
  ]);

  return updatedAllocation;
}
