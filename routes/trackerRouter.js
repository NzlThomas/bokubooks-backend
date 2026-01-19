import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";
import bookController from "../controllers/bookController.js";
import verifyToken from "../middlewares/authMiddleware.js";

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);

router.get("/wishlist", verifyToken, bookController.getWishlist);
router.post("/wishlist", verifyToken, bookController.postWishlist);
router.delete("/wishlist", verifyToken, bookController.deleteWishlist);

router.post("/collection", verifyToken, bookController.postCollection);

export default router;
