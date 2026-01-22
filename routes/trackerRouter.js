import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";
import bookController from "../controllers/bookController.js";
import verifyToken from "../middlewares/authMiddleware.js";

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);
router.post("/logout", userController.postLogout);
router.get("/profile", verifyToken, userController.getProfile);

router.put("/username", verifyToken, userController.putUsername);
router.put("/password", verifyToken, userController.putPassword);

router.get("/wishlist", verifyToken, bookController.getWishlist);
router.post("/wishlist", verifyToken, bookController.postWishlist);
router.delete("/wishlist", verifyToken, bookController.deleteWishlist);

router.get("/collection", verifyToken, bookController.getCollection);
router.post("/collection", verifyToken, bookController.postCollection);
router.delete("/collection", verifyToken, bookController.deleteCollection);
router.put("/collection", verifyToken, bookController.putCollection);

export default router;
