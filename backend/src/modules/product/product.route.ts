import { Router } from "express";
import * as productController from "./product.controller.ts";
import {
  validateProductListQuery,
  validateRecommendedLimit,
} from "./product.validator.ts";

const productRoutes = Router();

productRoutes.get("/", validateProductListQuery, productController.getProducts);
productRoutes.get("/count", productController.getProductsCount);
productRoutes.get(
  "/recommended",
  validateRecommendedLimit,
  productController.getRecommendedProducts,
);
productRoutes.get("/:id", productController.getProduct);

export default productRoutes;
