import { Router } from "express";
import authRoutes from "./auth/auth.routes.ts";
import userRoute from "./user/user.routes.ts";
import productRoutes from "./product/product.route.ts";

// Main router to aggregate all sub-routers
const mainRouter = Router();

// Mount auth routes under /auth
//
mainRouter.use("/auth", authRoutes);
mainRouter.use("/user", userRoute);
mainRouter.use("/product", productRoutes);

export default mainRouter;
