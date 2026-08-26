import { Router } from "express";
import * as userController from "./user.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, userController.handleMe);
userRoute.patch("/me", authMiddleware, userController.handleUpdateUser);
userRoute.delete("/me", authMiddleware, userController.handleDeleteUser);

userRoute.get(
  "/me/addresses",
  authMiddleware,
  userController.handleGetAddresses,
);
userRoute.post(
  "/me/addresses",
  authMiddleware,
  userController.handleCreateAddress,
);
userRoute.patch(
  "/me/addresses/:addressId",
  authMiddleware,
  userController.handleUpdateAddress,
);
userRoute.delete(
  "/me/addresses/:addressId",
  authMiddleware,
  userController.handleDeleteAddress,
);
export default userRoute;
