import type { Request, Response } from "express";
import * as CartService from "./cart.service.ts";
import type { CartItem } from "../../types/cart.d.ts";
import * as ProductService from "../product/product.service.ts";

export const getCart = async (req: Request, res: Response) => {
  const { user } = req;

  if (user === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cart = (await CartService.getCartItems(user.userId)) ?? [];
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { user } = req;
  if (user === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { item }: { item: CartItem } = req.body;
    if (!item) {
      return res.status(400).json({ message: "Item is required" });
    }
    // check product exits
    const product = await ProductService.getProductById(item.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if the item already exists in the cart
    const existingItem = await CartService.getCartItem(
      user.userId,
      item.productId,
    );
    // if the item already exists, add the quantity to the existing item instead of creating a new one
    if (existingItem) {
      const updatedCart = await CartService.updateCartItem({
        userId: user.userId,
        itemId: existingItem.id,
        quantity: existingItem.quantity + item.quantity,
      });
      return res.status(200).json(updatedCart);
    }

    const updatedCart = await CartService.addCartItem(user.userId, item);
    return res
      .status(200)
      .json({ msg: "Item added to cart", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { itemId } = req.params;
  const { quantity } = req.body;

  if (typeof itemId !== "string") {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  if (quantity === undefined) {
    return res.status(400).json({ message: "Quantity is required" });
  }
  // check if the item exists in the cart
  const existingItem = await CartService.getCartItem(
    user.userId,
    parseInt(itemId),
  );
  if (!existingItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  try {
    const updatedCart = await CartService.updateCartItem({
      userId: user.userId,
      itemId,
      quantity,
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { itemId } = req.params;

  if (typeof itemId !== "string") {
    return res.status(400).json({ message: "Invalid item ID" });
  }

  try {
    // check if the item exists in the cart
    const existingItem = await CartService.getCartItem(
      user.userId,
      parseInt(itemId),
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const updatedCart = await CartService.deleteCartItem({
      userId: user.userId,
      itemId,
    });

    return res
      .status(200)
      .json({ message: "Item deleted successfully", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedCart = await CartService.clearCart(user.userId);
    return res
      .status(200)
      .json({ message: "Cart cleared successfully", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
