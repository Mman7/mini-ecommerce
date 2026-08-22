import type { Request, Response } from "express";
import * as adminService from "../admin/admin.service.ts";
import * as categoryController from "../category/category.controller.ts";
import * as inventoryController from "../inventory/inventory.controller.ts";
import * as orderController from "../order/order.controller.ts";
import * as productController from "../product/product.controller.ts";
import * as userController from "../user/user.controller.ts";

export const getTotalOrders = async (req: Request, res: Response) => {
  try {
    const totalOrders = await adminService.getTotalOrders();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve total orders", error });
  }
};

export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await adminService.getTotalRevenue();
    res.status(200).json({ totalRevenue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve total revenue", error });
  }
};

export const createProduct = productController.createProduct;
export const updateProduct = productController.updateProduct;
export const updateProductImage = productController.updateProductImage;
export const deleteProduct = productController.deleteProduct;
export const createCategory = categoryController.createCategory;
export const updateCategory = categoryController.updateCategory;
export const deleteCategory = categoryController.deleteCategory;
export const deleteCategoryProducts = categoryController.deleteCategoryProducts;
export const addProductToCategory = categoryController.addProductToCategory;
export const getAllOrders = orderController.getAllOrders;
export const getAllUsers = userController.getAllUsers;
export const activeUser = userController.activeUserController;
export const inactiveUser = userController.inactiveUserController;
export const createStock = inventoryController.createStock;
export const updateStock = inventoryController.updateStock;
