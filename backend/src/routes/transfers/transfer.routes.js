import { Router } from "express";
import { authenticate, requireRoles } from "../../middleware/auth.js";
import { WRITE_ROLES } from "../../constants/roles.js";
import { handleAction, index, store } from "../../controllers/transfers/transfer.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", index);
router.post("/", store);
router.post("/:id/action", requireRoles(...WRITE_ROLES), handleAction);

export default router;
