import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const maintenanceSelect = {
  id: true,
  assetId: true,
  reportedById: true,
  approvedById: true,
  assignedToId: true,
  title: true,
  description: true,
  priority: true,
  status: true,
  beforePhotoUrl: true,
  afterPhotoUrl: true,
  resolutionNotes: true,
  reportedAt: true,
  completedAt: true,
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
  reportedBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  assignedTo: {
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

export async function listMaintenanceRequests(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const orderBy = buildOrderBy(query, "reportedAt", ["reportedAt", "createdAt", "priority"]);
  const assetId = typeof query.assetId === "string" ? query.assetId.trim() : "";
  const reportedById = typeof query.reportedById === "string" ? query.reportedById.trim() : "";
  const assignedToId = typeof query.assignedToId === "string" ? query.assignedToId.trim() : "";
  const status = typeof query.status === "string" ? query.status.trim() : "";
  const priority = typeof query.priority === "string" ? query.priority.trim() : "";
  const search = typeof query.search === "string" ? query.search.trim() : "";

  const where = {
    ...(assetId ? { assetId } : {}),
    ...(reportedById ? { reportedById } : {}),
    ...(assignedToId ? { assignedToId } : {}),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { asset: { name: { contains: search, mode: "insensitive" } } },
            { asset: { assetTag: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.maintenanceRequest.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: maintenanceSelect,
    }),
    prisma.maintenanceRequest.count({ where }),
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

export async function createMaintenanceRequest(data, reportedById) {
  const { assetId, title, description, priority, beforePhotoUrl } = data;

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    select: { id: true, status: true },
  });

  if (!asset) {
    throw new AppError("Asset not found", 404);
  }

  const forbiddenStatuses = ["LOST", "RETIRED", "DISPOSED"];
  if (forbiddenStatuses.includes(asset.status)) {
    throw new AppError(`Cannot raise maintenance for an asset that is ${asset.status.toLowerCase()}`, 400);
  }

  const request = await prisma.maintenanceRequest.create({
    data: {
      assetId,
      reportedById,
      title,
      description,
      priority,
      status: "PENDING",
      beforePhotoUrl: beforePhotoUrl || null,
    },
    select: maintenanceSelect,
  });

  return request;
}

export async function assignTechnician(requestId, approverId, data) {
  const { assignedToId } = data;

  const [request, technician] = await Promise.all([
    prisma.maintenanceRequest.findUnique({
      where: { id: requestId },
      select: { id: true, assetId: true, status: true },
    }),
    prisma.user.findUnique({
      where: { id: assignedToId },
      select: { id: true, status: true },
    }),
  ]);

  if (!request) {
    throw new AppError("Maintenance request not found", 404);
  }

  if (["RESOLVED", "REJECTED"].includes(request.status)) {
    throw new AppError(`Cannot assign technician to a ${request.status.toLowerCase()} request`, 400);
  }

  if (!technician) {
    throw new AppError("Technician user not found", 404);
  }

  if (technician.status !== "ACTIVE") {
    throw new AppError("Cannot assign an inactive technician", 400);
  }

  // Update request to ASSIGNED and asset status to UNDER_MAINTENANCE in a transaction
  const [updatedRequest] = await prisma.$transaction([
    prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        status: "ASSIGNED",
        approvedById: approverId,
        assignedToId,
      },
      select: maintenanceSelect,
    }),
    prisma.asset.update({
      where: { id: request.assetId },
      data: { status: "UNDER_MAINTENANCE" },
    }),
  ]);

  return updatedRequest;
}

export async function resolveMaintenanceRequest(requestId, resolverId, resolverRole, data) {
  const { resolutionNotes, afterPhotoUrl } = data;

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    select: { id: true, assetId: true, status: true, assignedToId: true },
  });

  if (!request) {
    throw new AppError("Maintenance request not found", 404);
  }

  if (["RESOLVED", "REJECTED"].includes(request.status)) {
    throw new AppError(`Request has already been ${request.status.toLowerCase()}`, 400);
  }

  // Authorization: Only the assigned technician OR an admin/manager can resolve
  const isAssigned = request.assignedToId === resolverId;
  const isPrivileged = ["ADMIN", "ASSET_MANAGER"].includes(resolverRole);

  if (!isAssigned && !isPrivileged) {
    throw new AppError("You do not have permission to resolve this request", 403);
  }

  // Resolve request and reset asset status to AVAILABLE
  const [updatedRequest] = await prisma.$transaction([
    prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        status: "RESOLVED",
        resolutionNotes,
        afterPhotoUrl: afterPhotoUrl || null,
        completedAt: new Date(),
      },
      select: maintenanceSelect,
    }),
    prisma.asset.update({
      where: { id: request.assetId },
      data: {
        status: "AVAILABLE",
        condition: "GOOD", // Set condition to GOOD after repair
      },
    }),
  ]);

  return updatedRequest;
}
