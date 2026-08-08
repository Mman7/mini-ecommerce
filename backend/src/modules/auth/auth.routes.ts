import { Router } from "express";
import * as authController from "./auth.controller.ts";

const authRouter = Router();

// auth routes for login/logout to controller
// route to controller
authRouter.post("/login", authController.handleLogin);
authRouter.post("/logout", authController.handleLogout);
authRouter.post("/register", authController.handleRegister);
authRouter.post("/refresh", authController.handleRefreshToken);

export default authRouter;
