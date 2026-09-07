import type { Request, Response } from "express";
import * as orderService from "./order.service.ts";
import type { OrderItemInput } from "../../types/order.js";
import { OrderStatus } from "../../enums/order_status.ts";

const parseAdminPageQuery = (req: Request) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  return Number.isInteger(page) &&
    page > 0 &&
    Number.isInteger(limit) &&
    limit > 0 &&
    limit <= 100
    ? { page, limit }
    : null;
};

const parseAdminStatus = (value: unknown) => {
  if (value === undefined || value === "") return undefined;
  return Object.values(OrderStatus).includes(value as OrderStatus)
    ? (value as OrderStatus)
    : null;
};

export const getAdminOrders = async (req: Request, res: Response) => {
  const pagination = parseAdminPageQuery(req);
  const status = parseAdminStatus(req.query.status);
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  if (
    !pagination ||
    status === null ||
    (from && Number.isNaN(from.getTime())) ||
    (to && Number.isNaN(to.getTime()))
  ) {
    return res.status(400).json({ message: "Invalid order query parameters" });
  }
  try {
    return res.status(200).json(
      await orderService.getOrdersForAdmin({
        ...pagination,
        search: req.query.search ? String(req.query.search) : undefined,
        status,
        from,
        to,
        sortBy: req.query.sortBy === "total" ? "total" : "createdAt",
        sortOrder: req.query.sortOrder === "asc" ? "asc" : "desc",
      }),
    );
  } catch {
    return res.status(500).json({ message: "Failed to retrieve orders" });
  }
};

export const getAdminOrder = async (req: Request, res: Response) => {
  const orderId =
    typeof req.params.orderId === "string" ? req.params.orderId : undefined;
  if (!orderId)
    return res.status(400).json({ message: "Order ID is required" });
  try {
    const order = await orderService.getOrderForAdmin(orderId);
    return order
      ? res.status(200).json(order)
      : res.status(404).json({ message: "Order not found" });
  } catch {
    return res.status(500).json({ message: "Failed to retrieve order" });
  }
};

export const updateAdminOrderStatus = async (req: Request, res: Response) => {
  const orderId =
    typeof req.params.orderId === "string" ? req.params.orderId : undefined;
  const status = parseAdminStatus(req.body?.status);
  if (!orderId || !status)
    return res.status(400).json({ message: "Invalid order status" });
  try {
    return res
      .status(200)
      .json(await orderService.updateOrderStatusByAdmin(orderId, status));
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update order status",
    });
  }
};

export const cancelAdminOrder = async (req: Request, res: Response) => {
  const orderId =
    typeof req.params.orderId === "string" ? req.params.orderId : undefined;
  if (!orderId)
    return res.status(400).json({ message: "Order ID is required" });
  try {
    return res.status(200).json(await orderService.cancelOrderByAdmin(orderId));
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to cancel order",
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };

  try {
    const { orderProduct, addressId } = req.body as {
      orderProduct: OrderItemInput[];
      addressId: number;
    };

    // create order in the database
    const order = await orderService.createOrder(
      userId,
      orderProduct,
      addressId,
    );

    res.status(201).json({ msg: "Order created successfully", order });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Delivery address not found"
    ) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  try {
    const { orderId } = req.params as { orderId: string };

    // check if the order belongs to the user
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to view this order" });
    }

    res.status(200).json({ msg: "Order retrieved successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };

  try {
    const orders = await orderService.getOrdersByUser(userId);
    return res
      .status(200)
      .json({ msg: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  try {
    const { orderId } = req.params as { orderId: string };
    // check order exists and if the order status is valid for cancellation
    const validOrder = await orderService.getOrderById(orderId);
    if (!validOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (validOrder.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to cancel this order" });
    }
    const order = validOrder;

    // cancel order and restore the inventory
    const cancelledOrder = await orderService.cancelOrder(orderId, userId);

    res
      .status(200)
      .json({ msg: "Order cancelled successfully", order: cancelledOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};
