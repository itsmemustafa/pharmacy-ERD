import { Router } from "express";
import addMedicine from "../controllers/Medicine/addMedicine.js";
import deleteMedicine from "../controllers/Medicine/deleteMedicine.js";
import getMedicine from "../controllers/Medicine/getMedicine.js";
import updateMedicine from "../controllers/Medicine/updateMedicine.js";
import getAllMedicines from "../controllers/Medicine/getAllMedicines.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import validate from "../middlewares/validate.js";
import { createMedicineSchema } from "../validations/medicineSchema.js";
import { updateMedicineSchema } from "../validations/medicineSchema.js";

import {
  CAN_VIEW_MEDICINES,
  CAN_MANAGE_MEDICINES,
} from "../constants/roles.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles(...CAN_VIEW_MEDICINES),
  getAllMedicines,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_VIEW_MEDICINES),
  getMedicine,
);

router.post(
  "/",
  authenticate,
  authorizeRoles(...CAN_MANAGE_MEDICINES),
  validate(createMedicineSchema),
  addMedicine,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_MEDICINES),
  deleteMedicine,
);
router.patch(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_MEDICINES),
  validate(updateMedicineSchema),
  updateMedicine,
);

export default router;
