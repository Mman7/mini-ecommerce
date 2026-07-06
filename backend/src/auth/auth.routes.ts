import { Router } from "express";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleRefreshToken,
} from "./auth.controller.ts";

const authRouter = Router();

// auth routes for login/logout to controller
// route to controller
authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);
authRouter.post("/register", handleRegister);
authRouter.post("/refresh", handleRefreshToken);

export default authRouter;
