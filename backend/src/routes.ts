import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.ts";
import userRoute from "./modules/user/user.routes.ts";
import productRoutes from "./modules/product/product.route.ts";
import cartRoutes from "./modules/cart/cart.route.ts";

// Main router to aggregate all sub-routers
const mainRouter = Router();

// Mount auth routes under /auth
//
mainRouter.use("/auth", authRoutes);
mainRouter.use("/user", userRoute);
mainRouter.use("/product", productRoutes);
mainRouter.use("/cart", cartRoutes);

export default mainRouter;
