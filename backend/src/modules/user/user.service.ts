import { prisma } from "../../utils/prisma.ts";
import type { UserUpdateInput } from "../../generated/prisma/models.ts";
import type {
  AuthUserData,
  SavedAddress,
} from "../../interfaces/user.interface.ts";

const customerOrderStatuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];
const VIP_ORDER_COUNT = 5;
const VIP_SPENDING = 500;

export type AdminCustomerQuery = {
  page: number;
  limit: number;
  search: string;
  status: "regular" | "vip" | "inactive";
  sort:
    | "newest"
    | "oldest"
    | "nameAsc"
    | "nameDesc"
    | "orders"
    | "spending"
    | "latestOrder";
  order: "asc" | "desc";
};

type CustomerMetrics = {
  orders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: "Regular" | "VIP" | "Inactive";
};

const getCustomerStatus = (
  isActive: boolean,
  metrics: Pick<CustomerMetrics, "orders" | "totalSpent">,
): CustomerMetrics["status"] => {
  if (!isActive) return "Inactive";
  return metrics.orders >= VIP_ORDER_COUNT || metrics.totalSpent >= VIP_SPENDING
    ? "VIP"
    : "Regular";
};

const serializeCustomer = (user: {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  orders: Array<{ total: unknown; createdAt: Date }>;
}) => {
  const metrics = {
    orders: user.orders.length,
    totalSpent: user.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    ),
    lastOrder: user.orders[0]?.createdAt.toISOString() ?? null,
  };
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    createdAt: user.createdAt.toISOString(),
    ...metrics,
    status: getCustomerStatus(user.isActive, metrics),
  };
};

export const getCustomersForAdmin = async ({
  page,
  limit,
  search,
  status,
  sort = "newest",
  order = "desc",
}: AdminCustomerQuery) => {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phoneNumber: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      userId: true,
      name: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
      orders: {
        where: { status: { in: customerOrderStatuses } },
        orderBy: { createdAt: "desc" },
        select: { total: true, createdAt: true },
      },
    },
  });

  const customers = users
    .map(serializeCustomer)
    .filter((customer) => !status || customer.status.toLowerCase() === status);
  const direction = order === "asc" ? 1 : -1;
  customers.sort((left, right) => {
    if (sort === "nameAsc" || sort === "nameDesc") {
      return (
        left.name.localeCompare(right.name) * (sort === "nameAsc" ? 1 : -1)
      );
    }
    if (sort === "orders") return (left.orders - right.orders) * direction;
    if (sort === "spending")
      return (left.totalSpent - right.totalSpent) * direction;
    if (sort === "latestOrder") {
      return (
        ((left.lastOrder ? Date.parse(left.lastOrder) : 0) -
          (right.lastOrder ? Date.parse(right.lastOrder) : 0)) *
        direction
      );
    }
    return (
      (Date.parse(left.createdAt) - Date.parse(right.createdAt)) * direction
    );
  });

  const total = customers.length;
  return {
    items: customers.slice((page - 1) * limit, page * limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getCustomerStatsForAdmin = async () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const [users, newThisMonth, newPreviousMonth] = await Promise.all([
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        isActive: true,
        createdAt: true,
        orders: {
          where: { status: { in: customerOrderStatuses } },
          select: { total: true },
        },
      },
    }),
    prisma.user.count({
      where: { role: "USER", createdAt: { gte: monthStart } },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: previousMonthStart, lt: monthStart },
      },
    }),
  ]);
  const customers = users.map((user) => {
    const orders = user.orders.length;
    const totalSpent = user.orders.reduce(
      (sum, item) => sum + Number(item.total),
      0,
    );
    return {
      status: getCustomerStatus(user.isActive, { orders, totalSpent }),
      orders,
    };
  });
  const total = customers.length;
  const repeat = customers.filter((customer) => customer.orders > 1).length;
  const vip = customers.filter((customer) => customer.status === "VIP").length;
  const growth = newPreviousMonth
    ? ((newThisMonth - newPreviousMonth) / newPreviousMonth) * 100
    : 0;
  return {
    total,
    newThisMonth,
    newGrowth: growth,
    repeat,
    repeatRate: total ? (repeat / total) * 100 : 0,
    vip,
    vipRate: total ? (vip / total) * 100 : 0,
  };
};

export const getCustomerForAdmin = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { userId, role: "USER" },
    select: {
      userId: true,
      name: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
      orders: {
        where: { status: { in: customerOrderStatuses } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          orderItems: { select: { quantity: true } },
        },
      },
    },
  });
  if (!user) return null;
  const customer = serializeCustomer(user);
  return {
    ...customer,
    averageOrderValue: customer.orders
      ? customer.totalSpent / customer.orders
      : 0,
    orderHistory: user.orders.map((order) => ({
      id: order.id,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    })),
  };
};

export const updateCustomerForAdmin = async (
  userId: string,
  updates: { name?: string; email?: string; phoneNumber?: string | null },
) => {
  const user = await prisma.user.update({ where: { userId }, data: updates });
  return getCustomerForAdmin(user.userId);
};

export const updateCustomerStatusForAdmin = async (
  userId: string,
  isActive: boolean,
) => {
  await prisma.user.update({ where: { userId }, data: { isActive } });
  return getCustomerForAdmin(userId);
};

export const getTotalUsers = async () => {
  const totalUsers = await prisma.user.count();
  return totalUsers;
};

// get user data by options
export const getUserData = async (accessTokenSub: string) => {
  // get data from database using prisma
  const user = await prisma.user.findUnique({
    where: { userId: accessTokenSub },
    select: {
      userId: true,
      name: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  if (!user) return null;

  return user as AuthUserData;
};

export const updateUserData = async (
  accessTokenSub: string,
  updatePayload: UserUpdateInput,
) => {
  const { deliveryAddress: _deliveryAddress, ...userData } = updatePayload;
  const user = await prisma.user.update({
    where: { userId: accessTokenSub },
    data: userData,
  });
  return user;
};

export const getAddresses = async (userId: string) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createAddress = async (
  userId: string,
  address: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
) => {
  if (!address.addressLine.trim()) throw new Error("Address line is required");
  await prisma.userAddress.create({
    data: {
      userId,
      addressLine: address.addressLine.trim(),
      city: address.city.trim(),
      state: address.state?.trim(),
      postalCode: address.postalCode.trim(),
      country: address.country.trim(),
    },
  });
  return getAddresses(userId);
};

export const updateAddress = async (
  userId: string,
  addressId: number,
  updates: Omit<SavedAddress, "id" | "userId" | "createdAt" | "updatedAt">,
) => {
  if (!updates.addressLine?.trim()) throw new Error("Address line is required");
  const existingAddress = await prisma.userAddress.findFirst({
    where: { id: addressId, userId },
  });

  if (!existingAddress) return null;

  await prisma.userAddress.update({
    where: { id: existingAddress.id },
    data: {
      addressLine: updates.addressLine.trim(),
      city: updates.city.trim(),
      state: updates.state?.trim(),
      postalCode: updates.postalCode.trim(),
      country: updates.country.trim(),
    },
  });

  return getAddresses(userId);
};

export const deleteAddress = async (userId: string, addressId: number) => {
  const result = await prisma.userAddress.deleteMany({
    where: { id: addressId, userId },
  });
  if (result.count === 0) return null;
  return getAddresses(userId);
};

export const deleteUserData = async (accessTokenSub: string) => {
  const user = await prisma.user.delete({
    where: { userId: accessTokenSub },
  });
  return user;
};

export const activeUser = async (userId: string) => {
  // update user status to active in the database using prisma
  const user = await prisma.user.update({
    where: { userId },
    data: { isActive: true },
  });
  return user;
};

export const inactiveUser = async (userId: string) => {
  // update user status to inactive in the database using prisma
  const user = await prisma.user.update({
    where: { userId },
    data: { isActive: false },
  });
  return user;
};

export const getTotalActiveUsers = async () => {
  const totalActiveUsers = await prisma.user.count({
    where: { isActive: true },
  });
  return totalActiveUsers;
};

export const getTotalInactiveUsers = async () => {
  const totalInactiveUsers = await prisma.user.count({
    where: { isActive: false },
  });
  return totalInactiveUsers;
};
