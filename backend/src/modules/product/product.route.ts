import { Router } from "express";
import * as productController from "./product.controller.ts";
import { authMiddleware, isAdmin } from "../../middleware/authMiddleware.ts";

const productRoutes = Router();

productRoutes.post(
  "/",
  authMiddleware,
  isAdmin,
  productController.createProduct,
);
productRoutes.get("/", productController.getProducts);
productRoutes.get("/:id", productController.getProduct);
productRoutes.get("/count", productController.getProductsCount);
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
