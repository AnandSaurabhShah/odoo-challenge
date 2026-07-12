import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import assetRoutes from "./assets/asset.routes.js";
import departmentRoutes from "./departments/department.routes.js";
import userRoutes from "./users/user.routes.js";
import allocationRoutes from "./allocations/allocation.routes.js";
import bookingRoutes from "./bookings/booking.routes.js";
import maintenanceRoutes from "./maintenance/maintenance.routes.js";
import transferRoutes from "./transfers/transfer.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/users", userRoutes);
router.use("/assets", assetRoutes);
router.use("/allocations", allocationRoutes);
router.use("/bookings", bookingRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/transfers", transferRoutes);


export default router;
