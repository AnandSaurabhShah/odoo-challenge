import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { WRITE_ROLES } from "../../constants/roles.js";
import { assign, index, resolve, store } from "../../controllers/maintenance/maintenance.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", index);
router.post("/", store);
router.patch("/:id/assign", requireRoles(...WRITE_ROLES), assign);
router.patch("/:id/resolve", resolve);

export default router;
