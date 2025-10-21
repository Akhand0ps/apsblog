import { Router } from "express";
import {login, me } from "../controllers/user.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", authenticateAdmin, me);

export default router;
