import Stripe from "stripe";
import { stripe } from "../../configs/configs.js";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";
import * as orderService from "../order/order.service.ts";
import type { OrderItemInput } from "../../types/order.js";

const shippingCost = 500;
const currency = process.env.STRIPE_CURRENCY ?? "jpy";

const requireStripeKey = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
};

// Creates a payment intent for the authenticated user's current cart and specified delivery address.
// this will create a PaymentIntent on Stripe and return the client secret
// everytime the client checkout process is initiated.
export const createPaymentIntent = async (
  userId: string,
  addressId: number,
) => {
  requireStripeKey();

  // Re-read the cart and prices on the server so the client cannot change the payable amount.
  const [cart, address] = await Promise.all([
    prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    }),
    prisma.userAddress.findFirst({ where: { id: addressId, userId } }),
  ]);

  if (!address) throw new Error("Delivery address not found");
  if (!cart?.items.length) throw new Error("Your cart is empty");
  if (cart.items.some((item) => !item.product.isActive)) {
    throw new Error("Your cart contains an inactive product");
  }

  // Prepare the order items for the payment metadata.
  const items: OrderItemInput[] = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
  // Calculate the total amount including shipping cost.
  const amount =
    cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    ) + shippingCost;

  // Store the order context on Stripe so the webhook can fulfill the payment without trusting the browser.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId,
      addressId: String(addressId),
      items: JSON.stringify(items),
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount,
    currency,
  };
};

export const fulfillPaymentIntent = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  // PaymentIntent metadata is the link between Stripe's payment and our order.
  const { userId, addressId, items } = paymentIntent.metadata;
  if (!userId || !addressId || !items) {
    throw new Error("PaymentIntent metadata is incomplete");
  }

  // The order service uses the PaymentIntent ID as a unique idempotency key.
  return orderService.createOrderFromPaymentIntent({
    paymentIntentId: paymentIntent.id,
    userId,
    addressId: Number(addressId),
    items: JSON.parse(items) as OrderItemInput[],
  });
};

export const markRefundCompleted = async (refund: Stripe.Refund) => {
  if (refund.status !== "succeeded") return null;

  const paymentIntentId =
    typeof refund.payment_intent === "string"
      ? refund.payment_intent
      : refund.payment_intent?.id;
  if (!paymentIntentId) return null;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  });
  const charge =
    typeof paymentIntent.latest_charge === "string"
      ? await stripe.charges.retrieve(paymentIntent.latest_charge)
      : paymentIntent.latest_charge;
  if (!charge || charge.amount_refunded < charge.amount) return null;

  return orderService.markOrderRefundedByPaymentIntent(paymentIntentId);
};

export const refundOrder = async (orderId: string) => {
  requireStripeKey();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, stripePaymentIntentId: true },
  });
  if (!order) throw new Error("Order not found");
  if (order.status === OrderStatus.REFUNDED) {
    return {
      status: "succeeded" as const,
      refundId: null,
      alreadyRefunded: true,
    };
  }
  if (order.status === OrderStatus.PENDING) {
    throw new Error("A pending order cannot be refunded");
  }
  if (!order.stripePaymentIntentId) {
    throw new Error("This order has no Stripe payment to refund");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    order.stripePaymentIntentId,
    { expand: ["latest_charge"] },
  );
  const charge =
    typeof paymentIntent.latest_charge === "string"
      ? await stripe.charges.retrieve(paymentIntent.latest_charge)
      : paymentIntent.latest_charge;
  if (!charge) throw new Error("No captured Stripe charge was found");

  const remainingAmount = charge.amount - charge.amount_refunded;
  if (remainingAmount <= 0) {
    await orderService.markOrderRefundedByPaymentIntent(
      order.stripePaymentIntentId,
    );
    return {
      status: "succeeded" as const,
      refundId: null,
      alreadyRefunded: true,
    };
  }

  const refund = await stripe.refunds.create(
    {
      payment_intent: order.stripePaymentIntentId,
      amount: remainingAmount,
    },
    { idempotencyKey: `order-full-refund-${order.id}` },
  );

  if (refund.status === "succeeded") {
    await orderService.markOrderRefundedByPaymentIntent(
      order.stripePaymentIntentId,
    );
  } else if (refund.status === "failed" || refund.status === "canceled") {
    throw new Error(`Stripe refund ${refund.status}`);
  }

  return { status: refund.status, refundId: refund.id, alreadyRefunded: false };
};

export const getPaymentStatus = async (
  userId: string,
  paymentIntentId: string,
) => {
  requireStripeKey();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  let order = await orderService.getOrderByPaymentIntentId(paymentIntentId);
  if (order && order.userId !== userId) throw new Error("Payment not found");

  // This fallback supports local development when Stripe CLI forwarding is not running.
  // In production, the normal path is the payment_intent.succeeded webhook.
  if (!order && paymentIntent.status === "succeeded") {
    order = await fulfillPaymentIntent(paymentIntent);
  }

  return { status: paymentIntent.status, order };
};

export const constructWebhookEvent = (payload: Buffer, signature: string) => {
  requireStripeKey();
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  // Stripe signatures must be verified against the untouched request body.
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
};
