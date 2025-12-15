import { Router } from "express";
import appointmentRoutes from "./routes/appointment.routes";
import slotesRoutes from "./routes/slotes.routes";
import profileRoutes from "./routes/profile.routes";
import authMiddleware from "./middlewares/auth.middleware";

const router: Router = Router();

router.use("/slotes", slotesRoutes);
router.use("/appointment", appointmentRoutes);
router.use("/profile", authMiddleware, profileRoutes);

export default router;
