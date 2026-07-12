import prismaPkg from "@prisma/client";
import { ZodError } from "zod";

const { Prisma } = prismaPkg;

export function errorHandler(error, req, res, next) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.flatten(),
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "A record with the same unique field already exists",
            });
        }

        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Record not found",
            });
        }
    }

    const statusCode = error.statusCode || error.status || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
}

