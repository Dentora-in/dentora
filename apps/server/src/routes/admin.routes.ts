import { Router } from "express";
import authMiddleware from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";
import { editControlCenterDetails, getControlCenterDetails } from "@/controllers/admin.controller";

const router: Router = Router();

// FOR ADMINS
router.get("/control-center", authMiddleware, requireRole(UserRole.ADMIN), getControlCenterDetails);
router.patch("/control-center", authMiddleware, requireRole(UserRole.ADMIN), editControlCenterDetails);

export default router;
