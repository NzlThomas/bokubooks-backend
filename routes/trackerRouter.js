import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";

router.get("/api", userController.getHome);

export default router;
