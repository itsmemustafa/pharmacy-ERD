import login from "../controllers/auth/login.js";
import logout from "../controllers/auth/logout.js";
import signUp from "../controllers/auth/signUp.js";
import { Router } from "express";
import verifyEmail from "../controllers/auth/verifyEmail.js";
import forgotPassword from "../controllers/auth/forgotPassword.js";
import resetPassword from "../controllers/auth/resetPassword.js";
import validate from "../middlewares/validate.js";
import {
  loginRateLimiter,
  passwordResetRateLimiter,
} from "../middlewares/rateLimit.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  logoutSchema,
  verifyEmailSchema,
} from "../validations/userSchema.js";
const router = Router();

router.post("/sign-up", validate(registerSchema), signUp);
router.post("/login", loginRateLimiter, validate(loginSchema), login);
router.post("/logout", validate(logoutSchema), logout);
router.get("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post(
  "/forgot-password",
  passwordResetRateLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password",
  passwordResetRateLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);
export default router;
