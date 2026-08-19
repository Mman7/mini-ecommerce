import { Router } from "express";
import * as orderController from "./order.controller.ts";
import { authMiddleware } from "../../middleware/auth.middleware.ts";

const orderRouter = Router();

orderRouter.post("/", authMiddleware, orderController.createOrder);
orderRouter.get("/:orderId", authMiddleware, orderController.getOrderById);
orderRouter.post(
  "/:orderId/cancel",
  authMiddleware,
  orderController.cancelOrder,
);

export default orderRouter;
