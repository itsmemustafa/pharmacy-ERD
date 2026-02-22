import { Router } from "express";
import createPurchase from "../controllers/purcheses/create_purchas.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_CREATE_PURCHASE } from "../constants/roles.js";

const router = Router();
router.post("/", authenticate, authorizeRoles(...CAN_CREATE_PURCHASE), createPurchase);

export default router;