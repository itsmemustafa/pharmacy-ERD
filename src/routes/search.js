import { Router } from "express";
import searchMedicine from "../controllers/search/search.js";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import { CAN_SEARCH_MEDICINES } from "../constants/roles.js";
import { validateQuery } from "../middlewares/validate.js";
import { searchQuerySchema } from "../validations/searchSchema.js";

const router = Router();
router.get(
  "/",
  authenticate,
  authorizeRoles(...CAN_SEARCH_MEDICINES),
  validateQuery(searchQuerySchema),
  searchMedicine,
);

export default router;
