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
const shippingCost = 500;

const orderTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
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

export const fulfillReservedOrder = async (
  reservationId: string,
  paymentIntentId: string,
) =>
  prisma.$transaction(async (transaction) => {
    const existingOrder = await transaction.order.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (existingOrder) return existingOrder;

    const reservation = await transaction.checkoutReservation.findUnique({
      where: { id: reservationId },
      include: { items: true },
    });
    if (!reservation || reservation.paymentIntentId !== paymentIntentId) {
      throw new Error("Checkout reservation not found");
    }
    if (reservation.status !== "RESERVED") {
      throw new Error("Checkout reservation is no longer active");
    }

    const claimed = await transaction.checkoutReservation.updateMany({
      where: { id: reservationId, status: "RESERVED" },
      data: { status: "FULFILLED", activeUserId: null },
    });
    if (claimed.count !== 1) {
      const concurrentOrder = await transaction.order.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
      });
      if (concurrentOrder) return concurrentOrder;
      throw new Error("Checkout reservation has already been claimed");
    }

    await transaction.cartItem.deleteMany({
      where: { cart: { userId: reservation.userId } },
    });

    return transaction.order.create({
      data: {
        userId: reservation.userId,
        total: reservation.amount,
        status: OrderStatus.PAID,
        stripePaymentIntentId: paymentIntentId,
        deliveryName: reservation.deliveryName,
        deliveryAddressLine1: reservation.deliveryAddressLine1,
        deliveryAddressLine2: reservation.deliveryAddressLine2,
        deliveryCity: reservation.deliveryCity,
        deliveryState: reservation.deliveryState,
        deliveryPostcode: reservation.deliveryPostcode,
        deliveryCountry: reservation.deliveryCountry,
        orderItems: {
          create: reservation.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            productImageUrl: item.productImageUrl,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
    });
  });

export const getOrderByPaymentIntentId = async (paymentIntentId: string) =>
  prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

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
  if (!order) return null;
  return {
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        name: item.productName,
        slug: item.productSlug,
        productImages: item.productImageUrl
          ? [
              {
                url: item.productImageUrl,
                altText: item.productName,
                isThumbnail: true,
              },
            ]
          : item.product.productImages,
      },
    })),
  };
};

export const getOrdersByUser = async (userId: string) => {
  const orders = await prisma.order.findMany({
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
  return orders.map((order) => ({
    ...order,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        name: item.productName,
        slug: item.productSlug,
        productImages: item.productImageUrl
          ? [
              {
                url: item.productImageUrl,
                altText: item.productName,
                isThumbnail: true,
              },
            ]
          : item.product.productImages,
      },
    })),
  }));
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
        select: {
          userId: true,
          name: true,
          email: true,
          phoneNumber: true,
          _count: { select: { orders: true } },
        },
      },
      orderItems: {
        include: {
          product: {
            include: {
              productImages: true,
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  });
  if (!order) return null;
  return {
    ...serializeOrder(order),
    user: { ...order.user, ordersCount: order.user._count.orders },
    deliveryFee: shippingCost,
    orderItems: order.orderItems.map((item) => {
      const { category, ...product } = item.product;
      return {
        ...item,
        price: Number(item.price),
        product: {
          ...product,
          name: item.productName,
          slug: item.productSlug,
          productImages: item.productImageUrl
            ? [
                {
                  url: item.productImageUrl,
                  altText: item.productName,
                  isThumbnail: true,
                },
              ]
            : product.productImages,
          collection: category?.name ?? null,
          price: Number(product.price),
          createdAt: serializeDate(product.createdAt),
          updatedAt: serializeDate(product.updatedAt),
        },
      };
    }),
  };
};

export const requestOrderCancellation = async (
  orderId: string,
  userId: string,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId, userId },
  });
  if (!order) throw new Error("Order not found");
  if (
    !(
      [
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.PROCESSING,
      ] as OrderStatus[]
    ).includes(order.status)
  ) {
    throw new Error(`Order cannot be cancelled from ${order.status}`);
  }
  if (order.cancellationRequestedAt) return order;

  const result = await prisma.order.updateMany({
    where: {
      id: orderId,
      userId,
      status: order.status,
      cancellationRequestedAt: null,
    },
    data: { cancellationRequestedAt: new Date() },
  });
  if (result.count === 0) {
    const current = await prisma.order.findUnique({ where: { id: orderId } });
    if (current?.cancellationRequestedAt) return current;
    throw new Error("Order status changed before the request was submitted");
  }

  return prisma.order.findUniqueOrThrow({ where: { id: orderId } });
};

export const resolveOrderCancellationRequest = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");
  if (!order.cancellationRequestedAt) {
    throw new Error("No cancellation request is pending");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { cancellationRequestedAt: null },
  });
};

export const markOrderRefundedByPaymentIntent = async (
  paymentIntentId: string,
) => {
  const order = await prisma.order.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });
  if (!order) throw new Error("Order for refunded payment not found");
  if (order.status === OrderStatus.REFUNDED) return order;

  return prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.REFUNDED },
  });
};

export const updateOrderStatusByAdmin = async (
  orderId: string,
  status: OrderStatus,
) => {
  if (status === OrderStatus.CANCELLED) {
    throw new Error("Use the cancellation action to cancel an order");
  }
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
    if (order.status === OrderStatus.CANCELLED) return order;
    const currentStatus = parseOrderStatus(order.status);
    if (
      !currentStatus ||
      !(
        [
          OrderStatus.PENDING,
          OrderStatus.PAID,
          OrderStatus.PROCESSING,
        ] as OrderStatus[]
      ).includes(currentStatus)
    ) {
      throw new Error(`Order cannot be cancelled from ${order.status}`);
    }

    const claimed = await transaction.order.updateMany({
      where: { id: orderId, status: currentStatus },
      data: { status: OrderStatus.CANCELLED },
    });
    if (claimed.count === 0) throw new Error("Order status changed");

    await restoreOrderInventory(transaction, order.orderItems);

    return transaction.order.findUniqueOrThrow({ where: { id: orderId } });
  });
};
