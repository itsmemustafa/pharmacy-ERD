import { Router } from "express";
import addMedicine from "../controllers/Medicine/addMedicine.js";
import deleteMedicine from "../controllers/Medicine/deleteMedicine.js";
import getMedicine from "../controllers/Medicine/getMedicine.js";
import updateMedicine from "../controllers/Medicine/updateMedicine.js";
import getAllMedicines from "../controllers/Medicine/getAllMedicines.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import {
  CAN_VIEW_MEDICINES,
  CAN_MANAGE_MEDICINES,
} from "../constants/roles.js";

const router = Router();
// List: any authenticated user
router.get("/", authenticate, authorizeRoles(...CAN_VIEW_MEDICINES), getAllMedicines);
// Get one: any authenticated user
router.get("/:id", authenticate, authorizeRoles(...CAN_VIEW_MEDICINES), getMedicine);
// Create/update/delete: admin, pharmacist only
router.post("/", authenticate, authorizeRoles(...CAN_MANAGE_MEDICINES), addMedicine);
router.delete("/:id", authenticate, authorizeRoles(...CAN_MANAGE_MEDICINES), deleteMedicine);
router.patch("/:id", authenticate, authorizeRoles(...CAN_MANAGE_MEDICINES), updateMedicine);

export default router;