import { Router } from "express";
import * as userController from "./user.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const userRoute = Router();

userRoute.get("/me", authMiddleware, userController.handleMe);
userRoute.patch("/me", authMiddleware, userController.handleUpdateUser);
userRoute.delete("/me", authMiddleware, userController.handleDeleteUser);
export default userRoute;
