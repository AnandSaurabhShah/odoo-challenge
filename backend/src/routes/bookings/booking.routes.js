import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { cancel, index, store } from "../../controllers/bookings/booking.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", index);
router.post("/", store);
router.post("/:id/cancel", cancel);

export default router;
