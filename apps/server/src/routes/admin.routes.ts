import { Router } from "express";
import authMiddleware from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";
import { getControlCenterDetails } from "@/controllers/admin.controller";

const router: Router = Router();

// FOR ADMINS
router.get("/control-center", authMiddleware, requireRole(UserRole.ADMIN), getControlCenterDetails);

export default router;
