import { Router } from "express";
import * as orderController from "./order.controller.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const orderRouter = Router();

// add admin authentication middleware here
orderRouter.post("/", authMiddleware, orderController.createOrder);
orderRouter.get("/:orderId", authMiddleware, orderController.getOrderById);
orderRouter.get("/", authMiddleware, orderController.getAllOrders);
orderRouter.post(
  "/:orderId/cancel",
  authMiddleware,
  orderController.cancelOrder,
);

export default orderRouter;
