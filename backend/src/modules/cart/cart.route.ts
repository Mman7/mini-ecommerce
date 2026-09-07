import { Router } from "express";

const CartRouter = Router();

import * as CartController from "./cart.controller.ts";
import {
  validateCartItem,
  validateCartItemId,
  validateCartItemUpdate,
} from "./cart.validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

CartRouter.get("/", authMiddleware, CartController.getCart);
CartRouter.post(
  "/",
  authMiddleware,
  validateCartItem,
  CartController.addToCart,
);
CartRouter.patch(
  "/:itemId",
  authMiddleware,
  validateCartItemUpdate,
  CartController.updateCartItem,
);
CartRouter.delete(
  "/:itemId",
  authMiddleware,
  validateCartItemId,
  CartController.deleteCartItem,
);
CartRouter.delete("/", authMiddleware, CartController.clearCart);

export default CartRouter;
