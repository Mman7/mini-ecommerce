import type { NextFunction, Request, Response } from "express";

export const validateCategoryId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categoryId = Number(req.params.categoryId);
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return res.status(400).json({ message: "Invalid category ID" });
  }
  next();
};

export const validateCategoryProductIds = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categoryId = Number(req.params.categoryId);
  const productId = Number(req.params.productId);
  if (
    !Number.isInteger(categoryId) ||
    categoryId < 1 ||
    !Number.isInteger(productId) ||
    productId < 1
  ) {
    return res.status(400).json({ message: "Invalid category or product ID" });
  }
  next();
};
