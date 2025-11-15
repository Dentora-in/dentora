import { Router } from "express";
import { getAllAppointments } from "../controllers/appointment.controller";

const router: Router = Router();

router.get("/", getAllAppointments);

export default router;
