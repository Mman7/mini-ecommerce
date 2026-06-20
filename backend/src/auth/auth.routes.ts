import { Router } from "express";
import {
  loginAccount,
  logoutAccount,
  registerAccount,
  refreshToken,
} from "./auth.controller.ts";

const authRouter = Router();
// TODO implement login

// auth routes for login/logout to controller
// route to controller
authRouter.post("/login", loginAccount);
authRouter.post("/logout", logoutAccount);
authRouter.post("/register", registerAccount);
authRouter.post("/refresh", refreshToken);

export default authRouter;
