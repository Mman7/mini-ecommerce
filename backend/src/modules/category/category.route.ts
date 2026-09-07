import { Router } from "express";
import * as categoryController from "./category.controller.ts";
import {
  validateCategoryId,
  validateCategoryProductIds,
} from "./category.validator.ts";

const categoryRouter = Router();

// Get all categories
categoryRouter.get("/", categoryController.getAllCategories);

// Get a single category
categoryRouter.get(
  "/:categoryId",
  validateCategoryId,
  categoryController.getCategoryById,
);

// Get products in a category
categoryRouter.get(
  "/:categoryId/products",
  validateCategoryId,
  categoryController.getCategoryProducts,
);

export default categoryRouter;
