import type { NextFunction, Request, Response } from "express";

export const validateFavouriteProductId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.productId ?? req.body?.productId);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
};
