import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);

export default router;
