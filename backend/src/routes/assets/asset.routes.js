import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { ADMIN_ONLY, WRITE_ROLES } from "../../constants/roles.js";
import { destroy, index, show, store, update } from "../../controllers/assets/asset.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", index);
router.get("/:id", show);
router.post("/", requireRoles(...WRITE_ROLES), store);
router.patch("/:id", requireRoles(...WRITE_ROLES), update);
router.delete("/:id", requireRoles(...ADMIN_ONLY), destroy);

export default router;
