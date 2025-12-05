import { Router } from "express";
import { bookAppointment, getAllAppointment } from "../controllers/appointment.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/", bookAppointment);
router.get("/", authMiddleware, getAllAppointment);

export default router;
