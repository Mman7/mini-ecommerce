import type { Request, Response } from "express";
import * as adminService from "../admin/admin.service.ts";
import * as inventoryController from "../inventory/inventory.controller.ts";
import * as userController from "../user/user.controller.ts";
import { OrderStatus } from "../../enums/order_status.ts";

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json(await adminService.getAdminOrders(res.locals.adminOrderQuery));
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
    const order = await adminService.getAdminOrder(orderId);
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
  const status = req.body?.status;
  if (!orderId || !Object.values(OrderStatus).includes(status as OrderStatus)) {
    return res.status(400).json({ message: "Invalid order status" });
  }
  try {
    return res
      .status(200)
      .json(await adminService.updateAdminOrderStatus(orderId, status));
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
    return res.status(200).json(await adminService.cancelAdminOrder(orderId));
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to cancel order",
    });
  }
};

export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await adminService.getTotalRevenue();
    res.status(200).json({ totalRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve total revenue", error });
  }
};

export const getTotalOrders = async (req: Request, res: Response) => {
  try {
    const totalOrders = await adminService.getTotalOrders();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve total orders", error });
  }
};

export const getOverview = async (req: Request, res: Response) => {
  try {
    const to = req.query.to ? new Date(String(req.query.to)) : new Date();
    const from = req.query.from
      ? new Date(String(req.query.from))
      : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (
      Number.isNaN(from.getTime()) ||
      Number.isNaN(to.getTime()) ||
      from >= to
    ) {
      res.status(400).json({ message: "Invalid overview date range" });
      return;
    }

    res.status(200).json(await adminService.getOverview({ from, to }));
  } catch {
    res.status(500).json({ message: "Failed to retrieve dashboard overview" });
  }
};

export const getAllUsers = userController.getAllUsers;
export const activeUser = userController.activeUserController;
export const inactiveUser = userController.inactiveUserController;
export const createStock = inventoryController.createStock;
export const updateStock = inventoryController.updateStock;
