import { Router } from "express";
import {
  bookAppointment,
  getAllAppointment,
  updateAppointment,
} from "../controllers/appointment.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";

const router: Router = Router();

router.post("/", bookAppointment);
router.get(
  "/",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  getAllAppointment,
);
router.patch(
  "/",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  updateAppointment,
);

export default router;
