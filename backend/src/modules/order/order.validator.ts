import type { NextFunction, Request, Response } from "express";

export const validateCreateOrder = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { orderProduct, addressId } = req.body ?? {};
  if (
    !Array.isArray(orderProduct) ||
    orderProduct.length === 0 ||
    !Number.isInteger(addressId) ||
    addressId < 1 ||
    orderProduct.some(
      (item: unknown) =>
        !item ||
        typeof item !== "object" ||
        !Number.isInteger((item as { productId?: unknown }).productId) ||
        !Number.isInteger((item as { quantity?: unknown }).quantity) ||
        (item as { productId: number }).productId < 1 ||
        (item as { quantity: number }).quantity < 1,
    )
  ) {
    return res.status(400).json({
      error: "Product ID, quantity, and address ID are required",
    });
  }
  next();
};

export const validateOrderId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof req.params.orderId !== "string" || !req.params.orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }
  next();
};
