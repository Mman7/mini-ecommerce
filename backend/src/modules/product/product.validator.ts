import type { NextFunction, Request, Response } from "express";

export const validateProductId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = Number(req.params.id);
  if (!Number.isInteger(productId) || productId < 1) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
};

export const validateProductListQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const minPrice =
    req.query.minPrice === undefined ? 0 : Number(req.query.minPrice);
  const maxPrice =
    req.query.maxPrice === undefined
      ? Number.MAX_VALUE
      : Number(req.query.maxPrice);
  const categoryId =
    req.query.categoryId === undefined
      ? undefined
      : Number(req.query.categoryId);
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isFinite(minPrice) ||
    minPrice < 0 ||
    !Number.isFinite(maxPrice) ||
    maxPrice < minPrice ||
    (categoryId !== undefined &&
      (!Number.isInteger(categoryId) || categoryId < 1)) ||
    (sortBy !== undefined &&
      !["productId", "name", "price", "createdAt"].includes(String(sortBy))) ||
    (sortOrder !== undefined && !["asc", "desc"].includes(String(sortOrder)))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid product query parameters" });
  }
  next();
};

export const validateRecommendedLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = req.query.limit === undefined ? 4 : Number(req.query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ message: "Invalid recommendation limit" });
  }
  next();
};
