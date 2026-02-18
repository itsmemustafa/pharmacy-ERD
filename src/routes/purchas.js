import { Router } from "express";
import createPurchase from "../controllers/purcheses/create_purchas.js";

const router=Router();

router.post('/',createPurchase);

export default router;