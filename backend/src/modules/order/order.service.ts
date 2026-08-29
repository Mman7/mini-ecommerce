import type { OrderItemInput } from "../../types/order.js";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";

/* 
Order Flow
Pending → Paid → Processing → Shipped → Delivered
*/

export const createOrder = async (
  userId: string,
  items: OrderItemInput[],
  addressId: number,
) => {
  if (!Number.isInteger(addressId) || addressId < 1) {
    throw new Error("A valid delivery address is required");
  }

  if (
    items.length === 0 ||
    items.some(
      (item) =>
        !Number.isInteger(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0,
    )
  ) {
    throw new Error("Each order item must have a valid product and quantity");
  }

  return prisma.$transaction(async (transaction) => {
    const address = await transaction.userAddress.findFirst({
      where: { id: addressId, userId },
      select: {
        addressLine: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });
    if (!address) throw new Error("Delivery address not found");

    const productsWithPrices = [];

    for (const item of items) {
      const product = await transaction.product.findUnique({
        where: { productId: item.productId },
        select: { price: true, isActive: true },
      });

      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.isActive) {
        throw new Error(`Product ${item.productId} is inactive`);
      }

      const stockUpdate = await transaction.inventory.updateMany({
        where: {
          productId: item.productId,
          stock: { gte: item.quantity },
        },
        data: { stock: { decrement: item.quantity } },
      });

      if (stockUpdate.count !== 1) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      productsWithPrices.push({ ...item, price: product.price });
    }

    const total = productsWithPrices.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    return transaction.order.create({
      data: {
        userId,
        total,
        deliveryAddressLine1: address.addressLine,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryPostcode: address.postalCode,
        deliveryCountry: address.country,
        orderItems: {
          create: productsWithPrices.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  });
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: { productImages: true },
          },
        },
      },
    },
  });
  return order;
};

export const getOrdersByUser = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: {
            include: { productImages: true },
          },
        },
      },
    },
  });
};
// TODO later add filtering by userId and status
export const getAllOrders = async () => {
  const orders = await prisma.order.findMany();
  return orders;
};

export const cancelOrder = async (orderId: string, userId: string) => {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: orderId, userId },
      include: { orderItems: true },
    });

    if (!order) throw new Error(`Order ${orderId} not found`);
    if (order.status === OrderStatus.CANCELLED) {
      throw new Error(`Order ${orderId} is already cancelled`);
    }

    for (const item of order.orderItems) {
      await transaction.inventory.update({
        where: { productId: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return transaction.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  });
};
