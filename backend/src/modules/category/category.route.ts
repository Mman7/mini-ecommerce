import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.ts";
import * as categoryController from "./category.controller.ts";

const categoryRouter = Router();

// Create a category
// Add a product to a category
categoryRouter.post(
  "/:categoryId/products/:productId",
  authMiddleware,
  categoryController.addProductToCategory,
);

// Get all categories
categoryRouter.get("/", categoryController.getAllCategories);

// Get a single category
categoryRouter.get("/:categoryId", categoryController.getCategoryById);

// Get products in a category
categoryRouter.get(
  "/:categoryId/products",
  categoryController.getCategoryProducts,
);

export default categoryRouter;
