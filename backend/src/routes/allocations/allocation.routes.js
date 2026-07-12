import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { ROLES, WRITE_ROLES } from "../../constants/roles.js";
import { handleReturn, index, store } from "../../controllers/allocations/allocation.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRoles(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), index);
router.post("/", requireRoles(...WRITE_ROLES), store);
router.post("/:id/return", requireRoles(...WRITE_ROLES), handleReturn);

export default router;
