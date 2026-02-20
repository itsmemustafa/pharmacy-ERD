import { Router } from "express";
import sale from "../controllers/sale/sale.js";

const router = Router();

router.post("/", sale);
export default router;
