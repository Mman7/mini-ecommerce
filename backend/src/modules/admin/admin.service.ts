import * as orderService from "../order/order.service.ts";
import * as inventoryService from "../inventory/inventory.service.ts";
import * as categoryService from "../category/category.service.ts";
import * as productService from "../product/product.service.ts";
import * as userService from "../user/user.service.ts";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";

const revenueStatuses = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
] as const;

type OverviewRange = { from: Date; to: Date };

type PageQuery = { page: number; limit: number };

const productInclude = {
  productImages: { orderBy: { sortOrder: "asc" as const } },
  category: { select: { categoryId: true, name: true } },
  inventory: { select: { stock: true, reorderAt: true } },
};

const serializeDate = (value: Date) => value.toISOString();

export const getAdminProducts = async ({
  page,
  limit,
  search,
  categoryId,
  status,
  stock,
  sortBy,
  sortOrder,
}: PageQuery & {
  search?: string | undefined;
  categoryId?: number | undefined;
  status?: "active" | "inactive" | undefined;
  stock?: "in" | "low" | "out" | undefined;
  sortBy?: "name" | "price" | "stock" | "createdAt" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}) => {
  const inventoryFilter =
    stock === "out"
      ? { stock: { equals: 0 } }
      : stock === "in"
        ? { stock: { gt: 0 } }
        : stock === "low"
          ? { stock: { gt: 0, lte: 10 } }
          : undefined;
  const where = {
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(status !== undefined ? { isActive: status === "active" } : {}),
    ...(inventoryFilter !== undefined ? { inventory: inventoryFilter } : {}),
  };
  const orderBy =
    sortBy === "stock"
      ? { inventory: { stock: sortOrder ?? "desc" } }
      : { [sortBy ?? "createdAt"]: sortOrder ?? "desc" };
  const [items, total, allCount, activeCount, outOfStockCount, lowStockCount] =
    await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { inventory: { stock: { equals: 0 } } } }),
      prisma.product.count({
        where: { inventory: { stock: { gt: 0, lte: 10 } } },
      }),
    ]);
  return {
    items: items.map((product) => ({
      ...product,
      price: Number(product.price),
      createdAt: serializeDate(product.createdAt),
      updatedAt: serializeDate(product.updatedAt),
      productImages: product.productImages.map((image) => ({
        ...image,
        createdAt: serializeDate(image.createdAt),
        updatedAt: serializeDate(image.updatedAt),
      })),
      stock: product.inventory?.stock ?? 0,
    })),
    statistics: {
      all: allCount,
      active: activeCount,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
    },
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getAdminProduct = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: { productId },
    include: productInclude,
  });
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    createdAt: serializeDate(product.createdAt),
    updatedAt: serializeDate(product.updatedAt),
    productImages: product.productImages.map((image) => ({
      ...image,
      createdAt: serializeDate(image.createdAt),
      updatedAt: serializeDate(image.updatedAt),
    })),
    stock: product.inventory?.stock ?? 0,
  };
};

export const getAdminCategories = async ({
  page,
  limit,
  search,
  status,
  sortBy,
  sortOrder,
}: PageQuery & {
  search?: string | undefined;
  status?: "active" | "inactive" | undefined;
  sortBy?: "name" | "createdAt" | "updatedAt" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}) => {
  return categoryService.getCategoriesForAdmin({
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
  });
};

export const getAdminCategory = async (categoryId: number) => {
  return categoryService.getCategoryForAdmin(categoryId);
};

export const getAdminOrders = async ({
  page,
  limit,
  search,
  status,
  from,
  to,
  sortBy,
  sortOrder,
}: PageQuery & {
  search?: string | undefined;
  status?: OrderStatus | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
  sortBy?: "createdAt" | "total" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}) => {
  return orderService.getOrdersForAdmin({
    page,
    limit,
    search,
    status,
    from,
    to,
    sortBy,
    sortOrder,
  });
};

export const getAdminOrder = async (orderId: string) => {
  return orderService.getOrderForAdmin(orderId);
};

export const updateAdminOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  return orderService.updateOrderStatusByAdmin(orderId, status);
};

export const cancelAdminOrder = async (orderId: string) => {
  return orderService.cancelOrderByAdmin(orderId);
};

export const getTotalOrders = async () => {
  return orderService.getTotalOrders();
};

export const getTotalRevenue = async () => {
  return orderService.getTotalRevenue();
};

export const getOrdersByUserId = async (userId: string) => {
  return orderService.getOrdersByUser(userId);
};

export const getTotalCategory = async () => {
  const totalCategories = await categoryService.getAllCategories();
  return totalCategories.length;
};

export const getTotalInventory = async () => {
  const totalInventory = await inventoryService.getTotalInventory();
  return totalInventory.length;
};

export const getTotalProducts = async () => {
  const totalProducts = await productService.getTotalProducts();
  return totalProducts;
};

export const getTotalUsers = async () => {
  const totalUsers = await userService.getTotalUsers();
  return totalUsers;
};

export const getTotalActiveUsers = async () => {
  const totalActiveUsers = await userService.getTotalActiveUsers();
  return totalActiveUsers;
};

export const getOverview = async ({ from, to }: OverviewRange) => {
  // Revenue metrics include only orders that have reached a paid or fulfillment state.
  const orderWhere = {
    createdAt: { gte: from, lt: to },
    status: { in: [...revenueStatuses] },
  };
  // Compare the selected range with the immediately preceding range of equal length.
  const rangeDuration = to.getTime() - from.getTime();
  const previousFrom = new Date(from.getTime() - rangeDuration);
  const previousTo = from;
  // These queries are independent, so fetch the dashboard data in parallel.
  const [orders, customers, lowStock, statusRows, cohortUsers] =
    await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        orderBy: { createdAt: "desc" },
        take: 1000,
        include: {
          user: { select: { name: true, email: true } },
          orderItems: {
            include: {
              product: {
                select: {
                  productId: true,
                  name: true,
                  price: true,
                  category: { select: { categoryId: true, name: true } },
                  productImages: {
                    where: { isThumbnail: true },
                    take: 1,
                    select: { url: true, altText: true },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.user.count({ where: { createdAt: { gte: from, lt: to } } }),
      prisma.product.findMany({
        where: { isActive: true, inventory: { isNot: null } },
        orderBy: { inventory: { stock: "asc" } },
        take: 8,
        select: {
          productId: true,
          name: true,
          inventory: { select: { stock: true, reorderAt: true } },
          productImages: {
            where: { isThumbnail: true },
            take: 1,
            select: { url: true, altText: true },
          },
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: from, lt: to } },
        select: { status: true },
      }),
      prisma.user.findMany({
        where: {
          role: "USER",
          orders: {
            some: {
              createdAt: { gte: from, lt: to },
              status: { in: [...revenueStatuses] },
            },
          },
        },
        select: {
          orders: {
            where: { status: { in: [...revenueStatuses] } },
            select: { createdAt: true, total: true },
          },
        },
      }),
    ]);

  const productSales = new Map<
    number,
    {
      productId: number;
      name: string;
      price: number;
      sold: number;
      revenue: number;
      orderCount: number;
      image: { url: string; altText: string | null } | null;
    }
  >();
  const revenueByDate = new Map<string, number>();
  const ordersByDate = new Map<string, number>();
  const categorySales = new Map<
    number,
    { categoryId: number; name: string; revenue: number }
  >();

  // Build all chart and product aggregates from the same filtered order set.
  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10);
    revenueByDate.set(
      date,
      (revenueByDate.get(date) ?? 0) + Number(order.total),
    );
    ordersByDate.set(date, (ordersByDate.get(date) ?? 0) + 1);
    for (const item of order.orderItems) {
      const current = productSales.get(item.productId);
      productSales.set(item.productId, {
        productId: item.productId,
        name: item.product.name,
        price: Number(item.product.price),
        sold: (current?.sold ?? 0) + item.quantity,
        revenue: (current?.revenue ?? 0) + Number(item.price) * item.quantity,
        // Count orders containing the product, rather than counting individual units.
        orderCount: (current?.orderCount ?? 0) + 1,
        image: item.product.productImages[0] ?? null,
      });
      if (item.product.category) {
        const currentCategory = categorySales.get(
          item.product.category.categoryId,
        );
        categorySales.set(item.product.category.categoryId, {
          categoryId: item.product.category.categoryId,
          name: item.product.category.name,
          revenue:
            (currentCategory?.revenue ?? 0) +
            Number(item.price) * item.quantity,
        });
      }
    }
  }

  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const startDate = new Date(
    `${from.toISOString().slice(0, 10)}T00:00:00.000Z`,
  );
  const endDate = new Date(`${to.toISOString().slice(0, 10)}T00:00:00.000Z`);
  const dayCount = Math.max(
    1,
    Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1,
  );
  // Include zero-value days so the frontend chart keeps a continuous timeline.
  const revenueTrend = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(endDate);
    date.setUTCDate(endDate.getUTCDate() - (dayCount - 1 - index));
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      amount: revenueByDate.get(dateKey) ?? 0,
      orderCount: ordersByDate.get(dateKey) ?? 0,
    };
  });

  // Keep the denominator non-zero when the selected period has no orders.
  const fulfillmentTotal = statusRows.length || 1;
  const fulfillmentBreakdown = Object.values(OrderStatus).map((status) => ({
    status,
    count: statusRows.filter((order) => order.status === status).length,
    percentage:
      (statusRows.filter((order) => order.status === status).length /
        fulfillmentTotal) *
      100,
  }));
  // Cohort users are customers with at least one qualifying order in this range.
  const rangeCustomers = cohortUsers.length;
  const repeatCustomers = cohortUsers.filter(
    (user) => user.orders.length > 1,
  ).length;
  const newCustomers = cohortUsers.filter((user) => {
    const firstOrder = user.orders.reduce<Date | null>(
      (earliest, order) =>
        !earliest || order.createdAt < earliest ? order.createdAt : earliest,
      null,
    );
    return firstOrder ? firstOrder >= from && firstOrder < to : false;
  }).length;
  const cohortRevenue = cohortUsers.reduce(
    (sum, user) =>
      sum +
      user.orders.reduce((userSum, order) => userSum + Number(order.total), 0),
    0,
  );
  const categoryRevenue = [...categorySales.values()]
    .sort((left, right) => right.revenue - left.revenue)
    .map((category) => ({
      ...category,
      percentage: revenue ? (category.revenue / revenue) * 100 : 0,
    }));
  // Fetch comparison revenue and catalog health after the range aggregates are built.
  const [previousOrders, totalActiveProducts, inStockProducts] =
    await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: previousFrom, lt: previousTo },
          status: { in: [...revenueStatuses] },
        },
        select: { total: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: { isActive: true, inventory: { stock: { gt: 0 } } },
      }),
    ]);
  const previousRevenue = previousOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return {
    summary: {
      revenue,
      orders: orders.length,
      customers,
      averageOrderValue: orders.length ? revenue / orders.length : 0,
    },
    previousSummary: {
      revenue: previousRevenue,
      orders: previousOrders.length,
      averageOrderValue: previousOrders.length
        ? previousRevenue / previousOrders.length
        : 0,
    },
    catalog: { totalActiveProducts, inStockProducts },
    revenueTrend,
    fulfillmentBreakdown,
    categoryRevenue,
    cohortMetrics: {
      repeatRate: rangeCustomers ? (repeatCustomers / rangeCustomers) * 100 : 0,
      newCustomerRate: rangeCustomers
        ? (newCustomers / rangeCustomers) * 100
        : 0,
      estimatedClv: rangeCustomers ? cohortRevenue / rangeCustomers : 0,
    },
    topProducts: [...productSales.values()].sort(
      (left, right) => right.sold - left.sold,
    ),
    recentOrders: orders.slice(0, 8).map((order) => ({
      id: order.id,
      customer: order.user.name,
      date: order.createdAt,
      total: Number(order.total),
      status: order.status,
    })),
    lowStock: lowStock
      .filter(
        (product) =>
          product.inventory &&
          product.inventory.stock <= (product.inventory.reorderAt ?? 5),
      )
      .map((product) => ({
        productId: product.productId,
        name: product.name,
        stock: product.inventory?.stock ?? 0,
        reorderAt: product.inventory?.reorderAt ?? 5,
        image: product.productImages[0] ?? null,
      })),
  };
};
