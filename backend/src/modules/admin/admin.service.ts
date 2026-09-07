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
