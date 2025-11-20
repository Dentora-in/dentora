import { Router } from "express";
import { bookAppointment, getAllSlotes } from "../controllers/appointment.controller";

const router: Router = Router();

// for slots
router.get("/slotes", getAllSlotes);

// for appointments
router.post("/", bookAppointment);

export default router;
