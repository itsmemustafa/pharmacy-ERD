import { Router } from "express";
import getAllSuppliers from "../controllers/suppliers/getAllSuppliers.js";
import deleteSupplier from "../controllers/suppliers/deleteSupplier.js";
import updateSupplier from "../controllers/suppliers/updateSupplier.js";
import AddSupplier from "../controllers/suppliers/addSupplier.js";
import getSupplier from "../controllers/suppliers/findSupplier.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_MANAGE_SUPPLIERS } from "../constants/roles.js";

const router = Router();
router.get("/", authenticate, authorizeRoles(...CAN_MANAGE_SUPPLIERS), getAllSuppliers);
router.post("/", authenticate, authorizeRoles(...CAN_MANAGE_SUPPLIERS), AddSupplier);
router.get("/:id", authenticate, authorizeRoles(...CAN_MANAGE_SUPPLIERS), getSupplier);
router.delete("/:id", authenticate, authorizeRoles(...CAN_MANAGE_SUPPLIERS), deleteSupplier);
router.patch("/:id", authenticate, authorizeRoles(...CAN_MANAGE_SUPPLIERS), updateSupplier);

export default router;
