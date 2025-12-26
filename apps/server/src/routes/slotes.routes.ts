import { Router } from "express";
import {
  addDoctorAvailability,
  deleteDoctorAvailability,
  deleteDoctorSlot,
  getAllSlotes,
  mySpacePageData,
} from "../controllers/slotes.controller";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";
import authMiddleware from "@/middlewares/auth.middleware";

const router: Router = Router();

router.get("/", getAllSlotes);

// my space page route
router.get(
  "/doctor/my-space",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  mySpacePageData,
);

// Weekly Availability
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

// Slot Creation
// router.post(
//   "/slot-generate",
//   authMiddleware,
//   requireRole(UserRole.DOCTOR),
//   slotCreation,
// );

router.delete(
  "/slot-delete/:slotId",
  authMiddleware,
  requireRole(UserRole.DOCTOR),
  deleteDoctorSlot,
);

export default router;
