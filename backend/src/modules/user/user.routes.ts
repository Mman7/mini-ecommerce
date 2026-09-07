import { Router } from "express";
import * as userController from "./user.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import {
  validateAddressId,
  validateCreateAddress,
  validateUpdateAddress,
  validateUserUpdate,
} from "./user.validator.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, userController.handleMe);
userRoute.patch(
  "/me",
  authMiddleware,
  validateUserUpdate,
  userController.handleUpdateUser,
);
userRoute.delete("/me", authMiddleware, userController.handleDeleteUser);

userRoute.get(
  "/me/addresses",
  authMiddleware,
  userController.handleGetAddresses,
);
userRoute.post(
  "/me/addresses",
  authMiddleware,
  validateCreateAddress,
  userController.handleCreateAddress,
);
userRoute.patch(
  "/me/addresses/:addressId",
  authMiddleware,
  validateAddressId,
  validateUpdateAddress,
  userController.handleUpdateAddress,
);
userRoute.delete(
  "/me/addresses/:addressId",
  authMiddleware,
  validateAddressId,
  userController.handleDeleteAddress,
);
export default userRoute;
