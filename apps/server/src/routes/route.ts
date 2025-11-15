import { Router } from "express";
import appointmentRoutes from "./appointment.routes";

const router: Router = Router();

router.use("/appointment", appointmentRoutes);

export default router;
