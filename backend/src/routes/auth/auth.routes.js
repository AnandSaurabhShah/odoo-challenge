import { Router } from "express";
import {
  login,
  register,
  logout,
  me,
} from "../../controllers/auth/auth.controller.js";

import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register); // public — no auth required

router.get("/me", authenticate, me);

router.post("/logout", authenticate, logout);

export default router;