import prisma from "../../config/prisma.js";
import AppError from "../../utils/appError.js";
import { buildOrderBy, buildPagination } from "../../utils/query.js";
import { hashPassword } from "../../lib/password.js";

const userSelect = {
    id: true,
    employeeId: true,
    fullName: true,
    email: true,
    password: true,
    phone: true,
    designation: true,
    role: true,
    status: true,
    departmentId: true,
    createdAt: true,
    updatedAt: true,
    department: {
        select: {
            id: true,
            name: true,
            code: true,
            status: true,
        },
    },
};

function normalizeUser(user) {
    if (!user) {
        return user;
    }

    const { password, ...safeUser } = user;

    return safeUser;
}

export async function listUsers(query = {}) {
    const { page, limit, skip } = buildPagination(query);
    const orderBy = buildOrderBy(query, "createdAt", ["createdAt", "updatedAt", "fullName", "employeeId", "email", "role", "status"]);
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const role = typeof query.role === "string" ? query.role.trim() : "";
    const status = typeof query.status === "string" ? query.status.trim() : "";
    const departmentId = typeof query.departmentId === "string" ? query.departmentId.trim() : "";

    const where = {
        ...(search
            ? {
                OR: [
                    { fullName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { employeeId: { contains: search, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(role ? { role } : {}),
        ...(status ? { status } : {}),
        ...(departmentId ? { departmentId } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: userSelect,
        }),
        prisma.user.count({ where }),
    ]);

    return {
        items: items.map(normalizeUser),
        meta: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
        },
    };
}

export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: userSelect,
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return normalizeUser(user);
}

export async function createUser(data) {
    const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
        select: { id: true },
    });

    if (!department) {
        throw new AppError("Department not found", 404);
    }

    const user = await prisma.user.create({
        data: {
            ...data,
            password: await hashPassword(data.password),
            phone: data.phone || null,
            designation: data.designation || null,
            status: data.status || undefined,
        },
        select: userSelect,
    });

    return normalizeUser(user);
}

export async function updateUser(id, data) {
    await getUserById(id);

    if (data.departmentId) {
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId },
            select: { id: true },
        });

        if (!department) {
            throw new AppError("Department not found", 404);
        }
    }

    const updateData = { ...data };

    if (typeof data.password === "string") {
        updateData.password = await hashPassword(data.password);
    }

    if (data.phone !== undefined) {
        updateData.phone = data.phone || null;
    }

    if (data.designation !== undefined) {
        updateData.designation = data.designation || null;
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: userSelect,
    });

    return normalizeUser(user);
}

export async function deleteUser(id) {
    await getUserById(id);

    await prisma.user.delete({ where: { id } });

    return { id };
}
