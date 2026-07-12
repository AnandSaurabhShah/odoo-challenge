import prisma from "../../config/prisma.js";
import { comparePassword } from "../../lib/password.js";
import { generateToken } from "../../lib/jwt.js";

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
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}