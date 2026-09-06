import * as orderService from "../order/order.service.ts";
import * as inventoryService from "../inventory/inventory.service.ts";
import * as categoryService from "../category/category.service.ts";
import * as productService from "../product/product.service.ts";
import * as userService from "../user/user.service.ts";
import { prisma } from "../../utils/prisma.ts";

const revenueStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

type OverviewRange = { from: Date; to: Date };

export const getTotalOrders = async () => {
  const allOrders = await orderService.getAllOrders();
  return allOrders;
};

export const getTotalRevenue = async () => {
  const allOrders = await orderService.getAllOrders();
  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );
  return totalRevenue;
};

export const getOrdersByUserId = async (userId: string) => {
  const allOrders = await orderService.getAllOrders();
  const userOrders = allOrders.filter((order) => order.userId === userId);
  return userOrders;
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
  const orderWhere = {
    createdAt: { gte: from, lt: to },
    status: { in: [...revenueStatuses] },
  };
  const [orders, customers, lowStock] = await Promise.all([
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
  ]);

  const productSales = new Map<
    number,
    {
      productId: number;
      name: string;
      price: number;
      sold: number;
      image: { url: string; altText: string | null } | null;
    }
  >();
  const revenueByDate = new Map<string, number>();

  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10);
    revenueByDate.set(
      date,
      (revenueByDate.get(date) ?? 0) + Number(order.total),
    );
    for (const item of order.orderItems) {
      const current = productSales.get(item.productId);
      productSales.set(item.productId, {
        productId: item.productId,
        name: item.product.name,
        price: Number(item.product.price),
        sold: (current?.sold ?? 0) + item.quantity,
        image: item.product.productImages[0] ?? null,
      });
    }
  }

  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  return {
    summary: {
      revenue,
      orders: orders.length,
      customers,
      averageOrderValue: orders.length ? revenue / orders.length : 0,
    },
    revenueTrend: [...revenueByDate.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, amount]) => ({ date, amount })),
    topProducts: [...productSales.values()]
      .sort((left, right) => right.sold - left.sold)
      .slice(0, 5),
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
