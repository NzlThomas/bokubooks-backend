import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";
import bookController from "../controllers/bookController.js";
import verifyToken from "../middlewares/authMiddleware.js";

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);

router.post("/wishlist", verifyToken, bookController.postWishlist);

export default router;
