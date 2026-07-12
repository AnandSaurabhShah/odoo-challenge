import { loginSchema, registerSchema } from "../../validators/auth/auth.validator.js";
import { loginUser } from "../../services/auth/auth.service.js";
import { createUser } from "../../services/users/user.service.js";
import prisma from "../../config/prisma.js";

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const { token, user } = await loginUser(
      data.email,
      data.password,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);

    // If no departmentId provided, fall back to the first department in the DB
    let departmentId = data.departmentId;
    if (!departmentId) {
      const firstDept = await prisma.department.findFirst({
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (!firstDept) {
        return res.status(400).json({
          success: false,
          message: "No departments exist yet. Please contact an administrator.",
        });
      }
      departmentId = firstDept.id;
    }

    // Auto-generate an employeeId based on timestamp
    const employeeId = "EMP-" + Date.now().toString().slice(-6);

    const user = await createUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: "EMPLOYEE",
      departmentId,
      employeeId,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  const { password, ...user } = req.user;

  res.json({
    success: true,
    user,
  });
}

export async function logout(req, res) {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
}