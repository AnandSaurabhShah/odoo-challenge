import { loginSchema } from "../../validators/auth/auth.validator.js";
import { loginUser } from "../../services/auth/auth.service.js";

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