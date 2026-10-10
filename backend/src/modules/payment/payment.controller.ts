import type { Request, Response } from "express";
import Stripe from "stripe";
import * as paymentService from "./payment.service.ts";

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  const addressId = Number(req.body?.addressId);
  if (!Number.isInteger(addressId) || addressId < 1) {
    return res
      .status(400)
      .json({ message: "A valid delivery address is required" });
  }
  try {
    // The service calculates the amount from the authenticated user's current cart.
    return res
      .status(201)
      .json(await paymentService.createPaymentIntent(userId, addressId));
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Unable to create payment",
    });
  }
};

// for frontend to check the status of a specific payment intent
export const getPaymentStatus = async (req: Request, res: Response) => {
  const { userId } = req.user as { userId: string };
  try {
    return res
      .status(200)
      .json(
        await paymentService.getPaymentStatus(
          userId,
          String(req.params.paymentIntentId),
        ),
      );
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Payment not found",
    });
  }
};

// Stripe webhook endpoint for handling payment events such as payment success and refunds.
export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.header("stripe-signature");
    // This route is mounted before express.json() so req.body remains a Buffer for signature verification.
    if (!signature || !Buffer.isBuffer(req.body)) {
      return res.status(400).send("Invalid Stripe webhook request");
    }
    const event = paymentService.constructWebhookEvent(req.body, signature);
    if (event.type === "payment_intent.succeeded") {
      // Fulfillment is idempotent, so Stripe retries cannot create duplicate orders.
      await paymentService.fulfillPaymentIntent(
        event.data.object as Stripe.PaymentIntent,
      );
    } else if (
      event.type === "refund.created" ||
      event.type === "refund.updated"
    ) {
      await paymentService.markRefundCompleted(
        event.data.object as Stripe.Refund,
      );
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error("Stripe webhook error", error);
    return res.status(400).send("Webhook Error");
  }
};
