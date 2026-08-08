import { Router } from "express";
import { authMiddleware, isAdmin } from "../../middleware/authMiddleware.ts";
import * as categoryController from "./category.controller.ts";

const categoryRouter = Router();

// Create a category
categoryRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  categoryController.createCategory,
);

// Update a category by id
categoryRouter.patch(
  "/:categoryId",
  authMiddleware,
  isAdmin,
  categoryController.updateCategory,
);

// Delete a category by id
categoryRouter.delete(
  "/:categoryId",
  authMiddleware,
  isAdmin,
  categoryController.deleteCategory,
);

// Delete a specific product from a category
categoryRouter.delete(
  "/:categoryId/products/:productId",
  authMiddleware,
  isAdmin,
  categoryController.deleteCategoryProducts,
);

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
