import type { NextFunction, Request, Response } from "express";

export const validateCartItem = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const item = req.body?.item;
  if (
    !item ||
    typeof item !== "object" ||
    !Number.isInteger((item as { productId?: unknown }).productId) ||
    !Number.isInteger((item as { quantity?: unknown }).quantity) ||
    (item as { productId: number }).productId < 1 ||
    (item as { quantity: number }).quantity < 1
  ) {
    return res.status(400).json({
      message: "Valid product and quantity are required",
    });
  }
  next();
};

export const validateCartItemUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const quantity = req.body?.quantity;
  if (
    typeof req.params.itemId !== "string" ||
    !req.params.itemId ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return res.status(400).json({
      message: "Quantity must be greater than zero and item ID is required",
    });
  }
  next();
};

export const validateCartItemId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof req.params.itemId !== "string" || !req.params.itemId) {
    return res.status(400).json({ message: "Invalid item ID" });
  }
  next();
};
