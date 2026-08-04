import { Router } from "express";
import {
  handleMe,
  handleUpdateUser,
  handleDeleteUser,
} from "./user.controller.ts";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.ts";
import { getTotalUsers } from "./user.service.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, handleMe);
userRoute.patch("/:id/profile", authMiddleware, handleUpdateUser);
userRoute.delete("/:id/profile", authMiddleware, handleDeleteUser);
userRoute.get("/profile", authMiddleware, isAdmin, getTotalUsers);
// route to controller

export default userRoute;
