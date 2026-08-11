import * as inventoryService from "./inventory.service.ts";
import type { Request, Response } from "express";

export const createStock = async (req: Request, res: Response) => {
  try {
    const { productId, stock } = req.body;

    if (!productId || !stock) {
      return res
        .status(400)
        .json({ error: "Product ID and stock are required" });
    }

    if (typeof productId !== "number" || typeof stock !== "number") {
      return res
        .status(400)
        .json({ error: "Product ID and stock must be numbers" });
    }

    // check if productId already exists in inventory
    const existingStock = await inventoryService.getCurrentStock(productId);
    if (existingStock !== 0) {
      return res
        .status(400)
        .json({ error: "Stock for this product already exists" });
    }
    const newStock = await inventoryService.createStock(productId, stock);

    res
      .status(201)
      .json({ msg: "Stock created successfully", stock: newStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create stock" });
  }
};

export const getCurrentStock = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    if (typeof productId !== "string") {
      return res.status(400).json({ error: "Product ID must be a string" });
    }
    // try to convert productId to a number
    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return res
        .status(400)
        .json({ error: "Product ID must be a valid number" });
    }

    const stock = await inventoryService.getCurrentStock(productIdNum);
    res.json({ stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get current stock" });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (!productId || !stock) {
      return res
        .status(400)
        .json({ error: "Product ID and stock are required" });
    }
    if (typeof productId !== "string" || typeof stock !== "number") {
      return res.status(400).json({
        error: "Product ID must be a string and stock must be a number",
      });
    }
    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return res
        .status(400)
        .json({ error: "Product ID must be a valid number" });
    }

    // check if productId exists in inventory
    const existingStock = await inventoryService.getCurrentStock(productIdNum);

    if (existingStock === 0) {
      return res
        .status(400)
        .json({ error: "Stock for this product does not exist" });
    }
    const updatedStock = await inventoryService.updateStock(
      productIdNum,
      stock,
    );
    res.json({ msg: "Stock updated successfully", stock: updatedStock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update stock" });
  }
};

const deductStockBy = async (productId: number, quantity: number) => {
  try {
    if (typeof productId !== "number" || typeof quantity !== "number") {
      throw new Error("Product ID and quantity must be numbers");
    }

    // check if productId exists in inventory
    const currentStock = await inventoryService.getCurrentStock(productId);

    if (currentStock < quantity) {
      throw new Error("Insufficient stock");
    }

    const updatedStock = await inventoryService.updateStock(
      productId,
      currentStock - quantity,
    );
    return updatedStock;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to deduct stock");
  }
};
