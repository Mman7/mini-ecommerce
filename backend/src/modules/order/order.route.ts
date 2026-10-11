import { Router } from "express";
import * as orderController from "./order.controller.ts";
import { validateOrderId } from "./order.validator.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const orderRouter = Router();

orderRouter.get("/mine", authMiddleware, orderController.getMyOrders);
orderRouter.get(
  "/:orderId",
  authMiddleware,
  validateOrderId,
  orderController.getOrderById,
);
orderRouter.post(
  "/:orderId/cancellation-request",
  authMiddleware,
  validateOrderId,
  orderController.requestOrderCancellation,
);

export default orderRouter;
