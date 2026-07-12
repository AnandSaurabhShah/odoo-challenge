import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { ADMIN_ONLY, WRITE_ROLES } from "../../constants/roles.js";
import { destroy, index, show, store, update } from "../../controllers/users/user.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", requireRoles(...WRITE_ROLES), index);
router.get("/:id", requireRoles(...WRITE_ROLES), show);
router.post("/", requireRoles(...ADMIN_ONLY), store);
router.patch("/:id", requireRoles(...ADMIN_ONLY), update);
router.delete("/:id", requireRoles(...ADMIN_ONLY), destroy);

export default router;
