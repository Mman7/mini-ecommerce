import Stripe from "stripe";
import { prisma } from "../../utils/prisma.ts";
import * as orderService from "../order/order.service.ts";
import type { OrderItemInput } from "../../types/order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const shippingCost = 500;
const currency = process.env.STRIPE_CURRENCY ?? "jpy";

const requireStripeKey = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
};

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

  const items: OrderItemInput[] = cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
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
