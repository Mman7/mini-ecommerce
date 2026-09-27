import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import * as paymentController from "./payment.controller.ts";

const paymentRouter = Router();
paymentRouter.post(
  "/intent",
  authMiddleware,
  paymentController.createPaymentIntent,
);
paymentRouter.get(
  "/:paymentIntentId",
  authMiddleware,
  paymentController.getPaymentStatus,
);

export default paymentRouter;
