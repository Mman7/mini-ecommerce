import { Router } from "express";
import * as productController from "./product.controller.ts";

const productRoutes = Router();

productRoutes.get("/", productController.getProducts);
productRoutes.get("/count", productController.getProductsCount);
productRoutes.get("/recommended", productController.getRecommendedProducts);
productRoutes.get("/:id", productController.getProduct);

export default productRoutes;
