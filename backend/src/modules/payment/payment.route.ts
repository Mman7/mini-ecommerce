import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.ts";
import * as paymentController from "./payment.controller.ts";

const paymentRouter = Router();
// Payment routes for creating payment intents and checking payment status.
paymentRouter.post(
  "/intent",
  authMiddleware,
  paymentController.createPaymentIntent,
);
// Payment route for retrieving the status of a specific payment intent.
paymentRouter.get(
  "/:paymentIntentId",
  authMiddleware,
  paymentController.getPaymentStatus,
);

export default paymentRouter;
