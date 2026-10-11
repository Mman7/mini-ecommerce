import Stripe from "stripe";
import { stripe } from "../../configs/configs.js";
import { prisma } from "../../utils/prisma.ts";
import { OrderStatus } from "../../enums/order_status.ts";
import * as orderService from "../order/order.service.ts";

const shippingCost = 500;
const currency = (process.env.STRIPE_CURRENCY ?? "jpy").toLowerCase();
const reservationDurationMs = 30 * 60 * 1000;
const zeroDecimalCurrencies = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

const currencyFactor = (code: string) =>
  zeroDecimalCurrencies.has(code) ? 1 : 100;
const amountInMinorUnits = (amount: number, code: string) =>
  Math.round(amount * currencyFactor(code));

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
  await releaseExpiredReservations();

  const existingReservation = await prisma.checkoutReservation.findUnique({
    where: { activeUserId: userId },
  });
  if (existingReservation) {
    if (!existingReservation.paymentIntentId) {
      throw new Error(
        "A checkout is already being prepared. Please retry shortly.",
      );
    }
    const existingIntent = await stripe.paymentIntents.retrieve(
      existingReservation.paymentIntentId,
    );
    if (existingIntent.status === "canceled") {
      await releaseReservation(existingReservation.id);
    } else if (existingIntent.status === "succeeded") {
      await fulfillPaymentIntent(existingIntent);
      throw new Error("Payment already completed. Please view your orders.");
    } else {
      return {
        clientSecret: existingIntent.client_secret,
        paymentIntentId: existingIntent.id,
        amount: Number(existingReservation.amount),
        currency: existingReservation.currency,
      };
    }
  }

  const expiresAt = new Date(Date.now() + reservationDurationMs);
  const reservation = await prisma.$transaction(async (transaction) => {
    const address = await transaction.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new Error("Delivery address not found");

    const user = await transaction.user.findUnique({
      where: { userId },
      select: { name: true },
    });
    if (!user) throw new Error("Account not found");

    const cart = await transaction.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: true,
                productImages: {
                  where: { isThumbnail: true },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });
    if (!cart?.items.length) throw new Error("Your cart is empty");

    const quantities = new Map<number, number>();
    for (const item of cart.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }

    const products = new Map(
      cart.items.map((item) => [item.productId, item.product]),
    );
    const reservationItems = [...quantities.entries()].map(
      ([productId, quantity]) => {
        const product = products.get(productId);
        if (!product || !product.isActive) {
          throw new Error(`Product ${productId} is inactive or unavailable`);
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error(`Invalid quantity for product ${productId}`);
        }
        return {
          productId,
          quantity,
          productName: product.name,
          productSlug: product.slug,
          productImageUrl: product.productImages[0]?.url ?? null,
          unitPrice: product.price,
        };
      },
    );

    const subtotal = reservationItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
    const amount =
      amountInMinorUnits(subtotal + shippingCost, currency) /
      currencyFactor(currency);

    for (const item of reservationItems) {
      const reserved = await transaction.inventory.updateMany({
        where: { productId: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (reserved.count !== 1) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    return transaction.checkoutReservation.create({
      data: {
        userId,
        activeUserId: userId,
        amount,
        currency,
        expiresAt,
        deliveryName: user.name,
        deliveryAddressLine1: address.addressLine,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryPostcode: address.postalCode,
        deliveryCountry: address.country,
        items: { create: reservationItems },
      },
    });
  });

  let paymentIntent: Stripe.PaymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInMinorUnits(Number(reservation.amount), currency),
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: { userId, reservationId: reservation.id },
      },
      { idempotencyKey: `checkout-${reservation.id}` },
    );
    await prisma.checkoutReservation.update({
      where: { id: reservation.id },
      data: { paymentIntentId: paymentIntent.id },
    });
  } catch (error) {
    await releaseReservation(reservation.id);
    throw error;
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: Number(reservation.amount),
    currency,
  };
};

export const fulfillPaymentIntent = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  const { userId, reservationId } = paymentIntent.metadata;
  if (!userId || !reservationId || paymentIntent.status !== "succeeded") {
    throw new Error("PaymentIntent metadata is incomplete");
  }
  const reservation = await prisma.checkoutReservation.findUnique({
    where: { id: reservationId },
  });
  if (
    !reservation ||
    reservation.userId !== userId ||
    reservation.paymentIntentId !== paymentIntent.id ||
    reservation.currency !== paymentIntent.currency ||
    amountInMinorUnits(Number(reservation.amount), reservation.currency) !==
      paymentIntent.amount ||
    paymentIntent.amount_received !== paymentIntent.amount
  ) {
    throw new Error("PaymentIntent does not match its checkout reservation");
  }
  return orderService.fulfillReservedOrder(reservation.id, paymentIntent.id);
};

export const releaseReservation = async (reservationId: string) =>
  prisma.$transaction(async (transaction) => {
    const reservation = await transaction.checkoutReservation.findUnique({
      where: { id: reservationId },
      include: { items: true },
    });
    if (!reservation || reservation.status !== "RESERVED") return false;

    const released = await transaction.checkoutReservation.updateMany({
      where: { id: reservationId, status: "RESERVED" },
      data: { status: "RELEASED", activeUserId: null },
    });
    if (released.count !== 1) return false;

    for (const item of reservation.items) {
      await transaction.inventory.update({
        where: { productId: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
    return true;
  });

export const releaseExpiredReservations = async () => {
  if (!process.env.STRIPE_SECRET_KEY) return;
  const expired = await prisma.checkoutReservation.findMany({
    where: { status: "RESERVED", expiresAt: { lte: new Date() } },
    include: { items: true },
    take: 100,
  });

  for (const reservation of expired) {
    if (reservation.paymentIntentId) {
      try {
        let intent = await stripe.paymentIntents.retrieve(
          reservation.paymentIntentId,
        );
        if (intent.status === "succeeded") {
          await fulfillPaymentIntent(intent);
          continue;
        }
        if (intent.status !== "canceled") {
          intent = await stripe.paymentIntents.cancel(intent.id);
        }
        if (intent.status !== "canceled") {
          throw new Error("PaymentIntent cannot be canceled yet");
        }
      } catch {
        await prisma.checkoutReservation.updateMany({
          where: { id: reservation.id, status: "RESERVED" },
          data: { expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
        });
        continue;
      }
    }
    await releaseReservation(reservation.id);
  }
};

export const releaseCanceledPaymentIntent = async (
  paymentIntent: Stripe.PaymentIntent,
) => {
  const reservation = await prisma.checkoutReservation.findFirst({
    where: { paymentIntentId: paymentIntent.id, status: "RESERVED" },
    select: { id: true },
  });
  if (reservation) await releaseReservation(reservation.id);
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
  if (paymentIntent.metadata.userId !== userId) {
    throw new Error("Payment not found");
  }

  let order = await orderService.getOrderByPaymentIntentId(paymentIntentId);
  if (order && order.userId !== userId) throw new Error("Payment not found");

  // This fallback supports local development when Stripe CLI forwarding is not running.
  // In production, the normal path is the payment_intent.succeeded webhook.
  if (!order && paymentIntent.status === "succeeded") {
    order = await fulfillPaymentIntent(paymentIntent);
  }
  if (paymentIntent.status === "canceled") {
    await releaseCanceledPaymentIntent(paymentIntent);
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
