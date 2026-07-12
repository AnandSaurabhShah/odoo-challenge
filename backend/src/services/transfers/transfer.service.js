import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const transferSelect = {
  id: true,
  assetId: true,
  fromUserId: true,
  toUserId: true,
  requestedById: true,
  approvedById: true,
  reason: true,
  status: true,
  requestDate: true,
  decisionDate: true,
  remarks: true,
  createdAt: true,
  asset: {
    select: {
      id: true,
      assetTag: true,
      name: true,
      status: true,
    },
  },
  fromUser: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  toUser: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  requestedBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  approvedBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
};

export async function listTransferRequests(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const orderBy = buildOrderBy(query, "requestDate", ["requestDate", "createdAt"]);
  const assetId = typeof query.assetId === "string" ? query.assetId.trim() : "";
  const fromUserId = typeof query.fromUserId === "string" ? query.fromUserId.trim() : "";
  const toUserId = typeof query.toUserId === "string" ? query.toUserId.trim() : "";
  const status = typeof query.status === "string" ? query.status.trim() : "";
  const search = typeof query.search === "string" ? query.search.trim() : "";

  const where = {
    ...(assetId ? { assetId } : {}),
    ...(fromUserId ? { fromUserId } : {}),
    ...(toUserId ? { toUserId } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { reason: { contains: search, mode: "insensitive" } },
            { remarks: { contains: search, mode: "insensitive" } },
            { asset: { name: { contains: search, mode: "insensitive" } } },
            { asset: { assetTag: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.transferRequest.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: transferSelect,
    }),
    prisma.transferRequest.count({ where }),
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

export async function createTransferRequest(data, requestedById) {
  const { assetId, toUserId, reason } = data;

  const [asset, toUser] = await Promise.all([
    prisma.asset.findUnique({
      where: { id: assetId },
      select: { id: true, status: true },
    }),
    prisma.user.findUnique({
      where: { id: toUserId },
      select: { id: true, status: true },
    }),
  ]);

  if (!asset) {
    throw new AppError("Asset not found", 404);
  }

  if (asset.status !== "ALLOCATED") {
    throw new AppError("Only currently allocated assets can be transferred", 400);
  }

  if (!toUser) {
    throw new AppError("Target user not found", 404);
  }

  if (toUser.status !== "ACTIVE") {
    throw new AppError("Cannot transfer an asset to an inactive user", 400);
  }

  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: {
      assetId,
      returnedAt: null,
    },
    select: { userId: true },
  });

  if (!activeAllocation) {
    throw new AppError("No active allocation found for this asset despite it being marked as allocated", 400);
  }

  if (activeAllocation.userId === toUserId) {
    throw new AppError("The asset is already allocated to the target user", 400);
  }

  const transfer = await prisma.transferRequest.create({
    data: {
      assetId,
      fromUserId: activeAllocation.userId,
      toUserId,
      requestedById,
      reason,
      status: "PENDING",
    },
    select: transferSelect,
  });

  return transfer;
}

export async function handleTransferAction(requestId, deciderId, data) {
  const { action, remarks } = data;

  const request = await prisma.transferRequest.findUnique({
    where: { id: requestId },
    select: { id: true, assetId: true, fromUserId: true, toUserId: true, status: true },
  });

  if (!request) {
    throw new AppError("Transfer request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError(`Cannot execute action on a transfer request that is already ${request.status.toLowerCase()}`, 400);
  }

  if (action === "REJECT") {
    const updatedRequest = await prisma.transferRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        remarks: remarks || null,
        approvedById: deciderId,
        decisionDate: new Date(),
      },
      select: transferSelect,
    });
    return updatedRequest;
  }

  // Action is APPROVE
  // Get destination user to find their department
  const toUser = await prisma.user.findUnique({
    where: { id: request.toUserId },
    select: { departmentId: true },
  });

  if (!toUser) {
    throw new AppError("Target user for transfer not found", 404);
  }

  const activeAllocation = await prisma.assetAllocation.findFirst({
    where: {
      assetId: request.assetId,
      returnedAt: null,
    },
    select: { id: true },
  });

  // Run transaction:
  // 1. Close current allocation
  // 2. Open new allocation for target user
  // 3. Update asset's ownerDepartmentId to target user's department
  // 4. Update transfer request status to APPROVED
  const [_, _2, _3, updatedRequest] = await prisma.$transaction([
    ...(activeAllocation
      ? [
          prisma.assetAllocation.update({
            where: { id: activeAllocation.id },
            data: {
              returnedAt: new Date(),
              returnCondition: "GOOD",
              returnRemarks: `Transferred to user ${request.toUserId}`,
            },
          }),
        ]
      : []),
    prisma.assetAllocation.create({
      data: {
        assetId: request.assetId,
        userId: request.toUserId,
        allocatedById: deciderId,
        allocatedAt: new Date(),
      },
    }),
    prisma.asset.update({
      where: { id: request.assetId },
      data: {
        ownerDepartmentId: toUser.departmentId,
      },
    }),
    prisma.transferRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        remarks: remarks || null,
        approvedById: deciderId,
        decisionDate: new Date(),
      },
      select: transferSelect,
    }),
  ]);

  return updatedRequest;
}
