import type { Request, Response } from "express";
import * as productService from "./product.service.ts";
import type { Product, ProductSearchQuery } from "../../types/product.js";
import type { ProductUpdateInput } from "../../generated/prisma/models.ts";

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required" });
  }

  try {
    // try parse price to number
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res
        .status(400)
        .json({ error: "Price must be a non-negative number" });
    }

    const productData: Product = {
      name,
      description,
      price: parsedPrice,
    };
    const product = await productService.createProduct(productData);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page, limit, name, minPrice, maxPrice } = req.query;

  try {
    // If an ID param is provided, return a single product
    if (id !== undefined && id !== "") {
      const productData = await productService.getProductById(Number(id));
      if (!productData) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(productData);
    }

    // If no ID param is provided, return a list of products based on the query parameters
    if (page === undefined || limit === undefined) {
      return res
        .status(400)
        .json({ error: "Page and limit query parameters are required" });
    }

    // Parse query parameters and set default values if necessary
    const query: ProductSearchQuery = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      name: String(name || ""),
      minPrice: minPrice !== undefined ? Number(minPrice) : 0,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : Number.MAX_VALUE,
    };

    const products = await productService.getProducts(query);

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
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

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === undefined) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  const { name, description, price, isActive }: ProductUpdateInput = req.body;

  const updateData: ProductUpdateInput = {};
  // include only the fields that are provided in the request body
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (isActive !== undefined) updateData.isActive = isActive;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update" });
  }

  try {
    const updatedProduct = await productService.updateProductById(
      Number(id),
      updateData,
    );
    return res
      .status(200)
      .json({ message: "Product updated successfully", item: updatedProduct });
  } catch (error) {
    console.log(error);
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

export const getProductsCount = async (req: Request, res: Response) => {
  try {
    const count = await productService.getProductsCount();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get products count" });
  }
};
