import { Router } from "express";
import {
  addDoctorAvailability,
  deleteDoctorAvailability,
  getAllSlotes,
} from "../controllers/slotes.controller";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";
import authMiddleware from "@/middlewares/auth.middleware";

const router: Router = Router();

router.get("/", getAllSlotes);
router.post(
  "/weekly",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  addDoctorAvailability,
);
router.delete(
  "/weekly/:availabilityId",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  deleteDoctorAvailability,
);

export default router;
