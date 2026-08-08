import type { Request, Response } from "express";
import * as updateCategoryService from "./category.service.ts";
import * as productService from "../product/product.service.ts";
import type { UpdateCategoryInput } from "../../types/category.js";

export const updateCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { name, description }: UpdateCategoryInput = req.body;

  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    const category = await updateCategoryService.updateCategory(
      parseInt(categoryId),
      { name, description },
    );
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (categoryId === undefined || categoryId === null || categoryId === "") {
    res.status(400).json({ error: "categoryId is required" });
    return;
  }

  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  try {
    // validate if the category exists before attempting to delete it
    const validCategory = await updateCategoryService.getCategoryById(
      parseInt(categoryId),
    );
    if (!validCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    const category = await updateCategoryService.deleteCategory(
      parseInt(categoryId),
    );
    res
      .status(200)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const deleteCategoryProducts = async (req: Request, res: Response) => {
  const { categoryId, productId } = req.params;
  if (!categoryId || !productId) {
    res.status(400).json({ error: "categoryId and productId are required" });
    return;
  }

  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  if (typeof productId !== "string" || isNaN(parseInt(productId))) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const validCategory = await updateCategoryService.getCategoryById(
      parseInt(categoryId),
    );
    // validate if the category exists before attempting to delete a product from it
    if (!validCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    // validate if the product exists in the category before attempting to delete it
    const categoryProducts = await updateCategoryService.getCategoryProducts(
      parseInt(categoryId),
    );
    if (!categoryProducts || !categoryProducts.products) {
      return res.status(404).json({ message: "No products found in category" });
    }
    if (
      !categoryProducts.products.some(
        (product) => product.productId === parseInt(productId),
      )
    ) {
      return res.status(404).json({ message: "Product not found in category" });
    }
    const category = await updateCategoryService.deleteCategoryProducts(
      parseInt(categoryId),
      parseInt(productId),
    );
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const addProductToCategory = async (req: Request, res: Response) => {
  const { categoryId, productId } = req.params;
  if (!categoryId || !productId) {
    res.status(400).json({ error: "categoryId and productId are required" });
    return;
  }

  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }

  if (typeof productId !== "string" || isNaN(parseInt(productId))) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await productService.getProductById(parseInt(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // check if the product is already in the category
    const categoryProducts = await updateCategoryService.getCategoryProducts(
      parseInt(categoryId),
    );
    if (!categoryProducts || !categoryProducts.products) {
      return res.status(404).json({ message: "No products found in category" });
    }
    if (
      categoryProducts.products.some(
        (product) => product.productId === parseInt(productId),
      )
    ) {
      return res.status(400).json({ message: "Product already in category" });
    }

    const category = await updateCategoryService.addProductToCategory(
      parseInt(categoryId),
      parseInt(productId),
    );
    res
      .status(200)
      .json({ msg: "Product added to category successfully", category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (categoryId === undefined || categoryId === null || categoryId === "") {
    res.status(400).json({ error: "categoryId is required" });
    return;
  }
  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  try {
    const category =
      (await updateCategoryService.getCategoryById(parseInt(categoryId))) ??
      "Category not found";
    res.status(200).json({ msg: "Category retrieved successfully", category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await updateCategoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getCategoryProducts = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  if (categoryId === undefined || categoryId === null || categoryId === "") {
    res.status(400).json({ error: "categoryId is required" });
    return;
  }
  if (typeof categoryId !== "string" || isNaN(parseInt(categoryId))) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  try {
    const validCategory = await updateCategoryService.getCategoryById(
      parseInt(categoryId),
    );
    if (!validCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = await updateCategoryService.getCategoryProducts(
      parseInt(categoryId),
    );
    res
      .status(200)
      .json({ msg: "Category products retrieved successfully", category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (name === undefined || name === null || name === "") {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const category = await updateCategoryService.createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};
