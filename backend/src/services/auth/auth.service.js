import prisma from "../../config/prisma.js";
import { comparePassword } from "../../lib/password.js";
import { generateToken } from "../../lib/jwt.js";
import AppError from "../../utils/appError.js";

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      department: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user);

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}