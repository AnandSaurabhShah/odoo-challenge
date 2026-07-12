import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import assetRoutes from "./assets/asset.routes.js";
import departmentRoutes from "./departments/department.routes.js";
import userRoutes from "./users/user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/users", userRoutes);
router.use("/assets", assetRoutes);

export default router;
