import { describe, expect, it } from "vitest";
import { OrderStatus } from "../../enums/order_status.ts";
import { canOrderTransition } from "./order.service.ts";

describe("canOrderTransition", () => {
  it.each([
    [OrderStatus.PENDING, OrderStatus.PAID],
    [OrderStatus.PAID, OrderStatus.PROCESSING],
    [OrderStatus.PROCESSING, OrderStatus.SHIPPED],
    [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
  ])("allows %s to advance to %s", (current, next) => {
    expect(canOrderTransition(current, next)).toBe(true);
  });

  it.each([
    [OrderStatus.DELIVERED, OrderStatus.PROCESSING],
    [OrderStatus.CANCELLED, OrderStatus.PAID],
    [OrderStatus.REFUNDED, OrderStatus.PROCESSING],
    [OrderStatus.PAID, OrderStatus.SHIPPED],
  ])("rejects %s transitioning to %s", (current, next) => {
    expect(canOrderTransition(current, next)).toBe(false);
  });
});
