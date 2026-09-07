import { Router } from "express";
import * as orderController from "./order.controller.ts";
import { validateCreateOrder, validateOrderId } from "./order.validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const orderRouter = Router();

orderRouter.post(
  "/",
  authMiddleware,
  validateCreateOrder,
  orderController.createOrder,
);
orderRouter.get("/mine", authMiddleware, orderController.getMyOrders);
orderRouter.get(
  "/:orderId",
  authMiddleware,
  validateOrderId,
  orderController.getOrderById,
);
orderRouter.post(
  "/:orderId/cancel",
  authMiddleware,
  validateOrderId,
  orderController.cancelOrder,
);

export default orderRouter;
