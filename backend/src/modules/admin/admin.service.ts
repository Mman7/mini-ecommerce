import * as orderService from "../order/order.service.ts";
import * as inventoryService from "../inventory/inventory.service.ts";
import * as categoryService from "../category/category.service.ts";
import * as productService from "../product/product.service.ts";
import * as userService from "../user/user.service.ts";

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
