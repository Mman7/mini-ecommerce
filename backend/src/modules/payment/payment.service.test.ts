import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const mocks = vi.hoisted(() => ({
  findReservation: vi.fn(),
  fulfillReservedOrder: vi.fn(),
}));

vi.mock("../../utils/prisma.ts", () => ({
  prisma: {
    checkoutReservation: { findUnique: mocks.findReservation },
  },
}));

vi.mock("../order/order.service.ts", () => ({
  fulfillReservedOrder: mocks.fulfillReservedOrder,
}));

vi.mock("../../configs/configs.js", () => ({
  stripe: { paymentIntents: {} },
}));

import { fulfillPaymentIntent } from "./payment.service.ts";

const reservation = {
  id: "reservation-1",
  userId: "user-1",
  paymentIntentId: "pi-1",
  amount: 1250,
  currency: "usd",
};

const paymentIntent = {
  id: "pi-1",
  status: "succeeded",
  amount: 125000,
  amount_received: 125000,
  currency: "usd",
  metadata: { userId: "user-1", reservationId: "reservation-1" },
} as unknown as Stripe.PaymentIntent;

type PaymentIntentChanges = Partial<
  Pick<Stripe.PaymentIntent, "id" | "currency" | "amount_received">
> & { metadata?: Stripe.PaymentIntent["metadata"] };

const mismatches: Array<
  [string, PaymentIntentChanges, Partial<typeof reservation>?]
> = [
  [
    "owner",
    { metadata: { userId: "another-user", reservationId: "reservation-1" } },
  ],
  ["PaymentIntent ID", { id: "pi-another" }],
  ["currency", { currency: "eur" }],
  ["reserved amount", {}, { amount: 1260 }],
  ["amount received", { amount_received: 124000 }],
];

describe("fulfillPaymentIntent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findReservation.mockResolvedValue(reservation);
    mocks.fulfillReservedOrder.mockResolvedValue({ id: "order-1" });
  });

  it("fulfills a succeeded intent matching its reservation", async () => {
    await expect(fulfillPaymentIntent(paymentIntent)).resolves.toEqual({
      id: "order-1",
    });
    expect(mocks.fulfillReservedOrder).toHaveBeenCalledOnce();
    expect(mocks.fulfillReservedOrder).toHaveBeenCalledWith(
      "reservation-1",
      "pi-1",
    );
  });

  it.each(mismatches)(
    "rejects a PaymentIntent with a mismatched %s",
    async (_label, intentChanges, reservationChanges) => {
      if (reservationChanges) {
        mocks.findReservation.mockResolvedValue({
          ...reservation,
          ...reservationChanges,
        });
      }
      await expect(
        fulfillPaymentIntent({ ...paymentIntent, ...intentChanges }),
      ).rejects.toThrow(
        "PaymentIntent does not match its checkout reservation",
      );
      expect(mocks.fulfillReservedOrder).not.toHaveBeenCalled();
    },
  );

  it("does not fulfill an intent that has not succeeded", async () => {
    await expect(
      fulfillPaymentIntent({ ...paymentIntent, status: "processing" }),
    ).rejects.toThrow("PaymentIntent metadata is incomplete");
    expect(mocks.findReservation).not.toHaveBeenCalled();
    expect(mocks.fulfillReservedOrder).not.toHaveBeenCalled();
  });

  it("rejects an intent whose reservation no longer exists", async () => {
    mocks.findReservation.mockResolvedValue(null);

    await expect(fulfillPaymentIntent(paymentIntent)).rejects.toThrow(
      "PaymentIntent does not match its checkout reservation",
    );
    expect(mocks.fulfillReservedOrder).not.toHaveBeenCalled();
  });
});
