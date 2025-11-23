import { Router } from "express";
import appointmentRoutes from "./routes/appointment.routes";
import slotesRoutes from "./routes/slotes.routes";

const router: Router = Router();

router.use("/slotes", slotesRoutes);
router.use("/appointment", appointmentRoutes);

export default router;
