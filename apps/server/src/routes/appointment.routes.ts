import { Router } from "express";
import { getAllAppointments, getAllSlotes } from "../controllers/appointment.controller";

const router: Router = Router();

// for appointments
router.get("/", getAllAppointments);

// for slots
router.get("/slotes", getAllSlotes);

export default router;
