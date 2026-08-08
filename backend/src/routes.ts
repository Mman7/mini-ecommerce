import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.ts";
import userRoute from "./modules/user/user.routes.ts";
import productRoutes from "./modules/product/product.route.ts";
import cartRoutes from "./modules/cart/cart.route.ts";
import categoryRoutes from "./modules/category/category.route.ts";

// Main router to aggregate all sub-routers
const mainRouter = Router();

// Mount auth routes under /auth
//
mainRouter.use("/auth", authRoutes);
mainRouter.use("/users", userRoute);
mainRouter.use("/products", productRoutes);
mainRouter.use("/carts", cartRoutes);
mainRouter.use("/categories", categoryRoutes);

export default mainRouter;
