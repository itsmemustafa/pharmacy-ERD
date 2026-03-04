import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import authorizeRoles from "../middlewares/autherization.js";
import validate, { validateQuery } from "../middlewares/validate.js";
import { CAN_MANAGE_USERS } from "../constants/roles.js";
import {
  updateUserSchema,
  listUsersQuerySchema,
} from "../validations/adminUserSchema.js";
import getAllUsers from "../controllers/users/getAllUsers.js";
import getUserById from "../controllers/users/getUserById.js";
import updateUser from "../controllers/users/updateUser.js";
import deactivateUser from "../controllers/users/deactivateUser.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles(...CAN_MANAGE_USERS),
  validateQuery(listUsersQuerySchema),
  getAllUsers,
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_USERS),
  getUserById,
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_USERS),
  validate(updateUserSchema),
  updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(...CAN_MANAGE_USERS),
  deactivateUser,
);

export default router;

