import { Router } from "express";
import * as authController from "./auth.controller.ts";
import { validateLogin, validateRegister } from "./auth.validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import { rateLimit } from "express-rate-limit";

const authRouter = Router();
// rate limiters for authentication routes
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 });
// rate limiter for registration route
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5 });
// rate limiter for refresh token route
const refreshLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });

// auth routes for login/logout to controller
// route to controller
authRouter.post(
  "/login",
  loginLimiter,
  validateLogin,
  authController.handleLogin,
);
authRouter.post("/logout", authMiddleware, authController.handleLogout);
authRouter.post(
  "/register",
  registerLimiter,
  validateRegister,
  authController.handleRegister,
);
authRouter.post("/refresh", refreshLimiter, authController.handleRefreshToken);

export default authRouter;
