import { Router } from "express";
import {
  bookAppointment,
  editPatientAppointmentDetails,
  getAllAppointment,
  getAllPatientAppointment,
  updateAppointment,
} from "../controllers/appointment.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { UserRole } from "@dentora/database";

const router: Router = Router();

router.post("/", bookAppointment);

// FOR DOCTOR
router.get("/", authMiddleware, requireRole(UserRole.DOCTOR), getAllAppointment);
router.patch("/", authMiddleware, requireRole(UserRole.DOCTOR), updateAppointment);

// FOR PATIENT
router.get("/patient", authMiddleware, requireRole(UserRole.PATIENT), getAllPatientAppointment);
router.post("/patient", authMiddleware, requireRole(UserRole.PATIENT), editPatientAppointmentDetails);

export default router;
