import { Router } from "express";
import {
  handleMe,
  handleUpdateUser,
  handleDeleteUser,
  activeUserController,
  inactiveUserController,
  getAllUsers,
} from "./user.controller.ts";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, handleMe);
userRoute.patch("/profile", authMiddleware, handleUpdateUser);
userRoute.delete("/profile", authMiddleware, handleDeleteUser);
userRoute.get("/profile", authMiddleware, isAdmin, getAllUsers);
userRoute.patch("/:id/activate", authMiddleware, isAdmin, activeUserController);
userRoute.patch(
  "/:id/deactivate",
  authMiddleware,
  isAdmin,
  inactiveUserController,
);
// route to controller

export default userRoute;
