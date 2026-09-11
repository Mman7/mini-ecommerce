import type { OrderItemInput } from "../../types/order.js";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";

export type AdminOrderQuery = {
  page: number;
  limit: number;
  search?: string | undefined;
  status?: OrderStatus | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
  sortBy?: "createdAt" | "total" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
};

const serializeDate = (value: Date) => value.toISOString();

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

const parseOrderStatus = (status: string): OrderStatus | null =>
  Object.values(OrderStatus).includes(status as OrderStatus)
    ? (status as OrderStatus)
    : null;

export const canOrderTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
) => orderTransitions[currentStatus].includes(nextStatus);

const serializeOrder = <
  T extends { total: unknown; createdAt: Date; updatedAt: Date },
>(
  order: T,
) => ({
  ...order,
  total: Number(order.total),
  createdAt: serializeDate(order.createdAt),
  updatedAt: serializeDate(order.updatedAt),
});

const restoreOrderInventory = async (
  transaction: Pick<typeof prisma, "inventory">,
  orderItems: Array<{ productId: number; quantity: number }>,
) => {
  for (const item of orderItems) {
    await transaction.inventory.update({
      where: { productId: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
};

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

    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await transaction.product.findMany({
      where: { productId: { in: productIds } },
      select: { productId: true, price: true, isActive: true },
    });
    const productsById = new Map(
      products.map((product) => [product.productId, product]),
    );
    const productsWithPrices = [];

    for (const item of items) {
      const product = productsById.get(item.productId);

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
    await transaction.cartItem.deleteMany({
      where: { cart: { userId } },
    });
    return transaction.order.create({
      data: {
        userId,
        total,
        status: OrderStatus.PAID,
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

export const getTotalOrders = () => prisma.order.count();

export const getTotalRevenue = async () => {
  const result = await prisma.order.aggregate({ _sum: { total: true } });
  return Number(result._sum.total ?? 0);
};

export const getOrdersForAdmin = async ({
  page,
  limit,
  search,
  status,
  from,
  to,
  sortBy,
  sortOrder,
}: AdminOrderQuery) => {
  const where = {
    ...(status ? { status } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lt: to } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { id: { contains: search, mode: "insensitive" as const } },
            {
              user: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              user: {
                email: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };
  const [items, total, counts] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: { userId: true, name: true, email: true, phoneNumber: true },
        },
        orderItems: true,
      },
      orderBy: { [sortBy ?? "createdAt"]: sortOrder ?? "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      orderBy: { status: "asc" },
      _count: { _all: true },
    }),
  ]);
  return {
    items: items.map((order) => ({
      ...serializeOrder(order),
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    })),
    statistics: Object.fromEntries(
      counts.map((entry) => [
        entry.status,
        entry._count && typeof entry._count !== "boolean"
          ? (entry._count._all ?? 0)
          : 0,
      ]),
    ),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getOrderForAdmin = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { userId: true, name: true, email: true, phoneNumber: true },
      },
      orderItems: {
        include: { product: { include: { productImages: true } } },
      },
    },
  });
  if (!order) return null;
  return {
    ...serializeOrder(order),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
      product: {
        ...item.product,
        price: Number(item.product.price),
        createdAt: serializeDate(item.product.createdAt),
        updatedAt: serializeDate(item.product.updatedAt),
      },
    })),
  };
};

export const cancelOrder = async (orderId: string, userId: string) => {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: orderId, userId },
      include: { orderItems: true },
    });

    if (!order) throw new Error(`Order ${orderId} not found`);
    const currentStatus = parseOrderStatus(order.status);
    if (
      !currentStatus ||
      !canOrderTransition(currentStatus, OrderStatus.CANCELLED)
    ) {
      throw new Error(`Order cannot be cancelled from ${order.status}`);
    }

    await restoreOrderInventory(transaction, order.orderItems);

    return transaction.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  });
};

export const updateOrderStatusByAdmin = async (
  orderId: string,
  status: OrderStatus,
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  const currentStatus = parseOrderStatus(order.status);
  if (!currentStatus)
    throw new Error(`Invalid stored order status: ${order.status}`);

  if (!canOrderTransition(currentStatus, status)) {
    throw new Error(
      `Invalid order status transition from ${order.status} to ${status}`,
    );
  }

  return prisma.order.update({ where: { id: orderId }, data: { status } });
};

export const cancelOrderByAdmin = async (orderId: string) => {
  return prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) throw new Error("Order not found");
    const currentStatus = parseOrderStatus(order.status);
    if (
      !currentStatus ||
      ![OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.PROCESSING].includes(
        currentStatus,
      )
    ) {
      throw new Error(`Order cannot be cancelled from ${order.status}`);
    }

    await restoreOrderInventory(transaction, order.orderItems);

    return transaction.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });
  });
};
