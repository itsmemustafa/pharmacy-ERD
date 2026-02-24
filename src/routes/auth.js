import login from "../controllers/auth/login.js";
import logout from "../controllers/auth/logout.js";
import signUp from "../controllers/auth/signUp.js";
import { Router } from "express";
import verifyEmail from "../controllers/auth/verifyEmail.js";
import forgotPassword from "../controllers/auth/forgotPassword.js";
import resetPassword from "../controllers/auth/resetPassword .js";
const router = Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
