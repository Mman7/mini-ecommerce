import { Router } from "express";

const CartRouter = Router();

import * as CartController from "./cart.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

CartRouter.get("/", authMiddleware, CartController.getCart);
CartRouter.post("/", authMiddleware, CartController.addToCart);
CartRouter.patch("/:itemId", authMiddleware, CartController.updateCartItem);
CartRouter.delete("/:itemId", authMiddleware, CartController.deleteCartItem);
CartRouter.delete("/", authMiddleware, CartController.clearCart);

export default CartRouter;
