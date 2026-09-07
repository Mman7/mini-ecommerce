import { Router } from "express";
import { authMiddleware, isAdmin } from "../../middleware/auth.middleware.ts";
import * as adminController from "./admin.controller.ts";
import { validateAdminOrderQuery } from "./admin.validator.ts";
import * as productController from "../product/product.controller.ts";
import * as categoryController from "../category/category.controller.ts";
import { upload } from "../../middleware/upload.middleware.ts";
import { handleSingleImageUploadError } from "../../middleware/upload-error.middleware.ts";
import {
  validateCategoryId,
  validateCategoryProductIds,
} from "../category/category.validator.ts";
import {
  validateProductId as validateInventoryProductId,
  validateStockBody,
  validateStockUpdate,
} from "../inventory/inventory.validator.ts";

const adminRoute = Router();

adminRoute.use(authMiddleware, isAdmin);

adminRoute.get("/total-orders", adminController.getTotalOrders);
adminRoute.get("/total-revenue", adminController.getTotalRevenue);
adminRoute.get("/overview", adminController.getOverview);
adminRoute.get("/products", productController.getAdminProducts);
adminRoute.get("/products/:id", productController.getAdminProduct);

adminRoute.post(
  "/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  productController.createProduct,
);
adminRoute.patch("/products/:id", productController.updateProduct);
adminRoute.patch(
  "/products/:productId/images/:imageId",
  upload.single("image"),
  handleSingleImageUploadError,
  productController.updateProductImage,
);
adminRoute.delete("/products/:id", productController.deleteProduct);

adminRoute.post("/categories", categoryController.createCategory);
adminRoute.get("/categories", categoryController.getAdminCategories);
adminRoute.get(
  "/categories/:categoryId",
  validateCategoryId,
  categoryController.getAdminCategory,
);
adminRoute.patch(
  "/categories/:categoryId",
  validateCategoryId,
  categoryController.updateCategory,
);
adminRoute.delete(
  "/categories/:categoryId",
  validateCategoryId,
  categoryController.deleteCategory,
);
adminRoute.delete(
  "/categories/:categoryId/products/:productId",
  validateCategoryProductIds,
  categoryController.deleteCategoryProducts,
);
adminRoute.post(
  "/categories/:categoryId/products/:productId",
  validateCategoryProductIds,
  categoryController.addProductToCategory,
);

adminRoute.get(
  "/orders",
  validateAdminOrderQuery,
  adminController.getAdminOrders,
);
adminRoute.get("/orders/:orderId", adminController.getAdminOrder);
adminRoute.patch(
  "/orders/:orderId/status",
  adminController.updateAdminOrderStatus,
);
adminRoute.patch("/orders/:orderId/cancel", adminController.cancelAdminOrder);
adminRoute.get("/users", adminController.getAllUsers);
adminRoute.patch("/users/:id/activate", adminController.activeUser);
adminRoute.patch("/users/:id/deactivate", adminController.inactiveUser);

adminRoute.post("/inventory", validateStockBody, adminController.createStock);
adminRoute.patch(
  "/inventory/:productId",
  validateInventoryProductId,
  validateStockUpdate,
  adminController.updateStock,
);

export default adminRoute;
