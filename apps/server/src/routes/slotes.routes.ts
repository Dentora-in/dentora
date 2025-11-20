import { Router } from "express";
import { getAllSlotes } from "../controllers/slotes.controller";

const router: Router = Router();

router.get("/", getAllSlotes);

export default router;
