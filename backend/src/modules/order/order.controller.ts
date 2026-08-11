import type { Request, Response } from "express";
import * as orderService from "./order.service.ts";
import type { OrderItemInput } from "../../types/order.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      orderProduct,
    }: { userId: string; orderProduct: OrderItemInput[] } = req.body;

    if (!userId || !orderProduct?.length) {
      return res
        .status(400)
        .json({ error: "User ID, Product ID, and quantity are required" });
    }
    // create order in the database
    const order = await orderService.createOrder(userId, orderProduct);

    res.status(201).json({ msg: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    if (typeof orderId !== "string") {
      return res.status(400).json({ error: "Order ID must be a string" });
    }

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

// get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ msg: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  try {
    const { orderId } = req.params as { orderId: string };
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    // remove these validation move to service layer
    const validOrderStatuses = ["Pending", "Processing"];
    // check order exists and if the order status is valid for cancellation
    const validOrder = await orderService.getOrderById(orderId);
    if (!validOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    const order = validOrder;

    if (!validOrderStatuses.includes(order.status)) {
      return res.status(400).json({
        error: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

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
