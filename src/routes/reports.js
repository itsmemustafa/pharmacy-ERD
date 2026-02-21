import { Router } from "express";
import lowQuantity from "../controllers/dailyreport/lowStock.js";
import expired from "../controllers/dailyreport/expired.js";
import nearExpiry from "../controllers/dailyreport/nearExpiry.js";

const router = Router();

router.get("/low_quantity", lowQuantity);
router.get("/expired", expired);
router.get("/nearExpiry",nearExpiry)
export default router;
