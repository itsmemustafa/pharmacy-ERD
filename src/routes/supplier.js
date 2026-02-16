import { Router } from "express";
import getAllSuppliers from "../controllers/suppliers/getAllSuppliers.js";
import deleteSupplier from "../controllers/suppliers/deleteSupplier.js";
import updateSupplier from "../controllers/suppliers/updateSupplier.js";
import AddSupplier from "../controllers/suppliers/addSupplier.js";
import getSupplier from "../controllers/suppliers/findSupplier.js";
const router = Router();

router.get("/", getAllSuppliers);
router.post("/", AddSupplier);
router.get("/:id", getSupplier);
router.delete("/:id", deleteSupplier);
router.patch("/:id", updateSupplier);

export default router;
