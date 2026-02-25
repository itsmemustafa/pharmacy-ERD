import { Router } from "express";
import sale from "../controllers/sale/sale.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_CREATE_SALE } from "../constants/roles.js";
import validate from "../middlewares/validate.js";
import { createSaleSchema } from "../validations/saleSchema.js";
const router = Router();
router.post(
  "/",
  authenticate,
  authorizeRoles(...CAN_CREATE_SALE),
  validate(createSaleSchema),
  sale,
);

export default router;
