import type { OrderItemInput } from "../../types/order.js";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";
import * as inventoryService from "../inventory/inventory.service.ts";

/* 
Order Flow
Pending → Paid → Processing → Shipped → Delivered
*/

export const createOrder = async (userId: string, items: OrderItemInput[]) => {
  const productsWithPrices = await Promise.all(
    items.map(async (item) => {
      const [stock, product] = await Promise.all([
        // Check if the product exists in the inventory and more than quantity is available
        inventoryService.getCurrentStock(item.productId),
        prisma.product.findUnique({
          where: { productId: item.productId },
          select: { price: true },
        }),
      ]);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      // Check if the stock is sufficient for the requested quantity
      if (stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${item.productId}. ` +
            `Requested: ${item.quantity}, available: ${stock}`,
        );
      }

      return {
        ...item,
        stock,
        price: product.price,
      };
    }),
  );

  // Calculate total price of the order
  const total = productsWithPrices.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      orderItems: {
        create: productsWithPrices.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price, // unit price
        })),
      },
    },
  });

  return order;
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });
  return order;
};

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany();
  return orders;
};

export const cancelOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw new Error(`Order ${orderId} is already cancelled`);
  }
  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });
  // restore stock
  await inventoryService.restoreStock(orderId);

  // TODO try refund
  await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 1 second to simulate refund processing

  return cancelledOrder;
};
