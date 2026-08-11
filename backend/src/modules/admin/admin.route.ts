import { Router } from "express";
import { authMiddleware, isAdmin } from "../../middleware/authMiddleware.ts";
import * as adminController from "./admin.controller.ts";

const adminRoute = Router();

adminRoute.use(authMiddleware, isAdmin);

adminRoute.get("/total-orders", adminController.getTotalOrders);
adminRoute.get("/total-revenue", adminController.getTotalRevenue);

adminRoute.post("/products", adminController.createProduct);
adminRoute.patch("/products/:id", adminController.updateProduct);
adminRoute.delete("/products/:id", adminController.deleteProduct);

adminRoute.post("/categories", adminController.createCategory);
adminRoute.patch("/categories/:categoryId", adminController.updateCategory);
adminRoute.delete("/categories/:categoryId", adminController.deleteCategory);
adminRoute.delete(
  "/categories/:categoryId/products/:productId",
  adminController.deleteCategoryProducts,
);
adminRoute.post(
  "/categories/:categoryId/products/:productId",
  adminController.addProductToCategory,
);

adminRoute.get("/orders", adminController.getAllOrders);
adminRoute.get("/users", adminController.getAllUsers);
adminRoute.patch("/users/:id/activate", adminController.activeUser);
adminRoute.patch("/users/:id/deactivate", adminController.inactiveUser);

adminRoute.post("/inventory", adminController.createStock);
adminRoute.patch("/inventory/:productId", adminController.updateStock);

export default adminRoute;
