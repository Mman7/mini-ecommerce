import { Router } from "express";
import * as userController from "./user.controller.ts";
import { authMiddleware, isAdmin } from "../../middleware/authMiddleware.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, userController.handleMe);
userRoute.patch("/profile", authMiddleware, userController.handleUpdateUser);
userRoute.delete("/profile", authMiddleware, userController.handleDeleteUser);
userRoute.get("/profile", authMiddleware, isAdmin, userController.getAllUsers);
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
