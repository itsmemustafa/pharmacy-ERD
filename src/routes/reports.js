import { Router } from "express";
import lowQuantity from "../controllers/dailyreport/lowQuantity.js";

const router = Router();

router.get("/low_quantity", lowQuantity);

export default router;
