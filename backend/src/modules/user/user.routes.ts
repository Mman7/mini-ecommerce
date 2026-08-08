import { Router } from "express";
import * as userController from "./user.controller.ts";
import { authMiddleware, isAdmin } from "../../middleware/authMiddleware.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, userController.handleMe);
userRoute.patch("/me", authMiddleware, userController.handleUpdateUser);
userRoute.delete("/me", authMiddleware, userController.handleDeleteUser);
userRoute.get("/", authMiddleware, isAdmin, userController.getAllUsers);
userRoute.patch(
  "/:id/activate",
  authMiddleware,
  isAdmin,
  userController.activeUserController,
);
userRoute.patch(
  "/:id/deactivate",
  authMiddleware,
  isAdmin,
  userController.inactiveUserController,
);
// route to controller

export default userRoute;
