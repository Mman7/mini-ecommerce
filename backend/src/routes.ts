import { Router } from "express";
import authRoutes from "./auth/auth.routes.ts";

// Main router to aggregate all sub-routers
const mainRouter = Router();

// Mount auth routes under /auth
//
mainRouter.use("/auth", authRoutes);

export default mainRouter;
