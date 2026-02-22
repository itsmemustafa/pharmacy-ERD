import { Router } from "express";
import lowQuantity from "../controllers/dailyreport/lowStock.js";
import expired from "../controllers/dailyreport/expired.js";
import nearExpiry from "../controllers/dailyreport/nearExpiry.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_VIEW_REPORTS } from "../constants/roles.js";

const router = Router();
router.get("/low_quantity", authenticate, authorizeRoles(...CAN_VIEW_REPORTS), lowQuantity);
router.get("/expired", authenticate, authorizeRoles(...CAN_VIEW_REPORTS), expired);
router.get("/nearExpiry", authenticate, authorizeRoles(...CAN_VIEW_REPORTS), nearExpiry);

export default router;
