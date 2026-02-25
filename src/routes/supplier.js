import { Router } from "express";
import getAllSuppliers from "../controllers/suppliers/getAllSuppliers.js";
import deleteSupplier from "../controllers/suppliers/deleteSupplier.js";
import updateSupplier from "../controllers/suppliers/updateSupplier.js";
import AddSupplier from "../controllers/suppliers/addSupplier.js";
import getSupplier from "../controllers/suppliers/findSupplier.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_MANAGE_SUPPLIERS } from "../constants/roles.js";
import validate from "../middlewares/validate.js";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "../validations/supplierSchema.js";

const router = Router();
router.get(
  "/",
  authenticate,
  authorizeRoles(...CAN_MANAGE_SUPPLIERS),
  getAllSuppliers
);
router.post(
  "/",
  authenticate,
  authorizeRoles(...CAN_MANAGE_SUPPLIERS),
  validate(createSupplierSchema),
  AddSupplier
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_SUPPLIERS),
  getSupplier
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_SUPPLIERS),
  deleteSupplier
);
router.patch(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_SUPPLIERS),
  validate(updateSupplierSchema),
  updateSupplier
);

export default router;
