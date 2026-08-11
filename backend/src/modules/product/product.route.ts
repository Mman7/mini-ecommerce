import { Router } from "express";
import * as productController from "./product.controller.ts";

const productRoutes = Router();

productRoutes.get("/", productController.getProducts);
productRoutes.get("/:id", productController.getProduct);
productRoutes.get("/count", productController.getProductsCount);

export default productRoutes;
