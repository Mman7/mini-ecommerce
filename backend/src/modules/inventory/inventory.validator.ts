import type { NextFunction, Request, Response } from "express";

export const validateProductId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ error: "Product ID must be a valid number" });
  }
  next();
};

export const validateStockBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId, stock } = req.body ?? {};
  if (
    !Number.isInteger(productId) ||
    productId < 1 ||
    typeof stock !== "number" ||
    !Number.isFinite(stock) ||
    stock < 0
  ) {
    return res.status(400).json({
      error:
        "Product ID must be a positive integer and stock must be a non-negative number",
    });
  }
  next();
};

export const validateStockUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const stock = req.body?.stock;
  if (
    typeof req.params.productId !== "string" ||
    !req.params.productId ||
    typeof stock !== "number" ||
    !Number.isFinite(stock) ||
    stock < 0
  ) {
    return res.status(400).json({
      error: "Product ID and a non-negative stock number are required",
    });
  }
  next();
};
