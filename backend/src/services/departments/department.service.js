import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";

const departmentSelect = {
    id: true,
    name: true,
    code: true,
    description: true,
    status: true,
    parentDepartmentId: true,
    headId: true,
    createdAt: true,
    updatedAt: true,
    parentDepartment: {
        select: {
            id: true,
            name: true,
            code: true,
        },
    },
    head: {
        select: {
            id: true,
            employeeId: true,
            fullName: true,
            email: true,
            role: true,
            status: true,
            departmentId: true,
        },
    },
    _count: {
        select: {
            users: true,
            ownedAssets: true,
            childDepartments: true,
        },
    },
};

function normalizeDepartment(department) {
    if (!department) {
        return department;
    }

    return {
        ...department,
        userCount: department._count?.users ?? 0,
        assetCount: department._count?.ownedAssets ?? 0,
        childDepartmentCount: department._count?.childDepartments ?? 0,
    };
}

export async function listDepartments(query = {}) {
    const { page, limit, skip } = buildPagination(query);
    const orderBy = buildOrderBy(query, "createdAt", ["createdAt", "updatedAt", "name", "code", "status"]);
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const status = typeof query.status === "string" ? query.status.trim() : "";

    const where = {
        ...(search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { code: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(status ? { status } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.department.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: departmentSelect,
        }),
        prisma.department.count({ where }),
    ]);

    return {
        items: items.map(normalizeDepartment),
        meta: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        },
    };
}

export async function getDepartmentById(id) {
    const department = await prisma.department.findUnique({
        where: { id },
        select: departmentSelect,
    });

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    return normalizeDepartment(department);
}

export async function createDepartment(data) {
    if (data.parentDepartmentId) {
        const parentDepartment = await prisma.department.findUnique({
            where: { id: data.parentDepartmentId },
            select: { id: true },
        });

        if (!parentDepartment) {
            throw new AppError("Parent department not found", 404);
        }
    }

    if (data.headId) {
        const head = await prisma.user.findUnique({
            where: { id: data.headId },
            select: { id: true },
        });

        if (!head) {
            throw new AppError("Head user not found", 404);
        }
    }

    const department = await prisma.department.create({
        data: {
            ...data,
            status: data.status || undefined,
        },
        select: departmentSelect,
    });

    return normalizeDepartment(department);
}

export async function updateDepartment(id, data) {
    await getDepartmentById(id);

    if (data.parentDepartmentId) {
        const parentDepartment = await prisma.department.findUnique({
            where: { id: data.parentDepartmentId },
            select: { id: true },
        });

        if (!parentDepartment) {
            throw new AppError("Parent department not found", 404);
        }
    }

    if (data.headId) {
        const head = await prisma.user.findUnique({
            where: { id: data.headId },
            select: { id: true },
        });

        if (!head) {
            throw new AppError("Head user not found", 404);
        }
    }

    const department = await prisma.department.update({
        where: { id },
        data,
        select: departmentSelect,
    });

    return normalizeDepartment(department);
}

export async function deleteDepartment(id) {
    const department = await prisma.department.findUnique({
        where: { id },
        select: {
            id: true,
            _count: {
                select: {
                    users: true,
                    ownedAssets: true,
                    childDepartments: true,
                },
            },
        },
    });

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    if (department._count.users > 0 || department._count.ownedAssets > 0 || department._count.childDepartments > 0) {
        throw new AppError("Department cannot be deleted while it has related users, assets, or child departments", 400);
    }

    await prisma.department.delete({ where: { id } });

    return { id };
}
