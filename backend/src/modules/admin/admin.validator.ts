import type { NextFunction, Request, Response } from "express";
import { OrderStatus } from "../../enums/order_status.ts";
import type { AdminOrderQuery } from "../order/order.service.ts";

export const validateAdminOrderQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const sortBy = req.query.sortBy ?? "createdAt";
  const sortOrder = req.query.sortOrder ?? "desc";
  const status = req.query.status;
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    (sortBy !== "createdAt" && sortBy !== "total") ||
    (sortOrder !== "asc" && sortOrder !== "desc") ||
    (status !== undefined &&
      !Object.values(OrderStatus).includes(status as OrderStatus)) ||
    (from && Number.isNaN(from.getTime())) ||
    (to && Number.isNaN(to.getTime())) ||
    (from && to && from > to)
  ) {
    return res.status(400).json({ message: "Invalid order query parameters" });
  }

  res.locals.adminOrderQuery = {
    page,
    limit,
    search: req.query.search ? String(req.query.search) : undefined,
    status: status as OrderStatus | undefined,
    from,
    to,
    sortBy: sortBy as AdminOrderQuery["sortBy"],
    sortOrder: sortOrder as AdminOrderQuery["sortOrder"],
  } satisfies AdminOrderQuery;
  next();
};
