import { Router } from "express";
import authRoutes from "./auth/auth.routes.ts";
import userRoute from "./user/user.routes.ts";

// Main router to aggregate all sub-routers
const mainRouter = Router();

// Mount auth routes under /auth
//
mainRouter.use("/auth", authRoutes);
mainRouter.use("/user", userRoute);

export default mainRouter;
