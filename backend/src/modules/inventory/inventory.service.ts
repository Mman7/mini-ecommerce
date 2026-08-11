import { prisma } from "../../utils/prisma.ts";

export const createStock = async (productId: number, stock: number) => {
  const inventory = await prisma.inventory.create({
    data: {
      productId,
      stock,
    },
    select: {
      productId: true,
      stock: true,
      createdAt: true,
    },
  });
  return inventory;
};

export const getCurrentStock = async (productId: number) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
    select: {
      stock: true,
      id: true,
      productId: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  return inventory?.stock ?? 0;
};

export const updateStock = async (productId: number, stock: number) => {
  const inventory = await prisma.inventory.update({
    where: { productId },
    data: { stock },
    select: {
      stock: true,
      id: true,
      productId: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  return inventory;
};

// do only restore stock nothing else
export const restoreStock = async (orderId: string) => {
  // get order items by orderId
  const orderItems = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      userId: true,
      total: true,
      orderItems: {
        select: {
          productId: true,
          quantity: true,
          price: true,
          orderId: true,
        },
      },
    },
  });
  // restore stock for each order item
  for (const item of orderItems?.orderItems ?? []) {
    await prisma.inventory.update({
      where: { productId: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
  return orderItems;
};
