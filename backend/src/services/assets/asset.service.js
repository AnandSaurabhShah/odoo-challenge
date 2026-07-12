import prismaPkg from "@prisma/client";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const { Prisma } = prismaPkg;

const assetSelect = {
    id: true,
    assetTag: true,
    name: true,
    description: true,
    serialNumber: true,
    qrCode: true,
    categoryId: true,
    ownerDepartmentId: true,
    locationCode: true,
    status: true,
    condition: true,
    acquisitionDate: true,
    warrantyExpiry: true,
    acquisitionCost: true,
    vendor: true,
    imageUrl: true,
    documentUrl: true,
    isBookable: true,
    createdAt: true,
    updatedAt: true,
    category: {
        select: {
            id: true,
            name: true,
            code: true,
            isBookable: true,
        },
    },
    ownerDepartment: {
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
        },
    },
};

function normalizeAsset(asset) {
    if (!asset) {
        return asset;
    }

    return {
        ...asset,
        acquisitionCost: asset.acquisitionCost?.toString?.() ?? asset.acquisitionCost ?? null,
    };
}

export async function listAssets(query = {}) {
    const { page, limit, skip } = buildPagination(query);
    const orderBy = buildOrderBy(query, "createdAt", ["createdAt", "updatedAt", "name", "assetTag", "status", "condition", "locationCode"]);
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const status = typeof query.status === "string" ? query.status.trim() : "";
    const condition = typeof query.condition === "string" ? query.condition.trim() : "";
    const categoryId = typeof query.categoryId === "string" ? query.categoryId.trim() : "";
    const ownerDepartmentId = typeof query.ownerDepartmentId === "string" ? query.ownerDepartmentId.trim() : "";
    const isBookable = query.isBookable;

    const where = {
        ...(search
            ? {
                OR: [
                    { assetTag: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                    { serialNumber: { contains: search, mode: "insensitive" } },
                    { locationCode: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(status ? { status } : {}),
        ...(condition ? { condition } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(ownerDepartmentId ? { ownerDepartmentId } : {}),
        ...(isBookable === "true" || isBookable === true
            ? { isBookable: true }
            : isBookable === "false" || isBookable === false
                ? { isBookable: false }
                : {}),
    };

    const [items, total] = await Promise.all([
        prisma.asset.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: assetSelect,
        }),
        prisma.asset.count({ where }),
    ]);

    return {
        items: items.map(normalizeAsset),
        meta: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        },
    };
}

export async function getAssetById(id) {
    const asset = await prisma.asset.findUnique({
        where: { id },
        select: assetSelect,
    });

    if (!asset) {
        throw new AppError("Asset not found", 404);
    }

    return normalizeAsset(asset);
}

export async function createAsset(data) {
    const [category, department] = await Promise.all([
        prisma.assetCategory.findUnique({
            where: { id: data.categoryId },
            select: { id: true },
        }),
        prisma.department.findUnique({
            where: { id: data.ownerDepartmentId },
            select: { id: true },
        }),
    ]);

    if (!category) {
        throw new AppError("Asset category not found", 404);
    }

    if (!department) {
        throw new AppError("Owner department not found", 404);
    }

    const asset = await prisma.asset.create({
        data: {
            ...data,
            description: data.description || null,
            serialNumber: data.serialNumber || null,
            qrCode: data.qrCode || null,
            vendor: data.vendor || null,
            imageUrl: data.imageUrl || null,
            documentUrl: data.documentUrl || null,
            acquisitionCost: data.acquisitionCost === undefined || data.acquisitionCost === null
                ? null
                : new Prisma.Decimal(data.acquisitionCost),
            acquisitionDate: data.acquisitionDate || null,
            warrantyExpiry: data.warrantyExpiry || null,
            status: data.status || undefined,
            condition: data.condition || undefined,
            isBookable: data.isBookable ?? undefined,
        },
        select: assetSelect,
    });

    return normalizeAsset(asset);
}

export async function updateAsset(id, data) {
    await getAssetById(id);

    if (data.categoryId) {
        const category = await prisma.assetCategory.findUnique({
            where: { id: data.categoryId },
            select: { id: true },
        });

        if (!category) {
            throw new AppError("Asset category not found", 404);
        }
    }

    if (data.ownerDepartmentId) {
        const department = await prisma.department.findUnique({
            where: { id: data.ownerDepartmentId },
            select: { id: true },
        });

        if (!department) {
            throw new AppError("Owner department not found", 404);
        }
    }

    const asset = await prisma.asset.update({
        where: { id },
        data: {
            ...data,
            description: data.description !== undefined ? data.description || null : undefined,
            serialNumber: data.serialNumber !== undefined ? data.serialNumber || null : undefined,
            qrCode: data.qrCode !== undefined ? data.qrCode || null : undefined,
            vendor: data.vendor !== undefined ? data.vendor || null : undefined,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl || null : undefined,
            documentUrl: data.documentUrl !== undefined ? data.documentUrl || null : undefined,
            acquisitionCost:
                data.acquisitionCost === undefined
                    ? undefined
                    : data.acquisitionCost === null
                        ? null
                        : new Prisma.Decimal(data.acquisitionCost),
            acquisitionDate: data.acquisitionDate === undefined ? undefined : data.acquisitionDate || null,
            warrantyExpiry: data.warrantyExpiry === undefined ? undefined : data.warrantyExpiry || null,
            status: data.status || undefined,
            condition: data.condition || undefined,
            isBookable: data.isBookable ?? undefined,
        },
        select: assetSelect,
    });

    return normalizeAsset(asset);
}

export async function deleteAsset(id) {
    await getAssetById(id);

    await prisma.asset.delete({ where: { id } });

    return { id };
}
