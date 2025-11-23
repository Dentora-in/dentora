import { Router } from "express";
import { bookAppointment } from "../controllers/appointment.controller";

const router: Router = Router();

router.post("/", bookAppointment);

export default router;
