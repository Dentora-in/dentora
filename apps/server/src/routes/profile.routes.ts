import { Router } from "express";
import {
  editProfileDetails,
  getProfileDetails,
} from "@/controllers/profile.controller";

const router: Router = Router();

router.get("/", getProfileDetails);
router.post("/", editProfileDetails);

export default router;
