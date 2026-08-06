import { Router } from "express";
import * as productController from "./product.controller.ts";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.ts";

const productRoutes = Router();

productRoutes.post(
  "/",
  authMiddleware,
  isAdmin,
  productController.createProduct,
);
productRoutes.get("/:id", productController.getProduct);
productRoutes.get("/", productController.getProductsFromTo);
productRoutes.get("/search", productController.searchProductsByName);
productRoutes.get("/totalCount", productController.getProductsCount);
productRoutes.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  productController.updateProduct,
);
productRoutes.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  productController.deleteProduct,
);

export default productRoutes;
