import type { Request, Response } from "express";
import * as productService from "./product.service.ts";
import type { Product } from "../types/product.js";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required" });
  }

  const productData: Product = {
    name,
    description,
    price,
  };

  try {
    const product = await productService.createProduct(productData);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productData = await productService.getProductById(Number(id));
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(productData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get product" });
  }
};

export const getProductsFromTo = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const products = await productService.getProducts(
      Number(page),
      Number(limit),
    );
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  const { name, description, price }: Product = req.body;

  const updateData: Product = {
    id: Number(id),
    name,
    description,
    price,
  };

  try {
    const updatedProduct = await productService.updateProductById(
      Number(id),
      updateData,
    );
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  try {
    const deletedItem = await productService.deleteProductById(Number(id));
    return res
      .status(200)
      .json({ message: "Product deleted successfully", item: deletedItem });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

export const searchProductsByName = async (req: Request, res: Response) => {
  const { name, page, limit } = req.query;
  console.log("Search query:", name);
  if (!name) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const products = await productService.searchProductsByName({
      query: String(name),
      page: Number(page),
      limit: Number(limit),
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to search products" });
  }
};

export const searchProductBetweenPrice = async (
  req: Request,
  res: Response,
) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice || !maxPrice) {
    return res
      .status(400)
      .json({ error: "Both minPrice and maxPrice are required" });
  }
  try {
    const products = await productService.searchBetweenPrice({
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      page: 1,
      limit: 10,
    });
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to search products by price" });
  }
};

export const getProductsCount = async (req: Request, res: Response) => {
  try {
    const count = await productService.getProductsCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products count" });
  }
};
