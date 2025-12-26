import { Router } from "express";
import {
  editProfileDetails,
  getProfileDetails,
} from "@/controllers/profile.controller";

const router: Router = Router();

// TODO: add roles restrictions
router.get("/", getProfileDetails);
router.post("/", editProfileDetails);

export default router;
